/**
 * Single guest — PATCH to edit or to flip a checklist checkbox,
 * DELETE to remove. Session-guarded.
 *
 * PATCH accepts either a full guest body, or a one-key checkbox payload:
 * `{ invited: boolean }`, `{ attended: boolean }`, or `{ souvenir: boolean }`.
 *
 * Envelope: `{ success, data?, error?, meta? }`.
 * Codes: 200 ok · 400 invalid · 401 no session · 404 unknown id ·
 *        409 slug taken · 500 db error · 503 unwired.
 */
import { NextResponse } from "next/server";
import { hasDashboardSession } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabaseAdmin";
import {
  GUEST_FLAGS,
  GuestError,
  deleteGuest,
  isGuestFlag,
  setGuestFlag,
  updateGuest,
  validateGuestInput,
} from "@/lib/guests";
import type { GuestFlag } from "@/lib/db.types";
import { fromGuestError, invalidJson, notConfigured, unauthorized } from "@/lib/dashboardApi";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Ctx = { params: Promise<{ id: string }> };

/** Checkbox-only body: exactly one known flag key, boolean value. */
const parseFlagPatch = (raw: Record<string, unknown>): { flag: GuestFlag; value: boolean } | null => {
  const keys = Object.keys(raw);
  if (keys.length !== 1) return null;
  const key = keys[0];
  if (!key || !isGuestFlag(key) || typeof raw[key] !== "boolean") return null;
  return { flag: key, value: raw[key] };
};

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
    const flagPatch = parseFlagPatch(raw);
    if (flagPatch) {
      const guest = await setGuestFlag(id, flagPatch.flag, flagPatch.value);
      return NextResponse.json({ success: true, data: { guest } });
    }

    // Reject ambiguous partials like `{ invited: true, slug: "…" }` so a typo
    // never silently ignores the checklist and runs a full update instead.
    const claimedFlag = GUEST_FLAGS.find((flag) => flag in raw);
    if (claimedFlag !== undefined) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: `Kirim hanya { ${claimedFlag}: true|false } untuk checklist.`,
          },
        },
        { status: 400 },
      );
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
