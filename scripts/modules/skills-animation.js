export function initSkillsAnimation() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) {
    console.warn('Skills section not found for animation initialization.');
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
      if (!entry.isIntersecting) return;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 150);
      observer.unobserve(entry.target);
    });
  }, observerOptions);

  const itemObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const overallIndex = Array.from(skillItems).indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, overallIndex * 50);
      observer.unobserve(entry.target);
    });
  }, { ...observerOptions, threshold: 0.05 });

  categories.forEach(category => categoryObserver.observe(category));
  skillItems.forEach(item => itemObserver.observe(item));
}
