import { initializeAll, initProjectFilter } from './script.js';
import { initProjectsSwiper } from './swiper-init.js';

async function loadHTML(id, file) {
    try {
        const response = await fetch(`partials/${file}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = html;
            console.log(`Successfully loaded ${file} into #${id}`);
            return element;
        } else {
            console.warn(`Element with id '${id}' not found.`);
            return null;
        }
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
        return null;
    }
}

async function initialize() {
    console.log("Initializing application...");
    try {
        const loadedElements = await Promise.all([
            loadHTML('header', 'header.html'),
            loadHTML('hero', 'hero.html'),
            loadHTML('skills', 'skills.html'),
            loadHTML('projects', 'projects.html'),
            loadHTML('testimonial', 'testimonial.html'),
            loadHTML('publications', 'publications.html'),
            loadHTML('footer', 'footer.html')
        ]);

        console.log("All HTML sections loaded.");

        const successfulLoads = loadedElements.filter(el => el !== null);

        if (successfulLoads.length === loadedElements.length) {
            console.log("All essential sections loaded successfully. Initializing scripts...");
            const { slidesData } = initializeAll();
            const projectsSwiper = initProjectsSwiper();

            if (projectsSwiper) {
                initProjectFilter(projectsSwiper, slidesData);
            }
        } else {
            console.error("Failed to load one or more essential HTML sections. Aborting script initialization.");
        }

    } catch (error) {
        console.error('Initialization error:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
} 