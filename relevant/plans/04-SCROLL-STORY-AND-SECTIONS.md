# 04 — Scroll Story & Remaining Sections

**Role:** L4–L12 — one continuous ivory storybook after the hero  
**Date:** 2026-07-18  
**Supersedes:** `10-docs/stitch/phase1/04-VISUAL-COHERENCE-AND-LAYER-BINDING.md` (actionable bindings); `GUIDE-03-SCROLL-STORY-SECTIONS.md` build order  
**Prerequisite:** [03 Hero/Gate](./03-HERO-AND-GATE-LIVING-EXPERIENCE.md) working; [02](./02-ASSET-READINESS-AND-REMEDIATION.md) story + section assets promoted (ch04 in place or typographic fallback)  
**Next:** [05 Polish / data / deploy](./05-POLISH-DATA-AUDIO-DEPLOY.md)  
**Canon:** `stitch/03-SECTIONS-AND-FLOW.md`, `stitch/10` Screens 3–11, `03-copywriting.md` (locked — never invent text)

---

## 1. Global coherence laws

1. **One paper:** site background is continuous ivory `#FBF7F0`.
2. **Two rhythms only:**
   - **On-paper** vignettes / polaroids / wreaths / corners
   - **Windows** — full-bleed scenes (Countdown bg, Japan, Closing)
3. **Never** two full-bleed windows back-to-back without an ivory breath.
4. **Illustration carries the world; photographs carry the people** — scrapbook photos never replace hero illustration.
5. **Story chapters = album pictures** (~85vw, soft shadow, ±1° alternate tilt) — not six competing full-bleed worlds. This is what makes today’s chapter grades shippable together.
6. Copy always from `10-docs/03-copywriting.md` → `lib/copy.ts`.

---

## 2. Section map (what is CSS vs illustration vs photo)

| Layer | Section | Primary visual | Medium | Motion (launch) |
|-------|---------|----------------|--------|-----------------|
| L4 | Welcome + Yasin | `welcome-dove-floral.webp` | Illustration on paper | CSS/Motion reveal; optional dove drift |
| L5 | Countdown | `countdown-bg` + `countdown-floral-band` | Window + band | GSAP digits; band sway HIGH/MID |
| L6 | Kisah Kami ×6 | `story-ch0N-*.webp` | Illustration polaroids | Scroll reveal only — **static images** |
| L6b | Scrapbook | 4 gallery WebPs | **Photo** + arch/washi | Slight rotate; lightbox optional |
| L7 | Japan Dream | `japan-sakura-campus` + petal accent | Window + accent | 2–3 CSS petals HIGH only |
| L8 | Event | `event-arch-frame` + `event-venue-icon` + type | Illustration frames + UI | Reveal |
| L9 | RSVP | `rsvp-card-corner` + form | Accent + UI | Micro-feedback |
| L10 | Wishes | `wishes-washi-tape` + list | Accent + UI | Fade-in (FLIP defer) |
| L11 | Gift + FAQ | `gift-envelope-icon` + accordion | Icon + UI | Accordion CSS |
| L12 | Closing | **`closing-couple-and-cats.webp`** | Window | Ken Burns on still; Hoshi peek overlay |

**Dividers:** prefer real `drapery-divider.webp` + `floral-corner-*` (after BR crop) over overusing countdown band. Restraint: accents don’t wallpaper Act 3 (practical sections stay quieter so Closing lands).

---

## 3. L4 — Welcome

**Assets:** `illustrations/welcome-dove-floral.webp` (compress first)  
**Copy:** Welcome + Surah Yasin 36 per locked doc  

- [ ] Dove illustration top ~70vw on ivory; verse + greeting below on paper  
- [ ] Fallback: typography-only on ivory  
- [ ] Owner: Cursor agent  

---

## 4. L5 — Countdown

**Assets:** `scenes/countdown-bg.webp`, `illustrations/countdown-floral-band.webp`  
**Target date:** 22 August 2026 (from config)

