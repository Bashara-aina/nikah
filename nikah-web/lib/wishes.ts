import "server-only";

import type { WishRow } from "./db.types";
import { supabaseAdmin } from "./supabaseAdmin";

export class WishError extends Error {
  constructor(
    readonly code: "NOT_FOUND" | "DB_ERROR",
    message: string,
  ) {
    super(message);
    this.name = "WishError";
  }
}

export const listWishesForDashboard = async (): Promise<WishRow[]> => {
  const { data, error } = await supabaseAdmin()
    .from("wishes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new WishError("DB_ERROR", error.message);
  return data ?? [];
};

export const setWishHidden = async (id: string, hidden: boolean): Promise<WishRow> => {
  const { data, error } = await supabaseAdmin()
    .from("wishes")
    .update({ hidden })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new WishError("DB_ERROR", error.message);
  if (!data) throw new WishError("NOT_FOUND", "Ucapan tidak ditemukan.");
  return data;
};
