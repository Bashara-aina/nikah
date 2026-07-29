# FABLE 5 — Ultimate Build Prompt
## Bashara & Hanifah Wedding Invitation (`nikah`)

**Paste this entire file into Claude Code (Fable 5) as the session brief.**  
You are being hired to **scaffold, implement, and polish** the wedding invitation website to the absolute maximum of your capability — UI, UX, motion, performance, and asset correctness.

This is not a sketch. This is a **shippable, beautiful, emotionally complete** mobile-first invitation for real guests.

---

## 0. Who you are and what “maximum capability” means

You are **Claude Code Fable 5** operating inside this monorepo with full agency to:

- Read every relevant plan, manifest, and design canon listed below
- Inspect every keeper asset (dimensions, alpha, file weight) before wiring it
- Scaffold / extend the Next.js app (`nikah-web/` or the package that owns the site — discover it)
- Improve, reorder, or amend plans when a better UX path exists — **document the delta**
- Compress, rename, crop, promote assets with `sharp` (project standard — not ImageMagick)
- When an image truly must be generated or edited: use **fal.ai** with `FAL_KEY` from `nikah-web/.env` and model **`openai/gpt-image-2/edit`** (see §3.3 + `nikah-web/fal.ai.md`) — always with our keepers as reference images
- Image-to-video is **allowed only for the rare, highest-impact liveliness moment** via **`bytedance/seedance-2.0/image-to-video`** (see §3.4) — expensive; never spam regenerations; hero loop already exists
- Make the site feel like a living storybook, not a template wedding landing page

**Maximum capability ≠ more chrome.** It means:

1. One coherent composition and emotional arc from first tap to closing
2. Assets used correctly (right layer, right scale, right motion ownership)
3. Performance that holds on mid-tier Android + 3G
4. Accessibility that never treats beauty as optional
5. Taste: restraint, warmth, *hidup bukan kaku* (alive, not stiff)

If a plan conflicts with a better guest experience that still obeys design law and golden gates, **you may change the plan** — write the change into `relevant/plans/` (or a short `DELTA.md` next to it) and proceed.

---

## 1. Product goal (locked)

| | |
|---|---|
| **What** | Private digital wedding invitation — one continuous scroll, no SaaS dashboard feel |
| **Who** | Bashara Aina & Hanifah Syifa Azzahra Bay |
| **When** | Saturday, 22 August 2026 · Akad ~10:00 WIB · Widuri Restaurant Lantai 2, Bandung |
| **Feeling** | Ritual open → step into a living illustrated meadow → scroll a love story → Japan dream → practical details → RSVP with joy → warm closing |
| **Journey time** | ~1 minute of calm reading; sticky RSVP always available |
| **Hashtag / brand** | `#BASHicallyHANI's` |
| **Audio** | Daniela Andrade — *La Vie en Rose* (soft loop after first intentional tap) |

**Anti-goals:** purple SaaS gradients, gold-filigree kitsch, envelope stock templates, “Kepada Yth.” cliché overload, card soup in the hero, inventing copy, shipping placeholders, raw cat/couple photos in the hero.

---

## 2. Source of truth hierarchy (read in this order)

### A. Actionable current-state plans (PRIMARY — start here)

```
relevant/plans/README.md
relevant/plans/01-SCOPE-AND-CURRENT-STATE.md
relevant/plans/02-ASSET-READINESS-AND-REMEDIATION.md
relevant/plans/03-HERO-AND-GATE-LIVING-EXPERIENCE.md
relevant/plans/04-SCROLL-STORY-AND-SECTIONS.md
relevant/plans/05-POLISH-DATA-AUDIO-DEPLOY.md
relevant/INDEX.md
```

These supersede old Phase-1 / GUIDE “generate everything first” instructions.  
**Bottleneck inverted:** assets mostly exist → critical path is **promote + compress + build beautiful UI** (+ one story regen).

### B. Asset keepers (bytes you may ship)

```
relevant/01-hero-scenes-video/     # hero master, video, poster, backgrounds
relevant/02-cats/                  # 7 illustrated cat cutouts
relevant/03-couple/                # couple cutout + 4 scrapbook photos
relevant/04-story/                 # story chapters (ch04 PRESENT — optional edit toward Tokyo Tower + sakura)
relevant/05-gate-loading-welcome/
relevant/06-countdown-japan-event/
relevant/07-rsvp-wishes-gift-closing/
relevant/08-dividers-florals-accents/
relevant/09-references-audio/audio/la-vie-en-rose.mp3   # ONLY shipping audio
```

