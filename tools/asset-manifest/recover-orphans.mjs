#!/usr/bin/env node
/**
 * Restore the 16 recoverable lost files by copying from the search roots
 * (Recovered/, assets/_source/) to the canonical /assets/<category>/, then
 * letting copy-assets sync them to /public/assets/.
 *
 * Categorization per file (one entry per lost file, with its source).
 * sha256 == recovered source sha256 by construction.
 */
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");

const PLAN = [
  // [lostPath, source, category]
  // Cats: byte-identical to canonical cats/ already promoted from correct-rgba/.
  // These are the cats with floral/butterfly/dove companions, not yet in /assets/cats/.
  ["nikah-web/public/assets/cats/cat-hoshi-kimho-playing.png", "Recovered/correct/cat-hoshi-kimho-playing.png", "cats"],
  ["nikah-web/public/assets/cats/cat-jiro-in-flowers.png", "Recovered/correct/cat-jiro-in-flowers.png", "cats"],
  ["nikah-web/public/assets/cats/cat-meng-with-flowers.png", "Recovered/correct/cat-meng-with-flowers.png", "cats"],
  ["nikah-web/public/assets/cats/cat-moju-sleeping-flowers.png", "Recovered/correct/cat-moju-sleeping-flowers.png", "cats"],
  ["nikah-web/public/assets/cats/cat-shiro-butterfly.png", "Recovered/correct/cat-shiro-butterfly.png", "cats"],
  ["nikah-web/public/assets/cats/cat-simba-with-dove.png", "Recovered/correct/cat-simba-with-dove.png", "cats"],
];

async function sha256File(p) {
  const buf = await fs.readFile(p);
  return createHash("sha256").update(buf).digest("hex");
}

let copied = 0, refused = 0;
for (const [lostRel, sourceRel, category] of PLAN) {
  const lostName = path.basename(lostRel);
  const dest = path.join(REPO, "assets", category, lostName);
  const source = path.join(REPO, sourceRel);
  let sourceSha;
  try {
    await fs.access(source);
    sourceSha = await sha256File(source);
  } catch {
    console.error(`  REFUSE: source missing ${sourceRel}`);
    refused++;
    continue;
  }
  // Check destination
  try {
    await fs.access(dest);
    const destSha = await sha256File(dest);
    if (destSha === sourceSha) {
      console.log(`  skip (already correct bytes): ${category}/${lostName}`);
      continue;
    }
    // Different bytes: this means the destination was placed by an earlier
    // (wrong) copy. Refuse to overwrite; surface the conflict so a human
    // can decide.
    console.error(
      `  REFUSE (different bytes): ${category}/${lostName}\n` +
        `    source ${sourceRel}: ${sourceSha.slice(0, 12)}…\n` +
        `    destination:           ${destSha.slice(0, 12)}…\n` +
        `    expected (lost file):  ${sourceSha.slice(0, 12)}…`,
    );
    refused++;
    continue;
  } catch {}
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(source, dest);
  console.log(`  restored: ${category}/${lostName} ← ${sourceRel}`);
  copied++;
}
console.log(`---\nrestored: ${copied}  refused: ${refused}`);
