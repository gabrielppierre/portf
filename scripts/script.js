// Este arquivo pode ser usado para adicionar funcionalidades JavaScript adicionais
// no futuro, se necessário. 

// Função principal que inicializa todos os scripts
function initMainScript() {
    console.log("Inicializando scripts principais");
    
    // Elementos do DOM
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Evento de scroll para a navegação fixa
    window.addEventListener('scroll', handleScroll);
    
    // Verificação inicial do scroll
    handleScroll();
    
    // Função para lidar com o evento de scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Configurar evento de clique para o menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 
                menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
            navLinks.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Inicializar swiper para a seção de depoimentos
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
    
    console.log("Scripts principais inicializados com sucesso");
}

// Função para inicializar animações da seção de Skills
function initSkillsAnimation() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) {
        console.warn("Skills section not found for animation initialization.");
        return;
    }

    const categories = skillsSection.querySelectorAll('.skill-category');
    const skillItems = skillsSection.querySelectorAll('.skill-item');

    const observerOptions = {
        root: null, // Observa em relação à viewport
        rootMargin: '0px',
        threshold: 0.1 // Aciona quando 10% do elemento está visível
    };

    // Observador para as categorias
    const categoryObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Adiciona a classe 'visible' com um pequeno delay escalonado
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150); // Atraso para cada categoria
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, observerOptions);

    // Observador para os itens individuais
    const itemObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                 // Adiciona a classe 'visible' com um delay ainda menor para os itens
                 // Usa um cálculo de delay baseado no número total de itens para evitar reset
                 const overallIndex = Array.from(skillItems).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, overallIndex * 50); // Atraso menor e escalonado para cada item
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, { ...observerOptions, threshold: 0.05 }); // Threshold menor para itens

    // Inicia observando as categorias
    categories.forEach(category => {
        categoryObserver.observe(category);
    });

    // Inicia observando os itens
    // (Pode comentar esta parte se a animação por categoria for suficiente)
    skillItems.forEach(item => {
        itemObserver.observe(item);
    });

    console.log("Skills animation observer initialized.");
}

