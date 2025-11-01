import { initHeaderInteractions, initTestimonialCarousel } from './modules/header-interactions.js';
import { initSkillsAnimation } from './modules/skills-animation.js';
import { renderProjectSlides } from './modules/project-gallery.js';
import { projects } from './data/projects.js';

export function initializeAll() {
  initHeaderInteractions();
  initTestimonialCarousel();
  initSkillsAnimation();
  const slidesData = renderProjectSlides(projects);
  return { slidesData };
}

export { initProjectFilter } from './modules/project-filter.js';