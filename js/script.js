const animItems = document.querySelectorAll('.anim-items');

const navMenu = document.querySelector('nav');



if (animItems.length > 0) {
   window.addEventListener('scroll', animOnScroll);
}

function animOnScroll() {
   if (pageYOffset > 100) {
      navMenu.classList.add('scroll-move');
   }
   else {
      if (navMenu.classList.contains('scroll-move')) {
         navMenu.classList.remove('scroll-move');
      }
   }
   animItems.forEach(element => {
      const animElementHeight = element.offsetHeight;
      const animElementOffset = offset(element).top;
      const animStart = 4;

      let animItemPoint = window.innerHeight - animElementHeight / animStart;

      if (animElementHeight > window.innerHeight) {
         animItemPoint = window.innerHeight - window.innerHeight / animStart;
      }

      if ((pageYOffset > animElementOffset - animItemPoint) && pageYOffset < (animElementOffset + animElementHeight)) {
         element.classList.add('_active');
      }
      else {
         if (!element.classList.contains('anim-no-hide')) {
            element.classList.remove('_active');
         }
         
      }
   });
}

function offset(el) {
   const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
   return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

setTimeout(() => {
   animOnScroll();
}, 300);

const swiper = new Swiper('.swiper', {
   loop: true,
   spaceBetween: 50,
   // If we need pagination
   pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
   },
   grabCursor: true,
 
   // Navigation arrows
   navigation: {
     nextEl: '.swiper-button-next',
     prevEl: '.swiper-button-prev',
   },

 });
