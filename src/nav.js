// dot-nav: click to scroll, highlight whichever section is in view
import { scrollToElement } from './smooth-scroll.js';

const SECTION_IDS = ['hero', 's1', 's2', 's3', 's4', 's5', 's6'];

export function initNav() {
  const dots = document.querySelectorAll('.nav-dot');
  if (!dots.length) return;

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = document.querySelector(`#${dot.dataset.target}`);
      if (target) scrollToElement(target);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        dots.forEach((dot) => dot.classList.toggle('active', dot.dataset.target === entry.target.id));
      });
    },
    { threshold: 0, rootMargin: '-50% 0px -50% 0px' }
  );

  SECTION_IDS.forEach((id) => {
    const section = document.querySelector(`#${id}`);
    if (section) observer.observe(section);
  });
}
