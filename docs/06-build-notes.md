# 06 — Build Notes

Catatan teknis untuk Claude Code / Cursor agar implementasi tetap selaras dengan brief. **Mulai dari file planning ini**, bukan dari prompt kosong.

---

## Prinsip Utama
1. **Mobile-first, phone portrait** sebagai acuan desain pertama.
2. **Ringan & cepat** — prioritaskan koneksi lambat & HP kentang.
3. **Satu tema** (single light), tanpa dark mode.
4. **One-page**, scroll kontinu, transisi soft-flowing, tanpa nav bar terlihat.
5. Motion hanya **fade / float / reveal** yang halus.

---

## Stack (rekomendasi)
- **Statis & ringan** lebih disukai: HTML + CSS + JS vanilla, atau **Astro** (output HTML minim JS) / Vite.
- Hindari framework berat bila tidak perlu. Jika pakai React, pastikan bundle kecil + lazy-load.
- CSS: custom properties untuk palette & spacing. Animasi pakai CSS transitions + `IntersectionObserver` untuk reveal (hemat).
- Tidak ada library animasi berat (skip GSAP/Lottie penuh kecuali sangat ringan & perlu).

## Performa (wajib)
- Gambar: **WebP/AVIF**, `loading="lazy"`, `width/height` eksplisit (cegah CLS), `srcset` untuk responsif.
- Hero dioptimasi; preload hanya aset kritis.
- Audio: file kecil terkompresi, **tidak autoplay sebelum interaksi** (kebijakan browser) — start saat tap "Buka Undangan".
- Target: ringan dibuka di 3G. Lighthouse mobile sehat (Perf/Best Practices tinggi).
- Loading screen subtle 1–2 detik (jangan blokir lebih lama dari aset siap).

## Aksesibilitas & Etika
- Kontras teks cukup (teks pakai taupe/charcoal, bukan abu pucat di atas ivory).
- Tombol mute/unmute musik selalu tersedia & jelas.
- `prefers-reduced-motion` → kurangi animasi.

---

## Struktur Halaman (urutan render)
`Loading → Gate → Hero → Welcome → Countdown → Story → Event → RSVP → Wishes & Gift → FAQ → Closing`

Lihat `02-site-structure.md` untuk detail tiap section, `03-copywriting.md` untuk teks.

## Fitur & Implementasi
| Fitur | Catatan teknis |
| :-- | :-- |
| Personalized link | Baca `?to=` / `?g=slug`, render nama di Gate. Fallback aman. |
| Music autoplay | Mulai setelah tap pembuka. Loop, volume rendah. Tombol toggle. |
| Countdown | Target `2026-08-22T10:00:00+07:00`, format hari·jam·menit. |
| RSVP | POST ke Google Apps Script / Sheets. Validasi jumlah ≤ 4. |
| Wishes wall | GET wishes (publik), render feed, lazy-load/paginate. |
| Gift | Statis dari config, tombol "Salin" rekening. |
| Save to Calendar | Generate link Google Calendar + file `.ics`. |
| Map | Embed ringan atau tombol link ke `maps_url`. |
| Sticky RSVP | Button mobile mengarah ke section RSVP. |
| Scroll-to-top | Muncul setelah scroll, halus. |
| Livestream | Tombol-tombol; YouTube utama. |

## Data
- Semua konten dinamis & rahasia → **config + env**, bukan hardcode di repo publik.
- Lihat `05-data-fields.md` untuk skema Sheets, field, dan config event/gift/livestream.

## Aset
- Lihat `04-asset-list.md`. Letakkan di `assets/{hero,cats,florals,gallery,audio}/`.
- Semua aset tempel = PNG transparan; foto/galeri = WebP.

---

## Definition of Done (prototype pertama)
- [ ] One-page mobile semua section tampil sesuai `02-site-structure.md`.
- [ ] Gate membaca nama tamu dari link & menyapa.
- [ ] Musik La Vie en Rose start setelah tap, ada toggle.
- [ ] Countdown jalan ke 22 Agustus 2026, 10.00 WIB.
- [ ] RSVP tersimpan ke Google Sheets (Hadir/Tidak/Masih Diusahakan + jumlah ≤ 4).
- [ ] Wishes publik tampil & bisa kirim.
- [ ] Gift (ID & JP setara) + tombol salin.
- [ ] Map, Save to Calendar, livestream berfungsi.
- [ ] Lighthouse mobile lulus; ringan di koneksi lambat.
- [ ] Palette & tipografi sesuai `01-concept-brief.md`, tanpa warna bold.

## Urutan kerja
1. Lock 6 file planning (selesai).
2. Generate aset (`04-asset-list.md`).
3. Bangun prototype HTML/CSS/JS.
4. Sambungkan Google Sheets + logika link tamu.
5. Uji di HP beneran (koneksi lambat) → poles.
