# Nikah Web — Master README
## ⚠️ READ THIS FIRST BEFORE TOUCHING ANYTHING

This is the wedding invitation website for **Bashara & Hanifah**, 22 August 2026.
All planning docs are in `docs/`. All decisions are locked there. Do not invent new directions.

---

## 🗂️ Folder Map — What Each Folder Is

### 1. `FOTO INVITATION/` — REAL PHOTOS. SACRED. DO NOT ALTER IDENTITY.

> These are real photographs of Bashara, Hanifah, and their cats.
> **Never turn these into video. Never heavily edit. Faces and moments must be preserved.**

| File | What it is |
| :-- | :-- |
| `couple-standing-smiling.jpg` | Real photo — Bashara & Hanifah standing, smiling |
| `couple-standing-casual-pose.jpg` | Real photo — casual standing pose |
| `couple-standing-smiling-alt.jpg` | Real photo — alternate smiling |
| `couple-overhead-bride-bouquet.jpeg` | Real photo — overhead, bride with bouquet |
| `couple-overhead-bride-bouquet-alt.jpg` | Real photo — alternate overhead bouquet |
| `couple-overhead-groom-above.jpeg` | Real photo — overhead, groom perspective |
| `couple-overhead-lying-romantic.jpeg` | Real photo — overhead romantic lying pose |
| `couple-overhead-romantic-pose.jpeg` | Real photo — overhead romantic pose |
| `couple-overhead-side-by-side.jpeg` | Real photo — overhead side by side |
| `couple-overhead-spotlight-1.jpeg` | Real photo — spotlight composition 1 |
| `couple-overhead-spotlight-2.jpeg` | Real photo — spotlight composition 2 |
| `cat-black-white-pendant-name-jiro.jpg` | Real cat photo — Jiro (black & white, pendant) |
| `cat-black-white-lying-bw-name-meng.jpg` | Real cat photo — Meng (black & white, lying) |
| `cat-gray-tabby-in-blankets-name-hoshi.png` | Real cat photo — Hoshi (gray tabby, in blankets) |
| `cat-kimho-portrait.png` | Real cat photo — Kimho (portrait) |
| `cat-orange-white-on-couch-name-simba.png` | Real cat photo — Simba (orange & white, on couch) |
| `cat-ragdoll-portrait-name-moju.png` | Real cat photo — Moju (ragdoll, portrait) |
| `cat-white-closeup-pink-ears-name-shiro.png` | Real cat photo — Shiro (white, pink ears, closeup) |

**fal.ai treatment:** `flux/dev/image-to-image` ONLY, strength 0.25–0.35.
Harmonize palette to storybook (ivory/blush/cream). **Do not change faces, identity, or composition.**
Output goes to: `assets/gallery/gallery-0n.webp`

---

### 2. `correct/` (and `correct/most correct/`) — AI REFERENCE ONLY. MUST BE REGENERATED.

> These are AI-generated illustration references. They define the **visual style, character design, and world** we are building.
> **Do NOT use these files directly in the site.** fal.ai must process every single one before use.

**Why:** The AI reference images have flower backgrounds, wrong proportions, or inconsistent style. fal.ai cleans, strips, and animates them into final production assets.

**fal.ai pipeline per asset type:**

| Asset type | fal.ai steps |
| :-- | :-- |
| Cat characters | Step 1: `bria/rmbg` → transparent PNG. Step 2: `wan-2.6` → idle video loop |
| Couple illustration | Step 1: `bria/rmbg` → transparent PNG. Step 2: `wan-2.6` → idle video loop |
| Hero scene / meadow | `minimax/video-01-live` → living video loop (seamless 5–6s) |
| Floral garlands / swags | `minimax/video-01-live` → gentle sway video loop |
| Floral corners / dividers | `bria/rmbg` → transparent PNG only (CSS animates) |

All outputs go to: `assets/video/*.mp4` (videos) and `assets/{cats,couple,florals}/*.png` (posters/fallbacks).

**Full manifest with exact prompts → `docs/13-fal-generation-plan.md`**

---