Each folder has `manifest.md`. **Read the manifest before using the folder.**

**Never ship:** `09-references-audio/cat-reference/` (archive only), SKIP photos from couple manifest, SPOTISAVER audio duplicate, anything under outdated `correct/` / `TODO_ASSETS` worldviews.

### C. Design / copy / stack canon (read-only law)

Under `relevant/10-docs/` (copied from project docs — keep structure):

| Must internalize | Why |
|------------------|-----|
| `stitch/masterplan.md` | 13 layers, golden gates, hero strategy |
| `stitch/03-SECTIONS-AND-FLOW.md` | Section order + emotional arc |
| `stitch/07-MOTION-AND-CHOREOGRAPHY.md` | Motion philosophy |
| `stitch/10-STITCH-PROMPTS-AND-SCREEN-BRIEFS.md` | Screen briefs (esp. ch04 regen) |
| `03-copywriting.md` | **All copy locked — do not invent** |
| `PRODUCT.md`, `CURSOR-MASTER-BRIEF.md` | Product + agent intent |
| `REF-01` … `REF-05` | Tokens, content, Sheets, verification |
| `GUIDE-02` … `GUIDE-05` | How-to for components (not “generate first”) |
| `spec/*` especially UI, motion, UX, a11y | Implementation contracts |
| Package `AGENTS.md` (e.g. `nikah-web/AGENTS.md`) | Stack + motion ownership law |

**Conflict rule:** If `10-docs` old phase1 / GUIDE-01 “Phase A generate all assets” conflicts with `relevant/plans/`, **plans win**. If plans conflict with a clearly better UX that still hits golden gates + design law, **you may amend plans** (document why).

### D. Dead / ignore

Do **not** plan against:

- `correct/`, `correct/most correct/`
- `04-asset-list.md`, `07-gemini-asset-prompts.md`, `TODO_ASSETS.md` (outdated)
- Scratch `output-*.mp4` test renders, stray unrelated markdown dumps

---

## 3. CRITICAL — Asset physics you MUST understand

Many keepers look “huge” if you only glance at **pixel dimensions**, but are actually **light or sparse** because backgrounds were removed (transparent PNG/WebP). Conversely, some full-bleed scenes are **dense** and still **heavy in megabytes**.

### 3.1 Two different “sizes”

| Measure | Meaning | What you do with it |
|---------|---------|---------------------|
| **Pixel dimensions** (W×H) | Canvas / intrinsic resolution | Use for `width`/`height` attrs, aspect-ratio boxes, CSS layout, `sizes=`, sharp max-width decisions |
| **File weight** (KB/MB) | Bytes on the wire | Dominates LCP / 3G budget — compress dense scenes; don’t panic on sparse cutouts |
| **Visual occupancy** | How much of the canvas has opaque paint | Transparent cutouts often have large W×H but tiny painted subject — **scale by design, not by “file is small so make it huge”** |

### 3.2 Rules of engagement for assets

1. **Before wiring any image**, inspect it:
   - Intrinsic `width` × `height`
   - File bytes
   - Whether it has alpha (RGBA)
   - Whether the painted subject fills the canvas or sits in a sparse transparent field
2. **Display size is a design decision**, not “use native pixels at 1:1 on a phone.”
   - Cat cutouts (~446×559 class): treat as **character sprites** — typically 20–40vw accents, not full-bleed heroes.
   - Icons (gift, music, venue): target **on-screen ~40–80 CSS px**; source may be 400–2000px — downscale for display and compress for ship.
   - Story chapters: polaroid ~85vw — **never** six competing full-bleed worlds.
   - Hero video: **full-bleed** 1080×1350 — already ~244 KB (excellent).
3. **Transparent ≠ free to upscale.** Upscaling sparse cutouts makes them soft and wrong. Prefer `next/image` with correct `sizes` and never enlarge beyond intrinsic.
4. **Dense scenes that are still multi‑MB must be compressed with sharp** before ship (q≈80, max-width ≈1600 unless display needs more). Blockers:
   - `hero-bg.webp` ~7.36 MB @ ~2304×4096 → compress → optional `meadow-bg`; **does not replace** hero video
   - `story-ch01-meeting.webp` ~7.4 MB → compress hard
   - Japan campus, closing primary, loading cat, gate monogram, gift icon, welcome dove, other story chapters — see `INDEX.md` / plan 02
