# SPEC 11 — Smooth Scroll & Perceived Performance ("Butter")

Doc khusus **butter-smooth**. Semua aturan agar scroll, animasi, dan loading terasa mulus di HP — termasuk potato phone. Wajib dipatuhi bersama `docs/08 §8`.

---

## 1. Smooth scroll (Lenis) — tuning
```ts
new Lenis({
  lerp: 0.09,            // 0.08–0.10; lebih kecil = lebih "berat/halus"
  wheelMultiplier: 1,
  smoothWheel: true,
  syncTouch: true,       // sinkron inertia touch (penting iOS)
  syncTouchLerp: 0.075,
  touchInertiaMultiplier: 28,
});
```
- **Satu RAF** menjalankan `lenis.raf()` + `ScrollTrigger.update()` + parallax + particles. Jangan banyak RAF.
- `scrollTo(target,{duration,easing})` untuk sticky/anchor — durasi 0.8–1.1s `ease.soft`.
- Hormati `prefers-reduced-motion`: matikan smoothing (native scroll) bila REDUCED (beberapa orang mual dengan smooth scroll).

## 2. Frame budget & jank prevention
- **60fps = 16.6ms/frame.** Target < 10ms scripting/frame saat scroll.
- **Animasikan HANYA `transform` & `opacity`.** Dilarang animasi: `width/height/top/left/margin`, `box-shadow`, `filter: blur` (kecuali sekali, statis), `background-position` (kecuali awan pelan low-cost).
- **Promosikan ke layer GPU** hanya saat aktif: set `will-change: transform` di start, **hapus saat selesai** (will-change berlebih = boros memori).
- **Hindari layout thrash:** baca ukuran (getBoundingClientRect) sekali & cache; jangan read-write DOM berselang dalam loop. Pakai nilai dari ScrollTrigger, bukan query manual tiap frame.
- **Passive listeners** untuk touch/scroll (`{passive:true}`).
- **Throttle gyro**: lerp + abaikan delta < epsilon; jangan setState tiap event (pakai ref + RAF).

## 3. Concurrency cap (anti-lag)
- Maks **±18 elemen beranimasi** di viewport sekaligus (`docs/08 §8`).
- **Pause off-screen:** ScrollTrigger `onLeave/onEnterBack` → pause/resume timeline & particles. IntersectionObserver untuk loop idle.
- Particles satu `<canvas>` (bukan puluhan DOM). Count per tier (`docs/12`).
- Pause semua saat `document.hidden` (visibilitychange).

## 4. Perceived performance (terasa cepat)
- **Loading 1–2s** `loading-motif` menutupi preload hero (bukan layar kosong). Bukan spinner kaku.
- **Preload kritis:** hero layers (`hero-bg, couple-cutout, cat-*`) `priority`/`<link rel=preload>`. Font preload heading. Audio `preload="none"` (baru saat tap).
- **Progressive reveal:** section bawah belum dianimasi/diukur sampai dekat (lihat §5). User selalu lihat sesuatu hidup.
- **Skeleton** untuk wishes (shimmer lembut) saat fetch.
- **Optimistic UI** untuk wish submit (tampilkan kartu langsung, rekonsiliasi saat 200).
- **Stagger** entrance membuat berat terasa ringan (otak baca "mengalir").

## 5. Mount & render efficiency
- `content-visibility:auto` + `contain-intrinsic-size` untuk section di bawah fold → hemat render awal.
- Lazy-mount komponen berat (gallery lightbox, map embed) saat section mendekat (IntersectionObserver) — jangan render semua di awal.
- **Map**: tombol/preview dulu; embed iframe load saat section Event terlihat (iframe berat).
- Code-split per fitur bila perlu (dynamic import lightbox).

## 6. Asset & network
- Gambar `next/image`, `sizes` tepat, webp (scenes), PNG trim (cutout), jpg (gallery). Hero < 600KB total.
- Audio mp3 dikompres (mono ~96–128kbps), `preload=none`, mulai saat tap.
- Bundle JS < ~150KB gz (Next+GSAP+Lenis muat); hindari lib besar tambahan.
- Cache statis via Vercel edge; aset immutable (hashed).

## 7. Responsiveness (INP)
- Target **INP < 200ms**: pecah tugas panjang (>50ms) jadi kecil; `requestIdleCallback` untuk kerja non-kritis (mis. init particles, prefetch wishes).
- Jangan blok main thread saat assemble hero — timeline GSAP async, tidak ada perhitungan berat sinkron.

## 8. Device tiers (UX, dari `docs/08 §7`)
| Tier | Scroll | Parallax | Particles | Hero |
| :-- | :-- | :-- | :-- | :-- |
| HIGH | Lenis full | tilt+scroll | 12–14 | assemble penuh |
| MID | Lenis | scroll only | 6 | assemble |
| LOW | native/ringan | minimal | 0 | fade cepat / flat |
| REDUCED | native | off | 0 | fade |
- Deteksi sekali (useTier). **Degradasi anggun**, bukan patah.

## 9. Metrics & gates (rilis)
| Metrik | Target |
| :-- | :-- |
| LCP (3G mid) | < 2.5s |
| CLS | < 0.05 |
| INP | < 200ms |
| FPS scroll (mid) | ~60, tak ada drop < 45 berkepanjangan |
| Lighthouse mobile | perf ≥ 90, a11y ≥ 90 |
| Hero transfer | < 600KB |
- Uji di **HP low-end nyata** + throttle 3G + CPU 4×. Rekam trace bila ada jank.

## 10. Anti-pattern (jangan)
❌ animasi layout/shadow/blur kontinu · ❌ banyak RAF · ❌ render semua section di awal · ❌ iframe map di atas fold · ❌ autoplay audio/video · ❌ will-change permanen di banyak elemen · ❌ setState per event gyro/scroll · ❌ gambar tanpa dimensi (CLS).

## 11. Checklist
- [ ] Lenis tuned + 1 RAF + reduced-motion native
- [ ] transform/opacity only; will-change dilepas
- [ ] pause off-screen + visibilitychange
- [ ] content-visibility + lazy-mount berat
- [ ] preload hero/font; audio preload none
- [ ] skeleton wishes + optimistic submit
- [ ] tier degradation teruji di HP lemah
- [ ] semua metric gate lulus

Lanjut: **SPEC 12 — UX Wireframes & Flow Blueprint**.
