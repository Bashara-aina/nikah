#!/usr/bin/env node
/**
 * One-shot gpt-image-2/edit run for story ch04 (plan 02 §5 brief):
 * split scene · Tokyo Tower · sakura branch · LDR connection kept as
 * connector · watercolor storybook matching hero-main. Saves the candidate as
 * relevant/04-story/story-ch04-ldr-tokyo-v2.webp for human sign-off — the
 * original keeper is never overwritten.
 *
 * FAL_KEY comes from nikah-web/.env (node --env-file). Never logged.
 */
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fal } from "@fal-ai/client";

const here = path.dirname(fileURLToPath(import.meta.url));
const REL = path.resolve(here, "..", "..", "relevant");

if (!process.env.FAL_KEY) {
  console.error("FAL_KEY missing — run with: node --env-file=.env scripts/edit-ch04.mjs");
  process.exit(1);
}
fal.config({ credentials: process.env.FAL_KEY });

const upload = async (p, type) => {
  const buf = await readFile(p);
  return fal.storage.upload(new Blob([buf], { type }));
};

const main = async () => {
  console.log("uploading references…");
  const ch04Url = await upload(path.join(REL, "04-story/story-ch04-ldr-tokyo.webp"), "image/webp");
  const heroUrl = await upload(path.join(REL, "01-hero-scenes-video/hero-main.webp"), "image/webp");

  const prompt =
    "Edit the first image (keep its soft watercolor storybook style, warm cozy " +
    "light, and the same two people: hijabi bride in ivory knit hijab and " +
    "sweater on the left, young man with dark fluffy hair in a navy blue shirt " +
    "inside the laptop screen). Transform it into a long-distance love split " +
    "scene: through a large window behind the man's side of the video call, " +
    "show Tokyo Tower at dusk and a blooming cherry-blossom (sakura) branch " +
    "reaching into the frame. Keep the glowing heart connection between their " +
    "hands over the laptop as the connector. Her side stays a warm Indonesian " +
    "room with plants and flowers. Palette: ivory ground, dusty blush, sage " +
    "green, warm golden daylight — never cold grey. Match the painterly grain " +
    "and character faces of the second reference image. No text.";

  console.log("running openai/gpt-image-2/edit (single attempt)…");
  const result = await fal.subscribe("openai/gpt-image-2/edit", {
    input: {
      prompt,
      image_urls: [ch04Url, heroUrl],
      image_size: "auto",
      quality: "high",
      num_images: 1,
      output_format: "webp",
    },
    logs: false,
  });

  const img = result.data?.images?.[0];
  if (!img?.url) throw new Error("no image in response");
  const res = await fetch(img.url);
  const out = path.join(REL, "04-story/story-ch04-ldr-tokyo-v2.webp");
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  console.log(`saved ${out} (${img.width}x${img.height})`);
};

main().catch((err) => {
  console.error("[edit-ch04] failed:", err.message ?? err);
  process.exitCode = 1;
});
