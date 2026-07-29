# NIKAH WEDDING SITE — MASTER TECHSTACK & CREATIVE BRIEF
> **Pasang file ini sebagai context pertama di Cursor sebelum menulis satu baris kode.**
> Setelah membaca seluruh file ini, Cursor akan membuat **5 IMPL-*.md** terpisah (lihat §10).
> Deadline live: **22 Agustus 2026** — Bashara & Hanifah, Widuri Restaurant, Bandung.

---

## §0 — NORTH STAR: WHAT THIS SITE MUST FEEL LIKE

Bukan undangan digital biasa. Ini adalah **buku cerita interaktif yang hidup di layar HP**.
Setiap halaman adalah scena — karakter bergerak, bunga berayun, suara mengalun.
Tamu membuka undangan dan langsung merasa masuk ke dunia pastel storybook yang hangat.

**Tiga kata kunci desain:**
- **Hidup, bukan kaku** — setiap elemen bernafas, tidak ada yang diam total
- **Pastel storybook** — palet ivory/cream/blush/dusty rose, gaya ilustrasi buku dongeng
- **Mobile-first intimacy** — 375px adalah kanvas utama; setiap sentuhan terasa personal

---

## §1 — TECH STACK (LOCKED — JANGAN GANTI)

### Core Framework
```
Next.js          16.2.9   (App Router, static export)
React            19.2.4
TypeScript       ^5
```

### Animation Engine
```
GSAP             ^3.15.0  (ScrollTrigger, Timeline, Ticker)
@studio-freight/lenis  ^1.0.42  (smooth scroll — integrasi wajib dengan GSAP ScrollTrigger)
```

### Styling
```
Tailwind CSS     ^4       (via @tailwindcss/postcss)
CSS Variables    (design tokens — lihat §4)
```

### Validation & Data
```
Zod              ^4.4.3   (validasi RSVP form)
Google Sheets    (backend data RSVP via Apps Script webhook)
Google Apps Script  (endpoint: POST, read RSVP, personalisasi tamu via ?to=)
```

### AI Asset Generation — MiniMax API
```
Provider:        MiniMax  (https://api.minimaxi.chat)
Model Image:     image-01  (untuk generate ilustrasi story yang masih missing)
Model Video:     video-01-live  (untuk ambient loop video jika diperlukan)
Env var:         MINIMAX_API_KEY=<isi di .env.local>
Endpoint image:  POST https://api.minimaxi.chat/v1/image_generation
Endpoint video:  POST https://api.minimaxi.chat/v1/video_generation

KAPAN DIPAKAI:
- Generate 5 ilustrasi story yang missing: story-motor, story-jakarta,
  story-ldr, story-keio, story-married
- Referensi gaya WAJIB: assets/scenes/hero-main.webp (pastel storybook, flat illustration)
- Output: simpan ke assets/illustrations/, lalu npm run copy-assets

JANGAN gunakan MiniMax untuk aset yang sudah ada di assets/ — sudah siap pakai.
```

### Deploy
```
Vercel           (static export, edge CDN)
Domain:          custom (konfigurasi di Vercel dashboard)
```

### Dev Tools
```
ESLint           ^9  (eslint-config-next)
scripts/copy-assets.mjs  (mirror assets/ → nikah-web/public/assets/)
```

---

## §2 — FOLDER STRUCTURE (FINAL — INI YANG BERLAKU)

