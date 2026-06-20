#!/usr/bin/env node
/**
 * Build (or update) the asset manifest for the nikah monorepo.
 *
 * Walks three roots:
 *   - assets/                 (curated, source of truth)
 *   - nikah-web/public/assets/ (generated; copy of assets/ via copy-assets.mjs)
 *   - Recovered/              (legacy snapshot — verify before consuming)
 *
 * For each image file, records:
 *   - relative path (monorepo-root-relative)
 *   - sha256 (BLAKE3-fallback-to-SHA-256)
 *   - size in bytes
 *   - sharp metadata: format, width, height, channels, hasAlpha, space
 *
 * Output: tools/asset-manifest/manifest.json
 *         tools/asset-manifest/manifest.txt   (human-readable)
 *
 * Usage:
 *   node tools/asset-manifest/build-manifest.mjs           # full build
 *   node tools/asset-manifest/build-manifest.mjs --diff    # show only changed/new files vs last manifest
 *
 * Why this exists: any claim that two files are "the same image" must be backed
 * by a hash comparison against a manifest on disk, not by filename, dimensions,
 * or visual memory. See .cursor/rules/image-verification.mdc.
 */
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

const ROOTS = [
  { id: "assets", dir: path.join(repoRoot, "assets") },
  { id: "public", dir: path.join(repoRoot, "nikah-web", "public", "assets") },
  { id: "recovered", dir: path.join(repoRoot, "Recovered") },
];

const IMAGE_EXTS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".heic",
  ".tif",
  ".tiff",
]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "_source"]);

const manifestPath = path.join(__dirname, "manifest.json");
const textPath = path.join(__dirname, "manifest.txt");

async function hashFile(absPath) {
  const buf = await fs.readFile(absPath);
  return createHash("sha256").update(buf).digest("hex");
}

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(abs)));
    } else if (entry.isFile() && IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      out.push(abs);
    }
  }
  return out;
}

async function recordFile(absPath, rootDir) {
  const rel = path.relative(repoRoot, absPath).replace(/\\/g, "/");
  const stat = await fs.stat(absPath);
  const sha = await hashFile(absPath);
  let meta = {};
  try {
    const m = await sharp(absPath, { failOn: "none" }).metadata();
    meta = {
      format: m.format,
      width: m.width,
      height: m.height,
      channels: m.channels,
      hasAlpha: m.hasAlpha,
      space: m.space,
    };
  } catch (err) {
    meta = { error: err.message };
  }
  return {
    path: rel,
    root: path.relative(repoRoot, rootDir).replace(/\\/g, "/"),
    sha256: sha,
    sizeBytes: stat.size,
    mtimeMs: stat.mtimeMs,
    ...meta,
  };
}

async function loadPrevious() {
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    const parsed = JSON.parse(raw);
    const byPath = new Map();
    for (const e of parsed.entries ?? []) byPath.set(e.path, e);
    return byPath;
  } catch {
    return new Map();
  }
}

function diffEntries(prev, next) {
  const nextByPath = new Map(next.map((e) => [e.path, e]));
  const prevByPath = new Map(prev.map((e) => [e.path, e]));
  const added = [];
  const removed = [];
  const changed = [];
  for (const [p, e] of nextByPath) {
    if (!prevByPath.has(p)) added.push(e);
    else {
      const old = prevByPath.get(p);
      if (old.sha256 !== e.sha256 || old.sizeBytes !== e.sizeBytes) {
        changed.push({ path: p, old, next: e });
      }
    }
  }
  for (const [p, e] of prevByPath) if (!nextByPath.has(p)) removed.push({ path: p, ...e });
  return { added, removed, changed };
}

function duplicates(entries) {
  const byHash = new Map();
  for (const e of entries) {
    if (!byHash.has(e.sha256)) byHash.set(e.sha256, []);
    byHash.get(e.sha256).push(e.path);
  }
  return [...byHash.entries()].filter(([, paths]) => paths.length > 1);
}

async function main() {
  const showDiff = process.argv.includes("--diff");
  const prev = showDiff ? await loadPrevious() : new Map();

  const all = [];
  for (const root of ROOTS) {
    const files = await walk(root.dir);
    for (const f of files) {
      all.push(await recordFile(f, root.dir));
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    repoRoot,
    roots: ROOTS.map((r) => r.id),
    entryCount: all.length,
    duplicateCount: duplicates(all).length,
    entries: all,
  };
  await fs.writeFile(manifestPath, JSON.stringify(payload, null, 2));

  // human-readable
  const lines = [
    `# nikah asset manifest`,
    `# generated: ${payload.generatedAt}`,
    `# entries:    ${payload.entryCount}`,
    `# duplicates: ${payload.duplicateCount}`,
    ``,
    `sha256                              bytes   fmt   dim       alpha  path`,
    `-`.repeat(120),
  ];
  for (const e of all.sort((a, b) => a.path.localeCompare(b.path))) {
    const sha = e.sha256?.slice(0, 32) ?? "(no hash)";
    const dim = e.width ? `${String(e.width).padStart(4)}x${String(e.height).padEnd(4)}` : "  -  ";
    lines.push(
      `${sha}  ${String(e.sizeBytes).padStart(7)}  ${(e.format ?? "?").padEnd(4)}  ${dim}  ${e.hasAlpha ? "yes" : " no"}  ${e.path}`,
    );
  }
  const dupes = duplicates(all);
  if (dupes.length) {
    lines.push("", "# duplicates (same sha256, different paths):");
    for (const [sha, paths] of dupes) lines.push(`  ${sha.slice(0, 16)}…  ${paths.join("  =  ")}`);
  }
  await fs.writeFile(textPath, lines.join("\n") + "\n");

  if (showDiff) {
    const prevList = [...prev.values()];
    const { added, removed, changed } = diffEntries(prevList, all);
    console.log(`[manifest] added:   ${added.length}`);
    console.log(`[manifest] removed: ${removed.length}`);
    console.log(`[manifest] changed: ${changed.length}`);
    for (const e of added) console.log(`  + ${e.path}`);
    for (const e of removed) console.log(`  - ${e.path}  (${e.sha256?.slice(0, 12)}…)`);
    for (const e of changed) {
      console.log(`  ~ ${e.path}`);
      console.log(`    old: ${e.old.sha256.slice(0, 16)}…  ${e.old.sizeBytes}B`);
      console.log(`    new: ${e.next.sha256.slice(0, 16)}…  ${e.next.sizeBytes}B`);
    }
  } else {
    console.log(`[manifest] wrote ${manifestPath} (${all.length} entries, ${dupes.length} duplicate groups)`);
    console.log(`[manifest] wrote ${textPath}`);
  }
}

main().catch((err) => {
  console.error("[manifest] failed:", err);
  process.exit(1);
});