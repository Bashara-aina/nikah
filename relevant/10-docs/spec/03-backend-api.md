# SPEC 03 — Backend & API

Backend = **Next.js API routes** (thin proxy) + **Google Apps Script Web App** (persistensi ke Sheet). Tidak ada DB.

---

## 1. Endpoint overview

| Route (Next) | Method | Guna |
| :-- | :-- | :-- |
| `/api/rsvp` | POST | simpan konfirmasi kehadiran |
| `/api/wishes` | GET | ambil daftar ucapan (publik) |
| `/api/wishes` | POST | kirim ucapan |
| `/api/ics` | GET | unduh file `.ics` Save-to-Calendar (atau dibuat client) |

Next route menyembunyikan `APPS_SCRIPT_URL` + menambah `APPS_SCRIPT_TOKEN`, validasi, rate-limit. Client **tidak pernah** memanggil Apps Script langsung.

---

## 2. Skema request/response (kontrak)

### POST /api/rsvp
```ts
// request body
{
  to?: string,            // nama tamu dari ?to= (konteks)
  nama: string,           // 2..80 char
  kehadiran: "hadir" | "tidak" | "diusahakan",
  jumlah: number,         // 1..4 (capped); wajib jika hadir
  pesan?: string,         // 0..500
  hp?: string,            // honeypot — HARUS kosong
  t: number               // timestamp client (anti-replay kasar)
}
// response
200 { ok: true }
400 { ok:false, error:"validation", fields:{...} }
429 { ok:false, error:"rate_limited" }
502 { ok:false, error:"upstream" }   // Apps Script gagal
```

### GET /api/wishes?limit=50&cursor=...
```ts
200 { ok:true, items: { nama:string, pesan:string, ts:number }[], nextCursor?:string }
```

### POST /api/wishes
```ts
{ nama:string(2..60), pesan:string(1..300), hp?:"" , t:number }
200 { ok:true, item:{nama,pesan,ts} }
400/429 sama pola
```

Validasi pakai **zod** di `lib/validation.ts` (dipakai client & server — single source).

---

## 3. Implementasi Next route (pola)

```ts
// app/api/rsvp/route.ts  (Edge atau Node runtime; pakai Node bila perlu fetch panjang)
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  if (!rateLimit(ip, "rsvp", 5, 60_000)) return json(429,{ok:false,error:"rate_limited"});
  const body = await req.json().catch(()=>null);
  const parsed = RsvpSchema.safeParse(body);
  if (!parsed.success) return json(400,{ok:false,error:"validation",fields:flat(parsed)});
  if (body.hp) return json(200,{ok:true});           // honeypot: pura-pura sukses
  const r = await postAppsScript("rsvp", parsed.data); // server-side, +token
  if (!r.ok) return json(502,{ok:false,error:"upstream"});
  return json(200,{ok:true});
}
```
- **Rate limit**: in-memory token bucket per-IP per-action (cukup untuk skala undangan). Edge: pakai sederhana / atau Upstash bila mau persist (opsional).
- **Honeypot** `hp`: field tersembunyi; bot mengisi → tolak diam-diam.
- **Idempotensi ringan**: client kirim `t`; server bisa abaikan submit identik <2s (debounce sudah di client juga).

---

## 4. Apps Script Web App (kontrak server)

Satu Web App men-deploy `doPost`/`doGet`. Validasi `token`. Routing via field `action`.

```js
// Code.gs (ringkas)
const TOKEN = "••• shared secret •••";
const SHEET_ID = "•••";
function doPost(e){
  const b = JSON.parse(e.postData.contents);
  if (b.token !== TOKEN) return out_({ok:false,error:"auth"});
  const ss = SpreadsheetApp.openById(SHEET_ID);
  if (b.action==="rsvp"){
    ss.getSheetByName("rsvp").appendRow([new Date(), b.to||"", b.nama, b.kehadiran, b.jumlah||"", b.pesan||""]);
    return out_({ok:true});
  }
  if (b.action==="wish"){
    ss.getSheetByName("wishes").appendRow([new Date(), b.nama, b.pesan, "TRUE"]); // approved default
    return out_({ok:true});
  }
  return out_({ok:false,error:"unknown"});
}
function doGet(e){ // list wishes (approved only)
  const ss=SpreadsheetApp.openById(SHEET_ID);
  const rows=ss.getSheetByName("wishes").getDataRange().getValues().slice(1)
    .filter(r=>String(r[3]).toUpperCase()==="TRUE")
    .map(r=>({ts:+new Date(r[0]),nama:r[1],pesan:r[2]}));
  return out_({ok:true, items: rows.reverse()});
}
function out_(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
```
- Deploy: **Execute as me**, **Anyone** access. Simpan URL → `APPS_SCRIPT_URL` (server env).
- CORS tidak masalah karena dipanggil server-side dari Next.

---

## 5. Error handling & resiliensi

| Kasus | Perilaku |
| :-- | :-- |
| Validasi gagal | 400 + highlight field (animasi shake halus), tidak submit |
| Rate limited | 429 + toast "Sebentar ya, coba lagi" |
| Apps Script down/timeout (>8s) | 502 + simpan draft di localStorage + tombol "Coba lagi" |
| Offline | deteksi `navigator.onLine` → tahan submit, queue, kirim saat online |
| Sukses | animasi sukses (`docs/10 §9`) + disable form |

Timeout fetch ke Apps Script: 8s (AbortController). Retry 1× otomatis untuk 5xx.

---

## 6. Security
- Secrets server-only (`APPS_SCRIPT_URL`, `APPS_SCRIPT_TOKEN`); tak pernah ke client.
- Token dicek di Apps Script.
- Sanitasi `pesan`/`nama` (strip HTML) sebelum render wishes (cegah XSS) — escape di client + batasi panjang.
- Rate-limit + honeypot anti-spam. Moderasi opsional via kolom `approved` (set FALSE default bila mau pre-moderasi).
- Tidak menyimpan PII sensitif; hanya nama + pesan + kehadiran.

---

## 7. /api/ics (Save to Calendar)
- Generate VEVENT dari `lib/config.ts` (mulai 2026-08-22 10:00 WIB, selesai 13:00 WIB, lokasi venue, judul, URL). Bisa dibuat **client-side** (download blob) agar tanpa server — preferensi: client `lib/ics.ts`.

---

## 8. Backend checklist
- [ ] zod schema (rsvp, wish) shared
- [ ] /api/rsvp + /api/wishes (GET/POST) proxy + token
- [ ] rate-limit + honeypot
- [ ] Apps Script deploy + Sheet tabs (SPEC 04)
- [ ] error/offline/retry handling
- [ ] sanitasi & escape wishes
- [ ] ics generator

Lanjut: **SPEC 04 — Data Model**.
