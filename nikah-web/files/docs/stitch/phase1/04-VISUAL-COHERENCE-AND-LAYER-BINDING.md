# 04 — Visual Coherence & Layer Binding ("One World")
**Golden Gate C restated:** every section must read as the same world as `hero-main` — same ivory paper, same watercolor air, same warm daylight, same family. This doc binds each promoted asset to its exact placement, defines where locked copy sits, and gives every binding a fallback so a weak asset degrades to ivory+type instead of breaking the world.
**Global background law:** the site is one continuous sheet of ivory `#FBF7F0` paper. Illustrations sit ON the paper (vignettes, wreaths, bands) or open WINDOWS in it (full-bleed scenes: L3, L5-bg, L7, L12). Alternate the two rhythms; never two full-bleed windows adjacent without an ivory breath between them.
**Copy note:** all "text overlay zones" refer to copy in `docs/03-copywriting.md`, which is currently missing from the working tree and must be restored before build (doc 05, P0). No copy is invented here.

---

## Layer bindings

### L0 Envelope
- Primary: inline SVG/CSS (no image). Background: flat ivory. Text: tap cue only, centered below envelope.
- Coherence risk: SVG florals could look "vector-clean" vs watercolor world → keep botanical line art minimal and thin; the envelope is a prologue *before* the painted world opens, so restraint is correct.

### L1 Loading
- Primary: `assets/illustrations/loading-sleeping-cat.webp`, centered, ~60vw max 320px.
- Text zone: one loading line beneath, flat ivory. Background: ivory.
- Fallback: pure ivory + text (the wreath image is decorative, not structural).

### L2 Gate
- Primary: `gate-monogram-frame.webp` (wreath) centered upper-third; typographic "B ♥ H" monogram set INSIDE the wreath in amber `#C8922A`.
- Secondary: `gate-floral-border.webp` (post re-render) as edge frame, corners swaying.
- Text zones: wedding title above wreath; couple names inside/below wreath; guest name + "buka undangan" CTA lower third — all on flat ivory inside the border's clear center (the border's right/center emptiness is why it was designed that way).
- Fallback: drop the border, keep wreath + type. Drop both → type + thin amber rule lines still reads as an invitation cover.

### L3 Hero
- Primary: `assets/video/hero-bg-loop.mp4` full-bleed 1080×1350 window; poster `scenes/hero-main.webp`.
- Secondary: bottom vignette gradient (DOM, above video) for legibility.
- Text zones: names + date ONLY in the sky band (top ~18%) or on the bottom vignette. **Never over faces or cats** — the seven cats occupy the lower half; the couple the middle. Sky is the sole safe zone without vignette assist.
- Fallback: poster still (identical composition, so text zones hold across tiers — this is why video and poster must stay the same framing forever).

### L4 Welcome + Yasin 36
- Primary: `welcome-dove-floral.webp` at top of section, ~70vw, on ivory.
- Text zones: welcome copy + Yasin 36 verse below the floral crescent, generous ivory margins; Arabic set larger, centered.
- Coherence risk: lowest-risk section — mostly paper and type. Fallback: reuse a single flower cluster from the band assets or plain type.

### L5 Countdown
- Primary background: `scenes/countdown-bg.webp` full-bleed window with 10–15% ivory scrim center.
- Secondary: `countdown-floral-band.webp` as top edge divider (multiply blend), swaying.
- Text zones: date line above digits; 4 digit blocks centered on the scrimmed mid-field (lowest-detail area of the painting); event CTA below.
- Fallback: swap bg for flat ivory or `meadow-bg.webp` at 20% opacity wash; digits carry the section alone.

### L6 Love Story (6 chapters)
- Primary per chapter: `assets/illustrations/story/story-ch0N-*.webp`, each a "polaroid on the paper": image at ~85vw with soft shadow + slight alternating rotation (±1°), NOT full-bleed — this keeps the six differing internal grades (golden ch02, dusk ch03, vignette ch04, sakura ch05/06) unified as *pictures in one album* rather than six competing worlds. This framing decision is the main coherence device of the whole site.
- Text zones: chapter number + title + body BELOW each image on ivory, never overlaid (chapters are dense).
- Scrapbook slots: **CUT for launch** (doc 01). The layout reserves nothing; if photos arrive by 1 Aug, a Phase 1.5 horizontal photo strip is appended after ch06 as its own sub-section — additive, no reflow of chapters.
- Fallback per chapter: if any chapter fails eyeball review, drop the image and keep number+title+copy as a typographic beat (the album survives a missing photo); ch01 currently IS this state until its regen lands.

