#!/usr/bin/env node
/**
 * One-off: copy the renamed RGBA images from nikah-web/public/assets/ to
 * assets/<category>/ so the canonical /assets/ tree owns them, then let
 * copy-assets.mjs sync them back to public/assets/ on the next build.
 *
 * This is a no-op for files that already exist in assets/ with the same
 * sha256, and refuses to overwrite assets/ files with different bytes.
 */
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const PUBLIC = path.join(REPO, "nikah-web", "public", "assets");
const ASSETS = path.join(REPO, "assets");

// Files we distributed in the prior turn. Categories chosen by hand.
const FILES = [
  ["cats",            "cats-couple-wreath.png"],
  ["cats",            "cat-with-dove.png"],
  ["couple",          "couple-illustration.png"],
  ["scenes",          "section-wash-warm.png"],
  ["cats",            "cat-sleeping-wreath.png"],
  ["scenes",          "meadow-daisies.png"],
  ["cats",            "cat-in-flowers.png"],
  ["florals",         "accent-doves-heart.png"],
  ["florals",         "accent-doves-arch.png"],
  ["scenes",          "section-wash-pink.png"],
  ["illustrations",   "forest-scene-bear.png"],
  ["florals",         "floral-cluster-pink.png"],
  ["illustrations",   "story-books-plane.png"],
  ["illustrations",   "story-meeting-2.png"],
  ["illustrations",   "gate-scene-cat.png"],
  ["illustrations",   "couple-under-arch.png"],
  ["cats",            "cat-grass-frontal.png"],
  ["florals",         "accent-doves-pair.png"],
  ["illustrations",   "story-jakarta-map.png"],
  ["illustrations",   "story-jakarta-motor.png"],
  ["cats",            "cat-in-heart-flowers.png"],
  ["florals",         "floral-wisteria-frame.png"],
  ["florals",         "floral-cluster-pinkwhite.png"],
  ["cats",            "cat-sleeping-flowers.png"],
  ["scenes",          "section-wash-cool.png"],
  ["illustrations",   "story-keio-tower.png"],
  ["illustrations",   "gate-scene-cats-wide.png"],
  ["scenes",          "section-meadow-bottom-daisies.png"],
  ["illustrations",   "story-bus-couple.png"],
  ["illustrations",   "gate-arch-floral.png"],
  ["scenes",          "scene-bridge-cat.png"],
  ["florals",         "floral-cluster-redroses.png"],
  ["illustrations",   "peacock-arch-couple.png"],
  ["florals",         "paw-prints-trail-straight.png"],
  ["florals",         "floral-cluster-mixed.png"],
  ["illustrations",   "wedding-rings.png"],
];

async function sha256(p) {
  const buf = await fs.readFile(p);
  return createHash("sha256").update(buf).digest("hex");
}

let copied = 0, skipped = 0, refused = 0;
for (const [category, name] of FILES) {
  const src = path.join(PUBLIC, category, name);
  const dst = path.join(ASSETS, category, name);
  let srcSha;
  try {
    srcSha = await sha256(src);
  } catch {
    console.log(`  skip (missing in public): ${category}/${name}`);
    skipped++;
    continue;
  }
  try {
    await fs.access(dst);
    const dstSha = await sha256(dst);
    if (dstSha === srcSha) {
      console.log(`  same-sha (skip): ${category}/${name}`);
      skipped++;
      continue;
    }
    console.error(`  REFUSE: ${category}/${name} exists in assets/ with different bytes`);
    refused++;
    continue;
  } catch {
    // missing — fine
  }
  await fs.mkdir(path.dirname(dst), { recursive: true });
  await fs.copyFile(src, dst);
  console.log(`  copied: ${category}/${name}`);
  copied++;
}
console.log(`---\ncopied: ${copied}  skipped: ${skipped}  refused: ${refused}`);
if (refused) process.exit(1);
