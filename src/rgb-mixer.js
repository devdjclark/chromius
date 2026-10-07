// draggable rgb: GSAP Draggable clamped to the svg, plus arrow-key nudge
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const STEP = 12;

export function initRgbMixer() {
  const svg = document.querySelector('#rgb-mixer');
  if (!svg) return;

  const { width, height } = svg.viewBox.baseVal;

  svg.querySelectorAll('.rgb-circle').forEach((circle) => {
    const r = Number(circle.getAttribute('r'));
    const cx = Number(circle.getAttribute('cx'));
    const cy = Number(circle.getAttribute('cy'));
    const bounds = {
      minX: r - cx,
      maxX: width - r - cx,
      minY: r - cy,
      maxY: height - r - cy,
    };

    Draggable.create(circle, { type: 'x,y', bounds });

    circle.addEventListener('keydown', (event) => {
      const x = gsap.getProperty(circle, 'x');
      const y = gsap.getProperty(circle, 'y');
      let nextX = x;
      let nextY = y;
      if (event.key === 'ArrowLeft') nextX -= STEP;
      else if (event.key === 'ArrowRight') nextX += STEP;
      else if (event.key === 'ArrowUp') nextY -= STEP;
      else if (event.key === 'ArrowDown') nextY += STEP;
      else return;
      event.preventDefault();
      gsap.set(circle, {
        x: Math.min(Math.max(nextX, bounds.minX), bounds.maxX),
        y: Math.min(Math.max(nextY, bounds.minY), bounds.maxY),
      });
    });
  });
}
