import { NextResponse } from "next/server";
import { hasDashboardSession } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { notConfigured, unauthorized } from "@/lib/dashboardApi";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TABLES = ["guests", "rsvps", "wishes"] as const;
type ExportTable = (typeof TABLES)[number];

const COLUMNS: Record<ExportTable, readonly string[]> = {
  guests: [
    "id",
    "slug",
    "display_name",
    "whatsapp_name",
    "phone",
    "guest_group",
    "invite_type",
    "party_label",
    "party_max",
    "message_override",
    "notes",
    "alternative_channel",
    "reminder_note",
    "invited_at",
    "attended_at",
    "souvenir_at",
    "opened_count",
    "opened_confirmed_count",
    "opened_confirmed_at",
    "opened_first_at",
    "opened_last_at",
    "created_at",
    "updated_at",
  ],
  rsvps: ["id", "guest_id", "nama", "kehadiran", "jumlah", "catatan", "user_agent", "created_at"],
  wishes: ["id", "guest_id", "nama", "pesan", "hidden", "created_at"],
};

const isExportTable = (value: string): value is ExportTable =>
  TABLES.some((table) => table === value);

export async function GET(req: Request): Promise<NextResponse | Response> {
  if (!(await hasDashboardSession())) return unauthorized();
  if (!supabaseConfigured()) return notConfigured();

  const table = new URL(req.url).searchParams.get("table") ?? "";
  if (!isExportTable(table)) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_INPUT", message: "Tabel tidak dikenal" } },
      { status: 400 },
    );
  }

  const db = supabaseAdmin();
  const result =
    table === "guests"
      ? await db.from("guests").select("*").order("created_at", { ascending: false })
      : table === "rsvps"
        ? await db.from("rsvps").select("*").order("created_at", { ascending: false })
        : await db.from("wishes").select("*").order("created_at", { ascending: false });

  if (result.error) {
    console.error(`Dashboard export failed for "${table}": ${result.error.message}`);
    return NextResponse.json(
      { success: false, error: { code: "DB_ERROR", message: "Data belum bisa diunduh" } },
      { status: 500 },
    );
  }

  const filename = `nikah-${table}-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(toCsv(result.data ?? [], COLUMNS[table]), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
