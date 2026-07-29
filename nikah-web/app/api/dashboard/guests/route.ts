/**
 * Guest collection — GET the list, POST a new guest. Session-guarded.
 *
 * Envelope: `{ success, data?, error?, meta? }`.
 * Codes: 200 ok · 201 created · 400 invalid · 401 no session · 409 slug taken ·
 *        500 db error · 503 unwired.
 */
import { NextResponse } from "next/server";
import { hasDashboardSession } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabaseAdmin";
import { GuestError, createGuest, listGuests, validateGuestInput } from "@/lib/guests";
import { fromGuestError, invalidJson, notConfigured, unauthorized } from "@/lib/dashboardApi";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  if (!(await hasDashboardSession())) return unauthorized();
  if (!supabaseConfigured()) return notConfigured();

  try {
    const guests = await listGuests();
    return NextResponse.json({ success: true, data: { guests }, meta: { count: guests.length } });
  } catch (error) {
    if (error instanceof GuestError) return fromGuestError(error);
    throw error;
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  if (!(await hasDashboardSession())) return unauthorized();
  if (!supabaseConfigured()) return notConfigured();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return invalidJson();
  }

  try {
    const guest = await createGuest(validateGuestInput(body));
    return NextResponse.json({ success: true, data: { guest } }, { status: 201 });
  } catch (error) {
    if (error instanceof GuestError) return fromGuestError(error);
    throw error;
  }
}
