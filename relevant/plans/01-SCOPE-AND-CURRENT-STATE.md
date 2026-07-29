# 01 — Scope & Current State Lock

**Role:** Launch scope lock after deep asset triage  
**Date:** 2026-07-18 · **Wedding:** 22 August 2026  
**Supersedes:** `10-docs/stitch/phase1/01-PHASE-1-SCOPE-LOCK.md` (actionable scope); operational parts of `GUIDE-00-EXECUTE.md`  
**Companion plans:** [02 Asset remediation](./02-ASSET-READINESS-AND-REMEDIATION.md) · [03 Hero/Gate](./03-HERO-AND-GATE-LIVING-EXPERIENCE.md) · [04 Sections](./04-SCROLL-STORY-AND-SECTIONS.md) · [05 Polish/deploy](./05-POLISH-DATA-AUDIO-DEPLOY.md)  
**Canon still obeyed:** `PRODUCT.md`, `stitch/masterplan.md` emotional arc, `stitch/03-SECTIONS-AND-FLOW.md`, ivory `#FBF7F0`, *hidup bukan kaku*

---

## 1. Honest starting position (post-triage)

Golden Gate A from `GUIDE-00` (“no UI until every fal manifest asset exists”) is **dead**. The July 5 Phase 1 revision already said so; the July 18 triage **proves** the opposite bottleneck:

| Then (GUIDE / early phase1) | Now (`relevant/` + INDEX) |
|-----------------------------|---------------------------|
| Assets are the critical path | **UI + compression** are the critical path |
| Mass fal generation Phase A | **One regen** (ch04) + sharp remediations |
| Scrapbook CUT (zero photos) | Scrapbook **IN** — 4 KEEP photos |
| Closing = `closing-echo` | Closing primary = **`closing-couple-and-cats`** |
| Mandatory regen = ch01 | Mandatory regen = **ch04** (ch01 KEEP, oversize only) |
| Source world = `correct/` / TODO_ASSETS | Source world = **`relevant/01`–`09` keepers** |

**Revised Golden Gate A (locked):** A layer may be built when its **primary visual** is a KEEP in `relevant/` (or CSS-only by design) **and** copy exists in `10-docs/03-copywriting.md`. Secondary accents never block a layer — they slot in from plan 02 or get ivory+type fallbacks.

---

## 2. What we actually have

Evidence: [`../INDEX.md`](../INDEX.md) + per-folder `manifest.md`. Paths below are absolute under the repo.

### Shipping keepers (visual + audio)

| Slice | Path | Count | Notes |
|-------|------|------:|-------|
| Hero / scenes / video | `relevant/01-hero-scenes-video/` | 6 | Master + loop + poster + bg stills |
| Cats | `relevant/02-cats/` | 7 | All identities correct |
| Couple | `relevant/03-couple/` | 5 | 1 cutout + 4 scrapbook photos |
| Story | `relevant/04-story/` | 5 | ch01–03, ch05–06 (ch04 absent — regenerate) |
| Gate / loading / welcome | `relevant/05-gate-loading-welcome/` | 4 | All USE |
| Countdown / Japan / event | `relevant/06-countdown-japan-event/` | 5 | All USE |
| RSVP / wishes / gift / closing | `relevant/07-rsvp-wishes-gift-closing/` | 6 | Primary closing chosen |
| Dividers / florals / accents | `relevant/08-dividers-florals-accents/` | 9 | Music icons need knockout |
| Audio | `relevant/09-references-audio/audio/` | 1 | `la-vie-en-rose.mp3` |

**Cat photo references** in `09-references-audio/cat-reference/` — archive only; never ship raw.

### Critical gaps (must act — detail in plan 02)

1. **Regenerate** `story-ch04-ldr-tokyo.webp` — off-brief in source (generic video-call heart; missing Tokyo Tower + sakura + split).
2. **Rename** `couple-cutoutt.png` → `couple-cutout.png`.
3. **Compress** every KEEP visual >1.5 MB (blockers: `hero-bg.webp` ~7.36 MB, `story-ch01-meeting.webp` ~7.4 MB).

