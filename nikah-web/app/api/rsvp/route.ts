/**
 * RSVP endpoint — validates and forwards to the Google Apps Script Web App
 * (`APPS_SCRIPT_URL`, server-only). Contract per REF-03:
 *
 *   accepts `{ slug?, nama, kehadiran, jumlah, catatan?, website }`
 *   honeypot `website` non-empty → 200 success without forwarding
 *   forwards `{ type: "rsvp", …fields, userAgent, timestamp }`
 *
 * Envelope: `{ success, data?, error?, meta? }`.
 * Codes: 200 ok · 400 invalid · 429 rate limited · 502 upstream · 503 unwired.
 */
import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rateLimit";

const ATTENDANCE = ["Hadir", "Tidak Hadir", "Masih Diusahakan"] as const;
type Attendance = (typeof ATTENDANCE)[number];

type RsvpPayload = {
  slug: string;
  nama: string;
  kehadiran: Attendance;
  jumlah: number;
  catatan: string;
};

const cleanText = (v: unknown, max: number): string =>
  typeof v === "string"
    ? v
        .replace(/[\u0000-\u001F\u007F]/g, " ")
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, max)
    : "";

const validate = (raw: unknown): RsvpPayload | null => {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const nama = cleanText(r.nama, 80);
  const kehadiran = ATTENDANCE.find((a) => a === r.kehadiran);
  if (nama.length === 0 || !kehadiran) return null;
  const jumlahRaw = typeof r.jumlah === "number" && Number.isInteger(r.jumlah) ? r.jumlah : 1;
  return {
    slug: cleanText(r.slug, 120),
    nama,
    kehadiran,
    jumlah: Math.min(4, Math.max(1, jumlahRaw)),
    catatan: cleanText(r.catatan, 300),
  };
};

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

  // Honeypot: bots fill `website`; accept quietly and drop.
  const website = (body as Record<string, unknown> | null)?.website;
  if (typeof website === "string" && website.length > 0) {
    return NextResponse.json({ success: true, data: null });
  }

  const validated = validate(body);
  if (!validated) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "INVALID_PAYLOAD", message: "nama dan kehadiran wajib diisi" },
      },
      { status: 400 },
    );
  }

  const url = process.env.APPS_SCRIPT_URL ?? "";
  if (!url) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_CONFIGURED", message: "RSVP backend belum terpasang" },
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "rsvp",
        timestamp: new Date().toISOString(),
        userAgent: req.headers.get("user-agent") ?? "",
        ...validated,
      }),
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
