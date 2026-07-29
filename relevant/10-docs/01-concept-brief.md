# 01 — Concept Brief

**Proyek:** Website undangan pernikahan Bashara & Hanifah
**Tanggal acara:** 22 Agustus 2026
**Hashtag:** #BASHicallyHANI's

---

## 1. Pernyataan Konsep

Sebuah undangan pernikahan satu halaman (one-page) yang dibuka seperti **buku cerita (storybook)**: lembut, intim, romantis, dengan sentuhan playful lewat karakter kucing. Website membuka dengan **scene hero berlapis yang benar-benar hidup** — video loop fal.ai untuk langit, padang, dan karakter — disusun via GSAP assemble. Lalu perlahan terurai menjadi narasi emosional sebelum menampilkan detail acara.

Rasa keseluruhan: **personal, lembut, fairytale, Indonesian dalam etika, modern dalam eksekusi, mobile-first, ringan, dan halus di setiap transisi.**

> Dunia yang diwujudkan = dunia dari referensi AI (`correct/most correct/`): pagi yang cerah, kehangatan, kucing, bunga, dan warna pastel yang tenang. Aset AI adalah **referensi gaya** — semua diproses ulang via fal.ai sebelum dipakai.

---

## 2. Tone & Mood

- Emosi 5 detik pertama: **menyambut, intim, romantis, sedikit playful dengan kucing.**
- Romansa **tenang dan understated**, bukan flashy.
- Terasa seperti **kisah cinta kami**, bukan sekadar "perayaan pernikahan".
- Atmosfer **pagi hari dengan sinar matahari** (early-morning sunshine).
- **Fairytale**, tapi tetap membumi.
- Suara naratif: **hangat, puitis, storytelling** — Bahasa Indonesia.
- Gender-neutral, global-modern dalam presentasi, Indonesian dalam etika.

**Tiga kata kunci:** intim · romantis · playful (kucing).

---

## 3. Identity Anchors

1. Dunia ilustrasi whimsical storybook — **hidup via fal.ai video loops**.
2. Romansa tenang, tidak mencolok.
3. **Kucing sebagai bagian dari kisah cinta**, bukan sekadar dekorasi.
4. Atmosfer pagi hari yang cerah.
5. Layout airy & minimal, transisi mengalir lembut via GSAP.
6. Elegansi drapery dari konsep dekorasi PDF.
7. **Foto asli (FOTO INVITATION/) = jiwa site** — dipertahankan utuh, di-style-harmonize saja.

---

## 4. Visual Direction

- **Drapery-inspired dividers** (kain putih mengalir) antar section.
- **Asymmetrical floral framing** (bunga satu sisi).
- **Arch shapes** untuk frame gambar & kartu.
- Permukaan **ivory & blush** terang.
- Aksen pastel; **greenery sebagai pendukung**.
- Gaya **illustrated** — bukan fotografis murni (foto asli di-harmonize ke palette).
- Galeri bergaya **scrapbook** (scatter + rotate kecil).

### Palette (5–7 warna)
| Warna | Peran |
| :-- | :-- |
| Ivory / Cream | Background dominan |
| Blush pink | Aksen lembut |
| Dusty pink | Aksen sekunder |
| Soft peach | Highlight hangat |
| Greenery (sage) | Pendukung botani |
| White drapery | Dividers / overlay |
| Soft charcoal/taupe | Teks (bukan hitam pekat) |

### Typography
- **Headings:** elegant serif.
- **Body:** clean premium sans-serif.
- Script accent halus untuk nama / hashtag (opsional, jangan berlebihan).

### Motion — Dua Lapisan
- **fal.ai:** menghidupkan semua idle/ambient (video loop karakter & scene).
- **GSAP:** orchestration entrance, parallax, interaksi.
- **CSS:** aksen kecil (floral divider, corner).
- Hasil: setiap elemen **benar-benar bernapas** — bukan simulasi di atas gambar diam.

---

## 5. Yang HARUS Dihindari

- Warna **bold / pink terang / fuchsia**.
- Estetika pernikahan generik & template.
- Terlalu banyak emas, glittery.
- Video berat tanpa fallback (wajib ada poster PNG + REDUCED mode).
- Animasi/aset yang bikin lambat di HP kentang — semua video pause saat off-screen.
- Dark mode — satu tema terkontrol.
- Kesan transaksional/memaksa di bagian hadiah.
- **Foto asli dijadikan video** — dilarang keras. Style harmonize saja.

---

## 6. Constraints Teknis

- **Mobile-first**, phone portrait sebagai acuan utama.
- Koneksi lambat & HP kentang — semua video pause off-screen, poster fallback selalu ada.
- Loading screen subtle 1–2 detik.
- `prefers-reduced-motion` → ganti semua video dengan static PNG poster.
- Musik **La Vie en Rose** start setelah tap Gate, loop, volume rendah.
- Link undangan personal per tamu + sapaan otomatis.
- RSVP ke **Google Sheets** via Apps Script.
- Dibangun dengan **Claude Code & Cursor** (setelah Phase 0 asset generation selesai).

---

## 7. Sumber Aset & Pipeline

| Sumber | Isi | Treatment |
| :-- | :-- | :-- |
| `FOTO INVITATION/` | Foto asli Bashara & Hanifah | fal.ai img2img style-harmonize strength 0.25–0.35 — wajah dipertahankan |
| `correct/most correct/` | AI reference illustrations | fal.ai rmbg + img2vid / img2img |
| `scenes/` | Hero scene references | fal.ai img2vid (living video loop) |

> Detail pipeline lengkap → `13-fal-generation-plan.md`.

---

## 8. Referensi

- **AI reference JPGs** (`correct/most correct/`): referensi gaya ilustrasi, komposisi, warna, karakter kucing.
- **PDF** (`Wedding Concept - Hani & Basha`): bahasa dekorasi — white drapery, asymmetrical florals, dusty/blush/peach/ivory, finish premium understated.
- **FOTO INVITATION/**: foto asli — jiwa emosional site, gallery scrapbook.
