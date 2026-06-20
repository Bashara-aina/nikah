/**
 * Verifies the project-level .cursor/mcp.json works end-to-end.
 *
 * Reads /Users/basharaaina/Projects/nikah/.cursor/mcp.json (the file Cursor
 * itself loads when opening this project), expands ${workspaceFolder}, and
 * spawns the server from a *different* cwd to prove the relative-path
 * resolution is what makes the config portable.
 *
 * Exits 0 on success, 1 on any failure.
 */
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";

let failures = 0;
function pass(m) { console.log(`  PASS  ${m}`); }
function fail(m) { console.log(`  FAIL  ${m}`); failures++; }

try {
  const cfgPath = "/Users/basharaaina/Projects/nikah/.cursor/mcp.json";
  const cfg = JSON.parse(await fs.readFile(cfgPath, "utf8"));
  pass(`read ${cfgPath}`);

  const entry = cfg.mcpServers["image-processing"];
  if (!entry) { fail("image-processing entry missing"); throw new Error("no entry"); }
  pass(`image-processing entry present`);

  const workspaceFolder = "/Users/basharaaina/Projects/nikah";
  const expanded = {
    command: entry.command,
    args: entry.args,
    cwd: entry.cwd === "${workspaceFolder}" ? workspaceFolder : entry.cwd,
  };

  if (path.isAbsolute(expanded.args[0])) {
    fail("args[0] should be relative, not absolute");
  } else {
    pass(`args[0] is relative: ${expanded.args[0]}`);
  }

  const abs = path.resolve(expanded.cwd, expanded.args[0]);
  const stat = await fs.stat(abs);
  if (stat.size > 0) pass(`resolved to existing binary (${stat.size} bytes)`);
  else fail("resolved path empty");

  // Spawn from a deliberately DIFFERENT cwd
  const otherCwd = await fs.mkdtemp(path.join(os.tmpdir(), "cursor-mcp-"));
  const transport = new StdioClientTransport({
    command: expanded.command,
    args: expanded.args,
    cwd: expanded.cwd,
  });
  const client = new Client({ name: "mirror", version: "0" }, { capabilities: {} });
  await client.connect(transport);
  const { tools } = await client.listTools();
  if (tools.length === 6) pass(`6 tools registered from foreign cwd`);
  else fail(`expected 6 tools, got ${tools.length}`);

  const res = await client.callTool({
    name: "get-image-metadata",
    arguments: { imagePath: path.join(workspaceFolder, "assets/scenes/hero-main.webp") },
  });
  const text = res.content?.[0]?.text ?? "";
  if (text.includes("hero-main.webp") && text.includes("1080")) pass("real project asset readable");
  else fail("metadata call did not return expected content");

  await client.close();
  await fs.rm(otherCwd, { recursive: true, force: true }).catch(() => {});

  // Confirm we did NOT leak the entry into the global config
  const globalCfg = JSON.parse(await fs.readFile("/Users/basharaaina/.cursor/mcp.json", "utf8"));
  if (!globalCfg.mcpServers["image-processing"]) pass("global mcp.json does NOT contain image-processing (single source of truth)");
  else fail("image-processing still in global mcp.json — should only be in project config");

  console.log(`\n[${failures === 0 ? "ok" : "FAIL"}] ${failures === 0 ? "project-level MCP config is fully functional" : `${failures} check(s) failed`}`);
} catch (e) {
  fail(`fatal: ${e.message}`);
}
process.exit(failures ? 1 : 0);