### Soft issues (fixable, not launch-blockers)

- `cat-shiro` / `cat-hoshi` — not clean isolates (re-cut only if free compositing needed).
- Music icons — unmatched pair + opaque backgrounds.
- `floral-corner-br` — crop to BR cluster only.
- `closing-echo` — secondary only.
- Scrapbook JPEGs — huge raw files; must harmonize + compress before gallery ship.

### Explicit non-goals (Phase 1)

| Non-goal | Why |
|----------|-----|
| Phase 0 rmbg / img2img from `correct/` or `correct/most correct/` | That tree is gone from the plan surface; keepers already illustrated |
| Mass fal video generation (chapter loops, multi-layer alpha heroes) | One hero video exists and is enough |
| Shipping SPOTISAVER audio duplicate | Larger stereo twin of same track |
| Using SKIP docs as inventory | `04-asset-list`, `07-gemini-asset-prompts`, `TODO_ASSETS` |
| Inventing copy | Locked in `10-docs/03-copywriting.md` |
| Gold-filigree / template “Kepada Yth.” envelope kitsch | PRODUCT anti-references |
| Making real couple/cat **photos** into video | Identity rule — photos stay photos |

---

## 3. Layer IN / OUT / DEFER (13 layers)

Aligned with `stitch/masterplan.md` L0–L12 + `stitch/03` section order. Envelope (L0) remains CSS/SVG ritual — not a generated asset.

| Layer | Verdict | Primary asset (today) | Notes |
|-------|---------|----------------------|-------|
| L0 Envelope | **IN** | CSS/SVG only | Audio + gyro unlock; no illustrated envelope asset |
| L1 Loading | **IN** | `05/…/loading-sleeping-cat.webp` | Compress first |
| L2 Gate | **IN** | `gate-monogram-frame` + `gate-floral-border` | Border already usable (~365 KB) |
| L3 Hero | **IN** | `video/hero-bg-loop.mp4` + `hero-main.webp` poster | Already production-weight |
| L4 Welcome | **IN** | `welcome-dove-floral.webp` | Compress |
| L5 Countdown | **IN** | `countdown-bg` + `countdown-floral-band` | Band size OK |
| L6 Story | **IN** | 5 KEEP chapters + **ch04 regen** + optional scrapbook strip | Polaroid-on-paper framing |
| L6 Scrapbook | **IN** (additive strip) | 4 KEEP photos in `03-couple/` | Was CUT Jul 5; now available — still optional if compress slips |
| L7 Japan | **IN** | `japan-sakura-campus` + `japan-petal-accent` | Compress campus scene |
| L8 Event | **IN** | Typography + `event-arch-frame` + `event-venue-icon` | Arch kept (delicate gold line OK) |
| L9 RSVP | **IN** | Form UI + `rsvp-card-corner` | Backend REF-03 |
| L10 Wishes | **IN** | Form + list + `wishes-washi-tape` | FLIP animation DEFER |
| L11 Gift + FAQ | **IN** | Accordion + `gift-envelope-icon` (must shrink) | Grateful tone |
| L12 Closing | **IN** | **`closing-couple-and-cats.webp`** primary; `closing-hoshi-peek` overlay optional; `closing-echo` secondary/mobile alt | Compress primary |
| Persistent UI | **IN** | Music toggle (after knockout), sticky RSVP, scroll progress | Full ambient doves DEFER if perf tight |

**Phase 2 deferrals (confirmed):** per-cat interactive sprites on hero, gyro parallax layers on hero video, extra fal loops beyond optional closing stretch, confetti-heavy RSVP, wishes FLIP as launch requirement.

**Cats / couple cutout:** Available now — use in Closing/Hero embellishment **only where compositing works**. Do not block launch on shiro/hoshi re-cuts.

---

