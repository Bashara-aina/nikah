#!/usr/bin/env node
/**
 * Mirror /assets into /public/assets before dev/build.
 * Excludes `_source` and dotfiles. Pure Node, no deps.
 */
import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// nikah-web is inside nikah/. Repo root is one level up.
const repoRoot = path.resolve(__dirname, "..", "..");
const srcRoot = path.join(repoRoot, "assets");
const dstRoot = path.resolve(__dirname, "..", "public", "assets");

const FOLDERS = [
  "cats",
  "couple",
  "gallery",
  "cutout",
  "scene",
  "audio",
];

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const srcPath = path.join(from, entry.name);
    const dstPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, dstPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, dstPath);
    }
  }
}

async function main() {
  if (!existsSync(srcRoot)) {
    console.error(`[copy-assets] source not found: ${srcRoot}`);
    process.exit(0); // don't fail the build; site still runs
  }
  let total = 0;
  for (const folder of FOLDERS) {
    const from = path.join(srcRoot, folder);
    const to = path.join(dstRoot, folder);
    if (!existsSync(from)) {
      console.warn(`[copy-assets] skip (missing): ${folder}`);
      continue;
    }
    await copyDir(from, to);
    const files = await fs.readdir(from);
    total += files.length;
    console.log(`[copy-assets] ${folder} (${files.length} files)`);
  }
  console.log(`[copy-assets] done — ${total} files -> public/assets`);
}

main().catch((err) => {
  console.error("[copy-assets] failed:", err);
  process.exit(1);
});