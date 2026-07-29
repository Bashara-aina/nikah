import { NextResponse } from "next/server";
import {
  clearLoginFailures,
  clientIp,
  loginRateLimited,
  recordLoginFailure,
} from "@/lib/rateLimit";
import { SESSION_COOKIE, dashboardConfigured, issueSession, passphraseMatches } from "@/lib/auth";

export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" };

const unavailable = (): NextResponse =>
  NextResponse.json(
    {
      success: false,
      error: { code: "AUTH_UNAVAILABLE", message: "Login belum bisa diproses. Coba lagi nanti." },
    },
    { status: 503, headers: noStore },
  );

export async function POST(req: Request): Promise<NextResponse> {
  const ip = clientIp(req);

  try {
    if (await loginRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: "Terlalu banyak percobaan" } },
        { status: 429, headers: noStore },
      );
    }
  } catch (error) {
    console.error("Dashboard login limiter failed:", error);
    return unavailable();
  }

  if (!dashboardConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_CONFIGURED", message: "DASHBOARD_PASSPHRASE belum diatur" },
      },
      { status: 503, headers: noStore },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_JSON", message: "Body must be JSON" } },
      { status: 400, headers: noStore },
    );
  }

  const passphrase = (body as Record<string, unknown> | null)?.passphrase;
  if (typeof passphrase !== "string" || passphrase.length === 0) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_PAYLOAD", message: "Kata sandi wajib diisi" } },
      { status: 400, headers: noStore },
    );
  }

  if (!passphraseMatches(passphrase)) {
    try {
      await recordLoginFailure(ip);
    } catch (error) {
      console.error("Dashboard login failure could not be recorded:", error);
      return unavailable();
    }
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Kata sandi salah" } },
      { status: 401, headers: noStore },
    );
  }

  try {
    await clearLoginFailures(ip);
  } catch (error) {
    console.error("Dashboard login failures could not be cleared:", error);
    return unavailable();
  }

  const session = issueSession();
  const response = NextResponse.json({ success: true, data: null }, { headers: noStore });
  response.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true, data: null }, { headers: noStore });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