```
nikah/
├── assets/                        ← SEMUA ASET MASTER (jangan edit langsung)
│   ├── scenes/                    ← latar opaque .webp (object-fit: cover)
│   │   ├── hero-main.webp         ← 4:5 — HERO UTAMA (pasangan + kucing di padang bunga)
│   │   ├── hero-tall.webp         ← 9:16 — full-bleed mobile fallback
│   │   ├── hero-bg.webp           ← landscape, tanpa orang — parallax layer
│   │   └── countdown-bg.webp      ← soft opaque band untuk countdown
│   ├── cats/                      ← 8 kucing transparan .png — TRIMMED, NO PADDING
│   │   ├── cat-jiro.png
│   │   ├── cat-meng.png
│   │   ├── cat-moju.png
│   │   ├── cat-shiro.png
│   │   ├── cat-simba.png
│   │   ├── cat-hoshi.png
│   │   ├── cat-kimho.png
│   │   └── cat-peek.png           ← hanya kepala mengintip (dipakai di cat-peek interaction)
│   ├── couple/
│   │   └── couple-cutout.png      ← pasangan berdiri, transparan, trimmed
│   ├── florals/                   ← dekorasi transparan .png — TRIMMED
│   │   ├── floral-corner-tl.png   ← sudut kiri atas
│   │   ├── floral-corner-br.png   ← sudut kanan bawah
│   │   ├── floral-sprig.png       ← sprig kecil untuk aksen
│   │   ├── floral-border-full.png ← bingkai penuh untuk gate/envelope
│   │   ├── drapery-divider.png    ← divider antar section
│   │   ├── arch-frame.png         ← arch untuk section event/akad
│   │   ├── accent-doves.png       ← merpati terbang
│   │   └── accent-butterflies.png ← kupu-kupu
│   ├── illustrations/             ← ilustrasi per-section transparan .png
│   │   ├── loading-motif.png      ✅ ready
│   │   ├── welcome-accent.png     ✅ ready
│   │   ├── story-meeting.png      ✅ ready  (chapter 1)
│   │   ├── story-growing.png      ✅ ready  (chapter 2 — bisa jadi fallback)
│   │   ├── japan-motif.png        ✅ ready
│   │   ├── event-accent.png       ✅ ready
│   │   ├── gift-accent.png        ✅ ready
│   │   ├── map-pin.png            ✅ ready
│   │   ├── gallery-frame.png      ✅ ready
│   │   ├── story-motor.png        ⚠️ MISSING — generate via MiniMax
│   │   ├── story-jakarta.png      ⚠️ MISSING — generate via MiniMax
│   │   ├── story-ldr.png          ⚠️ MISSING — generate via MiniMax
│   │   ├── story-keio.png         ⚠️ MISSING — generate via MiniMax
│   │   └── story-married.png      ⚠️ MISSING — generate via MiniMax
│   ├── gallery/                   ← 9 foto prewedding ASLI .jpg (~1067×1600, 50-130KB)
│   │   ├── gallery-01.jpg … gallery-09.jpg
│   │   └── (gallery-03 landscape — biarkan, foto candid lebar)
│   └── audio/
│       └── la-vie-en-rose.mp3     ← Daniela Andrade cover, backsound utama
│
├── docs/                          ← BUILD BIBLE (baca semua sebelum coding)
│   ├── spec/01-13.md              ← spec engineering + UX
│   ├── build/stage-1-7.md        ← runbook build berurutan
│   └── 01-12.md                   ← konsep, copywriting, motion, aset
│
└── nikah-web/                     ← Next.js app
    ├── app/
    │   ├── page.tsx               ← root page (single page app)
    │   ├── layout.tsx             ← html/body, font load, metadata
    │   ├── globals.css            ← design tokens + base styles
    │   └── api/
    │       ├── rsvp/route.ts      ← POST: forward ke Google Apps Script
    │       └── minimax/route.ts   ← POST: proxy MiniMax calls (jaga API key)
    ├── components/
    │   ├── gate/                  ← Envelope + audio unlock
    │   ├── hero/                  ← LayeredHero + parallax
    │   ├── story/                 ← ScrollStory chapters
    │   ├── countdown/             ← CountdownTimer
    │   ├── event/                 ← EventCard + MapLink
    │   ├── gallery/               ← PhotoGrid + Lightbox
    │   ├── rsvp/                  ← RSVPForm + ConfettiBlast
    │   ├── gift/                  ← GiftSection
    │   ├── closing/               ← ClosingScene + cats
    │   └── shared/                ← AnimatedImage, ParticleCanvas, AudioManager
    ├── lib/
    │   ├── copy.ts                ← semua teks (personalisasi via guestName)
    │   ├── motion.ts              ← GSAP ease tokens + helper functions
    │   ├── lenis.ts               ← Lenis setup + GSAP ticker integration
    │   ├── minimax.ts             ← MiniMax API client
    │   └── utils.ts               ← helpers (cn, formatDate, etc.)
    ├── hooks/
    │   ├── useGuestName.ts        ← parse ?to= dari URL
    │   ├── useGyro.ts             ← deviceorientation dengan permission prompt
    │   ├── useAudio.ts            ← play/pause/fade audio state
    │   └── useReducedMotion.ts    ← prefers-reduced-motion
    ├── public/assets/             ← MIRROR dari assets/ (via npm run copy-assets)
    ├── scripts/
    │   └── copy-assets.mjs        ← mirror script (sudah ada)
    └── package.json
```

