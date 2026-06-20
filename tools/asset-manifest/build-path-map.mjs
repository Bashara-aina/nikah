#!/usr/bin/env node
/**
 * Build a /assets/<old path> -> /assets/<new path> lookup table from
 * reorg-plan.json. Output is a JSON object suitable for sed-like replacement.
 *
 * Only includes entries where action === "move" (i.e. the file actually
 * relocated). Files that stayed in place map to themselves.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const plan = JSON.parse(
  await fs.readFile(path.join(__dirname, "reorg-plan.json"), "utf8"),
);

const map = {};
for (const r of plan) {
  const fromUrl = "/" + r.from; // e.g. "/assets/florals/accent-doves.png"
  if (r.action === "move") {
    map[fromUrl] = "/" + r.to;
  } else {
    map[fromUrl] = fromUrl; // unchanged
  }
}
await fs.writeFile(
  path.join(__dirname, "path-map.json"),
  JSON.stringify(map, null, 2),
);
console.log(`wrote ${Object.keys(map).length} path mappings to path-map.json`);
