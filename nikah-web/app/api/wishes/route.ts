/**
 * Wishes endpoint — the public wall, stored in Supabase.
 *
 *   GET  → `{ wishes: [{ nama, pesan, timestamp }] }`, newest first;
 *          503 `NOT_CONFIGURED` until the env vars exist, so the UI can render
 *          an honest empty state.
 *   POST → validates `{ nama, pesan, slug?, website }`; honeypot drops quietly.
 *
 * Envelope: `{ success, data?, error?, meta? }`.
 */
import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabaseAdmin";
import { isValidSlug } from "@/lib/guests";

/** Enough to fill the wall without shipping an unbounded list to a phone. */
const WALL_LIMIT = 200;

const cleanText = (v: unknown, max: number): string =>
  typeof v === "string"
    ? v
        .replace(/[\u0000-\u001F\u007F]/g, " ")
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, max)
    : "";

const notConfigured = (): NextResponse =>
  NextResponse.json(
    { success: false, error: { code: "NOT_CONFIGURED", message: "Wishes backend belum terpasang" } },
    { status: 503 },
  );

export async function GET(): Promise<NextResponse> {
  if (!supabaseConfigured()) return notConfigured();

  const { data, error } = await supabaseAdmin()
    .from("wishes")
    .select("nama, pesan, created_at")
    .order("created_at", { ascending: false })
    .limit(WALL_LIMIT);

  if (error) {
    console.error(`Wishes read failed: ${error.message}`);
    return NextResponse.json(
      { success: false, error: { code: "READ_FAILED", message: "Ucapan belum bisa dimuat" } },
      { status: 500 },
    );
  }

  const wishes = (data ?? []).map((w) => ({
    nama: w.nama,
    pesan: w.pesan,
    timestamp: w.created_at,
  }));
  return NextResponse.json({ success: true, data: { wishes } });
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

  if (!supabaseConfigured()) return notConfigured();

  const db = supabaseAdmin();

  const slug = cleanText(o.slug, 80).toLowerCase();
  let guestId: string | null = null;
  if (isValidSlug(slug)) {
    const { data } = await db.from("guests").select("id").eq("slug", slug).maybeSingle();
    guestId = data?.id ?? null;
  }

  const { error } = await db.from("wishes").insert({ guest_id: guestId, nama, pesan });
  if (error) {
    console.error(`Wish insert failed: ${error.message}`);
    return NextResponse.json(
      { success: false, error: { code: "WRITE_FAILED", message: "Ucapan gagal disimpan" } },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: null });
}