## 4. Definition of done — Phase 1 / launch

A guest on a mid-tier Android over 3G:

1. Opens the invitation (envelope or gate ritual) → hears **La Vie en Rose** fade in.
2. Sees sleeping-cat loading → gate with guest name (or graceful fallback) → **living meadow hero** that matches `hero-main.webp` (or poster on LOW).
3. Scrolls one continuous ivory storybook: Welcome → Countdown → **6 story chapters** (ch04 on-brief) → Japan → Event → (scrapbook if promoted) → RSVP → Wishes → Gift/FAQ → Closing with navy-groom family echo.
4. Submits RSVP successfully; reads wishes; finds venue/maps/calendar.
5. Zero placeholders, zero “coming soon,” zero broken images, zero `#FFFFFF` seams against ivory.

### Golden gates (must pass before send)

| Gate | Criterion | Owner |
|------|-----------|-------|
| **GG-Hero** | Side-by-side: first painted hero frame ≈ `hero-main.webp` (composition, light, family). Poster and video share framing. | Human + Cursor |
| **GG-Weight** | Hero path transfer <800 KB (video ~244 KB already helps). No still >~400 KB at display width after sharp. | Cursor agent |
| **GG-World** | Scroll L0→L12 feels like one book — same ivory, warm daylight, watercolor grain (`stitch/phase1/04` checklist still valid). | Human |
| **GG-Story** | ch04 shows Tokyo Tower + sakura + split composition per Screen 5 brief. | Human |
| **GG-A11y** | WCAG 2.2 AA spot-check; `prefers-reduced-motion` usable; ≥44px targets. | Cursor + Human |
| **GG-Data** | RSVP + wishes hit live Sheets; honeypot + rate limit; no secrets in client. | Cursor + Human |

---

## 5. Build order (locked)

```
Plan 02 remediation (compress / rename / crop / ch04)  →  promote to nikah-web assets
    →  Plan 03 (L0–L3 ritual + hero)  →  Plan 04 (L4–L12)
    →  Plan 05 (audio polish, Sheets, a11y, deploy)
```

Do **not** wait for soft issues (music icon regen, shiro re-cut) before starting L0–L3.

---

## 6. Delta from old plan (`phase1/01`)

| Old claim | Correction |
|-----------|------------|
| Scrapbook CUT | **IN** with 4 photos (still compress-gated) |
| Only mandatory regen = ch01 | **ch04**; ch01 is KEEP |
| Closing = `closing-echo` | Primary = **`closing-couple-and-cats`** |
| Venue arch CUT | **IN** — `event-arch-frame.webp` USE |
| Cat cutouts Phase 2 only | **Available**; use carefully |
| “Zero built UI, copy missing” | Copy exists in `relevant/10-docs/03-copywriting.md`; restore into `nikah-web` as needed |
| Dead `correct/` pipeline | **Removed** from scope |

---

## 7. Open questions (human)

1. Scrapbook: ship the 4 KEEP photos in Phase 1 after compress/harmonize, or hold as Phase 1.5?
2. L0: keep CSS envelope prologue (masterplan) or gate-first if envelope feels kitschy vs PRODUCT anti-references?
3. Closing: confirm primary `closing-couple-and-cats` + separate `closing-hoshi-peek`, vs secondary `closing-echo` alone on mobile?
4. Guest-name URL personalization required for launch, or fallback greeting OK?

---

## 8. Checklist — scope lock sign-off

- [ ] Couple agrees: ch04 is the only regen before launch
- [ ] Couple agrees: scrapbook IN or DEFER
- [ ] Couple agrees: closing primary asset
- [ ] Cursor agent treats `relevant/` as sole asset source of truth for promotion
- [ ] No work resumes against `TODO_ASSETS.md` / Gemini prompts / `correct/`

**Next owner:** Cursor agent executes [plan 02](./02-ASSET-READINESS-AND-REMEDIATION.md); human answers §7 before ch04 spend.
