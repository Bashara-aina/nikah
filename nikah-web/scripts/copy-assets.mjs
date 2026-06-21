#!/usr/bin/env node
/**
 * Mirrors /assets/* (monorepo root, source of truth) into nikah-web/public/assets/*.
 * Runs on predev / prebuild. Keeps `public/assets/` regenerable and never hand-edited.
 */
import { cp, mkdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "..", "..");
const src = path.join(repoRoot, "assets");
const dest = path.join(__dirname, "..", "public", "assets");

async function main() {
  if (!existsSync(src)) {
    console.warn(`[copy-assets] source not found at ${src} — skipping`);
    return;
  }

  await mkdir(path.dirname(dest), { recursive: true });
  await rm(dest, { recursive: true, force: true });
  await cp(src, dest, { recursive: true });
  const s = await stat(dest);
  console.log(`[copy-assets] mirrored assets → ${dest} (${s.size} bytes root)`);
}

main().catch((err) => {
  console.error("[copy-assets] failed:", err);
  process.exitCode = 1;
});