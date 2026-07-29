# 08 — Microinteractions & Accessibility
## Touch Feedback, Forms, Accessibility

**For Google Stitch designers.** How every interactive element feels to touch, and how the invitation remains usable for all guests.

---

## Touch Target Rules

| Rule | Value |
|------|-------|
| Minimum touch target | 48×48px (Material) / 44×44px (iOS) — use 48px |
| Gap between targets | ≥ 8px |
| Thumb zone | Bottom third of viewport for primary CTAs |
| Tap feedback | Visible within 100ms |

---

## Button Microinteractions

### Primary CTA (Buka Undangan, Kirim Konfirmasi, Kirim Ucapan)

| State | Visual | Timing |
|-------|--------|--------|
| Default | Dusty pink pill, shadow-button | — |
| Press | Scale 0.97, shadow-button-press | 150ms ease-out |
| Release | Scale 1.0, shadow-button | 150ms ease-out |
| Loading | Spinner replaces label, button disabled, opacity 0.8 | Until response |
| Success | Brief green flash (success token), then confirmation text | 300ms |
| Error | Brief shake (3px horizontal, 2 cycles), error message below | 400ms |

### Secondary Button (Lihat Peta, Simpan ke Kalender)

| State | Visual |
|-------|--------|
| Default | Transparent, sage border |
| Press | Background fills cream, scale 0.97 |
| Release | Returns to default |

### Sticky RSVP Pill

| State | Visual |
|-------|--------|
| Enter | Fade in + scale from 0.8 to 1.0, 300ms |
| Press | Scale 0.95 |
| Scroll to RSVP section | Fade out, 300ms |
| Scroll away from RSVP | Fade back in, 300ms |

### Copy Button (Salin)

| State | Visual |
|-------|--------|
| Default | "Salin" text |
| Press | Scale 0.97 |
| Success | Text changes to "Tersalin!" for 2 seconds, then reverts |
| Error | "Gagal menyalin" helper text, 2 seconds |

---

## Form Interactions

### Text Input

| State | Visual |
|-------|--------|
| Empty | Cream bg, sage border 30%, placeholder in ink-soft |
| Focus | Sage border 60%, shadow-sm, cursor visible |
| Filled | As default with ink text |
| Error | Error border color, helper text below: "Mohon isi {field name}" |
| Disabled | Opacity 0.5 |

### Radio Pills (Kehadiran)

| State | Visual |
|-------|--------|
| Unselected | Cream bg, ink-soft text, sage border |
| Selected | Peach bg, ink text, no border |
| Press | Scale 0.97 on tap |
| Transition | Background color crossfade 200ms |

### Number Input (Jumlah Hadir)

- Stepper or direct input, range 1–4
- Min 48px height
- Selected value in ink, controls in sage

### Textarea (Ucapan)

- Same styling as text input
- Min height: 80px (3 lines visible)
- Character limit: none (but visual max ~4 lines before scroll)

### Form Submission Flow

```
Tap "Kirim" → Button shows spinner → 
  Success: form fades out, warm confirmation message fades in
  Error: shake + "Terjadi kesalahan, coba lagi" below button
```

---

## Accordion (FAQ)

| Interaction | Behavior |
|-------------|----------|
| Tap header | Body expands/collapses, 300ms ease |
| Chevron | Rotates 180° on expand |
| Only one open | Tapping new item closes previous |
| Touch target | Full header row is tappable (min 48px height) |

---

## Music Toggle

| State | Icon | Behavior |
|-------|------|----------|
| Playing | 🔊 | Tap → mute instantly |
| Muted | 🔇 | Tap → resume instantly |
| Touch target | 40×40px circle, cream bg | Top-right fixed |

---

## Scroll Interactions

| Element | Behavior |
|---------|----------|
| Scroll-to-top button | Appears after 50% scroll depth. Tap → smooth scroll to top |
| Scroll progress bar | 2px blush line, grows with scroll. No interaction |
| Section reveals | Triggered when section enters viewport (60% visible) |
| Parallax | Passive — no interaction required |

---

## Wishes Wall Interactions

| Action | Feedback |
|--------|----------|
| Submit wish | Same as form submission flow |
| New wish appears | Card animates in at top of wall with slight rotation |
| Read wishes | Scroll naturally — cards are not interactive |
| Empty state | "Jadilah yang pertama meninggalkan ucapan 🤍" centered, ink-soft |

---

## Accessibility Requirements

### Color Contrast

