# 08 — Motion Principles ("Hidup, bukan kaku")

Dokumen fondasi gerak. Semua animasi di file 09–12 **wajib** mengikuti token & prinsip di sini.

> **Arsitektur gerak baru:** fal.ai menangani **ambient/idle motion** (living video loops). GSAP menangani **orchestration, entrance, parallax, scroll, tilt, interaksi**. Keduanya wajib berjalan bersama.

---

## 0. Arsitektur Dua Lapisan (fal.ai + GSAP)

```
┌─────────────────────────────────────────────┐
│  LAYER 5 (atas): GSAP particles, doves      │  ← GSAP MotionPath
│  LAYER 4: Floral corners (CSS @keyframes)   │  ← CSS animation
│  LAYER 3: Cat sprites (idle video + GSAP)   │  ← fal.ai video + GSAP entrance
│  LAYER 2: Couple cutout (idle video + GSAP) │  ← fal.ai video + GSAP entrance
│  LAYER 1: Meadow (CSS sway on static)       │  ← fal.ai video loop
│  LAYER 0: Hero bg (living video loop)       │  ← fal.ai video loop
└─────────────────────────────────────────────┘
```

**Aturan pembagian kerja:**
- **fal.ai owns:** napas/breathing, sway organik, telinga/ekor micro-motion, petals jatuh dalam scene.
- **GSAP owns:** scroll parallax, tilt parallax, entrance stagger, interaksi tap/hover, timing orchestration.
- **CSS owns:** small decorative elements (floral corners, dividers) — rotate sway ringan.
- **Jangan duplikasi:** Jika fal.ai sudah animasikan breathing di video, GSAP tidak perlu tambah breathing lagi. GSAP hanya tambah depth (translateY parallax).

---

## 1. Kenapa sesuatu terasa "kaku" (yang HARUS dihindari)

| Penyebab kaku | Lawannya |
| :-- | :-- |
| Gerak **linear** | Selalu **eased / spring** |
| Semua elemen masuk **bersamaan** | **Stagger** + overlap |
| Diam total saat idle | **fal.ai video loop** (selalu hidup) |
| Durasi & delay **identik** | **Randomisasi organik** per elemen |
| Gerak **patah** (snap) | **Settle**: overshoot halus lalu reda |
| Satu sumbu saja | **Secondary/follow-through** |
| Amplitudo besar & cepat | **Pelan & kecil** (mood La Vie en Rose) |

> Aturan emas: **tidak ada yang benar-benar diam, tidak ada yang bergerak serempak, tidak ada yang bergerak lurus.**

---

## 2. Prinsip Inti (7)

1. **Everything breathes — via fal.ai.** Tiap aset karakter & scene punya idle video loop dari fal.ai. Tanpa ini layar terasa mati.
2. **Stagger semuanya.** Entrance: jeda 60–120ms antar elemen. Serempak = kaku.
3. **Overlap in/out.** Timeline `-=0.3`. Transisi mengalir, bukan antri.
4. **Secondary motion / follow-through.** Bagian ringan (ekor, ujung drapery, bunga) telat & lebih besar amplitudonya. fal.ai menangani ini di dalam video loop.
5. **Organic randomness.** Variasikan `duration ±20%`, `delay acak`, `amplitude ±15%`.
6. **Settle, jangan snap.** Entrance: overshoot mikro lalu reda (`back.out(1.3)`).
7. **Depth = hidup.** Parallax beda kecepatan + sedikit beda scale + blur tipis di layer jauh.

---

## 3. Motion Tokens (GSAP)

### Easing
| Token | Nilai | Untuk |
| :-- | :-- | :-- |
| `ease.enter` | `cubic-bezier(0.22, 1, 0.36, 1)` | Masuk/reveal |
| `ease.soft` | `power2.inOut` | Transisi umum |
| `ease.float` | `sine.inOut` | GSAP idle loop (backup/LOW) |
| `ease.settle` | `back.out(1.3)` | Pop kecil |
| `ease.exit` | `power2.in` | Keluar/hilang |

### Durasi
| Token | ms | Untuk |
| :-- | :-- | :-- |
| `dur.micro` | 150–250 | Hover, tap |
| `dur.base` | 400–600 | Fade/slide standar |
| `dur.enter` | 700–1000 | Reveal section |
| `dur.assemble` | 1200–1800 | Hero assemble total |
| `loop.slow` | 4000–8000 | GSAP fallback idle |
| `loop.amb` | 8000–16000 | Doves/petals |

### Jarak / Amplitudo (mobile)
| Token | px / unit |
| :-- | :-- |
| `move.reveal` | translateY 24–40px |
| `move.float` | translateY 2–6px |
| `rot.sway` | ±0.5° – ±1.5° |
| `scale.breath` | 1.000 → 1.010–1.018 (GSAP fallback only) |
| `parallax.max` | 8–28px (per depth tier §4) |

