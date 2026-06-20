# Design

> Pre-implementation seed. Once the Next.js app ships and CSS tokens land, re-run `/impeccable document` to capture the real visual system from code. This file sets intent, not commitments.

## Aesthetic lane

Storybook fairytale, warm-morning edition. Not editorial-typographic (Klim/Magazine lane) — the brief is romance, not magazine. Not SaaS-cream-minimal — the brief commits to a colored surface. Not brutalist; not maximalist.

**Reference sentence for the modal wedding site:** A single-page invitation that opens like a picture book, with flowing white drapery, asymmetrical florals, arch-shaped frames, and the seven cats tucked into the love story. Mobile portrait first. Late summer morning light, soft and unhurried.

This is a **Committed** color strategy: ivory/blush carry the body, sage and dusty-pink support, peach is the warm highlight. The page is allowed to feel tinted, not white-neutral.

## Color

OKLCH throughout. The brief already names the palette — honor it, do not default to warm-neutral cream.

| Role | Token | Approx OKLCH | Notes |
| --- | --- | --- | --- |
| Page surface (light) | `--paper` | `oklch(0.97 0.012 80)` | Ivory, tinted toward the brand's own warm hue. Not chroma-0 white. |
| Drapery / overlay | `--drape` | `oklch(0.99 0.005 80)` | Slightly higher L than paper; near-white but in-family. |
| Soft surface (cards, modals) | `--cream` | `oklch(0.94 0.018 75)` | A touch more chroma than paper; sits one step down. |
| Primary accent | `--blush` | `oklch(0.82 0.055 15)` | Blush pink. The dominant accent. |
| Secondary accent | `--dusty-pink` | `oklch(0.74 0.06 10)` | Dustier, used sparingly for emphasis. |
| Warm highlight | `--peach` | `oklch(0.86 0.07 55)` | Sparingly; the warmest note on the page. |
| Botanical support | `--sage` | `oklch(0.78 0.04 145)` | Greenery. Used in floral SVG and one-shot highlights, not full surfaces. |
| Body ink | `--ink` | `oklch(0.32 0.012 60)` | Soft charcoal/taupe, NOT pure black. Body text contrast ≥ 4.5:1 on `--paper`. |
| Muted ink | `--ink-muted` | `oklch(0.52 0.015 60)` | For meta, captions, secondary lines. Contrast ≥ 4.5:1. |
| Hairline / divider | `--hairline` | `oklch(0.88 0.01 70)` | Low-contrast dividers; never replace `--ink` rules. |

Dark mode is **out of scope** for v1. One controlled light theme.

**Color anti-rules (per impeccable brand bans and the brief):** no fuchsia, no hot pink, no glitter gradients, no gray-on-tinted-bg placeholder text. No purple-to-blue gradients.

## Typography

Voice: warm, intimate, Indonesian primary, English for romantic accent lines only.

**Selection procedure** (already partially constrained by the brief): elegant serif for headings, clean premium sans for body, optional script accent for the couple's names and the hashtag. Reject the training-data reflex fonts:

