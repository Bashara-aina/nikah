# 11 — Build Architecture (Next.js + GSAP)

Cetak biru teknis untuk Claude Code / Cursor. Stack terkunci: **Next.js (App Router) + GSAP/ScrollTrigger + Lenis**, mobile-first, rich + smart fallback.

---

## 1. Stack & dependency

- **Next.js (App Router, TypeScript)** — satu halaman (`/`), plus API route untuk RSVP.
- **GSAP** + **ScrollTrigger** (+ MotionPathPlugin untuk doves/butterflies). GSAP kini free penuh.
- **Lenis** (`@studio-freight/lenis`) — smooth scroll, lerp ≈ 0.09; sinkron ke `ScrollTrigger.update`.
- **next/image** — semua aset (webp/png) dengan sizing eksplisit, `priority` untuk hero.
- Tanpa UI framework berat. CSS = CSS Modules atau Tailwind (pilih Tailwind untuk kecepatan; aman).
- Font: serif elegan (heading) + sans bersih (body) via `next/font` (self-host, no layout shift).

```
package: next, react, react-dom, gsap, @studio-freight/lenis, (tailwindcss)
```

---

## 2. Struktur folder

```
/ (repo)
├── app/
│   ├── layout.tsx            # font, <html lang="id">, metadata, OG (hero-card)
│   ├── page.tsx              # rakit semua <Section/> berurutan
│   ├── globals.css
│   └── api/rsvp/route.ts     # POST → Google Sheets
├── components/
│   ├── motion/
│   │   ├── MotionProvider.tsx # context: tier (HIGH/MID/LOW/REDUCED), reduced flag
│   │   ├── useTier.ts         # deteksi kemampuan device
│   │   ├── useGyro.ts         # DeviceOrientation + permission + lerp
│   │   ├── useParallax.ts     # daftar layer → transform (scroll+tilt)
│   │   ├── useReveal.ts       # ScrollTrigger reveal helper (pola file 10 §0)
│   │   ├── Lenis.tsx          # provider smooth scroll
│   │   └── Particles.tsx      # canvas petals/pollen (config file 12)
│   ├── hero/
│   │   ├── Hero.tsx           # layer stack + assemble timeline + idle (file 09)
│   │   ├── heroLayout.ts      # posisi % tiap layer (match hero-main.webp)
│   │   ├── Doves.tsx  Butterflies.tsx
│   ├── sections/
│   │   ├── Loading.tsx Gate.tsx Welcome.tsx Countdown.tsx
│   │   ├── Story.tsx Japan.tsx Event.tsx Rsvp.tsx Wishes.tsx Gift.tsx Closing.tsx
│   ├── ui/
│   │   ├── AudioToggle.tsx StickyRsvp.tsx ScrollTop.tsx Divider.tsx (drapery)
│   └── primitives/  (Reveal, FloatLoop, Sway — wrapper animasi reusable)
├── lib/
│   ├── motionTokens.ts        # easing/durasi/jarak (file 08 §3) — SATU sumber
│   ├── guest.ts               # decode ?to= , format nama
│   ├── sheets.ts              # helper tulis ke Google Sheets
│   └── config.ts              # tanggal, venue, maps URL, bank, livestream, deadline D-7
├── public/assets/             # MIRROR dari /assets (scenes,cats,couple,florals,illustrations,gallery,audio)
└── docs/  (01–12)
```

> Salin folder `assets/{scenes,cats,...}` → `public/assets/...` saat build (script atau symlink). `_source/` TIDAK ikut ke public.

---

## 3. MotionProvider & tier (smart fallback)

`useTier()` jalan sekali di client:
```
reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
saveData = navigator.connection?.saveData
slow = ['slow-2g','2g','3g'].includes(navigator.connection?.effectiveType)
weak = (navigator.deviceMemory ?? 8) < 4 || (navigator.hardwareConcurrency ?? 8) <= 4
tier = reduced ? 'REDUCED' : (saveData||slow) ? 'LOW' : weak ? 'MID' : 'HIGH'
```
Tabel fitur per tier = file 08 §7. Semua komponen animasi **baca `useMotion()`** sebelum memutuskan loop/particle/tilt. Default SSR = 'MID' (aman) sampai client menentukan.

---

## 4. Hooks kunci

