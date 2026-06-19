# SPEC 12 — UX Wireframes & Flow Blueprint

Low-fi layout tiap section (mobile 360–430px), hierarki konten, thumb-zone, dan blueprint alur. Gerak di `docs/09–10`/`docs/10`; ini soal **tata letak & ritme**.

---

## 1. Prinsip layout
- **Mobile-first, satu kolom, terpusat.** Lebar konten ~ maks 480px.
- **Vertikal naratif**, mengalir (kanvas ivory kontinu, dipisah drapery-divider).
- **Thumb-zone:** aksi utama (CTA, RSVP, tombol) di **1/3 bawah** layar / mudah dijangkau jempol. Konten baca di tengah-atas.
- **Satu fokus per layar.** Tiap section punya 1 pesan/aksi utama.
- **Above-the-fold tiap section**: judul + 1 visual hidup terlihat tanpa scroll dalam section.
- Ritme: visual besar → teks sempit → aksen → divider. Hindari blok teks panjang.

Legend wireframe: `▓`=visual/ilustrasi, `≈`=teks, `[ ]`=tombol, `( )`=input, `·`=aksen.

---

## 2. Wireframes per section

```
LOADING                 GATE                    HERO
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│              │        │   · florals · │        │░ langit  🕊 ░│
│     ▓▓▓      │        │  ≈ Kepada,    │        │░  ▓couple▓  ░│
│   (kucing    │        │  ≈ **Nama**   │        │░ ▓cats cats▓ │
│    tidur)    │        │               │        │░ ≈We're      │
│    …loading  │        │  [ Buka       │        │  getting…    │
│              │        │    Undangan ] │◀thumb  │  ≈Bashara &  │
└──────────────┘        │   · florals · │        │  Hanifah     │
                        └──────────────┘        │  ≈22 Agt 2026│
                                                 └──────────────┘
```
```
WELCOME                 COUNTDOWN               STORY
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   · doves ·  │        │ ≈ Menuju hari │        │ ≈ Cerita kami │
│ ≈ sambutan   │        │  ▓band florals│        │ ▓meeting  ≈l1 │
│   hangat …   │        │ [HH][JJ][MM][SS]       │ ≈l2   ▓growing│
│ ≈ QS Yasin   │        │  hari jam …   │        │ ≈l3           │
│   :36        │        │               │        │ (baris pendek)│
└──────────────┘        └──────────────┘        └──────────────┘
```
```
JAPAN                   EVENT                   RSVP
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│ ≈ Mimpi kami │        │ · arch ·      │        │ ≈ Konfirmasi  │
│  ▓sakura/    │        │ ≈ 22 Agt 2026 │        │ ( nama )      │
│   kampus▓    │        │ ≈ 10.00–13.00 │        │ [Hadir][Tdk]  │
│ ≈ Keio &     │        │ ▓Widuri Lt.2  │        │ [Diusahakan]  │
│   SIT Tokyo  │        │ [📍 Peta]pin· │        │ ( jumlah 1–4 )│
│              │        │ ≈ etiquette…  │        │ ( pesan )     │
│              │        │ [Save 📅][live]│       │ [ Kirim ]◀thmb│
└──────────────┘        └──────────────┘        │ ≈ Deadline D-7│
                                                 └──────────────┘
```
```
WISHES                  GIFT                    CLOSING
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│ ≈ Ucapan &   │        │ · gift ·      │        │ ░▓couple+cats│
│   doa        │        │ ≈ Tanda Kasih │        │  ≈ Tak sabar │
│ ( nama )     │        │ ▼ Bank ID  [≡]│        │   menanti …  │
│ ( pesan )    │        │ ▼ Bank JP  [≡]│        │  🐾cat-peek  │
│ [ Kirim ]    │        │ ▼ Alamat hdh  │        │  🕊 → atas    │
│ ─ wall ─     │        │ ── FAQ ▼ ──── │        │              │
│ ▭ wish card  │        │ ≈ Q… ▼        │        └──────────────┘
│ ▭ wish card  │        │ ≈ Q… ▼        │
└──────────────┘        └──────────────┘
+ floating [RSVP]◀ sticky (muncul setelah hero, sembunyi di section RSVP)
+ floating [↑] scrolltop
```

---

## 3. Information architecture / urutan (final)
`Loading → Gate → Hero → Welcome(+Yasin) → Countdown → Story → Japan → Event(venue/map/etiquette/livestream/calendar) → RSVP → Wishes → Gift(+FAQ) → Closing`
- Emosi dulu, praktis kemudian (`docs/02`).
- Shortcut: sticky **RSVP** + (opsional) tap area "Lokasi" → scrollTo Event. Tanpa nav bar terlihat.

## 4. Content hierarchy per section (yang harus menonjol)
| Section | Primary | Secondary | Aksi |
| :-- | :-- | :-- | :-- |
| Gate | Nama tamu | — | Buka Undangan |
| Hero | Nama mempelai + tanggal | "We're getting married" | (scroll) |
| Welcome | Sambitan | Yasin 36 | — |
| Countdown | Angka | label | — |
| Story | Baris cerita | ilustrasi | — |
| Japan | Mimpi Jepang | Keio/SIT | — |
| Event | Tanggal+venue | etiquette/livestream | Peta, Save Calendar |
| RSVP | Pilihan hadir | jumlah/pesan | Kirim |
| Wishes | Form | wall | Kirim |
| Gift | Tanda Kasih | rekening/alamat | Salin |
| Closing | Pesan penutup | cats | — |

## 5. Progress & orientation (tanpa nav)
- **Audio toggle** + (opsional) **progress hairline** tipis di tepi atas (scroll progress, sangat halus) supaya user tahu posisi — opsional, jangan ganggu.
- Sticky RSVP = jangkar aksi utama.
- Divider drapery = penanda ganti "bab".

## 6. Empty / first-load / edge layout
- Wishes kosong → ilustrasi kecil + ajakan (center).
- Tanpa `?to=` → Gate sapa generik (layout sama).
- Desktop → kartu terpusat (maks ~520px) di kanvas ivory; hero boleh full-bleed; gallery bisa 2–3 kolom.

## 7. Reading rhythm (anti lelah)
- Maks ~3–5 baris teks per blok; baris cerita pendek (lines, bukan paragraf).
- 1 ide per layar; whitespace generous; visual menyelingi teks.
- Total ± 1 menit; user bisa lompat ke RSVP kapan saja.

## 8. Checklist
- [ ] tiap section sesuai wireframe & hierarki
- [ ] CTA utama di thumb-zone
- [ ] above-the-fold tiap section ada judul + 1 visual hidup
- [ ] sticky RSVP + scrolltop perilaku benar
- [ ] desktop layout terpusat rapi
- [ ] empty/edge layout disiapkan

Lanjut: **SPEC 13 — UX Quality, Accessibility & Acceptance**.