- [ ] Full-bleed bg with 10–15% ivory scrim under digits  
- [ ] Band as edge divider (multiply if white-backed); sway ±1° HIGH/MID  
- [ ] Live countdown hook (`useCountdown`) — REDUCED: update without flip animation  
- [ ] Fallback: ivory + digits only  

---

## 5. L6 — Love story (Kisah Kami)

### Chapter assets

| Ch | Title (product copy) | Asset status |
|----|----------------------|--------------|
| 1 | Awal yang Sederhana | KEEP `04/story-ch01-meeting.webp` — compress |
| 2 | Antar Pulang… | KEEP `story-ch02-rides.webp` — compress |
| 3 | Bersama di Jakarta | KEEP `story-ch03-jakarta.webp` — compress |
| 4 | LDR, Sampai Tokyo | **REGEN** — see plan 02 §5 |
| 5 | Keio acceptance | KEEP `story-ch05-keio.webp` — compress |
| 6 | Memutuskan Menikah | KEEP `story-ch06-married.webp` — compress |

### Build rules

- [ ] One chapter per fold on mobile; title + 1–3 lines body **below** image (never overlaid on dense art)
- [ ] Polaroid framing + alternating tilt — coherence device (locked)
- [ ] Scroll reveal: fade + slight rise + scale 1.02→1; stagger; LOW = fade; REDUCED = instant
- [ ] **No chapter videos** — locked forever for launch taste + weight
- [ ] If ch04 missing: typographic chapter (number + title + copy), no grey box placeholder

### Scrapbook photos (IN — changed from Jul 5 CUT)

**Keepers** (`relevant/03-couple/`):

1. `couple-standing-smiling.jpg` — highest-value standing smile  
2. `couple-overhead-romantic-pose.jpeg` — romantic beat  
3. `couple-overhead-bride-bouquet.jpeg` — bouquet beat  
4. `couple-overhead-groom-above.jpeg` — playful beat  

**Skip forever:** alt/dupe/casual/spotlight/lying shots per `03-couple/manifest.md`.

**Placement:** between chapters 3–5 (or after ch06 as additive strip) — arch frame + washi (`wishes-washi-tape` or floral corners), ±2–4° rotation, warm shadow. Harmonize ≤0.35; never put photos in the Hero.

**If compress slips:** ship illustration-only story; scrapbook is additive — guests who never saw the masterplan won’t miss it.

---

## 6. L7 — Japan Dream

**Assets:** `japan-sakura-campus.webp` (compress), `japan-petal-accent.webp`  
**Copy:** locked Japan line (Keio Hiyoshi & SIT Tokyo…)

- [ ] Portrait full-bleed window or framed if grade fights ivory  
- [ ] HIGH: 2–3 drifting petal DOM nodes from accent; MID+: static scene  
- [ ] Text in flat sky or below on paper  

---

## 7. L8 — Event details

**Assets:** `event-arch-frame.webp`, `event-venue-icon.webp`  
**Jul 5 cut reversed:** arch is USE (thin gold line = delicate, keepable — not filigree excess).

- [ ] Ceremony / reception cards: clarity first — maps + calendar CTAs  
- [ ] Venue icon as small mark; arch as optional frame around venue block  
- [ ] Fallback: pure typographic cards + amber rules  

---

## 8. L9–L11 — Practical act (quiet)

| Layer | Accent | UI focus |
|-------|--------|----------|
| L9 RSVP | `rsvp-card-corner.webp` | Hadir / Tidak / Diusahakan; pax cap; honeypot |
| L10 Wishes | `wishes-washi-tape.webp` | Submit + feed; moderation policy TBD |
| L11 Gift + FAQ | `gift-envelope-icon.webp` (must be ~50–80 KB) | Grateful tone; accordion FAQ |

Rules:

