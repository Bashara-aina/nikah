# GUIDE 03 — THE SCROLL STORY & SECTIONS

> **Act 2 (The Story).** Below the hero, the guest's thumb becomes the narrator. Scrolling *is* the storytelling. Each section is a chapter of a picture book.
> **Prerequisite:** [GUIDE 01](GUIDE-01-FAL-ASSET-ENGINE.md) (assets) + [GUIDE 02](GUIDE-02-GATE-AND-HERO.md) (gate + hero) complete.

> ## ⭐ EVERYTHING ADJUSTS TO `nikah-web/scenes/hero-main.webp`
> Every section lives in the **same world as the master** ([defined in GUIDE 01](GUIDE-01-FAL-ASSET-ENGINE.md#-the-master-visual-anchor--nikah-webscenes-hero-mainwebp)): its palette (ivory/cream, blush, dusty rose, soft peach, sage/spring green, soft sky blue, the groom's navy), its soft morning light, its watercolor storybook finish, its cats. Story illustrations, gallery harmonization, dividers, and section colors all **match the master**. If a section looks like it belongs to a different palette or mood than `hero-main.webp`, it is wrong.

All copy is **locked** in `docs/03-copywriting.md` — do not invent new text. All choreography is in `docs/10-section-choreography.md`. Motion values come from `lib/motionTokens.ts` via `lib/motionAdapter.ts`. Sections live in `components/sections/`.

**Section order (one continuous ivory canvas, no nav bar):**
`Hero → Welcome → Countdown → Story (6 ch) → Japan → Event → Gallery → RSVP → Wishes → Gift → FAQ → Closing`

RSVP / Wishes / Gift / Closing backend + ambient systems are owned by **GUIDE 04**. This guide builds the **narrative + content** sections and the scroll mechanics that bind them.

---

## 0. The universal section pattern
Every section follows the same rhythm (`docs/10 §0`). Build one shared wrapper and reuse it:

```tsx
// components/sections/shared/SectionWrapper.tsx (build this)
// - IntersectionObserver / ScrollTrigger fires entrance at ~20% visible (start: "top 80%").
// - Entrance: children opacity 0→1 + y move.reveal→0, dur.enter, ease.enter, stagger.base.
//   Order within a section: heading → floral line → body → accent (each +80–120ms).
// - Idle: at least one living motion (CSS sway on florals, fal video on characters).
// - Exit: soft fade opacity→0.6 + small y as it leaves (never a hard cut).
// - Between sections: drapery-divider reveal/wipe — not a hard edge.
// - REDUCED: instant reveal, no transform. LOW: minimal. Drive via useMotion().tier.
```

Use the existing `useReveal` hook (ScrollTrigger reveal, auto-staggers children, no-op in REDUCED) or `MotionReveal`/`MotionFloat` primitives where a Motion variant reads cleaner. **Don't gate content visibility on animation** (`DESIGN.md` Motion rule) — the default state is already-visible; motion only enhances.

Background stays one flowing ivory (`--paper`); sections "flow," they are not boxes. Drapery dividers (`florals/drapery-divider.png`) ripple between every section via CSS mask shift + micro `scaleY`.

---

## 1. Welcome (`docs/03 §3`, `docs/10 §4`)
- Asset: `illustrations/welcome-accent.png` (doves + flowers).
- Copy: "Bismillahirrahmanirrahim…" greeting + **Surat Yasin Ayat 36** quote.
- Entrance: accent fade+scale from top; text per-line stagger (the "written slowly" effect).
- Idle: doves accent GSAP float ±3px; the verse breathes (subtle opacity pulse); CSS sway on the flower accent.
- Ambient: 2–3 petals drift through (from the persistent canvas, GUIDE 04).

---

## 2. Countdown (`docs/03 §4`, `docs/10 §5`)
- Asset: `scenes/countdown-bg.webp` soft band.
- Target: `siteConfig` → `2026-08-22T10:00:00+07:00`. Format **hari · jam · menit · detik**.
- Entrance: band fade; digits pop stagger `ease.settle`.
- Idle: each digit **rolls** on change (y +6→0 + micro opacity, smooth — not a hard flip); band a gentle GSAP breathing scale 1→1.01 (no fal video needed for a short band).
- Build a `useCountdown()` hook returning `{days,hours,minutes,seconds}`; tick with one `setInterval(…, 1000)`, cleaned up on unmount. Past the date → show "Hari bahagia telah tiba 🤍".

---

## 3. Love Story — 6 chapters (`docs/03 §5`, `docs/10 §6`)
The emotional core. 6 short chapters, third-person, short lines (not paragraphs), illustration alternating left/right.

| Chapter (copy heading) | Illustration |
| :-- | :-- |
| Awal yang Sederhana | `illustrations/story-meeting.png` (✅ exists) |
| Antar Pulang, Hati Semakin Dekat | `illustrations/story-motor.png` (fal-generated, GUIDE 01 §7) |
| Bersama di Jakarta | `illustrations/story-jakarta.png` (fal) |
| LDR, Sampai Tokyo | `illustrations/story-ldr.png` (fal) |
| Hanifah Diterima di Keio | `illustrations/story-keio.png` (fal) |
| Memutuskan Menikah, Studi Bersama | `illustrations/story-married.png` (fal) |

Build **one** reusable `StorySection` component driven by a config array (chapter, illustrationSrc, side, heading, body):

```tsx
type StoryChapter = {
  illustrationSrc: string;
  side: "left" | "right";   // alternates → "page turn" rhythm
  heading: string;
  body: string[];           // short lines
};
```

Choreography (`docs/10 §6`):
- Each line reveals on scroll (light `scrub`); the illustration **slides in from its side** then settles (`ease.settle`).
- A subtle `ScrollTrigger scrub: true` on the illustration's `translateX` so it drifts *with* scroll before landing → the left/right/left/right "page turn" feel.
- Idle: gentle GSAP/CSS breathing per illustration (these are PNGs, not fal video — a tiny breath is allowed here). The `story-married` heart/connection line pulses softly.
- **Doves thread the chapters:** when scroll crosses a chapter boundary, fire one dove MotionPath from the exiting chapter into the next (not every scroll tick) — a visual thread (`docs/10` + brief Act 2).
- Keep petals sparse here — protect readability.

> ### 🔀 DECISION — hero→story transition
> The brief mentions an optional HIGH-tier frame-sequence morph (hero composition → storybook). It's expensive and fragile. **Recommended:** skip the PNG frame sequence; use a clean drapery-divider wipe + crossfade hero→Welcome. Only build the frame morph if everything else is polished and budget remains. Default to the simple, beautiful crossfade.

---

## 4. Japan Dream (`docs/03` Keio/Tokyo beat, `docs/10 §7`)
This is woven into the story arc (chapters LDR + Keio) but gets a distinct ambient treatment:
- Asset: `illustrations/japan-motif.png` (sakura / campus / train).
- Entrance: motif fade+scale.
- **Particle override:** while this section is active, the persistent petal canvas shifts its palette to **soft sakura pink** and adds +2 count (GUIDE 04 exposes a `setParticleTheme("sakura")` the IntersectionObserver here toggles).
- Transition: drapery-divider ripple from Story into Japan and back.

---

## 5. Event Details (`docs/03 §6`, `docs/10 §8`, `docs/05 §6`)
Practical block, intentionally placed after the emotional arc. One flowing block:
- **Akad & Resepsi** — Sabtu, 22 Agustus 2026, akad **10.00 WIB**, acara hingga **13.00 WIB**.
- **Venue:** Widuri Restaurant, Lantai 2 — Jl. Ciliwung No.19, Cihapit, Bandung Wetan, Bandung 40114 (dekat Gedung Sate, parkir ± 40 mobil).
- **Map:** link button to `https://maps.app.goo.gl/eCQJZkY3qMvepZQz6` (lazy-load embed only when the section enters viewport — never block initial load).
- **Save to Calendar:** Google Calendar link **+ `.ics`** download, built from `lib/config.ts` calendar block (start `2026-08-22T10:00:00+07:00`, end `13:00`, title, location).
- **Dress code:** warna pastel.
- **Etiquette notes** + **Livestream** buttons (YouTube primary · Zoom · Instagram · Facebook) from config.

Choreography: `illustrations/event-accent.png` arch reveal frames the date/venue block; details stagger in; `illustrations/map-pin.png` **drops + bounces** (`ease.settle`, y −40→0); the arch CSS-sways ±0.5°; map-pin gives a gentle GSAP pulse inviting the tap.

> First populate `lib/config.ts` with the **real** venue/maps/livestream/bank/dress values (currently `"TBD"`). Pull them from `docs/05 §6` and `docs/03 §6`. Keep secrets/config out of hardcoded JSX — components import from `siteConfig`.

---

## 6. Gallery — scrapbook of real photos (`DESIGN.md` Imagery, brief Act 2)
The real photos, harmonized in GUIDE 01 §8, appear here **exactly once each**.
- Source: `assets/gallery/gallery-0n.webp`. Lazy-load all (`next/image`, explicit width/height, no CLS).
- Layout: **scrapbook scatter** — CSS grid with a stable per-photo `rotate(±2–4°)` set once at render (seed by index so it doesn't reshuffle). Never a uniform grid (`DESIGN.md` Layout).
- Entrance: scatter-in — each photo slides from a slightly different direction + rotate, `stagger.loose`.
- Interaction (HIGH): tap/hover → lift (`scale 1.04`) + deeper warm shadow (`--shadow-float`).
- **Lightbox:** tap opens the full photo over a backdrop-blurred gallery; trap focus, Esc/scrim closes, ≥44px close target.
- **Never** blend a photo and an illustration in the same frame — photos are photograph-treated, illustrations illustration-treated.

---

## 7. Scroll engine (binds all sections)
- **Lenis** (`components/motion/Lenis.tsx`) smooth scroll, lerp ≈ 0.09, synced: `lenis.on("scroll", ScrollTrigger.update)` and `gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)`.
- One **global RAF** drives parallax + particles — don't spawn a RAF per component.
- **`content-visibility: auto`** on below-the-fold sections (perf, `docs/11 §9`).
- All `<video>` in any section pause off-screen via `useVideoLayer` (already enforced by the `VideoLayer` primitive). Reuse `VideoLayer` for any section that shows a fal loop (e.g. Closing).
- **Cleanup:** every `ScrollTrigger`/`gsap` instance `revert()/kill()` on unmount; Lenis `destroy()` on unmount (`docs/11`, anti-pattern list).

---

## 8. Tier + reduced-motion across sections
| Tier | Sections behavior |
| :-- | :-- |
| HIGH | full reveal choreography, scrub parallax, doves between chapters, sakura override, gallery lift |
| MID | reveals on, reduced parallax, fewer petals, doves occasional |
| LOW | instant/fast reveals, no parallax, posters for any video, no particles |
| REDUCED | content shown immediately, opacity-only fades, zero positional motion |

Every section consults `useMotion().tier`. Reduced-motion is wired centrally in `globals.css` + `MotionProvider` — do not re-implement it per component; just branch where a section adds bespoke motion.

---

## 9. Acceptance criteria
- [ ] All sections render in order on one continuous ivory canvas, mobile portrait first.
- [ ] Story reads as a 6-chapter book; illustrations alternate sides; doves thread chapters.
- [ ] All 5 fal-generated story illustrations are placed and share one style.
- [ ] Countdown ticks correctly to 22 Aug 2026 10:00 WIB.
- [ ] Event block has working Map link, `.ics` + Google Calendar, livestream buttons, real config values.
- [ ] Gallery is a scatter scrapbook with working accessible lightbox; faces preserved.
- [ ] Japan section flips particles to sakura while active, reverts on exit.
- [ ] Drapery dividers wipe between sections; no hard cuts.
- [ ] `type-check` + `lint` + `build` pass; Lighthouse mobile ≥ 90.

➡️ **Next:** [GUIDE 04 — Ambient Breath, Audio & Data](GUIDE-04-AMBIENT-AUDIO-DATA.md) — keep the whole world alive + wire RSVP/Wishes/Gift + the Closing echo.
