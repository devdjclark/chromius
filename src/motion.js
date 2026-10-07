// scroll motion: fade section content up once on entry; off if reduced-motion is set
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  document.querySelectorAll('.section-pad').forEach((main) => {
    gsap.from(main.children, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: { trigger: main, start: 'top 80%', once: true },
    });
  });
}
