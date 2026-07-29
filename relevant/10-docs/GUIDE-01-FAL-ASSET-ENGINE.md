# GUIDE 01 — THE fal.ai ASSET ENGINE

> **This is the heart of the project. Cursor: build, configure, and run the entire fal.ai pipeline yourself before any UI work begins.**
> The `FAL_KEY` already exists in `nikah-web/.env`. `@fal-ai/client` is already in `package.json`. Your job is to turn the reference art in `correct/most correct/`, the scene refs in `nikah-web/correct/`, and the real photos in `FOTO INVITATION/` into a complete set of **living video loops, transparent sprites, harmonized photos, and story illustrations** — all produced by fal.ai.

This guide supersedes the MiniMax/Gemini instructions in the old `NIKAH-MASTER-TECHSTACK.md` and `docs/07-gemini-asset-prompts.md`. **Everything generative now runs through fal.ai.**

---

## ⭐ THE MASTER VISUAL ANCHOR — `nikah-web/scenes/hero-main.webp`

> **THIS IMAGE IS THE DESIGN. Everything in the entire project conforms to it — no exceptions.**
> Every fal.ai prompt, every generated sprite, every harmonized photo, every color token, every hero layer position, every illustration's style is **derived from and must match `nikah-web/scenes/hero-main.webp`.** When any decision is ambiguous, **open this file and match it.** It is not "a reference" among many — it is the single source of visual truth. The art in `correct/most correct/` is raw material to be conformed *to this master*, never the other way around.

**What the master depicts (study it before generating anything):**
- A **couple in a sunlit wildflower meadow under a soft blue sky** with white clouds — gentle, diffuse early-morning light. Portrait **4:5**.
- **Left:** the bride in a **cream/ivory outfit and soft beige hijab**, smiling, holding a fluffy ragdoll/tabby cat; a **white kitten** peeks over her shoulder.
- **Right:** the groom in a **deep navy/charcoal outfit**, smiling, holding a **black-and-white tuxedo cat**; a **black cat** rests on his shoulder.
- **Foreground grass:** three more cats — an **orange-and-white** cat (left), a **gray tabby with a collar** (center), a **brown tabby lying down** (right). **Seven cats total** — the couple's seven cats, central to the identity.
- **Sky:** white **doves** in flight. **Butterflies** (soft pink/lavender) flutter on both sides. Wildflowers in **blush pink, white, butter yellow, soft lavender** scatter across a **spring-green** meadow.
- **Mood:** intimate, warm, whimsical, storybook watercolor/gouache — exactly "hidup, bukan kaku."

**The locked palette is whatever this image already is** (the `DESIGN.md`/`docs/01` palette names describe it): ivory/cream, blush, dusty rose, soft peach, sage/spring green, soft sky blue, **and the groom's deep navy as an intentional anchor color** (do not "pastel-ify" it away). White for doves/drapery. Soft charcoal/taupe for text — never pure black.

### 🚫 REGENERATE — do NOT just remove backgrounds
**The `correct/` references can never be shipped, and rmbg-alone is forbidden.** Background removal by itself does **not** work: the AI refs have baked-in flower backgrounds, jagged/AI edges, wrong proportions, and inconsistent style — stripping the background just leaves a broken, off-brand cutout. Every `correct/` asset must be **genuinely regenerated** by fal.ai into a clean, consistent, on-brand NEW asset:
- **Regenerate, conditioned on the reference + the master.** Use `flux/dev/image-to-image` (or a Kontext/edit model) with the reference image, a strength high enough to actually transform it (~0.5–0.75), and the master's style in the prompt ("…matching the soft morning-meadow storybook palette and watercolor style of the reference"). For characters you want a clean plain/neutral backdrop so the *regenerated* output is crisp.
- **Prefer combining several references into ONE cohesive asset** where it helps (e.g. compose a hero/closing scene, merge multiple cats into one group, place the couple with cats). Use a **multi-image edit/compose model** (e.g. `fal-ai/flux-pro/kontext` or a nano-banana-style multi-image model — verify the current ID). Composition beats a pile of disjoint cutouts.
- **rmbg is a FINISHING step only** — run `bria/rmbg` *after* regeneration, on the already-clean output, when you need transparency. Never as the sole transformation. A raw `correct/` file → rmbg → site is explicitly wrong.

**Operational rules that flow from the master:**
- Hero scene video (`hero-bg-loop.mp4`) is generated **directly from `scenes/hero-main.webp`** (see §3 manifest).
- Each individual cat sprite from `correct/most correct/` must be **color- and style-matched to how that same cat appears in the master** (the tuxedo, the ragdoll, the orange-white, the gray tabby, the brown tabby, the white kitten, the black cat).
- The couple sprite, the story illustrations, and the harmonized gallery photos all target **the master's exact light temperature, palette, and watercolor finish.** Add the master's mood to prompts: *"matching the soft morning-meadow storybook palette and watercolor style of the reference."*
- `heroLayout.ts` layer boxes are calibrated to the **master's composition** (GUIDE 02 §B.2): bride left, groom right, the five visible cats where they sit, doves/butterflies above.
- If a generated asset does not sit comfortably inside this world, **it is wrong — regenerate it.** The master wins every tie.

