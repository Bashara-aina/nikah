# 09 — Hero Choreography (Signature moment)

Hero = momen "wow". Dibangun **berlapis** dari aset transparan (bukan satu gambar datar) supaya bisa **assemble** lalu **hidup** (parallax tilt+scroll + ambient). Pakai token dari `08-motion-principles.md`.

Aset hero utama: komposisi referensi = `scenes/hero-main.webp`. Tapi untuk versi **hidup berlapis**, kita susun ulang dari komponen:

---

## 1. Layer stack (belakang → depan)

| z | Layer | Aset | Depth tier | Catatan |
| :-: | :-- | :-- | :-: | :-- |
| 0 | Langit + awan | `scenes/hero-bg.webp` (langit) | 0 | bisa zoom super pelan |
| 1 | Padang bunga | bagian bawah `hero-bg` | 1 | |
| 2 | Pasangan | `couple/couple-cutout.png` | 2 | jangkar emosional |
| 3a–h | 8 kucing | `cats/cat-*.png` | 3 | masing-masing elemen sendiri, stagger |
| 4 | Bunga sudut | `florals/floral-corner-tl/br.png` | 4 | framing depan |
| 5 | Doves | `florals/accent-doves.png` | 5 | melintas langit |
| 5 | Butterflies | `florals/accent-butterflies.png` | 5 | flutter dekat bunga |
| 5 | Petals/pollen | particle system | 5 | turun lembut |
| top | Teks | "We are getting married" · nama · 22 Agustus 2026 | — | overlay, reveal terakhir |

> **Fallback flat:** kalau tier REDUCED/LOW gagal load layer, tampilkan `scenes/hero-main.webp` utuh sebagai 1 gambar + fade. Tidak pernah blank.

**Catatan komposisi:** susun posisi tiap kucing/couple agar **match** dengan `hero-main.webp` (jadi assemble berakhir mirip referensi). Simpan koordinat (% relatif container) di config `heroLayout` (file 11).

---

## 2. Timeline ASSEMBLE (saat masuk dari gate)

Total ≈ `dur.assemble` (1.4–1.8s). GSAP timeline, semua `ease.enter`, overlap & stagger.

```
t=0.00  Langit (z0): opacity 0→1, scale 1.06→1.00         (dur 1.0)
t=0.15  Padang (z1): opacity 0→1, y +20→0                 (dur 0.9)  [-=0.85 overlap]
t=0.45  Couple (z2): opacity 0→1, y +40→0, scale .96→1    (dur 0.8, ease.settle)
t=0.70  Kucing (z3): stagger.base 0.10, masing-masing
          opacity 0→1, y +30→0, scale .9→1, ease.settle
          urutan: yang dipangku dulu → yang duduk di rumput
t=1.05  Bunga sudut (z4): opacity 0→1, scale 1.08→1, dari tepi
t=1.20  Doves mulai terbang masuk dari kiri-atas (loop start)
t=1.25  Butterflies fade + mulai flutter
t=1.30  Petals system aktif
t=1.35  Teks: baris demi baris, opacity 0→1 + y +12→0, stagger.base
t≈1.8   → serahkan ke STATE HIDUP (§3). will-change dilepas.
```

Saat assemble selesai, **jangan berhenti** — langsung lebur ke idle/parallax (no dead frame).

---

## 3. STATE HIDUP (idle setelah assemble)

Berjalan terus selama hero di viewport:

- **Breathing couple:** y ±3px + scale 1→1.012, `loop.slow` 6s, `ease.float`.
- **Breathing kucing:** tiap kucing y ±2–4px + scale 1→1.01, durasi 4–7s **acak**, fase **acak** (tidak sinkron). Sesekali "settle shift" 1–2px tiap 6–12s.
- **Sway bunga sudut:** rotate ±1.2° pivot pangkal, 7s, dua sudut beda fase.
- **Langit:** drift horizontal awan super pelan (background-position atau translateX 0→-2%, 30s, yoyo).
- **Doves:** MotionPath melintas langit kiri→kanan, 12–16s, tiap putaran jalur & durasi sedikit beda; 1 ekor, sesekali 2.
- **Butterflies:** 2–3 ekor, jalur bezier pendek dekat bunga, wing-flutter cepat (`scaleX 1↔0.82`, 180ms) + drift.
- **Petals:** 8–14 (HIGH), turun + sway sinus + spin pelan, recycle.

---

## 4. Tilt + Scroll parallax di hero

- **Tilt (gyro):** target offset per layer = `gamma_norm * parallax.max * factor` (X) & `beta_norm * parallax.max * factor * 0.6` (Y). Smoothing lerp 0.08. Izin diminta saat tap "Buka Undangan".
- **Scroll:** saat user mulai scroll keluar hero, layer jauh bergerak lambat, layer dekat cepat (ScrollTrigger scrub). Couple & kucing naik sedikit lebih cepat dari langit → hero "membuka".
- **Hero exit (scroll down):** seluruh grup hero: opacity 1→0.0 di 0–60% scroll section berikut, langit tetap paling lama (depth). Teks fade lebih dulu.
- Tilt factor = 0.6 × scroll factor (lihat depth tier file 08 §4).

---

## 5. Cat micro-motion — jujur soal batas aset

Dengan PNG **flat** (tanpa layer terpisah), yang realistis SEKARANG:
- ✅ Breathing, sway, settle-shift, parallax depth, staggered entrance, "lirik" (rotate kepala mikro ±0.8° — terbatas karena 1 layer).

Yang **butuh aset tambahan** (opsional, fase 2):
- 👁️ **Blink** → perlu varian PNG mata-tertutup per kucing (atau layer mata) untuk swap 2-frame. 
- 👂 **Ear-twitch / tail-flick** → perlu telinga/ekor sebagai layer terpisah.
- Alternatif tanpa aset baru: **squash blink** palsu (scaleY 1→0.9→1 super cepat pada area atas) — efek halus, tidak sebagus 2-frame.

> Keputusan: mulai dengan breathing+sway+settle (sudah terasa hidup). Kalau mau mata berkedip, generate varian "eyes-closed" tiap kucing via prompt di `07` (tambah satu baris: "same cat, eyes gently closed"). Catat di backlog.

---

## 6. Hero card vs tall
- Default tampil: **animated assemble** berlapis (di atas) pada area 4:5 yang "mengapung" di tengah, dengan `hero-bg` langit meluber ke atas/bawah mengisi layar tinggi → terasa full tapi komposisi tetap seperti referensi.
- `scenes/hero-tall.webp` dipakai sebagai **poster/fallback** untuk tier LOW/REDUCED (1 gambar, fade).
- `scenes/hero-card.webp`/`hero-main.webp` = sumber komposisi & fallback HIGH.

---

## 7. Checklist build hero
- [ ] `heroLayout` config (posisi % tiap layer match referensi)
- [ ] Preload `hero-bg`, `couple-cutout`, semua `cat-*` (priority)
- [ ] Timeline assemble (GSAP) → handoff ke idle
- [ ] Idle loops (breathing/sway/doves/butterflies/petals) dgn fase acak
- [ ] Tilt hook (gyro+permission+lerp) + scroll parallax (ScrollTrigger scrub)
- [ ] Tier gating (HIGH/MID/LOW/REDUCED) per fitur
- [ ] Fallback flat `hero-main`/`hero-tall`
- [ ] Pause loops saat hero keluar viewport
