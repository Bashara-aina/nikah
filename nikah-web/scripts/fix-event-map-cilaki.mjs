#!/usr/bin/env node
/**
 * Micro-edit: connect JL. CILAKI into the Supratman–Bengawan roundabout.
 * Keeps the almost-correct v2 map; only fixes that junction (user-requested).
 *
 * Refs: current raw map (base) + widuri-maps.jpeg (geo truth).
 * Auth: Authorization: Key $FAL_KEY — fal.ai.md
 */
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
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
    "FAL_KEY missing — run with: node --env-file=.env scripts/fix-event-map-cilaki.mjs",
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
  return ["--resolve", `${host}:443:${await resolveHost(host)}`];
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
  // Prefer cream raw as edit base (transparent punched confuses the model).
  const basePath = path.join(REL, "event-widuri-map-raw.webp");
  const truthPath = path.join(ROOT, "widuri-maps.jpeg");

  console.log("uploading base map + geo truth…");
  const baseUrl = await uploadFile(basePath, "image/webp");
  const truthUrl = await uploadFile(truthPath, "image/jpeg");

  const prompt =
    "Edit the FIRST image (keep the same hand-drawn wedding map style, " +
    "same ivory cream background, same warm charcoal ink, same Gedung Sate " +
    "icon, same Widuri pin, same labels, same overall composition). " +
    "Use the SECOND image (Google Maps) only as geographic truth for ONE fix:\n\n" +
    "FIX: Extend JL. CILAKI so its double-line road PHYSICALLY CONNECTS into " +
    "the circular roundabout where JL. SUPRATMAN and JL. BENGAWAN already " +
    "meet — enter the roundabout from the northwest side, exactly as in the " +
    "Google Maps reference. Right now JL. CILAKI stops short / floats; close " +
    "that gap. Widuri pin stays just north of that same roundabout.\n\n" +
    "Do NOT redraw the whole map. Do NOT move Gedung Sate, Diponegoro, " +
    "Supratman, Bengawan, or Widuri. Do NOT add new roads, POIs, traffic " +
    "colors, or Google UI. Minimal change only: connect Cilaki to that circle.";

  console.log("running openai/gpt-image-2/edit — cilaki connect…");
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
      image_urls: [baseUrl, truthUrl],
      image_size: { width: 1024, height: 1024 },
      quality: "high",
      num_images: 1,
      output_format: "webp",
    }),
  ]);

  const img = result.images?.[0];
  if (!img?.url) throw new Error("no image in response");

  const rawPath = path.join(tmpdir(), `nikah-map-cilaki-${Date.now()}.webp`);
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
  // Keep previous raw as backup
  await copyFile(basePath, path.join(REL, "event-widuri-map-raw-v2.webp")).catch(() => {});
  await writeFile(path.join(REL, "event-widuri-map-raw.webp"), raw);
  await writeFile(path.join(REL, "event-widuri-map.webp"), punched);
  await sharp(punched).toFile(path.join(SHIP, "event-widuri-map.webp"));

  const meta = await sharp(punched).metadata();
  console.log(
    `saved event-widuri-map.webp ${meta.width}x${meta.height} ${(punched.length / 1024).toFixed(0)}KB`,
  );
};

main().catch((err) => {
  console.error("[fix-event-map-cilaki] failed:", err.message ?? err);
  if (err.stdout) console.error(String(err.stdout).slice(0, 500));
  if (err.stderr) console.error(String(err.stderr).slice(0, 500));
  process.exitCode = 1;
});
