# TODO — Asset Generation Master Checklist

> **Pipeline lengkap ada di `13-fal-generation-plan.md`.** File ini adalah checklist status ringkas per aset.
> Update status setiap kali satu aset selesai di-generate.

---

## Phase 0 — Background Removal (fal-ai/bria/rmbg)

| File | Source | Status |
| :-- | :-- | :-- |
| `assets/cats/cat-jiro-transparent.png` | `correct/most correct/cat-jiro-in-flowers.png` | ⬜ pending |
| `assets/cats/cat-meng-transparent.png` | `correct/most correct/cat-meng-with-flowers.png` | ⬜ pending |
| `assets/cats/cat-moju-transparent.png` | `correct/most correct/cat-moju-sleeping-flowers.png` | ⬜ pending |
| `assets/cats/cat-shiro-transparent.png` | `correct/most correct/cat-shiro-butterfly.png` | ⬜ pending |
| `assets/cats/cat-simba-transparent.png` | `correct/most correct/cat-simba-with-dove.png` | ⬜ pending |
| `assets/cats/cat-hoshi-transparent.png` | `correct/most correct/cat-hoshi-kimho-playing.png` | ⬜ pending |
| `assets/cats/cats-hero-group-transparent.png` | `correct/most correct/cats-white-tuxedo-arch-frame.png` | ⬜ pending |
| `assets/couple/couple-cutout.png` | `correct/most correct/couple-scooter-vespa-wedding.png` | ⬜ pending |

---

## Phase 1 — Hero Scene Video Loops (fal-ai/minimax/video-01-live)

| File | Source | Status |
| :-- | :-- | :-- |
| `assets/video/hero-bg-loop.mp4` | `scenes/hero-main.webp` | ⬜ pending |
| `assets/video/hero-tall-loop.mp4` | `scenes/` 9:16 | ⬜ pending |
| `assets/video/meadow-bottom-loop.mp4` | `correct/most correct/wildflower-meadow-full.png` | ⬜ pending |

---

## Phase 2 — Cat Idle Video Loops (fal-ai/wan-2.6)

| File | Source (after rmbg) | Status |
| :-- | :-- | :-- |
| `assets/video/cat-jiro-idle.mp4` | `cat-jiro-transparent.png` | ⬜ pending |
| `assets/video/cat-meng-idle.mp4` | `cat-meng-transparent.png` | ⬜ pending |
| `assets/video/cat-moju-idle.mp4` | `cat-moju-transparent.png` | ⬜ pending |
| `assets/video/cat-shiro-idle.mp4` | `cat-shiro-transparent.png` | ⬜ pending |
| `assets/video/cat-simba-idle.mp4` | `cat-simba-transparent.png` | ⬜ pending |
| `assets/video/cat-hoshi-idle.mp4` | `cat-hoshi-transparent.png` | ⬜ pending |
| `assets/video/couple-idle.mp4` | `couple-cutout.png` | ⬜ pending |
| `assets/video/cats-hero-group-idle.mp4` | `cats-hero-group-transparent.png` | ⬜ pending |

---

## Phase 3 — Floral Video Loops (fal-ai/minimax/video-01-live)

| File | Source | Status |
| :-- | :-- | :-- |
| `assets/video/floral-garland-loop.mp4` | `correct/most correct/floral-garland-full-swag.png` | ⬜ pending |
| `assets/video/floral-swag-loop.mp4` | `correct/most correct/floral-swag-full.png` | ⬜ pending |

---

## Phase 4 — Gallery Photo Style-Harmonize (fal-ai/flux/dev/image-to-image)

| File | Source | Status |
| :-- | :-- | :-- |
| `assets/gallery/gallery-01.webp` | `FOTO INVITATION/` foto 1 | ⬜ pending |
| `assets/gallery/gallery-02.webp` | `FOTO INVITATION/` foto 2 | ⬜ pending |
| `assets/gallery/gallery-03.webp` | `FOTO INVITATION/` foto 3 | ⬜ pending |
| `assets/gallery/gallery-04.webp` | `FOTO INVITATION/` foto 4 | ⬜ pending |
| `assets/gallery/gallery-05.webp` | `FOTO INVITATION/` foto 5 | ⬜ pending |

> Gunakan semua foto dari `FOTO INVITATION/` yang tersedia. Strength: 0.25–0.35. Jaga wajah.

---

## Phase 5 — CSS-Only Florals (rmbg only, no video)

| File | Source | Status |
| :-- | :-- | :-- |
| `assets/florals/floral-corner-tl.png` | `correct/most correct/vertical-floral-spray.png` | ⬜ pending |
| `assets/florals/floral-corner-br.png` | `correct/most correct/vertical-rose-spray.png` | ⬜ pending |
| `assets/florals/floral-sprig.png` | `correct/most correct/vertical-garden-spray.png` | ⬜ pending |
| `assets/florals/drapery-divider.png` | `correct/most correct/flowing-floral-divider-wavy.png` | ⬜ pending |
| `assets/florals/arch-frame.png` | `correct/most correct/cats-white-tuxedo-arch-frame.png` | ⬜ rmbg pending |
| `assets/florals/accent-doves.png` | `correct/most correct/doves-with-flowing-flowers.png` | ⬜ rmbg pending |
| `assets/florals/petals-anim.png` | `correct/most correct/falling-petals-scattered.png` | ⬜ rmbg pending |

---

## Phase 6 — Story Illustrations (Gemini 2.5 Flash Image)

| File | Prompt source | Status |
| :-- | :-- | :-- |
| `assets/illustrations/story-motor.png` | `07 §5 — story-motor` | ⬜ pending |
| `assets/illustrations/story-jakarta.png` | `07 §5 — story-jakarta` | ⬜ pending |
| `assets/illustrations/story-ldr.png` | `07 §5 — story-ldr` | ⬜ pending |
| `assets/illustrations/story-keio.png` | `07 §5 — story-keio` | ⬜ pending |
| `assets/illustrations/story-married.png` | `07 §5 — story-married` | ⬜ pending |

---

## Cara Update Status
Ganti `⬜ pending` → `✅ done` saat aset selesai dan sudah di-commit ke repo.
Ganti `⬜ pending` → `🔄 in progress` saat sedang di-generate.

## Setelah semua Phase 0–6 selesai
```bash
npm run copy-assets    # mirror assets/ -> public/assets/
npm run dev            # verifikasi semua aset tampil
```
