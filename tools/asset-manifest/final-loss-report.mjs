import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

async function sha(p) {
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
    if (e.name === "_source") continue;
    const a = path.join(dir, e.name);
    if (e.isDirectory()) await walk(a, out);
    else if (/\.(png|webp|avif|jpg|jpeg)$/i.test(e.name)) out.push(a);
  }
  return out;
}

const current = await walk("/Users/basharaaina/Projects/nikah/assets");
const hashToFiles = new Map();
for (const f of current) {
  const s = await sha(f);
  if (!hashToFiles.has(s)) hashToFiles.set(s, []);
  hashToFiles.get(s).push(f.replace("/Users/basharaaina/Projects/nikah/", ""));
}

const m = JSON.parse(
  await fs.readFile("/Users/basharaaina/Projects/nikah/tools/asset-manifest/manifest.json", "utf8"),
);
const lost = m.entries.filter((e) => e.path.startsWith("nikah-web/public/assets/"));

let present = 0, absent = 0;
const absentList = [];
for (const e of lost) {
  if (hashToFiles.has(e.sha256)) present++;
  else {
    absent++;
    absentList.push(e);
  }
}
console.log("Lost files (per old manifest):", lost.length);
console.log("  bytes already present in current /assets/:", present);
console.log("  bytes absent (genuinely lost):              ", absent);
console.log();
console.log("=== genuinely lost ===");
for (const e of absentList) {
  console.log("  ", e.path, e.sha256.slice(0, 12) + "…");
}
