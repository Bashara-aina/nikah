#!/usr/bin/env node
/**
 * Knock the flat ivory plate out of generated illustrations so they sit on
 * the site paper without a visible rectangle. Distance-keyed alpha against
 * the corner-sampled background color, with a soft ramp to keep watercolor
 * edges. Outputs *-cut.webp next to the promoted asset for visual review,
 * then the caller overwrites the shipping name once approved.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(here, "..", "assets");

const TARGETS = [
  ["illustrations/welcome-dove-floral.webp", 14, 40],
  ["illustrations/gate-monogram-frame.webp", 8, 26],
  ["illustrations/loading-sleeping-cat.webp", 8, 26],
  ["illustrations/gift-envelope-icon.webp", 6, 20],
];

const key = async (rel, t0, t1) => {
  const src = path.join(ASSETS, rel);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels } = info;

  // Background = average of the four 6x6 corner patches.
  const sample = (x0, y0) => {
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = y0; y < y0 + 6; y++)
      for (let x = x0; x < x0 + 6; x++) {
        const i = (y * w + x) * channels;
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
    return [r / n, g / n, b / n];
  };
  const corners = [sample(0, 0), sample(w - 6, 0), sample(0, h - 6), sample(w - 6, h - 6)];
  const bg = corners.reduce((a, c) => [a[0] + c[0] / 4, a[1] + c[1] / 4, a[2] + c[2] / 4], [0, 0, 0]);

  for (let i = 0; i < data.length; i += channels) {
    const d = Math.max(
      Math.abs(data[i] - bg[0]),
      Math.abs(data[i + 1] - bg[1]),
      Math.abs(data[i + 2] - bg[2]),
    );
    if (d <= t0) data[i + 3] = 0;
    else if (d < t1) data[i + 3] = Math.round(((d - t0) / (t1 - t0)) * 255);
  }

  const out = src.replace(/\.webp$/, "-cut.webp");
  await sharp(data, { raw: { width: w, height: h, channels } })
    .webp({ quality: 82, effort: 5 })
    .toFile(out);
  console.log(`keyed ${rel} (bg rgb(${bg.map((v) => v.toFixed(0)).join(",")}))`);
};

for (const [rel, t0, t1] of TARGETS) await key(rel, t0, t1);
console.log("done");
