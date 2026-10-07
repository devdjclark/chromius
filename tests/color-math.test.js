import { describe, it, expect } from 'vitest';
import {
  levelsForBits,
  bitsPerPixel,
  quantize,
  toHexPair,
  toBinary8,
  toHex6,
  buildBandedStops,
} from '../src/color-math.js';

describe('levelsForBits', () => {
  it('returns 2^bits', () => {
    expect(levelsForBits(1)).toBe(2);
    expect(levelsForBits(4)).toBe(16);
    expect(levelsForBits(8)).toBe(256);
  });
});

describe('bitsPerPixel', () => {
  it('multiplies bits by 3 channels', () => {
    expect(bitsPerPixel(4)).toBe(12);
    expect(bitsPerPixel(8)).toBe(24);
  });
});

describe('quantize', () => {
  it('snaps a value to the nearest level at a given bit depth', () => {
    expect(quantize(255, 8)).toBe(255);
    expect(quantize(0, 8)).toBe(0);
    expect(quantize(128, 1)).toBe(255);
    expect(quantize(43, 4)).toBe(51);
  });
});

describe('toHexPair', () => {
  it('formats a 0-255 value as a 2-digit uppercase hex pair', () => {
    expect(toHexPair(0)).toBe('00');
    expect(toHexPair(255)).toBe('FF');
    expect(toHexPair(43)).toBe('2B');
  });
});

describe('toBinary8', () => {
  it('formats a 0-255 value as an 8-digit binary string', () => {
    expect(toBinary8(0)).toBe('00000000');
    expect(toBinary8(255)).toBe('11111111');
    expect(toBinary8(43)).toBe('00101011');
  });
});

describe('toHex6', () => {
  it('builds a 6-digit hex color from r, g, b', () => {
    expect(toHex6(43, 91, 255)).toBe('#2B5BFF');
  });
});

describe('buildBandedStops', () => {
  it('builds one hard color step per level', () => {
    expect(buildBandedStops(4)).toBe(
      'rgb(0,0,0) 0%, rgb(0,0,0) 25%, rgb(85,0,0) 25%, rgb(85,0,0) 50%, ' +
        'rgb(170,0,0) 50%, rgb(170,0,0) 75%, rgb(255,0,0) 75%, rgb(255,0,0) 100%'
    );
  });
});
