#!/usr/bin/env node
/**
 * Execute the dedup plan from dedup-plan.json. For each entry, verify the
 * kept twin still exists with the expected sha256 BEFORE deleting the
 * source. Refuse if anything drifts.
 *
 * Idempotent: skips files already absent.
 */
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");

const plan = JSON.parse(
  await fs.readFile(path.join(__dirname, "dedup-plan.json"), "utf8"),
);

async function sha256(p) {
  const buf = await fs.readFile(p);
  return createHash("sha256").update(buf).digest("hex");
}

let deleted = 0, refused = 0, alreadyGone = 0;
for (const r of plan.plan) {
  const from = path.join(REPO, r.from);
  const twin = path.join(REPO, r.keptTwin);

  try {
    await fs.access(from);
  } catch {
    alreadyGone++;
    continue;
  }
  // Verify twin exists and has the expected bytes
  let twinSha;
  try {
    twinSha = await sha256(twin);
  } catch {
    console.error(
      `  REFUSE: kept twin missing\n` + `    from:  ${r.from}\n` + `    twin:  ${r.keptTwin}`,
    );
    refused++;
    continue;
  }
  if (twinSha !== r.sha256) {
    console.error(
      `  REFUSE: kept twin has different bytes\n` +
        `    from: ${r.from}\n` +
        `    twin: ${r.keptTwin}\n` +
        `    expected ${r.sha256.slice(0, 12)}…\n` +
        `    got      ${twinSha.slice(0, 12)}…`,
    );
    refused++;
    continue;
  }
  await fs.unlink(from);
  console.log(`  deleted: ${r.from}`);
  deleted++;
}

console.log(`---\ndeleted: ${deleted}  refused: ${refused}  already-gone: ${alreadyGone}`);
if (refused) process.exit(1);