---

## 0. The North Star (why this matters)

The site must feel *alive* — "hidup, bukan kaku." That aliveness is not faked with CSS breathing on flat PNGs. It comes from **real video loops generated by fal.ai** for scenes and characters, plus **palette-harmonized real photos**, plus **on-brand story illustrations**. GSAP/Motion only orchestrate entrance + parallax + interaction on top. If the fal.ai assets are weak, no amount of code saves the feel. So this is step zero, and it is the most important step.

**Aesthetic contract for every fal.ai prompt** (non-negotiable, from `docs/01`, `DESIGN.md`, `PRODUCT.md`):
- Palette: **ivory, cream, blush pink, dusty rose, soft peach, sage green.** Never fuchsia, hot pink, gold glitter, or bold saturated color.
- Style: **whimsical storybook, soft watercolor/gouache, flat illustration, airy, early-morning sunshine.**
- Mood: intimate · romantic · playful (the cats are characters, not decoration).
- Motion (video): **5–6s seamless loop, static camera, ambient only** — breathing, sway, drift, blink. No camera moves, no big gestures, no morphing.
- **Real photos (`FOTO INVITATION/`) are sacred:** harmonize palette only, strength ≤ 0.35, faces and composition preserved. **Never** turned into video.

---

## 1. What you are producing (the output manifest)

Everything lands in `nikah-web/assets/**` (the monorepo-root working copy). `npm run copy-assets` mirrors it into `nikah-web/public/assets/**`. **Never write directly to `public/assets/`.**

| Bucket | Output path | Source | fal model | Type |
| :-- | :-- | :-- | :-- | :-- |
| Hero scene loops | `assets/video/hero-bg-loop.mp4`, `meadow-bottom-loop.mp4` | `nikah-web/correct/` scene refs, `correct/most correct/wildflower-meadow-full.png` | `fal-ai/minimax/video-01-live` (or Kling/Hailuo i2v) | opaque MP4 |
| Group character loops | `assets/video/cats-meadow-loop.mp4`, `cats-hero-group-idle.mp4`, `couple-idle.mp4` | `correct/most correct/five-cats-golden-meadow-sunset.png`, `cats-white-tuxedo-arch-frame.png`, `couple-scooter-vespa-wedding.png` | i2v (see §5 alpha decision) | MP4 |
| Floral loops | `assets/video/floral-garland-loop.mp4`, `floral-swag-loop.mp4` | `floral-garland-full-swag.png`, `floral-swag-full.png` | `fal-ai/minimax/video-01-live` | MP4 |
| Transparent sprites | `assets/cats/cat-*.png`, `assets/couple/couple-cutout.png`, `assets/florals/*.png` | `correct/most correct/*` | **regenerate** `flux/dev/image-to-image` → then `bria/rmbg` (finish) | PNG (alpha) |
| Combined assets (preferred) | e.g. `assets/cats/cats-group.png` | several `correct/most correct/*` | `flux-pro/kontext` (multi-image compose) | PNG |
| Hero posters | `assets/scenes/hero-bg.webp`, `hero-tall.webp`, `countdown-bg.webp` | scene refs | first-frame export / `flux/dev/image-to-image` refine | WebP |
| Gallery (real photos) | `assets/gallery/gallery-01.webp … gallery-NN.webp` | `FOTO INVITATION/*` | `fal-ai/flux/dev/image-to-image` strength 0.3 | WebP |
| Story illustrations | `assets/illustrations/story-motor.png`, `story-jakarta.png`, `story-ldr.png`, `story-keio.png`, `story-married.png` | text prompts (§7) | `fal-ai/flux/dev` (text-to-image) | PNG |
| Audio | `assets/audio/la-vie-en-rose.mp3` | provided by couple | — (compress only) | MP3 |

The canonical status checklist is `nikah-web/docs/TODO_ASSETS.md`. **Update it (`⬜ → 🔄 → ✅`) as you go.** The reference manifests with exact source filenames live in `docs/13-fal-generation-plan.md` and `docs/04-asset-list.md` — read both before writing the script.

---

## 2. Configure fal.ai yourself (do not ask the user)

