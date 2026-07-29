/**
 * Single guest — PATCH to edit or to flip the "sudah diundang" checkbox,
 * DELETE to remove. Session-guarded.
 *
 * PATCH accepts either a full guest body, or `{ invited: boolean }` on its own,
 * which is the one-tap checkbox in the list.
 *
 * Envelope: `{ success, data?, error?, meta? }`.
 * Codes: 200 ok · 400 invalid · 401 no session · 404 unknown id ·
 *        409 slug taken · 500 db error · 503 unwired.
 */
import { NextResponse } from "next/server";
import { hasDashboardSession } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabaseAdmin";
import {
  GuestError,
  deleteGuest,
  setInvited,
  updateGuest,
  validateGuestInput,
} from "@/lib/guests";
import { fromGuestError, invalidJson, notConfigured, unauthorized } from "@/lib/dashboardApi";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx): Promise<NextResponse> {
  if (!(await hasDashboardSession())) return unauthorized();
  if (!supabaseConfigured()) return notConfigured();

  const { id } = await ctx.params;
  if (!UUID.test(id)) return fromGuestError(new GuestError("NOT_FOUND", "Tamu tidak ditemukan."));

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return invalidJson();
  }

  const raw = (body ?? {}) as Record<string, unknown>;

  try {
    // Checkbox-only payload: nothing else about the guest changes.
    if (typeof raw.invited === "boolean" && Object.keys(raw).length === 1) {
      const guest = await setInvited(id, raw.invited);
      return NextResponse.json({ success: true, data: { guest } });
    }

    const guest = await updateGuest(id, validateGuestInput(raw));
    return NextResponse.json({ success: true, data: { guest } });
  } catch (error) {
    if (error instanceof GuestError) return fromGuestError(error);
    throw error;
  }
}

export async function DELETE(_req: Request, ctx: Ctx): Promise<NextResponse> {
  if (!(await hasDashboardSession())) return unauthorized();
  if (!supabaseConfigured()) return notConfigured();

  const { id } = await ctx.params;
  if (!UUID.test(id)) return fromGuestError(new GuestError("NOT_FOUND", "Tamu tidak ditemukan."));

  try {
    await deleteGuest(id);
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    if (error instanceof GuestError) return fromGuestError(error);
    throw error;
  }
}
