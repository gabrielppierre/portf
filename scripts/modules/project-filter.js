function buildFilterStatusTag(filterValue) {
  const skillItem = document.querySelector(`.skill-item[data-filter="${filterValue}"]`);
  const skillName = skillItem?.querySelector('.skill-name')?.textContent || filterValue;
  return { filterValue, skillName };
}

function createNoResultsSlide(activeFilters) {
  if (!activeFilters.length) {
    return `
      <div class="swiper-slide no-results-slide">
        <div class="no-results-content">
          <i class="fas fa-folder-open no-results-icon"></i>
          <h3>Nenhum projeto disponível</h3>
          <p>Ainda não adicionei projetos aqui. Volte em breve!</p>
        </div>
      </div>
    `;
  }

  const activeNames = activeFilters
    .map(filter => buildFilterStatusTag(filter).skillName)
    .join(' + ');

  return `
    <div class="swiper-slide no-results-slide">
      <div class="no-results-content">
        <i class="fas fa-search-minus no-results-icon"></i>
        <h3>Nenhum projeto encontrado</h3>
        <p>Não encontrei projetos utilizando <strong>${activeNames}</strong>.</p>
        <p class="suggestion">Tente remover filtros ou selecionar outras tecnologias.</p>
      </div>
    </div>
  `;
}

export function initProjectFilter(swiperInstance, slidesData = []) {
  const skillsListItems = document.querySelectorAll('#skills .skill-item');
  const filterStatusTextContainer = document.getElementById('active-filter-text');
  const showAllButton = document.getElementById('show-all-projects');
  const projectsSection = document.getElementById('projects');
  const filterStatusContainer = document.getElementById('project-filter-status');
  const activeFilterLabel = document.getElementById('active-filter-label');

  if (!skillsListItems.length || !filterStatusTextContainer || !showAllButton || !projectsSection || !filterStatusContainer || !activeFilterLabel) {
    console.warn('Missing elements for Skills -> Projects filter functionality.');
    return;
  }

  if (!swiperInstance) {
    console.warn('Project Swiper instance not available for filtering.');
    return;
  }

  const baseSlides = slidesData.length
    ? slidesData.map(({ filters, markup }) => ({ filters, markup }))
    : Array.from(swiperInstance.slides)
        .filter(slide => !slide.classList.contains('swiper-slide-duplicate'))
        .map(slide => {
          const card = slide.querySelector('.project-card');
          const datasetFilters = card?.dataset.skills?.split(' ') || [];
          return { filters: datasetFilters, markup: slide.outerHTML };
        });

  let activeFilters = [];
  const originalLoopState = swiperInstance.params.loop;

  function canLoop(slideCount) {
    const perView = swiperInstance.params.slidesPerView || 1;
    const perGroup = swiperInstance.params.slidesPerGroup || 1;
    return slideCount >= perView + perGroup;
  }

  function updateFilterStatusUI() {
    filterStatusTextContainer.innerHTML = '';

    if (!activeFilters.length) {
      showAllButton.style.display = 'none';
      filterStatusContainer.classList.remove('visible');
      activeFilterLabel.style.display = 'none';
      return;
    }

    activeFilters.forEach(filterValue => {
      const { skillName } = buildFilterStatusTag(filterValue);
      const tagContainer = document.createElement('div');
      tagContainer.classList.add('filter-tag');

      const tagElement = document.createElement('strong');
      tagElement.textContent = skillName;

      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = '&times;';
      removeBtn.classList.add('remove-filter-btn');
  removeBtn.setAttribute('aria-label', `Remover filtro: ${skillName}`);
      removeBtn.dataset.filterRemove = filterValue;

      tagContainer.appendChild(tagElement);
      tagContainer.appendChild(removeBtn);
      filterStatusTextContainer.appendChild(tagContainer);
    });

    showAllButton.style.display = 'inline-flex';
    filterStatusContainer.classList.add('visible');
    activeFilterLabel.style.display = 'inline';
  }

  function applyFilters() {
    swiperInstance.el.style.transition = 'opacity 0.3s ease';
    swiperInstance.el.style.opacity = '0';
    updateFilterStatusUI();

    const matchingSlides = !activeFilters.length
      ? baseSlides
      : baseSlides.filter(slide => activeFilters.every(filter => slide.filters.includes(filter)));

    const markupToRender = matchingSlides.length
      ? matchingSlides.map(slide => slide.markup)
      : [createNoResultsSlide(activeFilters)];

    setTimeout(() => {
      if (swiperInstance.params.loop) {
        try {
          swiperInstance.loopDestroy();
        } catch (error) {
          console.warn('Error destroying loop:', error);
        }
        swiperInstance.params.loop = false;
      }

      swiperInstance.removeAllSlides();
      swiperInstance.appendSlide(markupToRender);

      if (originalLoopState && canLoop(matchingSlides.length)) {
        swiperInstance.params.loop = true;
        try {
          swiperInstance.loopCreate();
        } catch (error) {
          console.warn('Error recreating loop:', error);
          swiperInstance.params.loop = false;
        }
      }

      swiperInstance.update();
      swiperInstance.slideTo(0, 0);
      swiperInstance.el.style.opacity = '1';
    }, 300);
  }

  function removeFilter(filterToRemove) {
    const index = activeFilters.indexOf(filterToRemove);
    if (index === -1) return;
    activeFilters.splice(index, 1);
    const skillItem = document.querySelector(`.skill-item[data-filter="${filterToRemove}"]`);
    skillItem?.classList.remove('active-filter');
    applyFilters();
  }

  function clearAllFilters() {
    activeFilters = [];
    skillsListItems.forEach(item => item.classList.remove('active-filter'));
    applyFilters();
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

      if (activeFilters.length === 1 && index === -1) {
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      applyFilters();
    });

    item.addEventListener('mouseenter', () => {
  item.setAttribute('data-tooltip', `Filtrar por: ${skillName}`);
    });

    item.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      item.click();
    });
  });

  showAllButton.addEventListener('click', clearAllFilters);

  filterStatusTextContainer.addEventListener('click', event => {
    if (!event.target.classList.contains('remove-filter-btn')) return;
    const filterToRemove = event.target.dataset.filterRemove;
    if (!filterToRemove) return;
    removeFilter(filterToRemove);
  });

  filterStatusContainer.classList.remove('visible');
  activeFilterLabel.style.display = 'none';
}
