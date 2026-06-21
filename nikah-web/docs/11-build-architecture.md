# 11 — Build Architecture (Next.js + GSAP + fal.ai)

Cetak biru teknis untuk Claude Code / Cursor. Stack terkunci: **Next.js (App Router) + GSAP/ScrollTrigger + Lenis + fal.ai video loops**.

> **Urutan kerja:** Phase 0 asset generation (`13-fal-generation-plan.md`) HARUS selesai sebelum mulai build site. Semua `assets/video/*.mp4` harus ada.

---

## 1. Stack & Dependency

```
next, react, react-dom
gsap (ScrollTrigger, MotionPathPlugin)
@studio-freight/lenis
(tailwindcss atau CSS Modules)
@fal-ai/client  — hanya untuk scripts/generate-assets.mjs, tidak di-bundle ke site
```

- **Next.js App Router, TypeScript.**
- **GSAP** + ScrollTrigger + MotionPathPlugin (doves/butterflies).
- **Lenis** smooth scroll, lerp ±0.09, sinkron ke `ScrollTrigger.update`.
- **next/image** untuk semua PNG/WebP. `priority` untuk hero poster.
- **`<video autoplay loop muted playsinline>`** untuk semua fal.ai video loops.
- Font: serif heading + sans body via `next/font` (self-host, zero layout shift).

---

## 2. Struktur Folder

```
/ (repo root: nikah-web/)
├── app/
│   ├── layout.tsx            # font, <html lang="id">, metadata, OG image
│   ├── page.tsx              # rakit semua <Section/> berurutan
│   ├── globals.css
│   └── api/rsvp/route.ts     # POST → Google Sheets
├── components/
│   ├── motion/
│   │   ├── MotionProvider.tsx   # context: tier (HIGH/MID/LOW/REDUCED)
│   │   ├── useTier.ts           # deteksi kemampuan device sekali saat load
│   │   ├── useGyro.ts           # DeviceOrientation + permission + lerp
│   │   ├── useParallax.ts       # gabung scroll + gyro → translate3d per layer
│   │   ├── useReveal.ts         # ScrollTrigger reveal helper
│   │   ├── useVideoLayer.ts     # pause/resume video via IntersectionObserver
│   │   ├── Lenis.tsx            # smooth scroll provider
│   │   └── Particles.tsx        # canvas petals/pollen (config file 12)
│   ├── hero/
│   │   ├── Hero.tsx             # layer stack + assemble timeline (file 09)
│   │   ├── heroLayout.ts        # posisi % tiap video layer (match hero-main.webp)
│   │   ├── Doves.tsx            # MotionPath doves
│   │   └── Butterflies.tsx      # bezier butterflies
│   ├── sections/
│   │   ├── Loading.tsx Gate.tsx Welcome.tsx Countdown.tsx
│   │   ├── Story.tsx Japan.tsx Event.tsx Rsvp.tsx
│   │   └── Wishes.tsx Gift.tsx Closing.tsx
│   ├── ui/
│   │   └── AudioToggle.tsx StickyRsvp.tsx ScrollTop.tsx Divider.tsx
│   └── primitives/
│       └── Reveal.tsx FloatLoop.tsx Sway.tsx VideoLayer.tsx
├── lib/
│   ├── motionTokens.ts        # easing/durasi/jarak (file 08 §3) — satu sumber
│   ├── guest.ts               # decode ?to= , format nama tamu
│   ├── sheets.ts              # helper tulis ke Google Sheets
│   └── config.ts              # tanggal, venue, maps, bank, livestream, dll
├── scripts/
│   └── generate-assets.mjs    # fal.ai pipeline script (13-fal-generation-plan.md)
├── public/assets/
│   ├── video/                 # semua .mp4 dari fal.ai (hero, cats, couple, florals)
│   ├── scenes/                # poster WebP
│   ├── cats/                  # transparent PNG (poster fallback)
│   ├── couple/                # transparent PNG
│   ├── florals/               # PNG (rmbg)
│   ├── illustrations/         # story, welcome, loading, event, gift
│   ├── gallery/               # style-harmonized WebP photos
│   └── audio/                 # la-vie-en-rose.mp3
└── docs/  (01–13)
```

