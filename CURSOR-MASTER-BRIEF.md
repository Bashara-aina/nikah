# CURSOR MASTER BRIEF — Wedding Invitation Website
## "Buka Buku": A Living Storybook Wedding Invitation

**To Cursor:** This is the single source of truth for the entire website direction.
Your job after reading this is to produce **5 deep implementation MD files**, one per idea-layer.
Each file must be production-ready: file structure, component names, code patterns, logic, config shapes.
Do not ask clarifying questions. All direction is here. Build with confidence.

---

## 0. Project DNA (read this before anything else)

This is a **mobile-first, phone-portrait wedding invitation** — a one-page storybook that opens like a fairy tale.
The guest's emotional journey: *ritual opening → enter a living illustrated world → scroll through a love story → feel the warmth → RSVP*.

**Three words that govern every decision:** intimate · romantic · playful (cats).

**Five non-negotiables:**
1. Phone portrait (375px) is the primary design target. Desktop is secondary.
2. Every asset breathes. Nothing is ever completely still.
3. No two elements animate in sync. All phases and durations are randomized per element.
4. La Vie en Rose plays softly as the heartbeat of the entire experience, triggered by the first gate interaction.
5. All motion uses only `transform` and `opacity` — never layout properties. GPU-only animation.

**Performance tiers** (detect once at load, stored in `MotionProvider`):
- `HIGH` — full experience
- `MID` — reduced particles, no blur, limited loops
- `LOW` — hero fade only, no tilt, minimal animation
- `REDUCED` — `prefers-reduced-motion` detected → opacity fades only, zero positional motion

**Palette (immutable):**
- Ivory / Cream — dominant backgrounds
- Blush pink — soft accent
- Dusty pink — secondary accent
- Soft peach — warm highlight (morning light)
- Sage green — botanical support
- White drapery — dividers and overlays
- Soft charcoal/taupe — all text (never pure black)

**Typography:**
- Headings: elegant serif
- Body: clean premium sans-serif
- One optional script accent for names/hashtag only

---

## 1. THE 5 IDEAS — Overview

The 5 ideas are not separate features. They are **5 sequential acts of one guest experience**:

```
ACT 0 — RITUAL     → The Envelope (Idea 4)       — gate & opening ceremony
ACT 1 — THE WORLD  → The Living Hero (Idea 1+3)  — unified scene + gyroscope diorama
ACT 2 — THE STORY  → Scroll as Narrative (Idea 2) — scroll drives story forward
ACT 3 — THE BREATH → Ambient Layer (Idea 5)       — CSS micro-motion through all sections
ACT 4 — THE SOUL   → Micro-moments (Idea 5 deep) — delight interactions everywhere
```

Each act hands off to the next without a dead frame.
The acts map directly to the 5 implementation files Cursor must produce.

---

## ACT 0 — THE RITUAL (Implementation File 1)
### "The guest doesn't open a website. They open an invitation."

**What happens:**
The site loads to a dark cream screen. Center screen: a hand-illustrated wax-sealed envelope in portrait orientation, perfectly fitted to the phone viewport. This is an *illustrated* envelope — styled to match the storybook aesthetic (ivory/blush palette, delicate botanical details at the edges, a warm wax seal glowing softly).

A subtle pulse animation on the seal. Below it: a soft prompt in elegant serif — the guest's name (personalized via URL param), and a gentle tap cue. No skip button. No loading bar. This IS the experience.

**On tap:**
1. The wax seal cracks open with a micro-animation (scale + rotate + opacity)
2. La Vie en Rose begins — volume fades from 0 to ~0.5 over 1.2s
3. The envelope unfolds via CSS clip-path animation (flap lifts, sides fold back)
4. Warm morning light spills through from behind — a soft radial gradient bloom
5. The hero scene (ACT 1) fades in from inside the opening envelope
6. Gate unmounts cleanly — no flash, no jump

**Technical requirements:**
- Guest name extracted from URL query param `?to=NamaUndangan` — displayed in the greeting
- If no param: show a generic greeting, not broken UI
- iOS 13+ gyroscope permission requested exactly HERE at tap (not later)
- Audio context unlocked HERE (gesture requirement)
- Gate component unmounts after transition completes — not hidden, fully removed from DOM
- One `sessionStorage` flag: gate shown → skip on refresh
- All envelope animation: pure CSS `clip-path` + `transform` + `opacity` (no canvas, no video needed here)
- Mobile-only: envelope is full viewport height. On desktop: envelope is centered card with backdrop

