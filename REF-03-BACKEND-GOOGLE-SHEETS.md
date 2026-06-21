# REF 03 — BACKEND: GOOGLE SHEETS + APPS SCRIPT (RSVP & WISHES)

> The one part that needs real external setup. This gives Cursor the complete copy-paste Apps Script, the sheet schema, the deploy checklist, and the Next.js route changes. The user pastes the deployed URL into `.env`.

The site has **no database** — RSVP and Wishes write to a Google Sheet through an Apps Script Web App. The Next.js routes keep the script URL server-side. (`docs/05`, `docs/11 §7`.)

---

## 1. Sheet setup (the user does this once, you provide the steps)
Create one Google Sheet "Nikah Bashara Hanifah" with two tabs:

**Tab `RSVP`** — header row:
`timestamp | slug | nama | kehadiran | jumlah | catatan | userAgent`

**Tab `Wishes`** — header row:
`timestamp | nama | pesan | hidden`

- `kehadiran` ∈ `Hadir | Tidak Hadir | Masih Diusahakan`
- `jumlah` is 1–4 (capped: 1 invite = 2 people; with kids max 4)
- `hidden` lets you soft-moderate a wish without deleting it (default empty/false)

## 2. Apps Script (paste into Extensions → Apps Script, replace `Code.gs`)
Handles **both** RSVP and Wishes via a `type` discriminator, plus a `doGet` that returns the public wishes feed. Includes a honeypot + a tiny same-cell rate guard.

```javascript
const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const json = (obj, code) =>
  ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    if (body.website) return json({ success: true });          // honeypot filled → silently ok, drop
    const type = String(body.type || "rsvp");

    if (type === "wish") {
      const nama = String(body.nama || "").slice(0, 80).trim();
      const pesan = String(body.pesan || "").slice(0, 300).trim();
      if (!nama || !pesan) return json({ success: false, error: { code: "INVALID", message: "nama & pesan required" } });
      const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Wishes");
      sh.appendRow([new Date().toISOString(), nama, pesan, ""]);
      return json({ success: true, data: null });
    }

    // default: RSVP
    const nama = String(body.nama || body.slug || "").slice(0, 120).trim();
    const kehadiran = String(body.kehadiran || "").trim();
    const allowed = ["Hadir", "Tidak Hadir", "Masih Diusahakan"];
    if (!nama || allowed.indexOf(kehadiran) === -1)
      return json({ success: false, error: { code: "INVALID", message: "nama & valid kehadiran required" } });
    let jumlah = parseInt(body.jumlah, 10); if (isNaN(jumlah)) jumlah = 1;
    jumlah = Math.max(1, Math.min(4, jumlah));                  // server-side cap at 4
    const catatan = String(body.catatan || "").slice(0, 300);
    const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName("RSVP");
    sh.appendRow([new Date().toISOString(), String(body.slug || ""), nama, kehadiran, jumlah, catatan, String(body.userAgent || "")]);
    return json({ success: true, data: null });
  } catch (err) {
    return json({ success: false, error: { code: "SERVER", message: String(err) } });
  }
}

function doGet(e) {
  // Public wishes feed for the message wall.
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Wishes");
  const rows = sh.getDataRange().getValues().slice(1)            // drop header
    .filter(r => r[0] && !r[3])                                   // not hidden
    .map(r => ({ timestamp: r[0], nama: r[1], pesan: r[2] }))
    .reverse();                                                  // newest first
  const limit = Math.min(parseInt((e && e.parameter && e.parameter.limit) || "50", 10) || 50, 200);
  return json({ success: true, data: rows.slice(0, limit) });
}
```

## 3. Deploy checklist (give these 5 steps to the user)
1. In Apps Script: **Deploy → New deployment → type: Web app.**
2. **Execute as: Me.** **Who has access: Anyone.**
3. Click **Deploy**, authorize, copy the **Web app URL** (ends `/exec`).
4. Paste it into `nikah-web/.env` as `APPS_SCRIPT_URL=…` and into the Vercel project env.
5. Re-deploy from Apps Script whenever you edit `Code.gs` (URL stays stable if you "Manage deployments → edit" instead of new).

> Note: `doGet`/`doPost` from a browser hit CORS. **Always call through the Next.js routes** (server-to-server, no CORS) — never fetch the `/exec` URL directly from the client.

## 4. Next.js route changes
**`app/api/rsvp/route.ts`** (exists) — extend the validator to map fields + cap `jumlah`:
- accept `{ slug?, nama, kehadiran, jumlah, catatan? }`; require `nama` + valid `kehadiran`; clamp `jumlah` 1–4; forward to `APPS_SCRIPT_URL` with `{ type:"rsvp", …, userAgent }`. Keep the existing `{success,data,error}` envelope and 200/400/502/503 codes. Add a `website` honeypot passthrough (if present, return 200 without forwarding).

**`app/api/wishes/route.ts`** (create):
```ts
import { NextResponse } from "next/server";
const URL_ = () => process.env.APPS_SCRIPT_URL ?? "";

export async function GET() {
  const url = URL_(); if (!url) return NextResponse.json({ success:false, error:{code:"NOT_CONFIGURED"} }, { status:503 });
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) return NextResponse.json({ success:false, error:{code:"UPSTREAM"} }, { status:502 });
  return NextResponse.json(await r.json());
}

export async function POST(req: Request) {
  const url = URL_(); if (!url) return NextResponse.json({ success:false, error:{code:"NOT_CONFIGURED"} }, { status:503 });
  let b: unknown; try { b = await req.json(); } catch { return NextResponse.json({ success:false, error:{code:"INVALID_JSON"} }, { status:400 }); }
  const o = (b ?? {}) as Record<string, unknown>;
  if (typeof o.website === "string" && o.website) return NextResponse.json({ success:true, data:null }); // honeypot
  const nama = typeof o.nama === "string" ? o.nama.trim() : "";
  const pesan = typeof o.pesan === "string" ? o.pesan.trim() : "";
  if (!nama || !pesan) return NextResponse.json({ success:false, error:{code:"INVALID_PAYLOAD"} }, { status:400 });
  const r = await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, cache:"no-store",
    body: JSON.stringify({ type:"wish", nama: nama.slice(0,80), pesan: pesan.slice(0,300) }) });
  if (!r.ok) return NextResponse.json({ success:false, error:{code:"UPSTREAM"} }, { status:502 });
  return NextResponse.json({ success:true, data:null });
}
```

## 5. Client usage
- RSVP form → `POST /api/rsvp` with `{ slug, nama, kehadiran, jumlah, catatan, website:"" }`. Show submitting → success (petal burst) → error states (GUIDE 04 C.1, GUIDE 05 A.4). Include the hidden honeypot input `name="website"` kept empty + visually hidden.
- Wishes → `GET /api/wishes` to render the wall (lazy/paginate, cache short), `POST /api/wishes` to add; prepend the new card optimistically (GUIDE 05 A.7).
- Validation lives on **both** sides (client UX + server/Apps Script truth). The repo rule allows Zod-style validation at the boundary; the route above is hand-rolled to match the existing `rsvp/route.ts` style — keep them consistent.

## 6. Anti-spam (light, enough for a wedding)
Honeypot (done) + rely on the small audience. If abuse appears, add a per-IP cooldown in the route (in-memory Map is fine on a single region) and use the `hidden` column to soft-hide a wish. Don't over-build.

**Acceptance:** RSVP rows land in the sheet with `jumlah` capped at 4; the wishes wall reads from `GET /api/wishes` and new wishes append + appear; the `/exec` URL is only ever called server-side; `503` is returned gracefully until `APPS_SCRIPT_URL` is set.
