#!/usr/bin/env node
/**
 * CSV → personalized invitation URLs (REF-04 §4).
 *
 * Usage:
 *   node --env-file=.env scripts/generate-guest-links.mjs guests.csv > links.csv
 *   npm run guest-links -- guests.csv > links.csv
 *
 * Input CSV: first column is the guest display name. Header row required
 * (e.g. `nama` or `name`). Extra columns are ignored.
 *
 * Output CSV: `nama,link`
 * Link shape: `${NEXT_PUBLIC_SITE_URL}/?to=${encodeURIComponent(nama)}`
 *
 * Does not invent names. Does not call the network. Safe to run offline.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error(
    "Usage: node scripts/generate-guest-links.mjs <guests.csv> > links.csv",
  );
  process.exit(1);
}

const base = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://nikah.example"
).replace(/\/$/, "");

let raw;
try {
  raw = readFileSync(resolve(inputPath), "utf8");
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Failed to read ${inputPath}: ${message}`);
  process.exit(1);
}

const lines = raw
  .replace(/^\uFEFF/, "")
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean);

if (lines.length < 2) {
  console.error("CSV needs a header row plus at least one guest name.");
  process.exit(1);
}

/** Minimal CSV field parse — supports quoted commas in names. */
function firstField(line) {
  if (line.startsWith('"')) {
    const end = line.indexOf('"', 1);
    if (end > 0) return line.slice(1, end).replace(/""/g, '"').trim();
  }
  return line.split(",")[0]?.trim() ?? "";
}

const header = firstField(lines[0]).toLowerCase();
if (!header || !(header.includes("nama") || header.includes("name"))) {
  console.error(
    `Expected a header like "nama" or "name", got: ${lines[0].slice(0, 40)}`,
  );
  process.exit(1);
}

console.log("nama,link");
for (const line of lines.slice(1)) {
  const nama = firstField(line);
  if (!nama) continue;
  const escaped = nama.includes(",") || nama.includes('"')
    ? `"${nama.replace(/"/g, '""')}"`
    : nama;
  console.log(`${escaped},${base}/?to=${encodeURIComponent(nama)}`);
}
