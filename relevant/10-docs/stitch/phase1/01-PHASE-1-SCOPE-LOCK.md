# 01 — Phase 1 Scope Lock
**Role:** Strategic Creative Direction · **Date:** 2026-07-05 · **Wedding:** 22 August 2026 (48 days out)
**Question answered:** What is the minimum shippable #BASHicallyHANI's with the assets we actually have today?

---

## 1. The honest starting position

Golden Gate A ("no UI until every manifest asset exists") is dead. It was written for a world where asset generation was the bottleneck. Reality inverted: we have a finished hero video, a master still, music, and 17 generated illustrations — and **zero built UI**, 48 days out, with the copy document (`docs/03-copywriting.md`) currently missing from the working tree. The bottleneck is now build time, not pixels.

**Revised Golden Gate A (locked):** *A layer may be built when its PRIMARY visual asset is promoted (per doc 02) and its copy exists in the restored copy doc. Secondary/accent assets never block a layer — they slot in later or get CSS substitutes.* This converts a global gate into 13 per-layer gates, which is the only structure that ships by August.

## 2. The three scope questions, answered

### 2.1 L0 Envelope — SHIP, CSS/SVG-only v1 **(Recommended)**
The masterplan already specifies the envelope as inline SVG/CSS with no image dependency. It is the audio-unlock and gyro-permission gesture — cutting it breaks the sound design of the whole site, and it costs zero assets. Decision rule 7 applies: if illustration delays it >2 days, CSS-only wins. It does. **CSS/SVG envelope, no illustrated version in Phase 1.**

### 2.2 Gallery photos — CUT the scrapbook for launch **(Recommended)**
We have zero harmonized gallery photos. Decision rule 6 forbids faking the couple with illustrations in photo slots. A scrapbook with placeholders reads as unfinished; an empty state reads as a bug. The illustrated story (6 chapters) already carries the emotional arc of L6 without a single photo. **L6 ships as illustrated-chapters-only. L8 uses typography + venue card, no photo arch.** Scrapbook becomes a Phase 1.5 content drop — it is purely additive, so it can land any time before 22 Aug without touching layout, *if* 5–9 photos get harmonized. If they don't, nothing is missing to a guest who never saw the masterplan.

### 2.3 Phase 2 deferrals — confirmed, no exceptions
Cat sprites (all 7), extra video loops beyond hero, gyro parallax on hero layers (permission is still requested at L0 so Phase 2 can use it), confetti on RSVP submit, FLIP wishes wall animation. All DEFER. Each is polish on top of a working site; none unblocks launch.

## 3. IN / OUT / DEFER — all 13 layers

| Layer | Verdict | Primary asset (today) | Notes |
|---|---|---|---|
| L0 Envelope | **IN** | none — inline SVG/CSS | Audio + gyro unlock gesture |
| L1 Loading | **IN** | `loading-sleeping-cat.webp` (promote) | 1–2s, breathing loop via CSS scale |
| L2 Gate | **IN** | `gate-monogram-frame.webp` + `gate-floral-border.webp` (border needs res fix, doc 02) | Guest name from URL param |
| L3 Hero | **IN** | `video/hero-bg-loop.mp4` + `scenes/hero-main.webp` poster | Already production-committed |
| L4 Welcome + Yasin | **IN** | `welcome-dove-floral.webp` (promote) | Ivory-dominant, copy-led |
| L5 Countdown | **IN** | `countdown-bg.webp` + `countdown-floral-band.webp` (promote) | Live countdown to 22 Aug |
| L6 Story | **IN** (chapters) / **CUT** (scrapbook) | 5 of 6 chapters promote; ch01 regenerate | See doc 02 |
| L7 Japan Dream | **IN** | `japan-sakura-campus.webp` + `japan-petal-accent.webp` | Strongest generated section |
| L8 Event Details | **IN** (typographic) | none needed — ivory + floral accents reused from L2/L5 | Venue arch frame image CUT; CSS card instead |
| L9 RSVP | **IN** | none — form UI | Backend per REF-03; confetti DEFER |
| L10 Wishes Wall | **IN** (simple list) | none — form + list UI | FLIP animation DEFER |
| L11 Gift + FAQ | **IN** (typographic) | none — copy-only accordion | No asset ever required |
| L12 Closing | **IN** | `closing-echo.webp` (promote — Hoshi peek already inside it) | Static; loop is a stretch item (doc 03) |
| Persistent UI | **IN** (reduced) | none | Music toggle + sticky RSVP pill IN; ambient doves/particles DEFER to polish week |

**Net:** all 13 layers ship. What got cut is *asset-hungry sub-features inside layers* (scrapbook, arch frame, sprites, ambient layer), not layers themselves. The emotional arc L0→L12 survives intact — that is the actual Golden Gate C requirement.

## 4. What "minimum shippable" means concretely

A guest on a mid-tier Android over 3G: opens envelope → hears La Vie en Rose fade in → 1s sleeping-cat loading → gate with her name → living meadow hero (or poster on LOW) → scrolls one continuous illustrated storybook → RSVPs → reads wishes → sees the family walk toward the sunset with Hoshi peeking goodbye. Zero placeholders, zero empty states, zero "coming soon."

## 5. Missing-asset list, re-audited against reality

Of the masterplan's missing items: cat cutouts → Phase 2. Couple cutout → Phase 2. Gallery photos → Phase 1.5 content drop or never. Drapery dividers/floral corners → SUBSTITUTE with reuse of `countdown-floral-band` + `japan-petal-accent` + CSS (doc 04). Venue arch → CUT (typographic card). Closing Hoshi peek → **already exists inside `closing-echo.webp`**. Envelope → CSS. **Required new generation for launch: one image (story ch01 regen). Everything else is optional.**

---

## Decisions locked
- Revised Golden Gate A: per-layer gate — primary asset promoted + copy restored = build.
- L0 Envelope ships as CSS/SVG-only; no illustration in Phase 1.
- L6 scrapbook and L8 photo/arch treatments are CUT from launch; L6 is illustrated-chapters-only.
- All 13 layers are IN; cuts are intra-layer only.
- Phase 2 deferrals confirmed: cat sprites, extra loops, hero gyro parallax, confetti, FLIP wall, ambient doves/particles.
- Only mandatory new generation: `story-ch01` replacement (see doc 02).

## Open questions for Bashara & Hanifah
1. Scrapbook: do you want to select 5–9 real photos by **1 August** for a Phase 1.5 drop, or consciously ship illustration-only? (Both are fine; deciding now prevents a last-week scramble.)
2. Wishes Wall: pre-moderated (you approve each wish) or live? This changes L10 backend scope, not visuals.
3. Is the guest-name-in-URL personalization (L2) required for launch, or acceptable as "Bapak/Ibu & keluarga" fallback if link generation slips?

## If wrong, what breaks
If the per-layer gate is wrong and coherence actually requires all assets upfront, we discover it at Golden Gate C review — recoverable, costs a triage week. If cutting the scrapbook is wrong (the couple expected real photos), it's a content drop, not a rebuild — layout reserves nothing for it, so the fix is one new section variant, ~2 days. The unrecoverable failure mode is ignoring the missing copy doc and inventing copy during build — that violates rule 5 and would force a full copy re-pass; hence it is P0 in doc 05.
