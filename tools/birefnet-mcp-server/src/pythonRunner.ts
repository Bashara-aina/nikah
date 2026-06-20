/**
 * Spawns the BiRefNet Python CLI as a child process and parses its output.
 *
 * The Python script (tools/birefnet.py) writes one structured line per image
 * to stderr in the form `[birefnet] <input> (<w>x<h>) -> <output> in <t>s`
 * when --quiet is OFF. We parse those lines to build a structured result
 * for the MCP caller. The actual RGB image is read separately by the
 * TypeScript caller (we don't ship the bytes over MCP).
 */
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

/** Parsed single-image result from the Python CLI. */
export interface CliImageResult {
  inputPath: string;
  outputPath: string;
  width: number;
  height: number;
  elapsedSeconds: number;
  outputBytes: number;
}

/** Aggregated result from a directory-mode run. */
export interface CliBatchResult {
  results: CliImageResult[];
  failures: { inputPath: string; error: string }[];
  skipped: number;
  totalImages: number;
}

const BIREFNET_PY = path.resolve(
  process.env.BIREFNET_PY ?? path.join(import.meta.dirname, "..", "..", "birefnet.py"),
);

const ACTIVATE = path.resolve(
  process.env.BIREFNET_ACTIVATE ?? path.join(import.meta.dirname, "..", "..", "activate-birefnet.sh"),
);

interface SpawnOpts {
  /** Extra args to pass to birefnet.py (after the script name). */
  args: string[];
  /** Working directory for the child (defaults to NIKAH_ROOT). */
  cwd?: string;
  /** Total wall-clock budget in ms. Default 5 minutes. */
  timeoutMs?: number;
}

/** Run birefnet.py with `args` and return its combined stdout/stderr. */
function runBiRefnet(opts: SpawnOpts): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
    };
    // The Python CLI sends all [birefnet] progress lines to stderr via its
    // log() helper. We keep stdout and stderr separate in the runner so we
    // can surface unexpected stdout (e.g. a Python traceback to stdout) in
    // error messages.
    const shellCmd = `source "${ACTIVATE}" >/dev/null 2>&1 && exec python3 -u "${BIREFNET_PY}" ${opts.args.map(quoteShell).join(" ")}`;

    const child = spawn("/bin/bash", ["-c", shellCmd], {
      cwd: opts.cwd,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (b: Buffer) => {
      stdout += b.toString("utf8");
    });
    child.stderr.on("data", (b: Buffer) => {
      stderr += b.toString("utf8");
    });

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`BiRefNet timed out after ${opts.timeoutMs ?? 300_000}ms`));
    }, opts.timeoutMs ?? 300_000);

    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

