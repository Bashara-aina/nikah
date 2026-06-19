/**
 * Server-side Apps Script proxy (SPEC 03 §3).
 * Sends action= payload + shared token with timeout + single retry on 5xx.
 * Never exposes the URL or token to the client.
 */

interface AppsScriptResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

const DEFAULT_TIMEOUT_MS = 5000;
const MAX_RETRIES = 1;

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

export function isAppsScriptConfigured(): boolean {
  return Boolean(getEnv("APPS_SCRIPT_URL"));
}

async function postOnce<T>(
  url: string,
  token: string,
  payload: Record<string, unknown>,
  timeoutMs: number,
): Promise<AppsScriptResponse<T>> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
    if (!res.ok) {
      return { ok: false, error: `upstream_${res.status}` };
    }
    const json = (await res.json().catch(() => null)) as
      | AppsScriptResponse<T>
      | null;
    if (!json) return { ok: false, error: "upstream_parse" };
    return json;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return { ok: false, error: "upstream_timeout" };
    }
    return { ok: false, error: "upstream_network" };
  } finally {
    clearTimeout(timer);
  }
}

export interface PostAppsScriptOptions {
  timeoutMs?: number;
}

export async function postAppsScript<T = unknown>(
  action: string,
  data: Record<string, unknown>,
  opts: PostAppsScriptOptions = {},
): Promise<AppsScriptResponse<T>> {
  const url = getEnv("APPS_SCRIPT_URL");
  const token = getEnv("APPS_SCRIPT_TOKEN") ?? "";
  if (!url) {
    return { ok: false, error: "not_configured" };
  }

  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const payload = { action, token, ...data };

  const first = await postOnce<T>(url, token, payload, timeoutMs);
  if (first.ok) return first;

  // Single retry on 5xx-ish upstream failures (not on timeout/network parse).
  const retriable =
    first.error === "upstream_502" ||
    first.error === "upstream_503" ||
    first.error === "upstream_504";
  if (retriable && MAX_RETRIES > 0) {
    return postOnce<T>(url, token, payload, timeoutMs);
  }
  return first;
}

export interface GetAppsScriptOptions {
  timeoutMs?: number;
}

export async function getAppsScript<T = unknown>(
  action: string,
  params: Record<string, string | number> = {},
  opts: GetAppsScriptOptions = {},
): Promise<AppsScriptResponse<T>> {
  const url = getEnv("APPS_SCRIPT_URL");
  const token = getEnv("APPS_SCRIPT_TOKEN") ?? "";
  if (!url) {
    return { ok: false, error: "not_configured" };
  }

  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const qs = new URLSearchParams({
    action,
    token,
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
  }).toString();

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(`${url}?${qs}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      signal: ac.signal,
    });
    if (!res.ok) return { ok: false, error: `upstream_${res.status}` };
    const json = (await res.json().catch(() => null)) as
      | AppsScriptResponse<T>
      | null;
    if (!json) return { ok: false, error: "upstream_parse" };
    return json;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return { ok: false, error: "upstream_timeout" };
    }
    return { ok: false, error: "upstream_network" };
  } finally {
    clearTimeout(timer);
  }
}
