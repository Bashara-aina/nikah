# 02 — Visual Language
## Color, Typography, Aesthetic Direction

**For Google Stitch designers.** This document defines how the invitation *looks and feels*. Match every generated screen to `stitch/hero-main.png`.

---

## The Mood in One Sentence

A picture book that opens to a meadow on a late summer morning — soft, unhurried, illustrated. Warm ivory carries the page. Everything breathes.

---

## Color Palette

| Token | Name | Hex | Role |
|-------|------|-----|------|
| `--ivory` | Ivory | `#FBF7F0` | Main page background — the "paper" |
| `--cream` | Cream | `#F3E9DC` | Card surfaces, modal backgrounds |
| `--blush` | Blush pink | `#F3D9D6` | Primary soft accent |
| `--dusty` | Dusty pink | `#D9A7A0` | Emphasis, primary CTA buttons |
| `--peach` | Soft peach | `#F4C9A8` | Warm highlight, pill selections |
| `--sage` | Sage green | `#A9B89A` | Botanical accents, borders, icons |
| `--sky` | Soft sky | `#CFE0E8` | Hero background wash |
| `--navy` | Deep navy | `#2C3E5C` | Groom's attire — accent only, never a surface |
| `--ink` | Soft charcoal | `#4A4039` | All body text (never pure black) |
| `--ink-soft` | Muted taupe | `#7A6E63` | Secondary text, captions, labels |
| `--drapery` | White drapery | `#FFFFFF` | Section dividers and overlays |

### Color Rules

- **Ivory is the world.** The whole page is one continuous ivory canvas (`#FBF7F0`). Sections flow into each other — never hard-cut boxes.
- **Never more than 2 strong accents on any screen.** Blush + sage, or dusty + peach. Not all four at once.
- **No pure black, no pure white.** Ink is charcoal-warm; backgrounds are ivory-tinted.
- **Warm shadows only.** Never cool grey — always `rgba(120, 90, 70, 0.06–0.12)`.
- **Committed color strategy:** The page is allowed to feel tinted, not white-neutral. Ivory/blush carry the body; sage and dusty-pink support; peach is the warm highlight.

### Forbidden Colors

- Fuchsia, hot pink, magenta, neon of any kind
- Cool grey (`#808080` type)
- Purple-to-blue gradients
- Gold glitter or metallic finishes

---

## Typography

### Design Intent: Two Primary Families

**Display / Headings — Cormorant Garamond**
Romantic editorial serif with a strong italic. Does emotional work — not just fills space. Feels like handwriting that went to finishing school.

- Used for: couple's names, section titles, pull quotes, Yasin verse, countdown numbers
- Weight: Light to regular (300–400). Heavy serif feels wrong here.
- Italic for pull quotes and romantic emphasis

**Body — Plus Jakarta Sans**
Warm humanist sans. Clean and readable in Indonesian. Feels like a thoughtful friend typed it — not corporate, not geometric-cold.

- Used for: all body copy, labels, form fields, event details, FAQ
- Weight: 400–500 for body; 600 only for button labels
- Line height: 1.6. Airy, never cramped.

**Script Accent (Calligraphic, Sparingly)**
Used ONLY for: the couple's names (**Bashara & Hanifah**) on the gate and the hashtag (**#BASHicallyHANI's**).

- Never for body copy, never for navigation, never for buttons
- Single use per screen maximum

### Type Scale (Mobile-first)

| Name | Size | Used for |
|------|------|----------|
| Display | `clamp(2.2rem, 8vw, 3.5rem)` | Couple names, hero headline |
| H1 | `clamp(1.6rem, 6vw, 2.4rem)` | Section titles |
| H2 | `clamp(1.25rem, 4.5vw, 1.6rem)` | Sub-headers, story chapter titles |
| Body | `1rem` | Paragraphs |
| Small | `0.85rem` | Labels, captions, metadata |

### Typography Rules

- Hero heading ceiling ≤ 6rem
- Display letter-spacing floor ≥ -0.04em
- Body weight ≥ 400; line length capped at 65–75ch
- Maks lebar baca teks: ~38–46ch (blok sempit di tengah pada mobile)
- Indonesian body copy always in Plus Jakarta Sans; English hero line in Cormorant Garamond italic acceptable

---

## Aesthetic Language

### What It Looks Like

- **Arch frames** for all images (rounded tops, like storybook windows)
- **Asymmetric florals** — flowers on ONE side only, never perfectly mirrored
- **White drapery dividers** between sections — fabric, not lines
- **Scrapbook gallery** — photos placed with slight rotation and offset within story/event context, never a uniform grid
- **Generous whitespace** between everything — this page breathes
- **One dominant idea per fold** — hero → welcome → story → events → wishes/gift → closing

### Surface Qualities

| Element | Treatment |
|---------|-----------|
| Backgrounds | Ivory `#FBF7F0`, never flat white |
| Cards | Cream, floating gently on ivory with warm soft shadow |
| Borders | Thin, sage or blush at 40% opacity — barely visible |
| Corner radius | 20–24px for cards, 14px for inputs, pill (999px) for buttons |
| Shadows | sm: `0 2px 8px rgba(120,90,70,.06)` · md: `0 8px 24px rgba(120,90,70,.10)` · lg: `0 16px 40px rgba(120,90,70,.12)` |

### What It Does NOT Look Like

- SaaS landing page with numbered sections and identical card grids
- Minimalist cream-on-white with Fraunces headlines and drop caps (the "AI wedding site" tell)
- Indonesian wedding template with gold filigree and ribbon banners
- Corporate or structured — no nav bars, no header/footer, no sidebar
- Heavy, dark, dramatic — this is morning light, not candlelight dinner
- Nested cards, side-stripe accent borders, identical card grids

---

## Image Treatment

**Couple and cat reference photographs (`stitch/`):**
Style-harmonized to the palette (ivory/blush warmth), but faces and composition are never distorted. These are real people and real cats. Treat their photos with care — subtle tone adjustment only, then placed in scrapbook layout for gallery use within story and event sections.

**Illustration world:**
The hero scene, story sections, and decorative elements use a whimsical illustrated style — not photographic, not flat vector. Think: soft watercolor-adjacent, warm colors, the couple and cats look illustrated but recognizable. Match `stitch/hero-main.png` exactly.

**Rule:** Real photographs and stylized illustrations are **NEVER blended in the same frame**. They live in different visual contexts and serve different emotional purposes — illustrations in hero/story/decorative; photographs in scrapbook gallery moments.

---

## Signature Shape Language

These elements make it a storybook, not a generic page:

1. **Drapery dividers** — white flowing cloth between sections, not hard edges
2. **Asymmetrical floral framing** — one side only, never mirrored
3. **Arch shapes** — for image frames, gate card, event venue block
4. **Scrapbook gallery** — scatter + slight per-photo rotation within narrative context
5. **One continuous ivory canvas** — sections alternate subtly with cream, not boxed

---

## Atmosphere Reference

Close your eyes and imagine: it's 9am on a summer morning. You're standing at the edge of a wildflower meadow. The air is soft and warm. Someone hands you a handwritten letter, and when you open it, there are drawings of two people and seven cats inside.

**That is exactly the feeling this invitation should produce.**

---

## Dark Mode

Out of scope. One controlled light theme only.
