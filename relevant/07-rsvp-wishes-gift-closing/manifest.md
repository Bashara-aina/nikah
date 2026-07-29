# Agent 7 — RSVP + Wishes + Gift + Closing (manifest)

Slice verified against style anchor `nikah-web/content/scenes/hero-main.webp` (couple in meadow: bride in white + beige hijab, groom in **navy**, 7 cats — ragdoll, white, black-tuxedo, b/w-tuxedo, orange, sitting tabby, lying tabby — soft watercolor storybook, ivory/blush/sage/dusty-pink palette).

| file | section | content matches brief? | verdict | size | reason | issues |
|------|---------|------------------------|---------|------|--------|--------|
| rsvp-card-corner.webp | S8 RSVP | Yes — watercolor floral corner (pink cosmos + sage foliage) anchored top-left, rest transparent for a cream note-card | USE | 146 KB | Delicate corner decoration, correct storybook style + blush/sage palette | None |
| wishes-washi-tape.webp | S9 Wishes Wall | Yes — torn-edge washi-tape strip, blush floral pattern (peonies/roses) on textured cream paper | USE | 264 KB | Matches washi-tape scrapbook brief, palette + style on point | None |
| gift-envelope-icon.webp | S10 Gift/Tanda Kasih | Yes — cream envelope with blush floral wax seal, calm/grateful (not transactional) tone | USE | 1.9 MB | Correct content + style | **OVERSIZE** — ~1.9MB for a small icon; must be downscaled/re-encoded for a UI icon slot |
| closing-couple-and-cats.webp | S11 Closing | Yes — strongest hero-mirror: groom in **navy**, bride white+beige hijab, all 7 cats in matching arrangement, soft watercolor meadow | **USE (PRIMARY)** | 2.7 MB | Best match to hero outfits, painterly style + palette | **OVERSIZE** — 2.7MB full-bleed scene; compress before ship |
| closing-echo.webp | S11 Closing | Yes — valid mirror (couple + 7 cats + Hoshi peeking at bottom edge built-in), portrait crop | USE (secondary) | 390 KB | Composition mirrors hero; useful as vertical/mobile variant with integrated peek | Groom outfit is **black** (hero is navy); flatter, more saturated anime style vs. hero's soft watercolor — slightly off-anchor |
| closing-hoshi-peek.webp | S11 Closing | Yes — grey/brown tabby (Hoshi) head peeking up from bottom edge, ears + eyes visible, transparent above | USE | 208 KB | Correct peek asset for overlaying on closing bottom edge | None |

**Primary closing piece:** `closing-couple-and-cats.webp` — it mirrors the hero most faithfully (navy groom, beige hijab, watercolor palette + style). `closing-echo.webp` kept as a secondary/mobile-portrait variant with the Hoshi peek already composited.

All 6 assets = USE.
