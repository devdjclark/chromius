// renders the two S3 graphs (dark, 1440x660) to jpg + webp and prints real sizes
// against the raw 24-bit bitmap baseline (1440 * 660 * 3 bytes) used in the S6 table
import sharp from 'sharp';
import { stat } from 'node:fs/promises';

const W = 1440;
const H = 660;
const BG = '#0A0A0B';
const PAD_X = 110;
const MID = 390;
const AMP = 200;
const PERIODS = 1.25;
const RAW_BYTES = W * H * 3;

const xAt = (t) => PAD_X + t * (W - PAD_X * 2);
const yAt = (t) => MID - AMP * Math.sin(2 * Math.PI * PERIODS * t);

function signalPath(steps = 400) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push(`${xAt(t).toFixed(1)},${yAt(t).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}

function frame(legend) {
  const axis = `<line x1="${PAD_X}" y1="${MID}" x2="${W - PAD_X}" y2="${MID}" stroke="rgba(255,255,255,.14)" stroke-width="2"/>`;
  return `<rect width="${W}" height="${H}" fill="${BG}"/>${axis}${legend}`;
}

function legendItem(x, swatch, label) {
  return `${swatch.replace(/X0/g, x)}<text x="${x + 56}" y="82" fill="rgba(255,255,255,.66)" font-family="Consolas, 'JetBrains Mono', monospace" font-size="38" letter-spacing="4">${label}</text>`;
}

function samplingSvg() {
  const SAMPLES = 17;
  let marks = '';
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / (SAMPLES - 1);
    const x = xAt(t);
    const y = yAt(t);
    marks += `<line x1="${x}" y1="${MID}" x2="${x}" y2="${y}" stroke="rgba(127,157,255,.45)" stroke-width="3"/>`;
    marks += `<circle cx="${x}" cy="${y}" r="9" fill="#7F9DFF"/>`;
  }
  const legend =
    legendItem(PAD_X, `<line x1="X0" y1="69" x2="${PAD_X + 40}" y2="69" stroke="rgba(255,255,255,.5)" stroke-width="3" stroke-dasharray="6 6"/>`, 'CONTINUOUS SIGNAL') +
    legendItem(PAD_X + 640, `<circle cx="${PAD_X + 660}" cy="69" r="13" fill="#7F9DFF"/>`, 'SAMPLES');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${frame(legend)}
    <path d="${signalPath()}" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="3" stroke-dasharray="10 10"/>
    ${marks}</svg>`;
}

function quantizationSvg() {
  const LEVELS = 9;
  const STEPS = 48;
  const levelY = (k) => MID - AMP + (k * 2 * AMP) / (LEVELS - 1);
  let grid = '';
  for (let k = 0; k < LEVELS; k++) {
    grid += `<line x1="${PAD_X}" y1="${levelY(k)}" x2="${W - PAD_X}" y2="${levelY(k)}" stroke="rgba(255,255,255,.07)" stroke-width="2" stroke-dasharray="4 8"/>`;
  }
  // snap each step to the nearest level, drawn as a staircase
  const snap = (y) => levelY(Math.round(((y - (MID - AMP)) / (2 * AMP)) * (LEVELS - 1)));
  let d = '';
  for (let i = 0; i < STEPS; i++) {
    const t0 = i / STEPS;
    const t1 = (i + 1) / STEPS;
    const y = snap(yAt((t0 + t1) / 2));
    d += `${i === 0 ? 'M' : 'L'}${xAt(t0).toFixed(1)},${y.toFixed(1)} L${xAt(t1).toFixed(1)},${y.toFixed(1)} `;
  }
  const legend =
    legendItem(PAD_X, `<line x1="X0" y1="69" x2="${PAD_X + 40}" y2="69" stroke="rgba(255,255,255,.5)" stroke-width="3" stroke-dasharray="6 6"/>`, 'CONTINUOUS SIGNAL') +
    legendItem(PAD_X + 640, `<line x1="${PAD_X + 640}" y1="69" x2="${PAD_X + 680}" y2="69" stroke="#FF6A6A" stroke-width="4"/>`, 'QUANTIZED (9 LEVELS)');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${frame(legend)}${grid}
    <path d="${signalPath()}" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="3" stroke-dasharray="10 10"/>
    <path d="${d}" fill="none" stroke="#FF6A6A" stroke-width="4" stroke-linejoin="round"/></svg>`;
}

async function render(name, svg) {
  const base = `public/images/${name}`;
  const img = sharp(Buffer.from(svg)).flatten({ background: BG });
  await img.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${base}.jpg`);
  await img.clone().webp({ quality: 82 }).toFile(`${base}.webp`);
  for (const ext of ['jpg', 'webp']) {
    const size = (await stat(`${base}.${ext}`)).size;
    const pct = (((RAW_BYTES - size) / RAW_BYTES) * 100).toFixed(1);
    console.log(`${base}.${ext}: raw ${(RAW_BYTES / 1e6).toFixed(1)} MB -> ${(size / 1024).toFixed(1)} KB (${pct}% smaller)`);
  }
}

await render('sampling-graph', samplingSvg());
await render('quantization-graph', quantizationSvg());
