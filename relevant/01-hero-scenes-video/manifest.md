# Slice 01 — Hero, Scenes & Video — Filter Manifest

Agent 1 of 10. Asset pool root: `/Users/basharaaina/Projects/nikah/nikah-web/`
Every visual verdict below is based on reading the actual file bytes this turn (webp master converted to PNG via `sips` for decode; video judged from ffprobe metadata + poster frame).

| file | verdict | section served | size | dimensions | reason | issues |
|------|---------|----------------|------|------------|--------|--------|
| `scenes/hero-main.webp` | **USE** | §2 Hero (master still) + §11 Closing echo | 272 KB | 1080×1350 (4:5) | Canonical master. Couple (hijabi woman in white, man in navy) + 7 cats in a late-summer flower meadow, doves + butterflies. Storybook watercolor, ivory/blush/sage palette — the style anchor itself. Correct composition, mobile-friendly size. | none |
| `generated/hero-bg.webp` | **USE** | §2 Hero background layer (parallax behind couple cutout) | 7.36 MB | 2304×4096 (9:16) | Best background layer: empty flower-meadow hill + soft blue sky, no figures — ideal to composite the couple/cats over. Matches style + palette, correct 9:16 portrait framing for mobile. | **OVERSIZE — 7.36 MB, must compress** (known issue). Recompress to WebP q≈80 and/or cap width ~1600 for mobile; target <400 KB. |
| `generated/hero-tall-portrait.webp` | **USE** | §2 Hero — 9:16 mobile tall variant | 313 KB | 752×1392 (~9:16) | The portrait/tall variant requested for mobile hero. Same couple + 7 cats, storybook style, correct palette, good size. | Has a printed ivory border frame baked in — fine as framed hero, but crop it out if a full-bleed hero is wanted. |
| `generated/countdown-bg.webp` | **USE** | §4 Countdown background | 248 KB | 1392×752 (landscape) | Soft, low-contrast pastel meadow of wildflowers — deliberately washed-out, ideal for legible countdown text/number overlay. On-palette, on-style, good size. | none |
| `video/hero-bg-loop.mp4` | **USE** | §2 Hero "living illustration" loop | 243 KB | 1080×1350 (4:5), H.264, 24 fps, 5.04 s | Living-illustration hero loop. Poster frame confirms it's the master scene (couple + cats + doves/butterflies) animated. Tiny, mobile-friendly, correct aspect. | none |
| `video/hero-bg-loop-poster.jpg` | **USE** | §2 Hero video poster / LCP fallback | 38 KB | 1080×1350 (4:5) | Matches the video's first frame; correct poster/fallback for the loop. On-style, tiny. | none |

## Result
- **Kept: 6 / 6** (all copied into this folder; originals untouched).
- **Skipped: 0.**

## Flags for the parent
1. **`hero-bg.webp` is 7.36 MB (2304×4096)** — far too heavy for a mobile-web hero background. Needs compression/downscale before ship (known issue confirmed). This is the only blocking issue in this slice.
2. `hero-tall-portrait.webp` carries a baked-in ivory border frame — decide framed vs. full-bleed for the mobile hero; crop if full-bleed.
3. Style/palette coherence across the slice is excellent — `hero-main.webp`, `hero-bg-loop.mp4`, poster, and both meadow backgrounds are visually consistent with the storybook anchor. No mismatches.
