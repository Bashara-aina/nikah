import { NextResponse } from "next/server";
import { GuestError, confirmOpen, isValidSlug } from "@/lib/guests";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { supabaseConfigured } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse> {
  if (rateLimited("confirmed-open", clientIp(req))) {
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

  const slug =
    typeof body === "object" && body !== null && typeof (body as Record<string, unknown>).slug === "string"
      ? ((body as Record<string, unknown>).slug as string).trim().toLowerCase()
      : "";
  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_PAYLOAD", message: "Slug tidak valid" } },
      { status: 400 },
    );
  }
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_CONFIGURED", message: "Backend belum terpasang" } },
      { status: 503 },
    );
  }

  try {
    await confirmOpen(slug);
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    if (error instanceof GuestError) {
      console.error(`Confirmed open failed for "${slug}": ${error.message}`);
      return NextResponse.json(
        { success: false, error: { code: "WRITE_FAILED", message: "Kunjungan belum tercatat" } },
        { status: 500 },
      );
    }
    throw error;
  }
}
