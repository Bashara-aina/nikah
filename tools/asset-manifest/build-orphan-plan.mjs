#!/usr/bin/env node
/**
 * Build the promotion plan for the 45 orphan files in
 * /public/assets/ that have no /assets/ source.
 *
 * Rules:
 *   - cats/                 → assets/cats/
 *   - gallery/              → assets/gallery/
 *   - audio/                → assets/audio/
 *   - florals|illustrations|scenes/:
 *       hasAlpha && frac<=0.30 → assets/cutout/
 *       else                  → assets/scene/
 *
 * Writes tools/asset-manifest/orphan-plan.json.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const ASSETS = path.join(REPO, "assets");
const PUBLIC = path.join(REPO, "nikah-web", "public", "assets");

const ALPHA_THRESHOLD = 16;

async function opaqueFraction(absPath) {
  let img;
  try {
    img = sharp(absPath, { failOn: "none" });
  } catch {
    return null;
  }
  const meta = await img.metadata();
  if (!meta.hasAlpha) return { fraction: 1.0, hasAlpha: false };
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let opaque = 0;
  for (let i = 3; i < data.length; i += info.channels) {
    if (data[i] >= ALPHA_THRESHOLD) opaque++;
  }
  return { fraction: opaque / (info.width * info.height), hasAlpha: true };
}

// Walk /public/assets/ directly instead of trusting the manifest, because
// the manifest may be stale relative to recent reorgs.
async function walk(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) await walk(abs, out);
    else if (/\.(png|webp|avif|jpg|jpeg)$/i.test(e.name)) out.push(abs);
  }
  return out;
}

const { createHash } = await import("node:crypto");
async function sha256File(p) {
  const buf = await fs.readFile(p);
  return createHash("sha256").update(buf).digest("hex");
}

// Build current assets/ index
async function walkAssets(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    if (e.name === "_source") continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) await walkAssets(abs, out);
    else if (/\.(png|webp|avif|jpg|jpeg)$/i.test(e.name)) out.push(abs);
  }
  return out;
}

const assetsFiles = await walkAssets(ASSETS);
const assetsHashes = new Set();
for (const f of assetsFiles) assetsHashes.add(await sha256File(f));

const publicFiles = await walk(PUBLIC);
const orphans = [];
for (const f of publicFiles) {
  const sha = await sha256File(f);
  if (!assetsHashes.has(sha)) {
    orphans.push({ sha, abs: f });
  }
}

const plan = [];
for (const o of orphans) {
  const rel = path.relative(REPO, o.abs);
  const top = rel.split("/")[2]; // nikah-web/public/assets/<top>/...
  const filename = path.basename(rel);
  let target;
  if (top === "cats") target = `assets/cats/${filename}`;
  else if (top === "gallery") target = `assets/gallery/${filename}`;
  else if (top === "audio") target = `assets/audio/${filename}`;
  else {
    const f = await opaqueFraction(o.abs);
    if (!f) target = `assets/scene/${filename}`;
    else if (!f.hasAlpha || f.fraction >= 0.70) target = `assets/scene/${filename}`;
    else if (f.fraction <= 0.30) target = `assets/cutout/${filename}`;
    else target = `assets/scene/${filename}`;
  }
  plan.push({
    from: rel,
    to: target,
    sha256: o.sha,
    sizeBytes: (await fs.stat(o.abs)).size,
  });
}

await fs.writeFile(
  path.join(__dirname, "orphan-plan.json"),
  JSON.stringify(plan, null, 2),
);

// summary
const counts = {};
for (const r of plan) {
  const dest = r.to.replace(/^assets\//, "");
  counts[dest] = (counts[dest] || 0) + 1;
}
console.log("orphan promotion plan:");
console.log(JSON.stringify(counts, null, 2));
console.log("wrote", path.join(__dirname, "orphan-plan.json"));