1. **Verify the key loads.** `FAL_KEY` is in `nikah-web/.env`. The generation script is run with Node from `nikah-web/`, so load it:
   ```bash
   cd nikah-web
   node --env-file=.env scripts/generate-assets.mjs --phase=0 --dry-run
   ```
   (Node ≥ 20.6 supports `--env-file`. If the project's Node is older, use `dotenv` — already trivial to add as a dev dep, or read `.env` manually in the script.)

2. **Set a spend cap.** In the fal.ai dashboard, set a hard cap of **$10** before any real run (the full pipeline costs ~$5; see §9). Tell the user you did this. The script must also self-limit (see §8 idempotency + dry-run).

3. **Confirm model IDs are current.** Model IDs drift. Before a real run, the script's `--list` mode should print the model IDs it intends to call so you (Cursor) can sanity-check them against `https://fal.ai/models`. If a model 404s or errors `ValidationError`, **pick the closest current equivalent and note the swap in `docs/13`** — this is an explicit decision you are allowed to make (see decision box below).

> 💰 **Budget: $10 total.** The exact model-per-asset choices, settings, per-item cost estimates, the spend order, and a ledger that lands the whole pipeline at ~$3 are in **[GUIDE-01-APPENDIX-MODEL-BUDGET.md](GUIDE-01-APPENDIX-MODEL-BUDGET.md)** — read it before running anything. The summary below is the short version; the appendix is authoritative on cost.

> ### 🔀 DECISION — model selection
> The defaults below are correct as of the doc set, but you own final model choice. Use this priority:
> - **Background removal:** `fal-ai/bria/rmbg` (fast, clean edges). Alt: `fal-ai/birefnet`.
> - **Scene/floral i2v (opaque, environmental):** `fal-ai/minimax/video-01-live`. Alts: `fal-ai/kling-video/v1.6/standard/image-to-video`, `fal-ai/hailuo` i2v. Pick whichever gives the most *subtle, seamless, watercolor-preserving* loop. Generate one test, eyeball it, then commit.
> - **Character idle i2v:** `fal-ai/wan/v2.2/image-to-video` (or current `wan` i2v). Alt: Kling i2v with low motion.
> - **img2img harmonize + text-to-image illustrations:** `fal-ai/flux/dev/image-to-image` and `fal-ai/flux/dev`. Alt: `flux-pro/v1.1` for higher fidelity if budget allows.
> Whatever you choose, keep the **prompt aesthetic contract from §0 identical.** The model can change; the look cannot.

---

## 3. Phase 0 — Asset triage (do this BEFORE calling fal at all)

Walk `nikah-web/correct/most correct/` and assign every PNG to one of four groups. Write the result to `nikah-web/scripts/generate-manifest.json`. This file is the single source the generator reads — it decouples "what to make" from "how to make it."

```jsonc
// nikah-web/scripts/generate-manifest.json
{
  "heroScenes": [
    // full-scene opaque video loops — the hero loop is generated FROM THE MASTER itself.
    { "id": "hero-bg",        "source": "scenes/hero-main.webp",                         "model": "minimax", "out": "assets/video/hero-bg-loop.mp4",       "prompt": "scene" },
    { "id": "meadow-bottom",  "source": "correct/most correct/wildflower-meadow-full.png","model": "minimax", "out": "assets/video/meadow-bottom-loop.mp4", "prompt": "meadow" },
    { "id": "cats-meadow",    "source": "correct/most correct/five-cats-golden-meadow-sunset.png", "model": "minimax", "out": "assets/video/cats-meadow-loop.mp4", "prompt": "catsMeadow" }
  ],
  "characterSprites": [
    // REGENERATE (img2img, conditioned on ref + master) → clean on-brand asset, THEN rmbg for transparency.
    // `regen: true` = mandatory regeneration; `rmbg: true` = finishing transparency pass on the regenerated output.
    // Prefer composing the cats into a group asset (see "combine" below) rather than 7 lone cutouts.
    { "id": "cat-jiro",  "source": "correct/most correct/cat-jiro-in-flowers.png",       "regen": true, "rmbg": true, "out": "assets/cats/cat-jiro.png" },
    { "id": "cat-meng",  "source": "correct/most correct/cat-meng-with-flowers.png",      "regen": true, "rmbg": true, "out": "assets/cats/cat-meng.png" },
    { "id": "cat-moju",  "source": "correct/most correct/cat-moju-sleeping-flowers.png",  "regen": true, "rmbg": true, "out": "assets/cats/cat-moju.png" },
    { "id": "cat-shiro", "source": "correct/most correct/cat-shiro-butterfly.png",        "regen": true, "rmbg": true, "out": "assets/cats/cat-shiro.png" },
    { "id": "cat-simba", "source": "correct/most correct/cat-simba-with-dove.png",        "regen": true, "rmbg": true, "out": "assets/cats/cat-simba.png" },
    { "id": "cat-hoshi", "source": "correct/most correct/cat-hoshi-kimho-playing.png",    "regen": true, "rmbg": true, "out": "assets/cats/cat-hoshi.png" },
    { "id": "cat-peek",  "source": "correct/most correct/tuxedo-cat-reaching-flower.png", "regen": true, "rmbg": true, "out": "assets/florals/cat-peek.png" },
    { "id": "couple",    "source": "correct/most correct/couple-scooter-vespa-wedding.png","regen": true, "rmbg": true, "out": "assets/couple/couple-cutout.png" }
  ],
  "combine": [
    // OPTIONAL but PREFERRED — compose several references into ONE cohesive new asset (multi-image edit model).
    { "id": "cats-group", "sources": ["correct/most correct/cat-jiro-in-flowers.png","correct/most correct/cat-simba-with-dove.png","correct/most correct/cat-shiro-butterfly.png"], "out": "assets/cats/cats-group.png", "prompt": "Compose these cats into one cohesive group sitting together in soft grass, matching the master's palette and watercolor style" }
  ],
  "decorative": [
    // REGENERATE into clean on-brand PNGs (img2img), THEN rmbg. CSS animates these, NO video. rmbg-alone is NOT enough.
    { "id": "floral-corner-tl", "source": "correct/most correct/vertical-floral-spray.png",     "regen": true, "rmbg": true, "out": "assets/florals/floral-corner-tl.png" },
    { "id": "floral-corner-br", "source": "correct/most correct/vertical-rose-spray.png",       "regen": true, "rmbg": true, "out": "assets/florals/floral-corner-br.png" },
    { "id": "floral-sprig",     "source": "correct/most correct/vertical-garden-spray.png",     "regen": true, "rmbg": true, "out": "assets/florals/floral-sprig.png" },
    { "id": "drapery-divider",  "source": "correct/most correct/flowing-floral-divider-wavy.png","regen": true,"rmbg": true,"out": "assets/florals/drapery-divider.png" },
    { "id": "accent-doves",     "source": "correct/most correct/doves-with-flowing-flowers.png","regen": true, "rmbg": true, "out": "assets/florals/accent-doves.png" },
    { "id": "petals-anim",      "source": "correct/most correct/falling-petals-scattered.png",  "regen": true, "rmbg": true, "out": "assets/florals/petals-anim.png" }
  ],
  "floralLoops": [
    { "id": "floral-garland", "source": "correct/most correct/floral-garland-full-swag.png", "model": "minimax", "out": "assets/video/floral-garland-loop.mp4", "prompt": "garland" },
    { "id": "floral-swag",    "source": "correct/most correct/floral-swag-full.png",         "model": "minimax", "out": "assets/video/floral-swag-loop.mp4",    "prompt": "swag" }
  ],
  "gallery": [
    // every photo in FOTO INVITATION/ that should appear in the gallery — strength 0.30
    { "id": "gallery-01", "source": "FOTO INVITATION/couple-standing-smiling.jpg",     "out": "assets/gallery/gallery-01.webp" }
    // … add the rest you select
  ],
  "storyIllustrations": [
    { "id": "story-motor",   "out": "assets/illustrations/story-motor.png" },
    { "id": "story-jakarta", "out": "assets/illustrations/story-jakarta.png" },
    { "id": "story-ldr",     "out": "assets/illustrations/story-ldr.png" },
    { "id": "story-keio",    "out": "assets/illustrations/story-keio.png" },
    { "id": "story-married", "out": "assets/illustrations/story-married.png" }
  ]
}
```

> **Cursor:** the `source` paths above are relative to `nikah-web/`. Confirm each file exists (`ls "correct/most correct/"`) and fix any name mismatch before running. **The hero scene source is fixed: `scenes/hero-main.webp` — the master.** Do not substitute another composition for it; the entire hero is built to match this exact frame. Generate `hero-bg-loop.mp4` from it so the living background *is* the master, breathing. (You may also generate a 9:16 `hero-tall-loop.mp4` from `scenes/hero-tall.webp` for full-bleed mobile if it exists.)

---

## 4. The generator script (`scripts/generate-assets.mjs`)

Replace any GitHub-raw-URL approach from `docs/13` with **local file upload** via `fal.storage.upload` — it's more robust (no need to push a public repo first). Build the script to be **phased, idempotent, retrying, and dry-runnable.**

```javascript
// nikah-web/scripts/generate-assets.mjs
// Run:  node --env-file=.env scripts/generate-assets.mjs --phase=0
//       node --env-file=.env scripts/generate-assets.mjs --phase=1 --dry-run
//       node --env-file=.env scripts/generate-assets.mjs --list
import { fal } from "@fal-ai/client";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

fal.config({ credentials: process.env.FAL_KEY });
if (!process.env.FAL_KEY) { console.error("FAL_KEY missing — check nikah-web/.env"); process.exit(1); }

const ROOT = resolve(import.meta.dirname, "..");           // nikah-web/
const manifest = JSON.parse(readFileSync(resolve(ROOT, "scripts/generate-manifest.json"), "utf8"));
const args = process.argv.slice(2);
const phase = (args.find(a => a.startsWith("--phase=")) ?? "").split("=")[1]; // "0" | "0b" | "1" | "2" | "4" | "6"
const DRY = args.includes("--dry-run");
const FORCE = args.includes("--force");

// Models — single place to swap (see GUIDE-01 §2 decision box).
const MODELS = {
  rmbg:    "fal-ai/bria/rmbg",                 // FINISHING step only — never the sole transform
  minimax: "fal-ai/minimax/video-01-live",
  wan:     "fal-ai/wan/v2.2/image-to-video",
  img2img: "fal-ai/flux/dev/image-to-image",   // REGENERATE refs into clean on-brand assets
  compose: "fal-ai/flux-pro/kontext",          // COMBINE several refs into one (verify current ID)
  text2img:"fal-ai/flux/dev",
};

const STYLE = "soft watercolor storybook illustration, pastel palette of ivory cream blush dusty-rose soft-peach sage green, airy early-morning sunlight, whimsical and intimate, gentle outlines";

// Reusable loop directive for video models.
const LOOP = "seamless ambient loop, static camera, subtle motion only [Static shot]";

const PROMPTS = {
  // hero-bg-loop is THE MASTER (scenes/hero-main.webp) brought to life as ONE cohesive scene:
  // the whole painting breathes — do not isolate elements, keep the exact composition.
  scene:      `The whole scene comes gently to life while the camera stays perfectly still: the couple breathe softly and smile, the cats' ears and tails twitch and a slow blink passes, the wildflower meadow sways in a light morning breeze, clouds drift slowly, white doves glide, a few petals drift through the air. Preserve the exact composition, characters, and ${STYLE}. Barely-perceptible, tender motion only. ${LOOP}`,
  meadow:     `Wildflower meadow sways in a gentle morning breeze, pastel blossoms bob softly, a butterfly flutters briefly, ${STYLE}, ${LOOP}`,
  catsMeadow: `Several cats rest in a golden meadow, soft grass sways, tails move gently, ears twitch occasionally, warm light shimmers, ${STYLE}, ${LOOP}`,
  garland:    `Floral garland sways gently in a soft breeze, pastel roses and ivory blossoms bob gracefully, leaves flutter, ${STYLE}, ${LOOP}`,
  swag:       `Floral swag breathes and sways softly, cream and blush flowers move gently, ${STYLE}, ${LOOP}`,
  couple:     `Wedding couple breathes warmly together, gentle hair movement in a soft breeze, a tender shared smile, ${STYLE}, ${LOOP}`,
  catIdle:    (name) => `A cat (${name}) breathes slowly and peacefully, one ear twitches, tail sways gently, a slow blink, ${STYLE}, ${LOOP}`,
  harmonize:  `Harmonize this photograph into a ${STYLE}. Preserve faces, expressions, identity and composition completely. Only shift palette and light toward the storybook mood. Do not change the people.`,
  // REGENERATE a `correct/` reference into a clean, on-brand asset (NOT a background removal):
  regen:      `Redraw this subject cleanly as a ${STYLE}, on a plain neutral backdrop, crisp clean edges, no leftover flowers or clutter behind it, consistent proportions. Match the soft morning-meadow palette and watercolor style of the reference. Keep the character/subject identity.`,
};

