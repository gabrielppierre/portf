function initMainScript() {
    console.log("Inicializando scripts principais");

    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 
                menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
            });
        });
    }

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

function initSkillsAnimation() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) {
        console.warn("Skills section not found for animation initialization.");
        return;
    }

    const categories = skillsSection.querySelectorAll('.skill-category');
    const skillItems = skillsSection.querySelectorAll('.skill-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const categoryObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const itemObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const overallIndex = Array.from(skillItems).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, overallIndex * 50);
                observer.unobserve(entry.target);
            }
        });
    }, { ...observerOptions, threshold: 0.05 });

    categories.forEach(category => {
        categoryObserver.observe(category);
    });

    skillItems.forEach(item => {
        itemObserver.observe(item);
    });

    console.log("Skills animation observer initialized.");
}

function initSkillsProjectFilter() {
    const skillsListItems = document.querySelectorAll('#skills .skill-item');
    const filterStatusTextContainer = document.getElementById('active-filter-text');
    const showAllButton = document.getElementById('show-all-projects');
    const projectsSection = document.getElementById('projects');
    const projectsSwiperContainer = document.querySelector('.projects-swiper');
    const filterStatusContainer = document.getElementById('project-filter-status');
    const activeFilterLabel = document.getElementById('active-filter-label');

    if (!skillsListItems.length || !projectsSwiperContainer || !filterStatusTextContainer || !showAllButton || !projectsSection || !filterStatusContainer || !activeFilterLabel) {
        console.warn("Missing elements for Skills -> Projects filter functionality.");
        return;
    }

    const originalSlides = Array.from(projectsSwiperContainer.querySelectorAll('.swiper-slide'));
    if (originalSlides.length === 0) {
        console.warn("No original project slides found to filter.");
        return;
    }

    let activeFilters = [];
    let initialLoopState = null;

    function updateFilteredProjects() {
        const projectsSwiperInstance = projectsSwiperContainer.swiper;
        if (!projectsSwiperInstance) {
            console.error("Project Swiper instance not available for filtering.");
            return;
        }

        if (initialLoopState === null && projectsSwiperInstance.params) {
            initialLoopState = projectsSwiperInstance.params.loop;
        }

        console.log(`Updating projects based on filters: ${activeFilters.join(', ')}`);
        projectsSwiperInstance.el.style.transition = 'opacity 0.3s ease';
        projectsSwiperInstance.el.style.opacity = '0';

        updateFilterStatusUI();

        setTimeout(() => {
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
                slidesToDisplay = originalSlides;
            } else {
                slidesToDisplay = originalSlides.filter(slide => {
                    const card = slide.querySelector('.project-card');
                    if (!card) return false;
                    const cardSkills = card.dataset.skills ? card.dataset.skills.split(' ') : [];
                    return activeFilters.every(filter => cardSkills.includes(filter));
                });
            }

            if (slidesToDisplay.length > 0) {
                projectsSwiperInstance.appendSlide(slidesToDisplay);
            } else {
                if(activeFilters.length > 0) {
                    const activeFilterNames = activeFilters.map(filter => {
                        const skillItem = document.querySelector(`.skill-item[data-filter="${filter}"]`);
                        return skillItem ? skillItem.querySelector('.skill-name').textContent : filter;
                    }).join(' + ');

                    const noResultsHTML = `
                        <div class="swiper-slide no-results-slide">
                            <div class="no-results-content">
                                <i class="fas fa-search-minus no-results-icon"></i> 
                                <h3>No Projects Found</h3>
                                <p>Couldn't find projects using <strong>${activeFilterNames}</strong>.</p>
                                <p class="suggestion">Try removing filters or selecting other technologies.</p>
                            </div>
                        </div>`;
                    projectsSwiperInstance.appendSlide(noResultsHTML);
                } else {
                    const noProjectsHTML = `
                        <div class="swiper-slide no-results-slide">
                             <div class="no-results-content">
                                <i class="fas fa-folder-open no-results-icon"></i>
                                <h3>No Projects to Show</h3>
                                <p>I haven't added any projects here yet. Check back soon!</p>
                            </div>
                        </div>`;
                    projectsSwiperInstance.appendSlide(noProjectsHTML);
                }
            }

            const canLoop = slidesToDisplay.length >= (projectsSwiperInstance.params.slidesPerView || 1) + (projectsSwiperInstance.params.slidesPerGroup || 1);
            if (projectsSwiperInstance.params.loop) {
                try { projectsSwiperInstance.loopDestroy(); } catch (e) {}
                projectsSwiperInstance.params.loop = false;
            }

            if (initialLoopState === true && canLoop) {
                projectsSwiperInstance.params.loop = true;
                try {
                    projectsSwiperInstance.loopCreate();
                } catch(e) {
                    console.warn("Error recreating loop:", e);
                    projectsSwiperInstance.params.loop = false;
                }
            }

            projectsSwiperInstance.update();
            projectsSwiperInstance.slideTo(0, 0);
            projectsSwiperInstance.el.style.opacity = '1';

        }, 300);
    }

    function updateFilterStatusUI() {
        filterStatusTextContainer.innerHTML = '';
        if (activeFilters.length > 0) {
            activeFilters.forEach(filter => {
                const skillItem = document.querySelector(`.skill-item[data-filter="${filter}"]`);
                const skillName = skillItem ? skillItem.querySelector('.skill-name').textContent : filter;

                const tagContainer = document.createElement('div');
                tagContainer.classList.add('filter-tag');

                const tagElement = document.createElement('strong');
                tagElement.textContent = skillName;

                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '&times;';
                removeBtn.classList.add('remove-filter-btn');
                removeBtn.setAttribute('aria-label', `Remove filter: ${skillName}`);
                removeBtn.dataset.filterRemove = filter;

                tagContainer.appendChild(tagElement);
                tagContainer.appendChild(removeBtn);
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

    function removeFilter(filterToRemove) {
        const index = activeFilters.indexOf(filterToRemove);
        if (index > -1) {
            activeFilters.splice(index, 1);
            const skillItem = document.querySelector(`.skill-item[data-filter="${filterToRemove}"]`);
            if (skillItem) {
                skillItem.classList.remove('active-filter');
            }
            updateFilteredProjects();
        }
    }

    function clearAllFilters() {
        activeFilters = [];
        skillsListItems.forEach(item => item.classList.remove('active-filter'));
        updateFilteredProjects();
    }

    skillsListItems.forEach(item => {
        const filterValue = item.dataset.filter;
        const skillName = item.querySelector('.skill-name')?.textContent || filterValue;

        item.addEventListener('click', () => {
            if (!filterValue) return;

            const index = activeFilters.indexOf(filterValue);
            if (index > -1) {
                activeFilters.splice(index, 1);
                item.classList.remove('active-filter');
            } else {
                activeFilters.push(filterValue);
                item.classList.add('active-filter');
            }

            if(activeFilters.length === 1 && index === -1) {
                projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            updateFilteredProjects();
        });

        item.addEventListener('mouseenter', () => {
            item.setAttribute('data-tooltip', `Filter by: ${skillName}`);
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!filterValue) return;
                item.click();
            }
        });
    });

    showAllButton.addEventListener('click', clearAllFilters);

    filterStatusTextContainer.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('remove-filter-btn')) {
            const filterToRemove = event.target.dataset.filterRemove;
            if (filterToRemove) {
                removeFilter(filterToRemove);
            }
        }
    });

    console.log("Skills -> Projects filter initialized with multi-select and remove tags.");
    filterStatusContainer.classList.remove('visible');
    activeFilterLabel.style.display = 'none';
}

export function initializeAll() {
    initMainScript();
    initSkillsAnimation();
    initSkillsProjectFilter();
}