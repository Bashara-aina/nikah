#!/usr/bin/env node
/**
 * Hero sky band — one careful gpt-image-2/edit run (user-requested).
 *
 * Builds a 1080×2070 canvas: flat placeholder sky (top 720px) + the real hero
 * poster (bottom 1350px), asks the model to paint a seamless upward sky
 * continuation with quiet center for typography, then crops the generated
 * band back out. Junction continuity comes from the model painting across it.
 *
 * Output: relevant/01-hero-scenes-video/hero-sky-band.webp (review copy)
 *         nikah-web/assets/scenes/hero-sky-band.webp (shipping, compressed)
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { fal } from "@fal-ai/client";

const here = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(here, "..");
const REL = path.resolve(here, "..", "..", "relevant");

if (!process.env.FAL_KEY) {
  console.error("FAL_KEY missing — run with: node --env-file=.env scripts/generate-sky-band.mjs");
  process.exit(1);
}
fal.config({ credentials: process.env.FAL_KEY });

const EXT_H = 720; // placeholder band height on the 1080×2070 canvas
const POSTER = path.join(WEB, "assets/video/hero-bg-loop-poster.jpg");

const main = async () => {
  // 1. Compose input: flat sky placeholder above the real poster.
  const poster = sharp(POSTER);
  const { width: pw, height: ph } = await poster.metadata(); // 1080×1350
  const canvas = await sharp({
    create: {
      width: pw,
      height: ph + EXT_H,
      channels: 3,
      background: { r: 180, g: 217, b: 238 }, // flat placeholder ≈ artwork sky
    },
  })
    .composite([{ input: await poster.toBuffer(), top: EXT_H, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();

  console.log("uploading composite…");
  const inputUrl = await fal.storage.upload(new Blob([canvas], { type: "image/jpeg" }));

  const prompt =
    "The top portion of this image is a flat light-blue placeholder band; the " +
    "bottom is a soft watercolor storybook painting of a couple with cats in a " +
    "flower meadow under a blue sky. Replace ONLY the flat placeholder band " +
    "with a seamless upward continuation of that painted sky: the same soft " +
    "powder-blue watercolor wash, a few gentle wispy ivory clouds catching " +
    "warm late-morning light, two tiny distant white doves near the upper " +
    "corners, and a handful of small pink sakura petals drifting down along " +
    "the far left and right edges. Keep the middle of the new sky calm, pale " +
    "and uncluttered so wedding names can be printed over it. Do not change " +
    "the painting below — same brush grain, palette and light; the boundary " +
    "between new and existing sky must be completely invisible. No text.";

  console.log("running openai/gpt-image-2/edit (single attempt)…");
  const result = await fal.subscribe("openai/gpt-image-2/edit", {
    input: {
      prompt,
      image_urls: [inputUrl],
      image_size: "auto",
      quality: "high",
      num_images: 1,
      output_format: "webp",
    },
    logs: false,
  });

  const img = result.data?.images?.[0];
  if (!img?.url) throw new Error("no image in response");
  const outBuf = Buffer.from(await (await fetch(img.url)).arrayBuffer());
  const outMeta = await sharp(outBuf).metadata();
  console.log(`generated ${outMeta.width}x${outMeta.height}`);

  // 2. Crop the band: the extension occupies EXT_H/(ph+EXT_H) of the height.
  //    Keep a 3% overlap below the junction — the site's blend overlay hides it.
  const frac = EXT_H / (ph + EXT_H);
  const bandH = Math.round(outMeta.height * (frac + 0.03));
  const band = await sharp(outBuf)
    .extract({ left: 0, top: 0, width: outMeta.width, height: bandH })
    .toBuffer();

  const review = path.join(REL, "01-hero-scenes-video/hero-sky-band.webp");
  await writeFile(review, band);

  const ship = await sharp(band)
    .resize({ width: 1080, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toBuffer();
  await sharp(ship).toFile(path.join(WEB, "assets/scenes/hero-sky-band.webp"));
  const m = await sharp(ship).metadata();
  console.log(`band saved: ${m.width}x${m.height}, ${(ship.length / 1024).toFixed(0)}KB (+ review copy in relevant/)`);
};

main().catch((err) => {
  console.error("[generate-sky-band] failed:", err.message ?? err);
  process.exitCode = 1;
});
