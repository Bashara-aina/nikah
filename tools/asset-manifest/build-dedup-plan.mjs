#!/usr/bin/env node
/**
 * Build the dedup plan for /public/assets/. For every file in the legacy
 * subject folders (florals/, illustrations/, scenes/) that has a byte-
 * identical twin in either cutout/ or scene/, mark the legacy copy as
 * "delete" and record the kept twin's path.
 *
 * Refuses to mark any file for deletion unless:
 *   - it lives in one of the legacy subject folders, AND
 *   - it has at least one byte-twin elsewhere under /public/assets/.
 *
 * Writes tools/asset-manifest/dedup-plan.json. Reports a summary.
 */
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const PUBLIC = path.join(REPO, "nikah-web", "public", "assets");

const LEGACY_SUBJECTS = new Set(["florals", "illustrations", "scenes"]);

async function sha256(p) {
  const buf = await fs.readFile(p);
  return createHash("sha256").update(buf).digest("hex");
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
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) await walk(abs, out);
    else if (/\.(png|webp|avif|jpg|jpeg)$/i.test(e.name)) out.push(abs);
  }
  return out;
}

const all = await walk(PUBLIC);

// Bucket every file by sha256
const hashToFiles = new Map();
for (const f of all) {
  const s = await sha256(f);
  if (!hashToFiles.has(s)) hashToFiles.set(s, []);
  hashToFiles.get(s).push(f);
}

// Decide which files are deletable. Rule: only delete if the file lives in
// one of the legacy subject folders AND there's at least one twin elsewhere
// under /public/assets/. We never delete from cutout/, scene/, cats/, couple/,
// gallery/, audio/.
const plan = [];
const refused = [];

for (const [sha, files] of hashToFiles) {
  if (files.length < 2) continue; // unique — not a duplicate
  const legacy = files.filter((f) => {
    const rel = path.relative(PUBLIC, f);
    const top = rel.split(path.sep)[0];
    return LEGACY_SUBJECTS.has(top);
  });
  if (!legacy.length) continue;
  const twins = files.filter((f) => !legacy.includes(f));
  for (const f of legacy) {
    plan.push({
      action: "delete",
      from: path.relative(REPO, f),
      sha256: sha,
      keptTwin: path.relative(REPO, twins[0]),
      keptTwinCount: twins.length,
    });
  }
}

// Sanity check: are there files in legacy folders that have NO byte twin?
// These would be unique-but-untracked files we'd lose.
const orphanLegacy = [];
for (const f of all) {
  const rel = path.relative(PUBLIC, f);
  const top = rel.split(path.sep)[0];
  if (!LEGACY_SUBJECTS.has(top)) continue;
  const s = await sha256(f);
  const twins = hashToFiles.get(s).filter((x) => x !== f);
  if (!twins.length) {
    orphanLegacy.push(path.relative(REPO, f));
  }
}

await fs.writeFile(
  path.join(__dirname, "dedup-plan.json"),
  JSON.stringify({ plan, orphanLegacy, summary: { delete: plan.length, orphanLegacy: orphanLegacy.length } }, null, 2),
);
console.log(JSON.stringify({ delete: plan.length, orphanLegacy: orphanLegacy.length }, null, 2));
console.log("wrote", path.join(__dirname, "dedup-plan.json"));
if (orphanLegacy.length) {
  console.error("REFUSE: legacy files with no byte twin:");
  for (const o of orphanLegacy) console.error("  ", o);
  process.exit(1);
}
