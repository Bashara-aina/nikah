/**
 * Wishes endpoint — REF-03 contract.
 *
 *   GET  → proxies the Apps Script wall; 503 `NOT_CONFIGURED` until wired
 *          (the UI renders an honest empty state).
 *   POST → validates `{ nama, pesan, website }`; honeypot drops quietly;
 *          forwards `{ type: "wish", nama, pesan }`.
 *
 * Envelope: `{ success, data?, error?, meta? }`.
 */
import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rateLimit";

const scriptUrl = (): string => process.env.APPS_SCRIPT_URL ?? "";

const cleanText = (v: unknown, max: number): string =>
  typeof v === "string"
    ? v
        .replace(/[\u0000-\u001F\u007F]/g, " ")
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, max)
    : "";

type Wish = { nama: string; pesan: string; timestamp?: string };

export async function GET(): Promise<NextResponse> {
  const url = scriptUrl();
  if (!url) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_CONFIGURED", message: "Wishes backend belum terpasang" } },
      { status: 503 },
    );
  }
  try {
    const res = await fetch(`${url}?action=wishes`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: { code: "UPSTREAM_ERROR", message: `Upstream ${res.status}` } },
        { status: 502 },
      );
    }
    const raw = (await res.json()) as { wishes?: unknown };
    const wishes: Wish[] = Array.isArray(raw.wishes)
      ? raw.wishes
          .map((w) => {
            const o = (w ?? {}) as Record<string, unknown>;
            return {
              nama: cleanText(o.nama, 80),
              pesan: cleanText(o.pesan, 300),
              ...(typeof o.timestamp === "string" ? { timestamp: o.timestamp } : {}),
            };
          })
          .filter((w) => w.nama.length > 0 && w.pesan.length > 0)
      : [];
    return NextResponse.json({ success: true, data: { wishes } });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Upstream unreachable" } },
      { status: 502 },
    );
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { success: false, error: { code: "RATE_LIMITED", message: "Terlalu banyak percobaan" } },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_JSON", message: "Body must be JSON" } },
      { status: 400 },
    );
  }

  const o = (body ?? {}) as Record<string, unknown>;

  // Honeypot.
  if (typeof o.website === "string" && o.website.length > 0) {
    return NextResponse.json({ success: true, data: null });
  }

  const nama = cleanText(o.nama, 80);
  const pesan = cleanText(o.pesan, 300);
  if (nama.length === 0 || pesan.length === 0) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_PAYLOAD", message: "nama dan pesan wajib diisi" } },
      { status: 400 },
    );
  }

  const url = scriptUrl();
  if (!url) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_CONFIGURED", message: "Wishes backend belum terpasang" } },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "wish", timestamp: new Date().toISOString(), nama, pesan }),
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: { code: "UPSTREAM_ERROR", message: `Upstream ${res.status}` } },
        { status: 502 },
      );
    }
    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Upstream unreachable" } },
      { status: 502 },
    );
  }
}
