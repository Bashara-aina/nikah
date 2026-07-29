# 02 — Asset Readiness & Remediation Backlog

**Role:** Ordered, honest backlog from `relevant/` → shipping tree  
**Date:** 2026-07-18  
**Supersedes:** `10-docs/stitch/phase1/02-GENERATED-ASSET-TRIAGE.md` (verdicts); `GUIDE-01-FAL-ASSET-ENGINE.md` Phase A as *mandatory gate*; `TODO_ASSETS.md` (SKIP); dead `04-asset-list.md` paths  
**Prerequisite:** [01 Scope](./01-SCOPE-AND-CURRENT-STATE.md)  
**Feeds:** [03 Hero/Gate](./03-HERO-AND-GATE-LIVING-EXPERIENCE.md) · [04 Sections](./04-SCROLL-STORY-AND-SECTIONS.md)

---

## 1. Law of this backlog

1. **Source of truth for bytes:** `relevant/01`–`09` keepers (+ manifests). Originals remain in `nikah-web/`; do not move — copy/promote.
2. **Destination of truth:** monorepo shipping tree (create if missing):

```
nikah-web/assets/          # or monorepo-root assets/ mirrored by copy-assets
  scenes/
  cats/
  couple/
  illustrations/           # + illustrations/story/
  florals/
  video/
  audio/
  gallery/
```

Then `npm run copy-assets` → `nikah-web/public/assets/` (never edit public by hand).

3. **Tooling:** `sharp` (project standard) for resize/re-encode/crop/knockout. Prefer nikah-sharp MCP / scripts inside `nikah-web`. No ImageMagick.
4. **Do not** reopen Phase 0 rmbg from `correct/most correct/`.
5. **Generation** is only for gaps listed in §3 — not a second full fal campaign.

---

## 2. Promote map — `relevant/` → final paths

### 01 — Hero / scenes / video

| Source | Destination | Action before ship |
|--------|-------------|-------------------|
| `01-hero-scenes-video/hero-main.webp` | `scenes/hero-main.webp` | Copy as-is (272 KB) — **master** |
| `01-…/hero-bg-loop.mp4` | `video/hero-bg-loop.mp4` | Copy as-is (~244 KB) |
| `01-…/hero-bg-loop-poster.jpg` | `video/hero-bg-loop-poster.jpg` | Copy as-is (or regenerate WebP poster from master if preferred) |
| `01-…/hero-bg.webp` | `scenes/meadow-bg.webp` | **Compress** 7.36 MB → ≤300–400 KB, max-w 1600; **not** L3 hero (video owns L3) |
| `01-…/countdown-bg.webp` | `scenes/countdown-bg.webp` | Copy (248 KB OK) |
| `01-…/hero-tall-portrait.webp` | optional `scenes/hero-tall-portrait.webp` | Soft: crop ivory border if full-bleed needed; else hold. Do **not** replace master |

### 02 — Cats

| Source | Destination | Action |
|--------|-------------|--------|
| `02-cats/cat-{shiro,moju,simba,meng,jiro,kimho,hoshi}.png` | `cats/cat-*.png` | Copy; optional re-cut shiro/hoshi later |

### 03 — Couple

| Source | Destination | Action |
|--------|-------------|--------|
| `03-couple/couple-cutoutt.png` | `couple/couple-cutout.png` | **Rename** (drop double-t) |
| `03-couple/couple-standing-smiling.jpg` | `gallery/couple-standing-smiling.webp` | Compress + palette harmonize |
| `03-couple/couple-overhead-romantic-pose.jpeg` | `gallery/couple-overhead-romantic.webp` | Same |
| `03-couple/couple-overhead-bride-bouquet.jpeg` | `gallery/couple-overhead-bouquet.webp` | Same |
| `03-couple/couple-overhead-groom-above.jpeg` | `gallery/couple-overhead-playful.webp` | Same |

**Do not promote** SKIP photos (dupes / lower quality) — listed in `03-couple/manifest.md`.

### 04 — Story

| Source | Destination | Action |
|--------|-------------|--------|
| `story-ch01-meeting.webp` | `illustrations/story/story-ch01-meeting.webp` | **Compress** ~7.4 MB → ≤350 KB @ ≤1600w |
| `story-ch02-rides.webp` | `…/story-ch02-rides.webp` | Compress ~3.1 MB |
| `story-ch03-jakarta.webp` | `…/story-ch03-jakarta.webp` | Compress ~2.8 MB |
| *(missing)* ch04 | `…/story-ch04-ldr-tokyo.webp` | **Regenerate** (§3) |
| `story-ch05-keio.webp` | `…/story-ch05-keio.webp` | Compress ~2.9 MB |
| `story-ch06-married.webp` | `…/story-ch06-married.webp` | Compress ~2.6 MB |

### 05 — Gate / loading / welcome

