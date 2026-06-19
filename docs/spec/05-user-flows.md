# SPEC 05 — User Flows

Alur tamu end-to-end + state machine + edge case. Arc: gate → hero → welcome → countdown → story → japan → event → rsvp → wishes → gift → closing (`docs/02`, `docs/10`).

---

## 1. Happy path (tamu buka dari link personal)

```mermaid
flowchart TD
  A[Buka /?to=Nama] --> B[Loading 1-2s\nloading-motif]
  B --> C[Gate: 'Kepada, Nama' + Buka Undangan]
  C -->|tap| D[Izin gyro + start audio + page-turn]
  D --> E[HERO assemble → living parallax]
  E -->|scroll| F[Welcome + Yasin 36]
  F --> G[Countdown D-…]
  G --> H[Story kronologis]
  H --> I[Japan dream]
  I --> J[Event: tanggal/venue/map/etiquette/livestream]
  J --> K[RSVP form]
  K --> L[Wishes publik]
  L --> M[Gift / Tanda Kasih + FAQ]
  M --> N[Closing + cat-peek]
  K -.sticky.-> K
```

Durasi target ± 1 menit; user bebas scroll cepat ke RSVP/peta (sticky button + smooth scrollTo).

---

## 2. Gate & permission flow (kritis)

```mermaid
stateDiagram-v2
  [*] --> Loading
  Loading --> Gate: aset hero preloaded
  Gate --> Opening: tap "Buka Undangan"
  Opening --> AskGyro: iOS? requestPermission()
  AskGyro --> Granted: ya
  AskGyro --> Denied: tidak / no sensor
  Granted --> Hero: tilt+scroll aktif
  Denied --> Hero: scroll-only + auto-drift
  Opening --> Audio: fade-in La Vie en Rose (loop)
  Hero --> [*]
```

Catatan:
- Permission gyro & audio **harus** dipicu oleh gesture tap (kebijakan browser). Keduanya di handler tap Gate.
- Jika user reload setelah masuk: lewati animasi gate panjang (simpan `entered` di sessionStorage) → langsung hero (assemble cepat). Audio tetap butuh 1 tap (browser) → tampilkan toggle "🔊".

---

## 3. RSVP flow + states

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Filling: user isi
  Filling --> Validating: submit
  Validating --> Idle: error (highlight field, shake halus)
  Validating --> Submitting: valid
  Submitting --> Success: 200 (checkmark + petals, form disabled)
  Submitting --> RateLimited: 429 (toast, tunggu)
  Submitting --> Failed: 502/timeout (simpan draft, tombol Coba lagi)
  Failed --> Submitting: retry
  Submitting --> Offline: !navigator.onLine (queue → kirim saat online)
```

Field & aturan (`SPEC 04`): nama, kehadiran (Hadir/Tidak/Diusahakan), jumlah (1–4, muncul hanya jika Hadir), pesan opsional. Deadline **D-7** tampil jelas; setelah lewat → form bisa dikunci (opsional) dgn pesan lembut.

---

## 4. Wishes flow
```mermaid
stateDiagram-v2
  [*] --> Loaded: GET /api/wishes (list publik)
  Loaded --> Posting: submit ucapan
  Posting --> Prepend: 200 → kartu baru slide-down + highlight
  Posting --> Error: 4xx/5xx → toast
  Prepend --> Loaded
```
- List publik (semua bisa baca). Pagination/`limit` + "muat lebih". Sanitasi & escape teks.

---

## 5. Audio flow
- Default **OFF**. Start saat tap Gate (fade-in vol→~0.5, loop).
- `AudioToggle` selalu ada (pojok), state ke localStorage. Hormati jika user mute.
- Pause saat tab hidden (opsional) untuk hemat.

---

## 6. Edge cases (wajib ditangani)

| Kasus | Perilaku |
| :-- | :-- |
| Tanpa `?to=` | Gate sapa generik "Bapak/Ibu/Saudara/i" |
| `?to=` aneh/encoding rusak | fallback tampilkan raw / generik, tidak error |
| Reload tengah jalan | skip gate panjang (sessionStorage `entered`) |
| Gyro ditolak / desktop | scroll-only + auto-drift; tidak ada prompt berulang |
| Autoplay diblokir | audio nyala via toggle; tidak memaksa |
| Offline saat submit | queue + kirim saat online; pesan jelas |
| Apps Script error | toast + draft tersimpan + retry |
| JS mati / crash motion | konten inti tetap terbaca (progressive enhancement); fallback flat hero |
| prefers-reduced-motion | semua gerak → fade lembut (`docs/08 §7`) |
| HP lemah (tier LOW) | efek berat mati otomatis |
| Deadline RSVP lewat | form locked + pesan; wishes & info tetap jalan |
| Layar besar/desktop | layout kartu terpusat; hero full-bleed |

---

## 7. Loading / empty / error states (UI)
- **Loading awal**: `loading-motif` 1–2s (bukan spinner kaku).
- **Wishes kosong**: ilustrasi kecil + "Jadilah yang pertama memberi ucapan 💌".
- **Wishes loading**: skeleton kartu lembut (shimmer halus).
- **Submit sukses**: micro-perayaan (checkmark draw + petals).
- **Error**: toast `aria-live`, nada ramah Bahasa Indonesia.

---

## 8. Navigation utilities
- Tanpa nav bar terlihat (editorial, dipandu scroll).
- **Sticky RSVP** (mobile): muncul setelah hero, sembunyi di section RSVP, breathing.
- **ScrollTop** halus muncul setelah scroll jauh.
- Smooth scroll via Lenis `scrollTo("#rsvp" / "#lokasi")`.

---

## 9. Flow checklist
- [ ] Gate→permission→audio→hero rapi
- [ ] reload skip-gate
- [ ] RSVP state machine lengkap (incl offline/retry)
- [ ] wishes prepend + empty/loading
- [ ] semua edge case di tabel §6 tertangani
- [ ] reduced-motion & tier path teruji

Lanjut: **SPEC 06 — Motion Integration**.
