# 05 — Data Fields & Logic

Definisi link tamu, RSVP, wishes, gift, livestream, dan settings. Backend data: **Google Sheets**.

---

## 1. Personalized Guest Link

Setiap tamu mendapat URL personal. Harus ada **generator link** yang mudah dipakai.

**Pola URL:**
```
https://<domain>/?to=Nama+Tamu
atau (lebih rapi)
https://<domain>/?g=<slug>
```

**Field per tamu (Google Sheet "Guests"):**
| Field | Tipe | Contoh |
| :-- | :-- | :-- |
| `slug` | string unik | `budi-santoso` |
| `nama_tamu` | string | `Bapak Budi Santoso` |
| `kategori` | string (opsional) | `Keluarga / Teman / Kerja` |
| `link` | string (auto) | URL final |

**Greeting:** nama tamu dari query param tampil otomatis di **Gate** (`{namaTamu}`). Jika param kosong → fallback "Tamu Undangan".

> Generator: sheet/CLI sederhana yang menggabungkan base URL + slug → kolom `link` siap di-broadcast (mis. ke WhatsApp).

---

## 2. RSVP (Google Sheet "RSVP")
| Field | Tipe | Wajib | Catatan |
| :-- | :-- | :-- | :-- |
| `timestamp` | datetime | auto | |
| `slug` / `nama_tamu` | string | ya | dari link/input |
| `kehadiran` | enum | ya | `Hadir` / `Tidak Hadir` / `Masih Diusahakan` |
| `jumlah` | number | ya | 1 undangan = 2 orang; bawa anak → **maks 4 (capped)** |
| `catatan` | text | tidak | |

**Validasi:** `jumlah` maksimal 4. Deadline tampil: **D-7** (15 Agustus 2026).

---

## 3. Wishes (Google Sheet "Wishes")
| Field | Tipe | Wajib |
| :-- | :-- | :-- |
| `timestamp` | datetime | auto |
| `nama` | string | ya |
| `pesan` | text | ya |

- **Publik**: semua tamu bisa membaca (message wall / live feed).
- Ringan — paginate / lazy-load agar tidak berat di HP kentang.
- (Opsional) moderation flag bila perlu menyembunyikan spam.

---

## 4. Gift / Tanda Kasih (statis, di config)
Ditampilkan **setara** Indonesia & Jepang. Nada lembut, tidak memaksa.

```yaml
gift:
  indonesia:
    bank: ""
    no_rekening: ""
    atas_nama: ""
  japan:
    bank: ""
    account: ""
    name: ""
  alamat_hadiah: ""   # untuk kado fisik
```
- Tombol **"Salin"** untuk nomor rekening.

---

## 5. Livestream Links (config)
```yaml
livestream:
  youtube: ""      # utama
  zoom: ""         # interaktif
  instagram_bashara: ""
  instagram_hanifah: ""
  facebook_parents: []   # 4 akun orang tua
```

---

## 6. Event & Settings (config)
```yaml
event:
  judul: "Akad & Resepsi"
  tanggal: "2026-08-22"
  akad_mulai: "10:00"
  acara_selesai: "13:00"
  timezone: "WIB"
  venue_nama: "Widuri Restaurant (Lantai 2)"
  venue_alamat: "Jl. Ciliwung No.19, Cihapit, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40114"
  venue_catatan: "Dekat Gedung Sate · parkir ± 40 mobil"
  venue_telp: "+6282116606669"
  maps_url: "https://maps.app.goo.gl/eCQJZkY3qMvepZQz6"
  dress_code: "Warna pastel"

settings:
  rsvp_deadline: "2026-08-15"   # D-7
  musik: "assets/audio/la-vie-en-rose.mp3"
  hashtag: "#BASHicallyHANI's"
  countdown_target: "2026-08-22T10:00:00+07:00"
  theme: "single-light"          # tanpa dark mode

calendar:   # untuk "Save to Calendar"
  title: "Pernikahan Bashara & Hanifah"
  start: "2026-08-22T10:00:00+07:00"
  end: "2026-08-22T13:00:00+07:00"
  location: "Widuri Restaurant, Bandung"
```

---

## 7. Integrasi Google Sheets
- Tulis RSVP & Wishes via **Google Apps Script Web App** (endpoint POST) atau Sheets API.
- Baca Wishes untuk message wall (GET / polling ringan).
- Simpan kredensial/endpoint di env, jangan hardcode di repo publik.
- Anti-spam dasar: honeypot field + rate limit sederhana.