| Source | Destination | Action |
|--------|-------------|--------|
| `loading-sleeping-cat.webp` | `illustrations/loading-sleeping-cat.webp` | Compress 2.23 MB |
| `gate-floral-border.webp` | `illustrations/gate-floral-border.webp` | Copy (~365 KB — **no regen required** unlike Jul 5 plan) |
| `gate-monogram-frame.webp` | `illustrations/gate-monogram-frame.webp` | Compress 2.02 MB |
| `welcome-dove-floral.webp` | `illustrations/welcome-dove-floral.webp` | Compress 1.81 MB |

### 06 — Countdown / Japan / event

| Source | Destination | Action |
|--------|-------------|--------|
| `countdown-floral-band.webp` | `illustrations/countdown-floral-band.webp` | Copy (~330 KB) |
| `japan-sakura-campus.webp` | `illustrations/japan-sakura-campus.webp` | Compress 2.44 MB |
| `japan-petal-accent.webp` | `florals/japan-petal-accent.webp` | Copy (~198 KB) |
| `event-arch-frame.webp` | `illustrations/event-arch-frame.webp` | Copy (~353 KB) |
| `event-venue-icon.webp` | `illustrations/event-venue-icon.webp` | Copy (~307 KB); optional downscale for icon slot |

### 07 — RSVP / wishes / gift / closing

| Source | Destination | Action |
|--------|-------------|--------|
| `rsvp-card-corner.webp` | `florals/rsvp-card-corner.webp` | Copy |
| `wishes-washi-tape.webp` | `florals/wishes-washi-tape.webp` | Copy |
| `gift-envelope-icon.webp` | `illustrations/gift-envelope-icon.webp` | **Aggressive compress** 1.9 MB → ~40–80 KB icon |
| `closing-couple-and-cats.webp` | `scenes/closing-couple-and-cats.webp` | Compress 2.7 MB — **PRIMARY closing** |
| `closing-echo.webp` | `scenes/closing-echo.webp` | Copy as secondary (~390 KB) |
| `closing-hoshi-peek.webp` | `illustrations/closing-hoshi-peek.webp` | Copy |

### 08 — Dividers / florals / accents

| Source | Destination | Action |
|--------|-------------|--------|
| `drapery-divider.webp` | `florals/drapery-divider.webp` | Copy |
| `floral-corner-tl.webp` | `florals/floral-corner-tl.webp` | Copy |
| `floral-corner-br.webp` | `florals/floral-corner-br.webp` | **Crop** to BR cluster only |
| `floral-sprig.webp` | `florals/floral-sprig.webp` | Optional trim whitespace |
| `accent-doves.webp` | `florals/accent-doves.webp` | Copy; split sprites later if needed |
| `accent-butterflies.webp` | `florals/accent-butterflies.webp` | Same |
| `accent-petals-scatter.webp` | `florals/accent-petals-scatter.webp` | Same |
| `music-note-icon.webp` | `illustrations/music-note-icon.webp` | Knockout opaque bg **or** regen matched pair |
| `music-note-icon-muted.webp` | `illustrations/music-note-icon-muted.webp` | Same |

### 09 — Audio / refs

| Source | Destination | Action |
|--------|-------------|--------|
| `09-…/audio/la-vie-en-rose.mp3` | `audio/la-vie-en-rose.mp3` | **Ship this copy only** |
| `cat-reference/*` | *(do not ship)* | Keep under `relevant/` or `assets/_source/` archive |

---

## 3. Ordered remediation backlog

Execute top → bottom. Checkboxes for Cursor agent unless noted.

### P0 — Launch blockers

| # | Task | Owner | Done when |
|---|------|-------|-----------|
| 1 | **Regenerate `story-ch04-ldr-tokyo.webp`** | Cursor + human approve | Matches Screen 5 brief: *split scene* — one figure near **Tokyo Tower**, phone-call heart connection, **cherry-blossom branch**; watercolor storybook; ivory/blush/sage; navy groom / ivory-hijab bride consistent with hero | File lands in `relevant/04-story/` then promotes |
| 2 | **Rename** cutout → `couple-cutout.png` on promote | Cursor | No `cutoutt` string in shipping tree |
| 3 | **sharp compress blockers** | Cursor | `hero-bg` → `meadow-bg` ≤400 KB; `story-ch01` ≤350 KB |
| 4 | **Batch compress** all KEEP stills >1.5 MB (list §4) | Cursor | Every promoted still ≤~350–400 KB display weight (icons ≤80 KB) |
| 5 | **Promote** keepers per §2 + `npm run copy-assets` | Cursor | Zero 404s on `/assets/...` in dev |

### P1 — Fixable before guest send

| # | Task | Owner | Done when |
|---|------|-------|-----------|
| 6 | Knockout **or** regenerate matched **music icons** | Cursor | Transparent alpha; same floral weight/style |
| 7 | Crop **`floral-corner-br`** to BR-only | Cursor | Mirrors TL without double TL florals |
| 8 | Gallery photo WebP + soft harmonize (≤0.35 sepia/warm) | Cursor | 4 photos each <300 KB @ ~1080w |
| 9 | Decide **shiro/hoshi re-cut** | Human | If Closing/Hero need free compositing → re-cut; else ship vignette forms |

