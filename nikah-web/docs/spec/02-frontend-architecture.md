# SPEC 02 — Frontend Architecture

Arsitektur frontend Next.js (App Router, TS, Tailwind). Integrasi motion mengikuti `docs/08–12` & SPEC 06.

---

## 1. Directory (authoritative)

```
app/
  layout.tsx            # <html lang="id">, font, metadata/OG, <MotionProvider><Lenis>
  page.tsx              # urutan <Section/> (single page)
  globals.css           # CSS vars palet + base + Tailwind layers
  api/
    rsvp/route.ts
    wishes/route.ts
components/
  motion/               # MotionProvider, useTier, useGyro, useParallax, useReveal, Lenis, Particles  (SPEC 06)
  hero/                 # Hero, heroLayout.ts, Doves, Butterflies  (docs/09)
  sections/             # Loading, Gate, Welcome, Countdown, Story, Japan, Event, Rsvp, Wishes, Gift, Closing
  ui/                   # AudioToggle, StickyRsvp, ScrollTop, Divider, Toast, Field, Pill, Accordion
  primitives/           # Reveal, FloatLoop, Sway, Breathing, Stagger  (wrapper animasi reusable)
lib/
  config.ts             # SEMUA data acara (SPEC 04 §config)
  motionTokens.ts       # easing/durasi/jarak (docs/08 §3) — SATU sumber
  guest.ts              # decode ?to=
  validation.ts         # skema zod RSVP/wishes (SPEC 03/04)
  sheets.ts             # client Apps Script (server-side)
  ics.ts                # generator Save-to-Calendar
  useWishes.ts          # fetch + cache list wishes
public/assets/...       # mirror aset
```

---

## 2. Component model

- **Section contract** — tiap section = komponen self-contained:
  ```ts
  interface SectionProps { id: string }   // dipakai untuk anchor & ScrollTrigger
  ```
  Wajib: root `<section id>` + `useReveal` untuk entrance + minimal 1 idle motion (primitives) + exit handled by ScrollTrigger. Tidak ada section tanpa gerak (`docs/10 §0`).

- **Primitives reusable** (membungkus aturan anti-kaku, baca tier otomatis):
  | Primitive | Fungsi |
  | :-- | :-- |
  | `<Reveal as delay stagger>` | entrance opacity+y, ScrollTrigger, no-op→fade di REDUCED |
  | `<Breathing amp dur>` | idle scale/y loop, fase acak, pause off-screen |
  | `<Sway deg dur pivot>` | idle rotate loop |
  | `<Stagger gap>` | beri stagger ke anak |
  | `<FloatLoop>` | translateY loop generic |
  Semua menerima `seed?` untuk randomisasi → tidak sinkron.

- **Hero** — komposisi berlapis + timeline (SPEC 06 §hero, `docs/09`). `heroLayout.ts` simpan posisi `% ` tiap layer agar assemble berakhir = komposisi `hero-main.webp`.

---

## 3. Rendering & state

- **Server Components** default untuk shell statis; **Client Components** (`"use client"`) untuk apa pun yang animasi/interaktif (semua di `components/motion`, `hero`, interaktif `sections`).
- **State**: lokal (`useState`/`useReducer`) saja. Tidak ada global store.
  - `MotionContext` → `tier`, `reduced`, `gyro {x,y}`, `gyroEnabled`.
  - `AudioContext` (ringan) → `playing`, `toggle()`.
  - RSVP form state lokal di `Rsvp.tsx`. Wishes list via `useWishes()` (fetch + revalidate).
- **Routing**: satu route `/`. Navigasi internal = smooth scroll (Lenis `scrollTo(id)`); tanpa nav bar terlihat (`docs/02`). Anchor opsional `#rsvp` dst untuk sticky button.

---

## 4. Styling system

- **Tailwind** + **CSS variables** untuk palet (di `globals.css`):
  ```
  --ivory:#FBF7F0; --cream:#F3E9DC; --blush:#F3D9D6; --dusty:#D9A7A0;
  --peach:#F4C9A8; --sage:#A9B89A; --sky:#CFE0E8; --ink:#4a4039;
  ```
- **Type scale**: serif display (heading), sans (body). Skala fluid (`clamp()`), mobile-first.
- **Spacing**: generous whitespace (airy). Section padding besar; teks blok sempit & mudah dibaca.
- **Z-index map** (selaras depth tier `docs/08 §4`): bg 0, content 10, florals 20, particles 25, doves/butterflies 30, overlay UI (sticky/toast) 50, modal 60.
- **motionTokens.ts** = sumber tunggal easing/durasi; jangan hardcode angka di komponen.

---

## 5. Responsive strategy

- **Mobile-first** (desain utama 360–430px). Breakpoints: `sm 640`, `md 768`, `lg 1024`.
- Desktop = versi melebar terkontrol (maks lebar konten ~480–560px terpusat untuk feel "kartu" di layar besar) ATAU layout dua kolom lembut di story/gallery (opsional). Hero boleh full-bleed di desktop.
- Tap target ≥ 44px. Sticky RSVP & ScrollTop hanya mobile.

---

## 6. Image strategy

- `next/image` semua. `priority` untuk layer hero (`hero-bg`, `couple-cutout`, `cat-*`). Sisanya `loading="lazy"`.
- `sizes` eksplisit per konteks (hero penuh vw; aksen kecil fixed px).
- Cats/florals = PNG transparan (sudah di-trim). Scenes = webp. Gallery = jpg.
- Cegah CLS: width/height/aspect-ratio selalu diset.

---

## 7. Accessibility

- `prefers-reduced-motion` → semua primitive jadi fade/no-op (SPEC 06).
- Kontras teks AA di atas ivory; jangan taruh teks penting di atas particle ramai.
- Semantik: `<section aria-label>`, heading hierarki, `<button>` asli, label form, `aria-live` untuk toast & status submit.
- Fokus keyboard terlihat; form bisa diisi tanpa mouse.
- `alt` deskriptif untuk gallery & hero; aset dekoratif `alt=""`/`aria-hidden`.
- Audio default OFF sampai tap; toggle jelas.

---

## 8. Frontend checklist
- [ ] MotionProvider + Lenis di layout
- [ ] motionTokens & CSS palet vars
- [ ] primitives (Reveal/Breathing/Sway/Stagger/FloatLoop)
- [ ] Hero berlapis + heroLayout
- [ ] 11 section memenuhi "section contract"
- [ ] next/image priority/lazy benar
- [ ] reduced-motion & tier gating menyeluruh
- [ ] a11y pass (kontras, fokus, aria-live)

Lanjut: **SPEC 03 — Backend & API**.
