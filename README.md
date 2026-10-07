# Chromius

An educational single-page site about digital color and quantization (RGB mixing, color
quantization, color banding, and compression/media specs), built with Vite, Tailwind CSS, and GSAP.

## Requirements

- Node.js and npm

## Setup

```bash
npm install
```

## Development

Start the Vite dev server with hot reload:

```bash
npm run dev
```

## Build

Build the production bundle to `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Tests

Run the test suite (Vitest):

```bash
npm test
```

## Other scripts

- `npm run fetch:fonts` — download the self-hosted font files used by the site.
- `npm run generate:graphs` — render the two S3 graphs (dark, 1440×660) to JPG + WebP in `public/images/` and print their sizes for the S6 table.
