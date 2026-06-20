# SPEC 13 — UX Quality, Accessibility & Acceptance

Gerbang mutu: heuristik UX, aksesibilitas (WCAG AA), motion-safety, dan **acceptance criteria / definition-of-done** per section. Lulus doc ini = "ikuti semua rencana & butter".

---

## 1. Usability heuristics (cek menyeluruh)
- **Visibilitas status:** loading, submitting, sukses, error selalu terlihat (`docs/05`).
- **Kendali user:** scroll tidak dibajak; audio bisa dimatikan; overlay bisa ditutup (tap luar/✕).
- **Konsistensi:** komponen & gerak dari token (`SPEC 09`, `docs/08`); tidak ada pola acak.
- **Pencegahan error:** clamp jumlah 1–4; validasi ramah; disable submit sampai valid.
- **Recognition > recall:** label persisten, ikon + teks, tak mengandalkan ingatan.
- **Fleksibel:** sticky RSVP & shortcut lokasi untuk yang buru-buru.
- **Estetika minimalis:** airy, 1 fokus/layar.
- **Recovery error:** pesan jelas Bahasa Indonesia + cara perbaiki + retry/draft.

## 2. Accessibility (WCAG 2.1 AA target)
- **Kontras:** teks ≥ 4.5:1 (besar ≥ 3:1) di atas ivory/cream. Uji pasangan: `--ink` di ivory ✓; jangan `--ink-soft` untuk teks kecil penting. Teks di atas gambar → panel cream semi-opaque.
- **Target sentuh ≥ 44×44px**, jarak antar target ≥ 8px.
- **Keyboard:** semua interaktif fokusable, urutan logis, fokus ring `--sage` terlihat; tak ada trap; lightbox/sheet kembalikan fokus.
- **Screen reader:** heading hierarki benar; `<button>`/`<a>` semantik; label form terkait (`<label for>`); `aria-live="polite"` untuk toast/status submit; aset dekoratif `aria-hidden`/`alt=""`; gallery & hero `alt` deskriptif Bahasa Indonesia.
- **Bahasa:** `<html lang="id">`; angka/tanggal format ID.
- **Zoom:** layout tahan zoom 200% tanpa pecah; tidak `user-scalable=no`.
- **Form errors:** terkait input via `aria-describedby`; tidak hanya warna (ada ikon+teks).

## 3. Motion safety
- `prefers-reduced-motion: reduce` → matikan parallax/tilt/particles/scroll-smoothing/posisi; sisakan fade lembut (`docs/08 §7`).
- Tidak ada kilatan/flash > 3×/detik. Gerak ambient low-amplitude (anti motion-sickness).
- Tilt gyro tidak pernah menghalangi keterbacaan; bisa "diam" bila REDUCED.

## 4. Content & copy quality
- Nada hangat, sederhana, Bahasa Indonesia (`docs/03`). Tak ada jargon.
- Gift: apresiatif, tidak memaksa.
- Etiquette akurat (akad 10.00, no anak di Lt.2, ruang salat Lt.1, no flash, tidak berdiri saat akad).
- Tidak ada Lorem ipsum/placeholder saat rilis; TODO config terisi (`SPEC 04 §5`).

## 5. Acceptance criteria (Definition of Done) per section
Setiap section dianggap selesai bila **semua** terpenuhi:

**Umum (semua section)**
- [ ] Sesuai wireframe & hierarki (`SPEC 12`)
- [ ] Entrance reveal + ≥1 idle motion + exit halus (`docs/10`)
- [ ] Konten dari config/copy (tak hardcode)
- [ ] Reduced-motion & tier LOW: anggun, tetap terbaca
- [ ] a11y: kontras, fokus, label, alt
- [ ] Tidak ada CLS; 60fps saat masuk/keluar

**Per section (tambahan)**
| Section | DoD spesifik |
| :-- | :-- |
| Loading | ≤2s, transisi mulus ke gate, tak nge-blank |
| Gate | nama tamu benar (`?to=`/generik); tap → gyro+audio+reveal; reload skip-gate |
| Hero | assemble→idle tanpa dead-frame; tilt+scroll jalan; fallback flat di LOW |
| Welcome | Yasin 36 tampil benar; mudah dibaca |
| Countdown | hitung akurat ke 22 Agt 2026; angka roll, tak snap |
| Story | baris kronologis; ilustrasi reveal selang-seling |
| Japan | motif + Keio/SIT; sakura ambient |
| Event | tanggal/jam/venue akurat; peta benar; etiquette lengkap; calendar .ics valid; livestream link benar |
| RSVP | validasi+clamp 1–4; tulis ke Sheet; sukses/err/offline; deadline D-7 tampil |
| Wishes | kirim+tampil (sanitasi); empty/loading; prepend |
| Gift | bank ID & JP setara + alamat; salin jalan; FAQ accordion |
| Closing | pesan penutup; cat-peek; doves keluar; audio loop |

## 6. Device & condition matrix (uji sebelum rilis)
| Dimensi | Cakupan |
| :-- | :-- |
| OS/browser | iOS Safari 15+, Chrome Android, Chrome/Safari desktop |
| Device | flagship, mid, **1 HP low-end nyata (tier LOW)** |
| Jaringan | WiFi, throttle **3G** |
| Setting | reduced-motion ON/OFF, font besar, zoom 200% |
| Orientasi | portrait (utama); landscape tak rusak |
| Input | touch, keyboard (desktop) |
| Konteks | dengan & tanpa `?to=`, reload, offline submit, deadline lewat |

## 7. Pre-launch UX sign-off (gabung `SPEC 08 §9`)
- [ ] Semua DoD section ✓
- [ ] Lighthouse mobile perf & a11y ≥ 90; CLS<0.05; INP<200ms; LCP<2.5s
- [ ] Butter check: scroll 60fps di mid + LOW degrade mulus
- [ ] a11y pass (kontras, keyboard, SR, zoom)
- [ ] reduced-motion path enak
- [ ] copy final + TODO config terisi + etiquette akurat
- [ ] RSVP/Wishes nyata ke Sheet (uji lalu hapus)
- [ ] OG WhatsApp tampil baik
- [ ] guest link generator jalan
- [ ] tes di HP keluarga (orang awam) tanpa bingung

## 8. Usability mini-test (5 orang awam, opsional tapi disarankan)
Tugas: "buka undangan, lihat tanggal & lokasi, konfirmasi hadir, kirim ucapan, salin rekening." Sukses bila selesai tanpa bantuan < 90 detik & tanpa bingung. Catat friksi → perbaiki.

---

## Peta UX layer (09–13)
09 Design System · 10 Interaction/Microinteraction · 11 Smooth-scroll/Perf · 12 Wireframes/Flow · 13 Quality/A11y/Acceptance.
Bersama "main 8" (01–08) + kreatif/gerak (`docs/01–12`) = paket lengkap siap build.
