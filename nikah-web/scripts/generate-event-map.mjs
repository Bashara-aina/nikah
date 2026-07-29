#!/usr/bin/env node
/**
 * Accurate Widuri area map — one gpt-image-2/edit run (user-requested).
 *
 * Ground truth: widuri-maps.jpeg (Gedung Sate NW, Widuri at Bengawan junction SE).
 * Style refs: building-and-maps-website-reference.jpeg + current punched map.
 *
 * Auth: Authorization: Key $FAL_KEY (nikah-web/.env) — see fal.ai.md.
 * curl + dig --resolve for fal.media CDN DNS flakiness.
 *
 * Outputs:
 *   relevant/06-countdown-japan-event/event-widuri-map.webp
 *   nikah-web/assets/illustrations/event-widuri-map.webp
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const here = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(here, "..");
const ROOT = path.resolve(here, "..", "..");
const REL = path.join(ROOT, "relevant", "06-countdown-japan-event");
const SHIP = path.join(WEB, "assets", "illustrations");

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error(
    "FAL_KEY missing — run with: node --env-file=.env scripts/generate-event-map.mjs",
  );
  process.exit(1);
}

const resolveHost = async (hostname) => {
  const { stdout } = await execFileAsync("dig", ["+short", hostname, "@8.8.8.8"], {
    env: process.env,
  });
  const ip = stdout
    .split("\n")
    .map((l) => l.trim())
    .find((l) => /^\d+\.\d+\.\d+\.\d+$/.test(l));
  if (!ip) throw new Error(`could not resolve ${hostname} via dig`);
  return ip;
};

const curlArgsForUrl = async (url) => {
  const host = new URL(url).hostname;
  if (!host.endsWith(".fal.media") && host !== "fal.media") return [];
  const ip = await resolveHost(host);
  return ["--resolve", `${host}:443:${ip}`];
};

const curlJson = async (args) => {
  const { stdout } = await execFileAsync("curl", ["-sS", "--fail-with-body", ...args], {
    maxBuffer: 32 * 1024 * 1024,
    env: process.env,
  });
  return JSON.parse(stdout);
};

const uploadFile = async (filePath, contentType) => {
  const fileName = path.basename(filePath);
  const initiated = await curlJson([
    "-X",
    "POST",
    "https://rest.fal.ai/storage/upload/initiate",
    "-H",
    `Authorization: Key ${FAL_KEY}`,
    "-H",
    "Content-Type: application/json",
    "-d",
    JSON.stringify({ file_name: fileName, content_type: contentType }),
  ]);
  if (!initiated.upload_url || !initiated.file_url) {
    throw new Error(`upload initiate failed for ${fileName}`);
  }
  const resolve = await curlArgsForUrl(initiated.upload_url);
  await execFileAsync(
    "curl",
    [
      "-sS",
      "--fail-with-body",
      ...resolve,
      "-X",
      "PUT",
      initiated.upload_url,
      "-H",
      `Content-Type: ${contentType}`,
      "--data-binary",
      `@${filePath}`,
    ],
    { maxBuffer: 32 * 1024 * 1024, env: process.env },
  );
  return initiated.file_url;
};

/** Darken ink + knock cream to transparent for bg-paper. */
const punchForPaper = async (buf) => {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const ink = [58, 50, 40];
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (l > 235 && Math.abs(r - g) < 20 && Math.abs(g - b) < 25) {
      data[i + 3] = 0;
      continue;
    }
    if (l < 230) {
      const t = Math.min(1, (230 - l) / 140);
      data[i] = ink[0];
      data[i + 1] = ink[1];
      data[i + 2] = ink[2];
      data[i + 3] = Math.min(255, Math.round(40 + t * 215));
    } else {
      data[i + 3] = 0;
    }
  }
  return sharp(data, { raw: { width, height, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toBuffer();
};

const main = async () => {
  console.log("uploading references…");
  const mapsTruthUrl = await uploadFile(
    path.join(ROOT, "widuri-maps.jpeg"),
    "image/jpeg",
  );
  const styleMapUrl = await uploadFile(
    path.join(ROOT, "building-and-maps-website-reference.jpeg"),
    "image/jpeg",
  );

  const prompt =
    "Using the FIRST image (Google Maps of Bandung) as STRICT geographic " +
    "ground truth, redraw it as a sparse hand-drawn wedding-invitation street " +
    "map in the exact line style of the SECOND image's bottom map: thin " +
    "slightly imperfect double-line roads, simple hand-lettered ALL-CAPS " +
    "street names, warm charcoal/taupe ink on solid ivory/cream paper " +
    "(#F7F2EA). No Google UI, no traffic colors, no POI icons, no photos.\n\n" +
    "ACCURATE LAYOUT (must match the first image):\n" +
    "1) GEDUNG SATE — top-LEFT / northwest. Mark with a tiny simplified " +
    "line silhouette of its famous central spire tower + the label " +
    "\"GEDUNG SATE\". It sits south of a horizontal road labeled " +
    "\"JL. DIPONEGORO\".\n" +
    "2) WIDURI — mid-RIGHT / southeast of Gedung Sate. One small pin + " +
    "label \"WIDURI\" at the junction/roundabout where JL. BENGAWAN meets " +
    "JL. CILAKI / JL. SUPRATMAN area (as in the first map).\n" +
    "3) Show ONLY these essential roads (nothing else):\n" +
    "   - JL. DIPONEGORO (horizontal across the top, past Gedung Sate)\n" +
    "   - JL. SUPRATMAN (north–south / diagonal on the east side near Widuri)\n" +
    "   - JL. BENGAWAN (toward Widuri pin)\n" +
    "   - JL. CILAKI (connecting toward the Widuri junction)\n" +
    "   - Optional thin JL. CILIWUNG if needed for orientation — keep faint\n" +
    "4) Relative positions: Gedung Sate must clearly read as NORTHWEST of " +
    "Widuri; leave generous cream empty space; half the density of a real map.\n" +
    "5) No Museum Geologi, no hotels, no restaurant icons, no parks filled in, " +
    "no compass, no scale bar. Clean, readable, accurate, not confusing.";

  console.log("running openai/gpt-image-2/edit — widuri-map-v2…");
  const result = await curlJson([
    "-X",
    "POST",
    "https://fal.run/openai/gpt-image-2/edit",
    "-H",
    `Authorization: Key ${FAL_KEY}`,
    "-H",
    "Content-Type: application/json",
    "--max-time",
    "300",
    "-d",
    JSON.stringify({
      prompt,
      image_urls: [mapsTruthUrl, styleMapUrl],
      image_size: { width: 1024, height: 1024 },
      quality: "high",
      num_images: 1,
      output_format: "webp",
    }),
  ]);

  const img = result.images?.[0];
  if (!img?.url) throw new Error("no image in response");

  const rawPath = path.join(tmpdir(), `nikah-map-${Date.now()}.webp`);
  const resolve = await curlArgsForUrl(img.url);
  await execFileAsync(
    "curl",
    ["-sS", "--fail-with-body", ...resolve, "-o", rawPath, "--max-time", "120", img.url],
    { maxBuffer: 32 * 1024 * 1024, env: process.env },
  );

  const raw = await readFile(rawPath);
  const punched = await punchForPaper(raw);

  await mkdir(REL, { recursive: true });
  await mkdir(SHIP, { recursive: true });
  // Keep an unpunched review copy + punched shipping asset
  await writeFile(path.join(REL, "event-widuri-map-raw.webp"), raw);
  await writeFile(path.join(REL, "event-widuri-map.webp"), punched);
  await sharp(punched).toFile(path.join(SHIP, "event-widuri-map.webp"));

  const meta = await sharp(punched).metadata();
  console.log(
    `saved event-widuri-map.webp ${meta.width}x${meta.height} ${(punched.length / 1024).toFixed(0)}KB`,
  );
};

main().catch((err) => {
  console.error("[generate-event-map] failed:", err.message ?? err);
  if (err.stdout) console.error(String(err.stdout).slice(0, 500));
  if (err.stderr) console.error(String(err.stderr).slice(0, 500));
  process.exitCode = 1;
});
