# Agent 08 — Dividers + Florals + Accents

Slice source: `/Users/basharaaina/Projects/nikah/nikah-web/content/generated/`
All verdicts below are from reading each exact path this turn + PIL alpha/pixel inspection.

| file | purpose | verdict | transparent/clean? | reason | issues |
|---|---|---|---|---|---|
| drapery-divider.webp | Wide white flowing fabric section divider | USE | Yes — RGBA, transparent (580×430) | Organic twisted ivory silk ribbon, horizontal, soft watercolor; reads as fabric not a hard line; on-palette | None |
| floral-corner-tl.webp | Top-left floral corner spray | USE | Yes — RGBA, transparent (446×559) | Blush roses + baby's breath + sage greenery trailing down-right; clean single TL corner; storybook watercolor, on-palette | None |
| floral-corner-br.webp | Bottom-right floral corner spray (mirror of TL) | USE (crop) | Yes — RGBA, transparent (446×559) | Correct style/palette; contains a usable BR cluster | PAIR MISMATCH: file holds TWO clusters (top-left + bottom-right), so it is a full diagonal frame, not a clean single BR corner. Does not cleanly mirror TL and would double-up the TL florals if composited together. Crop to just the bottom-right cluster before use. |
| floral-sprig.webp | Small horizontal garden sprig accent | USE | Yes — RGBA, transparent (446×559) | Cosmos + daisy + sage sprig, horizontal, blush/cream/sage; on-style | Canvas is tall (446×559) with sprig centered — trim whitespace for tighter placement |
| accent-doves.webp | White doves with trailing florals (GSAP motion path) | USE | Yes — RGBA, transparent (607×411) | Two white doves + blush floral trails, airy watercolor; on-palette | Two doves in one file — split into separate elements if each needs an independent motion path |
| accent-butterflies.webp | Cluster of soft-colored butterflies | USE | Yes — RGBA, transparent (655×381) | ~16 blush/cream/butter butterflies, soft watercolor; on-palette | Single sprite sheet — split for per-particle animation |
| accent-petals-scatter.webp | Scattered drifting petals (particle system) | USE | Yes — RGBA, transparent (500×500) | Pink sakura blossoms/petals + tiny flowers scattered; on-palette | Pre-scattered layout; for a real particle system extract a single petal sprite |
| music-note-icon.webp | Active music toggle icon | USE (needs bg removal) | No — RGB, opaque IVORY bg (253,247,233), 816×816 | Delicate note + single blush flower/vine, sketch style, on-palette | Opaque ivory square (not transparent) → visible tile edge over canvas; pencil-sketch look; oversized square |
| music-note-icon-muted.webp | Muted music toggle icon | USE (needs bg removal) | No — RGB, opaque WHITE bg (253,253,252), 816×816 | Note WITH diagonal slash (correct mute indicator), on-palette | Opaque white bg (different tint from active icon); much heavier floral watercolor than active icon |

## Pair-coherence checks (mandatory)

- **Music icons — NOT a coherent matched pair.** The muted variant *does* have a clear diagonal slash (correct mute affordance), but the two do not match: active = simple note + one small flower in a light pencil-sketch on an **ivory** background; muted = note buried in a dense multi-color watercolor bouquet on a **white** background. Different floral density, different rendering weight, and different (opaque) background tints. Both need background removal, and ideally a regenerated matched set (same florals, same bg) so the toggle looks consistent.
- **Floral corners — do NOT cleanly mirror.** `floral-corner-tl` is a single top-left spray. `floral-corner-br` is actually a two-corner diagonal frame (TL + BR clusters), not a single BR spray. Crop it to the bottom-right cluster so it mirrors the TL corner without duplicating florals.

## Compositing / background issues summary

- Clean & composite-ready (true alpha): drapery-divider, floral-corner-tl, floral-corner-br, floral-sprig, accent-doves, accent-butterflies, accent-petals-scatter.
- Needs background knockout before use: music-note-icon (opaque ivory), music-note-icon-muted (opaque white).
- Multi-element sprites to split for animation: accent-doves, accent-butterflies, accent-petals-scatter.
