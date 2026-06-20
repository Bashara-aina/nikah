/**
 * RSVP endpoint — POST handler that forwards guest RSVP to the Google Apps
 * Script Web App configured via `APPS_SCRIPT_URL`.
 *
 * Response shape: `{ success, data?, error?, meta? }` (project rule: api
 * response consistency).
 *
 * Status codes:
 *   200 — success
 *   400 — invalid payload
 *   503 — `APPS_SCRIPT_URL` not configured (deferred until Apps Script ships)
 */
import { NextResponse } from "next/server";

type RsvpPayload = {
  guest?: unknown;
  name?: unknown;
  attendance?: unknown;
  partySize?: unknown;
  message?: unknown;
};

const isString = (v: unknown): v is string => typeof v === "string" && v.length > 0;
const isInt = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v);

const validate = (raw: unknown): RsvpPayload | null => {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const name = isString(r.name) ? r.name : null;
  const attendance = isString(r.attendance) ? r.attendance : null;
  if (!name || !attendance) return null;
  const partySize = isInt(r.partySize) ? r.partySize : 1;
  return {
    name,
    attendance,
    partySize,
    ...(isString(r.guest) ? { guest: r.guest } : {}),
    ...(isString(r.message) ? { message: r.message } : {}),
  };
};

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_JSON", message: "Body must be JSON" } },
      { status: 400 },
    );
  }

  const validated = validate(body);
  if (!validated) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "INVALID_PAYLOAD", message: "name and attendance are required" },
      },
      { status: 400 },
    );
  }

  const url = process.env.APPS_SCRIPT_URL ?? "";
  if (!url) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "APPS_SCRIPT_URL_NOT_CONFIGURED", message: "RSVP backend not yet wired" },
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp: new Date().toISOString(), ...validated }),
      // Server-to-server: no need to forward cookies.
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UPSTREAM_ERROR",
            message: `Apps Script responded ${res.status}`,
          },
        },
        { status: 502 },
      );
    }
    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_FAILED",
          message: err instanceof Error ? err.message : "Unknown upstream failure",
        },
      },
      { status: 502 },
    );
  }
}