# STAGE 7 — QA, Launch & Post-launch

## Goal
Verifikasi end-to-end terhadap acceptance criteria, isi data final, generate link tamu, deploy ke produksi, dan kelola pasca-rilis. **Gerbang terakhir sebelum sebar undangan.**

## Prereq
Stage 1–6 selesai (semua section + polish).

## Tasks
1. **Acceptance / DoD per section** (`docs/spec/13 §5`): jalankan checklist Definition-of-Done tiap section (Loading…Closing). Tak lulus = balik ke stage terkait.
2. **Device & condition matrix** (`docs/spec/13 §6`): iOS Safari (gyro permission), Chrome Android, **HP low-end nyata (tier LOW)**, desktop; throttle **3G**; reduced-motion ON; font besar/zoom 200%; dengan & tanpa `?to=`; reload; **offline submit**; deadline lewat.
3. **Isi data final (TODO `config.ts`, `docs/spec/04 §5`)**: no. rekening **Bank Indonesia & Bank Jepang**, **alamat hadiah fisik**, link **livestream** (YouTube/Zoom/IG mempelai/Facebook 4 ortu). Pastikan etiquette & venue akurat (Widuri Lt.2, dekat Gedung Sate).
4. **Copy final**: semua teks dari `docs/03-copywriting.md` masuk; tak ada placeholder/Lorem; gift tone apresiatif.
5. **Backend prod**: Apps Script **production deployment**; env produksi di Vercel (`APPS_SCRIPT_URL/TOKEN`, `NEXT_PUBLIC_SITE_URL/MAPS_URL`). Smoke test: kirim 1 RSVP + 1 wish ke Sheet prod → verifikasi baris → hapus baris uji.
6. **Guest link generator** (`docs/spec/04 §4`, `08 §9`): `scripts/gen-links.ts` (CSV nama → daftar URL `?to=`) atau formula Sheet `=SITE&"/?to="&ENCODEURL(A2)`. Uji beberapa link membuka sapaan benar.
7. **OG/share**: cek `og-cover.jpg` render di **WhatsApp** (judul/nama/tanggal terbaca, <300KB).
8. **Deploy** (`docs/spec/08 §8`): Vercel production; domain custom (opsional) → set `NEXT_PUBLIC_SITE_URL`; verifikasi di **HP asli**: gate→gyro→audio→scroll→RSVP→wishes→gift.
9. **Perf/a11y gate** (`docs/spec/11 §9`, `13 §7`): Lighthouse mobile perf & a11y ≥ 90; CLS<0.05; INP<200ms; LCP<2.5s; tak ada error console.
10. **Usability mini-test** (opsional, `docs/spec/13 §8`): 5 orang awam selesaikan "buka → lihat tanggal/lokasi → RSVP → kirim ucapan → salin rekening" < 90s tanpa bantuan. Perbaiki friksi.

## Launch checklist (ringkas — detail `docs/spec/08 §9` & `13 §7`)
- [ ] DoD semua section ✓ · matrix device ✓
- [ ] config TODO terisi (rekening ID+JP, alamat, livestream) · copy final
- [ ] RSVP+Wishes nyata ke Sheet prod (uji→hapus)
- [ ] guest link generator jalan · sapaan benar
- [ ] OG WhatsApp ✓ · favicon/manifest ✓
- [ ] audio start-after-tap + mute ✓ · map benar · `.ics` valid · deadline D-7
- [ ] tier LOW & reduced-motion enak di HP lemah
- [ ] Lighthouse ≥90 · CLS/INP/LCP lulus · tanpa error
- [ ] tes di HP keluarga (awam) tanpa bingung

## Files created
`scripts/gen-links.ts` (+ output CSV link) · catatan rilis.

## Cross-refs
`docs/spec/04 §4–5` · `08 §8–10` · `11 §9` · `13 §5–8` · `docs/03` (copy) · `/README.md` (aset/struktur).

## Post-launch (`docs/spec/08 §10`)
- Pantau Sheet RSVP/Wishes; moderasi wishes (`approved`) bila perlu.
- (Opsional) analytics ringan: jumlah pembuka, RSVP rate.
- **Pasca-acara**: tambah foto hari-H ke `gallery/` (struktur siap) + thank-you note opsional.
- Rollback: Vercel instant rollback bila ada masalah.

## Exit criteria (PROYEK SELESAI)
- [ ] Semua launch checklist ✓
- [ ] Produksi live di domain final, terverifikasi di HP asli
- [ ] Link tamu siap sebar ke WhatsApp grup keluarga
- [ ] Mempelai bisa membaca RSVP/Wishes di Sheet

🎉 **Selesai — undangan siap disebar.**

---

### Peta 7 Stage (akhir)
1 Foundation → 2 Motion Engine → 3 Entry/Hero → 4 Narrative → 5 Functional+Backend → 6 Polish/Butter/A11y → 7 QA/Launch.
Referensi: **build bible** `docs/spec/01–13` · **kreatif/gerak** `docs/01–12` · **manifest aset** `/README.md`.