---

## §3 — ENVIRONMENT VARIABLES

File: `nikah-web/.env.local` (JANGAN commit ke git)

```env
# MiniMax AI API
MINIMAX_API_KEY=<dari MiniMax dashboard>
MINIMAX_GROUP_ID=<group_id dari MiniMax>

# Google Apps Script RSVP webhook
RSVP_WEBHOOK_URL=https://script.google.com/macros/s/<deployment_id>/exec

# Personalisasi (opsional, default di copy.ts)
NEXT_PUBLIC_COUPLE_NAMES=Bashara & Hanifah
NEXT_PUBLIC_WEDDING_DATE=2026-08-22T08:00:00+07:00
NEXT_PUBLIC_VENUE_NAME=Widuri Restaurant, Bandung
```

Tambahkan ke `.env.local.example`:
```env
MINIMAX_API_KEY=
MINIMAX_GROUP_ID=
RSVP_WEBHOOK_URL=
NEXT_PUBLIC_COUPLE_NAMES=
NEXT_PUBLIC_WEDDING_DATE=
NEXT_PUBLIC_VENUE_NAME=
```

---

## §4 — DESIGN TOKENS (CSS VARIABLES — globals.css)

```css
:root {
  /* === PALET WARNA UTAMA === */
  --color-ivory:        #FBF7F0;   /* bg utama */
  --color-cream:        #F3E9DC;   /* surface cards */
  --color-blush:        #F3D9D6;   /* aksen lembut */
  --color-dusty:        #D9A7A0;   /* dusty rose — primary accent */
  --color-dusty-dark:   #B07E78;   /* hover dusty */
  --color-sage:         #A9B89A;   /* aksen hijau daun */
  --color-sage-dark:    #7D9070;
  --color-ink:          #4A4039;   /* teks utama */
  --color-ink-muted:    #8A7E75;   /* teks sekunder */
  --color-ink-faint:    #C4B8B0;   /* teks tersier / label */

  /* === SHADOW (warm-tinted, bukan gray dingin) === */
  --shadow-petal:       0 2px 8px rgba(120,90,70,0.06);
  --shadow-card:        0 4px 16px rgba(120,90,70,0.10);
  --shadow-float:       0 12px 32px rgba(120,90,70,0.12);

  /* === SPACING (4px base) === */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */

  /* === TYPOGRAPHY === */
  --font-display:  'Cormorant Garamond', 'Georgia', serif;
  --font-body:     'Lato', 'Helvetica Neue', sans-serif;

  --text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.8rem  + 0.35vw, 1rem);
  --text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 1rem    + 0.75vw, 1.5rem);
  --text-xl:   clamp(1.5rem,   1.2rem  + 1.25vw, 2.25rem);
  --text-2xl:  clamp(2rem,     1.2rem  + 2.5vw,  3.5rem);
  --text-hero: clamp(2.5rem,   1rem    + 5vw,    5rem);

  /* === RADIUS === */
  --radius-sm:   0.375rem;
  --radius-md:   0.5rem;
  --radius-lg:   0.75rem;
  --radius-xl:   1rem;
  --radius-2xl:  1.5rem;
  --radius-full: 9999px;

  /* === TRANSITIONS === */
  --ease-settle:  cubic-bezier(0.34, 1.56, 0.64, 1);   /* spring bounce kecil */
  --ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);       /* smooth decelerate */
  --ease-in-soft:  cubic-bezier(0.4, 0, 1, 1);
  --transition-ui: 180ms var(--ease-out-soft);

  /* === MOTION DURATION === */
  --dur-instant:  0.15s;
  --dur-fast:     0.3s;
  --dur-mid:      0.5s;
  --dur-slow:     0.8s;
  --dur-dramatic: 1.2s;
}
```

