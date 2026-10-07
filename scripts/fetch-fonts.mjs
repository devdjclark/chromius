// downloads self-hosted woff2 files for Inter + JetBrains Mono
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const FONTS = [
  { family: 'Inter', weights: [300, 400, 500], dir: 'public/fonts/inter' },
  { family: 'JetBrains+Mono', weights: [400, 500], dir: 'public/fonts/jetbrains-mono' },
];

// Request one weight per CSS2 call. If multiple weights are requested together
// (e.g. wght@300;400;500), the CSS2 API decides it's cheaper to serve a single
// variable-font file covering the whole axis and points every weight's
// @font-face rule at that SAME url -- so saving "by weight" would silently
// save byte-identical files for every weight. Requesting one weight at a time
// forces a distinct static instance per weight.
async function fetchCss(family, weight) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  return res.text();
}

async function run() {
  for (const font of FONTS) {
    await mkdir(font.dir, { recursive: true });
    for (const weight of font.weights) {
      const css = await fetchCss(font.family, weight);
      // Even for a single weight, the response still contains one @font-face
      // block per unicode-range subset (cyrillic, greek, vietnamese, latin, ...).
      // The "latin" subset -- the one we need -- is always listed last.
      const matches = [...css.matchAll(/src: url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)];
      const fontUrl = matches[matches.length - 1][1];
      const res = await fetch(fontUrl);
      const buffer = Buffer.from(await res.arrayBuffer());
      const name = font.family.replace('+', '-');
      const outPath = path.join(font.dir, `${name}-${weight}.woff2`);
      await writeFile(outPath, buffer);
      console.log(`saved ${outPath}`);
    }
  }
}

run();
