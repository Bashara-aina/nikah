/**
 * /api/wishes — GET (list approved) and POST (submit) (SPEC 03).
 * Validates with zod, rate-limits, forwards to Apps Script.
 * Hides the upstream URL/token.
 */

import { NextResponse } from "next/server";
import { WishSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { getAppsScript, isAppsScriptConfigured, postAppsScript } from "@/lib/sheets";
import type { Wish } from "@/lib/types";

export const runtime = "nodejs";

const RATE_POST = { max: 10, windowMs: 60_000 };
const RATE_GET = { max: 30, windowMs: 60_000 };

function err(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request): Promise<NextResponse> {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, "wishes:post", RATE_POST);
  if (!rl.allowed) {
    return err("rate_limited", 429);
  }

  if (!isAppsScriptConfigured()) {
    return err("backend_not_configured", 503);
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

  const parsed = WishSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      if (!fields[key]) fields[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: "validation", fields },
      { status: 400 },
    );
  }

  const { hp: _hp, t: _t, ...rest } = parsed.data;
  void _hp;
  void _t;

  const upstream = await postAppsScript<{ item?: Wish }>("wish", {
    ...rest,
  });
  if (!upstream.ok) {
    return err("upstream", 502);
  }
  return NextResponse.json({
    ok: true,
    item: upstream.data?.item ?? {
      nama: rest.nama,
      pesan: rest.pesan,
      ts: Date.now(),
    },
  });
}

export async function GET(req: Request): Promise<NextResponse> {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, "wishes:get", RATE_GET);
  if (!rl.allowed) {
    return err("rate_limited", 429);
  }

  if (!isAppsScriptConfigured()) {
    return err("backend_not_configured", 503);
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    Math.max(1, Number(searchParams.get("limit") ?? 50) || 50),
    100,
  );

  const upstream = await getAppsScript<{ items?: Wish[] }>("wishes", { limit });
  if (!upstream.ok) {
    return err("upstream", 502);
  }
  return NextResponse.json({
    ok: true,
    items: upstream.data?.items ?? [],
  });
}
