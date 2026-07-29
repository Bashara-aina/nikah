# 03 — Hero + Gate Living Experience

**Role:** L0–L3 ritual and living hero — assembly, motion ownership, tiers, golden checks  
**Date:** 2026-07-18  
**Supersedes:** `10-docs/stitch/phase1/03-STATIC-VIDEO-MOTION-MAP.md` (L0–L3 parts); actionable build order in `GUIDE-02-GATE-AND-HERO.md`  
**Prerequisite:** [02 Asset remediation](./02-ASSET-READINESS-AND-REMEDIATION.md) P0 promote at least: `hero-main`, video+poster, loading cat, gate frames, audio  
**Next:** [04 Scroll sections](./04-SCROLL-STORY-AND-SECTIONS.md)  
**Canon:** `stitch/07-MOTION-AND-CHOREOGRAPHY.md`, `09-hero-choreography.md`, `REF-01` tokens, `lib/motionTokens.ts` / `motionAdapter.ts` (no magic numbers)

---

## 1. What the guest experiences (L0→L3)

```
L0 Envelope (CSS/SVG)  →  L1 Loading (sleeping cat)  →  L2 Gate (storybook cover)
  →  tap “Buka Undangan”  →  L3 Hero (living meadow video)
```

Emotional job: *ritual opening → enter a living illustrated world.*  
Master law: **`scenes/hero-main.webp`** (`relevant/01-hero-scenes-video/hero-main.webp`) **is the design.** The video must look like that painting brought to life.

Design language: ivory `#FBF7F0`, watercolor storybook, *hidup bukan kaku* — breathe, don’t perform. No gold-filigree kitsch; envelope is a quiet paper prologue, not a stock “Kepada Yth.” template.

---

## 2. Assets that assemble the opening

| Layer | Asset (after promote) | Source keeper | Role |
|-------|----------------------|---------------|------|
| L0 | Inline SVG/CSS | — | Seal pulse + unfold; unlocks audio/gyro |
| L1 | `illustrations/loading-sleeping-cat.webp` | `05/loading-sleeping-cat.webp` | 1–2s calm beat |
| L2 | `illustrations/gate-monogram-frame.webp` | `05/gate-monogram-frame.webp` | Wreath; monogram in **type** inside |
| L2 | `illustrations/gate-floral-border.webp` | `05/gate-floral-border.webp` | Edge florals; CSS sway |
| L3 | `video/hero-bg-loop.mp4` | `01/hero-bg-loop.mp4` (~244 KB, 1080×1350, ~5s) | **Only launch video** |
| L3 | `video/hero-bg-loop-poster.jpg` or `scenes/hero-main.webp` | `01/…` | LCP / LOW / REDUCED |
| L3 | `scenes/hero-main.webp` | `01/hero-main.webp` | Poster + GG-Hero reference |
| Optional | `couple/couple-cutout.png` | `03/couple-cutoutt.png`→renamed | Phase 2 layering only — **not required** for L3 v1 |
| Optional | `scenes/meadow-bg.webp` | compressed `hero-bg.webp` | Connective wash elsewhere — **never** replaces L3 video |
| Audio | `audio/la-vie-en-rose.mp3` | `09/audio/…` | Starts on gate/envelope tap |

**Do not use at L3:** `hero-tall-portrait.webp` as a substitute for the master (coherence risk if shown beside hero-main). Video + master poster own the hero.

---

## 3. Motion ownership (locked)

| Owner | Owns | Must not |
|-------|------|----------|
| **fal video** (already generated) | Character/scene breathing inside `hero-bg-loop.mp4` | Be duplicated by GSAP “breathing” on the `<video>` |
| **Motion** | Gate enter/exit, envelope open, poster→video crossfade, text entrance | Layout property animation |
| **GSAP** | Audio fade-in, optional text scroll-out parallax, ambient petals/doves **above** video | Transform the video content itself |
| **CSS** | Seal pulse, loading cat breath scale, gate floral sway ±1.2° | Long choreography that belongs in Motion/GSAP |

**Breathing-on-video ban:** No animated `transform`/`filter` on `<video>` or a wrapper that moves the painted characters. Static grade filter once is OK:

```css
filter: brightness(0.95) saturate(1.1) sepia(0.08);
```

Allowed above video: `[data-hero-text]`, `[data-hero-vignette]`, DOM petals/doves, scroll hint.

All durations/eases from `lib/motionTokens.ts` via `lib/motionAdapter.ts`.

---

## 4. Per-layer build checklist

### L0 — Envelope (recommended Phase 1)

**Owner:** Cursor agent · **Assets:** none  

- [ ] Full-viewport ivory; portrait envelope SVG/CSS (flap, seal “B&H”, thin botanical lines)
- [ ] Tap cue: “Sentuh untuk membuka” (or locked copy from `03-copywriting.md`)
- [ ] On tap: seal crack → unfold → audio 0→~30% · iOS gyro permission inside gesture · `sessionStorage` flag
- [ ] REDUCED: skip animation; instant handoff; audio still unlocked by gesture
- [ ] **No couple names / wedding title on L0** (masterplan) — those belong on L2

