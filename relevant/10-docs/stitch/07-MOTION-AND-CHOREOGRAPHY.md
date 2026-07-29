# 07 — Motion & Choreography
## Motion Principles, Hero Assemble, Section Reveals

**For Google Stitch designers.** This document describes *how things move* — timing, easing, layering, and emotional intent. No implementation code. Motion serves story, never spectacle.

---

## Core Philosophy: "Hidup Bukan Kaku"

**Life is not rigid.** Nothing in this invitation is completely still. Grass sways. Clouds drift. Cats breathe. Fabric ripples. But nothing is frantic — this is a late summer morning, not a fireworks show.

| Principle | Meaning |
|-----------|---------|
| **Organic** | Motion follows natural rhythms — breathing, swaying, drifting |
| **Unhurried** | Durations are generous. Nothing snaps or pops aggressively |
| **Purposeful** | Every movement tells the guest something (world opening, section arriving) |
| **Graceful fallback** | Reduced-motion preference → instant reveals, no ambient loops |
| **Cooperative** | Music, motion, and scroll work together — never compete |

---

## Global Timing Reference

| Motion type | Duration | Easing feel |
|-------------|----------|-------------|
| Micro-interaction (button press) | 150ms | Quick ease-out |
| UI fade (gate dissolve) | 400–600ms | Soft ease-in-out |
| Section reveal on scroll | 700–1000ms | Gentle ease-out |
| Hero assemble (full sequence) | **1.4–1.8s** | Staggered, organic |
| Ambient loop (sway, drift) | 3–8s cycle | Sine-like, continuous |
| Text line reveal | 400ms per line | Fade + slight rise |
| Music fade-in | 800ms | Linear volume ramp |

---

## Hero Assemble Sequence (1.4–1.8 seconds)

The hero assemble is the emotional centerpiece. It plays once — when the guest taps "Buka Undangan."

### Layer Stack (back to front)

| Order | Layer | Enter behavior | Timing |
|-------|-------|---------------|--------|
| 1 | Sky wash (soft blue `#CFE0E8`) | Fade in from ivory | 0–300ms |
| 2 | Clouds (2–3 soft shapes) | Drift in from sides, fade in | 200–500ms |
| 3 | Meadow / grass base | Rise gently from below (10px), fade in | 300–600ms |
| 4 | Wildflowers | Pop in with slight stagger (blush, white, yellow, lavender) | 500–800ms |
| 5 | Hanifah + Moju + Shiro (left group) | Fade + gentle rise, as a unit | 700–1100ms |
| 6 | Bashara + Jiro + Meng (right group) | Fade + gentle rise, as a unit | 800–1200ms |
| 7 | Simba, Hoshi, Kimho (foreground cats) | Pop in with playful slight bounce | 1000–1400ms |
| 8 | Doves + butterflies | Drift in from top corners | 1100–1500ms |
| 9 | Floral corner accents | Fade in | 1200–1600ms |
| 10 | Text overlay (headline → names → date) | Fade in, line by line | 1400–1800ms |

**Total: 1.4–1.8 seconds.** Guest sees the world building itself — sky first, then ground, then people, then cats, then words.

### Post-Assemble Idle Motion

Once assembled, the hero scene enters ambient life:

| Element | Motion | Cycle |
|---------|--------|-------|
| Clouds | Slow horizontal drift | 12–16s |
| Wildflowers | Gentle sway | 4–6s |
| Doves | Arc drift across sky | 8–10s |
| Butterflies | Small figure-8 path | 5–7s |
| Cats (all 7) | Subtle breathing / ear twitch | 3–4s |
| Grass foreground | Slow wave | 6–8s |

All ambient motion is **subtle** — a guest should feel life, not notice animation.

---

## Gate → Hero Transition

| Step | Visual | Duration |
|------|--------|----------|
| 1 | "Buka Undangan" button press feedback | 150ms |
| 2 | Gate floral frame fades out (opacity 1→0) | 400ms |
| 3 | Gate text fades out simultaneously | 400ms |
| 4 | Ivory background holds briefly (empty canvas) | 200ms |
| 5 | Hero assemble begins (see above) | 1400–1800ms |
| 6 | La Vie en Rose volume ramps 0→30% | 800ms (overlaps step 5) |
| 7 | Sticky RSVP pill fades in | 400ms after assemble complete |

---

## Section Reveal on Scroll

Each section enters as the guest scrolls. Reveals are gentle — content rises slightly (8–12px) and fades in.

| Section | Reveal style | Special motion |
|---------|-------------|----------------|
| Welcome | Text lines appear one by one (400ms stagger) | Dove illustration fades in above text |
| Countdown | Numbers count up to current value on first view | Floral band behind numbers sways gently |
| Story chapters | Illustration from alternating side + text from opposite | Scrapbook photos rotate in with slight bounce |
| Japan Dream | Sakura petals drift continuously | Illustration fades in with petal scatter |
| Event Details | Arch frame with venue info rises into view | Map/calendar buttons fade in after text |
| RSVP | Note card rises from below with soft shadow grow | — |
| Wishes | Form rises, then existing wishes stagger in | Wish cards have slight random rotation |
| Gift/FAQ | Gratitude text first, then bank cards, then FAQ accordion | Accordion chevrons rotate on expand |
| Closing | Mirror hero — couple + cats fade in together | One cat peeks up from bottom edge (8px rise loop) |