> `assets/` di root = working copy. `public/assets/` = build output. `npm run copy-assets` mirrors them.

---

## 3. MotionProvider & Tier (Smart Fallback)

```typescript
// useTier.ts
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const saveData = (navigator.connection as any)?.saveData
const slow = ['slow-2g','2g','3g'].includes((navigator.connection as any)?.effectiveType)
const weak = ((navigator.deviceMemory ?? 8) < 4) || ((navigator.hardwareConcurrency ?? 8) <= 4)

export type Tier = 'HIGH' | 'MID' | 'LOW' | 'REDUCED'
export const tier: Tier =
  reduced ? 'REDUCED' :
  (saveData || slow) ? 'LOW' :
  weak ? 'MID' : 'HIGH'
```

| Fitur | HIGH | MID | LOW | REDUCED |
| :-- | :-: | :-: | :-: | :-: |
| fal.ai video loops | on | on | off (poster) | off (poster) |
| Tilt parallax | on | on | off | off |
| Scroll parallax | full | dikurangi | minimal | off |
| Doves/butterflies | on | on (sedikit) | off | off |
| Petals canvas | 12–14 | 6 | 0 | 0 |
| GSAP fallback breathing | off | on | on | off |
| CSS floral sway | on | on | on | off |

Default SSR = `'MID'` (aman) sampai client hydrate.

---

## 4. `useVideoLayer.ts` (hook baru — wajib)

```typescript
// Pause/resume video saat masuk/keluar viewport
import { useEffect, useRef } from 'react'
import { useMotion } from './MotionProvider'

export function useVideoLayer(videoRef: React.RefObject<HTMLVideoElement>) {
  const { tier } = useMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // REDUCED/LOW → never play, show poster
    if (tier === 'REDUCED' || tier === 'LOW') {
      video.pause()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting ? video.play() : video.pause(),
      { threshold: 0.1 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [tier, videoRef])
}
```

Gunakan `useVideoLayer` di SETIAP `<video>` komponen (`VideoLayer.tsx` primitive).

---

## 5. Hooks Kunci

- **useGyro()** — pasang `deviceorientation` listener; iOS: `requestPermission()` saat tap Gate; output `{x,y}` ter-lerp (0.08); nol bila ditolak/REDUCED.
- **useParallax(layers)** — gabung ScrollTrigger + gyro → `translate3d` per layer via `factor`. RAF tunggal.
- **useReveal(ref, opts)** — ScrollTrigger reveal standar; auto stagger anak; no-op di REDUCED.
- **useVideoLayer(ref)** — pause/resume video berdasarkan visibility + tier.
- **FloatLoop / Sway** — GSAP idle fallback (LOW/MID saat video off). Fase acak per elemen.

---

## 6. `VideoLayer.tsx` Primitive

```tsx
interface VideoLayerProps {
  src: string
  poster: string
  className?: string
  'data-depth'?: string
}

export function VideoLayer({ src, poster, className, ...props }: VideoLayerProps) {
  const ref = useRef<HTMLVideoElement>(null)
  useVideoLayer(ref)

  return (
    <video
      ref={ref}
      className={className}
      autoPlay loop muted playsInline
      poster={poster}
      src={src}
      {...props}
    />
  )
}
```

---

## 7. Data & Integrasi

### Guest Link
- URL: `/?to=Nama%20Tamu`. `lib/guest.ts` decode → tampil di Gate. Default: "Bapak/Ibu/Saudara/i".
- Link generator: script lokal CSV → list URL.

### RSVP → Google Sheets
- **Google Apps Script Web App** sebagai endpoint.
- Sheet kolom: `timestamp, guest, nama, kehadiran, jumlah(≤4), pesan`.
- Flow: form → `POST /api/rsvp` (Next route, server-side) → fetch Apps Script → tulis row.

### Wishes
- Tab terpisah `wishes`: `timestamp, nama, pesan`. GET cache pendek; POST kirim. Moderasi opsional.

### Audio
- `<audio loop preload="none">`. Start hanya setelah tap Gate. Fade via GSAP 0→0.5. Toggle di localStorage.

