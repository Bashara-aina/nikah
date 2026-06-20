#!/usr/bin/env node
/**
 * For each lost public/assets file, search the whole repo (Recovered/, _source/,
 * etc.) for a byte-identical copy by sha256. Report found/missing.
 */
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");

const LOST = [
  "nikah-web/public/assets/cats/cat-hoshi-kimho-playing.png",
  "nikah-web/public/assets/cats/cat-jiro-in-flowers.png",
  "nikah-web/public/assets/cats/cat-meng-with-flowers.png",
  "nikah-web/public/assets/cats/cat-moju-sleeping-flowers.png",
  "nikah-web/public/assets/cats/cat-shiro-butterfly.png",
  "nikah-web/public/assets/cats/cat-simba-with-dove.png",
  "nikah-web/public/assets/florals/chapter-separator.png",
  "nikah-web/public/assets/florals/connecting-swag.png",
  "nikah-web/public/assets/florals/drapery-floral-divider.png",
  "nikah-web/public/assets/florals/event-accent.png",
  "nikah-web/public/assets/florals/gift-accent.png",
  "nikah-web/public/assets/florals/hero-bottom-meadow.png",
  "nikah-web/public/assets/florals/japan-motif.png",
  "nikah-web/public/assets/florals/loading-motif.png",
  "nikah-web/public/assets/florals/map-pin.png",
  "nikah-web/public/assets/florals/paw-prints-trail.png",
  "nikah-web/public/assets/florals/scattered-petals-trail.png",
  "nikah-web/public/assets/florals/section-header-garland.png",
  "nikah-web/public/assets/florals/section-meadow-bottom.png",
  "nikah-web/public/assets/florals/section-meadow-top.png",
  "nikah-web/public/assets/florals/section-transition-vine.png",
  "nikah-web/public/assets/florals/story-growing.png",
  "nikah-web/public/assets/florals/story-meeting.png",
  "nikah-web/public/assets/florals/story-title-garland.png",
  "nikah-web/public/assets/florals/story-vine-right.png",
  "nikah-web/public/assets/florals/welcome-accent.png",
  "nikah-web/public/assets/illustrations/closing-footer-meadow.png",
  "nikah-web/public/assets/illustrations/closing-illustration.png",
  "nikah-web/public/assets/illustrations/closing-illustration.webp",
  "nikah-web/public/assets/illustrations/countdown-cats-banner.png",
  "nikah-web/public/assets/illustrations/gate-illustration.png",
  "nikah-web/public/assets/illustrations/story-jakarta.png",
  "nikah-web/public/assets/illustrations/story-keio.png",
  "nikah-web/public/assets/illustrations/story-ldr.png",
  "nikah-web/public/assets/illustrations/story-married.png",
  "nikah-web/public/assets/illustrations/story-motor.png",
  "nikah-web/public/assets/illustrations/story-together-removebg.png",
];

async function sha256(p) {
  const buf = await fs.readFile(p);
  return createHash("sha256").update(buf).digest("hex");
}

// Build a sha256 index of all files under Recovered/ (and other known stashes).
const SEARCH_ROOTS = [
  path.join(REPO, "Recovered"),
  path.join(REPO, "assets", "_source"),
];

const index = new Map(); // sha → array of paths
async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) await walk(abs);
    else if (/\.(png|webp|avif|jpg|jpeg)$/i.test(e.name)) {
      try {
        const sha = await sha256(abs);
        if (!index.has(sha)) index.set(sha, []);
        index.get(sha).push(abs);
      } catch {}
    }
  }
}
for (const r of SEARCH_ROOTS) await walk(r);

const lostShas = new Map();
for (const rel of LOST) {
  const abs = path.join(REPO, rel);
  try {
    const sha = await sha256(abs);
    lostShas.set(rel, { sha, found: false });
  } catch {
    lostShas.set(rel, { sha: null, found: false });
  }
}

// Use the manifest's recorded sha256 for the lost files (since the bytes are gone).
const manifest = JSON.parse(
  await fs.readFile(path.join(__dirname, "manifest.json"), "utf8"),
);
const manifestByPath = new Map();
for (const e of manifest.entries) manifestByPath.set(e.path, e);
for (const [rel, info] of lostShas) {
  const m = manifestByPath.get(rel);
  if (m) info.sha = m.sha256;
  if (info.sha && index.has(info.sha)) {
    info.found = true;
    info.copies = index.get(info.sha);
  }
}

let foundCount = 0, missingCount = 0;
const lines = [];
for (const [rel, info] of lostShas) {
  if (info.found) {
    foundCount++;
    lines.push(`✓ ${rel.padEnd(70)}  ← ${info.copies.map(c => path.relative(REPO, c)).join(", ")}`);
  } else {
    missingCount++;
    lines.push(`✗ ${rel.padEnd(70)}  sha256=${info.sha?.slice(0, 12) + "…" ?? "(none)"}`);
  }
}
console.log(lines.join("\n"));
console.log();
console.log(`found in Recovered/: ${foundCount}`);
console.log(`not found anywhere:  ${missingCount}`);