### Drapery Divider Motion

Between sections, white drapery fabric flows:
- Enters from top as guest scrolls into new section
- Gentle ripple/wave animation (2–3s cycle)
- Fades into ivory background above and below
- Not a hard cut — the fabric *is* the transition

---

## Scroll-Linked Effects

| Effect | Behavior | Intensity |
|--------|----------|-----------|
| Parallax (hero layers) | Background moves slower than foreground on scroll | Subtle — max 20px offset |
| Parallax (story illustrations) | Illustration shifts slightly opposite scroll direction | Very subtle — max 8px |
| Scroll progress bar | 2px blush line grows left-to-right at top | Linear with scroll |
| Sticky RSVP | Fades in after hero, fades out when RSVP in view | Opacity transition 300ms |

---

## Text Choreography

| Context | Behavior |
|---------|----------|
| Welcome greeting | 4 lines, 400ms stagger, fade + 8px rise each |
| Yasin verse | Italic Cormorant, appears as block after greeting completes |
| Story chapters | Title first (300ms), then 1–3 narrative lines (400ms stagger) |
| Countdown numbers | Count up animation on first viewport entry |
| RSVP success | Warm message fades in, form fades out |
| Closing text | 3 lines staggered, names in script accent last |

---

## Music Choreography

| Event | Music behavior |
|-------|---------------|
| Before gate tap | Silent (toggle visible but inactive) |
| Gate tap | La Vie en Rose fades in to ~30% volume over 800ms, loops |
| Scroll through invitation | Continues looping at constant low volume |
| Music toggle tap | Instant mute/unmute (no fade) |
| Return visit | Respects last toggle state — does not auto-play |

---

## Reduced Motion Alternative

When guest has `prefers-reduced-motion` enabled:

| Normal behavior | Reduced alternative |
|----------------|-------------------|
| Hero assemble (1.4–1.8s stagger) | Instant crossfade — full hero visible immediately |
| Ambient loops (sway, drift, breathe) | All stopped — static illustration |
| Section scroll reveals | Instant appear — no rise, no stagger |
| Text line reveals | All lines visible immediately |
| Drapery ripple | Static drapery image |
| Parallax | Disabled — layers fixed |
| Countdown count-up | Numbers shown at final value immediately |

Content is **never hidden** in reduced motion. Everything is fully visible and readable from the start.

---

## Motion Budget Per Section

Keep motion purposeful. Maximum concurrent animations per viewport:

| Section | Max concurrent ambient loops | Max entrance animations |
|---------|------------------------------|------------------------|
| Hero | 6 (clouds, flowers, 2 doves, 2 butterflies, grass) | 1 (assemble, once) |
| Welcome | 1 (dove) | 1 (text stagger) |
| Countdown | 1 (floral sway) | 1 (number count) |
| Story (per chapter) | 0 | 1 (illustration + text) |
| Japan | 2 (sakura drift, petal fall) | 1 |
| Event | 0 | 1 |
| RSVP | 0 | 1 |
| Wishes | 0 | 1 (form) + stagger (cards) |
| Gift | 0 | 1 (accordion expand) |
| Closing | 1 (cat peek) | 1 |

---

## What NOT to Animate

- Form field values typing themselves
- Gift bank numbers counting up
- Aggressive bounce or elastic easing
- 360° rotations of any element
- Particle explosions or confetti
- Text scrambling or typewriter effects
- Parallax so strong it causes disorientation
- Anything that loops faster than 2 seconds

---

## Hero Cat Placement Map

Reference for illustrated cat positions in hero (matching `stitch/hero-main.png`):

```
                    [doves]  [butterflies]
    ┌──────────────────────────────────────┐
    │           sky / clouds               │
    │                                      │
    │  Hanifah          Bashara            │
    │  (cream hijab)    (navy)             │
    │  ├─ Moju (held)   ├─ Jiro (held)    │
    │  └─ Shiro         └─ Meng            │
    │     (shoulder)       (shoulder)      │
    │                                      │
    │    Simba    Hoshi    Kimho           │
    │   (grass)  (grass)  (grass)          │
    │                                      │
    │  ∿∿∿ wildflowers meadow ∿∿∿         │
    └──────────────────────────────────────┘
```

| Cat | Position | Reference photo |
|-----|----------|----------------|
| Moju | Held by Hanifah, chest level | `cat-ragdoll-portrait-name-moju.png` |
| Shiro | On Hanifah's left shoulder | `cat-white-closeup-pink-ears-name-shiro.png` |
| Jiro | Held by Bashara, chest level | `cat-black-white-pendant-name-jiro.jpg` |
| Meng | On Bashara's right shoulder | `cat-black-white-lying-bw-name-meng.jpg` |
| Simba | Foreground grass, center-left | `cat-orange-white-on-couch-name-simba.png` |
| Hoshi | Foreground grass, center, peeking | `cat-gray-tabby-in-blankets-name-hoshi.png` |
| Kimho | Foreground grass, center-right | `cat-kimho-portrait.png` |
