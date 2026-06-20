#!/usr/bin/env node
/**
 * Query the asset manifest. Examples:
 *
 *   node tools/asset-manifest/query.mjs find <sha256-prefix-or-full>
 *   node tools/asset-manifest/query.mjs duplicates
 *   node tools/asset-manifest/query.mjs path <relative-path>
 *   node tools/asset-manifest/query.mjs where <sha256>
 *
 * Exits 0 with JSON on stdout, or 2 with message if not found.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, "manifest.json");

const [, , cmd, ...args] = process.argv;

if (!cmd) {
  console.error("usage: query.mjs <find|duplicates|path|where> <arg>");
  process.exit(2);
}

const raw = await fs.readFile(manifestPath, "utf8");
const manifest = JSON.parse(raw);

function dump(value, code = 0) {
  process.stdout.write(JSON.stringify(value, null, 2) + "\n");
  process.exit(code);
}

function duplicates(entries) {
  const byHash = new Map();
  for (const e of entries) {
    if (!byHash.has(e.sha256)) byHash.set(e.sha256, []);
    byHash.get(e.sha256).push(e);
  }
  return [...byHash.entries()]
    .filter(([, v]) => v.length > 1)
    .map(([sha, paths]) => ({ sha256: sha, paths: paths.map((p) => p.path) }));
}

switch (cmd) {
  case "duplicates":
    dump({ duplicates: duplicates(manifest.entries) });
  // eslint-disable-next-line no-fallthrough
  case "find": {
    const needle = (args[0] ?? "").toLowerCase();
    if (!needle) {
      console.error("usage: query.mjs find <sha256-prefix>");
      process.exit(2);
    }
    const matches = manifest.entries.filter((e) => e.sha256.toLowerCase().startsWith(needle));
    if (!matches.length) {
      console.error(`no entry matches sha256 prefix: ${needle}`);
      process.exit(2);
    }
    dump({ matches });
  }
  case "path": {
    const needle = (args[0] ?? "").replace(/\\/g, "/");
    const exact = manifest.entries.find((e) => e.path === needle);
    if (!exact) {
      console.error(`no entry at path: ${needle}`);
      process.exit(2);
    }
    dump(exact);
  }
  case "where": {
    const needle = (args[0] ?? "").toLowerCase();
    const full = manifest.entries.find((e) => e.sha256.toLowerCase() === needle);
    if (!full) {
      console.error(`no entry with exact sha256: ${needle}`);
      process.exit(2);
    }
    dump(full);
  }
  default:
    console.error(`unknown command: ${cmd}`);
    process.exit(2);
}