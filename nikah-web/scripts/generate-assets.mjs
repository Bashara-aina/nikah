#!/usr/bin/env node
/**
 * nikah-web fal.ai asset generator (GUIDE 01).
 *
 * Run phases (with .env loaded):
 *   node --env-file=.env scripts/generate-assets.mjs --list
 *   node --env-file=.env scripts/generate-assets.mjs --phase=0 --dry-run
 *   node --env-file=.env scripts/generate-assets.mjs --phase=0
 *   node --env-file=.env scripts/generate-assets.mjs --phase=1
 *   node --env-file=.env scripts/generate-assets.mjs --phase=4
 *   node --env-file=.env scripts/generate-assets.mjs --phase=6
 *
 * Phase 2 (per-character idle video) is intentionally skipped — the hero path
 * is COHESIVE PATH A (one master-coherent hero-bg-loop.mp4); per-character idle
 * loops are not needed.
 *
 * Idempotent: any existing `out` is skipped. Use --force to regenerate.
 */
import { fal } from "@fal-ai/client";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// ROOT = monorepo root. Assets/ lives here; nikah-web/public/assets/ is the
// generated mirror via `npm run copy-assets`.
const ROOT = resolve(__dirname, "..", "..");
const NIKAH_WEB = resolve(__dirname, "..");
const MANIFEST_PATH = resolve(NIKAH_WEB, "scripts/generate-manifest.json");

if (!process.env.FAL_KEY) {
  console.error("FAL_KEY missing — check nikah-web/.env");
  process.exit(1);
}
fal.config({ credentials: process.env.FAL_KEY });

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));

const args = process.argv.slice(2);
const get = (flag) => {
  const a = args.find((x) => x.startsWith(`${flag}=`));
  return a ? a.slice(flag.length + 1) : null;
};
const phase = Number(get("--phase"));
const DRY = args.includes("--dry-run");
const FORCE = args.includes("--force");
const LIST = args.includes("--list");

const MODELS = {
  rmbg: "fal-ai/bria/rmbg",
  minimax: "fal-ai/minimax/video-01-live",
  kling: "fal-ai/kling-video/v1.6/standard/image-to-video",
  img2img: "fal-ai/flux/dev/image-to-image",
  text2img: "fal-ai/flux/dev",
};

const STYLE =
  "soft watercolor storybook illustration, pastel palette of ivory cream blush dusty-rose soft-peach sage green, airy early-morning sunlight, whimsical and intimate, gentle outlines";

const LOOP = "seamless ambient loop, static camera, subtle motion only [Static shot]";

