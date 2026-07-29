# Agent 3 — Couple Imagery Manifest

Verified by opening each file (Read tool) and judging from actual pixels. Duplicates confirmed via SHA-256.

## Kept (copied into this folder)

| file | type | verdict | intended use | reason | issues |
|------|------|---------|--------------|--------|--------|
| couple-cutoutt.png | illustration | USE | Hero + Closing couple cutout | Clean watercolor storybook cutout; bride cream/ivory outfit + taupe hijab, groom deep-navy shirt on dark trousers — correct attire, transparent background, matches palette | FILENAME TYPO: double "t". Parent should rename to `couple-cutout.png` |
| couple-standing-smiling.jpg | photo | USE | Scrapbook gallery — Story ch.3–5 (arch frame + washi-tape) | Highest-value shot per brief: both faces clear, warm genuine smiles, holding hands, clean white studio. Bride white outfit/taupe hijab, groom black shirt/trousers | Real photo — gallery only, never Hero. Style-harmonize to palette later |
| couple-overhead-romantic-pose.jpeg | photo | USE | Scrapbook gallery — romantic beat | Best romantic frame: profile, exchanging a small bouquet, both smiling at each other; spotlight-circle backdrop reads as intentional/editorial | Real photo — gallery only. Dark backdrop needs palette harmonization |
| couple-overhead-bride-bouquet.jpeg | photo | USE | Scrapbook gallery — bouquet beat | Color version: back-to-back, bride holds bouquet, groom smiling to camera. Distinct composition from the romantic-pose shot | Real photo — gallery only |
| couple-overhead-groom-above.jpeg | photo | USE | Scrapbook gallery — playful beat | Both leaning in with big genuine smiles inside the light circle; playful, adds tonal variety to the gallery | Real photo — gallery only |

## Skipped

| file | type | verdict | intended use | reason | issues |
|------|------|---------|--------------|--------|--------|
| couple-standing-smiling-alt.jpg | photo | SKIP | — | EXACT duplicate of couple-standing-smiling.jpg — identical SHA-256 `3f9aa891…67f943` | byte-for-byte dupe |
| couple-standing-casual-pose.jpg | photo | SKIP | — | Same standing setup but neutral/serious expressions; brief favors smiling shots, so lower value | redundant, less warm |
| couple-overhead-bride-bouquet-alt.jpg | photo | SKIP | — | Near-duplicate: black-&-white version of the same back-to-back bouquet pose as bride-bouquet.jpeg (different bytes, hash `7ba5de86…503e3d`) | near-duplicate (B&W) |
| couple-overhead-side-by-side.jpeg | photo | SKIP | — | Groom standing behind, bride seated on cube; serious editorial look, less warm than the kept romantic/playful frames | lower value |
| couple-overhead-lying-romantic.jpeg | photo | SKIP | — | Bride hand-to-forehead "salute" pose, groom turned away — awkward/unflattering framing | lower quality |
| couple-overhead-spotlight-1.jpeg | photo | SKIP | — | Playful side-peek laughing pose; overlaps the kept groom-above playful frame | near-duplicate (playful) |
| couple-overhead-spotlight-2.jpeg | photo | SKIP | — | Neutral looking-away expressions, arm linked; least engaging of the standing/overhead set | lower value |

## Dedupe evidence (SHA-256)

- `couple-standing-smiling.jpg` == `couple-standing-smiling-alt.jpg` → `3f9aa89131f05626346c88cd0cdf9b43ea657009a6f43812ff0390269067f943` (identical — exact dupe)
- `couple-overhead-bride-bouquet.jpeg` → `ddea1ae8559e120a554ae81c7eaf917d6403a394ec8486354f13ebc10e400e6b`
- `couple-overhead-bride-bouquet-alt.jpg` → `7ba5de862f8165b5a39239efff4999178ada08a64621a3a73c27f40dd0503e3d` (B&W variant of same pose — near-dupe, not byte-identical)

## Flag for parent

- `couple-cutoutt.png` has a filename typo (double "t"). Intended corrected name: **`couple-cutout.png`**. Original filename preserved in this folder as instructed.
