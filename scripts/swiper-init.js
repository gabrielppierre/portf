// Inicialização do Swiper para a seção de projetos
function initProjectsSwiper() {
    // Verifica se o elemento existe antes de inicializar
    const swiperElement = document.querySelector('.projects-swiper');
    if (!swiperElement) {
        console.warn('Elemento do Swiper não encontrado. Tentando novamente em 500ms...');
        setTimeout(initProjectsSwiper, 500);
        return;
    }

    console.log('Inicializando Swiper de projetos...');
    
    const projectsSwiper = new Swiper('.projects-swiper', {
        // Configurações básicas
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        centerInsufficientSlides: true,
        
        // Configurações de responsividade
        breakpoints: {
            // Smartphones pequenos (até 480px)
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            // Smartphones (481px - 640px)
            481: {
                slidesPerView: 1,
                spaceBetween: 15
            },
            // Tablets pequenos (641px - 768px)
            641: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            // Tablets (769px - 1024px)
            769: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            // Desktops (1025px+)
            1025: {
                slidesPerView: 3,
                spaceBetween: 40
            }
        },
        
        // Navegação
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Paginação
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // Autoplay
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        
        // Efeitos
        effect: 'slide',
        speed: 800,
        
        // Acessibilidade
        a11y: {
            prevSlideMessage: 'Slide anterior',
            nextSlideMessage: 'Próximo slide',
            paginationBulletMessage: 'Ir para o slide {{index}}',
        },
        
        // Otimizações para dispositivos móveis
        grabCursor: true,
        touchRatio: 1.5,
        touchAngle: 45,
        
        // Prevenir problemas de layout em dispositivos móveis
        watchOverflow: true,
        observer: true,
        observeParents: true
    });
    
    // Adiciona listener para redimensionamento da janela
    window.addEventListener('resize', function() {
        projectsSwiper.update();
    });
    
    console.log('Swiper de projetos inicializado com sucesso!');
}

// Tenta inicializar o Swiper quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Pequeno atraso para garantir que todos os elementos HTML foram carregados
    setTimeout(initProjectsSwiper, 100);
});

// Exporta a função para que possa ser chamada de outros arquivos
export { initProjectsSwiper }; 