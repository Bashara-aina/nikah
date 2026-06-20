# 04 — Asset List

> **STATUS: Referensi aset AI ada di `correct/most correct/`. Foto asli ada di `FOTO INVITATION/`. Semua aset akan melalui pipeline fal.ai sebelum dipakai di site.**
> Output final video: `assets/video/`. Output final PNG: `assets/{scenes,cats,couple,florals,illustrations,gallery}/`.

---

## Pipeline Tiga Sumber Aset

```
FOTO INVITATION/     → fal.ai img2img (style harmonize) → assets/gallery/
correct/most correct/ → fal.ai (rmbg + img2vid + img2img) → assets/{cats,florals,scenes}/
scenes/              → fal.ai img2vid (hero living bg)   → assets/video/
```

> **Aturan keras:** Foto asli (`FOTO INVITATION/`) TIDAK PERNAH dijadikan video. Hanya style-transfer ke palette storybook. Wajah & momen asli dipertahankan.

---

## Aturan Umum Prompt fal.ai

- **Palette:** ivory, cream, blush pink, dusty pink, soft peach, sage greenery. Hindari pink terang/fuchsia, warna bold.
- **Gaya:** whimsical illustration, storybook, soft watercolor/gouache, airy, early-morning sunshine.
- **Background PNG:** Semua kucing & karakter wajib transparent PNG (via `bria/rmbg` dulu).
- **Video loop:** 5–6 detik, seamless loop, static camera shot, ambient motion only.
- **Mobile-first:** Ekspor WebP untuk gambar statis, MP4 H.264 untuk video.

---

## assets/scenes/ — Hero Living Backgrounds

| File | Sumber Referensi | fal.ai Treatment | Output |
| :-- | :-- | :-- | :-- |
| `hero-bg.webp` | `scenes/hero-main.webp` | img2vid → living meadow | `video/hero-bg-loop.mp4` |
| `hero-tall.webp` | `scenes/` versi 9:16 | img2vid → poster mobile | `video/hero-tall-loop.mp4` |
| `countdown-bg.webp` | `correct/` gradient bg | img2img (refine) → static | `scenes/countdown-bg.webp` |

**Prompt hero-bg-loop:** `"Soft meadow breathes gently, wildflowers sway in morning breeze, dappled sunlight shifts, petals drift, storybook watercolor illustration style, seamless loop [Static shot]"` 
**Model:** `fal-ai/minimax/video-01-live`

---

## assets/cats/ — Character Sprites (Transparent)

Semua kucing dari `correct/most correct/` harus melalui dua tahap:
1. **Step 1:** `fal-ai/bria/rmbg` → hapus background → transparent PNG
2. **Step 2:** `fal-ai/wan-2.6` → animate idle loop → transparent video (WebM/MP4)

| File Output | Referensi Sumber | Nama Asli | Karakter |
| :-- | :-- | :-- | :-- |
| `cat-jiro.png` + `cat-jiro-idle.mp4` | `cat-jiro-in-flowers.png` | Jiro | Duduk di bunga |
| `cat-meng.png` + `cat-meng-idle.mp4` | `cat-meng-with-flowers.png` | Meng | Dengan bunga |
| `cat-moju.png` + `cat-moju-idle.mp4` | `cat-moju-sleeping-flowers.png` | Moju | Tidur |
| `cat-shiro.png` + `cat-shiro-idle.mp4` | `cat-shiro-butterfly.png` | Shiro | Dengan kupu-kupu |
| `cat-simba.png` + `cat-simba-idle.mp4` | `cat-simba-with-dove.png` | Simba | Dengan merpati |
| `cat-hoshi.png` + `cat-hoshi-idle.mp4` | `cat-hoshi-kimho-playing.png` | Hoshi | Bermain |
| `cat-peek.png` + `cat-peek-idle.mp4` | `tuxedo-cat-reaching-flower.png` | Peek | Mengintip/meraih |
| `cats-hero-group.png` + `cats-hero-group-idle.mp4` | `cats-white-tuxedo-arch-frame.png` | Group hero | Tuxedo + white di arch |
| `cats-meadow.png` + `cats-meadow-idle.mp4` | `five-cats-golden-meadow-sunset.png` | Meadow group | 5 kucing di padang |

**Prompt idle (per kucing):** `"[cat name] breathes slowly, ear twitches once gently, tail sways softly, storybook watercolor illustration style preserved, transparent background [Static shot]"` 
**Model Step 1:** `fal-ai/bria/rmbg` 
**Model Step 2:** `fal-ai/wan-2.6` atau `fal-ai/minimax/video-01-live`

