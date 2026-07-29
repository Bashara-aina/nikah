# 02 — Site Structure

> **Asset reality check (baca dulu):**
> - Real photos → `FOTO INVITATION/` (sacred, faces never changed)
> - AI illustration reference → `correct/` (fal.ai must process before use)
> - Hero composition anchor → `scenes/hero-main.webp` (primary reference for all visual decisions)
> - All docs → `docs/`

One-page scrolling, mobile-first. Satu kanvas dreamy yang mengalir lembut (continuous), tanpa navigasi yang terlihat. Ritme jelajah ± 1 menit.

**Emotional arc:** loading → gate → hero → welcome → countdown → story → events → rsvp → wishes & gift → closing.

---

## 0. Loading Screen
- Subtle, **1–2 detik** saja.
- `loading/loading-motif.png` (kucing tidur dalam wreath).
- Lanjut otomatis ke gate.
- Hashtag `#BASHicallyHANI's` tampil kecil di bawah.

## 1. Opening Gate
- Gaya **storybook page** (bukan envelope/curtain).
- Bahasa **lebih lembut & modern** — bukan "Kepada Yth."
- **Nama tamu** tampil di tengah, prominent (dari query param `?to=` atau `?g=`).
- **Kucing belum muncul** di sini — disimpan untuk hero reveal.
- Tombol lembut **"Buka Undangan"** → memulai musik (La Vie en Rose) + masuk ke hero via GSAP curtain reveal.

## 2. Hero — Reveal
- **Komposisi mengacu `scenes/hero-main.webp`** — ini adalah patokan utama.
- Layer stack (dari belakang ke depan): sky video → meadow video → couple video → cats video (per kucing) → florals video → text.
- Semua layer video = output fal.ai dari `correct/`. **Bukan static PNG.**
- Headline: **"We are getting married"**.
- Nama: **Bashara Aina** & **Hanifah Syifa Azzahra Bay**.
- Tanggal: **22 Agustus 2026**.
- Inilah momen reveal kucing pertama kali.

## 3. Welcome Message
- Pesan sambutan hangat & puitis (Bahasa Indonesia).
- Kutipan **Surat Yasin Ayat 36**.
- Accent: `welcome/welcome-accent.png` (doves + florals).

## 4. Countdown
- Muncul setelah welcome.
- Format **hari · jam · menit**.
- Background: `countdown/countdown-bg.webp`.

## 5. Love Story
- Kronologis, baris-baris pendek (lines, bukan paragraf), orang ketiga.
- Sweet & sincere, subtle.
- Alur: pertemuan online via organisasi kampus → Jakarta bersama → LDR Tokyo → Hanifah diterima Keio → memutuskan menikah → melangkah bersama ke Jepang.
- **Motif Japan:** Hanifah di **Keio Hiyoshi**, Bashara di **SIT Tokyo** — studi bersama setelah menikah.
- Illustrations (Gemini-generated, GSAP only): `story-meeting`, `story-growing`, `story-motor`, `story-jakarta`, `story-ldr`, `story-keio`, `story-married`, `story-together`, `japan-motif`.

## 6. Gallery
- Scrapbook scatter layout.
- Source: **`FOTO INVITATION/` photos** — style-harmonized via fal.ai `flux/img2img` strength 0.25–0.35.
- Output: `assets/gallery/gallery-01..webp` onwards.
- **Faces and composition preserved. Never turned into video.**

## 7. Event Details
- **Akad & Resepsi** — 22 Agustus 2026, akad mulai **10.00**, selesai **13.00 WIB**.
- **Venue:** Widuri Restaurant, Lantai 2. Jl. Ciliwung No.19, Cihapit, Bandung Wetan, 40114 (dekat Gedung Sate).
- **Map:** https://maps.app.goo.gl/eCQJZkY3qMvepZQz6
- **Save to Calendar.**
- **Dress code:** warna pastel.
- **Etiquette notes:** akad mulai 10.00 tepat waktu; tidak ada anak-anak di lantai 2; ruang salat di lantai 1; tanpa flash; tidak berdiri saat prosesi akad.
- **Livestream:** YouTube (utama) · Zoom (interaksi) · Instagram (mempelai) · Facebook (4 orang tua).

## 8. RSVP
- Soft note-card.
- Opsi: **Hadir / Tidak Hadir / Masih Diusahakan**.
- Field: nama, jumlah hadir (plus one default; bawa anak → **maks 4**).
- Deadline **D-7** (15 Agustus 2026) tampil jelas.
- Submit → Google Sheets via Apps Script.
- Sticky RSVP button di mobile.

## 9. Wishes & Gift
- **Wishes:** message wall publik — semua tamu bisa baca. Lazy-load.
- **Gift ("Tanda Kasih"):** nada apresiatif, tidak memaksa. Indonesia & Jepang **setara**. Transfer + alamat hadiah fisik.
- **FAQ:** accordion collapse — parkir, anak-anak, livestream, hadiah.

## 10. Closing
- Kembali ke **dunia kucing & hero** — simetri emosional dengan section 2.
- fal.ai video loop aktif kembali (sama dengan hero).
- Pesan penutup: **"Tak sabar menanti kehadiranmu di hari bahagia kami."**

---

## Navigasi & Utilitas
- **Tanpa nav bar terlihat** — scroll editorial.
- Sticky **RSVP** button (mobile).
- **Scroll-to-top** button halus.
- **Save to Calendar** di section event.
- Transisi antar-section: soft flowing dividers (`drapery-divider.png`).
