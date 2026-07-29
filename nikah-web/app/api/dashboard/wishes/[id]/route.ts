import { NextResponse } from "next/server";
import { hasDashboardSession } from "@/lib/auth";
import { invalidJson, notConfigured, unauthorized } from "@/lib/dashboardApi";
import { supabaseConfigured } from "@/lib/supabaseAdmin";
import { WishError, setWishHidden } from "@/lib/wishes";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type Context = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: Context): Promise<NextResponse> {
  if (!(await hasDashboardSession())) return unauthorized();
  if (!supabaseConfigured()) return notConfigured();

  const { id } = await context.params;
  if (!UUID.test(id)) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Ucapan tidak ditemukan" } },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return invalidJson();
  }

  const hidden =
    typeof body === "object" && body !== null ? (body as Record<string, unknown>).hidden : undefined;
  if (typeof hidden !== "boolean" || Object.keys(body as Record<string, unknown>).length !== 1) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_PAYLOAD", message: "Status ucapan tidak valid" } },
      { status: 400 },
    );
  }

  try {
    const wish = await setWishHidden(id, hidden);
    return NextResponse.json({ success: true, data: { wish } });
  } catch (error) {
    if (error instanceof WishError) {
      const status = error.code === "NOT_FOUND" ? 404 : 500;
      if (status === 500) console.error(`Dashboard wish update failed: ${error.message}`);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: status === 404 ? error.message : "Ucapan belum bisa diperbarui",
          },
        },
        { status },
      );
    }
    throw error;
  }
}
