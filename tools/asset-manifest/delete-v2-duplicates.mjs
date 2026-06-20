#!/usr/bin/env node
/**
 * Delete the higher-numbered byte-duplicates that are still present under
 * their post-rename names. Run after execute-correct-rgba-rename.mjs.
 *
 * Verifies byte-equality with the kept sibling before deleting; refuses
 * to delete if the pair is not actually a duplicate (safety net for any
 * future plan drift).
 */
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const SRC_DIR = path.join(REPO, "Recovered", "correct-rgba");

const PAIRS = [
  ["meadow-daisies.png",          "scene-meadow-daisies.png"],          // 6 keeps / 37 dropped
  ["accent-doves-pair.png",       "accent-doves-pair-v2.png"],          // 18 / 38
  ["accent-doves-arch.png",       "accent-doves-arch-v2.png"],          //  9 / 39
  ["cat-grass-frontal.png",       "cat-grass-frontal-v2.png"],          // 17 / 40
  ["cat-in-flowers.png",          "cat-in-flowers-v2.png"],             //  7 / 41
  ["accent-doves-heart.png",      "accent-doves-heart-v2.png"],         //  8 / 42
  ["cat-sleeping-wreath.png",     "cat-sleeping-wreath-v2.png"],        //  5 / 43
];

async function sha256(p) {
  const buf = await fs.readFile(p);
  return createHash("sha256").update(buf).digest("hex");
}

let deleted = 0, kept = 0, refused = 0;
for (const [keepName, dropName] of PAIRS) {
  const keepAbs = path.join(SRC_DIR, keepName);
  const dropAbs = path.join(SRC_DIR, dropName);
  try {
    await fs.access(dropAbs);
  } catch {
    console.log(`  skip (already gone): ${dropName}`);
    kept++;
    continue;
  }
  try {
    await fs.access(keepAbs);
  } catch {
    console.error(`  REFUSE: kept file missing: ${keepAbs}`);
    refused++;
    continue;
  }
  const [ks, ds] = await Promise.all([sha256(keepAbs), sha256(dropAbs)]);
  if (ks !== ds) {
    console.error(`  REFUSE: ${dropName} is not byte-identical to ${keepName} (${ds.slice(0, 12)}… vs ${ks.slice(0, 12)}…)`);
    refused++;
    continue;
  }
  await fs.unlink(dropAbs);
  console.log(`  deleted: ${dropName} (dup of ${keepName})`);
  deleted++;
}
console.log(`---\ndeleted: ${deleted}  kept: ${kept}  refused: ${refused}`);
if (refused) process.exit(1);