### Save to Calendar
- `.ics` + Google Calendar link dari `config.ts` (22 Agt 2026, 10:00–13:00 WIB).

### Maps
- Tombol link ke `maps.app.goo.gl/...` (ringan). Embed lazy opsional.

---

## 8. Config Tunggal (`lib/config.ts`)

Tanggal/jam, venue+alamat, maps URL, dress code, etiquette list, livestream (YouTube/Zoom/IG/FB), bank (ID & JP) + alamat hadiah, deadline RSVP (D-7), nama mempelai, hashtag. Teks final dari `03-copywriting.md`.

---

## 9. Performance Budget (Potato Phone)

- Hanya `transform`/`opacity` untuk GSAP (file 08 §9).
- Video: MP4 H.264, < 2MB per file, `preload="none"` kecuali hero.
- Pause semua video off-screen (useVideoLayer).
- Satu RAF global parallax+particles.
- `content-visibility: auto` untuk section bawah.
- Target: LCP < 2.5s di 3G; bundle JS < 150KB gz; hero transfer < 800KB.
- Lighthouse mobile ≥ 90 sebagai gate rilis.

---

## 10. Deploy

- **Vercel** (Next.js native).
- Env: `APPS_SCRIPT_URL`, `FAL_KEY` (hanya untuk scripts/, bukan runtime site).
- Preview deploy: wajib test di HP low-end untuk verifikasi tier LOW.
- Domain custom opsional.

---

## 11. Urutan Build (setelah Phase 0 selesai)

1. Scaffold Next + Tailwind + font + Lenis + MotionProvider/useTier.
2. `config.ts` + copy aset ke `public/assets/`.
3. **`VideoLayer` primitive + `useVideoLayer` hook** (fondasi semua video).
4. **Hero** (file 09) sebagai prototipe pembuktian — tes di HP asli.
5. Gate + audio + guest link.
6. Section sisanya berurutan (file 10).
7. RSVP + Wishes (Apps Script).
8. Polish: tier fallback, REDUCED mode, Lighthouse, QA HP kentang.

---

## 12. Motion library ownership map (added 2026-06-21, feature/motion-ui-ux-pro-max)

`nikah-web/` now uses **two** animation libraries side-by-side. The split is deliberate — neither library subsumes the other.

| Library | Owns | Does NOT touch |
| :-- | :-- | :-- |
| **Motion** (`motion/react`, formerly `framer-motion`) | Component-level enter/exit, springs (`spring.gentle` / `snappy` / `wobbly`), `AnimatePresence` for the gate→hero swap, individual hero-character micro-entrance, `MotionReveal` / `MotionFloat` primitives, `MotionFloat` fallback idle when fal.ai video is gated off. | ScrollTrigger scroll-parallax, MotionPath beziers, the master assemble timeline, particle canvas, gyro/tilt parallax, Lenis sync. |
| **GSAP** (`gsap` + `ScrollTrigger` + `MotionPathPlugin`) | Hero master assemble timeline (per docs/09 §2), ScrollTrigger-driven scroll parallax (via `useParallax`), `Doves` + `Butterflies` MotionPath loops, `Particles` canvas RAF, `LenisProvider` ticker sync. | Component-level variants / springs / `AnimatePresence`. |
| **fal.ai** (videos in `public/assets/video/`) | All character ambient — breathing, ear-twitch, tail-sway, blinks. Living video loops from Phase 0. | Anything else. Never duplicated by GSAP or Motion. |
| **CSS `@keyframes`** | Small decorative florals + drapery ripple (`Sway` primitive). | Anything interactive. |

Both libraries read easing / duration / amplitude tokens from `lib/motionTokens.ts` (single source of truth). `lib/motionAdapter.ts` converts the tokens into Motion `Transition` objects, cubic-bezier CSS strings, and GSAP `vars` — so the same numeric vocabulary drives both libraries. No magic numbers in components.

The `ui-ux-pro-max` skill is installed at `.cursor/skills/ui-ux-pro-max/` (provisioned via `npx uipro-cli init --ai cursor`). Its priorities (Accessibility → Touch → Performance → Animation) are encoded in `nikah-web/AGENTS.md`.