async function uploadLocal(rel) {
  const buf = readFileSync(resolve(ROOT, rel));
  return fal.storage.upload(new Blob([buf]));
}
async function download(url, outRel) {
  const out = resolve(ROOT, outRel);
  mkdirSync(dirname(out), { recursive: true });
  const res = await fetch(url);
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log(`  ✅ ${outRel}`);
}
async function run(model, input, label) {
  if (DRY) { console.log(`  [dry] ${model}  ←  ${label}`); return null; }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fal.subscribe(model, { input, logs: true });
      return r.data;
    } catch (e) {
      console.warn(`  ⚠️  ${label} attempt ${attempt} failed: ${e?.message ?? e}`);
      if (attempt === 3) throw e;
      await new Promise(r => setTimeout(r, 4000 * attempt));
    }
  }
}
const done = (outRel) => !FORCE && existsSync(resolve(ROOT, outRel));   // idempotency

// ---- Phase 0: REGENERATE refs into clean on-brand assets, THEN finish with rmbg ----
// rmbg-alone is forbidden — we always regenerate first (GUIDE 01 §"REGENERATE").
async function phase0() {
  const items = [...manifest.characterSprites, ...manifest.decorative];
  for (const it of items) {
    if (done(it.out)) { console.log(`  ⏭  ${it.out} exists`); continue; }
    // 1) Regenerate the reference into a clean, on-brand image on a plain backdrop.
    let imageUrl = await uploadLocal(it.source);
    if (it.regen !== false) {
      console.log(`regen → ${it.id}`);
      const r = await run(MODELS.img2img, { image_url: imageUrl, prompt: PROMPTS.regen, strength: 0.65, num_inference_steps: 30 }, `${it.id} regen`);
      if (r) imageUrl = r.images[0].url;          // feed the clean output into rmbg
    }
    // 2) Finishing transparency pass on the REGENERATED output (not the raw ref).
    if (it.rmbg) {
      console.log(`rmbg  → ${it.out}`);
      const data = await run(MODELS.rmbg, { image_url: imageUrl }, `${it.id} rmbg`);
      if (data) await download(data.image.url, it.out);
    } else if (!DRY && imageUrl) {
      await download(imageUrl, it.out);
    }
    await new Promise(r => setTimeout(r, 1500));
  }
}

