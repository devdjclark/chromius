// momentum scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync;
// skipped entirely when the user prefers reduced motion
import 'lenis/dist/lenis.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export let lenis = null;

export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// nav and other in-page jumps go through Lenis when it is running
export function scrollToElement(el) {
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ behavior: 'smooth' });
}
