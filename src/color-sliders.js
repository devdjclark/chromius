// storing colors as numbers: sliders drive the channel lights, the dec/binary values
// beside each slider, and the mixed swatch + hex code
import { toBinary8, toHex6 } from './color-math.js';

const CHANNELS = [
  { key: 'r', rgb: (v) => `rgb(${v},0,0)` },
  { key: 'g', rgb: (v) => `rgb(0,${v},0)` },
  { key: 'b', rgb: (v) => `rgb(0,0,${v})` },
];

export function initColorSliders() {
  const channels = CHANNELS.map((c) => ({
    ...c,
    slider: document.querySelector(`#${c.key}-slider`),
    swatch: document.querySelector(`#${c.key}-swatch`),
    dec: document.querySelector(`#${c.key}-dec`),
    bin: document.querySelector(`#${c.key}-bin`),
  }));
  if (channels.some((c) => !c.slider)) return;

  const mix = document.querySelector('#mix-swatch');
  const hex6 = document.querySelector('#hex6');

  function render() {
    const values = channels.map((c) => Number(c.slider.value));
    channels.forEach((c, i) => {
      c.swatch.style.background = c.rgb(values[i]);
      c.dec.textContent = values[i];
      c.bin.textContent = toBinary8(values[i]);
    });
    const hex = toHex6(...values);
    mix.style.background = hex;
    hex6.textContent = hex;
  }

  channels.forEach((c) => c.slider.addEventListener('input', render));
  render();
}