---

## assets/couple/ — Karakter Utama

| File Output | Sumber Referensi | Treatment |
| :-- | :-- | :-- |
| `couple-cutout.png` | `couple-scooter-vespa-wedding.png` | rmbg → transparent PNG |
| `couple-idle.mp4` | `couple-scooter-vespa-wedding.png` | rmbg → img2vid idle loop |
| `cats-arch.png` | `white-and-tuxedo-cats-under-arch.png` | rmbg → transparent PNG |
| `cats-arch-idle.mp4` | `white-and-tuxedo-cats-under-arch.png` | rmbg → idle video loop |

**Prompt couple-idle:** `"Couple breathes warmly together, gentle hair movement, soft smile, baju pengantin Melayu, storybook watercolor style preserved, transparent background [Static shot]"`

---

## assets/florals/ — Dekorasi

Dibagi dua kategori: **video loop** (hero-visible, large) dan **CSS animation** (divider, aksen kecil).

### Florals → fal.ai video loop (besar, di hero/section headers)

| File Output | Sumber Referensi | Prompt fal.ai |
| :-- | :-- | :-- |
| `floral-garland-loop.mp4` | `floral-garland-full-swag.png` | `"Floral garland sways gently in soft breeze, pastel roses and greenery, seamless loop [Static shot]"` |
| `floral-swag-loop.mp4` | `floral-swag-full.png` | `"Floral swag breathes and sways softly, ivory and blush palette, seamless loop [Static shot]"` |
| `meadow-bottom-loop.mp4` | `wildflower-meadow-full.png` | `"Wildflower meadow bottom sways in morning breeze, pastel colors, seamless loop [Static shot]"` |

**Model:** `fal-ai/minimax/video-01-live`

### Florals → CSS animation (divider, aksen kecil)

| File | Sumber Referensi | Motion |
| :-- | :-- | :-- |
| `floral-corner-tl.png` | `vertical-floral-spray.png` | CSS `@keyframes` rotate ±1.2° |
| `floral-corner-br.png` | `vertical-rose-spray.png` | CSS `@keyframes` rotate ±1° mirror |
| `floral-sprig.png` | `vertical-garden-spray.png` | CSS sway ±0.8° |
| `drapery-divider.png` | `flowing-floral-divider-wavy.png` | CSS ripple mask |
| `arch-frame.png` | `cats-white-tuxedo-arch-frame.png` | CSS sway ±0.5° |
| `petals-anim.png` | `falling-petals-scattered.png` | GSAP particle system |
| `accent-doves.png` | `doves-with-flowing-flowers.png` | GSAP MotionPath |
| `accent-butterflies.png` | `cat-shiro-butterfly.png` (crop) | GSAP bezier flutter |

---

## assets/gallery/ — Foto Asli (Style-Harmonized)

> Foto dari `FOTO INVITATION/` **tidak pernah dijadikan video**. Hanya di-style-transfer agar palette cocok dengan storybook site. Wajah, momen, dan identitas dipertahankan sepenuhnya.

| Treatment | Tool | Prompt |
| :-- | :-- | :-- |
| Style harmonize | `fal-ai/flux/dev/image-to-image` | `"Harmonize photo into soft watercolor storybook illustration style, ivory cream blush palette, preserve faces and expressions, airy early-morning light, do not change composition"` |
| Strength | 0.25–0.35 (rendah) | Jaga kemiripan wajah, bukan full illustration |

Output: `gallery-01.webp … gallery-0n.webp` (scrapbook frames via CSS overlay)

---

## assets/audio/

| File | Keterangan |
| :-- | :-- |
| `la-vie-en-rose.mp3` | Dikompres, loop halus, start setelah tap Gate |

---

## Checklist Generate (urut)

- [ ] `bria/rmbg` semua kucing & couple (transparent PNG)
- [ ] Hero bg video loops (scenes/) → `video/hero-bg-loop.mp4`
- [ ] Cat idle video loops (wan-2.6) → `video/cat-*-idle.mp4`
- [ ] Couple idle video loop → `video/couple-idle.mp4`
- [ ] Floral garland + swag video loops
- [ ] Meadow bottom video loop
- [ ] Gallery photo style-harmonize (flux img2img, strength 0.3)
- [ ] Story illustrations (5 dari `TODO_ASSETS.md` via `07-gemini-asset-prompts.md`)
- [ ] CSS-only florals: rmbg saja, no video
- [ ] Audio La Vie en Rose (terkompresi)

> Semua output video ke `nikah-web/assets/video/`, semua PNG ke folder masing-masing.