**Envelope visual spec (for Cursor to implement as CSS/SVG):**
- Shape: portrait rectangle with a triangular fold flap at top
- Decorative elements: thin botanical line art at bottom corners (SVG inline)
- Wax seal: circular SVG with monogram initials, warm amber color (#C8922A or similar warm gold)
- Texture: subtle paper grain via CSS `background-image` noise pattern
- Color: ivory body (#FBF7F0), dusty blush flap inner face (#F3D9D6)
- The whole envelope sits centered with soft shadow beneath it

**Component structure Cursor should produce for this file:**
```
GateScreen/
  index.tsx          — main gate component, manages transition state
  Envelope.tsx       — the visual envelope (CSS + SVG)
  WaxSeal.tsx        — animated seal with monogram
  useGateTransition.ts — transition logic + audio unlock + gyro permission
  gate.css           — all envelope animations (clip-path, flap open, light bloom)
```

---

## ACT 1 — THE LIVING WORLD (Implementation File 2)
### "The hero is a paper diorama the guest holds in their hand."

**What this is:**
The hero section is a layered parallax scene. Every visible element is its own CSS layer, positioned absolutely. The whole scene reads as one unified painting — same morning light, same color temperature, same illustrated style — but each element moves independently based on its depth.

**The layer stack (back to front):**
| z-index | Layer type | Depth tier | Parallax factor | Motion |
|---------|-----------|-----------|----------------|--------|
| 0 | Sky / background scene | 0 | 0.02 | Cloud drift, light pulse |
| 1 | Ground / meadow | 1 | 0.06 | Subtle sway |
| 2 | Couple (main subjects) | 2 | 0.12 | Breathing, gentle sway together |
| 3 | Cats (multiple, independent) | 3 | 0.20–0.32 (each different) | Each breathes with unique phase/duration |
| 4 | Foreground florals + corners | 4 | 0.50 | Sway, rotate at base pivot |
| 5 | Particles: petals, doves, butterflies | 5 | 0.70–0.90 | Full ambient motion |
| top | Text overlay: names, date, hashtag | — | — | Reveals last in assemble |

**Asset type guidance (no hardcoded filenames — Cursor reads from `/public/assets/` at build time):**
- Background scene: opaque WebP landscape, sky dominant, morning light
- Ground/meadow: part of background or separate opaque layer
- Couple: transparent PNG, trimmed to bounds, centered composition, no drop shadow baked in
- Cats: transparent PNGs, trimmed, each positioned independently per `heroLayout` config
- Florals: transparent PNGs, trimmed, positioned at corners and edges
- Particles: generated procedurally via canvas, NOT image files

**`heroLayout` config shape** (Cursor must define this):
```typescript
// heroLayout.config.ts
interface LayerConfig {
  id: string            // matches filename slug
  type: 'bg' | 'couple' | 'cat' | 'floral' | 'particle'
  depthTier: 0 | 1 | 2 | 3 | 4 | 5
  position: { x: string, y: string }  // % relative to container
  size: { w: string, h: string }       // % or px
  parallaxFactor: number
  breathingPhase: number               // radians, randomized per element
  breathingDuration: number            // ms, 4000–7000 range
  assembleDelay: number                // ms offset in assemble timeline
}
```

**ASSEMBLE sequence** (GSAP timeline, triggered by gate transition):
```
t=0.00  Background sky: opacity 0→1, scale 1.06→1.00 (dur 1000ms, ease.enter)
t=150   Ground: opacity 0→1, y +20→0 (dur 900ms)
t=450   Couple: opacity 0→1, y +40→0, scale 0.96→1 (dur 800ms, ease.settle)
t=700   Cats: stagger 100ms each, opacity 0→1, y +30→0, scale 0.9→1 (ease.settle)
         Order: cats held in arms first → cats on ground last
t=1050  Foreground florals: opacity 0→1, scale 1.08→1, from respective corners
t=1200  Doves begin MotionPath flight from left edge
t=1250  Butterflies appear and begin bezier drift
t=1300  Particle system activates
t=1350  Text lines: stagger 80ms, opacity 0→1, y +12→0
t≈1700  → HAND OFF to STATE ALIVE. Remove will-change.
```

**STATE ALIVE** (idle loops, run indefinitely while hero is in viewport):
- Background sky: translateX 0→-2%, 30s yoyo loop (cloud drift illusion)
- Couple: translateY ±3px + scale 1→1.012, 6s sine loop
- Each cat: unique phase + duration (4000–7000ms random per cat), translateY ±2–4px + scale 1→1.01
  - Occasional "settle shift": random translateX 1–2px every 6–12s
  - Subtle "glance": rotate ±0.8° once every ~15s
- Foreground florals: rotate ±1.2° around bottom-center pivot, 7s, different phase per corner
- Doves: MotionPath bezier loop 12–16s, slight Y and duration randomization per pass
- Butterflies: short bezier paths near florals, wing-flutter scaleX 1↔0.82 every 180ms
- Particle canvas: 8–14 petals falling (HIGH tier), sway sinus, spin slow, recycle at top

**GYROSCOPE PARALLAX** (phone-first feature):
```typescript
// Logic flow:
// 1. Permission was already requested at gate tap (ACT 0)
// 2. On DeviceOrientationEvent: extract gamma (X tilt, −20..20°) and beta (Y tilt)
// 3. Clamp to ±20°, normalize to −1..1
// 4. Lerp current offset → target offset (smoothing factor: 0.08) — prevents shaking
// 5. Apply: translateX = normalizedGamma * parallax.max * layer.parallaxFactor
//            translateY = normalizedBeta  * parallax.max * layer.parallaxFactor * 0.6
// 6. Use requestAnimationFrame, not event handler directly
// Fallback (no sensor / denied): CSS auto-drift — each layer does a slow sinus oscillation on its own
```

**SCROLL PARALLAX** (supplements gyro):
- Lenis smooth scroll (lerp ≈ 0.09) wraps the page
- ScrollTrigger maps hero scroll progress to layer offsets
- Layer far: moves slowly; layer near: moves faster
- Hero exit (scroll out): opacity 1→0 at 0–60% of next section scroll. Text fades first, sky last.
- Couple and cats rise slightly faster than background on scroll → scene "opens up" as user scrolls

**`HeroSection` component structure:**
```
HeroSection/
  index.tsx               — main hero, manages assemble + idle + parallax state
  HeroLayer.tsx           — generic layer wrapper (handles GPU transform, will-change)
  ParticleCanvas.tsx      — single RAF canvas for petals/pollen
  DovesPath.tsx           — GSAP MotionPath dove(s) animation
  ButterfliesPath.tsx     — butterflies bezier + wing flutter
  HeroText.tsx            — name/date/hashtag overlay with stagger reveal
  useGyroParallax.ts      — DeviceOrientation hook with lerp smoothing
  useScrollParallax.ts    — ScrollTrigger hook for hero layers
  heroLayout.config.ts    — all layer positions, depths, phases
```

---

## ACT 2 — THE STORY (Implementation File 3)
### "The guest's thumb is the narrator. Scrolling IS the storytelling."

**What this is:**
Below the hero, the page is structured as a series of narrative sections that unfold as the guest scrolls. The scroll is not navigation — it IS the story progression. Each section entrance is cinematic. Each illustration tells a chapter of the love story. The guest is reading a picture book with their thumb.

**Section sequence (the narrative arc):**
```
[HERO]          — The world (ACT 1)
[WELCOME]       — Guest's name greeted personally, soft welcome copy
[STORY CH.1]    — How they met — illustration + poetic copy (left/right alternating)
[STORY CH.2]    — How they grew — illustration + copy
[STORY CH.3]    — A special shared memory (e.g. travel/Japan moment) — illustration + copy
[EVENT]         — Wedding details — date, time, venue (two events if applicable)
[GALLERY]       — Scrapbook-style photo grid (real photos)
[RSVP]          — RSVP form
[WISHES]        — Guest wishes wall (live, prepend on submit)
[GIFT]          — Gift registry / bank info (tasteful, not transactional)
[CLOSING]       — Closing poem, hashtag, audio toggle, cat peek from bottom
```

**Scroll-driven mechanics:**

*Section entrance (every section):*
- IntersectionObserver triggers when section enters viewport at 20% threshold
- Illustration slides in from the side relevant to its narrative position (alternating left/right per chapter)
- Text fades in with y +24→0 after illustration settles
- Stagger: illustration first, then heading, then body copy lines (stagger.base)
- Easing: ease.enter for position, ease.settle for final "land"

*Story chapter transitions (special):*
- As Story CH.1 exits viewport scrolling UP, its illustration fades softly
- As CH.2 enters, its illustration slides in from opposite side
- This creates a "page turn" rhythm — left, right, left, right
- GSAP ScrollTrigger with `scrub: true` on the illustration translateX so it moves *with* the scroll at a subtle rate before settling

*Doves fly across section boundaries:*
- When scroll crosses a section boundary, a dove MotionPath animation triggers
- The dove flies from one section into the next — visual "thread" connecting chapters
- One dove per transition, not every scroll tick

*Scroll-frame technique (for ultra-smooth story feel):*
- On HIGH tier only: the hero-to-story transition uses a 40-frame PNG sequence extracted from the hero composition
- As guest scrolls from hero bottom into WELCOME section, the hero scene holds position while the frame sequence advances (scrub: true)
- The scene "transforms" into the illustrated storybook format
- Frame images: pre-generated, stored in `/public/assets/frames/`, loaded lazily
- On MID/LOW: simple crossfade hero → welcome illustration (no frame sequence)

**Section component pattern:**
```typescript
// Every story section uses this base pattern
interface StorySectionProps {
  chapter: number
  illustrationSrc: string
  illustrationSide: 'left' | 'right'
  heading: string
  body: string
  motionTier: MotionTier
}
// Cursor: build a StorySection component that handles entrance animation internally
// IntersectionObserver triggers entrance; ScrollTrigger adds scrub parallax on illustration
```

**Gallery section — scrapbook style:**
- Photos laid out in a CSS grid with randomized `rotate(±2–4deg)` per photo (set at render time, stable)
- Entrance: scatter-in (each photo slides in from a slightly different direction + rotate, stagger.loose)
- On tap/hover (HIGH): photo lifts (scale 1.04) and shadow deepens
- Lightbox: tap opens full photo with backdrop blur of the gallery background
- Photos are real uploaded images — no placeholders in production

**Event section:**
- Date displayed in large elegant serif — scale-in entrance (scale 0.8→1 + opacity, ease.settle)
- Venue block: arch-shaped frame around the venue name (CSS clip-path or border-radius trick)
- Map pin drops with bounce on entrance (ease.settle, y −40→0)
- Countdown timer: each digit animates independently on change (flip or slide)

**Component structure:**
```
sections/
  WelcomeSection/
  StorySection/         — reused for all 3 story chapters
  EventSection/
  GallerySection/
  RSVPSection/
  WishesSection/
  GiftSection/
  ClosingSection/
  shared/
    SectionWrapper.tsx  — entrance observer + tier-gated animation
    DividerDrapery.tsx  — animated drapery divider between sections
    useSectionEntrance.ts
```

---

## ACT 3 — THE BREATH (Implementation File 4)
### "The world never stops being alive. Every section is part of the same living world."

**What this is:**
A set of ambient systems that run persistently throughout the entire page — not just the hero. These systems are what make the experience feel like one continuous living world rather than a series of static sections. They cost almost nothing after the hero, because they use only CSS + one shared canvas + the audio that's already playing.

**System 1: The Persistent Particle Canvas**
- One `<canvas>` element fixed to the viewport, `pointer-events: none`, `z-index: 1` (behind text but above backgrounds)
- Particles: small illustrated petal sprites (blush / cream / soft peach), procedurally generated
- Behavior: spawn at top, drift down with sway (sine), slow spin, fade out near bottom, recycle
- Density: 12–14 (HIGH), 6 (MID), 0 (LOW/REDUCED)
- Section-specific override: in the Japan/travel story section, particle color shifts to soft sakura pink (+2 extra count)
- Implementation: single `requestAnimationFrame` loop, pause on `visibilitychange`, pause when canvas is off-screen

```typescript
// Particle type
type Particle = {
  x: number, y: number
  vx: number, vy: number       // velocity: vy 8–20px/s
  size: number                 // 6–16px
  rot: number, vrot: number    // rotation and rotation velocity
  swayPhase: number            // unique phase per particle
  opacity: number
  color: string                // from palette: blush / cream / peach
}
// Cursor: build this as a React hook (useParticles) + canvas component
// The hook manages the particle array and RAF; the component just binds the canvas ref
```

**System 2: CSS Micro-motion on All Illustrations**
- Every illustration PNG that is in the viewport gets a breathing loop
- Applied via CSS class `breathing-element` — Cursor to assign this class to all illustration `<img>` tags
- The CSS: `@keyframes breathing` with translateY ±3px + scale 1→1.01, `animation-duration` set via inline CSS variable per element (randomized at render time: 4000–7000ms)
- IntersectionObserver: add class when visible, remove when off-screen (saves CPU)
- Drapery dividers: `@keyframes drapery-ripple` — mask gradient shifts horizontally + scaleY micro (1→1.003)
- Floral accents in sections: same sway keyframes as hero florals, different phase

**System 3: Ambient Doves Between Sections**
- After the hero, 1–2 doves continue to fly across the page periodically (every ~20s)
- Not tied to any specific section — they float across whatever is visible
- Same MotionPath bezier technique as in ACT 1
- On MID: 1 dove, less frequent (every 40s). On LOW/REDUCED: disabled.

**System 4: Audio as the Heartbeat**
- La Vie en Rose loops throughout (started at gate tap)
- One persistent audio toggle button (sticky, top-right corner, subtle icon)
- Toggle button: breathing idle animation (scale 1→1.03 loop) — it also "breathes"
- Volume: 0.45–0.50, no autoplay without gesture (iOS compliant)
- On mute: visual icon switches, all micro-motion continues normally (audio is separate from animation)

**System 5: Scroll Progress Indicator**
- A thin line at the very top of the viewport (2px, blush/dusty pink)
- Grows from 0% to 100% width as guest scrolls from top to bottom
- `scaleX` transform from transform-origin left — pure CSS, no JS needed
- On LOW/REDUCED: hidden

**All ambient systems are managed by `AmbientLayer` wrapper component:**
```
AmbientLayer/
  index.tsx             — wraps entire page, manages all ambient systems
  ParticleCanvas.tsx    — (shared with hero, or separate instance below hero)
  AmbientDoves.tsx      — post-hero dove flyovers
  AudioControl.tsx      — persistent audio toggle
  ScrollProgress.tsx    — progress line
  useAmbientBreathing.ts — assigns random animation durations to all breathing elements
```

---

## ACT 4 — THE SOUL (Implementation File 5)
### "The small things. The moments guests will tell people about."

**What this is:**
Micro-interaction design for every interactive element. These require no additional assets. They are pure JS + CSS moments of delight that make the website feel handcrafted. Each one is small individually. Together, they are what separates a website from an experience.

**Catalog of all micro-interactions:**

**Gate button "Open Invitation":**
- Idle: breathing scale 1→1.03 loop (inviting the tap)
- On tap: ripple outward from tap point + brief scale pulse
- After ripple: ACT 0 envelope transition fires

**RSVP pill selection (Will Attend / Will Not Attend):**
- Unselected: neutral blush border
- On select: morph — scale 1→1.04→1 + background color floods in from center (clip-path circle expand) + checkmark draws in with SVG stroke-dashoffset animation
- Ease: ease.settle
- Duration: dur.base

**Form inputs:**
- Default: clean underline-style input, no box
- On focus: underline grows from center outward (scaleX 0→1, origin center) over 200ms
- Label: floats up + shrinks (traditional float label pattern) with ease.enter
- Error state: label turns dusty rose, underline turns warning color, gentle shake (translateX ±3px, 3 times, 200ms)

**RSVP submit button:**
- Idle: normal
- On submit: spinner appears — a small botanical wreath SVG that rotates
- On success: wreath morphs into a checkmark (SVG path morph) + small petal burst from center
  - Petal burst: 6–8 tiny colored divs scatter outward with opacity fade (pure CSS)
- On error: shake animation + error message slides in below button

**"Copy bank account" button:**
- On tap: button briefly scales down (0.96) then back (ease.settle)
- Toast notification rises from bottom: "Tersalin ✓" with a small cat paw SVG icon
- Toast auto-dismisses after 2s with fade + slide down

**FAQ / Accordion:**
- On open: content reveals with height animation — use `grid-template-rows: 0fr → 1fr` trick (no max-height hack)
- Content inside fades in (opacity 0→1) after grid animation starts
- Chevron rotates 0→180° (ease.soft)
- Ease: ease.enter, dur.base

**Wish submit:**
- After submit: new wish card prepends to the list
- Card slides in from top (y −40→0) + opacity 0→1 + brief background highlight (cream → ivory over 1s)
- Other cards shift down smoothly (layout transition via FLIP animation or CSS `grid` auto-flow)

**Sticky RSVP button / Scroll-to-top:**
- Appears after scrolling past hero (IntersectionObserver on hero bottom)
- Entrance: fade in + scale 0.8→1 (ease.settle)
- Idle: very subtle breathing (scale 1→1.02, 4s loop) — it "wants" to be tapped
- Exit: fade out + scale 1→0.8 when RSVP section is in viewport

**Cat peek (Closing section):**
- A cat illustration peeks up from the very bottom edge of the final section
- Entrance: slides up from below viewport edge (y 60→0, ease.settle)
- Idle: peek-and-hide loop — every ~8s, slides down 80% then back up over 1.5s
- This is the "goodbye" from the cats

**"La Vie en Rose" note moment:**
- At exactly one moment in the story sections (editor's choice — perhaps the Japan chapter), a single animated music note floats up from the audio button
- Pure CSS keyframes: floats up + fades, 1.5s, triggers once per session
- Very subtle — guests may or may not notice it. That's the point.

**Scroll hint arrow (hero section):**
- At the bottom of the hero, after 3s of no scroll: a chevron-down arrow fades in, breathing gently
- On any scroll: immediately fades out
- Never blocks content

**Component / hook structure:**
```
interactions/
  useRipple.ts              — generic tap ripple hook
  PillSelect.tsx            — RSVP pill with morph animation
  FloatLabelInput.tsx       — focus-animated form input
  SubmitButton.tsx          — botanical spinner → checkmark transition
  CopyButton.tsx            — copy + cat paw toast
  AccordionItem.tsx         — grid-rows reveal accordion
  WishCard.tsx              — new wish FLIP prepend animation
  StickyRSVP.tsx            — sticky button with entrance/exit/breathing
  CatPeek.tsx               — bottom-edge peeking cat
  ScrollHint.tsx            — chevron scroll cue
  MusicNote.tsx             — floating music note easter egg
  Toast.tsx                 — reusable toast notification
```

---

## WHAT CURSOR MUST PRODUCE: 5 IMPLEMENTATION FILES

After reading this brief, generate **5 detailed implementation markdown files**:

### File 1 — `IMPL-01-gate-envelope.md`
Deep spec for ACT 0. Cover:
- Full component tree with file paths
- CSS animation keyframes (clip-path envelope open, wax seal crack, light bloom)
- URL param parsing for guest name personalization
- iOS audio unlock + gyroscope permission request sequence
- Session storage gate-skip logic
- All transition timing values
- Fallback for no-name param
- Desktop adaptation

### File 2 — `IMPL-02-hero-living-world.md`
Deep spec for ACT 1. Cover:
- Complete layer stack implementation (CSS positioning, z-index system)
- `heroLayout.config.ts` full shape with example values
- Full GSAP assemble timeline (every line, every offset)
- Every idle loop with exact duration ranges and phase randomization logic
- Gyroscope hook implementation (DeviceOrientationEvent, lerp, RAF)
- ScrollTrigger parallax per layer
- Particle canvas complete implementation (RAF loop, spawn logic, recycle)
- Dove and butterfly MotionPath details
- Performance tier gating logic
- Fallback to flat image when tier is LOW

### File 3 — `IMPL-03-scroll-story.md`
Deep spec for ACT 2. Cover:
- Full section list and narrative arc in order
- `StorySection` component with all entrance animation logic
- ScrollTrigger scrub setup for illustrations
- Scroll-frame sequence technique (frame extraction, canvas scrub, fallback)
- Dove cross-section transition triggers
- Gallery scrapbook: rotation logic, scatter entrance, lightbox
- Event section: date typography, arch frame, map pin bounce, countdown digits
- Drapery divider between every section
- All section-specific choreography notes

### File 4 — `IMPL-04-ambient-layer.md`
Deep spec for ACT 3. Cover:
- `AmbientLayer` wrapper architecture
- Particle canvas: full `Particle` type, spawn/update/draw loop, section color overrides
- CSS breathing system: class assignment, inline duration variables, IntersectionObserver lifecycle
- Drapery ripple keyframes
- Post-hero ambient doves: frequency, path variation
- Audio system: unlock, loop, volume, toggle button, iOS compliance
- Scroll progress bar implementation
- `useAmbientBreathing` hook: how it randomizes durations across all breathing elements on mount

### File 5 — `IMPL-05-micro-interactions.md`
Deep spec for ACT 4. Cover:
- Every interaction in the catalog above with exact animation values
- `useRipple` hook implementation
- Pill select: clip-path circle expand technique + SVG checkmark draw
- Float label input: CSS-only or minimal JS
- RSVP submit: wreath SVG → checkmark morph (GSAP or CSS)
- Petal burst: CSS-only scatter technique
- FLIP animation for wish card prepend
- Cat peek: IntersectionObserver on closing section + peek loop
- Toast system: queue, auto-dismiss, max 3 visible
- Music note easter egg: trigger condition + animation
- Scroll hint: timer + scroll detection

---

## GLOBAL TECHNICAL STACK (for all 5 files)

```
Framework:       Next.js (App Router)
Language:        TypeScript
Animation:       GSAP (with ScrollTrigger + MotionPath plugins)
Smooth scroll:   Lenis
Styling:         Tailwind CSS v4 + CSS custom properties for design tokens
State:           React Context (MotionProvider for tier; no heavy state library needed)
RSVP backend:    Google Sheets via API route
Audio:           Web Audio API or HTMLAudioElement
Performance:     All animation on transform/opacity only; will-change managed; loops pause off-screen
```

**Design token CSS variables to define in `globals.css`:**
```css
:root {
  /* Palette */
  --color-ivory: #FBF7F0;
  --color-cream: #F3E9DC;
  --color-blush: #F3D9D6;
  --color-dusty: #D9A7A0;
  --color-peach: #F5C9AA;
  --color-sage:  #A9B89A;
  --color-drapery: #FFFFFF;
  --color-ink:   #4A4039;
  --color-muted: #7A6E68;

  /* Motion tokens */
  --ease-enter:  cubic-bezier(0.22, 1, 0.36, 1);
  --ease-soft:   cubic-bezier(0.45, 0, 0.55, 1);
  --ease-float:  cubic-bezier(0.45, 0, 0.55, 1);
  --ease-settle: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-exit:   cubic-bezier(0.55, 0, 1, 0.45);

  --dur-micro:   200ms;
  --dur-base:    500ms;
  --dur-enter:   850ms;
  --dur-assemble: 1600ms;
  --loop-slow:   6000ms;
  --loop-ambient: 12000ms;
}
```

---

## WHAT "GOOD" LOOKS LIKE (success criteria for Cursor)

When all 5 implementation files are complete and built:

1. **A guest opens the link on their phone** → sees the envelope, feels the ritual, hears music, is greeted by name.
2. **The hero loads** → it feels like a living painting. Every element breathes at a different rate. Tilting the phone makes the scene shift like a diorama.
3. **They scroll** → the love story unfolds. Each illustration arrives with personality. Doves connect the chapters. The scrapbook gallery feels tactile.
4. **Everything below the hero** → still alive. Petals still fall. Florals still sway. Music plays. The world didn't stop.
5. **They reach RSVP** → every interaction feels considered. The form is delightful to fill in.
6. **They submit** → the petal burst makes them smile.
7. **They reach the bottom** → a cat peeks up to say goodbye.
8. **On a slow connection / older phone** → experience gracefully degrades. Never broken. Always beautiful.

**That is the standard. Build to that standard.**