---

## §5 — GSAP MOTION CONFIG (lib/motion.ts)

```typescript
// EASING TOKENS — gunakan ini di semua gsap.to() calls
export const ease = {
  settle:   'cubic-bezier(0.34, 1.56, 0.64, 1)',   // spring kecil untuk entrance
  outSoft:  'cubic-bezier(0.16, 1, 0.3, 1)',         // smooth untuk parallax
  inSoft:   'cubic-bezier(0.4, 0, 1, 1)',
  linear:   'none',
} as const

// STAGGER CONFIG — untuk multi-element entrance
export const stagger = {
  cats:       { each: 0.08, from: 'random' },
  florals:    { each: 0.06, from: 'start' },
  chapters:   { each: 0.12, from: 'start' },
  gallery:    { each: 0.05, from: 'start' },
} as const

// IDLE ANIMATION PRESETS
// Kucing: breathing y±2-4px, durasi 2.8-3.6s (random per kucing untuk desync)
// Floral corner: sway rotate ±1.2°, pivot transform-origin bottom-center
// Doves/butterflies: float y±8px + rotate ±3°, durasi 4-6s
// Particles: fade in/out opacity 0→0.6→0, scale 0.4→1→0

// SCROLL TRIGGER DEFAULT CONFIG
export const scrollTriggerDefaults = {
  start: 'top 85%',
  end: 'bottom 15%',
  toggleActions: 'play none none reverse',
}

// LENIS + GSAP INTEGRATION (di lenis.ts)
// lenis.on('scroll', ScrollTrigger.update)
// gsap.ticker.add((time) => lenis.raf(time * 1000))
// gsap.ticker.lagSmoothing(0)
```

---

## §6 — ASSET RENDERING RULES (WAJIB DIIKUTI)

### A. Transparent PNG — `object-fit: contain` SELALU
```typescript
// Semua PNG dari: cats/, couple/, florals/, illustrations/
// WAJIB: object-fit contain, DILARANG cover/fill/crop

// Benar:
<Image
  src="/assets/cats/cat-jiro.png"
  alt="Kucing Jiro"
  width={180}
  height={200}
  style={{ objectFit: 'contain' }}
  className="drop-shadow-sm"
/>

// Salah (JANGAN):
style={{ objectFit: 'cover' }}  // akan crop kucing!
```

### B. Scene WebP — `object-fit: cover` untuk latar
```typescript
// Semua WebP dari scenes/ adalah opaque, untuk latar/background
// hero-main.webp → ratio 4:5
// hero-tall.webp → ratio 9:16 (mobile full-bleed)
// hero-bg.webp   → landscape (parallax layer di belakang hero-main)
// countdown-bg.webp → soft background band

<Image
  src="/assets/scenes/hero-main.webp"
  alt=""
  fill
  style={{ objectFit: 'cover', objectPosition: 'center top' }}
  priority
/>
```

### C. Gallery JPG — lightbox-ready
```typescript
// gallery-01 … gallery-09 → ~1067×1600 portrait (kecuali gallery-03 landscape)
// Tampil sebagai grid thumbnail, klik → lightbox full-screen
// Lazy load semua kecuali gallery-01 (above the fold = lazy ok, below = lazy wajib)
```

