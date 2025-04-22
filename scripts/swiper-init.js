function initProjectsSwiper() {
    const swiperElement = document.querySelector('.projects-swiper');
    if (!swiperElement) {
        console.warn('Elemento do Swiper não encontrado. Tentando novamente em 500ms...');
        setTimeout(initProjectsSwiper, 500);
        return;
    }

    console.log('Inicializando Swiper de projetos...');
    
    const projectsSwiper = new Swiper('.projects-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 15,
                centeredSlides: true
            },
            480: {
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: true
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
                centeredSlides: false
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
                centeredSlides: false
            }
        },
        
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        
        effect: 'slide',
        speed: 600,
        
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        
        grabCursor: true,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 2
        }
    });
    
    window.addEventListener('resize', function() {
        projectsSwiper.update();
    });
    
    console.log('Swiper de projetos inicializado com sucesso!');
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initProjectsSwiper, 100);
});

export { initProjectsSwiper }; 