- At most **one** floral accent per practical section  
- Sticky RSVP pill appears after hero; hides in RSVP section  
- Backend wiring detailed in [plan 05](./05-POLISH-DATA-AUDIO-DEPLOY.md) / REF-03  

---

## 9. L12 — Closing

### Primary vs secondary (locked by triage)

| Asset | Role |
|-------|------|
| **`closing-couple-and-cats.webp`** | **PRIMARY** — navy groom, beige hijab, 7 cats, watercolor match to hero |
| `closing-echo.webp` | **Secondary** — groom black ≠ navy; flatter/anime; mobile alt only if needed |
| `closing-hoshi-peek.webp` | Overlay peek from bottom edge (or use if primary lacks peek) |

### Build

- [ ] Full-bleed primary scene; copy + hashtag in warm sky (top third)  
- [ ] Optional CSS Ken Burns `scale 1→1.04` on scroll (still — allowed)  
- [ ] Hoshi peek: separate asset slide-up or baked — prefer separate for control  
- [ ] Fallback: `hero-main.webp` with warm sepia CSS (literal echo)  
- [ ] Stretch only: fal loop from primary still — HIGH tier, ≤900 KB, go/no-go late (plan 05)  

**Do not** ship `closing-echo` as primary just because it is smaller.

---

## 10. Cats & couple cutout in scroll world

| Asset | Use now | Caution |
|-------|---------|---------|
| 7 cat PNGs | Closing accents, optional story easter eggs | shiro/hoshi not clean isolates |
| `couple-cutout.png` | Optional Closing/ambient composite | Rename first; don’t fight hero video |

Phase 2: interactive cat sprites on hero — out of scope here.

---

## 11. Ambient (post-hero, reduced for launch)

From GUIDE-04, scoped:

| System | Launch | Defer |
|--------|--------|-------|
| Music toggle (persistent) | **IN** after icon fix | Matched regen if knockout ugly |
| Sticky RSVP / scroll-top / progress | **IN** | — |
| Petal/dove particles sitewide | Light / MID- | Heavy particle field |
| Drapery between major acts | **IN** (`drapery-divider`) | Overuse |

---

## 12. Eyeball checklist (Golden Gate World)

Run with promoted assets + `hero-main` on one board, then scroll on device:

1. Paper seam: no cold `#FFFFFF` boxes against ivory  
2. Light: warm daylight / golden — no grey laptop void (esp. ch04 after regen)  
3. Palette: sage / dusty blush / soft sky — no neon  
4. Grain: watercolor soft edges  
5. Faces: same couple as master  
6. Cats: identities per stitch/09  
7. Sequence: L3→L12 one book  

Any ✗ → layer fallback (ivory + type), not “ship anyway.”

---

## 13. Delta from old plans

| Old | Now |
|-----|-----|
| Scrapbook CUT | **IN** with 4 KEEP photos |
| Venue arch CUT | **IN** |
| Closing = `closing-echo` (+ baked Hoshi) | Primary = **`closing-couple-and-cats`** + optional peek asset |
| Divider substitutes only (band ×2, petal ×3) | Real drapery + floral corners available — use with restraint |
| ch01 typographic until regen | ch01 illustrated; **ch04** is the gap |
| Cats unavailable | Cats available with compositing caveats |

---

## 14. Build checklist (Cursor)

- [ ] `Welcome` `Countdown` `Story`/`StoryChapter` `Japan` `Event` `Rsvp` `Wishes` `Gift` `Faq` `Closing` wired in `page.tsx` order  
- [ ] All image paths hit promoted assets (no 404)  
- [ ] Scrapbook strip gated on files existing  
- [ ] Tier matrix honored per section  
- [ ] Copy 100% from `lib/copy.ts`  

**Next owner:** Cursor agent builds L4–L12; human runs sequence test + face/cat sign-off. Then [plan 05](./05-POLISH-DATA-AUDIO-DEPLOY.md).
