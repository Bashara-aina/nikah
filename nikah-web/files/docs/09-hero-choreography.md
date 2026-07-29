# 09 — Hero Choreography (Signature Moment)

Hero = momen "wow". Dibangun berlapis dari **video loops fal.ai** (yang sudah bernapas sendiri) + **GSAP assemble** saat masuk + **parallax tilt+scroll** saat idle. Ini bukan gambar diam dengan animasi palsu — setiap layer adalah video yang hidup.

> **Aset sumber:** `scenes/hero-main.webp` (komposisi referensi). Layer hidup dibangun dari komponen terpisah yang sudah di-generate via fal.ai Phase 0–1.

---

## 1. Layer Stack (belakang → depan)

| z | Layer | Aset | Depth tier | Motion source |
| :-: | :-- | :-- | :-: | :-- |
| 0 | Langit + awan | `video/hero-bg-loop.mp4` | 0 | **fal.ai video** (meadow breathes, petals drift) |
| 1 | Padang bunga bawah | `video/meadow-bottom-loop.mp4` | 1 | **fal.ai video** (wildflowers sway) |
| 2 | Pasangan | `video/couple-idle.mp4` | 2 | **fal.ai video** (breathes, hair moves) |
| 3a–g | 7 kucing | `video/cat-{name}-idle.mp4` | 3 | **fal.ai video** (ear twitch, tail sway, blink) |
| 3h | Kucing group hero | `video/cats-hero-group-idle.mp4` | 3 | **fal.ai video** |
| 4 | Bunga sudut | `florals/floral-corner-tl/br.png` | 4 | CSS @keyframes sway |
| 5 | Doves | `florals/accent-doves.png` | 5 | GSAP MotionPath |
| 5 | Butterflies | `florals/accent-butterflies.png` | 5 | GSAP bezier flutter |
| 5 | Petals/pollen | Particle canvas | 5 | GSAP RAF |
| top | Teks | "We are getting married" · nama · 22 Agustus 2026 | — | fade reveal terakhir |

> **Fallback flat (REDUCED/LOW):** tampilkan `scenes/hero-main.webp` utuh (poster) + fade sederhana. Video semua di-pause, semua loop off. Tidak pernah blank.

**Implementasi video layer:**
```html
<video class="hero-layer" data-depth="0"
  autoplay loop muted playsinline
  poster="assets/scenes/hero-bg.webp"
  src="assets/video/hero-bg-loop.mp4">
</video>
```
Tiap layer: `position: absolute`, `width: 100%`, `height: 100%`, `object-fit: cover`. GSAP mengontrol `translateY` (parallax) dan `opacity` (entrance/exit). Video mengontrol semua motion internalnya sendiri.

---

## 2. Timeline ASSEMBLE (masuk dari Gate)

Total ≈ `dur.assemble` (1.4–1.8s). GSAP timeline, semua `ease.enter`, overlap & stagger. Video sudah `autoplay` — GSAP hanya mengatur opacity & y untuk reveal.

```
t=0.00  Langit (z0): opacity 0→1, scale 1.06→1.00         (dur 1.0)
t=0.15  Padang (z1): opacity 0→1, y +20→0                 (dur 0.9)  [-=0.85]
t=0.45  Couple (z2): opacity 0→1, y +40→0, scale .96→1    (dur 0.8, ease.settle)
t=0.70  Kucing (z3): stagger.base 0.10s — opacity+y+scale settle
          urutan: yang dipangku dulu → duduk di rumput
t=1.05  Bunga sudut (z4): opacity 0→1, scale 1.08→1 dari tepi
t=1.20  Doves: MotionPath loop start
t=1.25  Butterflies: fade + flutter start
t=1.30  Particles: system aktif
t=1.35  Teks: per-baris, opacity + y +12→0, stagger.base
t≈1.8   → STATE HIDUP (GSAP parallax only). will-change dilepas.
```

Saat assemble selesai — **langsung lebur ke parallax, tidak ada dead frame.**

---

## 3. State Hidup (Idle setelah Assemble)

fal.ai video handles semua ambient. GSAP hanya menambah depth:

| Layer | fal.ai (internal video) | GSAP tambah |
| :-- | :-- | :-- |
| Langit | Awan drift, petals jatuh | translateY parallax factor 0.02 |
| Padang | Wildflowers sway | parallax 0.06 |
| Couple | Breathe, hair move | parallax 0.12 |
| Kucing | Ear twitch, tail sway, blink | parallax 0.20–0.32 (random per cat) + settle-shift 1–2px tiap 8–14s |
| Bunga sudut | — | CSS @keyframes rotate ±1.2° pivot pangkal |
| Doves | — | MotionPath bezier 12–16s, jalur/durasi random tiap putaran |
| Butterflies | — | bezier pendek, wing-flutter scaleX 180ms |
| Petals | — | canvas RAF: jatuh + sway sinus |

> **Jangan tambah GSAP breathing di atas karakter** — fal.ai sudah menangani itu. Duplikasi = gerakan patah.

---

## 4. Tilt + Scroll Parallax

- **Tilt (gyro):** `DeviceOrientationEvent` gamma/beta → lerp smoothing 0.08 → `translateX/Y = factor * parallax.max`. iOS 13+: `requestPermission()` saat tap Gate.
- **Scroll:** ScrollTrigger scrub. Layer jauh lambat, layer dekat cepat — hero "membuka".
- **Hero exit:** grup hero opacity 1→0 di 0–60% scroll section berikut. Teks fade paling dulu, langit paling lama.
- **Fallback:** scroll-only + auto-drift sinus per layer bila gyro ditolak.
- Tilt factor = 0.6 × scroll factor.

---

## 5. Video Pause / Resume (performance)

```javascript
// Pause semua video hero saat tidak di viewport
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const videos = e.target.querySelectorAll('.hero-layer')
    videos.forEach(v => e.isIntersecting ? v.play() : v.pause())
  })
}, { threshold: 0.1 })
heroObserver.observe(document.querySelector('#hero'))
```

`prefers-reduced-motion` → pause semua video saat mount, show poster only.

---

## 6. Hero Fallback Tiers

| Tier | Hero behavior |
| :-- | :-- |
| HIGH | Semua video layers + GSAP assemble + parallax + tilt |
| MID | Semua video layers + GSAP assemble + scroll parallax (no tilt) |
| LOW | Poster static `hero-main.webp` + fade-in cepat. No video. |
| REDUCED | Poster static, no animation whatsoever. |

---

## 7. Checklist Build Hero
- [ ] Phase 0–2 selesai (semua video hero + cat idle di `assets/video/`)
- [ ] `heroLayout` config: posisi % tiap video layer (match `hero-main.webp`)
- [ ] Preload hero-bg-loop.mp4 + couple-idle.mp4 (above-fold critical)
- [ ] GSAP assemble timeline (opacity+y entry per layer)
- [ ] IntersectionObserver pause/resume semua hero videos
- [ ] Tilt hook (gyro+permission+lerp) + scroll parallax
- [ ] Tier gating: HIGH/MID video, LOW/REDUCED poster
- [ ] Doves MotionPath + Butterflies bezier + Particles canvas
- [ ] Teks reveal stagger (terakhir, setelah semua layer muncul)
