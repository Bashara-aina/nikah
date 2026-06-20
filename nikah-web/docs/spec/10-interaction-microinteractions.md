# SPEC 10 — Interaction & Microinteractions

Setiap sentuhan harus terasa **responsif & hidup** tapi lembut. Doc ini = inventaris feedback per interaksi + prinsip. Visual di `SPEC 09`, gerak di `docs/08`.

---

## 1. Prinsip feedback (butter feel)
1. **Acknowledge < 100ms.** Setiap tap memberi respons visual instan (scale/ripple) sebelum proses apa pun. Tidak ada "dead tap".
2. **Satu aksi = satu reaksi jelas.** Hindari banyak hal bergerak sekaligus saat 1 tap (kecuali perayaan sukses).
3. **Lembut, bukan agresif.** Scale active .96–.98, durasi `dur.micro`, `ease.soft`. Tidak ada bounce besar.
4. **State terlihat:** default → hover(desktop) → active → focus → loading → done/error. Tak ada state tersembunyi.
5. **Haptik halus** (mobile, opsional): `navigator.vibrate?.(8)` saat select pill / submit sukses. Hormati jika tak didukung.
6. **Reversible & aman:** aksi penting (submit) punya konfirmasi visual; tak ada aksi merusak.

---

## 2. Inventaris microinteraction

| Elemen | Trigger | Reaksi |
| :-- | :-- | :-- |
| Tombol "Buka Undangan" | tap | ripple dari titik tap + scale .97 → page-turn reveal; request gyro + audio fade-in |
| Tombol primary umum | tap | scale .97 + lift turun; release kembali (`dur.micro`) |
| Pill RSVP | select | morph bg→peach + check + scale settle; deselect lain |
| Input focus | focus | underline grow dari tengah; label float naik |
| Input typing | input | validasi realtime ringan (debounce 300ms): tanda valid/err muncul lembut |
| Input error | blur invalid | underline dusty + pesan fade-in + shake 1× kecil |
| Jumlah hadir | stepper +/- | angka roll mikro; clamp 1–4 dengan "mentok" subtle |
| Submit RSVP | tap | tombol → spinner bunga → checkmark draw + **petal burst kecil** + form disabled + haptic |
| "Salin rekening" | tap | teks→"Tersalin ✓" + toast pop + haptic; balik 2s |
| FAQ item | tap | chevron rotate + konten reveal (fade+grid-rows) |
| Wish submit | tap | kartu baru **prepend** slide-down + highlight blush 1.5s |
| Audio toggle | tap | ikon morph 🔊/🔇 + volume fade; state tersimpan |
| Sticky RSVP | tap | smooth scrollTo #rsvp (Lenis) + sticky sembunyi |
| ScrollTop | tap | smooth scrollTo top |
| Gallery item | tap | buka lightbox (fade+scale); swipe ganti; tap luar/✕ tutup |
| Save to Calendar | tap | unduh .ics + toast "Tersimpan ke kalender" |
| Map / livestream | tap | buka link (target sesuai); map-pin pulse mengundang |
| Link luar (livestream) | tap | buka tab baru `rel=noopener` |

---

## 3. Pola input form (RSVP & Wishes)
- **Realtime, tidak menghukum:** validasi muncul saat blur / setelah mulai mengetik valid; jangan teriak merah saat user baru fokus.
- **Label persisten** (float), placeholder ringan; jangan placeholder-only.
- **Jumlah** hanya tampil bila kehadiran = Hadir (reveal halus).
- **Disable submit** sampai valid; tombol kasih alasan via aria bila disabled.
- **Sukses** = perayaan mikro + form terkunci + opsi "Ubah jawaban" lembut (opsional).
- **Keyboard mobile:** scroll field ke tampak saat fokus; sticky RSVP sembunyi saat keyboard naik (visualViewport).

---

## 4. Gesture & scroll interaction
- **Scroll** = Lenis smooth (lihat `SPEC 11`). Tidak ada scroll-hijack penuh; user tetap pegang kendali.
- **Tap di luar** menutup overlay (lightbox, sheet).
- **Swipe** hanya di gallery lightbox (horizontal). Tidak ada swipe global yang membingungkan.
- **Tilt (gyro)** memberi hidup pada hero — bukan kontrol; tak pernah menghalangi baca.
- Tidak ada hover-only yang penting (mobile tak punya hover) → semua aksi punya state tap.

---

## 5. Desktop vs mobile
| | Mobile (utama) | Desktop |
| :-- | :-- | :-- |
| Aksi | tap states + haptic | hover + active |
| Sticky/ScrollTop | tampil | ScrollTop saja |
| Gyro | ya | nonaktif (auto-drift) |
| Lightbox | swipe | klik panah / drag |

---

## 6. Timing & easing (ringkas, dari `docs/08 §3`)
- Ack tap: `dur.micro` (150–200ms), `ease.soft`.
- Reveal konten interaksi (accordion/jumlah): `dur.base`.
- Sukses/perayaan: sedikit lebih panjang (`dur.enter`) + `ease.settle`.
- **Tidak ada `linear`**, tidak ada > 1s untuk feedback aksi (biar terasa cepat).

---

## 7. Reduced-motion & low-tier
- Microinteraction tetap ADA (penting untuk kejelasan) tapi **dikurangi ke opacity/warna** tanpa gerak posisi besar; petal burst → fade halus; shake → highlight warna saja. Haptik tetap boleh.

---

## 8. Checklist
- [ ] semua elemen di §2 punya reaksi < 100ms
- [ ] form realtime ramah (tak menghukum) + sukses/disabled/error
- [ ] copy clipboard + toast + haptic
- [ ] tidak ada hover-only penting
- [ ] keyboard mobile handling (viewport)
- [ ] reduced-motion varian tiap interaksi

Lanjut: **SPEC 11 — Smooth Scroll & Perceived Performance**.
