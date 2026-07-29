# 03 — Static / Video / Motion Map
**Governing law:** exactly **one video on the site at launch** (`hero-bg-loop.mp4`). Everything else is static imagery given life by CSS/Motion/GSAP. This is both the performance budget (hero <800KB transfer path stays exclusive) and the taste call: one living window into the world, framed by a painted book. A second video is a stretch item, not a plan.
**Hard rule (restated, enforced below):** *never add GSAP/CSS "breathing" transforms on top of a fal-generated video's characters* — the video already breathes; stacked motion reads as jitter. Overlay motion may only touch DOM elements composited above the video (text, petals, vignette), never the `<video>` element's transform beyond static positioning.

---

## Layer map L0–L12

| Layer | Primary visual | Motion owner | Video? | Static fallback |
|---|---|---|---|---|
| L0 Envelope | Inline SVG/CSS envelope | Motion (open sequence) + CSS (seal pulse) + GSAP (audio fade) | No | REDUCED: pre-opened state, instant handoff |
| L1 Loading | `loading-sleeping-cat.webp` | CSS only — breathing scale 1↔1.02, 3s yoyo on the *image* (allowed: it's a still, not fal video) | No | Static image, no pulse |
| L2 Gate | `gate-monogram-frame.webp` + `gate-floral-border.webp` (re-rendered) | CSS sway ±1.2° on border corners; Motion for open/entrance | No | Static frame |
| L3 Hero | `video/hero-bg-loop.mp4` | **fal owns all life.** GSAP owns only: entrance crossfade from poster, text choreography, scroll-out parallax of the *text*, vignette. No transforms on video content. | **YES — the only one** | `scenes/hero-main.webp` poster (LOW/REDUCED/save-data) |
| L4 Welcome | `welcome-dove-floral.webp` on ivory | CSS reveal (fade+8px rise); dove image may drift ±3px translate, 6s — it's a still | No | Static, copy-led |
| L5 Countdown | `countdown-bg.webp` + `countdown-floral-band.webp` | GSAP number flips; CSS sway on band | No | Flat ivory + digits |
| L6 Story ch01–ch06 | 6 chapter stills | CSS/Motion scroll reveal (fade + rise + slight scale 1.02→1), stagger per chapter. **All static — locked.** | No | Instant reveal |
| L7 Japan Dream | `japan-sakura-campus.webp` + petal accent | CSS petal drift (2–3 DOM petals using `japan-petal-accent`, 12–18s fall loops, HIGH tier only) | No | Static scene |
| L8 Event | Typography card + reused floral accents | CSS reveal only | No | Same |
| L9 RSVP | Form UI | Motion micro-feedback (focus, submit press) | No | Native form |
| L10 Wishes | List UI | CSS fade-in per item (FLIP deferred) | No | Plain list |
| L11 Gift+FAQ | Typographic accordion | CSS height/opacity | No | Open list, no accordion |
| L12 Closing | `closing-echo.webp` | CSS slow scale 1→1.04 over scroll (Ken Burns on a still — allowed); Hoshi edge already in image, optional +6px translate peek on entry | **No (launch)** — loop is the sole stretch item | Static echo |

## The six forks, resolved

**1. closing-echo loop?** — **Static at launch; loop is the one sanctioned stretch item (Recommended).** The emotional argument for motion here is real (bookend: the world was alive at L3, alive again at goodbye). But the Ken Burns + Hoshi-peek-translate treatment on the still delivers ~70% of that for $0 and 0KB. IF Golden Gate C passes with ≥5 days to spare: generate `closing-echo-loop.mp4` from the promoted still (~$0.30, Kling, same settings as hero: subtle wind, cat tail flicks, no camera move), ship ≤900KB, HIGH tier only, still as poster. It is the only video generation permitted in Phase 1.

**2. hero-bg / hero-tall-portrait?** — `hero-bg` is **reassigned, not redundant**: it becomes `scenes/meadow-bg.webp`, the connective backdrop (L5 alt, transition washes, LOW-tier ambience). It never appears in L3 — video + poster own the hero completely. `hero-tall-portrait` is **rejected** (doc 02) and appears nowhere.

**3. Story chapters video?** — **All static. LOCKED.** Six loops would cost ~$1.80 and ~6MB of transfer against a scroll section guests move through in 30 seconds; worse, six looping windows dilute the hero's "living painting" specialness. The scroll reveal *is* the motion. No exceptions, including ch06.

**4. Countdown band** — **CSS sway wins** (±1° rotate on transform-origin center-top, 5s ease-in-out yoyo, HIGH/MID). The band depicts hanging fabric; a static drape reads dead, and the sway costs one composited transform. LOW/REDUCED: static.

**5. Gate florals** — **PNG frame + CSS ±1.2° sway (Recommended)** over full-bleed illustration. The gate must foreground the guest's name and the tap ritual; a full-bleed painting competes with both. The border+wreath system keeps type on flat ivory (crisp, accessible) with life at the edges. Full-bleed remains a Phase 2 art direction experiment at most.

**6. Breathing-on-video rule** — enforced by ownership table above: at L3, GSAP's allowed surface is `[data-hero-text]`, `[data-hero-vignette]`, and the poster→video crossfade. Code review checklist item: no `transform`/`filter` animation targets the `<video>` element or any wrapper containing it (the static color-grade filter `brightness(.95) saturate(1.1) sepia(.08)` is applied once, unanimated).

## Tier matrix — what guests actually see

| Layer | HIGH | MID | LOW | REDUCED (prefers-reduced-motion) |
|---|---|---|---|---|
| L0 | Full open sequence + seal pulse | Same | Same (it's cheap) | Pre-opened, instant handoff, audio at 30% |
| L1 | Breathing cat | Breathing cat | Static cat | Static cat |
| L2 | Frame sway + entrance | Entrance only | Static | Static |
| L3 | **Video loop** + text choreography | **Video loop**, simpler text entrance | **Poster still** + fade | Poster still, no motion |
| L4 | Reveal + dove drift | Reveal | Fade only | Instant |
| L5 | Digit flips + band sway | Digit flips | Plain ticking digits | Digits update without animation |
| L6 | Staggered reveals + micro-scale | Fade+rise | Fade only | Instant |
| L7 | Scene + 2–3 drifting petals | Scene, no petals | Scene | Scene |
| L8–L11 | Micro-interactions | Reduced | Minimal | None |
| L12 | Ken Burns + Hoshi nudge (+loop if stretch ships) | Ken Burns | Static | Static |

Tier detection per `nikah-web/AGENTS.md`; LOW additionally triggered by Save-Data header and `<3g` effective connection.

## Decisions locked
- One video at launch: `hero-bg-loop.mp4`. Story chapters permanently static.
- `closing-echo-loop.mp4` is the only permitted Phase 1 stretch video; go/no-go at GGC-pass-minus-5-days.
- `meadow-bg.webp` (ex hero-bg) is backdrop-only; never a hero replacement.
- Gate = border/wreath PNG + type on ivory + CSS sway; not full-bleed.
- Countdown band sways (HIGH/MID); breathing-on-fal-video ban is a build checklist item.
- All image "life" (breathing cat, Ken Burns, sway, petals) runs on stills only, single composited transforms, and dies at LOW/REDUCED.

## Open questions for Bashara & Hanifah
1. Closing loop stretch item: is $0.30 + ~900KB worth it to you emotionally, or do you prefer the site frozen at exactly one video forever?
2. Should music continue at 30% for the whole scroll, or duck to ~15% after L3? (Motion adjacent — affects perceived calm.)
3. On REDUCED, do you still want audio auto-fading in at L0 tap, or fully silent until the music toggle is pressed?

## If wrong, what breaks
If "one video" is too austere and the site feels static mid-scroll, the fix is additive (closing loop + petal counts), not structural — no layout changes. If it's too heavy anyway (hero video underperforms on real 3G), the LOW path is already first-class: poster + Ken Burns everywhere, and the site remains complete. The unrecoverable version is the opposite call — six chapter loops shipped and then walked back after guests have slow first visits; first impressions don't get a second deploy.
