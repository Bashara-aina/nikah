# SPEC 09 — UI Design System (visual kit)

Kit visual tunggal: warna, tipografi, spacing, radius, bayangan, dan **spesifikasi tiap komponen UI** (default + semua state). Tujuan: konsisten, lembut, premium — dan jadi acuan agar nothing terlihat "tempelan". Token gerak ada di `docs/08`; ini token **visual**.

---

## 1. Color (CSS vars di `globals.css`)
```
--ivory:#FBF7F0;  --cream:#F3E9DC;  --blush:#F3D9D6;  --dusty:#D9A7A0;
--peach:#F4C9A8;  --sage:#A9B89A;   --sky:#CFE0E8;     --ink:#4A4039;  --ink-soft:#7A6E63;
```
**Aturan pakai (jangan asal):**
| Peran | Warna |
| :-- | :-- |
| Background utama | `--ivory` (kanvas kontinu) |
| Permukaan kartu | `--cream` / putih 80% di atas ivory |
| Teks utama | `--ink` (≥ AA di atas ivory) |
| Teks sekunder | `--ink-soft` |
| Aksen / CTA | `--dusty` (sapaan) + `--sage` (sekunder) |
| Garis/aksen halus | `--sage` 40%, `--blush` |
| Highlight lembut | `--peach` / `--blush` (background pill aktif) |
**Larangan:** pink terang/fuchsia, neon, hitam pekat (pakai `--ink`), bayangan abu dingin. Maks 2 warna aksen kuat per layar.

## 2. Typography
- **Display/heading (serif elegan):** rekomendasi `Fraunces` atau `Cormorant Garamond`.
- **Body/UI (sans hangat):** `Plus Jakarta Sans` (cocok Bahasa Indonesia) atau `Inter`.
- Skala fluid (`clamp`, mobile-first):
  | Token | size | use |
  | :-- | :-- | :-- |
  | display | clamp(2.2rem,8vw,3.5rem) | nama mempelai, hero |
  | h1 | clamp(1.6rem,6vw,2.4rem) | judul section |
  | h2 | clamp(1.25rem,4.5vw,1.6rem) | sub |
  | body | 1rem / 1.06rem | paragraf |
  | small | .85rem | label, caption |
- Line-height: heading 1.15, body 1.6 (airy, mudah dibaca keluarga).
- Letter-spacing: heading serif normal/-1%; label kecil +4% uppercase opsional.
- Maks lebar baca teks: ~38–46ch (blok sempit di tengah).

## 3. Spacing & grid
- Skala 4px: `4,8,12,16,24,32,48,64,96`.
- Section padding vertikal: mobile `64–96px`, antar elemen `24–32px`. **Generous whitespace** (airy & premium).
- Konten terpusat, lebar maks ~480px mobile-card feel; full-bleed hanya hero & scene.
- Thumb-safe: aksi utama di 1/3 bawah layar (lihat `SPEC 12`).

## 4. Radius, border, elevation
- Radius: kartu `20–24px`, input `14px`, pill `999px`, gambar `16–20px`.
- Border: `1px` `--sage`/`--blush` 40% — tipis & lembut (opsional, banyak elemen borderless).
- **Shadow (warm & soft, bukan abu):**
  ```
  --shadow-sm: 0 2px 8px rgba(120,90,70,.06);
  --shadow-md: 0 8px 24px rgba(120,90,70,.10);
  --shadow-lg: 0 16px 40px rgba(120,90,70,.12);
  ```
  Jangan animasikan shadow (mahal) — pakai pseudo-element opacity bila perlu (`SPEC 11`).

## 5. Komponen — spesifikasi + state
> Semua transisi state pakai token `dur.micro`/`ease.soft` (`docs/08`). Fokus ring = `--sage` 2px offset 2px (selalu terlihat untuk keyboard).

### Button (primary)
- Bg `--dusty`, teks ivory, radius pill, padding `14px 28px`, `--shadow-sm`.
- States: hover (desktop) lighten 4% + lift 2px; **active** scale .97; focus ring; disabled opacity .5 + no-shadow; loading → spinner bunga kecil, teks fade.

### Button (ghost/secondary)
- Transparan, border `--sage`, teks `--ink`. Hover bg sage 8%.

### Pill (pilihan RSVP)
- Default: outline sage, teks ink. **Selected**: bg `--peach`/`--blush`, teks ink, check kecil, morph scale (`ease.settle`). Group: jarak 8–12px, wrap.

### Text input / textarea
- Style **underline** (bukan box penuh) di atas cream: garis bawah `--sage` 40%.
- Focus: underline **tumbuh dari tengah** ke sage penuh; label naik (float) `dur.micro`.
- Error: underline `--dusty`, pesan kecil di bawah, shake halus sekali. Valid: check kecil di kanan.

### Card (wish / info / gift)
- Bg cream/putih 85%, radius 20–24, `--shadow-sm`, padding 16–20. Hover/tap lift 2–3px.

### Accordion (FAQ)
- Header tap → konten reveal (transform/opacity, **bukan animasi height kaku**; pakai grid-rows 0fr→1fr atau measured). Chevron rotate 180 `dur.base`.

### Toast
- Muncul bawah-tengah, bg ink 90% teks ivory ATAU cream + ink, radius pill, `--shadow-md`. In: y+12→0 + fade; auto-hide 2.5s; `aria-live`.

### Sticky RSVP (mobile)
- Pill mengambang bawah-kanan, bg dusty, ikon + "RSVP". Breathing halus. Sembunyi di section RSVP & saat keyboard naik.

### ScrollTop
- Bulat kecil, bg cream + panah sage, muncul setelah scroll jauh, fade+scale.

### Countdown unit
- Empat blok (Hari·Jam·Menit·Detik): angka serif besar + label small. Ganti angka via roll mikro (`docs/10 §5`), bukan snap.

### Gallery item
- Foto radius 16–20, sedikit rotate acak (scrapbook), `--shadow-sm`, tap → buka lightbox lembut (fade + scale, swipe antar foto via Lenis/drag).

### Divider
- `florals/drapery-divider.png` sebagai pemisah section (bukan garis keras).

## 6. Iconography
- Minimal, garis lembut/rounded, warna `--ink-soft`/`--sage`. Pakai aset custom bila ada (map-pin, paw kecil opsional). Hindari ikon tajam korporat.

## 7. Imagery rules
- Cats/florals = PNG transparan trim. Foto gallery = real, sudut membulat + sedikit miring.
- Jangan taruh teks penting di atas area ramai (particle/florals) — beri panel cream semi-transparan bila perlu kontras.

## 8. Do / Don't (visual)
✅ airy, lembut, warm shadow, 1–2 aksen, banyak ruang.  
❌ penuh sesak, banyak warna, shadow abu keras, border tebal, teks lebar > 50ch, gradient norak.

## 9. Checklist
- [ ] CSS vars palet + aturan peran
- [ ] font dimuat (next/font) + skala fluid
- [ ] semua komponen + state (hover/active/focus/disabled/loading/error)
- [ ] shadow warm tokens (tidak dianimasikan)
- [ ] fokus ring keyboard di semua interaktif

Lanjut: **SPEC 10 — Interaction & Microinteractions**.