const PROMPTS = {
  scene: `The whole scene comes gently to life while the camera stays perfectly still: the couple breathe softly and smile, the cats' ears and tails twitch and a slow blink passes, the wildflower meadow sways in a light morning breeze, clouds drift slowly, white doves glide, a few petals drift through the air. Preserve the exact composition, characters, and ${STYLE}. Barely-perceptible, tender motion only. ${LOOP}`,
  meadow: `Wildflower meadow sways in a gentle morning breeze, pastel blossoms bob softly, a butterfly flutters briefly, ${STYLE}, ${LOOP}`,
  catsMeadow: `Several cats rest in a golden meadow, soft grass sways, tails move gently, ears twitch occasionally, warm light shimmers, ${STYLE}, ${LOOP}`,
  garland: `Floral garland sways gently in a soft breeze, pastel roses and ivory blossoms bob gracefully, leaves flutter, ${STYLE}, ${LOOP}`,
  swag: `Floral swag breathes and sways softly, cream and blush flowers move gently, ${STYLE}, ${LOOP}`,
  harmonize: `Harmonize this photograph into a ${STYLE}. Preserve faces, expressions, identity and composition completely. Only shift palette and light toward the storybook mood. Do not change the people.`,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function uploadLocal(rel) {
  // Sources live under nikah-web/ (e.g. correct/, scenes/, FOTO INVITATION/).
  const buf = readFileSync(resolve(NIKAH_WEB, rel));
  return fal.storage.upload(new Blob([buf]));
}

async function downloadUrl(url, outRel) {
  // Outputs land under monorepo-root assets/ (mirrored to nikah-web/public/assets/ by copy-assets).
  const out = resolve(ROOT, outRel);
  mkdirSync(dirname(out), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status} for ${url}`);
  const ab = await res.arrayBuffer();
  writeFileSync(out, Buffer.from(ab));
  const size = statSync(out).size;
  console.log(`  ✅ ${outRel} (${(size / 1024).toFixed(1)} KB)`);
  return size;
}

async function runModel(model, input, label, { timeoutMs = 240_000 } = {}) {
  if (DRY) {
    console.log(`  [dry] ${model}  ←  ${label}`);
    return null;
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(new Error("fal.ai timeout")), timeoutMs);
    try {
      const r = await fal.subscribe(model, { input, logs: false, signal: ac.signal });
      clearTimeout(t);
      return r.data;
    } catch (e) {
      clearTimeout(t);
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`  ⚠️  ${label} attempt ${attempt} failed: ${msg}`);
      if (attempt === 3) throw new Error(`${label} failed after 3 attempts: ${msg}`);
      await sleep(4000 * attempt);
    }
  }
}

const done = (outRel) => !FORCE && existsSync(resolve(ROOT, outRel));

async function phase0() {
  const items = [...manifest.characterSprites, ...manifest.decorative].filter((i) => i.rmbg);
  for (const it of items) {
    if (done(it.out)) {
      console.log(`  ⏭  ${it.out}`);
      continue;
    }
    console.log(`rmbg → ${it.out}`);
    const url = await uploadLocal(it.source);
    const data = await runModel(MODELS.rmbg, { image_url: url }, it.id);
    if (data?.image?.url) await downloadUrl(data.image.url, it.out);
    await sleep(1200);
  }
}

async function phase1() {
  for (const it of manifest.heroScenes) {
    if (done(it.out)) {
      console.log(`  ⏭  ${it.out}`);
      continue;
    }
    const variants = Math.max(1, it.variants ?? 1);
    for (let v = 1; v <= variants; v++) {
      const url = await uploadLocal(it.source);
      const prompt = PROMPTS[it.prompt];
      console.log(`i2v → ${it.out} (variant ${v}/${variants})`);
      const data = await runModel(MODELS.minimax, {
        image_url: url,
        prompt,
        duration: 6,
      }, `${it.id}-v${v}`);
      const outUrl = v === 1 ? it.out : it.out.replace(/\.mp4$/, `.v${v}.mp4`);
      if (data?.video?.url) await downloadUrl(data.video.url, outUrl);
      await sleep(2500);
    }
  }
}

async function phase4() {
  for (const it of manifest.gallery) {
    if (done(it.out)) {
      console.log(`  ⏭  ${it.out}`);
      continue;
    }
    console.log(`harmonize → ${it.out}`);
    const url = await uploadLocal(it.source);
    const data = await runModel(
      MODELS.img2img,
      {
        image_url: url,
        prompt: PROMPTS.harmonize,
        strength: 0.3,
        num_inference_steps: 28,
      },
      it.id,
    );
    if (data?.images?.[0]?.url) await downloadUrl(data.images[0].url, it.out);
    await sleep(1500);
  }
}

const STORY = {
  "story-motor":
    "A young Indonesian couple riding a motorbike together on a leafy campus road at golden hour, the woman wearing a hijab seated behind, both smiling softly, warm wind, transparent or plain pastel background",
  "story-jakarta":
    "A young couple studying and working side by side in a bright Jakarta setting, books and warm coffee, supportive and tender, plain pastel background",
  "story-ldr":
    "A tender long-distance moment — a young woman in Indonesia and a young man in Tokyo connected across a soft starry night sky, gentle longing, plain pastel background",
  "story-keio":
    "A joyful reunion of a young couple near a Japanese university with cherry blossoms and a train line, spring morning, hopeful, plain pastel background",
  "story-married":
    "A young Muslim wedding couple in Melayu wedding attire holding hands under a delicate floral arch with two small cats nearby, beginning a new journey, plain pastel background",
};

async function phase6() {
  for (const it of manifest.storyIllustrations) {
    if (done(it.out)) {
      console.log(`  ⏭  ${it.out}`);
      continue;
    }
    const prompt = `${STORY[it.id]}, ${STYLE}`;
    console.log(`text2img → ${it.out}`);
    const data = await runModel(
      MODELS.text2img,
      {
        prompt,
        image_size: "portrait_4_3",
        num_inference_steps: 30,
      },
      it.id,
    );
    if (data?.images?.[0]?.url) await downloadUrl(data.images[0].url, it.out);
    await sleep(1500);
  }
}

if (LIST) {
  console.log(JSON.stringify(MODELS, null, 2));
  process.exit(0);
}

const phases = { 0: phase0, 1: phase1, 4: phase4, 6: phase6 };
const fn = phases[phase];
if (!fn) {
  console.error("Pass --phase=0|1|4|6  (or --list / --dry-run)");
  process.exit(1);
}
console.log(`\n=== Phase ${phase}${DRY ? " (dry-run)" : ""}${FORCE ? " (force)" : ""} ===`);
console.log(`spend cap declared in manifest: $${manifest.fal_spend_cap_usd ?? 10}`);
await fn();
console.log("=== done ===\n");
