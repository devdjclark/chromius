// one-off: resize + recompress the two graph jpgs, print real before/after sizes
import sharp from 'sharp';
import { stat, rename } from 'node:fs/promises';

const FILES = ['public/images/sampling-graph.jpg', 'public/images/quantization-graph.jpg'];

async function compress(file) {
  const before = (await stat(file)).size;
  const tmp = `${file}.tmp`;
  await sharp(file).resize({ width: 1440 }).jpeg({ quality: 80 }).toFile(tmp);
  await rename(tmp, file);
  const after = (await stat(file)).size;
  const pct = (((before - after) / before) * 100).toFixed(1);
  console.log(`${file}: ${(before / 1024 / 1024).toFixed(1)} MB -> ${(after / 1024).toFixed(1)} KB (${pct}% smaller)`);
}

for (const file of FILES) {
  await compress(file);
}
