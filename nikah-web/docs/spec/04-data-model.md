# SPEC 04 — Data Model

Semua "data" = (a) **config statis** acara (`lib/config.ts`), (b) **Google Sheet** (rsvp/wishes/guests), (c) **guest token** di URL. Tidak ada DB.

---

## 1. Google Sheet — tabs & kolom

### Tab `rsvp`
| Kol | Nama | Tipe | Catatan |
| :-: | :-- | :-- | :-- |
| A | timestamp | datetime | diisi Apps Script |
| B | guest | string | nilai `?to=` (konteks undangan) |
| C | nama | string | nama pengirim (2–80) |
| D | kehadiran | enum | `Hadir` / `Tidak` / `Diusahakan` |
| E | jumlah | int | 1–4 (capped); kosong jika tidak hadir |
| F | pesan | string | opsional ≤500 |

### Tab `wishes`
| Kol | Nama | Tipe | Catatan |
| :-: | :-- | :-- | :-- |
| A | timestamp | datetime | |
| B | nama | string | 2–60 |
| C | pesan | string | 1–300 |
| D | approved | bool | default `TRUE` (atau FALSE bila pre-moderasi) |

### Tab `guests` (opsional, untuk generator link & tracking)
| Kol | Nama | Tipe | Catatan |
| :-: | :-- | :-- | :-- |
| A | nama | string | nama tamu |
| B | slug/token | string | dipakai di `?to=` |
| C | grup | string | keluarga/teman (opsional) |
| D | link | string | URL undangan jadi (di-generate) |
| E | opened | bool | opsional (jika mau pixel) |

---

## 2. TypeScript types (`lib/types.ts`)

```ts
export type Kehadiran = "hadir" | "tidak" | "diusahakan";

export interface RsvpInput {
  to?: string; nama: string; kehadiran: Kehadiran;
  jumlah: number; pesan?: string; hp?: string; t: number;
}
export interface Wish { nama: string; pesan: string; ts: number; }
export interface WishInput { nama: string; pesan: string; hp?: string; t: number; }

export interface Guest { nama: string; slug: string; grup?: string; }
```

## 3. Validasi (`lib/validation.ts`, zod — shared client+server)

```ts
export const RsvpSchema = z.object({
  to: z.string().max(120).optional(),
  nama: z.string().trim().min(2).max(80),
  kehadiran: z.enum(["hadir","tidak","diusahakan"]),
  jumlah: z.coerce.number().int().min(1).max(4),
  pesan: z.string().max(500).optional().default(""),
  hp: z.string().max(0).optional(),         // honeypot must be empty
  t: z.number()
}).refine(v => v.kehadiran!=="hadir" || v.jumlah>=1, { path:["jumlah"], message:"Wajib jika hadir" });

export const WishSchema = z.object({
  nama: z.string().trim().min(2).max(60),
  pesan: z.string().trim().min(1).max(300),
  hp: z.string().max(0).optional(),
  t: z.number()
});
```
Aturan bisnis: **jumlah ≤ 4** (1 undangan = plus one; bawa anak maks 4 capped, `docs/05`). Anak tidak boleh lantai 2 → ditampilkan sebagai catatan, bukan field.

---

## 4. Guest link / token scheme

- Format: `https://SITE/?to=<value>`.
- `value` = **nama ter-encode** (`encodeURIComponent`) atau **base64url** untuk rapi.
  - Sederhana: `?to=Keluarga%20Bapak%20Andi`
  - Rapi/opsional: `?to=a2VsdWFyZ2EtYW5kaQ` (base64url dari slug) → `lib/guest.ts` decode + map ke nama tampil.
- `lib/guest.ts`:
  ```ts
  export function readGuest(search: URLSearchParams): string {
    const raw = search.get("to"); if(!raw) return "";
    try { return decodeURIComponent(raw); } catch { return raw; }
  }
  export function greeting(name: string){ return name?.trim() || "Bapak/Ibu/Saudara/i"; }
  ```
- **Generator** (`docs/SPEC 08`): dari tab `guests` / CSV nama → hasilkan kolom `link`. Script Node lokal `scripts/gen-links.ts` (baca CSV, tulis CSV+link) ATAU formula Sheet: `=SITE & "/?to=" & ENCODEURL(A2)`.

---

## 5. Config data model (`lib/config.ts`) — sumber tunggal konten

```ts
export const config = {
  couple: { groom:"Bashara Aina", bride:"Hanifah Syifa Azzahra Bay", hashtag:"#BASHicallyHANI's" },
  date: { iso:"2026-08-22", akadStart:"10:00", end:"13:00", tz:"WIB" },
  rsvpDeadlineDaysBefore: 7,                 // D-7
  venue: {
    name:"Widuri Restaurant", floor:"Lantai 2",
    address:"Jl. Ciliwung No.19, Cihapit, Bandung Wetan, Kota Bandung, Jawa Barat 40114",
    landmark:"dekat Gedung Sate",
    mapsUrl:"https://maps.app.goo.gl/eCQJZkY3qMvepZQz6",
    phone:"+6282116606669", parking:"±40 mobil"
  },
  dressCode:{ note:"Warna pastel" },
  etiquette:[
    "Akad mulai 10.00 — mohon hadir tepat waktu",
    "Tidak ada anak-anak di lantai 2",
    "Ruang salat tersedia di lantai 1",
    "Mohon tanpa flash",
    "Mohon tidak berdiri saat prosesi akad",
  ],
  livestream:{ youtube:"", zoom:"", instagram:["",""], facebook:["","","",""] },
  gift:{
    banks:[ {label:"Bank Indonesia", name:"", number:""}, {label:"Bank Jepang (JP)", name:"", number:""} ],
    address:""                                 // alamat hadiah fisik
  },
  capacity:{ maxPerInvite:4 },
} as const;
```
> Nilai kosong (`""`) = **TODO mempelai** isi sebelum rilis (livestream link, no. rekening, alamat hadiah). Teks naratif/copy final tetap dari `docs/03-copywriting.md`.

---

## 6. Data lifecycle
- **Config**: build-time (statis). Ubah = redeploy.
- **RSVP/Wishes**: write append-only ke Sheet (real-time). Tidak ada update/delete dari situs (mempelai kelola manual di Sheet).
- **Wishes read**: GET dengan cache pendek (mis. revalidate 30–60s) agar tidak spam Apps Script.
- **Retensi**: data hidup di Sheet milik mempelai; bebas diekspor.

---

## 7. Data checklist
- [ ] Sheet dibuat: tabs rsvp/wishes/guests + header
- [ ] zod schema selaras kolom Sheet
- [ ] config.ts terisi (TODO kosong ditandai)
- [ ] guest decode + greeting
- [ ] link generator (script/formula)
- [ ] sanitasi nama/pesan saat render

Lanjut: **SPEC 05 — User Flows**.
