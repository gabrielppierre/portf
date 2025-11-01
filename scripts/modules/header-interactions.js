function toggleScrollClass(header) {
  if (!header) return;
  const scrolledClass = 'scrolled';
  if (window.scrollY > 50) {
    header.classList.add(scrolledClass);
  } else {
    header.classList.remove(scrolledClass);
  }
}

export function initHeaderInteractions() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!header) {
    console.warn('Header element not found.');
    return;
  }

  toggleScrollClass(header);
  window.addEventListener('scroll', () => toggleScrollClass(header));

  if (!menuToggle || !navLinks) {
    return;
  }

  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
    });
  });
}

export function initTestimonialCarousel() {
  const selector = '.testimonial-swiper';
  const element = document.querySelector(selector);

  if (!element) {
    console.warn('Testimonial swiper element not found.');
    return;
  }

  if (element.swiper) {
    element.swiper.destroy(true, true);
  }

  element.swiper = new Swiper(selector, {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });
}