- **useGyro()** — pasang listener `deviceorientation`; iOS: expose `requestPermission()` dipanggil saat tap Gate. Output `{x,y}` ter-lerp (smoothing 0.08), nol bila ditolak/REDUCED.
- **useParallax(layers)** — gabung scroll progress (ScrollTrigger) + gyro → set `translate3d` per layer pakai `factor` depth (file 08 §4). RAF tunggal.
- **useReveal(ref, opts)** — bungkus ScrollTrigger reveal standar (file 10 §0); auto stagger anak; auto no-op di REDUCED (ganti fade).
- **FloatLoop / Sway / Breathing** — komponen primitive yang menambah idle loop dgn **fase acak** (seeded) + pause saat off-screen.

---

## 5. Data & integrasi

### Guest link
- URL: `/?to=Nama%20Tamu` (atau `?to=base64`). `lib/guest.ts` decode → tampil di Gate ("Kepada, **Nama**" gaya lembut). Default bila kosong: "Bapak/Ibu/Saudara/i".
- **Generator link** (kebutuhan user): halaman/utility `/admin` sederhana ATAU skrip lokal yang menghasilkan daftar URL dari daftar nama (CSV → list link). Tidak perlu auth berat; bisa static.

### RSVP → Google Sheets
- Cara termudah & gratis: **Google Apps Script Web App** sebagai endpoint. Sheet kolom: `timestamp, guest(to), nama, kehadiran(Hadir/Tidak/Diusahakan), jumlah(≤4), pesan`.
- Flow: form → `POST /api/rsvp` (Next route) → fetch ke Apps Script URL (server-side, sembunyikan URL) → tulis row. Balikan ok → animasi sukses (file 10 §9).
- Alternatif: Google Sheets API + service account (lebih ribet, kalau butuh keamanan lebih).

### Wishes (guestbook publik)
- Sheet/tab terpisah `wishes`: `timestamp, nama, pesan`. GET (cache pendek) untuk render list; POST untuk kirim. Moderasi opsional (kolom `approved`).

### Audio
- `<audio loop preload="none">` La Vie en Rose. **Start hanya setelah tap Gate** (kebijakan autoplay). Fade volume via WebAudio/GSAP 0→~0.5. `AudioToggle` selalu tampil (mute/unmute), state di localStorage.

### Save to Calendar
- Generate `.ics` (Google/Apple) dari `config.ts` (22 Agt 2026, 10:00–13:00 WIB, venue).

### Maps
- Embed lazy (load saat section Event masuk) atau tombol link ke `maps.app.goo.gl/...` (ringan; default tombol + map-pin custom).

---

## 6. Config tunggal (`lib/config.ts`)
Tanggal/jam, venue+alamat, maps URL, dress code (pastel), etiquette list, livestream (YouTube/Zoom/IG/FB), bank (ID & JP) + alamat hadiah, deadline RSVP (D-7), nama mempelai, hashtag. Semua teks final ambil dari `docs/03-copywriting.md`.

---

## 7. Performance budget (potato phone)
- Hanya `transform`/`opacity` (file 08 §8). `content-visibility:auto` untuk section bawah.
- `next/image` sizes tepat; hero layers `priority`; sisanya lazy.
- Satu RAF global untuk parallax+particles (jangan banyak loop).
- Pause animasi off-screen (ScrollTrigger/IO).
- Target: LCP < 2.5s di 3G mid-tier; bundle JS < ~150KB gz (GSAP+Lenis muat); hero transfer < 600KB.
- Lighthouse mobile ≥ 90 perf/accessibility sebagai gate rilis.

---

## 8. Deploy
- **Vercel** (Next.js native). Env: `APPS_SCRIPT_URL` (RSVP), dll.
- Preview deploy untuk verifikasi gerak di HP asli (buka di ponsel low-end untuk cek tier LOW).
- Domain custom opsional.

---

## 9. Urutan build (disarankan)
1. Scaffold Next + Tailwind + font + Lenis + MotionProvider/useTier.
2. `config.ts` + copy aset ke `public/`.
3. **Hero** (file 09) sebagai prototipe pembuktian gerak → tes di HP.
4. Gate + audio + guest link.
5. Section sisanya (file 10) berurutan.
6. RSVP + Wishes (Apps Script).
7. Polish: tier fallback, reduced-motion, Lighthouse, QA HP lemah.