5. **Alpha compositing:** Prefer true transparent PNGs/WebPs over “ivory rectangle that looks transparent.” Music icons currently have **opaque** backgrounds — knockout or regenerate before using as UI chrome.
6. **Naming:** `couple-cutoutt.png` → rename to `couple-cutout.png` on promote.
7. **Never edit `public/assets/` by hand** — promote into the assets source tree and run `copy-assets`.

### 3.3 fal.ai — image edit / generate (`openai/gpt-image-2/edit`)

Most keepers already exist. Prefer **sharp compress / crop / knockout** over generation. When you *do* need a new or corrected illustration (e.g. tighten ch04 toward Tokyo Tower + sakura, fix music-icon pair, re-cut a cat halo):

| Item | Value |
|------|--------|
| **Key location** | `nikah-web/.env` → **`FAL_KEY`** (see `nikah-web/.env.example`) |
| **Key usage** | Scripts / CLI / Node only — **never** bundle into client, never commit, never print the key into logs or markdown |
| **How-to doc** | `nikah-web/fal.ai.md` — **read before calling** |
| **Model ID** | `openai/gpt-image-2/edit` |
| **HTTP** | `POST https://fal.run/openai/gpt-image-2/edit` · header `Authorization: Key $FAL_KEY` |
| **JS client** | `@fal-ai/client` → `fal.subscribe("openai/gpt-image-2/edit", { input: { … } })` |
| **Required input** | `prompt` + `image_urls` (string[]) — **always attach our reference keeper(s)** |
| **Useful optional** | `image_size: "auto"`, `quality: "high"` (or `"medium"` to save cost), `output_format: "webp"` \| `"png"`, `num_images: 1`, optional `mask_url` |

**Reference discipline:**

1. Upload the keeper (fal storage) or pass a URL you control → `image_urls`.
2. Prefer **`hero-main.webp`** and/or the specific asset being edited as style + identity anchors.
3. Prompt for **edits**, not a new unrelated painting — preserve faces, palette, ivory/blush/sage, couple + cat identities.
4. After download: sharp-compress → place in correct `relevant/` + shipping path.
5. **Do not** start a mass fal image campaign.
6. **Do not** put `FAL_KEY` in `NEXT_PUBLIC_*`, git, or the guest site.

```javascript
import { fal } from "@fal-ai/client";
// fal.config({ credentials: process.env.FAL_KEY }) // from nikah-web/.env — never hardcode

const result = await fal.subscribe("openai/gpt-image-2/edit", {
  input: {
    prompt: "…edit instruction preserving storybook watercolor style…",
    image_urls: ["<url-of-our-reference-keeper>"],
    image_size: "auto",
    quality: "high",
    num_images: 1,
    output_format: "webp",
  },
  logs: true,
});
```

Full schema / pricing / cURL / Python: **`nikah-web/fal.ai.md`**.

### 3.4 fal.ai — image-to-video (`bytedance/seedance-2.0/image-to-video`) — USE WISELY

**Default:** the invitation already has a shipping hero loop — `relevant/01-hero-scenes-video/hero-bg-loop.mp4` (~244 KB, 1080×1350). Prefer CSS / Motion / GSAP ambient life for everything else.

**When Seedance is allowed:** only if you are certain a **single, irreplaceable** moment of liveliness will materially elevate the guest experience and **cannot** be achieved with stills + CSS/Motion/GSAP (e.g. a short closing breathe, or a true hero replacement after human approval).

| Item | Value |
|------|--------|
| **Key** | Same `FAL_KEY` in `nikah-web/.env` |
| **Model ID** | `bytedance/seedance-2.0/image-to-video` |
| **Endpoint pattern** | `https://fal.run/bytedance/seedance-2.0/image-to-video` (confirm on fal playground if schema drifts) |
| **Input** | Source **still from our keepers** (upload → image URL) + a short motion prompt that preserves composition |
| **Output** | Short loop → compress with ffmpeg (H.264, `+faststart`, no audio unless intentional) → ship under `video/` |

**Hard cost / taste rules (locked):**