### D. Depth Layers di Hero (z-index tiers)
```
tier-1 (z=10):  hero-bg.webp          ← background terjauh, parallax lambat
tier-2 (z=20):  hero-main.webp        ← scene utama, sedikit parallax
tier-3 (z=30):  couple-cutout.png     ← pasangan, entrance y40→0
tier-4 (z=40):  cats (3-4 kucing)     ← foreground, entrance stagger
tier-5 (z=50):  florals (corner/arch) ← overlay dekorasi
tier-6 (z=60):  particle canvas       ← kelopak bunga melayang
tier-7 (z=70):  teks hero (nama+tanggal)
tier-8 (z=80):  scroll indicator
```

### E. Cat Idle Animation Rules
```typescript
// PENTING: setiap kucing HARUS punya durasi dan delay berbeda
// Supaya tidak bergerak synchron (terlihat buatan)

const catIdleConfig = {
  'cat-jiro':  { duration: 2.8, delay: 0.0, yRange: 3 },
  'cat-meng':  { duration: 3.2, delay: 0.4, yRange: 2 },
  'cat-moju':  { duration: 3.6, delay: 0.7, yRange: 4 },
  'cat-shiro': { duration: 2.9, delay: 1.1, yRange: 3 },
  'cat-simba': { duration: 3.4, delay: 0.2, yRange: 2 },
  'cat-hoshi': { duration: 3.1, delay: 0.9, yRange: 4 },
  'cat-kimho': { duration: 2.7, delay: 1.5, yRange: 3 },
}
// cat-peek: khusus — muncul dari bawah viewport, tidak loop biasa
```

---

## §7 — MINIMAX API INTEGRATION (lib/minimax.ts)

```typescript
// PROXY via /api/minimax/route.ts (JANGAN call MiniMax langsung dari client)
// API key HANYA ada di server environment

interface MinimaxImageRequest {
  model: 'image-01'
  prompt: string
  aspect_ratio: '1:1' | '4:3' | '3:4' | '16:9' | '9:16'
  n: number                    // 1-4
  response_format: 'url' | 'b64_json'
}

// STYLE PROMPT TEMPLATE untuk ilustrasi story (gaya harus konsisten dengan hero-main.webp):
const STYLE_SUFFIX = `
  flat illustration style, pastel storybook aesthetic,
  soft watercolor-like colors, warm pastel palette (ivory, cream, blush pink, dusty rose, sage green),
  gentle outlines, charming and intimate, wedding storybook,
  transparent background, PNG format,
  consistent with existing wedding illustration series
`

// Contoh generate story-motor.png:
const prompt = `
  A young Indonesian couple riding a motorcycle together through a scenic road,
  the girl wearing hijab sitting behind the boy, both smiling and happy,
  lush green tropical landscape background, warm sunlight,
  ${STYLE_SUFFIX}
`

// API call melalui server proxy:
// POST /api/minimax/route.ts → forward ke https://api.minimaxi.chat/v1/image_generation
// Response: URL gambar → download → simpan ke assets/illustrations/
```

---

## §8 — RSVP & DATA LAYER

### Google Sheets Schema
```
Sheet "RSVP" columns:
A: timestamp        (auto)
B: guestName        (dari ?to= URL param)
C: guestKey         (slug dari ?to=)
D: attendance       ("hadir" | "tidak hadir")
E: pax              (number, 1-5)
F: message          (string, max 300 char)
G: submittedAt      (ISO string)
H: userAgent        (untuk debug)
```

### Apps Script Endpoint (POST)
```javascript
// Terima JSON body, append ke Sheet "RSVP", return JSON response
// URL: https://script.google.com/macros/s/<id>/exec
// Method: POST
// Body: { guestKey, attendance, pax, message }
// Response: { success: true, message: "Terima kasih!" }
```