// ---- Phase 0b: COMBINE several refs into ONE cohesive asset (preferred over lone cutouts) ----
async function phaseCombine() {
  for (const it of (manifest.combine ?? [])) {
    if (done(it.out)) { console.log(`  ⏭  ${it.out} exists`); continue; }
    console.log(`combine → ${it.out}`);
    const image_urls = await Promise.all(it.sources.map(uploadLocal));
    // Kontext/compose models accept multiple image inputs — verify the param name for the model you pick.
    const data = await run(MODELS.compose, { image_urls, prompt: `${it.prompt}, ${STYLE}` }, it.id);
    if (data) await download((data.images?.[0] ?? data.image).url, it.out);
    await new Promise(r => setTimeout(r, 2500));
  }
}

// ---- Phase 1: scene + floral video loops ----
async function phase1() {
  const items = [...manifest.heroScenes, ...manifest.floralLoops];
  for (const it of items) {
    if (done(it.out)) { console.log(`  ⏭  ${it.out} exists`); continue; }
    console.log(`i2v → ${it.out}`);
    const image_url = await uploadLocal(it.source);
    const data = await run(MODELS.minimax, { image_url, prompt: PROMPTS[it.prompt], duration: 6 }, it.id);
    if (data) await download(data.video.url, it.out);
    await new Promise(r => setTimeout(r, 3000));
  }
}