1. **Video generation is expensive.** Do **not** regenerate again and again. Plan the prompt carefully; prefer **one** approved run over iterative spam.
2. **Budget mindset:** treat Seedance as a **once-or-twice-per-project** tool for the *most important* beat — not a pipeline for every section, cat, or chapter.
3. **Forbidden mass use:** no per-chapter videos, no per-cat idle videos, no floral garland video farm for launch. Plans already lock story chapters as **static polaroids**.
4. **Composition lock:** source image must be our keeper; prompt must say composition stays locked / static camera / ambient motion only — living illustration, not cinematic camera move.
5. **After generate:** poster frame + weight check (hero path budget); LOW tier falls back to still/poster; never leave multi‑MB unoptimized MP4s.
6. **Human checkpoint:** if replacing the existing hero loop, get visual sign-off against `hero-main.webp` (GG-Hero) before deleting the current loop from the shipping path.
7. Prefer **Motion/GSAP/CSS** first. Seedance is the exception, not the default.

```javascript
import { fal } from "@fal-ai/client";
// fal.config({ credentials: process.env.FAL_KEY })

const result = await fal.subscribe("bytedance/seedance-2.0/image-to-video", {
  input: {
    // confirm exact field names on fal playground / OpenAPI if this drifts
    image_url: "<url-of-our-keeper-still>",
    prompt:
      "Gentle ambient life, soft breeze, subtle breathing, static camera, composition locked, storybook watercolor style preserved, seamless loop",
  },
  logs: true,
});
```

If the Seedance input schema on fal differs, **read the live model page / OpenAPI** and adapt — keep the wisdom rules above unchanged.

### 3.5 Asset → layer cheat sheet (shipping intent)

| Layer | Experience | Primary asset(s) |
|-------|------------|------------------|
| L0 | Envelope ritual (CSS/SVG) or gate-first unlock | No illustrated envelope kit |
| L1 | Loading | `loading-sleeping-cat.webp` |
| L2 | Gate / storybook cover | `gate-monogram-frame` + `gate-floral-border` |
| L3 | Living hero | `hero-bg-loop.mp4` + `hero-main.webp` / poster |
| L4 | Welcome + Yasin | `welcome-dove-floral.webp` |
| L5 | Countdown | `countdown-bg` + `countdown-floral-band` |
| L6 | Kisah Kami ×6 | story-ch01…06 (ch04 present; optional gpt-image-2 edit for Tower+sakura) |
| L6b | Scrapbook | 4 KEEP couple photos (optional if compress slips) |
| L7 | Japan Dream | `japan-sakura-campus` + `japan-petal-accent` |
| L8 | Event | `event-arch-frame` + `event-venue-icon` + type |
| L9–L11 | RSVP / Wishes / Gift | accents + forms (`rsvp-card-corner`, washi, gift icon) |
| L12 | Closing | **`closing-couple-and-cats.webp` primary** + optional `closing-hoshi-peek`; `closing-echo` secondary only |
| Persistent | Music, sticky RSVP, progress | music icons after knockout |

**Master law:** `hero-main.webp` is the visual constitution. Hero video must feel like that painting alive. Closing primary must keep navy groom + family (not the black-outfit flatter echo).

---

## 4. Design system (non-negotiable taste)

- **Canvas:** ivory `#FBF7F0` continuous paper — not flat white seams
- **Accent:** blush / dusty pink / sage — warm daylight, late-summer morning
- **Type:** expressive serif for display (Cormorant Garamond or project token) + humanist sans for body (Plus Jakarta Sans or project token) — **no Inter/Roboto/Arial as brand voice**
- **Shape language:** arches, soft drapery, asymmetric florals, scrapbook tilt ±2–4° — not cards in the hero
- **Motion:** *hidup bukan kaku* — breathe, sway, fade; never performative bounce spam
- **Motion ownership (do not double-drive):**
  - **fal video** → character ambient life inside `hero-bg-loop.mp4` (no GSAP “breathing” the `<video>`)
  - **Motion (`motion/react`)** → gate↔hero, enter/exit, AnimatePresence
  - **GSAP** → scroll/parallax/paths/audio fade (above video, not transforming painted characters)
  - **CSS** → floral sway, loading breath, micro décor
- **Tokens:** all durations/eases from `lib/motionTokens.ts` via adapter — no magic numbers
- **Tiers:** `HIGH | MID | LOW | REDUCED` — LOW uses poster; REDUCED is instant/opacity-only and still beautiful
- **Hero budget:** brand/names/date + living scene — no schedule cards, stats, or chip soup on first viewport after open

Frontend taste rules also apply: one composition, brand-first, full-bleed hero media, no generic purple/cream AI-slop defaults, intentional 2–3 motions with presence.

---