### Zod Validation Schema
```typescript
import { z } from 'zod'

export const RSVPSchema = z.object({
  guestKey:   z.string().min(1).max(100),
  attendance: z.enum(['hadir', 'tidak hadir']),
  pax:        z.number().int().min(1).max(5),
  message:    z.string().max(300).optional(),
})
export type RSVPPayload = z.infer<typeof RSVPSchema>
```

### Guest Personalization
```typescript
// URL: nikah.vercel.app/?to=bashara-keluarga
// Hook useGuestName() parse dari URLSearchParams
// Fallback: "Tamu Undangan"
// Dipakai di: Gate (nama di amplop), Hero (sapaan), RSVP (auto-fill)

export function useGuestName(): string {
  const [name, setName] = useState('Tamu Undangan')
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const to = params.get('to')
    if (to) setName(to.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
  }, [])
  return name
}
```

---

## §9 — 5 CREATIVE IDEAS (YANG HARUS DIBANGUN)

### IDEA 1 — THE LIVING ENVELOPE (Gate Section)
**Konsep:** Tamu pertama kali melihat amplop pernikahan yang tersegel. Ada animasi seal berkilau.
Tap amplop → amplop terbuka dengan animasi fold (paper unfold). Di dalamnya muncul nama tamu personal.
Setelah membuka, audio unlock (La Vie en Rose mulai fadeIn). Permintaan izin gyroscope muncul lembut.
**Tech:** CSS 3D transform untuk amplop flip, GSAP timeline untuk unfold sequence,
floral-border-full.png sebagai bingkai amplop, Web Audio API untuk audio unlock gesture.
**Key files:** `components/gate/EnvelopeGate.tsx`, `hooks/useAudio.ts`

### IDEA 2 — THE LIVING WORLD (Layered Hero)
**Konsep:** Hero bukan gambar statis — ini adalah dunia yang hidup dan bernapas.
6-8 layer transparan dengan parallax berbeda saat scroll dan gyroscope tilt.
Couple muncul dengan assemble animation (y dari bawah). Cats masuk stagger dari berbagai arah.
Bunga di sudut berayun perlahan. Kelopak/partikel melayang dari atas.
Nama pasangan dan tanggal muncul terakhir dengan elegant fade.
**Tech:** GSAP layered timeline, DeviceOrientationEvent untuk gyro,
Canvas API untuk particle system (max 30 partikel, RAF throttled untuk performa).
**Key files:** `components/hero/LayeredHero.tsx`, `components/shared/ParticleCanvas.tsx`, `hooks/useGyro.ts`

### IDEA 3 — THE SCROLL STORY (Narrative Chapters)
**Konsep:** Kisah cinta Bashara & Hanifah diceritakan seperti membuka halaman buku.
Setiap chapter muncul dengan ilustrasi yang masuk dari sisi berbeda.
ScrollTrigger mengontrol setiap frame: teks scrub masuk, ilustrasi parallax.
Chapters: pertemuan pertama → naik motor → Jakarta → LDR → Keio → lamaran.
**Tech:** GSAP ScrollTrigger dengan scrub, ilustrasi dari illustrations/ folder,
horizontal scroll untuk timeline alternatif (mobile: vertical).
**Key files:** `components/story/ScrollStory.tsx`, `components/story/StoryChapter.tsx`

### IDEA 4 — THE BREATHING AMBIANCE (Persistent Ambient Layer)
**Konsep:** Di seluruh halaman (bukan hanya hero), ada lapisan ambient yang hidup:
merpati sesekali terbang melintas, kupu-kupu muncul di tepi layar, partikel kelopak turun perlahan.
Audio ambiance: La Vie en Rose mengalun dengan volume rendah, ada tombol mute/unmute.
Di Closing section: semua kucing berkumpul dalam closing scene, confetti meledak saat RSVP submit.
**Tech:** CSS keyframe animations untuk ambient creatures, Intersection Observer untuk trigger,
Web Audio API gain node untuk crossfade volume, React portal untuk overlay layer.
**Key files:** `components/shared/AmbientLayer.tsx`, `components/shared/AudioManager.tsx`

