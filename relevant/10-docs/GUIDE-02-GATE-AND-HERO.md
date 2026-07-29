# GUIDE 02 — THE GATE & THE LIVING WORLD

> **Act 0 (The Ritual) + Act 1 (The Living World).** The guest doesn't open a website — they open an invitation, then step into a meadow that breathes.
> **Prerequisite:** [GUIDE 01](GUIDE-01-FAL-ASSET-ENGINE.md) is complete. All `assets/video/*.mp4` + posters exist. `npm run dev` shows zero 404s.

> ## ⭐ THE MASTER VISUAL ANCHOR — `nikah-web/scenes/hero-main.webp`
> **This image is THE design; the hero IS this image, brought to life.** The whole site adjusts to it (see [GUIDE 01 → Master Visual Anchor](GUIDE-01-FAL-ASSET-ENGINE.md#-the-master-visual-anchor--nikah-webscenes-hero-mainwebp)). Open it before building the hero and match it exactly: bride in cream/ivory + beige hijab (left) holding a ragdoll with a white kitten on her shoulder; groom in deep navy (right) holding a tuxedo cat with a black cat on his shoulder; three more cats (orange-white, gray tabby, brown tabby) in the foreground grass; doves + butterflies above; blush/white/yellow/lavender wildflowers on spring-green; soft morning light. When anything is ambiguous, **the master wins.**

This guide builds on code **that already exists** in the repo — do not reinvent it:
- `components/sections/Gate.tsx` — opening storybook gate (Motion + AnimatePresence). ✅ scaffolded.
- `components/hero/Hero.tsx`, `heroLayout.ts`, `Doves.tsx`, `Butterflies.tsx` — hero shell + layer config. ✅ scaffolded (`heroLayout` positions are placeholders to calibrate).
- `components/primitives/VideoLayer.tsx` + `components/motion/useVideoLayer.ts` — the fal video primitive (autoplay/loop/muted/playsInline, pauses off-screen, tier-gated). ✅ done.
- `components/motion/{MotionProvider,useGyro,useParallax,useReveal,Particles,Lenis}` — motion engine. ✅ scaffolded.
- `lib/motionTokens.ts` + `lib/motionAdapter.ts` — **every** easing/duration/amplitude comes from here. No magic numbers.
- `lib/{config,guest,tier}.ts` — site data, guest-name decode, tier detection.

**Animation ownership (from `AGENTS.md` / `docs/11 §12`) — respect it exactly:**
| Concern | Owner |
| :-- | :-- |
| Character breathing / ear-twitch / tail-sway | **fal.ai video** (never duplicated) |
| Gate enter/exit, gate→hero swap, character micro-entrance, float fallback | **Motion** (`motion/react`) |
| Hero master assemble timeline, scroll/tilt parallax, doves/butterflies MotionPath, particle canvas | **GSAP** |
| Corner florals, drapery ripple | **CSS @keyframes** |

---

## PART A — THE GATE (Act 0)

### A.1 What the guest experiences
A soft ivory storybook page (not a dark envelope). Centered: "The Wedding of / **Bashara & Hanifah**", the guest's name decoded from `?to=`, a gentle invitation line, and one breathing button: **"Buka Undangan."** No loading bar, no skip. Cats are **not** shown here — they're saved for the hero reveal (`docs/02 §1`, `docs/10 §2`).

On tap, in this exact order (already wired in `Gate.tsx handleOpen`):
1. **Request iOS gyro permission** (`DeviceOrientationEvent.requestPermission()` — must be inside the tap gesture).
2. **Start + fade in audio** La Vie en Rose 0 → `siteConfig.audio.fadeTarget` over `audio.fadeInMs` (GSAP fade).
3. **Flip `open` → `AnimatePresence`** exits the gate (page-turn) and the Hero assembles below.

### A.2 What to finish on the Gate
The scaffold is solid. Bring it to final:
- **Loading screen (1–2s) before the gate** (`docs/02 §0`, `docs/10 §1`): a small `illustrations/loading-motif.png` (sleeping cat in a wreath), GSAP wreath rotate ±6° 3s yoyo + the hashtag `#BASHicallyHANI's`, then crossfade (400ms) into the Gate. Use a `sessionStorage` flag so a refresh skips straight to the gate.
- **Decorate the frame with the real floral asset.** Replace the plain `border-blush/40` rectangle with `florals/floral-border-full.png` (or `floral-corner-tl/br.png`) as an asymmetric frame, gently CSS-swaying (`Sway` primitive, ±0.8°). Keep `layoutId="gate-border"` so it animates into the hero page-turn.
- **Audio element.** Ensure a single `<audio className="site-audio" loop preload="none">` with `src={siteConfig.audio.src}` lives in `app/layout.tsx` (or an `AudioManager`, see GUIDE 04) so `Gate` can find it via `document.querySelector("audio.site-audio")`. (GUIDE 04 owns the persistent toggle; the Gate only kicks off playback.)
- **Guest name** already decoded via `guestNameFromSearchParams`. Confirm fallback = "Bapak/Ibu/Saudara/i" and that names with `+`/`-`/`%20` decode cleanly.
- **Reduced-motion:** the scaffold already branches on `tier === "REDUCED"` to skip variants. Keep every new flourish behind that check.

### A.3 The gate → hero handoff
The page-turn is a Motion `AnimatePresence` exit (gate scales to 1.04 + fades), and the moment it begins, the Hero's **GSAP assemble timeline** starts. Coordinate via a shared state in `app/page.tsx`:

```tsx
// app/page.tsx (sketch) — single source of "has the invitation been opened"
"use client";
const [opened, setOpened] = useState(false);
// Gate calls onOpen() in handleOpen step 3 instead of its own setOpen,
// OR keep Gate self-contained and lift the flag via context.
return (
  <>
    <Gate onOpened={() => setOpened(true)} />
    <Hero start={opened} />   {/* Hero assemble fires when start flips true */}
    {/* …rest of sections… */}
  </>
);
```

> ### 🔀 DECISION — coordination mechanism
> Either (a) lift an `opened` boolean into `app/page.tsx` and pass `start` to `Hero`, or (b) add a tiny `useInvitation()` context. Pick (a) for simplicity unless other sections also need the flag. Whatever you choose, the hero **must not autoplay its assemble before the gate is tapped** — otherwise the reveal is wasted behind the gate.

---

## PART B — THE LIVING WORLD / HERO (Act 1)

### B.0 The hero IS the master, brought to life (PRIMARY approach — read first)
The hero must look **exactly** like `scenes/hero-main.webp`, because it *is* that image. The most faithful, most robust way to achieve that — and the one that sidesteps the MP4-alpha problem (GUIDE 01 §5) — is:

**Animate the master as ONE cohesive living video.** `hero-bg-loop.mp4` (generated in GUIDE 01 directly from `scenes/hero-main.webp`, with the cohesive "whole scene breathes" prompt) is the hero: the couple breathe, the cats' ears/tails flick, the meadow sways, clouds drift — all in the exact master composition. Render it full-bleed through `<VideoLayer src="/assets/video/hero-bg-loop.mp4" poster="/assets/scenes/hero-main.webp">`, then layer **only additive ambience over it**: GSAP doves + butterflies + petal canvas, a gentle Ken-Burns (`scale 1.06→1.00`), tilt/scroll parallax on the whole frame, and the text reveal. The poster is the master itself, so even on LOW/REDUCED the hero is pixel-identical to the design, just still.

> ### 🔀 DECISION — cohesive master video vs. reconstructed layer stack
> **Default to the cohesive approach above.** It guarantees the hero matches the master, it's lighter (one opaque video), and it avoids per-cutout blending seams (the project already tried separate cutouts and they looked disjointed — see project memory "HERO REDESIGN").
> Build the **reconstructed layer stack in B.1–B.4 only if** you deliberately want deeper per-layer parallax *and* your GUIDE 01 Path A group videos blend seamlessly onto the master background. If you do, every layer's position/scale/character must still reproduce `hero-main.webp` exactly. **Never let the reconstructed hero drift from the master.** When in doubt, ship the cohesive version.

The text overlay (B.7), the gate→hero handoff (A.3), tilt/scroll parallax (B.5), doves/butterflies/petals (B.6), and tier behavior (B.8) apply to **both** approaches.

### B.1 The layer stack (back → front) — *the optional reconstructed approach*
This is the signature "wow." Every layer is a fal.ai **video** (alive on its own) or a sprite/particle, positioned to match the master composition `scenes/hero-main.webp`. The keys already exist in `components/hero/heroLayout.ts`:

| z / depth | Layer (`HeroLayerKey`) | Asset | Motion source |
| :-: | :-- | :-- | :-- |
| 0 | `sky` | `video/hero-bg-loop.mp4` (poster `scenes/hero-bg.webp`) | **fal video** (meadow breathes, petals drift) |
| 1 | `meadow` | `video/meadow-bottom-loop.mp4` | **fal video** (wildflowers sway) |
| 2 | `couple` | `video/couple-idle.mp4` (poster `couple/couple-cutout.png`) | **fal video** + GSAP entrance |
| 3 | `cats` | `video/cats-hero-group-idle.mp4` (+ individual `cats/cat-*.png` sprites) | **fal video** group + Motion micro-float sprites |
| 4 | `floralCorners` | `florals/floral-corner-tl.png` / `-br.png` | **CSS @keyframes** sway |
| 5 | `doves` | `florals/accent-doves.png` | **GSAP** MotionPath |
| 5 | `butterflies` | `florals/accent-butterflies.png` | **GSAP** bezier + wing flutter |
| 5 | particles | canvas petals | **GSAP** RAF |
| top | `text` | "We are getting married" · names · `22 · 08 · 2026` | Motion fade reveal, last |

Each video layer renders through the existing `<VideoLayer>` primitive (handles autoplay/loop/muted/playsInline, off-screen pause, and LOW/REDUCED poster fallback automatically). Per layer: `position:absolute; object-fit:cover;` GSAP controls only `translate3d` (parallax) + `opacity` (entrance/exit) — **never** the video's internal motion.

### B.2 Calibrate `heroLayout.ts`
The `x/y/width/height` values in `heroLayout.ts` are placeholders. **Open `scenes/hero-main.webp` and set each layer's % box to match where that element sits in the reference.** This is yours to calibrate by eye against the actual generated frames. Keep `depth` (drives `useParallax` amplitude via `parallax.factorByTier`) and `entry` (assemble offset) as-is unless the timeline below changes.

Also reconcile the asset choice you made in GUIDE 01 §5:
- If you took **Path A**, `couple`, `cats` (group), and `sky/meadow` point at real MP4s; individual cats are sprites you add as extra layers.
- If you took **Path C** (no character video), set `couple`/`cats` `src:""` and render the poster PNG with a `MotionFloat` wrapper instead. `VideoLayer` already shows the poster when there's no playable video on LOW/REDUCED — extend `Hero.tsx` to render a `MotionFloat`+`next/image` branch when `src` is empty.

### B.3 The ASSEMBLE timeline (GSAP)
From `docs/09 §2`. Total ≈ `dur.assemble` (1.5s). Videos already `autoPlay`; GSAP only reveals each layer's opacity + y. Build it in `Hero.tsx`, gated on `start` (B.A.3) and tier:

```
t=0.00  sky:     opacity 0→1, scale 1.06→1.00            (dur.enter, ease.enter)
t=0.15  meadow:  opacity 0→1, y +20→0                    (overlap -=0.85)
t=0.45  couple:  opacity 0→1, y +40→0, scale .96→1       (ease.settle)
t=0.70  cats:    stagger.base — opacity + y +30→0 + scale .9→1  (held → on-ground order)
t=1.05  floralCorners: opacity 0→1, scale 1.08→1 from the edges
t=1.20  doves:   MotionPath loop starts
t=1.25  butterflies: fade + flutter starts
t=1.30  particles: system activates
t=1.35  text:    per-line, opacity + y +12→0, stagger.base
t≈1.8   → STATE ALIVE. Remove will-change. Hand off to parallax only.
```

Pull every value from tokens: `gsapVars("enter")`, `gsapVars("enter","settle")`, `stagger.base`, `move.reveal`. **No literal eases or durations.** On `tier === "REDUCED"`, skip the timeline entirely — set everything to its final state (poster visible, opacity 1) instantly. On `LOW`, show `scenes/hero-main.webp` full poster + a quick fade (no per-layer video, no parallax), per `docs/09 §6`.

### B.4 STATE ALIVE — idle (do NOT duplicate fal motion)
After assemble, fal videos own all breathing. GSAP adds only depth:

| Layer | fal video already does | GSAP adds |
| :-- | :-- | :-- |
| sky | clouds drift, petals fall | `translateY` parallax factor 0.02 |
| meadow | wildflowers sway | parallax 0.06 |
| couple | breathe, hair move | parallax 0.12 — **no extra breathing** |
| cats | ear-twitch, tail-sway, blink | parallax 0.20–0.32 (random per cat) + a "settle-shift" ±1–2px every 8–14s |
| floral corners | — | CSS rotate ±1.2° pivot base |
| doves/butterflies/petals | — | GSAP MotionPath / canvas |

> **Hard rule (`README.md`, `docs/09 §3`):** never add GSAP/Motion breathing on top of a fal video character — duplication makes motion stutter. Sprites (PNG cats) get a *tiny* `MotionFloat` only because they have no video.

### B.5 Parallax — tilt + scroll (use existing hooks)
`components/motion/useParallax.ts` already merges scroll (ScrollTrigger) + gyro into a `translate3d` per layer via the layer's `depth` → `parallax.factorByTier`. Wire each hero layer's ref into it.
- **Scroll:** Lenis smooth (lerp ≈ 0.09, set in `Lenis.tsx`) → `ScrollTrigger.update`. Far layers move slow, near layers fast → the scene "opens up" as the guest scrolls.
- **Tilt:** `useGyro()` returns lerp-smoothed gamma/beta (`parallax.smoothing = 0.08`). `tiltFactor = 0.6 × scroll factor`. Permission was granted at the gate tap. If denied/`REDUCED`/`LOW` → gyro returns zero and a gentle CSS auto-drift sinus stands in.
- **Hero exit:** as the next section scrolls in, hero group `opacity 1→0` across 0–60% of that scroll; **text fades first, sky last** (`docs/09 §4`).
- One global RAF for parallax + particles (`docs/11 §9`). All `transform`/`opacity` only — never `top/left/width/height`.

### B.6 Doves, butterflies, particles
- **Doves** (`components/hero/Doves.tsx`): GSAP `MotionPathPlugin` bezier left→right, 12–16s, `ease.float`; randomize Y offset + duration ±15% each pass. 1–2 birds. Count via `tierBudget(tier).doves`.
- **Butterflies** (`Butterflies.tsx`): short bezier near the florals + wing-flutter `scaleX 1↔0.82` every ~180ms. Count via `tierBudget(tier).butterflies`.
- **Petals** (`components/motion/Particles.tsx`): single `<canvas>`, one RAF, particle type `{x,y,vx,vy,size,rot,vrot,swayPhase,opacity}`; fall `vy 8–20px/s`, sway `sin(t*0.5+phase)`, slow spin, recycle at top. Count via `tierBudget(tier).petals` (14 HIGH / 6 MID / 0 LOW/REDUCED). Pause on `visibilitychange` + when off-screen. Colors: blush / cream / soft peach (the Japan section later overrides to sakura pink — GUIDE 03).

### B.7 Hero text
Overlay, revealed last. Copy from `docs/03 §2`:
> We are getting married — **Bashara Aina** & **Hanifah Syifa Azzahra Bay** — `22 · 08 · 2026`

Serif display (Cormorant Garamond), `text-wrap: balance`, names get the optional script accent (sparingly). Motion per-line stagger (`stagger.base`, y +12→0). A **scroll hint** chevron fades in after ~3s of no scroll and vanishes on first scroll (detail in GUIDE 05).

### B.8 Tier behavior (the whole hero)
| Tier | Hero |
| :-- | :-- |
| HIGH | all video layers + assemble + scroll parallax + tilt + doves/butterflies/petals |
| MID | all video layers + assemble + scroll parallax (no tilt), fewer doves/petals |
| LOW | static `hero-main.webp` poster + quick fade. No video, no parallax. |
| REDUCED | static poster, no animation at all |

Drive all of this from `useMotion().tier` + `tierBudget(tier)`. Never read media queries ad-hoc in components — the provider is the single source.

---

## C. Acceptance criteria (Gate + Hero)
- [ ] Loading (1–2s) → Gate, with `sessionStorage` skip on refresh.
- [ ] Guest name from `?to=` renders; safe fallback when absent.
- [ ] Tap "Buka Undangan" → gyro prompt (iOS) → audio fades in → page-turn → hero assembles, **no dead frame**.
- [ ] Hero reads as one living painting; every video layer breathes; no two cats move in sync.
- [ ] Tilting the phone shifts layers like a diorama (HIGH/MID); scroll opens the scene.
- [ ] No GSAP/Motion breathing duplicated over fal video characters.
- [ ] LOW/REDUCED show the poster, never blank, never janky.
- [ ] `npm run type-check` + `npm run lint` + `npm run build` pass. Hero LCP < 2.5s on throttled 3G; hero transfer < 800 KB.

➡️ **Next:** [GUIDE 03 — Scroll Story & Sections](GUIDE-03-SCROLL-STORY-SECTIONS.md) — the love story unfolds under the thumb.
