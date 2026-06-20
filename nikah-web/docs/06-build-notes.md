# 06 — Build Notes

Catatan teknis untuk Claude Code / Cursor agar implementasi tetap selaras dengan brief. **Mulai dari file planning ini**, bukan dari prompt kosong.

---

## Prinsip Utama
1. **Mobile-first, phone portrait** sebagai acuan desain pertama.
2. **Ringan & cepat** — prioritaskan koneksi lambat & HP kentang.
3. **Satu tema** (single light), tanpa dark mode.
4. **One-page**, scroll kontinu, transisi soft-flowing, tanpa nav bar terlihat.
5. Motion berlapis: **fal.ai** menangani ambient/idle (video loop), **GSAP** menangani orchestration/parallax/entrance.

---

## Stack
- **Astro** (output HTML minim JS) + Vite. Atau HTML + CSS + JS vanilla bila lebih ringan.
- GSAP (ScrollTrigger + MotionPath + Observer) untuk semua animation orchestration.
- Lenis untuk smooth scroll (lerp ~0.09).
- CSS custom properties untuk palette & spacing.
- `<video autoplay loop muted playsinline>` untuk semua fal.ai video loop assets.
- Tidak ada framework berat lain.

## Performa (wajib)
- Gambar: **WebP/AVIF**, `loading="lazy"`, `width/height` eksplisit (cegah CLS).
- Video: **MP4 H.264**, `preload="none"` kecuali hero, poster = WebP screenshot frame 1.
- Hero video preload: hanya `hero-bg-loop.mp4` + `couple-idle.mp4` (above fold).
- Semua video off-screen: `pause()` via IntersectionObserver → hemat CPU drastis.
- Audio: file kecil terkompresi, tidak autoplay sebelum interaksi.
- Target: Lighthouse mobile sehat. Hero paint < 2.5s di 3G. Total transfer hero < 800KB.
- Loading screen 1–2 detik, tidak blokir lebih lama dari aset siap.

## Aksesibilitas & Etika
- Kontras teks cukup (teks pakai taupe/charcoal di atas ivory).
- Tombol mute/unmute musik selalu tersedia.
- `prefers-reduced-motion`: matikan semua video loop, ganti dengan static PNG poster.
- `prefers-reduced-motion`: matikan parallax & tilt.

---

## Phase 0 — Asset Generation Pipeline (SEBELUM BUILD)

> Cursor tidak boleh mulai build sebelum Phase 0 selesai. Semua aset video harus sudah di `assets/video/`.

### Step 0.1 — Background Removal (fal.ai bria/rmbg)
```
Input:  nikah-web/correct/most correct/cat-*.png
        nikah-web/correct/most correct/couple-scooter-vespa-wedding.png
Output: nikah-web/assets/cats/cat-*-transparent.png
        nikah-web/assets/couple/couple-cutout.png
Model:  fal-ai/bria/rmbg
```

### Step 0.2 — Hero Scene Video Loops (fal.ai minimax)
```
Input:  nikah-web/scenes/hero-main.webp  (first frame reference)
Output: nikah-web/assets/video/hero-bg-loop.mp4
Model:  fal-ai/minimax/video-01-live
Prompt: "Soft meadow breathes gently, wildflowers sway in morning
         breeze, dappled sunlight shifts, petals drift, storybook
         watercolor illustration, seamless loop [Static shot]"
```

### Step 0.3 — Cat Idle Video Loops (fal.ai wan-2.6)
```
Input:  Per-cat transparent PNG dari Step 0.1
Output: nikah-web/assets/video/cat-{name}-idle.mp4
Model:  fal-ai/wan-2.6
Prompt: "{cat} breathes slowly, ear twitches once, tail sways gently,
         storybook watercolor style, transparent background [Static shot]"
```

### Step 0.4 — Floral Video Loops (fal.ai minimax)
```
Input:  floral-garland-full-swag.png, floral-swag-full.png,
        wildflower-meadow-full.png
Output: nikah-web/assets/video/floral-*-loop.mp4
Model:  fal-ai/minimax/video-01-live
```

### Step 0.5 — Gallery Photo Style Harmonize (fal.ai flux img2img)
```
Input:  FOTO INVITATION/*.jpg (foto asli)
Output: nikah-web/assets/gallery/gallery-0n.webp
Model:  fal-ai/flux/dev/image-to-image
Strength: 0.25–0.35 (rendah — jaga wajah)
Prompt: "Harmonize into soft watercolor storybook style, ivory cream
         blush palette, preserve faces and expressions, airy light"
```

### Step 0.6 — Story Illustrations (lihat TODO_ASSETS.md)
```
Generate 5 ilustrasi story via Gemini 2.5 Flash Image
Lihat: docs/07-gemini-asset-prompts.md §5
```

---

## Struktur Halaman (urutan render)
`Loading → Gate → Hero → Welcome → Countdown → Story → Event → RSVP → Wishes & Gift → FAQ → Closing`

Lihat `02-site-structure.md` untuk detail tiap section, `03-copywriting.md` untuk teks.

---

## Fitur & Implementasi

| Fitur | Catatan teknis |
| :-- | :-- |
| Video loop assets | `<video autoplay loop muted playsinline poster="...">` — pause bila off-screen |
| Personalized link | Baca `?to=` / `?g=slug`, render nama di Gate. Fallback aman. |
| Music autoplay | Mulai setelah tap Gate. Loop, volume rendah. Toggle visible. |
| Countdown | Target `2026-08-22T10:00:00+07:00`, format hari·jam·menit·detik. |
| RSVP | POST ke Google Apps Script / Sheets. Validasi jumlah ≤ 4. |
| Wishes wall | GET wishes publik, render feed, lazy-load. |
| Gift | Statis dari config, tombol "Salin" rekening. |
| Save to Calendar | Google Calendar link + `.ics`. |
| Map | Embed ringan atau tombol link ke `maps_url`. |
| Sticky RSVP | Button mobile mengarah ke section RSVP. |
| Scroll-to-top | Muncul setelah scroll, smooth. |
| Livestream | Tombol-tombol; YouTube utama. |

## Data
- Semua konten dinamis & rahasia → **config + env**, bukan hardcode di repo publik.
- Lihat `05-data-fields.md` untuk skema Sheets, field, dan config.

---

## Definition of Done (prototype pertama)
- [ ] Phase 0 selesai — semua video di `assets/video/`
- [ ] One-page mobile semua section tampil
- [ ] Gate membaca nama tamu dari link
- [ ] Musik La Vie en Rose start setelah tap
- [ ] Countdown jalan ke 22 Agustus 2026, 10.00 WIB
- [ ] RSVP tersimpan ke Google Sheets
- [ ] Wishes publik tampil & bisa kirim
- [ ] Gift + tombol salin
- [ ] Map, Save to Calendar, Livestream berfungsi
- [ ] Video loop assets pause saat off-screen
- [ ] `prefers-reduced-motion` → static PNG fallback
- [ ] Lighthouse mobile lulus

## Urutan Kerja
1. Lock semua planning docs (selesai).
2. **Phase 0:** Generate semua aset via fal.ai (lihat steps di atas + `13-fal-generation-plan.md`).
3. Bangun prototype HTML/CSS/JS dengan video layers.
4. Sambungkan GSAP orchestration (09 + 10 + 12).
5. Sambungkan Google Sheets + logika link tamu.
6. Uji di HP beneran (koneksi lambat) → poles.
