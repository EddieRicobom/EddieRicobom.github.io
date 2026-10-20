(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const filters = [...document.querySelectorAll('.skill-filter')];
  const skills = [...document.querySelectorAll('.skill-item')];

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      filters.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle('is-active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      skills.forEach((skill) => {
        skill.hidden = category !== 'all' && skill.dataset.category !== category;
      });
    });
  });

  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const navTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const current = link.hash === `#${entry.target.id}`;
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
          link.classList.toggle('is-current', current);
        });
      });
    }, { rootMargin: '-24% 0px -64% 0px' });
    navTargets.forEach((target) => navObserver.observe(target));

    if (!reducedMotion) {
      document.documentElement.classList.add('js-ready');
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));
    }
  }
})();
