/**
 * Shared envelope responses for the dashboard API routes.
 *
 * Lives here rather than in a route file because Next only allows HTTP method
 * handlers and route config to be exported from `route.ts`.
 */
import { NextResponse } from "next/server";
import { GuestError } from "./guests";

export const unauthorized = (): NextResponse =>
  NextResponse.json(
    { success: false, error: { code: "UNAUTHORIZED", message: "Sesi berakhir. Masuk lagi, ya." } },
    { status: 401 },
  );

export const notConfigured = (): NextResponse =>
  NextResponse.json(
    { success: false, error: { code: "NOT_CONFIGURED", message: "Supabase belum terpasang" } },
    { status: 503 },
  );

export const invalidJson = (): NextResponse =>
  NextResponse.json(
    { success: false, error: { code: "INVALID_JSON", message: "Body must be JSON" } },
    { status: 400 },
  );

/** Maps a typed guest error onto the right status code. */
export const fromGuestError = (error: GuestError): NextResponse => {
  const status =
    error.code === "INVALID_INPUT"
      ? 400
      : error.code === "SLUG_TAKEN"
        ? 409
        : error.code === "NOT_FOUND"
          ? 404
          : 500;
  if (status === 500) console.error(`Guest DB error: ${error.message}`);
  return NextResponse.json(
    { success: false, error: { code: error.code, message: error.message } },
    { status },
  );
};
