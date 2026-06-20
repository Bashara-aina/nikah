# 12 — Asset → Motion Map

Peta tiap aset ke perannya: **entrance**, **idle (selalu hidup)**, **interaksi**, **depth/parallax**, **fallback REDUCED**. Token dari `08`. Ini referensi cepat saat coding tiap komponen.

Format kolom:
- **Entrance** = animasi masuk (reveal/assemble)
- **Idle** = loop hidup terus-menerus (kunci "tidak kaku")
- **Depth** = tier parallax (file 08 §4)
- **Reduced** = perilaku saat REDUCED/LOW

---

## Scenes (opaque, `public/assets/scenes/`)
| Aset | Entrance | Idle | Depth | Reduced |
| :-- | :-- | :-- | :-: | :-- |
| `hero-bg.webp` (langit/padang) | fade + scale 1.06→1 | awan drift translateX 0→-2% 30s yoyo | 0–1 | fade saja |
| `hero-main.webp` | — (sumber komposisi & fallback) | — | — | tampil utuh + fade |
| `hero-tall.webp` | — | — | — | poster fallback LOW |
| `countdown-bg.webp` | fade | breathing scale 1→1.01 8s | 1 | statis |

## Couple (`/couple/`)
| Aset | Entrance | Idle | Depth | Reduced |
| :-- | :-- | :-- | :-: | :-- |
| `couple-cutout.png` | assemble: opacity+ y40→0 + scale .96→1 (ease.settle) | breathing y±3 + scale→1.012 6s | 2 | fade |

## Cats (`/cats/`) — 8 ekor
Pola sama, **fase & durasi acak per ekor** (jangan sinkron).
| Aset | Entrance | Idle | Depth | Reduced |
| :-- | :-- | :-- | :-: | :-- |
| `cat-jiro/meng/moju/shiro/simba/hoshi/kimho.png` | stagger.base, opacity + y30→0 + scale .9→1 (ease.settle); urut: dipangku → di rumput | breathing y±2–4 + scale→1.01 (4–7s acak) + settle-shift 1–2px tiap 6–12s; "lirik" rotate ±0.8° sesekali | 3 | fade |
| `cat-peek.png` | closing: slide-in dari tepi bawah, intip | intip-sembunyi loop pelan (y peek↔hide) tiap ~8s | 4 | tampil diam |

> **Blink/ear/tail** = butuh aset tambahan (varian mata-tertutup / layer telinga-ekor). Backlog, lihat `09 §5`. Tanpa itu: breathing+sway+settle sudah "hidup".

## Florals & decor (`/florals/`)
| Aset | Entrance | Idle | Depth | Reduced |
| :-- | :-- | :-- | :-: | :-- |
| `floral-corner-tl.png` / `-br.png` | scale 1.08→1 dari tepi, stagger sisi | sway rotate ±1.2° pivot pangkal 7s (beda fase) | 4 | statis |
| `floral-sprig.png` | fade + y | sway ±1° 6s | 4 | statis |
| `floral-border-full.png` (Gate) | draw/scale-in dari tepi, stagger | sway lembut keseluruhan | 4 | statis |
| `drapery-divider.png` | reveal/wipe antar-section | ripple: mask gradient geser + scaleY mikro | 4 | statis |
| `arch-frame.png` | reveal membingkai foto/teks | drapery sway ±0.8° | 4 | statis |
| `accent-doves.png` | fade lalu mulai terbang | MotionPath melintas 12–16s, jalur/durasi variatif; 1–2 ekor | 5 | 1 diam atau hilang |
| `accent-butterflies.png` | fade | bezier pendek + wing-flutter scaleX 1↔0.82 180ms | 5 | hilang |

