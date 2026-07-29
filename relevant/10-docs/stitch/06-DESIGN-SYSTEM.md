# 06 — Design System
## Tokens, Components, States

**For Google Stitch designers.** Reusable visual building blocks for every screen. All values reference `02-VISUAL-LANGUAGE.md`.

---

## Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `ivory` | `#FBF7F0` | Page canvas, gate background |
| `cream` | `#F3E9DC` | Cards, form surfaces, wish cards |
| `blush` | `#F3D9D6` | Accents, scroll progress, selection highlight |
| `dusty` | `#D9A7A0` | Primary CTA buttons, active states |
| `peach` | `#F4C9A8` | Selected pills, warm highlights |
| `sage` | `#A9B89A` | Borders, icons, botanical accents |
| `sky` | `#CFE0E8` | Hero sky wash |
| `navy` | `#2C3E5C` | Groom accent only — text, illustration detail |
| `ink` | `#4A4039` | Primary text |
| `ink-soft` | `#7A6E63` | Secondary text, placeholders |
| `drapery` | `#FFFFFF` | Section dividers, overlays |
| `error` | `#C4706A` | Form validation errors (warm red, not alert red) |
| `success` | `#8FA882` | Confirmation states (warm green) |

---

## Typography Tokens

| Token | Family | Size | Weight | Usage |
|-------|--------|------|--------|-------|
| `display` | Cormorant Garamond | clamp(2.2rem, 8vw, 3.5rem) | 300 | Couple names, hero |
| `h1` | Cormorant Garamond | clamp(1.6rem, 6vw, 2.4rem) | 400 | Section titles |
| `h2` | Cormorant Garamond | clamp(1.25rem, 4.5vw, 1.6rem) | 400 | Chapter titles, sub-headers |
| `body` | Plus Jakarta Sans | 1rem | 400 | Paragraphs, labels |
| `body-small` | Plus Jakarta Sans | 0.85rem | 400 | Captions, metadata |
| `button` | Plus Jakarta Sans | 1rem | 600 | CTA labels |
| `script` | Script accent | contextual | — | Names, hashtag only |
| `countdown` | Cormorant Garamond | clamp(2.5rem, 10vw, 4rem) | 300 | Countdown numbers |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Icon gaps |
| `space-sm` | 8px | Between related elements |
| `space-md` | 16px | Card padding, form field gaps |
| `space-lg` | 24px | Section internal padding |
| `space-xl` | 40px | Between content blocks |
| `space-2xl` | 64px | Between sections (before drapery) |
| `space-3xl` | 96px | Major section breaks |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 8px | Small badges |
| `radius-md` | 14px | Input fields, small cards |
| `radius-lg` | 20–24px | Cards, wish cards |
| `radius-arch` | 50% 50% 0 0 | Arch frames (top corners only) |
| `radius-pill` | 999px | Buttons, pills, sticky RSVP |

---

## Shadow Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 2px 8px rgba(120,90,70,.06)` | Subtle lift — inputs |
| `shadow-md` | `0 8px 24px rgba(120,90,70,.10)` | Cards, gate frame |
| `shadow-lg` | `0 16px 40px rgba(120,90,70,.12)` | Hero text overlay, modals |
| `shadow-button` | `0 4px 12px rgba(120,90,70,.15)` | CTA buttons at rest |
| `shadow-button-press` | `0 1px 4px rgba(120,90,70,.10)` | CTA buttons pressed |

---

## Components

### Button — Primary (CTA)

```
Background: dusty (#D9A7A0)
Text: ivory (#FBF7F0), Plus Jakarta Sans 600
Shape: pill (radius-pill)
Padding: 14px 32px
Min height: 48px
Shadow: shadow-button
```

| State | Treatment |
|-------|-----------|
| Default | As above |
| Hover/Press | Scale 0.97, shadow-button-press |
| Disabled | Opacity 0.5, no shadow |
| Loading | Text replaced by small spinner, disabled |

Used for: Buka Undangan, Kirim Konfirmasi, Kirim Ucapan

### Button — Secondary

```
Background: transparent
Border: 1px sage at 40% opacity
Text: ink, Plus Jakarta Sans 500
Shape: pill
Padding: 12px 24px
Min height: 44px
```

Used for: Lihat Peta, Simpan ke Kalender, Salin

### Button — Sticky RSVP

```
Background: dusty (#D9A7A0)
Text: "RSVP", ivory, Plus Jakarta Sans 600
Shape: pill
Size: 56×56px circle (or pill with padding)
Position: fixed, bottom-right, 24px from edges
Shadow: shadow-lg
Z-index: above content, below modals
```

