/**
 * /api/minimax — POST (generate image) (NIKAH-MASTER-TECHSTACK.md §7).
 * Validates the request with zod, rate-limits, and forwards to MiniMax.
 *
 * Auth: a non-empty `Authorization: Bearer <key>` header is required.
 * That key is the same MiniMax API key used against the vendor — the
 * MiniMax key is a full-permission token, so we don't layer a second
 * shared secret on top. The key is read server-side from the request
 * header and never echoed.
 *
 * If `MINIMAX_API_KEY` is set in the server env, that key is used as the
 * upstream credential and the client is not required to send one (useful
 * for first-party calls from the Next app itself). If the env var is
 * absent, the client MUST send the key as a bearer.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import {
  isMinimaxConfigured,
  getMinimaxGroupId,
} from "@/lib/minimax";
import type { MinimaxImageRequest } from "@/lib/types";

export const runtime = "nodejs";

const RATE_POST = { max: 20, windowMs: 60_000 };

const ImageGenSchema = z.object({
  model: z.literal("image-01"),
  prompt: z.string().min(1).max(4000),
  aspect_ratio: z.enum(["1:1", "4:3", "3:4", "16:9", "9:16"]),
  n: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  response_format: z.enum(["url", "b64_json"]),
});

function err(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

function bearerFrom(req: Request): string | undefined {
  const raw = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(req: Request): Promise<NextResponse> {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, "minimax:post", RATE_POST);
  if (!rl.allowed) {
    return err("rate_limited", 429);
  }

  const upstreamKey = process.env.MINIMAX_API_KEY ?? bearerFrom(req);
  if (!upstreamKey) {
    return err("unauthorized", 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("invalid_json", 400);
  }

  const parsed = ImageGenSchema.safeParse(body);
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

  const payload: MinimaxImageRequest = parsed.data;
  const upstream = await generateImageWith(payload, upstreamKey);

  if (!upstream.ok) {
    return err(upstream.error, upstream.error === "upstream_timeout" ? 504 : 502);
  }

  return NextResponse.json({
    ok: true,
    data: upstream.data,
    meta: {
      groupId: getMinimaxGroupId() ?? null,
      envConfigured: isMinimaxConfigured(),
    },
  });
}

/** Inline forwarder that uses the caller-supplied key. Kept local so we
 *  don't have to widen the lib/minimax.ts surface. */
async function generateImageWith(
  payload: MinimaxImageRequest,
  apiKey: string,
): Promise<
  | { ok: true; data: import("@/lib/types").MinimaxImageResponse }
  | { ok: false; error: string }
> {
  const endpoint =
    process.env.MINIMAX_ENDPOINT ??
    "https://api.minimaxi.chat/v1/image_generation";
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 30_000);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
    if (!res.ok) return { ok: false, error: `upstream_${res.status}` };
    const json = (await res.json().catch(() => null)) as
      | import("@/lib/types").MinimaxImageResponse
      | null;
    if (!json) return { ok: false, error: "upstream_parse" };
    return { ok: true, data: json };
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return { ok: false, error: "upstream_timeout" };
    }
    return { ok: false, error: "upstream_network" };
  } finally {
    clearTimeout(timer);
  }
}
