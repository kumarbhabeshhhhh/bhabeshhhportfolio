(() => {
  const nav = document.querySelector('nav');
  const menu = document.querySelector('.menu');
  const links = document.querySelectorAll('nav a');

  menu?.addEventListener('click', () => {
    nav?.classList.toggle('open');
    menu.setAttribute('aria-expanded', nav?.classList.contains('open') ? 'true' : 'false');
  });
  links.forEach(link => link.addEventListener('click', () => nav?.classList.remove('open')));

  // Scroll progress indicator.
  const progress = document.querySelector('.scroll-progress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Reveal animations.
  const reveal = document.querySelectorAll('.section, .contact, .work, .item, .edu, .achievements p');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveal.forEach(el => el.classList.add('reveal'));
  reveal.forEach(el => observer.observe(el));

  // Active section indicator.
  const sections = document.querySelectorAll('main section[id]');
  const navMap = [...links].filter(a => a.getAttribute('href')?.startsWith('#'));
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navMap.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));

  // Pointer-follow ambient glow.
  const glow = document.createElement('div');
  glow.className = 'pointer-glow';
  document.body.appendChild(glow);
  if (window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      glow.style.transform = `translate3d(${e.clientX - 150}px, ${e.clientY - 150}px, 0)`;
    }, { passive: true });
  }

  // Cursor spotlight + magnetic micro-interactions.
  document.querySelectorAll('.work, .item, .edu, .chips span').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      if (el.classList.contains('work') || el.classList.contains('item') || el.classList.contains('edu')) {
        el.style.setProperty('--rx', `${(-y * 1.8).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(x * 1.8).toFixed(2)}deg`);
      }
    });
    el.addEventListener('pointerleave', () => {
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    });
  });

  // Magnetic buttons.
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.resume, .email, .social-link, .text-link').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.12;
        const y = (e.clientY - r.top - r.height / 2) * 0.12;
        el.style.setProperty('--tx', `${x}px`);
        el.style.setProperty('--ty', `${y}px`);
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--tx', '0px');
        el.style.setProperty('--ty', '0px');
      });
    });
  }

  // Hero parallax.
  const hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY * 0.12, 70);
      hero.style.setProperty('--hero-shift', `${y}px`);
    }, { passive: true });
  }
})();
