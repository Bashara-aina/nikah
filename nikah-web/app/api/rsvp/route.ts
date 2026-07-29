/**
 * RSVP endpoint — writes to Supabase.
 *
 *   accepts `{ slug?, nama, kehadiran, jumlah, catatan?, website }`
 *   honeypot `website` non-empty → 200 success without storing
 *   `slug` links the reply to a guest row, so the dashboard can show
 *   invited → opened → answered for that person
 *
 * Envelope: `{ success, data?, error?, meta? }`.
 * Codes: 200 ok · 400 invalid · 429 rate limited · 500 write failed · 503 unwired.
 */
import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabaseAdmin";
import { ATTENDANCE, type Attendance } from "@/lib/db.types";
import { isValidSlug } from "@/lib/guests";

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
    slug: cleanText(r.slug, 80).toLowerCase(),
    nama,
    kehadiran,
    jumlah: Math.min(10, Math.max(1, jumlahRaw)),
    catatan: cleanText(r.catatan, 300),
  };
};

export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse> {
  if (rateLimited("rsvp", clientIp(req))) {
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

  if (!supabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_CONFIGURED", message: "RSVP backend belum terpasang" } },
      { status: 503 },
    );
  }

  const db = supabaseAdmin();

  // An unknown slug still records the reply, just without the link — a guest
  // forwarding their link to a cousin should not lose that cousin's answer.
  let guestId: string | null = null;
  let partyMax = 4;
  if (isValidSlug(validated.slug)) {
    const { data, error } = await db
      .from("guests")
      .select("id, party_max")
      .eq("slug", validated.slug)
      .maybeSingle();
    if (error) {
      console.error(`RSVP guest lookup failed for "${validated.slug}": ${error.message}`);
    } else if (data) {
      guestId = data.id;
      partyMax = data.party_max;
    }
  }

  const { error } = await db.from("rsvps").insert({
    guest_id: guestId,
    nama: validated.nama,
    kehadiran: validated.kehadiran,
    jumlah: Math.min(validated.jumlah, partyMax),
    catatan: validated.catatan,
    user_agent: req.headers.get("user-agent"),
  });

  if (error) {
    console.error(`RSVP insert failed: ${error.message}`);
    return NextResponse.json(
      { success: false, error: { code: "WRITE_FAILED", message: "Konfirmasi gagal disimpan" } },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: null });
}
