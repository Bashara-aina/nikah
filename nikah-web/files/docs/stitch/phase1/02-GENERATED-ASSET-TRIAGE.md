# 02 — Generated Asset Triage
**Scope:** every file in `generated/` (17 images), judged against the master `nikah-web/assets/scenes/hero-main.webp` (1080×1350 watercolor storybook meadow). All files were visually inspected side-by-side on 2026-07-05.
**Coherence criteria (what the score means):** palette (ivory `#FBF7F0`, meadow greens, sky blue, dusty blush, warm amber), watercolor grain vs flat digital, character proportions (gentle, rounded, storybook — not anime-sharp), cat accuracy per `stitch/09`, and light temperature (soft daylight/golden — never grey).

---

## Per-file verdicts

### 1. `loading-sleeping-cat.webp` (1254×1254) — **PROMOTE**
- Canonical path: `assets/illustrations/loading-sleeping-cat.webp`
- Layer: L1 Loading. Coherence **8/10** — ivory ground matches the site background exactly; soft pink/sage wreath palette sits inside the master's flower range. The cat reads as Shiro (white, pink ears) per stitch/09.
- Crop safety: perfectly centered circular composition; safe at any square crop; loading text sits below on flat ivory.
- Rationale: exactly what a 1–2s loading beat needs — calm, on-palette, zero text conflicts.

### 2. `gate-floral-border.webp` (375×666) — **REGENERATE** (resolution only)
- Canonical path (target): `assets/illustrations/gate-floral-border.webp`
- Layer: L2 Gate frame. Coherence **8/10** — rose/cosmos/lavender palette matches, line weight right, arch shape correct with generous empty center for copy.
- Crop safety: excellent — whole right/center is clear.
- Rationale: the concept is production-ready but **375px wide is 1× density**; on every modern phone (2×–3×) it renders blurry at full-bleed. Regenerate the same prompt at ≥1080×1920, or run a 3× upscale (fal upscaler, ~$0.01) if regen drifts. Do not redesign — only re-render.

### 3. `gate-monogram-frame.webp` (1254×1254) — **PROMOTE**
- Canonical path: `assets/illustrations/gate-monogram-frame.webp`
- Layer: L2 Gate (wreath around "B ♥ H" typographic monogram — the monogram itself is set in type, which is better than baking it in: crisp at any DPI, editable).
- Coherence **8/10** — blush/cream wreath on ivory, painterly, matches loading-cat as a sibling.
- Crop safety: large clean center disc; monogram + names + guest name all fit inside.

### 4. `hero-bg.webp` (2304×4096, 7.4MB) — **PROMOTE, reassigned**
- Canonical path: `assets/scenes/meadow-bg.webp` (re-encode to ≤300KB at 1080×1920 before shipping)
- Layer: NOT the hero (video + poster own L3). Reassign as the **shared meadow backdrop** for L5 Countdown alt / section transitions / LOW-tier washes. Coherence **9/10** — it is literally the master's meadow with the figures removed; same sky, same flower species.
- Crop safety: entirely safe — no subjects; text can sit anywhere with a light scrim.
- Rationale: too coherent to waste; redundant *as a hero*, invaluable as the world's connective tissue.

