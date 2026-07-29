#!/usr/bin/env node
/**
 * Inventory every keeper under relevant/01–09: W×H, bytes, alpha, opaque coverage.
 * Read-only — feeds the remediation script targets.
 */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "relevant");
const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg"]);

const folders = [
  "01-hero-scenes-video",
  "02-cats",
  "03-couple",
  "04-story",
  "05-gate-loading-welcome",
  "06-countdown-japan-event",
  "07-rsvp-wishes-gift-closing",
  "08-dividers-florals-accents",
];

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

for (const folder of folders) {
  const dir = path.join(root, folder);
  const files = (await readdir(dir)).filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()));
  console.log(`\n## ${folder}`);
  for (const file of files.sort()) {
    const p = path.join(dir, file);
    const bytes = (await stat(p)).size;
    try {
      const img = sharp(p);
      const meta = await img.metadata();
      let alphaNote = "opaque";
      if (meta.hasAlpha) {
        // Estimate visual occupancy: fraction of pixels with alpha > 10%.
        const { data, info } = await sharp(p)
          .resize(64, 64, { fit: "inside" })
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });
        let visible = 0;
        const px = info.width * info.height;
        for (let i = 3; i < data.length; i += 4) if (data[i] > 25) visible++;
        alphaNote = `alpha ${(100 * visible / px).toFixed(0)}% painted`;
      }
      console.log(
        `${file.padEnd(36)} ${String(meta.width).padStart(5)}x${String(meta.height).padEnd(5)} ${kb(bytes).padStart(8)}  ${alphaNote}`,
      );
    } catch (err) {
      console.log(`${file.padEnd(36)} ERROR ${err.message}`);
    }
  }
}
