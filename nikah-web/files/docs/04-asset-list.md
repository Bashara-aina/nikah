# 04 — Asset List

> **Sumber aset: 3 folder, 3 peran berbeda. Jangan dicampur.**
>
> | Folder | Peran | Boleh langsung dipakai di site? |
> | :-- | :-- | :-- |
> | `FOTO INVITATION/` | Foto asli Bashara, Hanifah, dan kucing-kucing | **TIDAK** — harus fal.ai `flux/img2img` strength ≤0.35 dulu |
> | `correct/` (dan `correct/most correct/`) | Ilustrasi AI reference — style & karakter | **TIDAK** — harus fal.ai (rmbg + video) dulu |
> | `scenes/` | Hero komposisi final | `hero-main.webp` = reference visual; `hero-bg.webp` & `hero-tall.webp` = poster fallback |

---

## 1. Video Assets (output fal.ai — masuk `public/assets/video/`)

Semua video = seamless loop, WebM + MP4 fallback, max 6 detik, silent.

| File | Source | fal.ai model | Keterangan |
| :-- | :-- | :-- | :-- |
| `hero-bg-loop.mp4` | `scenes/hero-main.webp` | `minimax/video-01-live` | Living meadow background |
| `couple-idle.mp4` | `correct/` couple cutout | `wan-2.6` | Couple gentle idle breathing |
| `cat-jiro-idle.mp4` | `correct/` cat-jiro | `wan-2.6` | Jiro idle: ear twitch, tail sway |
| `cat-meng-idle.mp4` | `correct/` cat-meng | `wan-2.6` | Meng idle: blink, whisker |
| `cat-moju-idle.mp4` | `correct/` cat-moju | `wan-2.6` | Moju idle: belly rise/fall (sleeping) |
| `cat-shiro-idle.mp4` | `correct/` cat-shiro | `wan-2.6` | Shiro idle: head tilt, butterfly watch |
| `cat-simba-idle.mp4` | `correct/` cat-simba | `wan-2.6` | Simba idle: tail wag, yawn |
| `cat-hoshi-idle.mp4` | `correct/` cat-hoshi | `wan-2.6` | Hoshi idle: big-eye curious look |
| `cat-kimho-idle.mp4` | `correct/` cat-kimho | `wan-2.6` | Kimho idle: calm sitting |
| `floral-corner-loop.mp4` | `correct/` floral-corner | `minimax/video-01-live` | Gentle petal drift |
| `floral-garland-loop.mp4` | `correct/` floral garland | `minimax/video-01-live` | Gentle garland sway |
| `closing-loop.mp4` | `correct/` closing illustration | `minimax/video-01-live` | Mirrors hero, warm evening light |

**Full prompts & script → `docs/13-fal-generation-plan.md`**

---

## 2. Static PNG Assets (output Gemini / post-rmbg fal.ai — masuk `public/assets/`)

Semua PNG = transparent background kecuali yang disebutkan.

| File | Source | Notes |
| :-- | :-- | :-- |
| `cats/cat-jiro.png` | `correct/` → fal.ai `bria/rmbg` | Poster fallback untuk video |
| `cats/cat-meng.png` | `correct/` → fal.ai `bria/rmbg` | Poster fallback |
| `cats/cat-moju.png` | `correct/` → fal.ai `bria/rmbg` | Poster fallback |
| `cats/cat-shiro.png` | `correct/` → fal.ai `bria/rmbg` | Poster fallback |
| `cats/cat-simba.png` | `correct/` → fal.ai `bria/rmbg` | Poster fallback |
| `cats/cat-hoshi.png` | `correct/` → fal.ai `bria/rmbg` | Poster fallback |
| `cats/cat-kimho.png` | `correct/` → fal.ai `bria/rmbg` | Poster fallback |
| `couple/couple-cutout.png` | `correct/` → fal.ai `bria/rmbg` | Poster fallback |
| `florals/floral-corner-tl.png` | Gemini | CSS-only gentle float |
| `florals/floral-corner-br.png` | Gemini | CSS-only gentle float |
| `florals/floral-sprig.png` | Gemini | Section divider |
| `florals/floral-border-full.png` | Gemini | Gate frame |
| `florals/drapery-divider.png` | Gemini | Between-section soft divider |
| `florals/arch-frame.png` | Gemini | Event / gallery frame |
| `florals/accent-doves.png` | Gemini | Welcome accent |
| `florals/accent-butterflies.png` | Gemini | Hero + closing accent |

