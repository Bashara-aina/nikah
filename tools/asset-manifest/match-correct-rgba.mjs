#!/usr/bin/env node
/**
 * Match every file in Recovered/correct-rgba/ against the curated set
 * (assets/ + nikah-web/public/assets/) by 8x8 aHash similarity.
 *
 * Emits a JSON object on stdout:
 *   { matches: [ { rgba: "Recovered/correct-rgba/N.png", curated: "assets/…", hamming, similarity } ] }
 * sorted by ascending hamming (= most similar first), top 3 per rgba file.
 */
import path from "node:path";
import url from "node:url";
import { createRequire } from "node:module";
import { promises as fs } from "node:fs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");

const CURATED_DIRS = [
  path.join(REPO, "assets"),
  path.join(REPO, "nikah-web", "public", "assets"),
];
const SOURCE_DIR = path.join(REPO, "Recovered", "correct-rgba");
const SIZE = 8;

async function aHash(absPath) {
  let data;
  try {
    const r = await sharp(absPath, { failOn: "none" })
      .grayscale()
      .resize(SIZE, SIZE, { fit: "fill" })
      .raw()
      .toBuffer({ resolveWithObject: true });
    data = r.data;
  } catch (err) {
    console.error(`[aHash] failed on ${absPath}: ${err.message}`);
    return 0n;
  }
  if (!data || !data.length) return 0n;
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  let bits = "";
  for (let i = 0; i < data.length; i++) bits += data[i] >= avg ? "1" : "0";
  const hex = bits
    .match(/.{1,4}/g)
    .map((g) => parseInt(g, 2).toString(16))
    .join("");
  return BigInt("0x" + hex);
}

function hamming(a, b) {
  let x = a ^ b;
  let c = 0n;
  while (x) {
    c += x & 1n;
    x >>= 1n;
  }
  return Number(c);
}

async function walk(dir) {
  const out = [];
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
    if (e.isDirectory()) out.push(...(await walk(abs)));
    else if (/\.(png|jpg|jpeg|webp|avif)$/i.test(e.name)) out.push(abs);
  }
  return out;
}

async function main() {
  const sourceFiles = (await fs.readdir(SOURCE_DIR))
    .filter((f) => /^\d+\.png$/.test(f))
    .map((f) => path.join(SOURCE_DIR, f))
    .sort((a, b) => parseInt(path.basename(a)) - parseInt(path.basename(b)));

  const curatedFiles = [];
  for (const d of CURATED_DIRS) curatedFiles.push(...(await walk(d)));

  const curatedHashes = await Promise.all(curatedFiles.map(aHash));
  const sourceHashes = await Promise.all(sourceFiles.map(aHash));

  const matches = [];
  for (let i = 0; i < sourceFiles.length; i++) {
    const sha = sourceHashes[i];
    const relSrc = path.relative(REPO, sourceFiles[i]).replace(/\\/g, "/");
    const ranked = curatedFiles
      .map((p, j) => ({
        curated: path.relative(REPO, p).replace(/\\/g, "/"),
        hamming: hamming(sha, curatedHashes[j]),
      }))
      .sort((a, b) => a.hamming - b.hamming)
      .slice(0, 3);
    matches.push({ rgba: relSrc, top3: ranked });
  }

  process.stdout.write(JSON.stringify({ matches }, null, 2) + "\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});