// ---- Phase 2: character idle loops (see §5 alpha decision before enabling) ----
async function phase2() {
  // Only run for characters you decided to animate as VIDEO (group/opaque ones).
  for (const it of manifest.characterSprites.filter(i => i.idle)) {
    if (done(it.idleOut)) { console.log(`  ⏭  ${it.idleOut} exists`); continue; }
    console.log(`idle → ${it.idleOut}`);
    const image_url = await uploadLocal(it.out);   // the rmbg PNG from phase 0
    const prompt = it.id === "couple" ? PROMPTS.couple : PROMPTS.catIdle(it.id);
    const data = await run(MODELS.wan, { image_url, prompt, duration: "5", aspect_ratio: "9:16" }, it.id);
    if (data) await download(data.video.url, it.idleOut);
    await new Promise(r => setTimeout(r, 3000));
  }
}

// ---- Phase 4: gallery harmonize (real photos — strength 0.30, faces preserved) ----
async function phase4() {
  for (const it of manifest.gallery) {
    if (done(it.out)) { console.log(`  ⏭  ${it.out} exists`); continue; }
    console.log(`harmonize → ${it.out}`);
    const image_url = await uploadLocal(it.source);
    const data = await run(MODELS.img2img, { image_url, prompt: PROMPTS.harmonize, strength: 0.30, num_inference_steps: 28 }, it.id);
    if (data) await download(data.images[0].url, it.out);
    await new Promise(r => setTimeout(r, 2000));
  }
}

// ---- Phase 6: story illustrations (text-to-image, on-brand) ----
async function phase6() {
  const STORY = {
    "story-motor":   "A young Indonesian couple riding a motorbike together on a leafy campus road at golden hour, the woman wearing a hijab seated behind, both smiling softly, warm wind, transparent or plain pastel background",
    "story-jakarta": "A young couple studying and working side by side in a bright Jakarta setting, books and warm coffee, supportive and tender, plain pastel background",
    "story-ldr":     "A tender long-distance moment — a young woman in Indonesia and a young man in Tokyo connected across a soft starry night sky, gentle longing, plain pastel background",
    "story-keio":    "A joyful reunion of a young couple near a Japanese university with cherry blossoms and a train line, spring morning, hopeful, plain pastel background",
    "story-married": "A young Muslim wedding couple in Melayu wedding attire holding hands under a delicate floral arch with two small cats nearby, beginning a new journey, plain pastel background",
  };
  for (const it of manifest.storyIllustrations) {
    if (done(it.out)) { console.log(`  ⏭  ${it.out} exists`); continue; }
    console.log(`illustration → ${it.out}`);
    const prompt = `${STORY[it.id]}, ${STYLE}`;
    const data = await run(MODELS.text2img, { prompt, image_size: "portrait_4_3", num_inference_steps: 30 }, it.id);
    if (data) await download(data.images[0].url, it.out);
    await new Promise(r => setTimeout(r, 2000));
  }
}

