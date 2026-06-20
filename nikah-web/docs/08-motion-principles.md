# 08 — Motion Principles ("Hidup, bukan kaku")

Dokumen fondasi gerak. Semua animasi di file 09–12 **wajib** mengikuti token & prinsip di sini. Tujuan tunggal: setiap aset terasa **hidup, lembut, bernapas** — tidak pernah kaku.

Locked: **tilt + scroll parallax**, **semua ambient** (doves/butterflies, petals, cat micro-motion, sway florals/drapery), **hero animated-assemble**, **rich + smart fallback**.

---

## 1. Kenapa sesuatu terasa "kaku" (yang HARUS dihindari)

| Penyebab kaku | Lawannya (yang kita pakai) |
| :-- | :-- |
| Gerak **linear** (`linear`/`ease`) | Selalu **eased / spring** (lihat token) |
| Semua elemen masuk **bersamaan** | **Stagger** + overlap, tidak pernah serempak |
| Diam total saat idle | **Selalu ada micro-motion** (napas/sway) |
| Durasi & delay **identik** tiap elemen | **Randomisasi organik** per elemen |
| Gerak **patah** (snap ke posisi) | **Settle**: overshoot halus lalu reda |
| Satu sumbu saja | **Sekunder/follow-through** (ekor telat dari badan) |
| Amplitudo besar & cepat | **Pelan & kecil** (mood quiet, La Vie en Rose) |

> Aturan emas: **tidak ada yang benar-benar diam, tidak ada yang bergerak serempak, tidak ada yang bergerak lurus.**

---

## 2. Prinsip inti (7)

1. **Everything breathes.** Tiap aset penting punya idle loop super halus (scale 1.000→1.012, atau translateY ±2–4px, 4–8s, `sine.inOut`). Tanpa ini layar terasa mati.
2. **Stagger semuanya.** Saat sekelompok elemen muncul, beri jeda 60–120ms antar elemen. Serempak = kaku.
3. **Overlap in/out.** Elemen berikut mulai sebelum yang sebelumnya selesai (timeline `-=0.3`). Transisi mengalir, bukan antri.
4. **Secondary motion / follow-through.** Bagian "ringan" (ekor kucing, ujung drapery, bunga) telat & lebih besar amplitudonya dari "badan". Memberi kesan massa & hidup.
5. **Organic randomness.** Jangan pernah dua loop identik. Variasikan `duration ±20%`, `delay acak`, `amplitude ±15%`. Pakai seed per-elemen.
6. **Settle, jangan snap.** Entrance berakhir dengan overshoot mikro lalu reda (`back.out(1.3)` halus atau spring lembut). Hindari overshoot besar (norak).
7. **Depth = hidup.** Beda kecepatan (parallax) + sedikit beda scale + blur tipis di layer jauh → ruang 3D yang terasa.

---

## 3. Motion Tokens (pakai nama ini di kode)

### Easing (GSAP)
| Token | Nilai | Untuk |
| :-- | :-- | :-- |
| `ease.enter` | `cubic-bezier(0.22, 1, 0.36, 1)` (≈ expo.out) | Masuk/reveal |
| `ease.soft` | `power2.inOut` | Transisi umum |
| `ease.float` | `sine.inOut` | Semua idle loop |
| `ease.settle` | `back.out(1.3)` | Pop kecil (angka countdown, tombol) — hemat |
| `ease.exit` | `power2.in` | Keluar/hilang |

### Durasi
| Token | ms | Untuk |
| :-- | :-- | :-- |
| `dur.micro` | 150–250 | Hover, tap, blink |
| `dur.base` | 400–600 | Fade/slide standar |
| `dur.enter` | 700–1000 | Reveal section |
| `dur.assemble` | 1200–1800 | Hero assemble (total) |
| `loop.slow` | 4000–8000 | Napas, sway |
| `loop.amb` | 8000–16000 | Doves/petals melintas |

### Jarak / amplitudo (mobile)
| Token | px / unit |
| :-- | :-- |
| `move.reveal` | translateY 24–40px |
| `move.float` | translateY 2–6px |
| `rot.sway` | ±0.5° – ±1.5° |
| `scale.breath` | 1.000 → 1.010–1.018 |
| `parallax.max` | 8–28px (per depth tier, §4) |

### Stagger
`stagger.tight = 0.06s` · `stagger.base = 0.10s` · `stagger.loose = 0.16s`

---

## 4. Depth tiers (parallax + assemble order)

Layer dari jauh→dekat. Faktor parallax = seberapa banyak ia bergerak relatif scroll/tilt.

| Tier | Contoh aset | Parallax factor | Blur | Urut assemble |
| :-- | :-- | :-- | :-- | :-- |
| 0 sky/bg | `hero-bg` langit | 0.02 (hampir diam) | 0 | 1 (paling dulu) |
| 1 meadow | bukit/padang | 0.06 | 0 | 2 |
| 2 subjek | `couple-cutout` | 0.12 | 0 | 3 |
| 3 kucing | `cat-*` | 0.20–0.32 | 0 | 4 (stagger) |
| 4 foreground | `floral-corner-*` | 0.50 | 0–1px | 5 |
| 5 particles | petals, doves, butterflies | 0.70–0.90 | 0–1.5px | 6 (terus jalan) |

