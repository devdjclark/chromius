// draggable rgb: GSAP Draggable clamped to the svg, plus arrow-key nudge; letters follow their circle
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const STEP = 12;
// narrow screens crop the viewBox around the circles so they stay ~110px wide (DESIGN.md §6.1)
const VIEWBOX_WIDE = '0 0 760 244';
const VIEWBOX_NARROW = '230 0 300 244';

export function initRgbMixer() {
  const svg = document.querySelector('#rgb-mixer');
  if (!svg) return;

  const circles = [...svg.querySelectorAll('.rgb-circle')];
  const labels = [...svg.querySelectorAll('text[data-follow]')];
  const narrow = window.matchMedia('(max-width: 640px)');
  let draggables = [];

  function boundsFor(circle) {
    const { x, y, width, height } = svg.viewBox.baseVal;
    const r = Number(circle.getAttribute('r'));
    const cx = Number(circle.getAttribute('cx'));
    const cy = Number(circle.getAttribute('cy'));
    return { minX: x + r - cx, maxX: x + width - r - cx, minY: y + r - cy, maxY: y + height - r - cy };
  }

  function moveTo(i, x, y) {
    gsap.set([circles[i], labels[i]], { x, y });
  }

  function setup() {
    draggables.forEach((d) => d.kill());
    svg.setAttribute('viewBox', narrow.matches ? VIEWBOX_NARROW : VIEWBOX_WIDE);
    circles.forEach((_, i) => moveTo(i, 0, 0));

    draggables = circles.map((circle, i) =>
      Draggable.create(circle, {
        type: 'x,y',
        bounds: boundsFor(circle),
        onDrag() {
          gsap.set(labels[i], { x: this.x, y: this.y });
        },
      })[0]
    );
  }

  circles.forEach((circle, i) => {
    circle.addEventListener('keydown', (event) => {
      const moves = { ArrowLeft: [-STEP, 0], ArrowRight: [STEP, 0], ArrowUp: [0, -STEP], ArrowDown: [0, STEP] };
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      const b = boundsFor(circle);
      const x = Math.min(Math.max(gsap.getProperty(circle, 'x') + move[0], b.minX), b.maxX);
      const y = Math.min(Math.max(gsap.getProperty(circle, 'y') + move[1], b.minY), b.maxY);
      moveTo(i, x, y);
      draggables[i].update();
    });
  });

  narrow.addEventListener('change', setup);
  setup();
}