| State | Treatment |
|-------|-----------|
| Visible | After hero assemble completes |
| Hidden | When RSVP section is in viewport |
| Press | Scale 0.95 |

### Input Field

```
Background: cream (#F3E9DC)
Border: 1px sage at 30% opacity
Text: ink, Plus Jakarta Sans 400
Placeholder: ink-soft
Radius: radius-md (14px)
Padding: 12px 16px
Min height: 48px
```

| State | Treatment |
|-------|-----------|
| Default | As above |
| Focus | Border sage at 60%, subtle shadow-sm |
| Error | Border error, helper text below in error color |
| Filled | As default |

### Radio / Pill Selection (RSVP attendance)

```
Unselected: cream bg, ink-soft text, 1px sage border
Selected: peach bg (#F4C9A8), ink text, no border
Shape: pill
Padding: 10px 20px
Gap: 8px between options
Min height: 44px each
```

Options: Hadir · Tidak Hadir · Masih Diusahakan

### Card — Note Card (RSVP, Wishes form)

```
Background: cream (#F3E9DC)
Radius: radius-lg (20px)
Padding: space-lg (24px)
Shadow: shadow-md
Max width: 90vw on mobile, 480px on wider
```

### Card — Wish Wall Entry

```
Background: cream, slight random rotation (±2°)
Radius: radius-lg
Padding: space-md
Shadow: shadow-sm
Optional: small washi-tape graphic at top corner
```

### Accordion — FAQ

```
Header: h2 Cormorant Garamond, ink, with chevron icon (sage)
Body: body Plus Jakarta Sans, ink-soft
Divider: 1px blush at 20% between items
Expanded: chevron rotates 180°, body fades in
Padding: space-md vertical per item
```

### Arch Frame

```
Shape: radius-arch (50% 50% 0 0 on top corners)
Border: optional 2px sage at 30%
Overflow: hidden (image clipped to arch)
Usage: story illustrations, couple photos, venue image
```

### Drapery Divider

```
Element: white flowing fabric illustration
Height: ~60–80px
Width: 100vw
Position: between sections
Treatment: soft gradient fade into ivory above and below
No hard line — fabric flows
```

### Scrapbook Photo

```
Container: arch frame or free-form with slight rotation (±2–4°)
Accent: washi tape strip or push-pin illustration at corner
Shadow: shadow-md
Offset: slight horizontal shift from center (not aligned to grid)
Max width: 70vw on mobile
```

### Music Toggle

```
Size: 40×40px circle
Background: cream with shadow-sm
Icon: 🔊 or 🔇
Position: fixed, top-right, 16px from edges
```

### Scroll Progress

```
Height: 2px
Color: blush (#F3D9D6)
Position: fixed top
Width: 0–100% based on scroll depth
```

---

## Layout Grid

Mobile portrait (primary):

```
Viewport: 375–430px wide
Content max-width: 90vw, centered
Side padding: 20px
Text block max-width: 38–46ch, centered
Thumb zone: bottom 33% of viewport
```

---

## Icon Style

- Line icons, 1.5px stroke, sage or ink-soft color
- No filled icons except music toggle emoji
- Size: 20×20px inline, 24×24px standalone
- Chevron, map pin, calendar, copy, scroll-up arrow

---

## Illustration Style Guide

| Context | Style |
|---------|-------|
| Hero | Full illustrated scene — watercolor-adjacent, warm, layered |
| Story chapters | Small vignette illustrations, alternating sides |
| Japan section | Sakura, campus, train motifs — same illustration style |
| Decorative | Doves, butterflies, florals — light, asymmetric |
| Cats in hero | Illustrated versions matching `stitch/` reference photos |
| Cats in closing | Same illustrated style, one peeking from bottom edge |
| Loading | Sleeping cat in floral wreath — small, simple |

---

## Z-Index Layers

| Layer | Z-index | Content |
|-------|---------|---------|
| Canvas | 0 | Section content |
| Drapery | 10 | Section dividers |
| Sticky UI | 100 | RSVP button, music toggle, scroll progress |
| Hero text | 50 | Overlaid on hero illustration |
| Gate | 200 | Full-screen gate (before open) |
| Loading | 300 | Full-screen loading (before gate) |
| Modal/Toast | 400 | Confirmations, errors |

---

## Responsive Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| Mobile (primary) | 320–430px | Single column, full design intent |
| Tablet | 431–768px | Slightly wider text blocks, same layout |
| Desktop | 769px+ | Centered column max 480px, same mobile layout |

Design for mobile first. Desktop is a centered phone-width column — not a redesigned layout.
