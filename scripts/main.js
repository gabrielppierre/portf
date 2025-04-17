import { initializeAll } from './script.js';
import { initProjectsSwiper } from './swiper-init.js';

// Função para carregar seções HTML
async function loadHTML(id, file) {
    try {
        const response = await fetch(`partials/${file}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = html;
            console.log(`Successfully loaded ${file} into #${id}`);
            return element; // Retorna o elemento para possível uso posterior
        } else {
            console.warn(`Element with id '${id}' not found.`);
            return null;
        }
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
        return null;
    }
}

// Função principal de inicialização
async function initialize() {
    console.log("Initializing application...");
    try {
        // Carregar seções HTML e aguardar a conclusão
        const loadedElements = await Promise.all([
            loadHTML('header', 'header.html'),
            loadHTML('hero', 'hero.html'),
            loadHTML('skills', 'skills.html'),
            loadHTML('projects', 'projects.html'),
            loadHTML('testimonial', 'testimonial.html'),
            loadHTML('footer', 'footer.html')
        ]);

        console.log("All HTML sections loaded.");

        // Filtrar elementos que não foram carregados (retornaram null)
        const successfulLoads = loadedElements.filter(el => el !== null);

        // Verificar se todos os carregamentos essenciais foram bem-sucedidos
        if (successfulLoads.length === loadedElements.length) {
            console.log("All essential sections loaded successfully. Initializing scripts...");
            // Inicializar scripts gerais e específicos APÓS o carregamento do HTML
            initializeAll(); // Chama scripts de script.js (header, swiper, etc.)

            // Inicializa o Swiper de projetos
            setTimeout(() => {
                initProjectsSwiper();
            }, 300);
        } else {
            console.error("Failed to load one or more essential HTML sections. Aborting script initialization.");
        }

    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    // Se o DOM já estiver pronto, mas talvez o script tenha sido carregado depois
    initialize();
} 