### P2 — Nice / Phase 2

| # | Task | Notes |
|---|------|-------|
| 10 | Split dove/butterfly/petal sprite sheets | Only if GSAP per-particle |
| 11 | Optional closing loop from primary still | Stretch only — see plan 03 |
| 12 | `hero-tall-portrait` border crop | Only if framed look rejected |

---

## 4. Compression priority list (sharp defaults)

**Defaults:** WebP q≈80 · max width 1600 (scenes/story) · max width 800–1080 (section illustrations) · icons max 256–512 · strip EXIF · auto-orient · **never upscale**.

| Priority | File (under `relevant/`) | ~Size now | Target |
|----------|--------------------------|-----------|--------|
| 1 | `01/…/hero-bg.webp` | 7.36 MB | ≤400 KB as `meadow-bg` |
| 2 | `04/…/story-ch01-meeting.webp` | ~7.4 MB | ≤350 KB |
| 3 | `03/…` scrapbook JPEGs | 3.6–15 MB | ≤300 KB WebP each |
| 4 | `07/…/gift-envelope-icon.webp` | ~1.9 MB | ≤80 KB |
| 5 | `07/…/closing-couple-and-cats.webp` | 2.7 MB | ≤400 KB |
| 6 | `06/…/japan-sakura-campus.webp` | 2.44 MB | ≤350 KB |
| 7 | `05/…/loading-sleeping-cat.webp` | 2.23 MB | ≤250 KB |
| 8 | `05/…/gate-monogram-frame.webp` | 2.02 MB | ≤250 KB |
| 9 | `05/…/welcome-dove-floral.webp` | 1.81 MB | ≤250 KB |
| 10 | Story ch02, ch03, ch05, ch06 | 2.6–3.1 MB | ≤350 KB each |

Cats PNGs (~330–440 KB) — leave unless LCP pressure; preserve alpha.

---

## 5. ch04 regeneration brief (copy into fal / GPT Image prompt)

**Must include (Screen 5 / stitch/10):**

- Split composition (two spaces connected visually)
- Tokyo Tower landmark readable at mobile size
- Cherry-blossom / sakura branch
- LDR emotional beat (phone / heart connection allowed *as connector*, not the whole scene)
- Watercolor storybook matching `hero-main.webp`
- Palette: ivory ground, dusty blush, sage; warm daylight — not cold grey laptop void
- Couple: hijabi bride ivory/taupe, groom **navy** (not black)

**Reject if:** only generic video-call vignette with no Japan landmark; anime-flat vs master grain; cold overcast wash.

**Budget:** ≤3 attempts. Model: stay on the same family as existing story chapters (GPT Image 2 medium or project fal image model — record choice in a one-line note at top of `13-fal-generation-plan.md` if used). Seedream only if two failures.

**Fallback if regen fails twice:** Ship story as 5 chapters with ch04 copy as typographic beat (no fake placeholder image) — arc still works; prefer not to.

---

## 6. Kill criteria (regen vs substitute)

| Situation | Action |
|-----------|--------|
| Primary layer asset off-brief / off-world | Regen ≤2× then typographic fallback |
| Secondary accent wrong | Crop / CSS / skip — never block launch |
| Identity off (faces/cats) | Human decide; regen rarely fixes identity |
| Oversize only | sharp only — never regen for weight |
| After generation freeze (see plan 05) | Fallbacks only |

---

## 7. Delta from old plan (`phase1/02`)

| Old | Now |
|-----|-----|
| Promote 14 of 17 generated; reject tall-portrait; regen **ch01** | Promote ~47 keepers across 9 slices; **regen ch04**; ch01 KEEP+compress |
| `gate-floral-border` mandatory re-render (375px) | Border **USE** at ~365 KB — no mandatory regen |
| `closing-echo` promoted as closing | Primary = **`closing-couple-and-cats`** |
| No cats / couple cutout / drapery / music icons in promote list | **All present** in `relevant/` |
| White-bg accents only multiply | Still true for some; plus true-alpha florals now exist (`drapery-divider`, corners) |
| Generation budget = ch01 + gate border | Generation budget = **ch04 only** (+ optional music pair) |

---

## 8. Execution checklist

- [ ] ch04 regenerated + human-approved → copied into `04-story/` and `illustrations/story/`
- [ ] `couple-cutout.png` (correct spelling) in `couple/`
- [ ] All §4 files re-encoded; sizes verified with `ls -lh` / manifest update
- [ ] `floral-corner-br` cropped
- [ ] Music icons transparent (or matched regen)
- [ ] Gallery WebPs produced
- [ ] `copy-assets` run; `npm run dev` — zero 404s for referenced paths
- [ ] Cat refs remain out of public tree
- [ ] SPOTISAVER mp3 not copied

**Next owner:** Cursor agent runs P0; human approves ch04. Then [plan 03](./03-HERO-AND-GATE-LIVING-EXPERIENCE.md).
