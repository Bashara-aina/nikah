#!/usr/bin/env node
/**
 * Execute the cutout/scene reorg inside /assets/. Idempotent.
 *
 * Inputs:
 *   tools/asset-manifest/reorg-plan.json
 *
 * Behavior:
 *   - For every "move" entry, mkdir the destination and `git mv`-equivalent
 *     (here we use plain fs.rename since the working tree may have
 *     uncommitted changes; rename is atomic on the same filesystem).
 *   - Skip if destination already exists with the same sha256 (idempotent).
 *   - Refuse to overwrite a destination with different bytes.
 *   - For "keep" entries, do nothing.
 *
 * Outputs nothing else — the FS move is the output. Logs progress.
 */
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");

async function sha256(absPath) {
  const buf = await fs.readFile(absPath);
  return createHash("sha256").update(buf).digest("hex");
}

function short(s) {
  return s.slice(0, 12) + "…";
}

const plan = JSON.parse(
  await fs.readFile(path.join(__dirname, "reorg-plan.json"), "utf8"),
);

let moved = 0, skipped = 0, refused = 0;
for (const r of plan) {
  if (r.action === "keep") {
    skipped++;
    continue;
  }
  const from = path.join(REPO, r.from);
  const to = path.join(REPO, r.to);
  try {
    await fs.access(from);
  } catch {
    // already moved in a prior run
    skipped++;
    continue;
  }
  try {
    await fs.access(to);
    const fromSha = await sha256(from);
    const toSha = await sha256(to);
    if (fromSha === toSha) {
      // already at destination, identical — complete the move by removing source.
      await fs.unlink(from);
      console.log(`  already-moved: ${r.from} → ${r.to}`);
      moved++;
      continue;
    }
    console.error(
      `  REFUSE: ${r.to} exists with different bytes ` +
        `(src ${short(fromSha)} vs dest ${short(toSha)})`,
    );
    refused++;
    continue;
  } catch {
    // destination missing — fine
  }
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.rename(from, to);
  console.log(`  moved: ${r.from} → ${r.to}`);
  moved++;
}

console.log(`---\nmoved: ${moved}  skipped: ${skipped}  refused: ${refused}`);
if (refused) process.exit(1);
