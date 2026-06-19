/** Shared data types. Mirror lib/validation.ts (zod). */

export type Kehadiran = "hadir" | "tidak" | "diusahakan";

export interface RsvpInput {
  to?: string;
  nama: string;
  kehadiran: Kehadiran;
  jumlah: number;
  pesan?: string;
  hp?: string;
  t: number;
}

export interface WishInput {
  nama: string;
  pesan: string;
  hp?: string;
  t: number;
}

export interface Wish {
  nama: string;
  pesan: string;
  ts: number;
}

export interface Guest {
  nama: string;
  slug?: string;
  grup?: string;
}

/** API response envelope (SPEC 03 §2, SPEC 10 §consistency). */
export interface ApiOk<T> {
  ok: true;
  data?: T;
}
export interface ApiErr {
  ok: false;
  error: string;
  fields?: Record<string, string>;
}
export type ApiResponse<T = unknown> = ApiOk<T> | ApiErr;