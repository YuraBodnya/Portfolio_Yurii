const swiperAbout = new Swiper('.about-us__swiper', {
   // Optional parameters
  loop: true,
 
   // If we need pagination
  pagination: {
     el: '.swiper-pagination.about-us',
  },
  
  autoplay: {
    delay: 3000,
  },
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    560: {
      slidesPerView: 1,
      spaceBetween: 0,
    },

  },
});
const swiperTeamSays = new Swiper('.team-says__swiper', {
   // Optional parameters
   loop: true,
 
   // If we need pagination
   pagination: {
     el: '.swiper-pagination.team-says__pagination',
  },
   // Navigation arrows
  navigation: {
    nextEl: '.team-says__buttons-slider .swiper-button-next',
    prevEl: '.team-says__buttons-slider .swiper-button-prev',
  },
  //  autoplay: {
  //   delay: 5000,
  // },
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    560: {
      slidesPerView: 1,
      spaceBetween: 30,
    },

  },
});
AOS.init();

const controlHovMenu = document.querySelectorAll('.services__more');
const controlCloseMenu = document.querySelectorAll('.services__close-icon');
controlHovMenu.forEach(item => {
  item.addEventListener('click', openCloseMenu);
});
controlCloseMenu.forEach(item => {
  item.addEventListener('click', openCloseMenu);
});

function openCloseMenu() {
  if (this) {
    this.closest('.services__item-block').classList.toggle('_active');
  }
}

// LAZY===================
const lazyImages = document.querySelectorAll('img[data-src]');
const windowHeight = document.documentElement.clientHeight + 400;
let lazyImagesPositions = [];
window.addEventListener('load', showSliders);
window.addEventListener('scroll', lazyScroll);
function showSliders() {
  // sliderTeam.style.opacity = 1;
  // headerCard.style.opacity = 1;
}
function lazyScroll() {
  if (document.querySelectorAll('img[data-src]').length > 0) {
     lazyScrollCheck();
  }
}

if (lazyImages.length > 0) {
  lazyImages.forEach(img => {
     if (img.dataset.src) {
        lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset - 500);
        img.style.opacity = 0;
        img.setAttribute('onload', 'showImgOpacity(this);');

        lazyScrollCheck();
     }
  });
}

function lazyScrollCheck() {
  let imgIndex = lazyImagesPositions.findIndex(
     item => pageYOffset > item - windowHeight
  );
  if (imgIndex >= 0) {
     if (lazyImages[imgIndex].dataset.src) {
        lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
        lazyImages[imgIndex].removeAttribute('data-src');
     }
     delete lazyImagesPositions[imgIndex];
  }
}

function showImgOpacity(obj) {
  obj.style.opacity = 1;
}


// BURGER==============
const burger = document.querySelector('.logo-menu__burger');
const mobMenuClose = document.querySelector('.mob-menu > a');
const mobMenu = document.querySelector('.mob-menu');
burger.addEventListener('click', openCloseMobMenu);
mobMenuClose.addEventListener('click', openCloseMobMenu);

function openCloseMobMenu() {
  burger.classList.toggle('_active');
  mobMenu.classList.toggle('_active');
}