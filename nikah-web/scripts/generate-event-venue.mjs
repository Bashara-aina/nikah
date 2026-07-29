#!/usr/bin/env node
/**
 * Event venue assets — two careful gpt-image-2/edit runs (user-requested).
 *
 * Uses curl for fal storage + fal.run because Node fetch intermittently fails
 * DNS for v3b.fal.media in this environment; auth matches fal.ai.md:
 *   Authorization: Key $FAL_KEY  (FAL_KEY from nikah-web/.env)
 *
 * Outputs:
 *   relevant/06-countdown-japan-event/event-widuri-building.webp (review)
 *   relevant/06-countdown-japan-event/event-widuri-map.webp (review)
 *   nikah-web/assets/illustrations/event-widuri-building.webp (shipping)
 *   nikah-web/assets/illustrations/event-widuri-map.webp (shipping)
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
    "FAL_KEY missing — run with: node --env-file=.env scripts/generate-event-venue.mjs",
  );
  process.exit(1);
}

/** System resolver often misses fal CDN hosts; pin via dig @8.8.8.8. */
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

/** Upload a local file to fal storage; returns the public file_url. */
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

const runEdit = async ({ label, prompt, imageUrls, imageSize }) => {
  console.log(`running openai/gpt-image-2/edit — ${label}…`);
  const body = {
    prompt,
    image_urls: imageUrls,
    image_size: imageSize,
    quality: "high",
    num_images: 1,
    output_format: "webp",
  };
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
    JSON.stringify(body),
  ]);
  const img = result.images?.[0];
  if (!img?.url) throw new Error(`${label}: no image in response`);
  const outPath = path.join(tmpdir(), `nikah-${label}-${Date.now()}.webp`);
  const resolve = await curlArgsForUrl(img.url);
  await execFileAsync(
    "curl",
    [
      "-sS",
      "--fail-with-body",
      ...resolve,
      "-o",
      outPath,
      "--max-time",
      "120",
      img.url,
    ],
    { maxBuffer: 32 * 1024 * 1024, env: process.env },
  );
  return readFile(outPath);
};

const shipWebp = async (buf, name) => {
  await mkdir(REL, { recursive: true });
  await mkdir(SHIP, { recursive: true });
  await writeFile(path.join(REL, name), buf);
  const shipBuf = await sharp(buf)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();
  await sharp(shipBuf).toFile(path.join(SHIP, name));
  const meta = await sharp(shipBuf).metadata();
  console.log(
    `saved ${name} ${meta.width}x${meta.height} ${(shipBuf.length / 1024).toFixed(0)}KB (+ review)`,
  );
};

const main = async () => {
  console.log("uploading references via curl…");
  const widuriPhotoUrl = await uploadFile(
    path.join(ROOT, "widuri-building.jpeg"),
    "image/jpeg",
  );
  const buildingStyleUrl = await uploadFile(
    path.join(ROOT, "building-website-reference.jpeg"),
    "image/jpeg",
  );
  const mapsPhotoUrl = await uploadFile(path.join(ROOT, "widuri-maps.jpeg"), "image/jpeg");
  const mapStyleUrl = await uploadFile(
    path.join(ROOT, "building-and-maps-website-reference.jpeg"),
    "image/jpeg",
  );
  const venueIconUrl = await uploadFile(
    path.join(WEB, "assets/illustrations/event-venue-icon.webp"),
    "image/webp",
  );
  console.log("uploads ok");

  const buildingPrompt =
    "Using the first image (photo of Widuri Indonesian Restaurant) as the " +
    "architectural subject, redraw it as a minimalist thin-line architectural " +
    "sketch in the exact line style of the second image: clean contour drawing, " +
    "uniform thin strokes, no shading, no gradients, no photorealism. Keep the " +
    "recognizable Widuri silhouette — multi-tiered gabled dark roofs, white " +
    "facade, large ground-floor windows, covered front walkway, and a simple " +
    "rectangular rooftop sign shape (do NOT render readable text or logos). " +
    "Remove cars, parking lines, power lines, people, and sky clutter. " +
    "Background: solid warm ivory/cream paper (#F7F2EA), matching a soft " +
    "storybook wedding invitation. Line color: soft warm charcoal/taupe ink " +
    "(never pure cold black). Optional tiny blush-pink or sage botanical " +
    "sprig accents only if extremely sparse — match the gentle romantic " +
    "palette of the third reference illustration, but stay firmly line-art, " +
    "not watercolor fill. Centered composition with generous empty margin. " +
    "No captions, no watermark, no UI chrome.";

  const buildingBuf = await runEdit({
    label: "widuri-building",
    prompt: buildingPrompt,
    imageUrls: [widuriPhotoUrl, buildingStyleUrl, venueIconUrl],
    imageSize: { width: 1024, height: 768 },
  });
  await shipWebp(buildingBuf, "event-widuri-building.webp");

  const mapPrompt =
    "Using the first image (Google Maps area around Widuri Restaurant, " +
    "Bandung) only as geographic ground truth, create a sparse hand-drawn " +
    "street map in the exact style of the bottom map in the second image: " +
    "organic slightly imperfect thin road lines, simple hand-lettered street " +
    "names in small caps, lots of empty cream space, no traffic colors, no " +
    "POI icons, no Google UI. Show only the essential roads near the venue: " +
    "Jl. Supratman, Jl. Bengawan, Jl. Cilaki, and the roundabout where they " +
    "meet; mark Widuri with one small simple pin or circle. Background: warm " +
    "ivory/cream paper. Line + lettering: soft warm charcoal/taupe ink. " +
    "Keep it airy and easy to read — half the density of a real map. " +
    "No watermark, no UI chrome, no photo realism.";

  const mapBuf = await runEdit({
    label: "widuri-map",
    prompt: mapPrompt,
    imageUrls: [mapsPhotoUrl, mapStyleUrl],
    imageSize: { width: 1024, height: 1024 },
  });
  await shipWebp(mapBuf, "event-widuri-map.webp");

  console.log("done.");
};

main().catch((err) => {
  console.error("[generate-event-venue] failed:", err.message ?? err);
  if (err.stdout) console.error(String(err.stdout).slice(0, 500));
  if (err.stderr) console.error(String(err.stderr).slice(0, 500));
  process.exitCode = 1;
});
