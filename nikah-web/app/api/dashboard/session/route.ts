/**
 * Dashboard session — POST to sign in with the shared passphrase, DELETE to
 * sign out. The passphrase itself never leaves the server; the cookie carries
 * only a signed expiry.
 *
 * Envelope: `{ success, data?, error?, meta? }`.
 * Codes: 200 ok · 400 invalid · 401 wrong passphrase · 429 rate limited · 503 unwired.
 */
import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { SESSION_COOKIE, dashboardConfigured, issueSession, passphraseMatches } from "@/lib/auth";

export async function POST(req: Request): Promise<NextResponse> {
  // Rate limiting is the only thing between a single shared passphrase and a
  // brute-force attempt, so it guards this route before anything else.
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { success: false, error: { code: "RATE_LIMITED", message: "Terlalu banyak percobaan" } },
      { status: 429 },
    );
  }

  if (!dashboardConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_CONFIGURED", message: "DASHBOARD_PASSPHRASE belum diatur" },
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_JSON", message: "Body must be JSON" } },
      { status: 400 },
    );
  }

  const passphrase = (body as Record<string, unknown> | null)?.passphrase;
  if (typeof passphrase !== "string" || passphrase.length === 0) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_PAYLOAD", message: "Kata sandi wajib diisi" } },
      { status: 400 },
    );
  }

  if (!passphraseMatches(passphrase)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Kata sandi salah" } },
      { status: 401 },
    );
  }

  const session = issueSession();
  const res = NextResponse.json({ success: true, data: null });
  res.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });
  return res;
}

export async function DELETE(): Promise<NextResponse> {
  const res = NextResponse.json({ success: true, data: null });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
