// storing colors as numbers: sliders drive swatches + the dec/hex/binary readout
import { toHexPair, toBinary8, toHex6 } from './color-math.js';

const CHANNELS = [
  { key: 'r', rgb: (v) => `rgb(${v},0,0)` },
  { key: 'g', rgb: (v) => `rgb(0,${v},0)` },
  { key: 'b', rgb: (v) => `rgb(0,0,${v})` },
];

export function initColorSliders() {
  const channels = CHANNELS.map((c) => ({
    ...c,
    slider: document.querySelector(`#${c.key}-slider`),
    out: document.querySelector(`#${c.key}-out`),
    swatch: document.querySelector(`#${c.key}-swatch`),
    dec: document.querySelector(`#${c.key}-dec`),
    hex: document.querySelector(`#${c.key}-hex`),
    bin: document.querySelector(`#${c.key}-bin`),
  }));
  if (channels.some((c) => !c.slider)) return;

  const hex6 = document.querySelector('#hex6');

  function render() {
    const values = channels.map((c) => Number(c.slider.value));
    channels.forEach((c, i) => {
      const v = values[i];
      c.out.textContent = v;
      c.swatch.style.background = c.rgb(v);
      c.dec.textContent = v;
      c.hex.textContent = `0x${toHexPair(v)}`;
      c.bin.textContent = toBinary8(v);
    });
    hex6.textContent = toHex6(...values);
  }

  channels.forEach((c) => c.slider.addEventListener('input', render));
  render();
}
