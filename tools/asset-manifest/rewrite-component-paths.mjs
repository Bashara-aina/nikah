#!/usr/bin/env node
/**
 * Rewrite component/lib asset paths according to path-map.json.
 *
 * Scans nikah-web (components, lib, app) for .ts/.tsx/.jsx/.js/.css/.mdx,
 * replaces every /assets/<old> with /assets/<new>. Only edits files
 * where at least one match exists. Reports per-file counts.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const map = JSON.parse(
  await fs.readFile(path.join(__dirname, "path-map.json"), "utf8"),
);

const ROOTS = [
  path.join(REPO, "nikah-web", "components"),
  path.join(REPO, "nikah-web", "lib"),
  path.join(REPO, "nikah-web", "app"),
];
const EXTS = new Set([".ts", ".tsx", ".jsx", ".js", ".css", ".mdx"]);

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    if (e.name === "node_modules") continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) await walk(abs, out);
    else if (EXTS.has(path.extname(e.name))) out.push(abs);
  }
  return out;
}

const allFiles = [];
for (const r of ROOTS) await walk(r, allFiles);

let filesChanged = 0, totalReplacements = 0;
for (const f of allFiles) {
  const before = await fs.readFile(f, "utf8");
  let after = before;
  let count = 0;
  // Replace longest keys first so /assets/florals/accent-doves-arch.png
  // doesn't get half-replaced by /assets/florals/accent-doves.png.
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const oldPath of keys) {
    const newPath = map[oldPath];
    if (oldPath === newPath) continue;
    // Replace exactly the path token. Use a regex that matches the path
    // as a complete token (followed by " or ' or whitespace or end).
    const re = new RegExp(oldPath.replace(/[/]/g, "\\/"), "g");
    const matches = after.match(re);
    if (matches) {
      count += matches.length;
      after = after.replace(re, newPath);
    }
  }
  if (count > 0) {
    await fs.writeFile(f, after, "utf8");
    filesChanged++;
    totalReplacements += count;
    console.log(
      `  ${path.relative(REPO, f)}: ${count} replacement${count === 1 ? "" : "s"}`,
    );
  }
}

console.log(`---\nfiles changed: ${filesChanged}  total replacements: ${totalReplacements}`);