*If couple rejects envelope as kitsch:* collapse L0 into L2 Gate as the single unlock gesture — document the decision in plan 01 Q2. Do not invent a third ritual.

### L1 — Loading

- [ ] Center `loading-sleeping-cat.webp` (~60vw, max ~320px) on ivory
- [ ] CSS breath `scale 1↔1.02`, ~3s yoyo (HIGH/MID); static on LOW/REDUCED
- [ ] 1–2s then crossfade to Gate; skip on refresh via sessionStorage if gate already opened
- [ ] Fallback: ivory + text only

### L2 — Gate (storybook cover)

- [ ] Guest name from `?to=` (decode carefully); fallback greeting if absent — never broken UI
- [ ] Wreath + typographic monogram (amber `#C8922A` — sparse, not filigree flood)
- [ ] Floral border at edges; CSS sway HIGH/MID
- [ ] CTA “Buka Undangan” ≥44×44; ripple on tap (plan 05)
- [ ] AnimatePresence exit → Hero assemble; Gate **unmounts** (not `display:none`)
- [ ] Fallback: drop border → wreath+type → type+rules

### L3 — Hero (living illustration)

- [ ] Full-bleed `VideoLayer` / `useVideoLayer`: `autoplay muted loop playsInline`
- [ ] Poster = master (or dedicated poster jpg) — paints first for LCP
- [ ] Text only in **sky band (~top 18%)** or bottom vignette — never over faces/cats
- [ ] Names + date from locked copy; scroll hint after ~3s idle
- [ ] Scroll-out: fade/parallax **text**, not video jitter
- [ ] LOW / Save-Data / slow network: poster still + fade — must look intentional (GG-Hero still holds)

---

## 5. Performance tiers (opening)

| Layer | HIGH | MID | LOW | REDUCED |
|-------|------|-----|-----|---------|
| L0 | Full open + seal pulse | Same | Same | Instant open |
| L1 | Breathing cat | Breathing cat | Static | Static |
| L2 | Frame sway + entrance | Entrance | Static | Static |
| L3 | **Video** + text choreography | Video, simpler text | **Poster** | Poster, no motion |

Tier via `MotionProvider` / `useMotion()` / `tierBudget()` — law in `AGENTS.md`.

**Hero path budget:** video already ~244 KB. Keep total hero-path transfer **<800 KB** (poster + CSS + fonts considered). Do not load `meadow-bg` or story chapters on first paint.

---

## 6. Golden gate checks (opening)

| ID | Check | How |
|----|-------|-----|
| GG-Hero | First painted frame ≈ `hero-main.webp` | Side-by-side screenshot, human |
| GG-Seam | Loop seam invisible | Watch 3+ loops on device |
| GG-Swap | Poster→video crossfade: no flash, no CLS | Throttled 3G DevTools |
| GG-Audio | Tap unlocks La Vie en Rose ≤1.2s fade | iPhone Safari + Android Chrome |
| GG-Gyro | Permission requested **inside** tap gesture (iOS) | Real iPhone |
| GG-Reduced | OS reduced-motion: usable, no positional motion | System setting on |
| GG-Breath | Code review: no transform animation on `<video>` | PR checklist |

---

## 7. Component / file contracts (extend, don’t reinvent)

From `REF-02` + existing scaffold (when `nikah-web` restored):

| Piece | Status intent |
|-------|---------------|
| `components/sections/Gate.tsx` | Extend |
| `components/sections/Loading.tsx` | Create |
| `components/sections/Envelope.tsx` | Create if L0 kept |
| `components/hero/*` + `VideoLayer` / `useVideoLayer` | Calibrate to master; wire real video path |
| `AmbientLayer` / `AudioManager` | Shell early so later sections inherit |
| `page.tsx` phase state | `'envelope' \| 'loading' \| 'gate' \| 'opened'` |

Assembly order after open: Hero → Welcome → … (plan 04).

---

## 8. Delta from old plans

| Old (`phase1/03` / GUIDE-02) | Now |
|------------------------------|-----|
| Hero video “to generate” from fal | **Already exists** and ships — do not regenerate unless GG-Hero fails |
| Gate border must re-render ≥1080w | Keeper border **already fine** |
| Closing loop stretch tied tightly here | Still optional; primary closing asset changed (plan 04) |
| Multi-layer cat video / Path A sprites for launch | **Defer** — cohesive single loop is law |
| Assume missing loading/gate art | **Present** in `relevant/05/` after compress |

---

## 9. Open questions (human)

1. Keep L0 envelope, or gate-as-unlock only?
2. Music level after L3: stay ~30% or duck to ~15%?
3. REDUCED: auto-fade audio on unlock, or silent until toggle?

---

## 10. Done when

- [ ] L0–L3 play on real phone without layout jump
- [ ] GG-Hero + GG-Weight path pass
- [ ] Audio + gyro unlock on first intentional tap
- [ ] All four tiers degrade without blank screens
- [ ] No dependency on dead `correct/` assets or ungenerated fal jobs

**Next owner:** Cursor agent implements L0–L3; human runs GG-Hero. Then [plan 04](./04-SCROLL-STORY-AND-SECTIONS.md).
