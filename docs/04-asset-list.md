# 04 — Asset List

> **STATUS: aset SUDAH dibuat, dibersihkan, & ditata.** Lokasi final yang berlaku ada di **`/README.md`**.
> Foto sumber kini di `assets/_source/`. Folder final: `scenes/` (bukan `hero/`), `cats/`, `couple/`, `florals/`, `illustrations/`, `gallery/`, `audio/`.

Semua aset dibuat agar cocok dengan arah storybook: komposisi kucing, mood sinar pagi, galeri scrapbook, dan kelembutan drapery-floral. Generate via Gemini / ChatGPT / Midjourney. Referensi emosi: JPG; bahasa dekorasi: PDF.

**Aturan umum prompt:**
- Palette: ivory, cream, blush pink, dusty pink, soft peach, sage greenery. **Hindari pink terang/fuchsia, warna bold.**
- Gaya: whimsical illustration, storybook, soft watercolor/gouache, airy, early-morning sunshine.
- Background **transparan (PNG)** untuk aset yang ditempel (kucing, floral, divider).
- Mobile-first → ekspor ringan & terkompresi (WebP bila bisa). Hero boleh resolusi lebih tinggi tapi tetap dioptimasi.

---

## assets/scenes/  *(dulu "hero/")*
| File | Deskripsi | Catatan |
| :-- | :-- | :-- |
| `hero-main.webp` | Ilustrasi utama (4:5): kedua mempelai + kucing, sesuai referensi WhatsApp | Hero utama |
| `hero-tall.webp` | Versi 9:16 | Opsi full-bleed layar mobile |
| `hero-bg.webp` | Background lembut (langit + padang bunga, tanpa orang) | Layer terpisah untuk parallax |
| `countdown-bg.webp` | Band lembut opaque | Latar di belakang angka countdown |

## assets/cats/
*(JPG = referensi; generate kucing satu per satu, transparan)*
| File | Deskripsi |
| :-- | :-- |
| `cat-01.png` | Kucing #1, pose duduk |
| `cat-02.png` | Kucing #2, pose lain |
| `cat-03.png` | (jika ada) kucing tambahan dari JPG |
| `cat-peek.png` | Kucing "mengintip" untuk closing/easter-feel halus |

> Jumlah & pose kucing mengikuti JPG referensi. Semua transparan, konsisten satu art direction.

## assets/florals/
| File | Deskripsi |
| :-- | :-- |
| `floral-corner-tl.png` | Aksen bunga sudut (asimetris) |
| `floral-corner-br.png` | Aksen bunga sudut pasangan |
| `floral-sprig.png` | Ranting/greenery kecil pemisah |
| `drapery-divider.png` | Divider kain putih mengalir antar-section |
| `arch-frame.png` | Frame lengkung (arch) untuk crop gambar/kartu |

## assets/gallery/
*(gaya scrapbook, subtle, tidak terlalu banyak)*
| File | Deskripsi |
| :-- | :-- |
| `gallery-01..0n.webp` | Foto/ilustrasi kenangan, frame scrapbook/polaroid |
| `gallery-frame.png` | Overlay bingkai scrapbook (opsional, dipakai ulang) |

## assets/audio/
| File | Deskripsi | Catatan |
| :-- | :-- | :-- |
| `la-vie-en-rose.mp3` | Backsound, **La Vie en Rose** | Dikompres untuk mobile, volume rendah, loop halus, autoplay setelah interaksi pembuka |

---

## Aset ilustrasi naratif (opsional, bila ringan)
- Ilustrasi section story: pertemuan/tumbuh bersama.
- Motif **Japan/campus** (sakura/kampus/jendela kereta — simbolik, halus).
- Ilustrasi opening gate (storybook page).
- Ilustrasi closing yang menggemakan hero (simetri emosional).

## Checklist generate
- [ ] Hero utama + background
- [ ] Kucing transparan (1 per 1, sesuai JPG)
- [ ] Floral corners + greenery sprig
- [ ] Drapery divider + arch frame
- [ ] Gallery scrapbook frames + foto
- [ ] Motif Japan/campus (story)
- [ ] Audio La Vie en Rose (terkompresi)
- [ ] Opening gate & closing illustration