Tilt (gyro) memakai faktor yang sama × 0.6 dari nilai scroll, supaya gerak miring lebih halus dari scroll.

---

## 5. Tilt + Scroll parallax (implementasi)

- **Scroll:** ScrollTrigger memetakan progres ke `translateY = factor * scrollDelta`. Lenis menghaluskan (lerp ≈ 0.09).
- **Tilt:** `DeviceOrientationEvent` → ambil `gamma` (kiri-kanan, −20..20°) & `beta` (depan-belakang). Clamp, lalu **lerp** ke target (smoothing 0.08) supaya tidak gemetar. Map ke `translateX/Y = factor * parallax.max`.
- **Izin iOS 13+:** `requestPermission()` harus dipicu **gesture** → minta tepat saat tap **"Buka Undangan"** di gate. Kalau ditolak/または tidak ada sensor → **fallback**: scroll-only + **auto-drift** (tiap layer drift sinus pelan sendiri, lihat §6).
- Semua transform lewat `transform: translate3d()` (GPU). `will-change: transform` hanya saat aktif.

---

## 6. Idle / ambient systems (selalu hidup)

1. **Breathing** — tiap kucing & couple: `scale` & `translateY` loop `loop.slow`, fase acak, `ease.float`.
2. **Sway florals & drapery** — `rotate` ±1° + `skew` mikro, pivot di pangkal, `loop.slow`, fase beda tiap sudut.
3. **Drapery ripple** — divider pakai gradient mask yang bergeser pelan + sedikit `scaleY`.
4. **Doves & butterflies** — MotionPath bezier melintas hero/langit, `loop.amb`, durasi & jalur sedikit beda tiap putaran. Kupu-kupu: wing-flutter = oscillate `scaleX 1↔0.82` + `rotate` kecil, `dur.micro` cepat.
5. **Petals / pollen** — particle system (§ file 12): 8–14 partikel (high tier), jatuh + sway sinus + putar pelan, recycle di atas. Low tier: 0–4 atau mati.
6. **Cat micro-motion** — dengan PNG flat: **breathing + sway** (selalu), **"settle" shift** sesekali (geser 1–2px tiap 6–12s). *Blink/ear-twitch/tail-flick butuh layer mata/telinga/ekor terpisah* → opsional, lihat catatan file 12 (perlu aset tambahan).

Semua loop: **fase awal di-random** agar tidak sinkron (sinkron = kaku).

---

## 7. Accessibility & "smart fallback" (rich + graceful)

Deteksi sekali saat load → set **tier**:
- `prefers-reduced-motion: reduce` → **REDUCED**: matikan parallax/tilt/particles/loop posisi; sisakan **opacity fade** lembut saja. Tidak ada gerak vestibular.
- `navigator.connection.saveData` true ATAU `effectiveType` 2g/3g → **LOW**.
- `deviceMemory < 4` ATAU `hardwareConcurrency <= 4` → **LOW/MID**.
- else → **HIGH**.

| Fitur | HIGH | MID | LOW | REDUCED |
| :-- | :-: | :-: | :-: | :-: |
| Hero assemble | full | full | fade-in cepat | fade |
| Tilt parallax | on | on | off (scroll only) | off |
| Scroll parallax | full | dikurangi | minimal | off |
| Breathing loops | semua | subjek utama | hero saja | off |
| Doves/butterflies | on | on (sedikit) | off | off |
| Petals | 12–14 | 6 | 0 | 0 |
| Blur layer jauh | on | off | off | off |

Implementasi: satu `MotionProvider` (file 11) menyimpan tier → tiap komponen baca tier untuk memutuskan.

---

## 8. Performance guardrails (potato phone)
- Animasikan **hanya `transform` & `opacity`**. Jangan width/height/top/left/box-shadow.
- `transform: translate3d/scale3d` (GPU). `will-change` dipasang saat mulai, dilepas saat selesai.
- Pause semua loop yang **off-screen** (ScrollTrigger `onLeave`/IntersectionObserver).
- Particle: satu `<canvas>` atau `requestAnimationFrame` tunggal, bukan puluhan elemen DOM beranimasi.
- Target: 60fps di mid-tier; first hero paint < 2.5s di 3G; total transfer hero < 600KB.
- Cap: maksimum ±18 elemen beranimasi simultan di viewport.

---

### Cross-ref
- Hero detail → `09-hero-choreography.md`
- Tiap section → `10-section-choreography.md`
- Arsitektur kode (MotionProvider, hooks) → `11-build-architecture.md`
- Peta aset→gerak + config particle → `12-asset-motion-map.md`
