/**
 * POST /api/rsvp — proxy to Apps Script (SPEC 03).
 * Validates with zod, rate-limits, forwards with shared token.
 * Never exposes APPS_SCRIPT_URL/APPS_SCRIPT_TOKEN to the client.
 */

import { NextResponse } from "next/server";
import { RsvpSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { isAppsScriptConfigured, postAppsScript } from "@/lib/sheets";

export const runtime = "nodejs";

const RATE = { max: 10, windowMs: 60_000 };

function err(error: string, status: number, fields?: Record<string, string>) {
  return NextResponse.json(
    { ok: false, error, ...(fields ? { fields } : {}) },
    { status },
  );
}

export async function POST(req: Request): Promise<NextResponse> {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, "rsvp", RATE);
  if (!rl.allowed) {
    return err("rate_limited", 429);
  }

  if (!isAppsScriptConfigured()) {
    return err(
      "backend_not_configured",
      503,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("invalid_json", 400);
  }

  // Honeypot: silently succeed.
  if (
    body !== null &&
    typeof body === "object" &&
    "hp" in body &&
    typeof (body as { hp?: unknown }).hp === "string" &&
    (body as { hp: string }).hp.length > 0
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = RsvpSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      if (!fields[key]) fields[key] = issue.message;
    }
    return err("validation", 400, fields);
  }

  const { hp: _hp, t: _t, ...rest } = parsed.data;
  void _hp;
  void _t;

  const upstream = await postAppsScript("rsvp", { ...rest });
  if (!upstream.ok) {
    return err("upstream", 502);
  }
  return NextResponse.json({ ok: true });
}
