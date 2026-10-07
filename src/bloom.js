// one fixed spectrum band behind the page. As a section boundary crosses the middle of
// the viewport, the band eases from one section's palette (and height) into the next,
// so the colour never "cuts" between sections. Colours are mixed in OKLab, which keeps
// the in-between hues vivid instead of greying out like a plain RGB mix.

// seven colours inner -> outer (DESIGN.md §4; six-colour palettes repeat their last)
// and the band's vertical centre in vh. The heights follow the original top/bottom
// alternation but pulled halfway towards the middle, so the band drifts gently.
const PALETTES = {
  hero: { cy: 40, c: ['#6B0F1A', '#E0222B', '#FF6A1F', '#FFC02B', '#FFF1CF', '#7FE3FF', '#2B6BFF'] },
  s1: { cy: 64, c: ['#5A0C1E', '#C8142B', '#FF3B2B', '#FF8A2B', '#FFC27A', '#D4207E', '#D4207E'] },
  s2: { cy: 41, c: ['#073D2A', '#0FA85A', '#19E65C', '#9BEF4A', '#E4F57A', '#12A8C8', '#12A8C8'] },
  s3: { cy: 69, c: ['#0A1450', '#1B3FD0', '#2B5BFF', '#2B9BFF', '#7FD8FF', '#6A4BFF', '#6A4BFF'] },
  s4: { cy: 44, c: ['#3A0C5E', '#7B2BD6', '#D42BD6', '#FF2BB0', '#FF4A6A', '#FF8A4A', '#FF8A4A'] },
  s5: { cy: 59, c: ['#063246', '#0A8CA8', '#2BDCFF', '#8FF0FF', '#BFEFFF', '#2B7BFF', '#2B7BFF'] },
  s6: { cy: 54, c: ['#5A2406', '#C2540E', '#FF8A2B', '#FFB02B', '#FFD98A', '#FF4A3A', '#FF4A3A'] },
};

// sRGB hex <-> OKLab (Björn Ottosson's reference matrices)
const toLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

function hexToOklab(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToCss([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.round(Math.min(Math.max(toGamma(v), 0), 1) * 255));
  return `rgb(${rgb.join(',')})`;
}

const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

export function initBloom() {
  const bloom = document.querySelector('.bloom');
  const sections = Object.keys(PALETTES).map((id) => document.getElementById(id)).filter(Boolean);
  if (!bloom || !sections.length) return;

  const labs = sections.map((s) => PALETTES[s.id].c.map(hexToOklab));
  const heights = sections.map((s) => PALETTES[s.id].cy);
  let boundaries = [];

  function apply(i, t) {
    const j = Math.min(i + 1, sections.length - 1);
    labs[i].forEach((lab, k) => {
      const mixed = lab.map((v, n) => lerp(v, labs[j][k][n], t));
      bloom.style.setProperty(`--c${k + 1}`, oklabToCss(mixed));
    });
    bloom.style.setProperty('--cy', `${lerp(heights[i], heights[j], t)}vh`);
  }

  // the blend runs over one viewport height, centred on each boundary
  function render() {
    const vh = window.innerHeight;
    const mid = window.scrollY + vh / 2;
    const i = boundaries.findIndex((b) => mid < b + vh / 2);
    if (i === -1) return apply(sections.length - 1, 0);
    const t = Math.min(Math.max((mid - (boundaries[i] - vh / 2)) / vh, 0), 1);
    apply(i, smooth(t));
  }

  function measure() {
    boundaries = sections.slice(1).map((s) => s.getBoundingClientRect().top + window.scrollY);
    render();
  }

  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      render();
    });
  }, { passive: true });

  // section heights shift as fonts and lazy images land, so re-measure on any resize
  new ResizeObserver(measure).observe(document.body);
  measure();
}