### IDEA 5 — THE MICRO-SOUL (Delightful Interactions)
**Konsep:** Setiap interaksi punya respons yang terasa hidup dan personal:
- Hover kartu event → arch-frame.png muncul di atas kartu dengan spring animation
- Klik salin rekening → konfeti mini meledak dari tombol
- RSVP "hadir" → seluruh halaman bereaksi dengan petal burst
- cat-peek.png muncul dari bawah layar saat user scroll ke bawah 60% halaman
- Countdown digit flip animation saat angka berubah
- Gallery foto: hover → foto sedikit terangkat (lift effect) dengan shadow lebih dalam
- Long-press di mobile → ripple effect + haptic feedback (navigator.vibrate)
**Tech:** GSAP Flip untuk layout transitions, custom confetti dengan canvas,
CSS clip-path untuk cat-peek slide up, requestAnimationFrame untuk digit flip.
**Key files:** `components/shared/MicroInteractions.tsx`, `components/rsvp/ConfettiBlast.tsx`

---

## §10 — INSTRUKSI UNTUK CURSOR: 5 IMPL FILES YANG HARUS DIBUAT

Setelah membaca seluruh file ini, buat **5 file implementasi terpisah** dengan format:
`IMPL-01-*.md` sampai `IMPL-05-*.md`. Setiap file adalah spec implementasi yang bisa langsung
dikerjakan tanpa membaca ulang master brief ini.

### IMPL-01-gate-envelope.md
Isi: full implementation spec untuk Gate/Envelope section.
Termasuk: component tree, GSAP timeline step-by-step, CSS 3D transform code,
audio unlock flow, guest name display, exit animation ke hero.

### IMPL-02-hero-living-world.md
Isi: full implementation spec untuk Layered Hero.
Termasuk: z-index layer stack table, setiap asset + posisi + ukuran,
GSAP assemble timeline (semua steps berurutan), gyro parallax formula,
particle system config, mobile fallback, performance budget.

### IMPL-03-scroll-story.md
Isi: full implementation spec untuk Scroll Story.
Termasuk: 6 chapter definitions (teks dari docs/03-copywriting.md),
ScrollTrigger config per chapter, ilustrasi mana dipakai di chapter mana,
MiniMax prompt untuk generate 5 ilustrasi missing, layout mobile vs desktop.

### IMPL-04-ambient-breathing.md
Isi: full implementation spec untuk Ambient Layer + Audio + Closing.
Termasuk: ambient creature animation specs, audio manager state machine,
closing scene cat assembly, RSVP confetti trigger, mute/unmute UI.

### IMPL-05-micro-soul.md
Isi: full implementation spec untuk semua micro-interactions.
Termasuk: setiap interaction + trigger + animation + fallback,
cat-peek implementation, countdown flip, gallery lift, confetti blast,
haptic feedback, RSVP celebration sequence.

---

## §11 — PERFORMANCE BUDGET & RULES

```
Total initial load:    < 800KB (termasuk fonts)
Hero images:           priority load, WebP, width/height set
All other images:      loading="lazy", decoding="async"
Particle canvas:       max 30 particles, RAF throttled (16ms min interval)
GSAP instances:        kill() on unmount, revert() ScrollTrigger
Lenis:                 destroy() on unmount
Animation fallback:    prefers-reduced-motion → disable all gsap, static display
Audio:                 tidak autoplay, HANYA setelah user gesture (tap Gate)
```

---

## §12 — ACCESSIBILITY RULES

```
- Alt text: semua <Image> dengan deskripsi (cat PNG: nama kucing, couple: "Bashara dan Hanifah")
- Dekoratif (florals, scenes bg): alt=""
- Audio toggle: role="button", aria-label="Putar/Hentikan musik"
- RSVP form: setiap input punya <label>, error message inline
- Keyboard: semua CTA reachable via Tab, Enter/Space to activate
- Minimum touch target: 44×44px
- Reduced motion: semua animasi off, konten tetap accessible
- Color contrast: teks --color-ink (#4A4039) di atas --color-ivory (#FBF7F0) = 7.2:1 ✅
```