### 5. `hero-tall-portrait.webp` (752×1392) — **REJECT**
- Coherence **5/10** — it re-renders the family rather than deriving from the master: cat markings drift (Moju's mask wrong, Jiro missing red collar), faces differ from the master's, and it has baked-in white pillarbox borders that fight full-bleed layout. Plus a giant foreground tabby that duplicates closing-echo's Hoshi device.
- Rationale: violates "master wins." Anywhere it appears next to hero-main it reads as an off-model clone of the same scene — the single worst coherence risk in the set. No substitute needed; the 9:16 case is covered by video + `meadow-bg`.

### 6. `welcome-dove-floral.webp` (1448×1086) — **PROMOTE**
- Canonical path: `assets/illustrations/welcome-dove-floral.webp`
- Layer: L4 Welcome. Coherence **8/10** — the dove matches the master's flying doves; blush floral crescent on flat ivory.
- Crop safety: bottom third and full width above the dove are clear ivory; Yasin 36 copy sits directly below the crescent.

### 7. `countdown-bg.webp` (1392×752) — **PROMOTE**
- Canonical path: `assets/scenes/countdown-bg.webp`
- Layer: L5 Countdown backdrop. Coherence **9/10** — hazier, dreamier grade of the master meadow; lavender/cosmos species match.
- Crop safety: soft mid-field is low-detail; countdown digits need only a 10–15% white scrim. Landscape ratio means mobile shows a center crop — safe, subjects are edge-distributed.

### 8. `countdown-floral-band.webp` (821×304) — **PROMOTE** (with knockout note)
- Canonical path: `assets/illustrations/countdown-floral-band.webp`
- Layer: L5 divider band; also REUSED as the site-wide section divider (replaces the missing "drapery dividers" asset — see doc 04). Coherence **8/10** — draped fabric + blush florals, painterly.
- Caveat: background is white, not transparent. Composite only over ivory/white zones, or apply `mix-blend-mode: multiply` — do not place over the meadow.

### 9. `story-ch01-meeting.webp` (3072×3072) — **REGENERATE**
- Coherence **4/10** — the muddy grey-green wash background is the only cold, overcast image in the entire set; it breaks the warm-daylight law of the master. It also fronts a laptop video-call, which near-duplicates ch04's device (two "screen" chapters in six kills variety).
- Regeneration brief: keep the split-screen first-meeting concept but stage it warm — e.g. two phones/photos pinned on an ivory corkboard with pressed flowers, or the video-call framed inside a blush vignette like ch04's circular treatment; palette locked to ivory/blush/sage; watercolor grain matching ch05.
- This is the **only mandatory generation for launch.**

### 10. `story-ch02-rides.webp` (1254×1254) — **PROMOTE**
- Canonical path: `assets/illustrations/story/story-ch02-rides.webp`
- Coherence **7/10** — golden-hour ITS campus ride; warmer/more saturated than the master but reads as intentional "memory glow," and the couple is on-model. The visible license plate is charming detail, verify the couple is happy with a real-looking plate number.
- Crop safety: square; text goes below the image, not on it (dense composition).

### 11. `story-ch03-jakarta.webp` — **PROMOTE**
- Path: `assets/illustrations/story/story-ch03-jakarta.webp`. Coherence **8/10** — Monas sunset through the window, warm lamp light, on-model couple, lovely narrative props. Text below image.

### 12. `story-ch04-ldr-tokyo.webp` — **PROMOTE**
- Path: `assets/illustrations/story/story-ch04-ldr-tokyo.webp`. Coherence **8/10** — the soft circular vignette on ivory is the strongest framing device in the story set (candidate template for ch01 regen). Connected-hearts laptop moment is emotionally precise for LDR.

### 13. `story-ch05-keio.webp` — **PROMOTE**
- Path: `assets/illustrations/story/story-ch05-keio.webp`. Coherence **9/10** — Hiyoshi gate, sakura, acceptance envelope; palette and grain nearly indistinguishable from the master's family. Best chapter in the set.

### 14. `story-ch06-married.webp` — **PROMOTE**
- Path: `assets/illustrations/story/story-ch06-married.webp`. Coherence **9/10** — couple + all 7 cats from behind, rings, Japan-shaped cloud: the thesis image of the whole story. Cat coats read correctly at storybook distance.

### 15. `japan-sakura-campus.webp` (1122×1402) — **PROMOTE**
- Path: `assets/illustrations/japan-sakura-campus.webp`. Layer L7. Coherence **8/10** — golden-pink sakura, Keio tower, shinkansen; sits naturally after ch05/ch06's warm grade. Portrait ratio is mobile-friendly full-bleed; keep copy on the flat sky upper-left or below.

### 16. `japan-petal-accent.webp` (500×500) — **PROMOTE** (with knockout note)
- Path: `assets/illustrations/japan-petal-accent.webp`. Layer L7 accent + reusable floral corner across L8/L11. Coherence **8/10**. White background — same rule as #8: multiply blend or knockout. 500px is fine for an accent ≤160px on screen.

### 17. `closing-echo.webp` (752×1392) — **PROMOTE**
- Path: `assets/scenes/closing-echo.webp`. Layer L12. Coherence **8/10** — a true echo of the master (same staging, slightly dreamier) **with the Hoshi peek already composed into the bottom edge** — this retires the "separate Hoshi peek" from the missing list. Minor cat-marking drift vs the master is forgivable because the two images are never on screen together (L3 vs L12, a full scroll apart).
- Crop safety: sky top third takes the closing copy.

---

## Promote list (final — 14 of 17)
`loading-sleeping-cat`, `gate-monogram-frame`, `hero-bg`→`meadow-bg`, `welcome-dove-floral`, `countdown-bg`, `countdown-floral-band`, `story-ch02`…`ch06` (5), `japan-sakura-campus`, `japan-petal-accent`, `closing-echo`.

## Generation backlog
1. **story-ch01 regen** — mandatory (P1). Warm vignette treatment per brief above.
2. **gate-floral-border re-render at ≥1080w** — mandatory-cheap (P1); upscale fallback acceptable.
3. ~~hero-tall-portrait replacement~~ — none needed; REJECT with no successor.

## Decisions locked
- 14 promotions at the canonical paths above; run the copy-assets step once, then `generated/` is frozen (no further cherry-picking mid-build).
- `hero-bg.webp` is reassigned to `scenes/meadow-bg.webp` and must be re-encoded ≤300KB before any page references it.
- `hero-tall-portrait.webp` is rejected permanently — do not resurrect for "just this one section."
- White-background accents (`countdown-floral-band`, `japan-petal-accent`) render with multiply blend or over ivory only.
- Exactly two generation tasks exist: ch01 regen + gate border re-render.

## Open questions for Bashara & Hanifah
1. ch02's motorbike license plate — keep, blur, or change to a meaningful date?
2. ch01 regen direction: corkboard-photos concept or ch04-style circular vignette? (Default: vignette, for series consistency.)
3. Are the couple's illustrated faces across ch02–ch06 "recognizably us" to you? Only you two can score that.

## If wrong, what breaks
If any promoted file looks worse in situ than in isolation, the per-layer fallbacks in doc 04 apply (ivory + typography degrades gracefully everywhere). If the ch01 regen fails twice, the story ships as 5 chapters (renumber, don't placeholder) — the arc still works because ch02 also functions as an origin beat. The dangerous mistake would be shipping hero-tall-portrait to fill a gap: two off-model versions of the same family on one site breaks Golden Gate C irreparably.
