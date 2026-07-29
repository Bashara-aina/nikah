import { NextResponse } from "next/server";
import { hasDashboardSession } from "@/lib/auth";
import { notConfigured, unauthorized } from "@/lib/dashboardApi";
import { supabaseConfigured } from "@/lib/supabaseAdmin";
import { WishError, listWishesForDashboard } from "@/lib/wishes";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  if (!(await hasDashboardSession())) return unauthorized();
  if (!supabaseConfigured()) return notConfigured();

  try {
    const wishes = await listWishesForDashboard();
    return NextResponse.json({ success: true, data: { wishes }, meta: { count: wishes.length } });
  } catch (error) {
    if (error instanceof WishError) {
      console.error(`Dashboard wishes read failed: ${error.message}`);
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: "Ucapan belum bisa dimuat" } },
        { status: 500 },
      );
    }
    throw error;
  }
}
