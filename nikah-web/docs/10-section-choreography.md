# 10 — Section Choreography (scroll storyboard)

Storyboard gerak per-section, mengikuti arc: **loading → gate → hero → welcome → countdown → story → japan → event → rsvp → wishes → gift → closing**. Semua token dari `08`. Pola umum di §0, lalu detail per section.

---

## 0. Pola umum (berlaku semua section)

- **Reveal-on-scroll:** elemen masuk saat ~20% section kelihatan (ScrollTrigger `start: "top 80%"`). Pola dasar: `opacity 0→1` + `y move.reveal→0`, `dur.enter`, `ease.enter`, **stagger.base** antar anak.
- **Tidak serempak:** judul → garis bunga → body → aksen, masing-masing telat 80–120ms.
- **Idle setelah masuk:** aksen (bunga/divider/illustrasi) dapat breathing/sway pelan.
- **Antar-section:** `drapery-divider` sebagai transisi (reveal/wipe) — bukan potongan keras.
- **Exit:** elemen lama fade `opacity→0.6` + y kecil saat keluar (parallax ringan), tidak hilang patah.
- Background satu kanvas kontinu (ivory) → section "mengalir", bukan kotak-kotak.

Setiap section punya **1 aksen bergerak** sebagai tanda hidup; jangan ada section yang 100% teks statis.

---

## 1. Loading (1–2 detik)
- Aset: `illustrations/loading-motif.png` (kucing tidur di karangan bunga).
- Gerak: wreath **rotate pelan** (±6°, 3s yoyo) + **breathing** kucing; dot/teks "…" pulse.
- Progress: fade-through otomatis ke gate (opacity cross-fade 400ms). Tanpa spinner kaku.

## 2. Opening Gate (storybook page)
- Aset: `florals/floral-border-full.png` (bingkai), nama tamu (dari `?to=`), tombol "Buka Undangan".
- Masuk: bingkai bunga **draw/scale-in** dari tepi (stagger sisi), nama tamu fade+`y` lembut, tombol pop `ease.settle`.
- Idle: bingkai bunga **sway** halus; tombol breathing scale 1→1.03.
- **Tap "Buka Undangan"** = (a) minta izin gyro, (b) start audio La Vie en Rose (fade-in volume 0→target 1.2s), (c) gate **page-turn/curtain reveal** (rotateY/clip) → trigger hero assemble (file 09).
- Kucing TIDAK muncul di gate (disimpan untuk hero reveal).

## 3. Hero → lihat `09-hero-choreography.md`.

## 4. Welcome Message
- Aset: `illustrations/welcome-accent.png` (doves + bunga), teks sambutan + **Surat Yasin Ayat 36**.
- Masuk: accent fade+scale dari atas; teks per-baris stagger (efek "ditulis perlahan", bukan blok).
- Idle: doves accent melayang ±3px; ayat dengan highlight lembut (opacity breathe).
- Ambient: 2–3 petals lewat.

## 5. Countdown
- Aset: `scenes/countdown-bg.webp` (band opaque) + angka hari·jam·menit·detik.
- Masuk: band fade; angka pop stagger `ease.settle`.
- Idle: **flip/roll** angka tiap detik dengan transisi mikro (y +6→0 + opacity), TIDAK ganti angka secara patah. Band breathing scale 1→1.01.
- Ambient: sedikit petals; bunga kecil sway di sudut band.

## 6. Love Story (baris-baris pendek, kronologis)
- Aset: `illustrations/story-meeting.png` (ketemu online), `illustrations/story-growing.png` (tumbuh bersama).
- Layout: vignette ilustrasi selang-seling kiri/kanan dengan baris cerita.
- Masuk: tiap baris reveal saat tersentuh scroll (scrub ringan), ilustrasi **slide masuk dari sisi** + settle.
- Idle: ilustrasi breathing; elemen kecil di dalamnya (hati/garis koneksi di story-meeting) pulse.
- Ambient: petals jarang, jaga fokus baca.

## 7. Japan Dream (Keio Hiyoshi · SIT Tokyo)
- Aset: `illustrations/japan-motif.png` (sakura/kampus/kereta).
- Masuk: motif fade+scale; **kelopak sakura** ekstra turun (varian warna petals → pink lembut) saat section ini.
- Idle: motif breathing; sakura drift; siluet pasangan (di motif) bergerak super halus bila memungkinkan.
- Transisi: dari story ke japan pakai `drapery-divider` ripple.

## 8. Event Details
- Aset: `illustrations/event-accent.png` (arch drapery+bunga), `illustrations/map-pin.png`, tombol Save-to-Calendar, daftar etiquette, livestream.
- Masuk: arch accent reveal membingkai blok tanggal/venue; baris detail stagger; map-pin **drop + bounce** (`ease.settle`).
- Idle: arch drapery sway; map-pin pulse halus (menarik tap).
- Etiquette & livestream: muncul sebagai kartu lembut, stagger; ikon fade.
- Map embed: load lazy saat section masuk.

## 9. RSVP
- Aset: soft note-card; `florals/floral-sprig.png` sebagai aksen kartu.
- Masuk: kartu slide+settle; field muncul stagger.
- Interaksi (hidup, bukan kaku):
  - Pilihan Hadir/Tidak/Masih Diusahakan = pill yang **morph** saat dipilih (scale+warna, `ease.settle`).
  - Input focus: underline **grow** dari tengah, label naik halus.
  - Submit: tombol → spinner bunga kecil → **checkmark draw** + petals burst kecil (perayaan mikro).
- Sticky RSVP button (mobile): muncul setelah hero, breathing halus, sembunyi saat di section RSVP.

## 10. Wishes / Guestbook (publik)
- Masuk: form + daftar wishes; tiap wish card stagger fade+y.
- Wish baru terkirim: **prepend** dengan animasi slide-down + highlight sejenak.
- Idle: list scroll halus (Lenis); kartu hover/tap lift kecil.
- Ambient: 1–2 doves lewat di header section.

## 11. Gift / Tanda Kasih
- Aset: `illustrations/gift-accent.png` (kotak+amplop+bunga). Nada lembut, tidak memaksa.
- Masuk: accent reveal; opsi (Bank Indonesia · Bank Jepang · alamat hadiah) sebagai kartu **expand accordion** halus.
- Interaksi: tombol "Salin no. rekening" → micro toast "Tersalin ✓" + pop.
- FAQ accordion: buka/tutup dengan height auto + fade konten (ukur tinggi via JS, animasikan transform/opacity, hindari animasi height kaku → pakai grid-rows trick atau measured max-height).
- Idle: pita pada gift breathing.

## 12. Closing (simetri emosional)
- Aset: kembali ke dunia hero — `couple-cutout` + beberapa `cat-*` + `cat-peek`.
- Masuk: scene mini ber-assemble lagi (versi ringkas), teks "Tak sabar menanti kehadiranmu di hari bahagia kami."
- Signature: `cat-peek.png` **mengintip** dari tepi bawah (slide-in + intip + sembunyi sesekali) — easter charm.
- Idle: breathing; doves terbang menjauh ke atas (penutup). Petals memudar.
- Audio: tetap loop; tombol mute selalu tersedia.

---

## Ritme keseluruhan
- Total jelajah ± 1 menit; jangan tahan user dengan animasi panjang.
- Maks 1 momen "wow" besar (hero). Sisanya **micro-delight** konsisten.
- Pastikan tiap section: **(1) reveal masuk, (2) ≥1 idle motion, (3) transisi keluar halus.**
- Cross-ref aset→gerak detail & particle config → `12-asset-motion-map.md`.
