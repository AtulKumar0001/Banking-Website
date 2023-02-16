'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content ');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// Event delegation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const swipe = e.target.getAttribute('href');
    document.querySelector(swipe).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Fade
const hoverhandle = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    console.log(sibblings);
    sibblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', hoverhandle.bind(0.5));
nav.addEventListener('mouseout', hoverhandle.bind(1));

// Sticky Nav
const navHeight = nav.getBoundingClientRect().height;
const sticky = function (entries) {
  const [entry] = entries;
  entry.isIntersecting
    ? nav.classList.remove('sticky')
    : nav.classList.add('sticky');
};

const headerObserver = new IntersectionObserver(sticky, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Section Reveal
const sections = document.querySelectorAll('.section');
const reveal = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observe.unobserve(entry.target);
};
const sectionReveal = new IntersectionObserver(reveal, {
  root: null,
  threshold: 0.15,
});
sections.forEach(section => {
  sectionReveal.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy load img
const images = document.querySelectorAll('img[data-src]');

const load = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const lazyLoad = new IntersectionObserver(load, {
  root: null,
  threshold: 0,
});
images.forEach(img => lazyLoad.observe(img));

// Slider
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');

// slider.style.transform = 'scale(0.4) translateX(-1000px)';
// slider.style.overflow = 'visible';

let currentSlide = 0;
const maxSlide = slides.length;

const changeSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

// Next slide
const next = function () {
  if (currentSlide < maxSlide - 1) {
    currentSlide++;
  } else {
    currentSlide = 0;
  }
  changeSlide(currentSlide);
  activateDots(currentSlide);
};

btnRight.addEventListener('click', next);

// Left Slide
const prev = function () {
  if (currentSlide > 0) {
    currentSlide--;
  } else {
    currentSlide = slides.length - 1;
  }
  changeSlide(currentSlide);
  activateDots(currentSlide);
};
btnLeft.addEventListener('click', prev);

// keyboard Keys
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

// Dots
const dotsContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach(function (_, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class = "dots__dot" data-slide="${i}"></button>`
    );
  });
};

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const dot = e.target.dataset.slide;
    changeSlide(dot);
    activateDots(dot);
  }
});

// activate Dots
const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const intialization = function () {
  changeSlide(0);
  createDots();
  activateDots(0);
};
intialization();
