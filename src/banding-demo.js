// quantization artifacts: compare slider (or dragging the strip) moves the divider,
// levels slider rebuilds the banded gradient
import { buildBandedStops } from './color-math.js';

export function initBandingDemo() {
  const compare = document.querySelector('#compare-slider');
  const levels = document.querySelector('#levels-slider');
  if (!compare || !levels) return;

  const strip = document.querySelector('#banding-strip');
  const banded = document.querySelector('#banded-layer');
  const divider = document.querySelector('#compare-divider');
  const compareValue = document.querySelector('#compare-value');
  const levelsLabel = document.querySelector('#levels-label');

  function render() {
    const pct = Number(compare.value);
    divider.style.left = `${pct}%`;
    banded.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    compareValue.textContent = `${pct}%`;

    const bits = Number(levels.value);
    const levelCount = 2 ** bits;
    banded.style.background = `linear-gradient(to right, ${buildBandedStops(levelCount)})`;
    levelsLabel.textContent = `${levelCount} / ${bits} bits`;
  }

  // drag directly on the strip; the range input stays the keyboard/AT control
  function setFromPointer(event) {
    const rect = strip.getBoundingClientRect();
    const pct = Math.round(((event.clientX - rect.left) / rect.width) * 100);
    compare.value = Math.min(Math.max(pct, 0), 100);
    render();
  }

  strip.addEventListener('pointerdown', (event) => {
    strip.setPointerCapture(event.pointerId);
    setFromPointer(event);
  });
  strip.addEventListener('pointermove', (event) => {
    if (strip.hasPointerCapture(event.pointerId)) setFromPointer(event);
  });

  compare.addEventListener('input', render);
  levels.addEventListener('input', render);
  render();
}
