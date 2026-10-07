// compression via quantization: bits slider drives LEVELS/BITS stats + the LUT table
import { levelsForBits, bitsPerPixel, quantize, toHex6 } from './color-math.js';

const SAMPLES = [
  [255, 64, 64],
  [25, 230, 92],
  [43, 91, 255],
];

export function initQuantizeDemo() {
  const slider = document.querySelector('#bits-slider');
  if (!slider) return;

  const value = document.querySelector('#bits-value');
  const levelsStat = document.querySelector('#levels-stat');
  const bppStat = document.querySelector('#bpp-stat');
  const rows = document.querySelectorAll('#s4 [data-row]');

  function render() {
    const bits = Number(slider.value);
    value.textContent = bits;
    levelsStat.textContent = levelsForBits(bits);
    bppStat.textContent = `${bitsPerPixel(bits)} / 24`;

    rows.forEach((row, i) => {
      const [r, g, b] = SAMPLES[i];
      const qr = quantize(r, bits);
      const qg = quantize(g, bits);
      const qb = quantize(b, bits);
      row.querySelector('[data-swatch]').style.background = toHex6(qr, qg, qb);
      row.querySelector('[data-out]').textContent = `${qr}, ${qg}, ${qb}`;
    });
  }

  slider.addEventListener('input', render);
  render();
}
