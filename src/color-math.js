export function levelsForBits(bits) {
  return 2 ** bits;
}

export function bitsPerPixel(bits) {
  return bits * 3;
}

// snaps a 0-255 value to the nearest of 2^bits evenly spaced levels
export function quantize(value, bits) {
  const levels = levelsForBits(bits);
  const step = 255 / (levels - 1);
  return Math.round(Math.round(value / step) * step);
}

export function toHexPair(n) {
  return n.toString(16).padStart(2, '0').toUpperCase();
}

export function toBinary8(n) {
  return n.toString(2).padStart(8, '0');
}

export function toHex6(r, g, b) {
  return `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}`;
}

// one flat color step per level, as hard-edged linear-gradient stops
export function buildBandedStops(levels) {
  const stops = [];
  for (let k = 0; k < levels; k++) {
    const value = Math.round((255 * k) / (levels - 1));
    const start = (k / levels) * 100;
    const end = ((k + 1) / levels) * 100;
    stops.push(`rgb(${value},0,0) ${start}%`, `rgb(${value},0,0) ${end}%`);
  }
  return stops.join(', ');
}
