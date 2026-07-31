/**
 * RSVP replies for the dashboard. Session-guarded, read-only — replies are
 * written by the public `/api/rsvp` route and are never edited from here.
 *
 * Envelope: `{ success, data?, error?, meta? }`.
 * Codes: 200 ok · 401 no session · 500 db error · 503 unwired.
 */
import { NextResponse } from "next/server";
import { hasDashboardSession } from "@/lib/auth";
import { notConfigured, unauthorized } from "@/lib/dashboardApi";
import { supabaseConfigured } from "@/lib/supabaseAdmin";
import { RsvpError, listRsvpsForDashboard } from "@/lib/rsvps";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  if (!(await hasDashboardSession())) return unauthorized();
  if (!supabaseConfigured()) return notConfigured();

  try {
    const rsvps = await listRsvpsForDashboard();
    return NextResponse.json({ success: true, data: { rsvps }, meta: { count: rsvps.length } });
  } catch (error) {
    if (error instanceof RsvpError) {
      console.error(`Dashboard RSVP read failed: ${error.message}`);
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: "RSVP belum bisa dimuat" } },
        { status: 500 },
      );
    }
    throw error;
  }
}