---

## §13 — COPYWRITING TOKENS (dari docs/03-copywriting.md)

```typescript
// lib/copy.ts — semua teks diambil dari sini (bukan hardcode di komponen)
export const copy = {
  gate: {
    seal:    'Tap untuk membuka',
    welcome: (name: string) => `Untuk ${name}`,
  },
  hero: {
    greeting: (name: string) => `Assalamu'alaikum, ${name}`,
    names:    'Bashara & Hanifah',
    date:     '22 Agustus 2026',
    venue:    'Widuri Restaurant, Bandung',
    subtitle: 'Dengan penuh syukur, kami mengundang kehadiran Anda',
  },
  story: {
    chapters: [
      { id: 'meeting',  title: 'Awal Mula',      illustration: 'story-meeting.png'  },
      { id: 'motor',    title: 'Perjalanan Kita', illustration: 'story-motor.png'   },
      { id: 'jakarta',  title: 'Kota Impian',     illustration: 'story-jakarta.png' },
      { id: 'ldr',      title: 'Jarak Tak Terasa',illustration: 'story-ldr.png'    },
      { id: 'keio',     title: 'Di Negeri Sakura',illustration: 'story-keio.png'   },
      { id: 'married',  title: 'Akhirnya',        illustration: 'story-married.png' },
    ],
  },
  countdown: {
    label: 'Menuju Hari Bahagia',
    units: { days: 'Hari', hours: 'Jam', minutes: 'Menit', seconds: 'Detik' },
  },
  event: {
    akad:     { title: 'Akad Nikah',   time: '08.00 WIB', date: '22 Agustus 2026' },
    resepsi:  { title: 'Resepsi',      time: '11.00 WIB', date: '22 Agustus 2026' },
    venue:    'Widuri Restaurant',
    address:  'Bandung, Jawa Barat',
  },
  rsvp: {
    title:       'Konfirmasi Kehadiran',
    attend:      'Insya Allah hadir 🌸',
    decline:     'Mohon maaf, berhalangan',
    paxLabel:    'Jumlah tamu',
    messageHint: 'Tulis doa atau pesan untuk kami (opsional)',
    submit:      'Kirim Konfirmasi',
    successMsg:  'Terima kasih! Sampai jumpa di hari bahagia kami 💕',
  },
  closing: {
    gratitude: 'Terima kasih telah hadir dalam perjalanan cinta kami',
    signature: '— Bashara & Hanifah',
  },
}
```

---

## §14 — TIDAK BOLEH DILAKUKAN (ANTI-PATTERN)

```
❌ object-fit: cover pada transparent PNG (akan crop ilustrasi)
❌ Sync semua cat idle animation (semua kucing gerak bersamaan = kaku)
❌ Autoplay audio tanpa gesture
❌ Hardcode teks di luar lib/copy.ts
❌ Direct call MiniMax dari client (gunakan /api/minimax/ proxy)
❌ Gradient button (gunakan solid --color-dusty)
❌ Box shadow dengan pure black/gray (gunakan warm rgba(120,90,70,...))
❌ Mengubah stack di luar yang didefinisikan §1
❌ Lupa kill() GSAP + destroy() Lenis saat unmount
❌ Render particle canvas di server (hanya client-side, cek typeof window)
❌ Loading semua 9 gallery JPG sekaligus (lazy load, buka lightbox on demand)
❌ Skip npm run copy-assets sebelum dev/build (assets tidak akan tersync ke public/)
```

---

*File ini berlaku sebagai single source of truth untuk seluruh proyek nikah-web.*
*Jika ada konflik antara file ini dan docs/spec/*, file ini yang menang untuk hal teknis.*
*Untuk konten/copy, docs/03-copywriting.md yang menang.*
