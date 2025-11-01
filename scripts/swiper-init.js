export function initProjectsSwiper(selector = '.projects-swiper') {
    const swiperElement = document.querySelector(selector);
    if (!swiperElement) {
        console.warn('Projects swiper element not found.');
        return null;
    }

    if (swiperElement.swiper) {
        swiperElement.swiper.destroy(true, true);
    }

    const projectsSwiper = new Swiper(swiperElement, {
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
            prevEl: '.swiper-button-prev'
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

    window.addEventListener('resize', () => projectsSwiper.update());
    return projectsSwiper;
}