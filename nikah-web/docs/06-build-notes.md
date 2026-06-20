# 06 — Build Notes

> **Sebelum nulis kode apapun: baca `nikah-web/README.md` dulu.** Itu adalah top-of-mind anchor untuk semua keputusan.

---

## Stack

| Layer | Tool |
| :-- | :-- |
| Framework | Next.js 14 App Router (static export) |
| Styling | Tailwind CSS + CSS custom props (motion tokens) |
| Animation | GSAP 3 + ScrollTrigger |
| Video (living characters) | fal.ai → `.mp4` loops → native `<video>` |
| Image gen (story illustrations) | Gemini 2.5 Flash Image |
| Data | Google Sheets + Apps Script Web App |
| Deploy | Vercel (static) |
| Asset generation | `scripts/generate-assets.mjs` (Node, `@fal-ai/client`) |

---

## The 5 Ideas (non-negotiable)

1. **Storybook World** — setiap section adalah chapter, dunia visual konsisten
2. **Living Characters via fal.ai** — kucing dan pasangan adalah video loop nyata
3. **GSAP Cinematic Orchestration** — fal.ai bikin hidup, GSAP yang jadi sutradara
4. **Real Photos as Emotional Core** — `FOTO INVITATION/` adalah jiwa situs, faces preserved
5. **Smart Graceful Degradation** — HIGH/MID/LOW/REDUCED, indah di semua device

---

## Folder Source vs Build Output

```
[SOURCE — jangan disentuh langsung oleh Cursor]
nikah-web/FOTO INVITATION/   → real photos, fal.ai flux/img2img saja
nikah-web/correct/           → AI reference, fal.ai rmbg + video dulu
nikah-web/scenes/            → hero composition reference

[OUTPUT — hasil generate, masuk ke public/]
public/assets/video/         → semua .mp4 fal.ai output
public/assets/cats/          → PNG transparan (poster fallback)
public/assets/couple/        → PNG transparan (poster fallback)
public/assets/florals/       → PNG transparan (CSS-animated)
public/assets/story/         → PNG Gemini (GSAP scroll trigger)
public/assets/gallery/       → WebP style-harmonized gallery
public/assets/scenes/        → hero-main, hero-bg, hero-tall
public/assets/audio/         → la-vie-en-rose.mp3
```

---

## Build Phases (urutan wajib)

### Phase 0 — Background Removal (fal.ai `bria/rmbg`)
Input: `correct/` cat PNGs + couple PNG
Output: `public/assets/{cats,couple}/` transparent PNGs
```bash
node scripts/generate-assets.mjs --phase=0
```

### Phase 1 — Hero Scene Video (fal.ai `minimax/video-01-live`)
Input: `scenes/hero-main.webp`
Output: `public/assets/video/hero-bg-loop.mp4`
```bash
node scripts/generate-assets.mjs --phase=1
```

### Phase 2 — Cat + Couple Idle Videos (fal.ai `wan-2.6`)
Input: transparent PNGs from Phase 0
Output: `public/assets/video/cat-*-idle.mp4`, `couple-idle.mp4`
```bash
node scripts/generate-assets.mjs --phase=2
```

### Phase 3 — Floral Videos + Closing (fal.ai `minimax/video-01-live`)
Input: `correct/` floral assets
Output: `public/assets/video/floral-*.mp4`, `closing-loop.mp4`
```bash
node scripts/generate-assets.mjs --phase=3
```

### Phase 4 — Gallery Style Harmonize (fal.ai `flux/dev/image-to-image`)
Input: `FOTO INVITATION/` photos
Output: `public/assets/gallery/gallery-*.webp`
Strength: 0.25–0.35 ONLY.
```bash
node scripts/generate-assets.mjs --phase=4
```

### Phase 5 — Story Illustrations (Gemini manual)
See `docs/07-gemini-asset-prompts.md`. Manual generation, then copy to `public/assets/story/`.

### Phase 6 — Verify
```bash
npm run copy-assets   # mirror assets/ → public/assets/
npm run dev           # check nothing is 404
```

### Phase 7 — Cursor Builds
Follow `docs/11-build-architecture.md`.
Order: `VideoLayer` primitive → `Hero` → `Gate` → sections in order.

---

## Motion Split (fal.ai vs GSAP)

| Layer | Who animates it |
| :-- | :-- |
| Cat idle: ear twitch, blink, tail | **fal.ai** (baked into video) |
| Couple idle: breathing, gentle sway | **fal.ai** (baked into video) |
| Meadow: petal drift, light shift | **fal.ai** (baked into video) |
| Hero assemble: layers enter one by one | **GSAP** |
| Scroll parallax: depth layers | **GSAP** ScrollTrigger |
| Section entrances: fade + float | **GSAP** ScrollTrigger |
| All interactions: RSVP morph, map pin, submit | **GSAP** |
| Story illustrations: scroll-driven | **GSAP** ScrollTrigger |

**Rule: jangan tambah GSAP breathing di atas fal.ai video characters.** Mereka sudah bernapas.

---

## Performance Budget

| Metric | Target |
| :-- | :-- |
| LCP | < 2.5s (LOW tier: static PNG only) |
| Video file size | ≤ 3MB per loop |
| Gallery images | WebP, max 200KB per image |
| Total initial JS | < 150KB gzipped |
| Audio | mono MP3, 96–128kbps |

## Device Tiers

| Tier | Condition | Behavior |
| :-- | :-- | :-- |
| HIGH | GPU + fast connection | Full video + parallax + tilt |
| MID | Medium device | Video + parallax, no tilt |
| LOW | Low-end / slow connection | Poster PNGs only, no video |
| REDUCED | prefers-reduced-motion | Static only, zero loop |

---

## Definition of Done

- [ ] All fal.ai video assets generated and in `public/assets/video/`
- [ ] Gallery photos style-harmonized, faces match originals
- [ ] Hero composition matches `scenes/hero-main.webp`
- [ ] All 5 sections functional with correct copy from `docs/03-copywriting.md`
- [ ] RSVP submits to Google Sheets
- [ ] Wishes wall reads from Google Sheets (paginated)
- [ ] All 4 tiers tested on real devices
- [ ] `prefers-reduced-motion` shows zero motion
- [ ] Video pauses off-screen (IntersectionObserver)
- [ ] No console errors in production build
