# 12 — Asset → Motion Map

Peta tiap aset ke perannya. **Format baru:** setiap aset punya dua baris — **fal.ai layer** (apa yang video lakukan) + **GSAP layer** (apa yang GSAP tambahkan di atas). Jangan duplikasi motion antara keduanya.

> **Aturan:** fal.ai owns ambient/idle. GSAP owns entrance/parallax/interaction.

---

## Scenes (Hero Living Backgrounds)

### `hero-bg-loop.mp4` (fal.ai Tier 0)
| Layer | Motion | Detail |
| :-- | :-- | :-- |
| **fal.ai** | Meadow breathes, wildflowers sway, petals drift, light shifts | Seamless 5s loop, static camera |
| **GSAP** | Parallax translateY (factor 0.02) on scroll/tilt | Almost stationary — creates depth |
| **Entrance** | Fade-in 800ms saat Gate dibuka | Poster = `hero-bg.webp` |
| **Reduced** | Show poster static PNG, no video | |

### `meadow-bottom-loop.mp4` (fal.ai Tier 1)
| Layer | Motion | Detail |
| :-- | :-- | :-- |
| **fal.ai** | Wildflower meadow sways gently | Seamless loop |
| **GSAP** | Parallax translateY (factor 0.06) | Slightly faster than sky |
| **Reduced** | Static PNG | |

### `countdown-bg.webp` (static)
| Layer | Motion | Detail |
| :-- | :-- | :-- |
| **fal.ai** | None (static PNG) | |
| **GSAP** | Breathing scale 1→1.01 8s `ease.float` | Subtle pulse |
| **Reduced** | Statis | |

---

## Couple (`/couple/`)

### `couple-idle.mp4` (fal.ai Tier 2)
| Layer | Motion | Detail |
| :-- | :-- | :-- |
| **fal.ai** | Couple breathes, hair moves softly, gentle smile | 5s loop, transparent bg |
| **GSAP entrance** | opacity + y40→0 + scale .96→1 `ease.settle` | |
| **GSAP idle** | Parallax translateY (factor 0.12) on scroll | No extra breathing — fal.ai handles |
| **Reduced** | Static `couple-cutout.png` | |

---

## Cats (`/cats/`) — Tier 3

Semua kucing: fase & offset **acak** (jangan sinkron satu pun).

### `cat-{name}-idle.mp4` (fal.ai)
| Layer | Motion | Detail |
| :-- | :-- | :-- |
| **fal.ai** | Breathes, ear twitches once, tail sways, blink (organic) | 5–6s loop, transparent bg |
| **GSAP entrance** | stagger.base, opacity + y30→0 + scale .9→1 `ease.settle` | Urut dipangku → di rumput |
| **GSAP idle** | Parallax translateY (factor 0.20–0.32, random per cat) | No extra breathing |
| **GSAP settle** | settle-shift ±1–2px tiap 8–14s (phase random) | Subtle ground presence |
| **Reduced** | Static transparent PNG | |

### `cat-peek.png` (Closing section — CSS only)
| Layer | Motion | Detail |
| :-- | :-- | :-- |
| **CSS** | Peek-hide loop `@keyframes` translateY 0↔-60% tiap ~10s | No fal.ai video needed |
| **GSAP entrance** | Slide dari bawah saat closing section enters viewport | |
| **Reduced** | Diam | |

---

## Florals & Decor (`/florals/`)

### Video loop florals (fal.ai Tier 1–4)
| Aset | fal.ai Motion | GSAP Layer |
| :-- | :-- | :-- |
| `floral-garland-loop.mp4` | Sways gently in breeze, roses bob | Parallax 0.06, fade entrance |
| `floral-swag-loop.mp4` | Breathes and sways | Parallax 0.08 |
| `meadow-bottom-loop.mp4` | Wildflowers sway (lihat Scenes) | ← sama di atas |

### CSS-animated florals (Tier 4)
| Aset | CSS Motion | GSAP tambah |
| :-- | :-- | :-- |
| `floral-corner-tl.png` | `@keyframes` rotate ±1.2° pivot bottom-right, 7s | scale 1.08→1 entrance dari tepi |
| `floral-corner-br.png` | `@keyframes` rotate ±1° mirror pivot, 8s (beda fase) | scale entrance |
| `floral-sprig.png` | sway ±0.8° 6s | fade + y entrance |
| `drapery-divider.png` | gradient mask shift + scaleY micro | reveal/wipe antar-section |
| `arch-frame.png` | sway ±0.5° 9s | reveal membingkai |

