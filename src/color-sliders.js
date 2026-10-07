// storing colors as numbers: sliders drive swatches + the dec/hex/binary readout
import { toHexPair, toBinary8, toHex6 } from './color-math.js';

export function initColorSliders() {
  const r = document.querySelector('#r-slider');
  const g = document.querySelector('#g-slider');
  const b = document.querySelector('#b-slider');
  if (!r || !g || !b) return;

  const el = {
    swatchR: document.querySelector('#r-swatch'),
    swatchG: document.querySelector('#g-swatch'),
    swatchB: document.querySelector('#b-swatch'),
    decR: document.querySelector('#r-dec'),
    decG: document.querySelector('#g-dec'),
    decB: document.querySelector('#b-dec'),
    hexR: document.querySelector('#r-hex'),
    hexG: document.querySelector('#g-hex'),
    hexB: document.querySelector('#b-hex'),
    binR: document.querySelector('#r-bin'),
    binG: document.querySelector('#g-bin'),
    binB: document.querySelector('#b-bin'),
    hex6: document.querySelector('#hex6'),
  };

  function render() {
    const rv = Number(r.value);
    const gv = Number(g.value);
    const bv = Number(b.value);

    el.swatchR.style.background = `rgb(${rv},0,0)`;
    el.swatchG.style.background = `rgb(0,${gv},0)`;
    el.swatchB.style.background = `rgb(0,0,${bv})`;

    el.decR.textContent = rv;
    el.decG.textContent = gv;
    el.decB.textContent = bv;

    el.hexR.textContent = toHexPair(rv);
    el.hexG.textContent = toHexPair(gv);
    el.hexB.textContent = toHexPair(bv);

    el.binR.textContent = toBinary8(rv);
    el.binG.textContent = toBinary8(gv);
    el.binB.textContent = toBinary8(bv);

    el.hex6.textContent = toHex6(rv, gv, bv);
  }

  [r, g, b].forEach((input) => input.addEventListener('input', render));
  render();
}