### L7 Japan Dream
- Primary: `japan-sakura-campus.webp` full-bleed window (portrait, mobile-native).
- Secondary: `japan-petal-accent.webp` — 2–3 small petals drifting (HIGH), and reused statically as a corner accent here and at L8/L11 (this is the "floral corners" substitute).
- Text zones: upper-left flat sky, or below the window on ivory. Fallback: image as a framed polaroid like L6 instead of full-bleed.

### L8 Event Details
- Primary: none — typographic ceremony/reception card(s) on ivory, thin amber rules, `japan-petal-accent` at one corner (multiply).
- Text zones: everything; this is the information section, clarity beats decoration. Venue arch image: CUT (doc 01).
- Fallback: it already is the fallback. Maps/calendar buttons are UI, not art.

### L9 RSVP / L10 Wishes / L11 Gift+FAQ
- Primary: form/list/accordion UI on ivory; `countdown-floral-band.webp` reused once as the divider that opens the practical act (L8→L9 boundary), petal accent sparingly.
- Rule: at most ONE floral accent per practical section — Act 3 is deliberately the quietest stretch so L12 lands.

### L12 Closing
- Primary: `scenes/closing-echo.webp` full-bleed window; Hoshi peek is inside the image's bottom edge — align image bottom to viewport bottom so the peek reads as breaking the frame.
- Text zones: closing copy + hashtag in the sunset sky (top third, flat warm gradient); nothing over the cats/rings/couple.
- Fallback: `hero-main.webp` reprise with a warm CSS sepia overlay + same copy (a literal echo — weaker but coherent by definition).

## Divider & accent system (the missing-assets substitutes, locked)
- Section divider (storybook feel): `countdown-floral-band.webp`, multiply, max 2 uses sitewide (L5 top, L8→L9) to avoid wallpapering.
- Corner accent: `japan-petal-accent.webp`, multiply, ≤160px, max 3 uses (L7, L8, L11).
- All other section boundaries: whitespace + thin amber rule. Restraint IS the drapery.

## Visual consistency checklist (eyeball pass — run with all 15 promoted files + hero-main on one screen)
Score each file ✓/✗; any ✗ triggers its layer fallback:
1. Paper: does the image sit naturally on/next to `#FBF7F0` without a visible cold-white or grey box edge?
2. Light: is the light warm daylight or golden hour? (Any grey/overcast → fail; this is what killed ch01.)
3. Palette: are greens sage-meadow, pinks dusty-blush, blues sky-soft? No neon, no deep teal, no black backgrounds.
4. Grain: visible watercolor texture, soft edges? (Flat vector or airbrush-smooth → fail.)
5. Faces: couple recognizable as the SAME two people as hero-main (hijab shape, his hair, both smiling-gentle)?
6. Cats: coat patterns consistent with stitch/09 identities wherever a specific cat is implied?
7. Horizon/scale: storybook proportions, slightly compressed depth — no photoreal perspective?
8. At 375px width: is the intended text zone genuinely low-detail?
Sequence test (the real Gate C): scroll the 13 layers as thumbnails in order — do L3→L12 feel like turning pages of one book? Any image that "changes books" fails regardless of individual scores.

## Decisions locked
- Ivory paper is the global ground; two rhythms only (on-paper vignettes vs full-bleed windows), never two adjacent windows.
- L6 chapters render as framed album pictures, not full-bleed — this is the coherence device and is final.
- Hero text lives in the sky band / bottom vignette only; poster and video share identical framing permanently.
- Divider/accent substitutes locked: band ×2 max, petal ×3 max, whitespace elsewhere.
- Every layer has a named typographic fallback; no layer's shippability depends on a secondary asset.

## Open questions for Bashara & Hanifah
1. Run checklist items 5–6 yourselves on ch02–ch06 + closing-echo: do the faces and cats pass as "us"? (Directional scoring done; identity sign-off is yours.)
2. L2 monogram: "B ♥ H", "B & H", or full names inside the wreath?
3. Closing copy placement: hashtag prominent in the sky, or small beneath as a whisper?

## If wrong, what breaks
If the album-frame treatment for L6 is wrong (couple wants immersive full-bleed chapters), the six differing internal grades will visibly clash and force regenerating 3–4 chapters to one grade — the frame decision is precisely what makes today's assets shippable, so overturning it reopens the generation budget. If ivory-ground discipline slips during build (stray white `#FFFFFF` sections), the paper illusion dies quietly and Gate C fails on the sequence test even though every individual asset passes — hence checklist item 1 checks the seam, not the picture.
