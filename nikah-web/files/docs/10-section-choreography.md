# 10 — Section Choreography (Scroll Storyboard)

Storyboard gerak per-section. Arc: **loading → gate → hero → welcome → countdown → story → japan → event → rsvp → wishes → gift → closing**.

> **Prinsip motion dua lapisan:** fal.ai menangani semua idle/ambient di dalam video. GSAP menangani entrance, parallax, scroll, interaksi. CSS handles aksen kecil. Lihat `08` untuk token.

---

## 0. Pola Umum (berlaku semua section)

- **Reveal-on-scroll:** elemen masuk saat ~20% section kelihatan (ScrollTrigger `start: "top 80%"`). Pola: `opacity 0→1` + `y move.reveal→0`, `dur.enter`, `ease.enter`, `stagger.base` antar anak.
- **Tidak serempak:** judul → garis bunga → body → aksen, masing-masing telat 80–120ms.
- **Idle setelah masuk:** aksen (bunga/divider/ilustrasi) punya CSS sway; karakter punya fal.ai video.
- **Antar-section:** `drapery-divider` reveal/wipe — bukan potongan keras.
- **Exit:** elemen fade `opacity→0.6` + y kecil saat keluar, tidak patah.
- Background satu kanvas kontinu (ivory) — section "mengalir", bukan kotak-kotak.
- Setiap section: **(1) reveal masuk, (2) ≥1 idle motion, (3) transisi keluar halus.**
- **Video off-screen:** semua `<video>` section dipause via IntersectionObserver saat keluar viewport.

---

## 1. Loading (1–2 detik)

- Aset: `illustrations/loading-motif.png` (kucing tidur di karangan bunga).
- Gerak: wreath **rotate pelan** (±6°, 3s yoyo, GSAP) + breathing GSAP (no fal.ai video needed, loading screen singkat).
- Dot/teks "..." pulse opacity.
- Progress: cross-fade 400ms ke Gate. Tanpa spinner kaku.

---

## 2. Opening Gate (Storybook Page)

- Aset: `florals/floral-border-full.png` (bingkai bunga), nama tamu (`?to=`), tombol "Buka Undangan".
- Masuk: bingkai draw/scale-in dari tepi (stagger sisi), nama tamu fade+y, tombol pop `ease.settle`.
- Idle: bingkai CSS sway ±0.8°; tombol CSS breathing scale 1→1.03.
- **Tap "Buka Undangan":**
  1. Minta izin gyro (iOS 13+)
  2. Start audio La Vie en Rose (fade-in 0→0.5, 1.2s)
  3. Gate page-turn/curtain reveal → trigger Hero assemble (file 09)
- Kucing TIDAK muncul di gate — disimpan untuk hero reveal.

---

## 3. Hero → lihat `09-hero-choreography.md`

---

## 4. Welcome Message

- Aset: `illustrations/welcome-accent.png` (doves + bunga), teks sambutan + Surat Yasin Ayat 36.
- Masuk: accent fade+scale dari atas; teks per-baris stagger (efek "ditulis perlahan").
- Idle: doves accent GSAP float ±3px; ayat highlight lembut (opacity breathe). CSS sway pada bunga accent.
- Ambient: 2–3 petals lewat (canvas particle).

---

## 5. Countdown

- Aset: `scenes/countdown-bg.webp` (band opaque) + angka hari·jam·menit·detik.
- Masuk: band fade; angka pop stagger `ease.settle`.
- Idle: angka **flip/roll** tiap detik (y +6→0 + opacity mikro, smooth tidak patah). Band: GSAP breathing scale 1→1.01 (ringan, no fal.ai video needed).
- Ambient: sedikit petals; bunga sudut CSS sway.

---

## 6. Love Story

