# Relevant Asset Index

Master relevance map synthesized from 10 deep filter agents that triaged `/nikah-web/` against the stitch briefs, masterplan, fal-generation plan, and conversation decisions. Originals in `nikah-web/` were **copied**, never moved.

Generated: 2026-07-18

---

## Folder map

| # | Folder | Slice | Keepers | Agent |
|---|--------|-------|---------|-------|
| 01 | `01-hero-scenes-video/` | Hero stills + living video | 6 | Agent 1 |
| 02 | `02-cats/` | Generated cat cutouts | 7 | Agent 2 |
| 03 | `03-couple/` | Illustrated cutout + scrapbook photos | 5 | Agent 3 |
| 04 | `04-story/` | Love-story chapter vignettes | 5 | Agent 4 |
| 05 | `05-gate-loading-welcome/` | Loading, Gate, Welcome | 4 | Agent 5 |
| 06 | `06-countdown-japan-event/` | Countdown, Japan, Event | 5 | Agent 6 |
| 07 | `07-rsvp-wishes-gift-closing/` | RSVP, Wishes, Gift, Closing | 6 | Agent 7 |
| 08 | `08-dividers-florals-accents/` | Dividers, florals, accents, music icons | 9 | Agent 8 |
| 09 | `09-references-audio/` | Cat photo references + shipping audio | 8 | Agent 9 |
| 10 | `10-docs/` | Authoritative briefs / specs / guides | 66 | Agent 10 |

Each folder has its own `manifest.md` with per-file verdicts.

---

## Verdict rollup

| Category | USE / KEEP | SKIP | Notes |
|----------|------------|------|-------|
| Shipping visual assets | **47** | 8 photos + 1 story vignette | See gaps below |
| Audio | **1** (`la-vie-en-rose.mp3`) | 1 duplicate (SPOTISAVER stereo) | |
| Cat photo references | **7** (archived, not shipped) | 0 | Identity-confirmed |
| Docs | **66** | 7 (3 outdated + 4 scratch) | |
| **Total keepers in `relevant/`** | **~121** | | |

---

## Critical gaps (must act)

> **Update 2026-07-18 (Fable build):** remediation + UI scaffold landed in `nikah-web/`. See `plans/DELTA.md` + `plans/HUMAN-HANDOFF.md`.

1. ~~**`story-ch04-ldr-tokyo.webp` missing / off-brief**~~ → **USE.** Original kept; `story-ch04-ldr-tokyo-v2.webp` (Tokyo Tower + sakura) promoted into shipping after one `gpt-image-2/edit` — **human eyeball still required**.
2. ~~**`couple-cutoutt.png` typo**~~ → renamed on promote to `couple-cutout.png`.
3. ~~**Oversized dense stills**~~ → compressed into `nikah-web/assets/` (hero blockers → ~124–183 KB class; gift icon ~4 KB). Re-run `npm run remediate-assets` if `relevant/` sources change.
4. **Human-only remaining:** Apps Script URL, bank/gift/livestream values, domain, device QA, commit/deploy approval.

---

## Soft issues (fixable, not blockers)

| Asset | Issue |
|-------|-------|
| `cat-shiro.png`, `cat-hoshi.png` | Not clean isolates — floral halo / blanket scene baked into alpha. Re-cut if Hero/Closing needs free compositing. |
| `music-note-icon.webp` + `music-note-icon-muted.webp` | Not a matched pair; both opaque. Need bg knockout + preferably a regenerated matched set. |
| `floral-corner-br.webp` | Two-corner diagonal frame, not a clean mirror of TL. Crop to BR cluster only. |
| `closing-echo.webp` | Secondary only — groom is black (hero is navy), flatter/anime style. Prefer `closing-couple-and-cats.webp` as primary. |
| `hero-tall-portrait.webp` | Baked-in ivory border — crop if full-bleed mobile hero wanted. |
| `event-arch-frame.webp` | Thin gold outline brushes the "no gold filigree" guideline (delicate, keepable). |
| `cat-jiro.png` collar tag | Cosmetically reads "OBI" not "JIRO" — negligible at ship size. |
| Meng reference photo | Source is B&W — true colorway can't be derived from it alone. |

---

## Docs triage (Agent 10)

**SKIP (outdated):**
- `04-asset-list.md` — cites dead `correct/most correct/` paths
- `07-gemini-asset-prompts.md` — superseded by `GUIDE-01-FAL-ASSET-ENGINE.md`
- `TODO_ASSETS.md` — all rows still `⬜ pending` though assets exist

**SKIP (scratch):**
- `please generate me the script, with japanese, hira.md` (unrelated UNIQLO SWOT)
- Perplexity "best remove background…" dump
- `output.mp4`, `output-2/3/4.mp4` (early hero-video test renders)

**KEEP:** masterplan, stitch briefs 01–10, phase1/, GUIDE-00…05, REF-*, PRODUCT, CURSOR-MASTER-BRIEF, NIKAH-MASTER-TECHSTACK (flagged: generation sections superseded), 00–03/05–06/08–13 build docs, all `spec/*`.

---

## Recommended next actions (ordered)

1. **You:** Eyeball ch04 v2 + GG-Hero / GG-World on real phones (see `plans/HUMAN-HANDOFF.md`).
2. **You:** Fill bank / gift / livestream / `APPS_SCRIPT_URL` / domain.
3. **You:** Approve git commits + Vercel deploy (root = `nikah-web/`).
4. Optional: music-icon matched regen (inline SVG already ships).
5. Leave `09-references-audio/cat-reference/` out of the shipping tree — archive only.

---

## What was NOT changed

- Nothing deleted from `nikah-web/` (all copies).
- No `nikah-web/` code, scripts, or `public/assets/` touched.
- No Git operations.
