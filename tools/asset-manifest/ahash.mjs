#!/usr/bin/env node
/**
 * Compute 8x8 average-hash (aHash) for every file passed on stdin / as args.
 * Used to surface visually similar images even when bytes differ (e.g. RGBA
 * vs RGB, or re-encoded).
 *
 * Usage:
 *   node ahash.mjs <file> [file ...]
 *
 * Output: JSON array, one entry per file:
 *   { path, aHash: "16-hex-chars", brightness: <0-1 avg luminance> }
 *
 * 64 bits of an 8x8 average-hash is enough to group near-duplicates.
 */
import path from "node:path";
import url from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const SIZE = 8;

async function aHash(absPath) {
  const { data, info } = await sharp(absPath, { failOn: "none" })
    .grayscale()
    .resize(SIZE, SIZE, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  let bits = "";
  for (let i = 0; i < data.length; i++) bits += data[i] >= avg ? "1" : "0";
  const hex = bits
    .match(/.{1,4}/g)
    .map((g) => parseInt(g, 2).toString(16))
    .join("");
  return { aHash: hex, brightness: avg / 255 };
}

function hammingHex(a, b) {
  let ai = BigInt("0x" + a);
  let bi = BigInt("0x" + b);
  let x = ai ^ bi;
  let count = 0n;
  while (x) {
    count += x & 1n;
    x >>= 1n;
  }
  return Number(count);
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function main() {
  const repoRoot = path.resolve(__dirname, "..", "..");
  const inputs = process.argv.slice(2);
  if (!inputs.length) {
    console.error("usage: ahash.mjs <file> [file ...]");
    process.exit(2);
  }
  const results = [];
  for (const p of inputs) {
    const abs = path.resolve(repoRoot, p);
    try {
      const h = await aHash(abs);
      results.push({ path: p, ...h });
    } catch (err) {
      results.push({ path: p, error: err.message });
    }
  }
  process.stdout.write(JSON.stringify(results, null, 2) + "\n");
}

// Optional second mode: --compare <a> <b> -- print hamming distance
if (process.argv.includes("--compare")) {
  const idx = process.argv.indexOf("--compare");
  const [a, b] = [process.argv[idx + 1], process.argv[idx + 2]];
  Promise.all([aHash(a), aHash(b)]).then(([ha, hb]) => {
    const d = hammingHex(ha.aHash, hb.aHash);
    console.log(JSON.stringify({ a, b, aHash_a: ha.aHash, aHash_b: hb.aHash, hamming: d, similarity: 1 - d / 64 }, null, 2));
  });
} else {
  main();
}