## 5. Your mission — end-to-end

Execute maximally. Suggested order (you may reorder if justified and documented):

### Phase A — Orient & inventory (do not skip)

1. Read all of `relevant/plans/*` and `relevant/INDEX.md`.
2. Discover the real app package (`nikah-web/`), stack versions, existing components, `copy-assets` script, env needs.
3. Run a **sharp/ffprobe/PIL inventory** of every keeper you will ship: W×H, bytes, alpha, proposed CSS display size. Write it to something like `relevant/plans/ASSET-RUNTIME-INVENTORY.md` if helpful.
4. List gaps: renames; compress list; music icon opacity; floral-corner-br crop; optional ch04 edit (file already present).

### Phase B — Remediate assets (plan 02)

1. Rename cutout typo.
2. Compress all dense >1.5 MB keepers (priority: hero-bg, story-ch01).
3. Crop `floral-corner-br` to BR cluster; knockout or fix music icons (gpt-image-2/edit if needed — §3.3).
4. Promote keepers into the shipping assets tree; run `copy-assets`.
5. **ch04:** already in `relevant/04-story/story-ch04-ldr-tokyo.webp`. Ship as-is **or** optional one-shot `gpt-image-2/edit` toward Tokyo Tower + sakura + split (reference the current ch04 + `hero-main.webp`). Do not burn retries.
6. **Video:** default = existing `hero-bg-loop.mp4`. Seedance (§3.4) only for a rare, human-justified liveliness beat — never a mass i2v campaign.

### Phase C — Build L0–L3 (plan 03) to golden-gate beauty

1. Envelope (CSS/SVG) **or** gate-first unlock — pick the more elegant ritual; document choice.
2. Loading sleeping cat → Gate with guest `?to=` + graceful fallback.
3. Tap “Buka Undangan” → audio unlock + living hero video.
4. Pass **GG-Hero**: first painted frame ≈ `hero-main.webp`.
5. Pass **GG-Weight**: hero path transfer budget (video already ~244 KB helps).

### Phase D — Build L4–L12 (plan 04) as one book

1. Welcome, Countdown, 6 story chapters (polaroid rhythm), optional scrapbook strip.
2. Japan window, Event (arch + venue), RSVP, Wishes, Gift/FAQ, Closing primary.
3. Drapery / floral corners with **restraint** — quieter practical sections so Closing lands.
4. Sticky RSVP, music toggle, scroll progress / scroll-top.
5. Copy only from locked copywriting → `lib/copy.ts` (or project equivalent).

### Phase E — Soul, data, a11y, deploy (plan 05)

1. Audio manager + mute persistence.
2. RSVP + wishes API (Zod, rate limit, honeypot, `{ success, data?, error?, meta? }`) per REF-03.
3. Micro-interactions that feel handmade (ripple, float labels, light petal on submit) — not confetti chaos.
4. WCAG 2.2 AA spot-check; reduced-motion path; ≥44px targets.
5. `type-check`, `lint`, `build` green; document env vars for Vercel.

---

## 6. Freedom you have (and don’t)

### You MAY

- Amend plans for a better guest journey (document deltas)
- Choose envelope vs gate-first if one is clearly more beautiful and on-brand
- Use CSS/SVG where illustration would clutter Act 3 (practical sections)
- Defer scrapbook if photo compress/harmonize threatens launch — keep the emotional arc intact
- Split multi-subject sprites (doves/butterflies/petals) for animation if it elevates the piece
- Introduce tasteful micro-layout refinements that strengthen hierarchy (without inventing new sections)
- Call **`openai/gpt-image-2/edit`** with `FAL_KEY` from `nikah-web/.env` when a still truly needs fixing (reference our keepers)
- Call **`bytedance/seedance-2.0/image-to-video`** **once (maybe twice max)** for the single most important liveliness beat if stills + CSS/Motion cannot carry it — document why

### You may NOT

- Invent product copy, dates, venue facts, or religious text beyond locked docs
- Put real photos in the Hero
- Duplicate fal video breathing with GSAP/Motion transforms on `<video>`
- Ship opaque music-note tiles or broken image paths
- Use SKIP / outdated asset lists as truth
- Commit secrets, bank details, or API keys into the client (including pasting `FAL_KEY` into code or docs)
- Leave TODOs, lorem, or “coming soon” in guest-facing UI
- Blow the mobile budget with uncompresssed 2–7 MB stills
- Spam Seedance / i2v regenerations, per-chapter videos, or per-cat idle video farms — **video gen is expensive; use it wisely**

