// dot-nav: click to scroll, highlight whichever section is in view
const SECTION_IDS = ['hero', 's1', 's2', 's3', 's4', 's5', 's6'];

export function initNav() {
  const dots = document.querySelectorAll('.nav-dot');
  if (!dots.length) return;

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      document.querySelector(`#${dot.dataset.target}`)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        dots.forEach((dot) => dot.classList.toggle('active', dot.dataset.target === entry.target.id));
      });
    },
    { threshold: 0.5 }
  );

  SECTION_IDS.forEach((id) => {
    const section = document.querySelector(`#${id}`);
    if (section) observer.observe(section);
  });
}
