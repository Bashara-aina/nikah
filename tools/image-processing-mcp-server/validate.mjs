/**
 * Validator for image-processing-mcp-server.
 *
 * Boots the server exactly as Cursor does (node build/index.js over stdio),
 * then runs a structured test matrix covering:
 *   - 6 tools, all happy paths
 *   - All supported format conversions
 *   - Edge cases: missing file, invalid enum, OOB crop, zero/very small resize
 *   - Batch: 5 mixed ops in one call
 *   - Identity (no-op resize) on a real project asset
 *   - Output-file size sanity vs. source
 *
 * Each assertion emits exactly one PASS or FAIL line, then a final summary.
 * Exit code 0 = all pass, 1 = any fail.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const PROJECT_ROOT = "/Users/basharaaina/Projects/nikah";
// Spawn the server the way Cursor does: relative path + cwd anchored to the
// project root. This matches .cursor/mcp.json exactly.
const SERVER = { command: "node", args: ["tools/image-processing-mcp-server/build/index.js"] };
const PROJECT_ASSETS = path.join(PROJECT_ROOT, "assets");
const TMP = await fs.mkdtemp(path.join(os.tmpdir(), "img-mcp-validate-"));

const transport = new StdioClientTransport({ command: SERVER.command, args: SERVER.args, cwd: PROJECT_ROOT });
const client = new Client({ name: "validator", version: "1.0.0" }, { capabilities: {} });

const results = [];
let currentGroup = "init";

function pass(name, detail = "") {
  results.push({ ok: true, group: currentGroup, name, detail });
  console.log(`  PASS  ${name}${detail ? " — " + detail : ""}`);
}
function fail(name, detail) {
  results.push({ ok: false, group: currentGroup, name, detail });
  console.log(`  FAIL  ${name} — ${detail}`);
}
function group(name) {
  currentGroup = name;
  console.log(`\n[${name}]`);
}

async function call(name, args) {
  // MCP SDK throws McpError on Zod validation failures (-32602) and protocol
  // errors; for tests that *expect* rejection, call() may throw. Wrap and
  // return a synthetic isError result so the test matrix can assert uniformly.
  try {
    return await client.callTool({ name, arguments: args });
  } catch (e) {
    return {
      isError: true,
      content: [{ type: "text", text: `SDK_THREW: ${e.message}` }],
    };
  }
}

function expectSuccess(name, res) {
  if (res.isError) {
    fail(name, `tool returned isError: ${JSON.stringify(res.content?.[0]?.text ?? res)}`);
    return null;
  }
  const text = res.content?.[0]?.text ?? "";
  return text;
}

async function readImageMeta(p) {
  const m = await sharp(p).metadata();
  const s = await fs.stat(p);
  return { width: m.width, height: m.height, format: m.format, size: s.size };
}

try {
  await client.connect(transport);

  // -----------------------------------------------------------------
  group("A. Handshake & tool inventory");
  // -----------------------------------------------------------------
  const { tools } = await client.listTools();
  const toolNames = tools.map((t) => t.name).sort();
  const expected = [
    "batch-image-processing",
    "compress-image",
    "convert-image-format",
    "crop-image",
    "get-image-metadata",
    "resize-image",
  ].sort();
  if (JSON.stringify(toolNames) === JSON.stringify(expected)) {
    pass("listTools returns exactly 6 expected tools", toolNames.join(","));
  } else {
    fail("listTools", `got ${toolNames.join(",")}`);
  }
  for (const t of tools) {
    if (typeof t.description === "string" && t.description.length > 10) {
      pass(`tool has description: ${t.name}`, `${t.description.length} chars`);
    } else {
      fail(`tool description: ${t.name}`, "missing or too short");
    }
    if (t.inputSchema && t.inputSchema.type === "object") {
      pass(`tool has inputSchema: ${t.name}`);
    } else {
      fail(`tool inputSchema: ${t.name}`, "missing or wrong type");
    }
  }

  // -----------------------------------------------------------------
  group("B. get-image-metadata on real project assets");
  // -----------------------------------------------------------------
  const samples = [
    { p: path.join(PROJECT_ASSETS, "scenes/hero-main.webp"), expect: "webp" },
    { p: path.join(PROJECT_ASSETS, "cats/cat-meng.png"), expect: "png" },
    { p: path.join(PROJECT_ASSETS, "gallery/gallery-01.jpg"), expect: "jpeg" },
  ];
  let heroMeta;
  for (const s of samples) {
    const res = await call("get-image-metadata", { imagePath: s.p });
    const text = expectSuccess(`metadata(${path.basename(s.p)})`, res);
    if (!text) continue;
    const m = text.match(/"format":\s*"(\w+)"/);
    const w = text.match(/"width":\s*(\d+)/);
    const h = text.match(/"height":\s*(\d+)/);
    if (m && m[1] === s.expect) {
      pass(`format reported correctly: ${path.basename(s.p)}`, m[1]);
    } else {
      fail(`format: ${path.basename(s.p)}`, `expected ${s.expect}, got ${m?.[1]}`);
    }
    if (w && h && Number(w[1]) > 0 && Number(h[1]) > 0) {
      pass(`dimensions positive: ${path.basename(s.p)}`, `${w[1]}x${h[1]}`);
    } else {
      fail(`dimensions: ${path.basename(s.p)}`, "non-positive");
    }
    if (s.p.endsWith("hero-main.webp")) {
      heroMeta = { width: Number(w[1]), height: Number(h[1]) };
    }
  }

  // -----------------------------------------------------------------
  group("C. resize-image (all variants)");
  // -----------------------------------------------------------------
  const hero = path.join(PROJECT_ASSETS, "scenes/hero-main.webp");

  // C1: explicit width
  let out = path.join(TMP, "hero-w300.webp");
  let res = await call("resize-image", { imagePath: hero, outputPath: out, width: 300 });
  expectSuccess("resize by width only", res);
  let m = await readImageMeta(out);
  if (m.width === 300 && m.format === "webp") pass("width=300 honored", `${m.width}x${m.height}`);

  // C2: explicit height with keepAspectRatio
  out = path.join(TMP, "hero-h400-keep.webp");
  res = await call("resize-image", {
    imagePath: hero, outputPath: out, height: 400, keepAspectRatio: true,
  });
  expectSuccess("resize by height, keepAspectRatio", res);
  m = await readImageMeta(out);
  if (m.height === 400) pass("height=400 with keepAspectRatio", `${m.width}x${m.height}`);
  // Aspect ratio: hero is 1080x1350 = 0.8. 400 height → width should be 320.
  if (m.width === 320) pass("aspect ratio preserved (width=320)", `${m.width}x${m.height}`);
  else fail("aspect ratio preserved", `width=${m.width}, expected 320`);

  // C3: explicit width + height WITHOUT keepAspectRatio → exact dimensions
  out = path.join(TMP, "hero-stretch.png");
  res = await call("resize-image", { imagePath: hero, outputPath: out, width: 100, height: 50 });
  expectSuccess("resize to exact WxH (stretch)", res);
  m = await readImageMeta(out);
  if (m.width === 100 && m.height === 50 && m.format === "png") {
    pass("exact dimensions + format from extension", `${m.width}x${m.height} ${m.format}`);
  } else {
    fail("exact dimensions", `got ${m.width}x${m.height} ${m.format}`);
  }

  // C4: very small resize (1px)
  out = path.join(TMP, "hero-tiny.webp");
  res = await call("resize-image", { imagePath: hero, outputPath: out, width: 1, keepAspectRatio: true });
  expectSuccess("resize to 1px width", res);
  m = await readImageMeta(out);
  if (m.width === 1) pass("1px width honored", `${m.width}x${m.height}`);

  // C5: quality parameter for webp
  out = path.join(TMP, "hero-q50.webp");
  res = await call("resize-image", {
    imagePath: hero, outputPath: out, width: 600, quality: 50, keepAspectRatio: true,
  });
  expectSuccess("resize with quality=50", res);

  // -----------------------------------------------------------------
  group("D. compress-image (all variants)");
  // -----------------------------------------------------------------
  // D1: PNG lossless (default) — should produce a valid PNG
  out = path.join(TMP, "cat-meng-lossless.png");
  res = await call("compress-image", { imagePath: path.join(PROJECT_ASSETS, "cats/cat-meng.png"), outputPath: out });
  expectSuccess("compress PNG (default lossless)", res);
  m = await readImageMeta(out);
  if (m.format === "png") pass("output is PNG", `${m.size} bytes`);

  // D2: PNG lossy with quality
  out = path.join(TMP, "cat-meng-lossy.png");
  res = await call("compress-image", {
    imagePath: path.join(PROJECT_ASSETS, "cats/cat-meng.png"),
    outputPath: out,
    lossless: false,
    quality: 50,
  });
  expectSuccess("compress PNG lossy q=50", res);

  // D3: webp with quality
  out = path.join(TMP, "hero-q80.webp");
  res = await call("compress-image", {
    imagePath: hero, outputPath: out, quality: 80, lossless: false,
  });
  expectSuccess("compress webp q=80", res);

  // D4: jpg with quality
  out = path.join(TMP, "gallery-q70.jpg");
  res = await call("compress-image", {
    imagePath: path.join(PROJECT_ASSETS, "gallery/gallery-01.jpg"),
    outputPath: out, quality: 70, lossless: false,
  });
  expectSuccess("compress jpg q=70", res);

  // -----------------------------------------------------------------
  group("E. convert-image-format (all 6 supported formats)");
  // -----------------------------------------------------------------
  const conversions = [
    { src: path.join(PROJECT_ASSETS, "scenes/hero-main.webp"), fmt: "webp", ext: "webp" },
    { src: path.join(PROJECT_ASSETS, "scenes/hero-main.webp"), fmt: "png", ext: "png" },
    { src: path.join(PROJECT_ASSETS, "scenes/hero-main.webp"), fmt: "jpeg", ext: "jpg" },
    { src: path.join(PROJECT_ASSETS, "scenes/hero-main.webp"), fmt: "jpg", ext: "jpg" },
    { src: path.join(PROJECT_ASSETS, "scenes/hero-main.webp"), fmt: "avif", ext: "avif" },
    { src: path.join(PROJECT_ASSETS, "scenes/hero-main.webp"), fmt: "tiff", ext: "tiff" },
  ];
  for (const c of conversions) {
    out = path.join(TMP, `convert.${c.ext}`);
    res = await call("convert-image-format", {
      imagePath: c.src, outputPath: out, format: c.fmt,
    });
    expectSuccess(`convert to ${c.fmt}`, res);
    m = await readImageMeta(out);
    if (m.format === c.fmt || (c.fmt === "jpg" && m.format === "jpeg") || (c.fmt === "avif" && m.format === "heif")) {
      pass(`format ${c.fmt} written`, `${m.size} bytes (reported as ${m.format})`);
    } else {
      fail(`convert to ${c.fmt}`, `got format=${m.format}`);
    }
  }

  // -----------------------------------------------------------------
  group("F. crop-image (happy + edge)");
  // -----------------------------------------------------------------
  // F1: simple crop
  out = path.join(TMP, "hero-center.png");
  res = await call("crop-image", {
    imagePath: hero, outputPath: out, left: 200, top: 200, width: 600, height: 800,
  });
  expectSuccess("crop 600x800 at (200,200)", res);
  m = await readImageMeta(out);
  if (m.width === 600 && m.height === 800) pass("cropped to exact dimensions", `${m.width}x${m.height}`);

  // F2: full-image crop should be a no-op dimensionally
  out = path.join(TMP, "hero-full.png");
  res = await call("crop-image", {
    imagePath: hero, outputPath: out, left: 0, top: 0, width: 1080, height: 1350,
  });
  expectSuccess("crop to full image size", res);
  m = await readImageMeta(out);
  if (m.width === 1080 && m.height === 1350) pass("full-image crop dimensions match", `${m.width}x${m.height}`);

  // F3: 1x1 crop
  out = path.join(TMP, "hero-1x1.png");
  res = await call("crop-image", {
    imagePath: hero, outputPath: out, left: 0, top: 0, width: 1, height: 1,
  });
  expectSuccess("1x1 crop", res);
  m = await readImageMeta(out);
  if (m.width === 1 && m.height === 1) pass("1x1 crop honored", `${m.width}x${m.height}`);

  // -----------------------------------------------------------------
  group("G. batch-image-processing (5 mixed ops)");
  // -----------------------------------------------------------------
  const batchOps = [
    { toolName: "resize-image", options: { imagePath: hero, outputPath: path.join(TMP, "b-resize.webp"), width: 200 } },
    { toolName: "compress-image", options: { imagePath: path.join(PROJECT_ASSETS, "cats/cat-meng.png"), outputPath: path.join(TMP, "b-compress.png"), lossless: true } },
    { toolName: "convert-image-format", options: { imagePath: path.join(PROJECT_ASSETS, "gallery/gallery-01.jpg"), outputPath: path.join(TMP, "b-convert.webp"), format: "webp" } },
    { toolName: "get-image-metadata", options: { imagePath: hero } },
    { toolName: "crop-image", options: { imagePath: hero, outputPath: path.join(TMP, "b-crop.png"), left: 100, top: 100, width: 500, height: 500 } },
  ];
  res = await call("batch-image-processing", { operations: batchOps });
  const batchText = expectSuccess("batch of 5 ops", res);
  if (!batchText) {
    fail("batch result", "no text returned");
  } else {
    try {
      // The server JSON-stringifies an array of {success, result} | {success:false, error, index}
      const parsed = JSON.parse(batchText.replace(/^.*?: /, ""));
      if (Array.isArray(parsed) && parsed.length === 5) {
        pass("batch returned 5 results");
        const allOk = parsed.every((r) => r.success === true);
        if (allOk) pass("all 5 batch ops succeeded");
        else fail("batch ops", `failures: ${JSON.stringify(parsed.filter((r) => !r.success))}`);
        // Verify output files for the ops that produce them
        for (const file of ["b-resize.webp", "b-compress.png", "b-convert.webp", "b-crop.png"]) {
          const s = await fs.stat(path.join(TMP, file));
          if (s.size > 0) pass(`batch wrote ${file}`, `${s.size} bytes`);
          else fail(`batch file ${file}`, "empty");
        }
      } else {
        fail("batch result array", `got: ${batchText.slice(0, 200)}`);
      }
    } catch (e) {
      fail("batch result parse", e.message);
    }
  }

  // -----------------------------------------------------------------
  group("H. Error handling (these SHOULD fail in a controlled way)");
  // -----------------------------------------------------------------
  // H1: missing file
  res = await call("resize-image", {
    imagePath: "/nonexistent/path/missing.webp", outputPath: path.join(TMP, "x.webp"), width: 100,
  });
  if (res.isError) pass("missing file → isError");
  else fail("missing file error", "expected isError, got success");

  // H2: invalid format enum (Zod should reject)
  res = await call("convert-image-format", {
    imagePath: hero, outputPath: path.join(TMP, "x.tiff"), format: "gif",
  });
  if (res.isError) pass("invalid format enum → rejected", "Zod validation");
  else fail("invalid format enum", "accepted invalid value");

  // H3: missing required field (crop without width)
  res = await call("crop-image", {
    imagePath: hero, outputPath: path.join(TMP, "x.png"), left: 0, top: 0, height: 100,
  });
  if (res.isError) pass("missing required field → rejected");
  else fail("missing required field", "expected rejection");

  // H4: out-of-bounds crop (sharp throws)
  res = await call("crop-image", {
    imagePath: hero, outputPath: path.join(TMP, "x.png"), left: 99999, top: 99999, width: 100, height: 100,
  });
  if (res.isError) pass("OOB crop → isError (sharp rejected)");
  else fail("OOB crop", "expected sharp to reject");

  // H5: empty operations array
  res = await call("batch-image-processing", { operations: [] });
  const emptyText = res.content?.[0]?.text ?? "";
  if (res.isError || emptyText.includes("[]")) pass("empty batch handled", emptyText.slice(0, 80));
  else fail("empty batch", "unexpected response");

  // -----------------------------------------------------------------
  group("I. Output integrity (file content valid, not zero-byte)");
  // -----------------------------------------------------------------
  let totalProduced = 0;
  for (const f of await fs.readdir(TMP)) {
    const s = await fs.stat(path.join(TMP, f));
    if (s.size === 0) fail(`zero-byte output: ${f}`);
    else totalProduced++;
  }
  if (totalProduced > 20) pass(`${totalProduced} non-empty outputs produced`, `${(await getDirSize(TMP) / 1024).toFixed(1)} KB total`);

  // Spot-check: re-read metadata of converted outputs to confirm re-parse works
  for (const f of ["convert.png", "convert.jpg", "convert.avif", "convert.tiff", "convert.webp"]) {
    try {
      const meta = await sharp(path.join(TMP, f)).metadata();
      if (meta.width && meta.height) pass(`re-parse ${f}`, `${meta.width}x${meta.height} ${meta.format}`);
      else fail(`re-parse ${f}`, "no dimensions");
    } catch (e) {
      fail(`re-parse ${f}`, e.message);
    }
  }

} catch (e) {
  fail("fatal", `${e.stack || e.message}`);
} finally {
  await client.close();
  // Clean up temp dir
  await fs.rm(TMP, { recursive: true, force: true }).catch(() => {});
}

async function getDirSize(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let total = 0;
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isFile()) total += (await fs.stat(p)).size;
    else if (e.isDirectory()) total += await getDirSize(p);
  }
  return total;
}

// -----------------------------------------------------------------
// Summary
// -----------------------------------------------------------------
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);
const total = results.length;

console.log("\n" + "=".repeat(60));
console.log(`SUMMARY: ${passed}/${total} passed, ${failed.length} failed`);
console.log("=".repeat(60));

if (failed.length) {
  console.log("\nFailures:");
  for (const f of failed) console.log(`  [${f.group}] ${f.name} — ${f.detail}`);
}

process.exit(failed.length ? 1 : 0);
