import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { success: false, data: { ok: false, reason: "not_configured" } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Deliberately a body-returning query, not `head: true`. PostgREST answers a
  // head-count against a table that does not exist with 204, no error and a
  // null count, so a head-based probe reports a healthy database on a project
  // where the migrations were never run — the one situation this endpoint
  // exists to catch. Asking for rows surfaces the schema-cache error instead.
  const { data, error, count } = await supabaseAdmin()
    .from("guests")
    .select("id", { count: "exact" })
    .limit(1);
  if (error || data === null) {
    console.error(`Health check failed: ${error?.message ?? "no rows payload"}`);
    return NextResponse.json(
      { success: false, data: { ok: false, reason: "db_error" } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { success: true, data: { ok: true, guests: count ?? 0 } },
    { headers: { "Cache-Control": "no-store" } },
  );
}
