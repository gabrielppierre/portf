function createMediaMarkup({ mediaType, mediaSrc, mediaAlt }) {
  if (mediaType === 'video') {
    return `
      <video width="100%" height="100%" autoplay loop muted playsinline style="object-fit: cover;">
        <source src="${mediaSrc}" type="video/mp4">
      </video>
    `;
  }

  return `<img src="${mediaSrc}" alt="${mediaAlt}">`;
}

function createTagsMarkup(tags = []) {
  return tags
    .map(tag => `<span class="tag">${tag}</span>`)
    .join('');
}

function createLinksMarkup(links = []) {
  return links
    .map(({ label, url, isExternal }) => {
      const rel = isExternal ? 'rel="noopener noreferrer"' : '';
      const target = isExternal ? 'target="_blank"' : '';
      return `<a href="${url}" ${target} ${rel} class="project-link">${label}</a>`;
    })
    .join('');
}

function createProjectSlideMarkup(project) {
  const filtersAttribute = project.filters.join(' ');
  const tagsMarkup = createTagsMarkup(project.tags);
  const linksMarkup = createLinksMarkup(project.links);
  const mediaMarkup = createMediaMarkup(project);
  const linksSection = linksMarkup
    ? `<div class="project-links">${linksMarkup}</div>`
    : '';

  return `
    <div class="swiper-slide">
      <div class="project-card" data-skills="${filtersAttribute}">
        <div class="project-image">
          ${mediaMarkup}
        </div>
        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tags">${tagsMarkup}</div>
          ${linksSection}
        </div>
      </div>
    </div>
  `;
}

export function renderProjectSlides(projects = []) {
  const swiperWrapper = document.querySelector('.projects-swiper .swiper-wrapper');

  if (!swiperWrapper) {
    console.warn('Projects swiper wrapper not found.');
    return [];
  }

  swiperWrapper.innerHTML = '';

  const slidesData = projects.map(project => ({
    filters: project.filters,
    markup: createProjectSlideMarkup(project)
  }));

  const slidesMarkup = slidesData.map(slide => slide.markup).join('');
  swiperWrapper.insertAdjacentHTML('beforeend', slidesMarkup);

  return slidesData;
}
