# Nikah — Wedding Invitation Website

Proyek undangan pernikahan **Bashara & Hanifah** — 22 Agustus 2026, Widuri Restaurant, Bandung.
Satu halaman, mobile-first, gaya ilustrasi storybook pastel, gerak "hidup, bukan kaku".

> **▶️ MULAI MEMBANGUN DI SINI:** ikuti `docs/build/stage-1` … `stage-7` **berurutan**. Tiap stage cross-ref ke spesifikasi (`docs/spec/01–13`), arah kreatif & gerak (`docs/01–12`), dan aset (manifest di bawah). Jangan lanjut stage berikutnya sebelum **Exit criteria** stage terpenuhi.
> Stack terkunci: **Next.js + GSAP/Lenis**; data via **Google Sheet + Apps Script**; personalisasi tamu via `?to=`.

## Struktur folder

```
nikah/
├── README.md                ← file ini (manifest aset)
├── docs/                     ← semua dokumen perencanaan & brief
│   ├── 00-original-qa.md     ← tanya-jawab konsep awal
│   ├── 01-concept-brief.md
│   ├── 02-site-structure.md
│   ├── 03-copywriting.md     ← teks final (Bahasa Indonesia)
│   ├── 04-asset-list.md
│   ├── 05-data-fields.md     ← field RSVP / Google Sheets / link tamu
│   ├── 06-build-notes.md     ← catatan teknis awal
│   ├── 07-gemini-asset-prompts.md
│   ├── 08-motion-principles.md   ← bahasa gerak: "hidup, bukan kaku" (token, easing, fallback)
│   ├── 09-hero-choreography.md   ← hero berlapis: animated-assemble + tilt/scroll parallax
│   ├── 10-section-choreography.md← storyboard gerak per section (gate→closing)
│   ├── 11-build-architecture.md  ← ringkas Next.js + GSAP (digantikan detailnya oleh spec/)
│   ├── 12-asset-motion-map.md    ← tiap aset → entrance/idle/interaksi + config particle
│   └── spec/                     ← ⭐ BUILD BIBLE (baca sebelum coding)
│       │  ── Main 8 (engineering) ──
│       ├── 01-system-architecture.md   05-user-flows.md
│       ├── 02-frontend-architecture.md 06-motion-integration.md
│       ├── 03-backend-api.md            07-content-seo-share.md
│       ├── 04-data-model.md             08-build-test-deploy.md
│       │  ── UX layer (UI/UX/flow/butter) ──
│       ├── 09-ui-design-system.md       12-ux-wireframes-flow.md
│       ├── 10-interaction-microinteractions.md  13-ux-quality-accessibility.md
│       └── 11-smooth-scroll-performance.md
└── docs/build/                  ← ▶️ EXECUTE IN ORDER — 7-stage build runbook
    ├── stage-1-foundation.md          stage-5-functional-backend.md
    ├── stage-2-motion-engine.md       stage-6-polish-butter-a11y.md
    ├── stage-3-entry-hero.md          stage-7-qa-launch.md
    └── stage-4-narrative-sections.md
└── assets/                   ← SEMUA ASET SIAP PAKAI
    ├── scenes/               ← gambar latar penuh (opaque, .webp)
    ├── cats/                 ← 8 kucing (transparan, .png)
    ├── couple/               ← ilustrasi pasangan (transparan)
    ├── florals/              ← dekorasi: bunga, drapery, arch (transparan)
    ├── illustrations/        ← ilustrasi per-section (transparan)
    ├── gallery/              ← 9 foto prewedding ASLI (.jpg, sudah dikompres)
    ├── audio/                ← backsound
    └── _source/              ← ARSIP file mentah (tidak dipakai langsung)
```

## Aset siap pakai

### `assets/scenes/` — latar penuh, opaque (WebP)
| File | Untuk |
| :-- | :-- |
| `hero-main.webp` | **Hero utama** (4:5) — sesuai komposisi referensi WhatsApp: pasangan + kucing di padang bunga |
| `hero-tall.webp` | Versi tinggi 9:16 — opsi full-bleed bila ingin mengisi layar mobile penuh |
| `hero-bg.webp` | Latar padang bunga + langit (tanpa orang) untuk overlay teks / layer parallax |
| `countdown-bg.webp` | Band lembut opaque untuk latar countdown |