### 3. `docs/` — SINGLE SOURCE OF TRUTH FOR CURSOR

> Every decision about design, motion, architecture, and content is in here.
> Cursor must read these docs before writing a single line of code.

| Doc | What it defines |
| :-- | :-- |
| `01-concept-brief.md` | Vision, mood, palette, tone, the 5 ideas |
| `02-site-structure.md` | Page sections and content order |
| `03-copywriting.md` | All text/copy (Bahasa Indonesia) |
| `04-asset-list.md` | Every asset, its source, its fal.ai treatment |
| `05-data-fields.md` | Google Sheets schema, config fields |
| `06-build-notes.md` | Build phases, stack, definition of done |
| `07-gemini-asset-prompts.md` | Story illustration prompts (Gemini) |
| `08-motion-principles.md` | Motion token system + fal.ai vs GSAP split |
| `09-hero-choreography.md` | Hero layer stack + assemble timeline |
| `10-section-choreography.md` | Every section's entrance + idle + exit |
| `11-build-architecture.md` | Next.js folder structure + all hooks |
| `12-asset-motion-map.md` | Per-asset: what fal.ai does vs what GSAP does |
| `13-fal-generation-plan.md` | Complete fal.ai script + prompts + cost |
| `TODO_ASSETS.md` | Generation checklist with status per asset |

---

### 4. `scenes/` — HERO REFERENCE. FIRST VISUAL ANCHOR.

> `scenes/hero-main.webp` is the **master composition reference** for the entire hero section.
> All layer positions, depth, and character placement must match this image.

| File | Role |
| :-- | :-- |
| `hero-main.webp` | **PRIMARY REFERENCE** — composition, world, mood, everything |
| `hero-bg.webp` | Sky/meadow background layer (poster fallback for video) |
| `hero-tall.webp` | 9:16 mobile portrait version (poster fallback LOW tier) |

**fal.ai:** `hero-main.webp` → `minimax/video-01-live` → `assets/video/hero-bg-loop.mp4`
**Cursor:** `heroLayout.ts` must position all video layers to match `hero-main.webp` composition.

---

## 🚦 Execution Order (Do Not Skip Steps)

```
STEP 1 — Run fal.ai pipeline FIRST
  node scripts/generate-assets.mjs --phase=0   # background removal
  node scripts/generate-assets.mjs --phase=1   # hero scene videos
  node scripts/generate-assets.mjs --phase=2   # cat + couple idle videos
  node scripts/generate-assets.mjs --phase=3   # floral videos
  Manual: gallery style-harmonize (FOTO INVITATION/ → assets/gallery/)
  Manual: story illustrations (Gemini, see docs/07)

STEP 2 — Verify all assets exist
  npm run copy-assets   # mirror assets/ → public/assets/
  npm run dev           # check nothing is 404

STEP 3 — Cursor builds the site
  Follow docs/11-build-architecture.md
  Start with VideoLayer primitive + useVideoLayer hook
  Then Hero (docs/09), then Gate, then sections (docs/10)
```

---

## 🧠 The 5 Ideas This Site Combines

1. **Storybook World** — opens like a book, every section is a chapter
2. **Living Characters via fal.ai** — cats and couple are real video loops, not fake CSS breathing
3. **GSAP Cinematic Orchestration** — assembles the scene layer by layer, drives parallax + all interactions
4. **Real Photos as Emotional Core** — `FOTO INVITATION/` photos are the soul; style-harmonized but faces preserved
5. **Smart Graceful Degradation** — HIGH/MID/LOW/REDUCED tiers; beautiful on every device

---

## 🚫 Hard Rules

- **Never use `correct/` files directly in the site** — fal.ai processes them first
- **Never turn `FOTO INVITATION/` photos into video** — style harmonize only, strength ≤ 0.35
- **Never add GSAP breathing on top of fal.ai video characters** — they already breathe
- **Always pause `<video>` elements off-screen** via `useVideoLayer` hook
- **REDUCED tier = zero video, zero loop, static PNG posters only**
- **All motion tokens must come from `lib/motionTokens.ts`** — never hardcode easing strings
