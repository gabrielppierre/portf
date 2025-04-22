export function initSkillsSection() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) {
        console.error("Skills section not found.");
        return;
    }

    const skillsToggle = document.getElementById('skills-toggle');
    const skillsContent = document.getElementById('skills-content');
    const skillsSummary = document.getElementById('skills-summary');
    const searchInput = document.getElementById('skill-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillItems = document.querySelectorAll('.skill-item');

    if (!skillsToggle || !skillsContent || !skillsSummary || !searchInput || !filterButtons.length || !skillItems.length) {
        console.error("Essential skills section elements not found.");
        return;
    }

    const savedState = localStorage.getItem('skillsSectionState');
    if (savedState === 'collapsed') {
        toggleSection(true);
    }

    function toggleSection(isCollapsed) {
        skillsContent.classList.toggle('collapsed', isCollapsed);
        skillsToggle.classList.toggle('collapsed', isCollapsed);
        skillsSummary.classList.toggle('visible', isCollapsed);
        
        skillsToggle.setAttribute('aria-expanded', !isCollapsed);
        skillsSummary.setAttribute('aria-hidden', !isCollapsed);
        
        const tooltipText = isCollapsed ? 'Clique para expandir' : 'Clique para recolher';
        skillsToggle.querySelector('.toggle-tooltip').textContent = tooltipText;
        
        localStorage.setItem('skillsSectionState', isCollapsed ? 'collapsed' : 'expanded');
        
        if (!isCollapsed) {
            setTimeout(() => {
                setupProgressBars(true);
                setTimeout(() => animateProgressBars(), 300);
            }, 400);
        }
    }

    skillsToggle.addEventListener('click', () => {
        toggleSection(!skillsContent.classList.contains('collapsed'));
    });

    function setupProgressBars(forceReset = false) {
        const progressBars = document.querySelectorAll('.skill-category:not(.hidden) .skill-progress');
        progressBars.forEach(bar => {
            if (forceReset) {
                const percent = bar.closest('.skill-level').querySelector('.skill-percent').textContent;
                bar.style.width = '0';
                bar.dataset.targetWidth = percent;
            }
        });
    }

    function animateProgressBars() {
        const visibleBars = document.querySelectorAll('.skill-category:not(.hidden) .skill-progress');
        visibleBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = bar.dataset.targetWidth;
            }, 100 + (index * 50));
        });
    }

    let currentFilter = 'all';
    let currentSearch = '';

    function filterSkills() {
        skillItems.forEach(item => {
            const category = item.dataset.category;
            const skillName = item.querySelector('.skill-name').textContent.toLowerCase();
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            const matchesSearch = skillName.includes(currentSearch.toLowerCase());
            
            item.classList.toggle('hidden', !(matchesFilter && matchesSearch));
        });

        document.querySelectorAll('.skill-category').forEach(category => {
            const hasVisibleItems = Array.from(category.querySelectorAll('.skill-item'))
                .some(item => !item.classList.contains('hidden'));
            category.classList.toggle('hidden', !hasVisibleItems);
        });

        setupProgressBars(true);
        setTimeout(animateProgressBars, 100);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            
            currentFilter = button.dataset.filter;
            filterSkills();
        });
    });

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearch = e.target.value;
            filterSkills();
        }, 300);
    });

    setupProgressBars(true);
    setTimeout(animateProgressBars, 500);
} 