## Illustrations (`/illustrations/`)
| Aset | Entrance | Idle | Depth | Reduced |
| :-- | :-- | :-- | :-: | :-- |
| `loading-motif.png` | fade-in instan | wreath rotate ±6° 3s yoyo + kucing breathing | — | rotate pelan / statis |
| `welcome-accent.png` | fade + scale dari atas | doves accent float ±3px | 3 | fade |
| `story-meeting.png` | slide dari sisi + settle | breathing; garis koneksi + hati pulse | 3 | fade |
| `story-growing.png` | slide dari sisi + settle | breathing; kucing ikut bob | 3 | fade |
| `japan-motif.png` | fade + scale | breathing; sakura petals ekstra (varian pink) | 3 | fade |
| `event-accent.png` | reveal membingkai blok tanggal | drapery sway | 4 | fade |
| `map-pin.png` | drop + bounce (ease.settle) | pulse halus (ajak tap) | 4 | statis |
| `gift-accent.png` | reveal | pita breathing | 3 | fade |
| `gallery-frame.png` | scale-in saat foto masuk | diam (foto di dalamnya yang hidup) | 4 | statis |

## Gallery (`/gallery/`, foto ASLI)
| Aset | Entrance | Idle | Depth | Reduced |
| :-- | :-- | :-- | :-: | :-- |
| `gallery-01..09.jpg` | scrapbook scatter-in: opacity + rotate ±2–4° → 0 + y, stagger.loose | hover/tap lift + rotate kecil; bila carousel: Lenis-smooth | 3 | fade tanpa rotate |

## Audio (`/audio/`)
| `la-vie-en-rose.mp3` | start setelah tap Gate, fade volume 0→~0.5 (1.2s), loop. Toggle mute selalu ada. | — | — | tetap (audio bukan motion) |

---

## Ambient particle config (`Particles.tsx`)
Satu `<canvas>`, satu RAF. Partikel = sprite kecil (petal pastel / titik pollen). 

```
type Particle = { x,y, vx,vy, size, rot, vrot, swayPhase, opacity }
spawn rate & count per tier:
  HIGH: 12–14 aktif   MID: 6   LOW: 0   REDUCED: 0
behavior:
  vy = 8–20 px/s (jatuh pelan)
  x sway = amplitude 10–24px * sin(t*0.5 + swayPhase)
  rot += vrot (spin pelan)
  opacity fade-in saat spawn (atas), fade-out saat dekat bawah → recycle ke atas
warna: blush / cream / soft peach (acak), variasi ukuran 6–16px
section khusus Japan: ganti palet ke pink sakura, count +2
```
- Pause saat tab `hidden` (visibilitychange) & saat canvas off-screen.
- Z di atas konten? Tidak — taruh di layer 5 belakang teks penting, opacity ≤ 0.8, blur 0–1.5px (HIGH only) supaya tidak ganggu baca.

---

## Doves & Butterflies path (`Doves.tsx` / `Butterflies.tsx`)
- **Doves:** GSAP MotionPath bezier dari (kiri,atas) melengkung ke (kanan,atas). Durasi 12–16s, `ease.float`. Tiap putaran: offset Y & durasi di-random ±15%. Saat REDUCED → 1 dove diam kecil atau dihapus.
- **Butterflies:** 2–3 instance, path bezier pendek di area bunga, durasi 6–10s acak; overlay wing-flutter (`scaleX` cepat). Drift naik-turun kecil. REDUCED → hilang.
- Keduanya: `transform`-only, pause off-screen.

---

## Interaksi mikro (delight, bukan kaku)
| Elemen | Interaksi |
| :-- | :-- |
| Tombol "Buka Undangan" | breathing idle; tap → ripple + page-turn reveal |
| Pilihan RSVP (pill) | select → morph scale+warna (ease.settle) |
| Input field | focus → underline grow dari tengah, label naik |
| Submit RSVP | spinner bunga → checkmark draw + petals burst kecil |
| "Salin rekening" | tap → toast "Tersalin ✓" pop |
| FAQ accordion | buka → konten fade + reveal (transform, bukan height kaku) |
| Wish terkirim | prepend slide-down + highlight sesaat |
| Sticky RSVP / ScrollTop | muncul/sembunyi dengan fade+scale, breathing halus |

---

## Aturan akhir (recap "hidup, bukan kaku")
1. Tiap aset penting **punya idle** (tak ada yang diam mati).
2. Fase/durasi loop **di-random** (tak ada yang sinkron).
3. Entrance **stagger + overlap + settle** (tak ada yang serempak/snap).
4. Semua gerak **transform/opacity**, pause off-screen.
5. **REDUCED/LOW** → ganti gerak posisi dengan fade lembut; tetap anggun.