function quoteShell(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

/** Strip the [birefnet] tag and any ANSI, split on whitespace. */
function cleanLine(raw: string): string {
  return raw.replace(/\[birefnet\]\s*/, "").replace(/\u001b\[[0-9;]*m/g, "").trim();
}

/** Parse one [birefnet] per-image line. Returns null if it doesn't match. */
function parseImageLine(line: string): Omit<CliImageResult, "outputBytes"> | null {
  // Shape: `<name> (<w>x<h>) -> <out> in <t>s`
  const m = line.match(/^(.+?)\s+\((\d+)x(\d+)\)\s+->\s+(.+?)\s+in\s+([\d.]+)s/);
  if (!m) return null;
  return {
    inputPath: m[1],
    outputPath: m[4],
    width: Number(m[2]),
    height: Number(m[3]),
    elapsedSeconds: Number(m[5]),
  };
}

/** Segment a single image. Returns a structured result. */
export async function segmentOne(opts: {
  inputPath: string;
  outputPath: string;
  model?: string;
  maxSide?: number;
}): Promise<CliImageResult> {
  const args = [
    "--model", opts.model ?? "dynamic",
    ...(opts.maxSide ? ["--max-side", String(opts.maxSide)] : []),
    opts.inputPath,
    opts.outputPath,
  ];
  const { code, stderr } = await runBiRefnet({ args });
  if (code !== 0) {
    throw new Error(`BiRefNet exited ${code}: ${cleanForError(stderr)}`);
  }
  const st = await fs.stat(opts.outputPath).catch(() => null);
  if (!st) {
    throw new Error(`BiRefNet succeeded but output is missing: ${opts.outputPath}`);
  }
  // The non-quiet single-file mode prints exactly one per-image line:
  //   [birefnet] <name> (<w>x<h>) -> <out> in <t>s (<kb> KB)
  for (const raw of stderr.split("\n")) {
    const parsed = parseImageLine(cleanLine(raw));
    if (parsed && parsed.outputPath === opts.outputPath) {
      return { ...parsed, outputBytes: st.size };
    }
  }
  // Fallback: parser didn't match (shouldn't happen). Report what we know.
  return {
    inputPath: opts.inputPath,
    outputPath: opts.outputPath,
    width: 0,
    height: 0,
    elapsedSeconds: 0,
    outputBytes: st.size,
  };
}

/** Segment every image in inputDir into outputDir. */
export async function segmentBatch(opts: {
  inputDir: string;
  outputDir: string;
  model?: string;
  maxSide?: number;
  overwrite?: boolean;
}): Promise<CliBatchResult> {
  const args = [
    "--model", opts.model ?? "dynamic",
    ...(opts.maxSide ? ["--max-side", String(opts.maxSide)] : []),
    ...(opts.overwrite ? ["--overwrite"] : []),
    opts.inputDir,
    opts.outputDir,
  ];
  const { code, stderr } = await runBiRefnet({ args, timeoutMs: 1_800_000 });
  if (code !== 0) {
    throw new Error(`BiRefNet exited ${code}: ${cleanForError(stderr)}`);
  }

  // Parse per-image lines from stderr. The CLI prints:
  //   [birefnet] processing N images from <in> -> <out>
  //   [birefnet] [1/N] <name> (<w>x<h>) -> <name> in <t>s
  //   [birefnet] [2/N] ...
  //   [birefnet] done — X/N images, avg T s/image, total T s
  const results: CliImageResult[] = [];
  const failures: { inputPath: string; error: string }[] = [];
  let totalImages = 0;
  let skipped = 0;
  let headerReached = false;

  for (const raw of stderr.split("\n")) {
    const line = cleanLine(raw);
    if (!line) continue;
    const proc = line.match(/^processing\s+(\d+)\s+images/);
    if (proc) {
      totalImages = Number(proc[1]);
      headerReached = true;
      continue;
    }
    if (line.startsWith("done")) continue;
    const skip = line.match(/^\[\d+\/\d+\]\s+skip\s+(.+)$/);
    if (skip) {
      skipped++;
      continue;
    }
    const failLine = line.match(/^\[\d+\/\d+\]\s+FAIL\s+(.+?):\s+(.+)$/);
    if (failLine) {
      failures.push({ inputPath: failLine[1], error: failLine[2] });
      continue;
    }
    const ok = line.match(/^\[\d+\/\d+\]\s+(.+?)\s+\((\d+)x(\d+)\)\s+->\s+(.+?)\s+in\s+([\d.]+)s/);
    if (ok) {
      const outPath = ok[4];
      const st = await fs.stat(outPath).catch(() => null);
      results.push({
        inputPath: ok[1],
        outputPath: outPath,
        width: Number(ok[2]),
        height: Number(ok[3]),
        elapsedSeconds: Number(ok[5]),
        outputBytes: st?.size ?? 0,
      });
    }
  }
  if (!headerReached) {
    throw new Error(`BiRefNet did not emit a 'processing N images' header; got: ${stderr.slice(0, 400)}`);
  }
  return { results, failures, skipped, totalImages };
}

/** Return model variants as a typed list. Mirrors tools/birefnet.py MODELS. */
export const MODEL_REGISTRY: { alias: string; hfRepo: string; maxSide: number; note: string }[] = [
  { alias: "dynamic", hfRepo: "zhengpeng7/BiRefNet_dynamic", maxSide: 1024, note: "default — any resolution, best for wedding photos" },
  { alias: "portrait", hfRepo: "zhengpeng7/BiRefNet-portrait", maxSide: 1024, note: "people, especially portraits" },
  { alias: "matting", hfRepo: "zhengpeng7/BiRefNet-matting", maxSide: 1024, note: "soft-edge matting (hair, fur)" },
  { alias: "hr-matting", hfRepo: "zhengpeng7/BiRefNet_HR-matting", maxSide: 2048, note: "high-res matting on large source images" },
  { alias: "hr", hfRepo: "zhengpeng7/BiRefNet_HR", maxSide: 2048, note: "high-res general use" },
  { alias: "dis", hfRepo: "zhengpeng7/BiRefNet", maxSide: 1024, note: "original DIS benchmark weights; not great for human portraits" },
  { alias: "lite", hfRepo: "zhengpeng7/BiRefNet_lite", maxSide: 1024, note: "smaller model, faster, lower quality" },
];

function cleanForError(s: string): string {
  // Trim and collapse blank lines; keep first 20 lines of context.
  return s
    .split("\n")
    .filter((l) => l.trim() && !l.includes("HF_HUB_DISABLE_PROGRESS_BARS"))
    .slice(0, 20)
    .join("\n");
}
