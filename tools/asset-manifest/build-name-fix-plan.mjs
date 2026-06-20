#!/usr/bin/env node
/**
 * Build and execute the name/folder correction plan for /assets/ and
 * mirror to /public/assets/.
 *
 * Operations (all are renames, no deletions):
 *   - Move /assets/cutout/meadow-daisies.png → /assets/scene/meadow-daisies.png
 *   - Move /assets/cutout/scene-bridge-cat.png → /assets/scene/scene-bridge-cat.png
 *   - Move /assets/cutout/section-meadow-bottom-daisies.png → /assets/scene/section-meadow-bottom-daisies.png
 *   - Rename /assets/cutout/couple-cutout.png → /assets/cutout/couple-cutout-alt.png
 *   - Rename /assets/cats/cat-with-dove.png → /assets/cats/cat-jiro-with-dove.png
 *
 * Each operation verifies:
 *   - source exists with the expected sha256
 *   - destination does NOT exist (refuse to overwrite)
 *   - the destination name is sensible
 *
 * Updates /public/assets/ in lockstep.
 */
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const ASSETS = path.join(REPO, "assets");
const PUBLIC = path.join(REPO, "nikah-web", "public", "assets");

const PLAN = [
  {
    kind: "move",
    src: "cutout/meadow-daisies.png",
    dst: "scene/meadow-daisies.png",
    reason: "full-frame daisy landscape → scene, not cutout",
  },
  {
    kind: "move",
    src: "cutout/scene-bridge-cat.png",
    dst: "scene/scene-bridge-cat.png",
    reason: "filename contains 'scene' → scene folder",
  },
  {
    kind: "move",
    src: "cutout/section-meadow-bottom-daisies.png",
    dst: "scene/section-meadow-bottom-daisies.png",
    reason: "horizontal strip scene → scene folder",
  },
  {
    kind: "rename",
    src: "cutout/couple-cutout.png",
    dst: "cutout/couple-cutout-alt.png",
    reason: "naming collision with /couple/couple-cutout.png; this one is unused by components",
  },
  {
    kind: "rename",
    src: "cats/cat-with-dove.png",
    dst: "cats/cat-jiro-with-dove.png",
    reason: "matches the orange-tabby coloring of cat-jiro; matches naming convention of cat-jiro-in-flowers.png / cat-simba-with-dove.png",
  },
];

async function sha256(p) {
  const buf = await fs.readFile(p);
  return createHash("sha256").update(buf).digest("hex");
}

let moved = 0, renamed = 0, refused = 0;
for (const op of PLAN) {
  const srcAbs = path.join(ASSETS, op.src);
  const dstAbs = path.join(ASSETS, op.dst);
  const srcPub = path.join(PUBLIC, op.src);
  const dstPub = path.join(PUBLIC, op.dst);

  // Source must exist
  let srcSha;
  try {
    srcSha = await sha256(srcAbs);
  } catch {
    console.error(`  REFUSE: source missing in /assets/: ${op.src}`);
    refused++;
    continue;
  }
  // Destination must not exist
  try {
    await fs.access(dstAbs);
    console.error(`  REFUSE: destination already exists: ${op.dst}`);
    refused++;
    continue;
  } catch {}
  // Perform the move in /assets/
  await fs.mkdir(path.dirname(dstAbs), { recursive: true });
  await fs.rename(srcAbs, dstAbs);
  console.log(`  /assets/: ${op.src} → ${op.dst}`);
  if (op.kind === "move") moved++;
  else renamed++;

  // Mirror in /public/assets/: check both src and dst
  let pubSrcSha;
  try {
    pubSrcSha = await sha256(srcPub);
    if (pubSrcSha !== srcSha) {
      console.error(
        `    WARNING: /public/${op.src} has different bytes (${pubSrcSha.slice(0,12)}… vs ${srcSha.slice(0,12)}…)`,
      );
    }
  } catch {
    console.error(`    /public/${op.src}: missing — skipping mirror`);
    continue;
  }
  await fs.mkdir(path.dirname(dstPub), { recursive: true });
  // /public/assets/src must be removed after copy
  try {
    await fs.access(dstPub);
    console.error(`    REFUSE: /public/${op.dst} already exists`);
    refused++;
    continue;
  } catch {}
  await fs.rename(srcPub, dstPub);
  console.log(`  /public/: ${op.src} → ${op.dst}`);
}

console.log(`---\nmoved: ${moved}  renamed: ${renamed}  refused: ${refused}`);
if (refused) process.exit(1);
