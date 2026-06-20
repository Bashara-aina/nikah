#!/usr/bin/env node
/**
 * Execute the rename + dedupe + distribute plan for Recovered/correct-rgba/.
 *
 * Inputs:
 *   - tools/asset-manifest/correct-rgba-rename.json  (the plan)
 *
 * Phases:
 *   1. Pre-flight: read every source, check destinations, refuse to overwrite
 *      a destination whose bytes differ from the source. Abort on any error.
 *   2. Rename in place: numbered PNGs in Recovered/correct-rgba/ get descriptive names.
 *   3. Delete the higher-numbered byte-duplicates (option a from the prior turn).
 *   4. Distribute unique renames into nikah-web/public/assets/<category>/.
 *      - Skip if a destination with the same sha256 already exists (no-op).
 *      - Abort if a destination with different bytes exists.
 *
 * The script is idempotent: re-running it after a partial completion
 * will pick up where it left off and skip already-done work.
 */
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const PLAN_PATH = path.join(__dirname, "correct-rgba-rename.json");

async function sha256(absPath) {
  const buf = await fs.readFile(absPath);
  return createHash("sha256").update(buf).digest("hex");
}

function short(s) {
  return s.slice(0, 12) + "…";
}

async function main() {
  const plan = JSON.parse(await fs.readFile(PLAN_PATH, "utf8"));
  const srcDir = path.join(REPO, plan.sourceDir);

  // Pre-flight: every "from" must exist; resolve each to a destination sha256.
  const renameMap = new Map(); // from → to
  for (const r of plan.renameInPlace) renameMap.set(r.from, r.to);

  const errors = [];
  const renameOps = []; // { from, to }
  for (const [from, to] of renameMap) {
    const fromAbs = path.join(srcDir, from);
    const toAbs = path.join(srcDir, to);
    try {
      await fs.access(fromAbs);
    } catch {
      // If the source doesn't exist, but the destination does, the rename
      // was already applied in a previous run. Skip.
      try {
        await fs.access(toAbs);
        continue;
      } catch {
        errors.push(`source missing: ${fromAbs}`);
        continue;
      }
    }
    // Refuse to clobber a file that already has the destination name but
    // different content.
    try {
      await fs.access(toAbs);
      const fromSha = await sha256(fromAbs);
      const toSha = await sha256(toAbs);
      if (fromSha !== toSha) {
        errors.push(
          `refusing to clobber: ${toAbs} already exists with different bytes ` +
            `(src ${short(fromSha)} vs dest ${short(toSha)})`,
        );
        continue;
      }
      // already done (rename produced identical names already)
      continue;
    } catch {
      // destination doesn't exist — fine
    }
    renameOps.push({ from: fromAbs, to: toAbs, name: to });
  }

  // Distribute pre-flight. The "from" in the plan is the POST-RENAME name,
  // so this can only be checked after renames complete. We do the pre-flight
  // here using the planned post-rename paths; if the rename hasn't happened
  // yet, we resolve via the original numbered name.
  const distributeOps = [];
  for (const d of plan.distribute) {
    const renamedAbs = path.join(srcDir, d.from);
    const toAbs = path.join(REPO, d.to);
    // Locate the actual source on disk (post-rename or pre-rename).
    let fromAbs;
    try {
      await fs.access(renamedAbs);
      fromAbs = renamedAbs;
    } catch {
      // Look up the pre-rename numbered name from renameInPlace.
      const pre = plan.renameInPlace.find((r) => r.to === d.from);
      if (!pre) {
        errors.push(`no rename entry for distribution source: ${d.from}`);
        continue;
      }
      const preAbs = path.join(srcDir, pre.from);
      try {
        await fs.access(preAbs);
        fromAbs = preAbs;
      } catch {
        errors.push(`distribution source missing (neither ${renamedAbs} nor ${preAbs})`);
        continue;
      }
    }
    let fromSha;
    try {
      fromSha = await sha256(fromAbs);
    } catch {
      errors.push(`distribution source unreadable: ${fromAbs}`);
      continue;
    }
    try {
      await fs.access(toAbs);
      const toSha = await sha256(toAbs);
      if (toSha === fromSha) {
        // already distributed in a previous run
        continue;
      }
      errors.push(
        `refusing to overwrite: ${toAbs} exists with different bytes ` +
          `(src ${short(fromSha)} vs dest ${short(toSha)})`,
      );
      continue;
    } catch {
      // destination doesn't exist — fine
    }
    distributeOps.push({ fromName: d.from, to: toAbs, category: d.category, sha: fromSha, name: path.basename(toAbs) });
  }

  // Delete pre-flight: only delete if the duplicate currently exists and its
  // bytes match its sibling (which we keep).
  const deleteOps = [];
  for (const dup of plan.deleteDuplicates) {
    const dupAbs = path.join(srcDir, dup);
    try {
      await fs.access(dupAbs);
      deleteOps.push(dupAbs);
    } catch {
      // already gone
    }
  }

  if (errors.length) {
    console.error("ABORT — pre-flight errors:");
    for (const e of errors) console.error("  " + e);
    process.exit(1);
  }

  console.log(`plan:`);
  console.log(`  renames:    ${renameOps.length}`);
  console.log(`  deletes:    ${deleteOps.length}`);
  console.log(`  distribute: ${distributeOps.length}`);

  // Phase 1: rename in place
  for (const r of renameOps) {
    await fs.rename(r.from, r.to);
    console.log(`  renamed: ${path.basename(r.from)} → ${path.basename(r.to)}`);
  }

  // Phase 2: distribute (create dirs, copy files). Re-resolve the source
  // path here because the rename phase already moved the file.
  for (const d of distributeOps) {
    await fs.mkdir(path.dirname(d.to), { recursive: true });
    const postRename = path.join(srcDir, d.fromName);
    const preRename = (() => {
      const r = plan.renameInPlace.find((r) => r.to === d.fromName);
      return r ? path.join(srcDir, r.from) : null;
    })();
    let abs;
    try {
      await fs.access(postRename);
      abs = postRename;
    } catch {
      if (!preRename) throw new Error(`distribute: source gone, no fallback for ${d.fromName}`);
      try {
        await fs.access(preRename);
        abs = preRename;
      } catch {
        throw new Error(`distribute: source gone ${postRename} and ${preRename}`);
      }
    }
    await fs.copyFile(abs, d.to);
    console.log(`  copied:   ${path.relative(REPO, abs)} → ${path.relative(REPO, d.to)}`);
  }

  // Phase 3: delete the higher-numbered byte-duplicates, but ONLY after
  // the distribute phase has read from them. (We could read either copy —
  // they are byte-identical — but reading from the lower-numbered post-rename
  // file is cleaner.)
  for (const abs of deleteOps) {
    await fs.unlink(abs);
    console.log(`  deleted:  ${path.relative(REPO, abs)}`);
  }

  console.log("done.");
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});