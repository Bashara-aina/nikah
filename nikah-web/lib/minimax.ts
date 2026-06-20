/**
 * Server-side MiniMax proxy client (NIKAH-MASTER-TECHSTACK.md §7).
 * Forwards image-generation requests to the MiniMax API, hiding the key.
 * Single retry on 5xx, AbortController timeout, no key ever returned to client.
 */

import type {
  MinimaxImageRequest,
  MinimaxImageResponse,
} from "@/lib/types";

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 1;

const ENDPOINT =
  process.env.MINIMAX_ENDPOINT ?? "https://api.minimaxi.chat/v1/image_generation";
const VIDEO_ENDPOINT =
  process.env.MINIMAX_VIDEO_ENDPOINT ??
  "https://api.minimaxi.chat/v1/video_generation";
const VIDEO_QUERY_ENDPOINT =
  process.env.MINIMAX_VIDEO_QUERY_ENDPOINT ??
  "https://api.minimaxi.chat/v1/query/video_generation";

function getKey(): string | undefined {
  const v = process.env.MINIMAX_API_KEY;
  return v && v.length > 0 ? v : undefined;
}

function getGroupId(): string | undefined {
  const v = process.env.MINIMAX_GROUP_ID;
  return v && v.length > 0 ? v : undefined;
}

export function isMinimaxConfigured(): boolean {
  return Boolean(getKey());
}

interface UpstreamOk<T> {
  ok: true;
  data: T;
}
interface UpstreamErr {
  ok: false;
  error: string;
}
type UpstreamResult<T> = UpstreamOk<T> | UpstreamErr;

async function postOnce<T>(
  payload: MinimaxImageRequest,
  timeoutMs: number,
): Promise<UpstreamResult<T>> {
  const key = getKey();
  if (!key) return { ok: false, error: "not_configured" };

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
    if (!res.ok) return { ok: false, error: `upstream_${res.status}` };
    const json = (await res.json().catch(() => null)) as T | null;
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

export interface GenerateImageOptions {
  timeoutMs?: number;
}

export async function generateImage(
  payload: MinimaxImageRequest,
  opts: GenerateImageOptions = {},
): Promise<UpstreamResult<MinimaxImageResponse>> {
  if (!isMinimaxConfigured()) {
    return { ok: false, error: "not_configured" };
  }
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const first = await postOnce<MinimaxImageResponse>(payload, timeoutMs);
  if (first.ok) return first;

  const retriable =
    first.error === "upstream_502" ||
    first.error === "upstream_503" ||
    first.error === "upstream_504";
  if (retriable && MAX_RETRIES > 0) {
    return postOnce<MinimaxImageResponse>(payload, timeoutMs);
  }
  return first;
}

/** Style suffix appended to every story illustration prompt to keep the
 *  series visually consistent with `assets/scene/hero-main.webp`. */
export const STORY_STYLE_SUFFIX = [
  "flat illustration style, pastel storybook aesthetic",
  "soft watercolor-like colors, warm pastel palette",
  "(ivory, cream, blush pink, dusty rose, sage green)",
  "gentle outlines, charming and intimate, wedding storybook",
  "transparent background, PNG format",
  "consistent with existing wedding illustration series",
].join(", ");

/** Group id is sent as a request header per MiniMax convention. Re-exported
 *  so the route can include it without re-reading env directly. */
export function getMinimaxGroupId(): string | undefined {
  return getGroupId();
}

export interface CreateVideoOptions {
  timeoutMs?: number;
}

/** Step 1: create a video-generation task. Returns the `task_id` to poll. */
export async function createVideoTask(
  payload: import("@/lib/types").MinimaxVideoCreateRequest,
  opts: CreateVideoOptions = {},
): Promise<UpstreamResult<import("@/lib/types").MinimaxVideoCreateResponse>> {
  if (!isMinimaxConfigured()) return { ok: false, error: "not_configured" };
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(VIDEO_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getKey()}`,
      },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
    if (!res.ok) return { ok: false, error: `upstream_${res.status}` };
    const json = (await res.json().catch(() => null)) as
      | import("@/lib/types").MinimaxVideoCreateResponse
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

export interface QueryVideoOptions {
  timeoutMs?: number;
}

/** Step 2: poll the task until status is Success / Fail. */
export async function queryVideoTask(
  taskId: string,
  opts: QueryVideoOptions = {},
): Promise<UpstreamResult<import("@/lib/types").MinimaxVideoQueryResponse>> {
  if (!isMinimaxConfigured()) return { ok: false, error: "not_configured" };
  if (!taskId || taskId.length > 200) {
    return { ok: false, error: "invalid_task_id" };
  }
  const timeoutMs = opts.timeoutMs ?? 10_000;
  const url = `${VIDEO_QUERY_ENDPOINT}?task_id=${encodeURIComponent(taskId)}`;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${getKey()}` },
      signal: ac.signal,
    });
    if (!res.ok) return { ok: false, error: `upstream_${res.status}` };
    const json = (await res.json().catch(() => null)) as
      | import("@/lib/types").MinimaxVideoQueryResponse
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