### `assets/cats/` — transparan (PNG)
`cat-jiro` · `cat-meng` · `cat-moju` · `cat-shiro` · `cat-simba` · `cat-hoshi` · `cat-kimho` · `cat-peek`

### `assets/couple/`
`couple-cutout.png` — pasangan berdiri, transparan.

### `assets/florals/` — transparan (PNG)
`floral-corner-tl` & `floral-corner-br` (pasangan sudut) · `floral-sprig` · `floral-border-full` (bingkai gate) · `drapery-divider` · `arch-frame` · `accent-doves` · `accent-butterflies`
*(latar countdown sekarang opaque di `scenes/countdown-bg.webp`)*

### `assets/illustrations/` — transparan (PNG)
`loading-motif` · `welcome-accent` · `story-meeting` · `story-growing` · `japan-motif` · `event-accent` · `gift-accent` · `map-pin` · `gallery-frame`

### `assets/gallery/` — foto ASLI (JPG, ~1067×1600, 50–130 KB)
`gallery-01` … `gallery-09`. Foto prewedding asli (bukan ilustrasi), sudah diputar tegak & dikompres untuk web. *(gallery-03 berorientasi landscape — memang foto candid lebar.)*

### `assets/audio/`
`la-vie-en-rose.mp3` — backsound (Daniela Andrade cover).

## Status kesiapan per kategori

| Kategori | Status | Catatan |
| :-- | :--: | :-- |
| `scenes/` (4 file) | ✅ ready | hero-main & hero-bg dipakai Hero+Loading; hero-tall & countdown-bg disimpan sebagai fallback / opsi layout. |
| `cats/` (8 file) | ✅ ready | ketiganya dipakai Loading & Closing. |
| `couple/` (1 file) | ✅ ready | couple-cutout dipakai Closing & Loading. |
| `florals/` (8 file) | ✅ ready | border-full, sprig, doves, butterflies dipakai; corner-tl/br & arch-frame disimpan untuk section/event. **drapery-divider baru dipromosikan dari `_source/cutouts-untrimmed/`** — sebelumnya hilang dari manifest. |
| `illustrations/` (9 file) | ⚠️ 4 hilang | loading-motif, welcome-accent, story-meeting, story-growing, japan-motif, event-accent, gift-accent, map-pin, gallery-frame ada. **5 ilustrasi story BELUM di-generate**: `story-motor`, `story-jakarta`, `story-ldr`, `story-keio`, `story-married` (referenced di `lib/copy.ts` chapters 2–6 — akan 404 sampai di-generate). Prompt siap pakai ada di `docs/07 §5` & `07 §story/*`. |
| `gallery/` (9 JPG) | ⏳ deferred | Lightbox sengaja tidak dibangun di iterasi ini (LAUNCH §8). File sudah ada & dikompres, tinggal wire-up saat feature diaktifkan. |
| `audio/` (1 file) | ✅ ready | |
| Stray file di root | ✅ cleaned | `couple-cutout-removebg-preview.png` dipindah ke `_source/raw-original/_stray/`. |

## Catatan
- **Semua PNG sudah background transparan** dan **di-trim** ke isi (tanpa padding berlebih) agar mudah ditempatkan.
- **`_source/`** menyimpan semua mentahan (foto kucing asli + HEIC, foto prewedding asli, ilustrasi versi penuh-kanvas, output AI asli, PDF konsep). Aman dihapus jika butuh ruang; tidak dipakai website.
- **Hero utama** memakai komposisi referensi WhatsApp (= `hero-main.webp`, 4:5). Versi tinggi `hero-tall.webp` tersedia bila ingin full-bleed.
- README ini adalah manifest yang berlaku. `docs/04` & `docs/07` sudah diperbarui agar konsisten dengan struktur `scenes/`.
- **Generate batch (TODO)**: jalankan prompt di `docs/07 §5` untuk `story-motor`, `story-jakarta`, `story-ldr`, `story-keio`, `story-married` (REFERENSI GAYA = `assets/scenes/hero-main.webp`), simpan ke `assets/illustrations/`, lalu `npm run copy-assets` untuk mirror ke `public/`.