// Função para inicializar a interatividade de filtro Skills -> Projects
function initSkillsProjectFilter() {
    const skillsListItems = document.querySelectorAll('#skills .skill-item');
    const filterStatusTextContainer = document.getElementById('active-filter-text'); // Container for active filter tags
    const showAllButton = document.getElementById('show-all-projects');
    const projectsSection = document.getElementById('projects');
    const projectsSwiperContainer = document.querySelector('.projects-swiper');
    const filterStatusContainer = document.getElementById('project-filter-status');
    const activeFilterLabel = document.getElementById('active-filter-label'); // Get the label

    // Check for essential elements
    if (!skillsListItems.length || !projectsSwiperContainer || !filterStatusTextContainer || !showAllButton || !projectsSection || !filterStatusContainer || !activeFilterLabel) { 
        console.warn("Missing elements for Skills -> Projects filter functionality.");
        return;
    }
    
    const originalSlides = Array.from(projectsSwiperContainer.querySelectorAll('.swiper-slide'));
    if (originalSlides.length === 0) {
         console.warn("No original project slides found to filter.");
        return;
    }
    
    let activeFilters = []; // Array to hold active filters
    let initialLoopState = null;

    // Function to update the displayed projects based on active filters
    function updateFilteredProjects() {
        const projectsSwiperInstance = projectsSwiperContainer.swiper;
        if (!projectsSwiperInstance) {
            console.error("Project Swiper instance not available for filtering.");
            return;
        }

        // Store initial loop state if not already stored
        if (initialLoopState === null && projectsSwiperInstance.params) {
            initialLoopState = projectsSwiperInstance.params.loop;
        }

        console.log(`Updating projects based on filters: ${activeFilters.join(', ')}`);
        projectsSwiperInstance.el.style.transition = 'opacity 0.3s ease';
        projectsSwiperInstance.el.style.opacity = '0'; // Start fade-out

        // Update status text and button visibility
        updateFilterStatusUI();

        setTimeout(() => {
            // Temporarily disable loop if active
            if (projectsSwiperInstance.params.loop) {
                try {
                    projectsSwiperInstance.loopDestroy();
                } catch (e) {
                    console.warn("Error destroying loop:", e);
                }
                projectsSwiperInstance.params.loop = false; 
            }
            
            projectsSwiperInstance.removeAllSlides();

            let slidesToDisplay;
            if (activeFilters.length === 0) {
                // No filters active, show all original slides
                slidesToDisplay = originalSlides;
            } else {
                // Filter original slides: must contain ALL active filters
                slidesToDisplay = originalSlides.filter(slide => {
                    const card = slide.querySelector('.project-card');
                    if (!card) return false;
                    const cardSkills = card.dataset.skills ? card.dataset.skills.split(' ') : [];
                    // Check if *all* active filters are present in cardSkills
                    return activeFilters.every(filter => cardSkills.includes(filter));
                });
            }

            // Append the filtered slides
            if (slidesToDisplay.length > 0) {
                projectsSwiperInstance.appendSlide(slidesToDisplay);
            } else {
                 // Handle no results found - Append a message only if filters are active
                 if(activeFilters.length > 0) {
                    const noResultsHTML = `<div class="swiper-slide no-results-slide"><p>Nenhum projeto encontrado com <strong>${activeFilters.join(' + ')}</strong>.</p></div>`;
                    projectsSwiperInstance.appendSlide(noResultsHTML);
                 } else {
                     // This case (no filters, no original slides) should be caught earlier, but as a fallback:
                     projectsSwiperInstance.appendSlide('<div class="swiper-slide no-results-slide"><p>Nenhum projeto para mostrar.</p></div>');
                 }
            }

            // Restore loop only if it was initially active and we have slides that can form a loop
            const canLoop = slidesToDisplay.length >= (projectsSwiperInstance.params.slidesPerView || 1) + (projectsSwiperInstance.params.slidesPerGroup || 1);
            // Ensure loop is disabled before potentially recreating it
             if (projectsSwiperInstance.params.loop) {
                 try { projectsSwiperInstance.loopDestroy(); } catch (e) { /* ignore */ }
                 projectsSwiperInstance.params.loop = false; 
             }

            if (initialLoopState === true && canLoop) {
                projectsSwiperInstance.params.loop = true;
                try {
                    projectsSwiperInstance.loopCreate();
                } catch(e) {
                     console.warn("Error recreating loop:", e);
                     projectsSwiperInstance.params.loop = false; // Disable again if creation fails
                }
            } 
            // No need for explicit else here as loop was disabled above

            projectsSwiperInstance.update();
            projectsSwiperInstance.slideTo(0, 0);

            // Fade back in
            projectsSwiperInstance.el.style.opacity = '1';

        }, 300); 
    }

    // Function to update the filter status UI (tags and button)
    function updateFilterStatusUI() {
        filterStatusTextContainer.innerHTML = ''; // Clear previous tags
        if (activeFilters.length > 0) {
            activeFilters.forEach(filter => {
                const skillItem = document.querySelector(`.skill-item[data-filter="${filter}"]`);
                const skillName = skillItem ? skillItem.querySelector('.skill-name').textContent : filter;
                
                // Create a container for the tag and its remove button
                const tagContainer = document.createElement('div');
                tagContainer.classList.add('filter-tag');

                // Create the tag element (strong)
                const tagElement = document.createElement('strong');
                tagElement.textContent = skillName;
                
                // Create the remove button (X)
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '&times;'; // Use HTML entity for X
                removeBtn.classList.add('remove-filter-btn');
                removeBtn.setAttribute('aria-label', `Remover filtro: ${skillName}`);
                removeBtn.dataset.filterRemove = filter; // Store filter value to remove

                // Append tag and button to the container
                tagContainer.appendChild(tagElement);
                tagContainer.appendChild(removeBtn);

                // Append the container to the main status text area
                filterStatusTextContainer.appendChild(tagContainer);
            });
            showAllButton.style.display = 'inline-flex';
            filterStatusContainer.classList.add('visible');
            activeFilterLabel.style.display = 'inline';
        } else {
            showAllButton.style.display = 'none';
            filterStatusContainer.classList.remove('visible');
            activeFilterLabel.style.display = 'none';
        }
    }

    // Function to remove a specific filter
    function removeFilter(filterToRemove) {
        const index = activeFilters.indexOf(filterToRemove);
        if (index > -1) {
            activeFilters.splice(index, 1); // Remove from array

            // Find corresponding skill item and remove active class
            const skillItem = document.querySelector(`.skill-item[data-filter="${filterToRemove}"]`);
            if (skillItem) {
                skillItem.classList.remove('active-filter');
            }
            
            updateFilteredProjects(); // Update projects and UI
        }
    }

    // Function to clear all filters
    function clearAllFilters() {
        activeFilters = []; // Clear the active filters array
        skillsListItems.forEach(item => item.classList.remove('active-filter')); // Remove visual highlight
        updateFilteredProjects(); // Update the swiper to show all projects
    }

    // Add event listener for each skill item (toggle behavior)
    skillsListItems.forEach(item => {
        const filterValue = item.dataset.filter;
        const skillName = item.querySelector('.skill-name')?.textContent || filterValue;

        item.addEventListener('click', () => {
            if (!filterValue) return;

            // Toggle the filter
            const index = activeFilters.indexOf(filterValue);
            if (index > -1) {
                // Filter is active, remove it
                activeFilters.splice(index, 1);
                item.classList.remove('active-filter');
            } else {
                // Filter is not active, add it
                activeFilters.push(filterValue);
                item.classList.add('active-filter');
            }

            // Rola suavemente para a seção de projetos se adicionando o primeiro filtro
            if(activeFilters.length === 1 && index === -1) { // Scroll only when adding the *first* filter
                 projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
           
            updateFilteredProjects(); // Update display based on the new set of filters
        });

        // Add Custom Tooltip Attribute on Hover
        item.addEventListener('mouseenter', () => {
            item.setAttribute('data-tooltip', `Filtrar por: ${skillName}`);
        });

        // Allow activation with Enter key (Accessibility)
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                 if (!filterValue) return;
                 // Simulate a click to trigger the toggle logic
                 item.click(); 
            }
        });
    });

    // Add event listener for the "Clear Filter" button
    showAllButton.addEventListener('click', clearAllFilters);

    // Add delegated event listener for remove buttons within the status container
    filterStatusTextContainer.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('remove-filter-btn')) {
            const filterToRemove = event.target.dataset.filterRemove;
            if (filterToRemove) {
                removeFilter(filterToRemove);
            }
        }
    });

    console.log("Skills -> Projects filter initialized with multi-select and remove tags.");
    // Initially hide the filter status bar as no filters are active
    filterStatusContainer.classList.remove('visible');
    activeFilterLabel.style.display = 'none'; 
}

// Exporta as funções para serem usadas em main.js
export function initializeAll() {
    initMainScript();
    initSkillsAnimation(); 
    initSkillsProjectFilter(); // Inicializa a nova função de filtro
}

// A chamada initializeAll agora é feita DENTRO de main.js APÓS o Promise.all
// document.addEventListener('DOMContentLoaded', () => {
//     setTimeout(initializeAll, 100);
// }); 