| Element | Minimum ratio | Notes |
|---------|--------------|-------|
| Body text (ink on ivory) | 4.5:1 | `#4A4039` on `#FBF7F0` = ~8.5:1 ✓ |
| Large text (headings) | 3:1 | Cormorant on ivory ✓ |
| Button text (ivory on dusty) | 4.5:1 | Verify dusty is dark enough |
| Secondary text (ink-soft) | 4.5:1 | `#7A6E63` on `#FBF7F0` = ~4.6:1 ✓ |
| Error text | 4.5:1 | Warm red on cream |
| Placeholder text | 3:1 minimum | ink-soft meets this |

### Focus Indicators

- Every interactive element has a visible focus ring
- Focus ring: 2px sage outline, 2px offset
- Never remove focus outlines
- Tab order follows visual reading order (top to bottom)

### Screen Reader Support

| Element | Accessible name |
|---------|----------------|
| Buka Undangan button | "Buka undangan pernikahan" |
| Music toggle (on) | "Matikan musik" |
| Music toggle (off) | "Putar musik" |
| Sticky RSVP | "Konfirmasi kehadiran" |
| Scroll to top | "Kembali ke atas" |
| Lihat Peta | "Lihat peta lokasi" |
| Simpan ke Kalender | "Simpan ke kalender" |
| Salin | "Salin nomor rekening" |
| FAQ accordion headers | Question text as label |
| Form fields | Label associated with input |
| Hero illustration | "Ilustrasi pasangan dengan tujuh kucing di padang bunga" |
| Cat photos in story | "{cat name}, kucing Bashara dan Hanifah" |
| Couple photo | "Foto Bashara dan Hanifah" |

### Semantic Structure

- One `<h1>` per section (section title)
- Story chapters use `<h2>`
- FAQ questions use `<h3>` inside accordion
- Form fields have associated `<label>` elements
- Decorative illustrations: `aria-hidden="true"`
- Meaningful images: descriptive `alt` text

### Motion Accessibility

| Preference | Behavior |
|------------|----------|
| `prefers-reduced-motion: reduce` | All animations instant. Ambient loops stopped. Full content visible immediately. See `07-MOTION-AND-CHOREOGRAPHY.md` |
| No preference | Full motion as designed |

### Language

- Page `lang="id"` (Indonesian)
- English hero headline does not need `lang` override (guests expect it)
- Quran verse: no special lang attribute needed

---

## Error States

| Context | Message | Visual |
|---------|---------|--------|
| Empty required field | "Mohon isi {nama field}" | Error border + helper text |
| RSVP submit failure | "Terjadi kesalahan, silakan coba lagi" | Shake + message below button |
| Wish submit failure | Same as above | Same |
| Network offline | "Periksa koneksi internetmu dan coba lagi" | Centered message, retry button |
| Copy failure | "Gagal menyalin" | Brief text below button |

---

## Loading States

| Context | Visual |
|---------|----------|
| Initial load (0–2s) | Sleeping cat illustration + hashtag. No spinner. |
| Gate waiting | Static gate. No timeout. Guest must tap. |
| Hero loading (slow connection) | Progressive: sky → meadow → characters. No blank screen. |
| Form submitting | Button spinner, fields disabled |
| Wishes loading | Skeleton cards (3 placeholder rectangles, cream, subtle pulse) |

---

## Empty States

| Context | Message |
|---------|----------|
| Wishes wall (no wishes yet) | "Jadilah yang pertama meninggalkan ucapan 🤍" |
| RSVP (already submitted) | "Terima kasih, {nama}! Konfirmasimu sudah kami terima. 🤍" |

---

## Keyboard Navigation

For guests using external keyboards (tablet with keyboard, accessibility):

| Key | Action |
|-----|--------|
| Tab | Move between interactive elements |
| Enter / Space | Activate buttons, toggle accordion, select radio |
| Escape | Close any expanded accordion item |

---

## International Guests

- Event address includes enough context for maps (Jl. Ciliwung, near Gedung Sate)
- Date format: 22 Agustus 2026 (Indonesian month name)
- Time: WIB (Western Indonesian Time) labeled explicitly
- Japan bank details use English labels ("Bank", "Account", "Name")
- Indonesia bank details use Indonesian labels ("Bank", "No. Rek", "a.n.")

---

## Performance Perception

| Technique | Purpose |
|-----------|---------|
| Gate shows instantly after loading | Guest never sees blank screen |
| Hero layers load progressively | Slow connections still see sky/meadow while characters load |
| Form submit shows spinner immediately | Guest knows action was received |
| Copy button shows "Tersalin!" instantly | Optimistic feedback |
| Wishes appear at top without full page reload | Feels responsive and alive |
