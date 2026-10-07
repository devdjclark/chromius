// quantization artifacts: compare slider moves the divider, levels slider rebuilds the banded gradient
import { buildBandedStops } from './color-math.js';

export function initBandingDemo() {
  const compare = document.querySelector('#compare-slider');
  const levels = document.querySelector('#levels-slider');
  if (!compare || !levels) return;

  const banded = document.querySelector('#banded-layer');
  const divider = document.querySelector('#compare-divider');
  const label = document.querySelector('#levels-label');

  function render() {
    const pct = Number(compare.value);
    divider.style.left = `${pct}%`;
    banded.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;

    const bits = Number(levels.value);
    const levelCount = 2 ** bits;
    banded.style.background = `linear-gradient(to right, ${buildBandedStops(levelCount)})`;
    label.textContent = `${levelCount} / ${bits} BITS`;
  }

  compare.addEventListener('input', render);
  levels.addEventListener('input', render);
  render();
}
