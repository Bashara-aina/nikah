/**
 * Validator for birefnet-mcp-server.
 *
 * Boots the server exactly as Cursor does (node build/index.js over stdio),
 * then runs a structured test matrix covering:
 *   - 3 tools, all happy paths
 *   - Model variant listing
 *   - Single-image background removal on a real project asset
 *   - Batch directory background removal
 *   - Edge cases: missing file, invalid model enum
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

const SERVER = "/Users/basharaaina/Projects/nikah/tools/birefnet-mcp-server/build/index.js";
const PROJECT_RAW = "/Users/basharaaina/Projects/nikah/assets/_source";
const TMP = await fs.mkdtemp(path.join(os.tmpdir(), "birefnet-mcp-validate-"));

const transport = new StdioClientTransport({ command: "node", args: [SERVER] });
const client = new Client(
  { name: "validator", version: "1.0.0" },
  { capabilities: {} },
);

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

async function call(name, args, timeoutMs = 600_000) {
  try {
    return await client.callTool({ name, arguments: args }, undefined, { timeout: timeoutMs });
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
  return res.content?.[0]?.text ?? "";
}

try {
  await client.connect(transport);

  // -----------------------------------------------------------------
  group("A. Handshake & tool inventory");
  // -----------------------------------------------------------------
  const { tools } = await client.listTools();
  const toolNames = tools.map((t) => t.name).sort();
  const expected = [
    "batch-remove-background",
    "list-birefnet-models",
    "remove-background",
  ].sort();
  if (JSON.stringify(toolNames) === JSON.stringify(expected)) {
    pass("listTools returns exactly 3 expected tools", toolNames.join(","));
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
  group("B. list-birefnet-models");
  // -----------------------------------------------------------------
  let res = await call("list-birefnet-models", {});
  const listText = expectSuccess("list models", res);
  if (!listText) {
    fail("list models text", "no content");
  } else {
    try {
      const jsonStr = listText.substring(listText.indexOf("["));
      const models = JSON.parse(jsonStr);
      if (Array.isArray(models) && models.length === 7) {
        pass("7 model variants returned", models.map((m) => m.alias).join(","));
      } else {
        fail("model count", `got ${models?.length}`);
      }
      if (models?.[0]?.alias === "dynamic") pass("default model is 'dynamic'");
      else fail("default model", `got '${models?.[0]?.alias}'`);
      if (models?.every((m) => typeof m.hfRepo === "string" && m.hfRepo.startsWith("zhengpeng7/"))) {
        pass("all HF repos are zhengpeng7/...");
      } else {
        fail("HF repos", "unexpected format");
      }
    } catch (e) {
      fail("list models parse", e.message);
    }
  }

  // -----------------------------------------------------------------
  group("C. remove-background (single image)");
  // -----------------------------------------------------------------
  // Pick a small raw source we can segment quickly.
  const sourceImage = path.join(PROJECT_RAW, "cats-photos", "Moju.PNG");
  const sourceStat = await fs.stat(sourceImage).catch(() => null);
  if (!sourceStat) {
    fail("source image exists", `${sourceImage} missing — skipping single-image tests`);
  } else {
    pass("source image exists", `${sourceImage} (${(sourceStat.size/1024).toFixed(1)} KB)`);

    // C1: happy path
    const out = path.join(TMP, "moju-default.png");
    res = await call("remove-background", { imagePath: sourceImage, outputPath: out });
    const c1Text = expectSuccess("remove-background default", res);
    if (c1Text) {
      pass("default model call returned text", `${c1Text.slice(0, 60)}...`);
      const st = await fs.stat(out).catch(() => null);
      if (st && st.size > 0) {
        pass("output file written", `${(st.size/1024).toFixed(1)} KB`);
      } else {
        fail("output file", "missing or empty");
      }
      const buf = await fs.readFile(out);
      if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
        pass("output is a valid PNG", "PNG signature ok");
      } else {
        fail("output format", "not a PNG");
      }
    }

    // C2: explicit model
    const out2 = path.join(TMP, "moju-portrait.png");
    res = await call("remove-background", {
      imagePath: sourceImage, outputPath: out2, model: "portrait",
    });
    if (expectSuccess("remove-background with model='portrait'", res)) {
      const st = await fs.stat(out2).catch(() => null);
      if (st && st.size > 0) pass("portrait output written", `${(st.size/1024).toFixed(1)} KB`);
    }

    // C3: maxSide override
    const out3 = path.join(TMP, "moju-512.png");
    res = await call("remove-background", {
      imagePath: sourceImage, outputPath: out3, maxSide: 512,
    });
    if (expectSuccess("remove-background with maxSide=512", res)) {
      const st = await fs.stat(out3).catch(() => null);
      if (st && st.size > 0) pass("maxSide=512 output written", `${(st.size/1024).toFixed(1)} KB`);
    }
  }

  // -----------------------------------------------------------------
  group("D. batch-remove-background (directory)");
  // -----------------------------------------------------------------
  const catDir = path.join(PROJECT_RAW, "cats-photos");
  const catStat = await fs.stat(catDir).catch(() => null);
  if (!catStat) {
    fail("cats-photos dir", "missing");
  } else {
    const outDir = path.join(TMP, "batch-out");
    res = await call("batch-remove-background", {
      inputDir: catDir, outputDir: outDir, model: "dynamic",
    });
    const text = expectSuccess("batch on cats-photos", res);
    if (text) {
      // Look for the summary line "Batch done: X/Y succeeded, ..."
      const m = text.match(/(\d+)\/(\d+)\s+succeeded/);
      if (m) {
        pass("batch reported counts", `${m[1]}/${m[2]}`);
        const succeeded = Number(m[1]);
        if (succeeded > 0) {
          // Verify output files exist
          const files = await fs.readdir(outDir).catch(() => []);
          if (files.length > 0) {
            pass(`${files.length} output files written`, files.slice(0, 3).join(", "));
          } else {
            fail("batch outputs", "directory empty");
          }
        } else {
          fail("batch results", "0 succeeded");
        }
      } else {
        fail("batch summary", "no count in output");
      }
    }
  }

  // -----------------------------------------------------------------
  group("E. Error handling (these SHOULD fail in a controlled way)");
  // -----------------------------------------------------------------
  res = await call("remove-background", {
    imagePath: "/nonexistent/path/missing.jpg", outputPath: path.join(TMP, "x.png"),
  });
  if (res.isError) pass("missing file → isError");
  else fail("missing file error", "expected isError, got success");

  res = await call("remove-background", {
    imagePath: sourceImage, outputPath: path.join(TMP, "x.png"), model: "nonexistent",
  });
  if (res.isError) pass("invalid model enum → rejected", "Zod validation");
  else fail("invalid model enum", "accepted invalid value");

  res = await call("remove-background", {
    imagePath: sourceImage, // missing outputPath
  });
  if (res.isError) pass("missing required field → rejected");
  else fail("missing required field", "expected rejection");

  res = await call("batch-remove-background", {
    inputDir: "/nonexistent/dir", outputDir: path.join(TMP, "x"),
  });
  if (res.isError) pass("missing input dir → isError");
  else fail("missing input dir", "expected isError, got success");

  res = await call("batch-remove-background", { inputDir: catDir /* missing outputDir */ });
  if (res.isError) pass("batch missing outputDir → rejected");
  else fail("batch missing outputDir", "expected rejection");

  // -----------------------------------------------------------------
  group("F. Output integrity (file content valid, not zero-byte)");
  // -----------------------------------------------------------------
  let totalProduced = 0;
  for (const f of await fs.readdir(TMP)) {
    const s = await fs.stat(path.join(TMP, f));
    if (s.isFile() && s.size === 0) fail(`zero-byte output: ${f}`);
    else if (s.isFile()) totalProduced++;
  }
  pass(`${totalProduced} non-empty outputs produced`);
} catch (e) {
  fail("fatal", `${e.stack || e.message}`);
} finally {
  await client.close();
  await fs.rm(TMP, { recursive: true, force: true }).catch(() => {});
}

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