- Aset: `illustrations/story-motor.png`, `story-jakarta.png`, `story-ldr.png`, `story-keio.png`, `story-married.png`.
- Layout: ilustrasi selang-seling kiri/kanan dengan baris cerita.
- Masuk: tiap baris reveal saat scroll (scrub ringan), ilustrasi **slide dari sisi** + settle.
- Idle: GSAP breathing halus per ilustrasi; hati/garis koneksi (story-married) pulse.
- Ambient: petals jarang — jaga fokus baca.
- Transisi ke section berikut: `drapery-divider` ripple.

---

## 7. Japan Dream (Keio Hiyoshi · SIT Tokyo)

- Aset: `illustrations/japan-motif.png` (sakura/kampus/kereta).
- Masuk: motif fade+scale; **kelopak sakura** ekstra (particle palet pink lembut) saat section ini aktif.
- Idle: GSAP breathing; sakura drift dari particle canvas (warna override ke pink sakura).
- Transisi: `drapery-divider` ripple dari Story ke Japan.

---

## 8. Event Details

- Aset: `illustrations/event-accent.png` (arch drapery+bunga), `illustrations/map-pin.png`, tombol Save-to-Calendar, etiquette, livestream.
- Masuk: arch accent reveal membingkai blok tanggal/venue; detail stagger; map-pin **drop + bounce** `ease.settle`.
- Idle: arch CSS drapery sway ±0.5°; map-pin GSAP pulse halus (ajak tap).
- Map embed: load lazy saat section masuk viewport.

---

## 9. RSVP

- Aset: soft note-card background; `florals/floral-sprig.png` aksen kartu.
- Masuk: kartu slide+settle; field stagger.
- Interaksi hidup:
  - Pilihan Hadir/Tidak/Diusahakan = pill **morph** scale+warna `ease.settle`.
  - Input focus: underline **grow** dari tengah, label naik halus.
  - Submit: tombol → spinner bunga → checkmark draw + petals burst (perayaan mikro).
- Sticky RSVP button (mobile): muncul setelah hero, breathing halus, sembunyi saat di section RSVP.

---

## 10. Wishes / Guestbook

- Masuk: form + list wishes, tiap kartu stagger fade+y.
- Wish baru: **prepend** slide-down + highlight sesaat.
- Idle: kartu hover/tap lift kecil.
- Ambient: 1–2 GSAP doves lewat di header section.

---

## 11. Gift / Tanda Kasih

- Aset: `illustrations/gift-accent.png` (kotak+amplop+bunga). Nada lembut, tidak memaksa.
- Masuk: accent reveal; opsi (Bank Indonesia · Bank Jepang · alamat hadiah) sebagai kartu expand accordion halus.
- Interaksi: tombol "Salin" → micro toast "Tersalin ✓" pop.
- FAQ: buka/tutup dengan grid-rows trick atau measured max-height, konten fade (bukan height kaku).
- Idle: pita gift GSAP breathing.

---

## 12. Closing (Simetri Emosional)

- Aset: dunia hero kembali — `video/couple-idle.mp4` + beberapa `video/cat-*-idle.mp4` + `florals/cat-peek.png`.
- **fal.ai video kembali aktif** — closing adalah echo dari hero, terasa seperti menutup buku cerita.
- Masuk: scene mini assemble (versi ringkas hero, tötal ~0.8s stagger).
- Teks: "Tak sabar menanti kehadiranmu di hari bahagia kami." + signature hashtag.
- `cat-peek.png`: **CSS @keyframes** slide-in dari bawah, peek↔hide loop tiap ~10s — easter charm.
- Idle: fal.ai video breathing; GSAP doves terbang menjauh ke atas (penutup emosional). Petals memudar.
- Audio: tetap loop; tombol mute selalu tersedia.

---

## Ritme Keseluruhan

- Total jelajah ~1 menit; jangan tahan user dengan animasi panjang.
- 1 momen "wow" besar (hero). Sisanya **micro-delight** konsisten.
- Semua `<video>` section: pause saat off-screen via IntersectionObserver.
- `prefers-reduced-motion`: semua video → poster static, semua loop → fade saja.