### Accent elements (GSAP only, Tier 5)
| Aset | GSAP Motion | Detail |
| :-- | :-- | :-- |
| `accent-doves.png` | MotionPath bezier kiri→kanan, 12–16s, jalur random tiap loop | 1–2 ekor terbang |
| `accent-butterflies.png` | bezier pendek + wing-flutter `scaleX 1↔0.82` 180ms | 2–3 instance |
| `petals-anim.png` | particle canvas: jatuh + sway sinus + putar | 8–14 HIGH, 6 MID, 0 LOW |

---

## Gallery (`/gallery/` — Foto Asli Style-Harmonized)

> Foto asli dari `FOTO INVITATION/` di-style-harmonize via fal.ai flux img2img (strength 0.3). Tidak pernah dijadikan video. Motion hanya dari GSAP + CSS.

| Aset | fal.ai | GSAP |
| :-- | :-- | :-- |
| `gallery-0n.webp` | Style harmonize only (no video) | scrapbook scatter-in: opacity + rotate ±3° + y, stagger.loose; hover lift |
| `gallery-frame.png` | None | static overlay |

---

## Illustrations (`/illustrations/`)

| Aset | fal.ai | GSAP |
| :-- | :-- | :-- |
| `loading-motif.png` | None | wreath rotate ±6° 3s yoyo + breathing |
| `story-motor.png` | None (Gemini generated) | slide dari sisi + settle; breathing |
| `story-jakarta.png` | None | slide + breathing |
| `story-ldr.png` | None | slide + breathing |
| `story-keio.png` | None | slide + breathing; sakura petals tambah |
| `story-married.png` | None | slide + settle + hati pulse |
| `map-pin.png` | None | drop + bounce `ease.settle` |

---

## Audio
| File | Start | Behavior |
| :-- | :-- | :-- |
| `la-vie-en-rose.mp3` | Setelah tap Gate | Fade 0→0.5 (1.2s), loop, toggle mute |

---

## Ambient Particle Config (`Particles.ts`)

```typescript
type Particle = { x, y, vx, vy, size, rot, vrot, swayPhase, opacity }

// Spawn rates per tier
const COUNTS = { HIGH: 13, MID: 6, LOW: 0, REDUCED: 0 }

// Behavior
vy = 8–20 px/s              // jatuh pelan
swayX = amplitude * Math.sin(t * 0.5 + swayPhase)  // sway sinus
rot += vrot                 // spin pelan
// Fade-in spawn (atas) → fade-out dekat bawah → recycle

// Warna: blush / cream / soft peach (random), size 6–16px
// Section Japan: palet → pink sakura, count +2
```

Pause saat tab hidden & canvas off-screen. Z-layer: belakang teks penting, opacity ≤ 0.8.

---

## Doves & Butterflies Path

- **Doves:** MotionPath bezier (kiri,atas) → (kanan,atas), 12–16s, `ease.float`. Tiap putaran: offset Y & durasi random ±15%.
- **Butterflies:** 2–3 instance, path bezier pendek area bunga, 6–10s, wing-flutter `scaleX` cepat.
- Keduanya: `transform` only, pause off-screen.

---

## Interaksi Mikro

| Elemen | Interaksi |
| :-- | :-- |
| Tombol "Buka Undangan" | breathing idle (CSS); tap → ripple + page-turn reveal |
| Pilihan RSVP (pill) | select → morph scale+warna `ease.settle` |
| Input field | focus → underline grow dari tengah |
| Submit RSVP | spinner bunga → checkmark draw + petals burst |
| "Salin rekening" | tap → toast "Tersalin ✓" pop |
| FAQ accordion | buka → fade + reveal (transform, bukan height) |
| Wish terkirim | prepend slide-down + highlight sesaat |
| Sticky RSVP / ScrollTop | fade+scale, breathing halus |

---

## Aturan Akhir
1. **fal.ai video** = ambient idle. **GSAP** = entrance + parallax + interaction.
2. Jangan duplikasi breathing antara fal.ai dan GSAP.
3. Fase & durasi loop acak per elemen — tidak ada dua yang sinkron.
4. Entrance: stagger + overlap + settle.
5. Semua transform/opacity — pause off-screen.
6. REDUCED → static PNG poster, no video, no loop.