---

## 3. Gallery Assets (output fal.ai `flux/img2img` — masuk `public/assets/gallery/`)

Source = **`FOTO INVITATION/`** photos. Style harmonized but **faces preserved**. Strength 0.25–0.35.

| Output file | Source (FOTO INVITATION) |
| :-- | :-- |
| `gallery-couple-01.webp` | `couple-standing-smiling.jpg` |
| `gallery-couple-02.webp` | `couple-standing-casual-pose.jpg` |
| `gallery-couple-03.webp` | `couple-overhead-bride-bouquet.jpeg` |
| `gallery-couple-04.webp` | `couple-overhead-lying-romantic.jpeg` |
| `gallery-couple-05.webp` | `couple-overhead-romantic-pose.jpeg` |
| `gallery-couple-06.webp` | `couple-overhead-side-by-side.jpeg` |
| `gallery-couple-07.webp` | `couple-overhead-spotlight-1.jpeg` |
| `gallery-couple-08.webp` | `couple-overhead-spotlight-2.jpeg` |
| `gallery-couple-09.webp` | `couple-overhead-groom-above.jpeg` |
| `gallery-cat-jiro.webp` | `cat-black-white-pendant-name-jiro.jpg` |
| `gallery-cat-meng.webp` | `cat-black-white-lying-bw-name-meng.jpg` |
| `gallery-cat-hoshi.webp` | `cat-gray-tabby-in-blankets-name-hoshi.png` |
| `gallery-cat-kimho.webp` | `cat-kimho-portrait.png` |
| `gallery-cat-simba.webp` | `cat-orange-white-on-couch-name-simba.png` |
| `gallery-cat-moju.webp` | `cat-ragdoll-portrait-name-moju.png` |
| `gallery-cat-shiro.webp` | `cat-white-closeup-pink-ears-name-shiro.png` |

---

## 4. Story Illustrations (Gemini-generated — GSAP only, no fal.ai)

Masuk `public/assets/story/`. PNG transparan. Semua Gemini, pakai `scenes/hero-main.webp` sebagai style anchor.

| File | Scene |
| :-- | :-- |
| `story-meeting.png` | Pertemuan online via organisasi kampus |
| `story-growing.png` | Tumbuh bersama |
| `story-motor.png` | Antar pulang ke kosan |
| `story-jakarta.png` | Bekerja bersama di Jakarta |
| `story-ldr.png` | LDR, Bashara di Tokyo |
| `story-keio.png` | Hanifah diterima Keio Hiyoshi |
| `story-married.png` | Keputusan menikah |
| `story-together.png` | Melangkah bersama ke Jepang |
| `japan-motif.png` | Motif Jepang — sakura, kampus, kereta |

---

## 5. Scene Posters / Backgrounds

| File | Location | Role |
| :-- | :-- | :-- |
| `scenes/hero-main.webp` | `nikah-web/scenes/` | **PRIMARY composition reference** |
| `scenes/hero-bg.webp` | `nikah-web/scenes/` | Sky/meadow poster fallback (LOW tier) |
| `scenes/hero-tall.webp` | `nikah-web/scenes/` | 9:16 mobile poster fallback |
| `countdown/countdown-bg.webp` | Gemini | Countdown section background |
| `loading/loading-motif.png` | Gemini | Loading screen |
| `gate/gate-illustration.png` | Gemini | Opening gate (no cats) |

---

## 6. Audio

| File | Notes |
| :-- | :-- |
| `audio/la-vie-en-rose.mp3` | Instrumental, mono, 96–128kbps, loop-ready. Mulai saat tamu klik buka undangan. |

---

## 7. Hard Rules (repeat dari README)

- **`correct/` files → fal.ai first, always.** Jangan pakai mentah.
- **`FOTO INVITATION/` → style harmonize only, strength ≤0.35.** Faces must survive.
- **`scenes/hero-main.webp` = satu-satunya style anchor** untuk semua keputusan visual.
- Video semua → `public/assets/video/`. PNG → `public/assets/{cats,couple,florals,story}/`. Gallery → `public/assets/gallery/`.
