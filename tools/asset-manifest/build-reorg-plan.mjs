#!/usr/bin/env node
/**
 * Build the per-file routing plan for the cutout/scene split.
 *
 * Rule:
 *   - Files in /assets/audio/   → keep (not an image)
 *   - Files in /assets/gallery/ → keep (subject-of-record)
 *   - Files in /assets/cats/    → keep (subject-of-record; cats are cutouts by intent)
 *   - Files in /assets/couple/ → keep (subject-of-record)
 *   - Other files:
 *       hasAlpha && opaqueFraction <= 0.30 → cutout/
 *       opaque (no alpha) OR opaqueFraction >= 0.70 → scene/
 *       in between → ambiguous; default to scene (larger container)
 *
 * Writes tools/asset-manifest/reorg-plan.json.
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

const ALPHA_THRESHOLD = 16;

const KEEP_SUBJECTS = new Set(["audio", "gallery", "cats", "couple"]);

async function opaqueFraction(absPath) {
  let img;
  try {
    img = sharp(absPath, { failOn: "none" });
  } catch {
    return null;
  }
  const meta = await img.metadata();
  if (!meta.hasAlpha) return { fraction: 1.0, hasAlpha: false };
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  let opaque = 0;
  for (let i = 3; i < data.length; i += channels) {
    if (data[i] >= ALPHA_THRESHOLD) opaque++;
  }
  return { fraction: opaque / (info.width * info.height), hasAlpha: true };
}

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
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) await walk(abs, out);
    else if (/\.(png|webp|avif|jpg|jpeg)$/i.test(e.name)) out.push(abs);
  }
  return out;
}

const files = await walk(ASSETS);
const plan = [];
for (const abs of files) {
  const rel = path.relative(REPO, abs);
  const top = rel.split("/")[1]; // assets/<top>/<rest>
  let action;
  let target = null;
  if (KEEP_SUBJECTS.has(top)) {
    action = "keep";
    target = rel;
  } else {
    const f = await opaqueFraction(abs);
    if (!f) {
      action = "keep";
      target = rel;
    } else if (!f.hasAlpha || f.fraction >= 0.70) {
      action = "move";
      target = `assets/scene/${path.basename(rel)}`;
    } else if (f.fraction <= 0.30) {
      action = "move";
      target = `assets/cutout/${path.basename(rel)}`;
    } else {
      // ambiguous → scene (larger container)
      action = "move";
      target = `assets/scene/${path.basename(rel)}`;
    }
  }
  plan.push({ from: rel, to: target, action });
}

await fs.writeFile(path.join(__dirname, "reorg-plan.json"), JSON.stringify(plan, null, 2));

// summary
const counts = { keep: 0, move_scene: 0, move_cutout: 0 };
for (const r of plan) {
  if (r.action === "keep") counts.keep++;
  else if (r.to.startsWith("assets/scene/")) counts.move_scene++;
  else if (r.to.startsWith("assets/cutout/")) counts.move_cutout++;
}
console.log(JSON.stringify(counts, null, 2));
console.log("wrote", path.join(__dirname, "reorg-plan.json"));