### Stagger
`stagger.tight = 0.06s` · `stagger.base = 0.10s` · `stagger.loose = 0.16s`

---

## 4. Depth Tiers (parallax + assemble order)

| Tier | Contoh aset | Parallax factor | Blur | Urut assemble | Motion source |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 0 sky/bg | `hero-bg-loop.mp4` | 0.02 | 0 | 1 (paling dulu) | **fal.ai video** |
| 1 meadow | `meadow-bottom-loop.mp4` | 0.06 | 0 | 2 | **fal.ai video** |
| 2 subjek | `couple-idle.mp4` | 0.12 | 0 | 3 | **fal.ai video** + GSAP entrance |
| 3 kucing | `cat-*-idle.mp4` | 0.20–0.32 | 0 | 4 stagger | **fal.ai video** + GSAP entrance |
| 4 foreground | `floral-corner-*.png` | 0.50 | 0–1px | 5 | **CSS @keyframes** |
| 5 particles | petals, doves | 0.70–0.90 | 0–1.5px | 6 terus | **GSAP** MotionPath |

---

## 5. Tilt + Scroll Parallax (implementasi)

- **Scroll:** ScrollTrigger → `translateY = factor * scrollDelta`. Lenis smooth (lerp ≈ 0.09).
- **Tilt:** `DeviceOrientationEvent` gamma/beta → lerp (smoothing 0.08) → `translateX/Y = factor * parallax.max`.
- **iOS 13+:** `requestPermission()` dipicu saat tap "Buka Undangan".
- **Fallback:** scroll-only + auto-drift sinus per layer.
- Semua via `transform: translate3d()` (GPU). `will-change` hanya saat aktif.

---

## 6. fal.ai Video Loop — Implementasi HTML

```html
<!-- Setiap video loop dipasang sebagai layer background -->
<video
  class="layer-video"
  autoplay
  loop
  muted
  playsinline
  poster="assets/scenes/hero-bg.webp"
  data-src="assets/video/hero-bg-loop.mp4"
>
  <source src="assets/video/hero-bg-loop.mp4" type="video/mp4">
</video>
```

```javascript
// Pause video saat off-screen (hemat CPU)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => e.isIntersecting
    ? e.target.play()
    : e.target.pause()
  )
}, { threshold: 0.1 })
document.querySelectorAll('.layer-video').forEach(v => observer.observe(v))
```

**prefers-reduced-motion fallback:**
```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.layer-video').forEach(v => {
    v.pause()
    v.style.display = 'none'
    // Show static poster PNG instead
  })
}
```

---

## 7. Idle & Ambient Systems

1. **Character breathing** — fal.ai video loop (primary). GSAP `scale+translateY` loop sebagai fallback LOW tier.
2. **Sway florals & drapery** — CSS `@keyframes` rotate pivot pangkal. Ringan, zero JS.
3. **Drapery ripple** — gradient mask bergeser + sedikit `scaleY`.
4. **Doves & butterflies** — GSAP MotionPath bezier. Durasi & jalur beda tiap putaran.
5. **Petals / pollen** — particle canvas, 8–14 HIGH tier, recycle dari atas.
6. **Cat micro-motion** — fal.ai video handles ear-twitch, tail-sway. GSAP hanya tambah depth parallax.

---

## 8. Accessibility & Smart Fallback

| Fitur | HIGH | MID | LOW | REDUCED |
| :-- | :-: | :-: | :-: | :-: |
| Hero video loop | on | on | poster static | poster static |
| Cat idle video | on | on | poster PNG | poster PNG |
| Tilt parallax | on | on | off | off |
| Scroll parallax | full | dikurangi | minimal | off |
| GSAP fallback breathing | off | on | on | off |
| Doves/butterflies | on | on (sedikit) | off | off |
| Petals | 12–14 | 6 | 0 | 0 |
| CSS floral sway | on | on | on | off |

Satu `MotionProvider` menyimpan tier → semua komponen baca tier.

---

## 9. Performance Guardrails
- **Hanya `transform` & `opacity`** untuk GSAP. Jangan width/height/top/left.
- Video: MP4 H.264, kompres ke < 2MB per file, max resolution 1080px.
- Pause semua video & loop yang off-screen (IntersectionObserver).
- Particle: satu `<canvas>`, satu RAF, bukan DOM elemen.
- Max ±18 elemen beranimasi simultan di viewport.
- Target 60fps mid-tier; hero paint < 2.5s di 3G; total transfer hero < 800KB.

---

### Cross-ref
- Hero detail → `09-hero-choreography.md`
- Per section → `10-section-choreography.md`
- Arsitektur kode → `11-build-architecture.md`
- Peta aset→gerak → `12-asset-motion-map.md`
- Pipeline fal.ai → `13-fal-generation-plan.md`