if (args.includes("--list")) { console.log(MODELS); process.exit(0); }
const phases = { "0": phase0, "0b": phaseCombine, "1": phase1, "2": phase2, "4": phase4, "6": phase6 };
const fn = phases[phase];
if (!fn) { console.error("Pass --phase=0|0b|1|2|4|6  (or --list / --dry-run)"); process.exit(1); }
console.log(`\n=== Phase ${phase}${DRY ? " (dry-run)" : ""} ===`);
await fn();
console.log("=== done ===\n");
```

Add npm scripts so the user (and you) can run phases cleanly:

```jsonc
// package.json "scripts" — add these
"gen:0": "node --env-file=.env scripts/generate-assets.mjs --phase=0",
"gen:0b": "node --env-file=.env scripts/generate-assets.mjs --phase=0b",
"gen:1": "node --env-file=.env scripts/generate-assets.mjs --phase=1",
"gen:2": "node --env-file=.env scripts/generate-assets.mjs --phase=2",
"gen:4": "node --env-file=.env scripts/generate-assets.mjs --phase=4",
"gen:6": "node --env-file=.env scripts/generate-assets.mjs --phase=6",
"gen:dry": "node --env-file=.env scripts/generate-assets.mjs --phase=0 --dry-run"
```

---

## 5. The alpha-video decision (READ THIS — it shapes the whole hero)

Video files (MP4/H.264) **do not carry transparency.** The old docs casually say "transparent background video loop" for each cat — that is not what an i2v model returns. You must decide how characters come alive. There are three honest paths:

> ### 🔀 DECISION — how characters breathe
> **Path A — Group-in-scene video (RECOMMENDED).** Animate characters as **opaque full-frame group videos that include their natural setting**: `cats-meadow-loop.mp4`, `cats-hero-group-idle.mp4`, `couple-idle.mp4` (couple on the vespa, with its background). These are opaque, need no alpha, loop beautifully, and read as one living painting. Individual floating cats placed as separate hero layers stay **transparent PNG sprites** (from Phase 0 rmbg) animated with a *tiny* Motion float (`MotionFloat`, amplitude `move.float`). This avoids the alpha trap entirely and still feels alive. **Default to this.**
>
> **Path B — Alpha video via VP9/WebM.** Generate the idle MP4, then post-process every frame through rmbg + re-encode to VP9 alpha WebM with ffmpeg. Crisp transparent breathing cats, but heavy, slow, and per-frame matting often flickers on watercolor edges. Only attempt if Path A's group videos don't satisfy the couple.
>
> **Path C — No character video at all.** Characters are transparent PNG sprites with Motion micro-float; only *scenes and florals* get fal video. Lightest, safest, still lovely. Fall back to this if budget or quality forces it.

**Recommendation:** ship **Path A**. In the manifest, mark only `couple`, `cats-hero-group`, and the meadow group with `"idle": true` + an `idleOut` path, and run Phase 2 on those. Leave individual cats as sprites. This matches `docs/09` (couple-idle + cats-hero-group as video; corner florals as CSS; petals/doves as GSAP) and `docs/12 §Cats` while sidestepping the alpha problem. Document whichever path you choose at the top of `docs/13`.

---

## 6. Seamless loops & quality bar

A loop that visibly "jumps" kills the magic. For each generated video:
- Request `duration: 6` and prompt `seamless ambient loop ... [Static shot]`.
- After download, **inspect the first vs last frame.** If there's a visible cut, either (a) regenerate with a calmer prompt ("barely perceptible motion"), or (b) post-process with ffmpeg to crossfade-loop:
  ```bash
  ffmpeg -i in.mp4 -filter_complex "[0]reverse[r];[0][r]concat=n=2:v=1[v]" -an boomerang.mp4   # ping-pong fallback
  ```
- **Compress every MP4 to < 2 MB, max 1080px** (perf budget, `docs/06`/`docs/11 §9`):
  ```bash
  ffmpeg -i raw.mp4 -vf "scale='min(1080,iw)':-2" -c:v libx264 -crf 26 -preset slow -an -movflags +faststart out.mp4
  ```
- Generate a **WebP poster** (first frame) for every video — it's the fallback for LOW/REDUCED tiers and the `poster=` attribute:
  ```bash
  ffmpeg -i out.mp4 -frames:v 1 -q:v 80 poster.webp
  ```
  Posters for scene layers go to `assets/scenes/`, character posters to `assets/{cats,couple}/`.

> ### 🔀 DECISION — loop fidelity vs cost
> If a model gives a poor loop after 2 tries, don't burn budget on a 3rd. Switch the boomerang fallback on for that asset and move on. Perfection on one cat's tail is not worth $1.

---

## 7. Story illustrations — now via fal.ai (not Gemini)

The 5 missing love-story illustrations (`story-motor`, `story-jakarta`, `story-ldr`, `story-keio`, `story-married`) are generated by **`fal-ai/flux/dev` text-to-image** in Phase 6 (script §4). The narrative each must depict comes from `docs/03 §5` (the 6 chapters). Match the chapter copy:
- `story-motor` → "Antar Pulang, Hati Semakin Dekat" (motorbike rides home).
- `story-jakarta` → "Bersama di Jakarta" (working + studying together).
- `story-ldr` → "LDR, Sampai Tokyo" (Bashara at SIT Tokyo, long distance).
- `story-keio` → "Hanifah Diterima di Keio" (reunion near Hiyoshi/Yokohama, sakura).
- `story-married` → "Memutuskan Menikah, Studi Bersama" (the wedding + new beginning).

Keep all 5 in **one consistent character + palette style** so the chapters read as one book. If flux drifts between images, fix a seed or feed `story-meeting.png` (already in `assets/illustrations/`) as an img2img style anchor at low strength. **Review each output**; regenerate any that breaks the storybook look.

---

## 8. Gallery harmonization — handle real faces with care

Phase 4 runs `flux/dev/image-to-image` at **strength 0.30** over photos from `FOTO INVITATION/`. After each:
- **Open it and verify the faces still look like the real people.** If drift is too strong, drop strength to 0.20 and rerun that one.
- These are **never** turned into video, never composited with illustrations in the same frame (`DESIGN.md` Imagery rule).
- Pick a tasteful subset (5–9). `gallery-03` may be landscape — keep it; the gallery is a scatter scrapbook, not a uniform grid.

---

## 9. Run order, cost, and verification

```bash
cd nikah-web
npm install                       # @fal-ai/client already in package.json
npm run gen:dry                   # confirm manifest + key load, no spend
npm run gen:0                     # REGENERATE sprites+decorative (img2img) → then rmbg  (~$0.85)
npm run gen:0b                    # COMBINE refs into cohesive group assets (optional)   (~$0.20)
npm run gen:1                     # scene + floral video loops  (~$2.00)
npm run gen:2                     # character idle (Path A only) (~$1.00)
npm run gen:4                     # gallery harmonize           (~$0.40)
npm run gen:6                     # story illustrations         (~$0.30)
# manual: ffmpeg compress + poster export for every video (§6)
npm run copy-assets               # mirror assets/ → public/assets/
npm run dev                       # open localhost:3000 — verify zero 404s
```

**Total est. ~$4–5.** Hard cap $10 in the dashboard. The script skips any output that already exists (idempotent), so re-running is cheap and safe; pass `--force` to regenerate one.

**Verification gate before moving to GUIDE 02:**
- [ ] Every path in the manifest `out` field exists under `assets/**`.
- [ ] Every video has a matching WebP poster and is < 2 MB, ≤ 1080px.
- [ ] Cat/couple sprites have clean alpha edges (no flower halo from rmbg).
- [ ] Gallery faces are recognizably the real couple.
- [ ] Story illustrations share one consistent style.
- [ ] `docs/TODO_ASSETS.md` all `✅`.
- [ ] `npm run dev` loads with no 404 in the network panel.

Only when this gate passes do you start building the UI (GUIDE 02). **The build consumes these assets; it cannot run ahead of them.**

---

## 10. Guardrails (do not violate)

- **Never edit `public/assets/`** — edit `assets/` and run `copy-assets`.
- **Never bundle `@fal-ai/client` into the site** — it stays a script-only dependency (`AGENTS.md`). The runtime site only loads finished MP4/WebP/PNG/MP3.
- **Never turn `FOTO INVITATION/` photos into video.**
- **Never use `correct/` files directly in the UI** — every one passes through fal first.
- **Never just `rmbg` a `correct/` file** — background removal alone produces a broken, off-brand cutout. Always **regenerate** (img2img/compose) into a clean on-brand asset first; rmbg is only the finishing transparency pass on that regenerated output. Prefer combining several refs into one cohesive asset.
- Keep `FAL_KEY` out of git (it's in `.env`, which is gitignored) and out of any committed log.
- Update `docs/13-fal-generation-plan.md` with any model swap or path decision you make, so the next agent inherits your reasoning.

➡️ **Next:** [GUIDE 02 — Gate & Hero](GUIDE-02-GATE-AND-HERO.md) consumes these assets to build the opening ritual and the living world.