- Headings — serif candidates (avoid Fraunces, Newsreader, Lora, Crimson, Cormorant, Playfair Display): explore Pangram Pangram, Klim, Future Fonts, or a non-listed Google family with strong italic personality. Italic must do real work; the headlines are romantic, not declarative.
- Body — sans candidates (avoid Inter, DM Sans, IBM Plex Sans, Plus Jakarta Sans, Instrument Sans, Outfit): look for a humanist sans with warmth and a readable italic. Body weight ≥ 400, line-height ≥ 1.6, line length capped at 65–75ch.
- Script accent — single family, only for the couple's names and `#BASHicallyHANI's`. Never for body, never for nav.

**Scale:** modular, fluid `clamp()`. Hero heading ceiling ≤ 6rem. Display letter-spacing floor ≥ -0.04em. `text-wrap: balance` on h1–h3; `text-wrap: pretty` on long-form copy.

## Layout

Mobile portrait is the primary canvas. Layout is one continuous scroll with no visible chrome navigation; sections transition via drapery overlays and floral dividers.

- One dominant idea per fold. Hero → welcome → story → events → wishes/gift → closing.
- Asymmetrical floral framing on hero and section dividers (one side only, not mirrored).
- Arch shapes for image frames and the gate card.
- Gallery in scrapbook layout: images placed with slight rotation and offset, never a uniform grid.
- Spacing uses fluid `clamp()` and varies for rhythm. Tight groupings within sections, generous separation between sections.
- No side-stripe accent borders. No nested cards. No identical card grids.

## Components

Pre-implementation inventory — once components land in `nikah-web/components/`, this list captures the agreed surface area:

- `Gate` — opening page with guest name and "Buka Undangan" CTA. Triggers audio start.
- `Hero` — layered reveal scene with the couple and the cats.
- `Countdown` — hari · jam · menit until 22 August 2026.
- `Welcome` — Surah Yasin 36 verse and Indonesian greeting.
- `StoryTimeline` — chronological love story, short lines, third-person voice.
- `EventCard` — venue, time, dress code.
- `RsvpForm` — Google Sheets via Apps Script, with loading / success / error states.
- `WishesWall` — public read, authenticated submit.
- `GiftSection` — bank details / links, grateful voice, no CTA pressure.
- `Closing` — names, hashtag, and a quiet farewell.
- `LoadingScreen` — 1–2 second, then auto-advance.
- `MusicToggle` — explicit on/off, persistent across sections.
- `ReducedMotionProvider` — global gate for video/animation fallback.

## Motion

Two layers, intentionally:

- **fal.ai layer.** Idle/ambient life in illustrations and scene loops. Cat characters breathe, florals sway, the meadow moves. All videos ship with PNG poster fallbacks and pause when off-screen.
- **GSAP layer.** Orchestrated entrance, parallax, hero assemble, scroll-driven section transitions. Reduced-motion replaces every GSAP entrance with a static fade or instant reveal.
- **CSS layer.** Drapery divider sway, floral corner drift. Cheap, decorative, low-energy.

Rules from the brand register: no bounce, no elastic easing. Ease-out-quart/quint/expo. Reveals enhance an already-visible default — content is never gated on a class-triggered transition (hidden tabs and headless renderers would ship blank).

## Imagery

Identity-bearing photographs (`FOTO INVITATION/`) appear exactly once each, in the gallery. fal.ai `flux/dev/image-to-image` at strength 0.25–0.35 harmonizes palette to the storybook ivory/blush while preserving faces and composition. These are **never** turned into video.

AI reference illustrations (`correct/most correct/`) define the visual world. fal.ai rmbg + img2vid / img2img produces the production illustrations and idle loops.

`scenes/` references feed the hero meadow loop via `minimax/video-01-live`.

Real photographs and stylized illustrations are **never blended in the same frame**. Photographs are photograph-treated (lightly harmonized, scrapbook-laid). Illustrations are illustration-treated (idle looped, parallax-driven).

## Accessibility & Inclusion

- Body text ≥ 4.5:1, large text ≥ 3:1 — verify against `--paper` and `--cream`, not against mockup screenshots.
- `prefers-reduced-motion: reduce` falls back every video to its PNG poster and every GSAP entrance to a static fade.
- Keyboard reachable: gate button, RSVP form, wishes form, music toggle. Visible focus rings in `--ink` at 2px.
- Touch targets ≥ 44×44px.
- Alt text is part of the voice: "Bashara and Hanifah standing under morning light, soft smiles" beats "couple photo".
- Bahasa Indonesia copy reviewed for inclusive language. No assumptions about the religious verse beyond the couple's stated choice.
- Personal-link guest names are URL-supplied only; no PII is stored client-side beyond the URL value.

## Open questions for craft time

- Concrete font picks. Intent is set; selection happens when the app builds, with the ban list honored.
- Whether `--peach` earns its place or whether blush + dusty-pink carry the warmth alone (likely: peach survives as a single highlight, not as a section surface).
- Whether wishes are moderated before display or shown immediately. Default: shown immediately, with a server-side rate limit and a soft-hidden filter.
- Gift section content (bank details / addresses) is **not** committed in this seed — it lives in operational docs, not the design system.