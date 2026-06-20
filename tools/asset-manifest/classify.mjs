#!/usr/bin/env node
/**
 * Classify every RGBA image in /assets/ as cutout (localized subject on
 * transparent backdrop) or scene (opaque image whose alpha is just an
 * irregular outer edge).
 *
 * Heuristic: read the alpha channel, compute the fraction of pixels with
 * alpha >= 16 (i.e. "essentially opaque"). If that fraction >= 0.70,
 * classify as "scene". If <= 0.30, "cutout". Else "ambiguous" — emit a
 * row with the actual fraction so a human can override.
 *
 * Output: JSON to stdout, one entry per RGBA file in /assets/.
 */
import path from "node:path";
import url from "node:url";
import { createRequire } from "node:module";
import { promises as fs } from "node:fs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const ASSETS = path.join(REPO, "assets");
const ALPHA_THRESHOLD = 16;
const CUTOUT_MAX = 0.30;
const SCENE_MIN = 0.70;

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    if (e.name === "_source") continue;
    if (e.name === "audio") continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) await walk(abs, out);
    else if (/\.(png|webp|avif)$/i.test(e.name)) out.push(abs);
  }
  return out;
}

async function opaqueFraction(absPath) {
  let img;
  try {
    img = sharp(absPath, { failOn: "none" });
  } catch {
    return null;
  }
  const meta = await img.metadata();
  if (!meta.hasAlpha || meta.channels < 4) {
    // No alpha channel → fully opaque. Scene.
    return { hasAlpha: false, fraction: 1.0 };
  }
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const channels = info.channels; // should be 4
  let opaque = 0;
  for (let i = 3; i < data.length; i += channels) {
    if (data[i] >= ALPHA_THRESHOLD) opaque++;
  }
  const total = info.width * info.height;
  return { hasAlpha: true, fraction: opaque / total, width: info.width, height: info.height };
}

function classify(fraction) {
  if (fraction >= SCENE_MIN) return "scene";
  if (fraction <= CUTOUT_MAX) return "cutout";
  return "ambiguous";
}

const files = await walk(ASSETS);
const results = [];
for (const f of files) {
  const f0 = await opaqueFraction(f);
  if (!f0) {
    results.push({ path: path.relative(REPO, f), error: true });
    continue;
  }
  if (!f0.hasAlpha) {
    results.push({
      path: path.relative(REPO, f),
      hasAlpha: false,
      fraction: 1.0,
      classification: "scene",
    });
    continue;
  }
  results.push({
    path: path.relative(REPO, f),
    hasAlpha: true,
    fraction: +f0.fraction.toFixed(4),
    classification: classify(f0.fraction),
  });
}
results.sort((a, b) => a.path.localeCompare(b.path));
process.stdout.write(JSON.stringify(results, null, 2) + "\n");
