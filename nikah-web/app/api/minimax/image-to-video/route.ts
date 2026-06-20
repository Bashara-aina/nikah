/**
 * /api/minimax/image-to-video — POST (create) and GET (poll)
 * (NIKAH-MASTER-TECHSTACK.md §1, §7).
 *
 * The MiniMax image-to-video endpoint is asynchronous:
 *   POST  /v1/video_generation    → { task_id }
 *   GET   /v1/query/video_generation?task_id=…  → { status, file_id, video_url? }
 *
 * We mirror that two-step shape on this route. Caller is expected to poll
 * until status is "Success" (and download via the File API using `file_id`).
 * Admin-gated with MINIMAX_ADMIN_TOKEN, rate-limited per IP.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import type {
  MinimaxVideoCreateRequest,
  MinimaxVideoCreateResponse,
  MinimaxVideoQueryResponse,
} from "@/lib/types";

export const runtime = "nodejs";

const RATE_POST = { max: 10, windowMs: 60_000 };
const RATE_GET = { max: 60, windowMs: 60_000 };

const CreateSchema = z.object({
  model: z.enum([
    "MiniMax-Hailuo-2.3",
    "MiniMax-Hailuo-2.3-Fast",
    "MiniMax-Hailuo-02",
    "I2V-01-Director",
    "I2V-01-live",
    "I2V-01",
  ]),
  first_frame_image: z.string().url().max(2000),
  prompt: z.string().min(1).max(4000),
  prompt_optimizer: z.boolean().optional(),
  duration: z.union([z.literal(6), z.literal(10)]).optional(),
  resolution: z.enum(["512P", "720P", "768P", "1080P"]).optional(),
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
  const rl = rateLimit(ip, "minimax:video:post", RATE_POST);
  if (!rl.allowed) return err("rate_limited", 429);

  const upstreamKey = process.env.MINIMAX_API_KEY ?? bearerFrom(req);
  if (!upstreamKey) return err("unauthorized", 401);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("invalid_json", 400);
  }

  const parsed = CreateSchema.safeParse(body);
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

  const payload: MinimaxVideoCreateRequest = parsed.data;
  const upstream = await createVideoTaskWith(payload, upstreamKey);
  if (!upstream.ok) {
    const status =
      upstream.error === "upstream_timeout"
        ? 504
        : upstream.error === "upstream_429"
          ? 429
          : 502;
    return err(upstream.error, status);
  }
  return NextResponse.json({
    ok: true,
    data: upstream.data satisfies MinimaxVideoCreateResponse,
  });
}

export async function GET(req: Request): Promise<NextResponse> {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, "minimax:video:get", RATE_GET);
  if (!rl.allowed) return err("rate_limited", 429);

  const upstreamKey = process.env.MINIMAX_API_KEY ?? bearerFrom(req);
  if (!upstreamKey) return err("unauthorized", 401);

  const taskId = new URL(req.url).searchParams.get("task_id");
  if (!taskId) return err("missing_task_id", 400);

  const upstream = await queryVideoTaskWith(taskId, upstreamKey);
  if (!upstream.ok) {
    const status =
      upstream.error === "upstream_timeout"
        ? 504
        : upstream.error === "upstream_429"
          ? 429
          : 502;
    return err(upstream.error, status);
  }
  return NextResponse.json({
    ok: true,
    data: upstream.data satisfies MinimaxVideoQueryResponse,
  });
}

async function createVideoTaskWith(
  payload: MinimaxVideoCreateRequest,
  apiKey: string,
): Promise<
  | { ok: true; data: MinimaxVideoCreateResponse }
  | { ok: false; error: string }
> {
  const endpoint =
    process.env.MINIMAX_VIDEO_ENDPOINT ??
    "https://api.minimaxi.chat/v1/video_generation";
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
      | MinimaxVideoCreateResponse
      | null;
    if (!json || typeof json.task_id !== "string") {
      return { ok: false, error: "upstream_parse" };
    }
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

async function queryVideoTaskWith(
  taskId: string,
  apiKey: string,
): Promise<
  | { ok: true; data: MinimaxVideoQueryResponse }
  | { ok: false; error: string }
> {
  if (!taskId || taskId.length > 200) {
    return { ok: false, error: "invalid_task_id" };
  }
  const base =
    process.env.MINIMAX_VIDEO_QUERY_ENDPOINT ??
    "https://api.minimaxi.chat/v1/query/video_generation";
  const url = `${base}?task_id=${encodeURIComponent(taskId)}`;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 10_000);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: ac.signal,
    });
    if (!res.ok) return { ok: false, error: `upstream_${res.status}` };
    const json = (await res.json().catch(() => null)) as
      | MinimaxVideoQueryResponse
      | null;
    if (!json || typeof json.status !== "string") {
      return { ok: false, error: "upstream_parse" };
    }
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