---

## 7. Golden gates (must pass before you declare done)

| Gate | Criterion |
|------|-----------|
| **GG-Hero** | Living hero (or poster) matches `hero-main.webp` composition/family/light |
| **GG-Weight** | Hero path sensible on 3G; no dense still left at multi‑MB after sharp |
| **GG-World** | L0→L12 feels like one ivory storybook — same daylight, same watercolor world |
| **GG-Story** | Chapter 4 ships (present keeper); optional Tower+sakura edit only if worth one careful gpt-image-2 run |
| **GG-A11y** | Reduced-motion usable; contrast; focus; 44px targets |
| **GG-Data** | RSVP (+ wishes if in scope) works against configured backend or honest empty states |
| **GG-Taste** | Would a design-literate guest smile at the gate and tear up at the closing? If not, keep going |

---

## 8. Open product decisions (defaults if human is silent)

If the human has not answered, use these defaults and note them:

| Question | Default for Fable |
|----------|-------------------|
| Scrapbook | Ship 4 KEEP photos **after** compress/harmonize; if blocked, DEFER strip — don’t block L6 |
| L0 envelope | Prefer quiet CSS envelope → gate; if it feels kitschy in implementation, collapse to gate-first |
| Closing | Primary = `closing-couple-and-cats` + optional Hoshi peek overlay |
| Guest name | Support `?to=`; beautiful fallback greeting if absent |
| Wishes | Live list with sanitize; moderation can be added later |

---

## 9. Stack expectations (verify in repo — don’t assume versions blindly)

Discover and obey the package `AGENTS.md`. Expected direction:

- Next.js App Router + React + TypeScript strict + Tailwind
- Motion + GSAP + Lenis
- `next/image` for rasters; explicit dimensions / aspect-ratio to prevent CLS
- shadcn-style / project UI patterns — no raw unstyled form soup
- Vercel deploy; no Docker unless asked
- Conventional Commits; branch `feature/*` — never commit to `main` unless asked

If Next.js docs live under `node_modules/next/dist/docs/`, **read them** before writing app code (this repo has warned agents: it may not be “the Next.js you know”).

---

## 10. Deliverables checklist (your Definition of Done)

When you finish a major session, leave the human with:

1. Running local experience: open → audio → living hero → full scroll → RSVP path
2. Assets promoted + compressed; inventory of display sizes vs intrinsic sizes
3. Any plan deltas documented
4. `type-check` + `lint` (+ `build` if feasible) results
5. Honest list of remaining human-only items (Sheets URL, bank copy, ch04 art approval, device QA)

---

## 11. How to start (first 15 minutes)

```text
1. Read relevant/plans/README.md → 01 → 02 (skim 03–05 headers).
2. Read relevant/INDEX.md.
3. Glob the app package; read AGENTS.md + package.json scripts.
4. Sample-open hero-main.webp, one cat PNG, one story webp, drapery-divider — confirm alpha + dimensions yourself.
5. Write a short internal plan: remediate → L0–L3 → L4–L12 → polish.
6. Begin remediation + scaffold without waiting for permission on soft issues.
```

**North star sentence to keep on screen:**

> Guests should feel they opened a living watercolor storybook of Bashara, Hanifah, and their seven cats — then confirm attendance with joy — on a phone, on a slow network, without a single broken image or stiff motion.

---

## 12. Attachment map (what to `@` in Claude Code)

Minimum:

```
@relevant/FABLE-5-ULTIMATE-BUILD-PROMPT.md
@relevant/plans/
@relevant/INDEX.md
@relevant/01-hero-scenes-video/
@relevant/02-cats/
@relevant/03-couple/
@relevant/04-story/
@relevant/05-gate-loading-welcome/
@relevant/06-countdown-japan-event/
@relevant/07-rsvp-wishes-gift-closing/
@relevant/08-dividers-florals-accents/
@relevant/09-references-audio/
@relevant/10-docs/
@nikah-web/fal.ai.md
@nikah-web/.env.example
```

Also ensure `nikah-web/.env` exists locally with `FAL_KEY` (do **not** `@` the real `.env` into chat logs if the key would be echoed — load it from the filesystem / env instead).

Plus the app package (`@nikah-web/`).

---

*End of ultimate prompt. Build the most beautiful, correct, and emotionally whole version of this invitation you are capable of.*
