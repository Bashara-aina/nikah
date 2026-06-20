#!/usr/bin/env node
/**
 * Remove stale files from /public/assets/ that no longer have a
 * corresponding source in /assets/ (after the cutout/scene reorg).
 *
 * For each subject folder that was emptied (scenes, florals, illustrations),
 * delete every file under /public/assets/<folder>/ that does NOT exist in
 * /assets/<folder>/. Keeps any file whose name still has a canonical
 * counterpart.
 *
 * Also: remove the entire cats/ folder from public if it is a mirror of
 * /assets/cats/ — keep that one in sync. Same for couple, gallery, audio.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const ASSETS = path.join(REPO, "assets");
const PUBLIC = path.join(REPO, "nikah-web", "public", "assets");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function list(dir) {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

const SUBJECT_FOLDERS = ["scenes", "florals", "illustrations"];
const NEW_FOLDERS = ["cutout", "scene"];

let deleted = 0, kept = 0;
for (const folder of SUBJECT_FOLDERS) {
  const publicDir = path.join(PUBLIC, folder);
  const assetsDir = path.join(ASSETS, folder);
  const assetsFiles = new Set(await list(assetsDir));
  const publicFiles = await list(publicDir);
  for (const f of publicFiles) {
    if (f.startsWith(".")) continue;
    const publicFile = path.join(publicDir, f);
    const stat = await fs.stat(publicFile);
    if (stat.isDirectory()) {
      // Recurse one level (the old distribution created e.g. scenes/ subdirs sometimes)
      const subFiles = await list(publicFile);
      for (const sf of subFiles) {
        const subPath = path.join(publicFile, sf);
        const subStat = await fs.stat(subPath);
        if (subStat.isFile()) {
          if (assetsFiles.has(sf) || assetsFiles.has(path.basename(sf))) {
            kept++;
          } else {
            await fs.unlink(subPath);
            console.log(`  deleted: public/assets/${folder}/${f}/${sf}`);
            deleted++;
          }
        }
      }
      // remove the now-empty dir if applicable
      const remaining = await list(publicFile);
      if (!remaining.length) {
        await fs.rmdir(publicFile);
        console.log(`  removed empty dir: public/assets/${folder}/${f}/`);
      }
      continue;
    }
    if (assetsFiles.has(f)) {
      kept++;
    } else {
      await fs.unlink(publicFile);
      console.log(`  deleted: public/assets/${folder}/${f}`);
      deleted++;
    }
  }
}

// New folders: verify all files there exist in /assets/, drop anything not in source.
for (const folder of NEW_FOLDERS) {
  const publicDir = path.join(PUBLIC, folder);
  const assetsDir = path.join(ASSETS, folder);
  const assetsFiles = new Set(await list(assetsDir));
  const publicFiles = await list(publicDir);
  for (const f of publicFiles) {
    if (f.startsWith(".")) continue;
    if (assetsFiles.has(f)) {
      kept++;
    } else {
      await fs.unlink(path.join(publicDir, f));
      console.log(`  deleted: public/assets/${folder}/${f} (no asset counterpart)`);
      deleted++;
    }
  }
}

// Remove top-level .DS_Store if present anywhere
async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(abs);
    else yield abs;
  }
}
for await (const f of walk(PUBLIC)) {
  if (path.basename(f) === ".DS_Store") {
    await fs.unlink(f);
    console.log(`  deleted: ${path.relative(REPO, f)}`);
    deleted++;
  }
}

console.log(`---\ndeleted: ${deleted}  kept: ${kept}`);
