/** Zod schemas — shared client + server (SPEC 04 §3). */

import { z } from "zod";

export const KehadiranSchema = z.enum(["hadir", "tidak", "diusahakan"]);

export const RsvpSchema = z
  .object({
    to: z.string().max(120).optional(),
    nama: z.string().trim().min(2).max(80),
    kehadiran: KehadiranSchema,
    jumlah: z.coerce.number().int().min(1).max(4),
    pesan: z.string().max(500).optional().default(""),
    hp: z.string().max(0).optional(), // honeypot must be empty
    t: z.number(),
  })
  .refine((v) => v.kehadiran !== "hadir" || v.jumlah >= 1, {
    path: ["jumlah"],
    message: "Wajib jika hadir",
  });

export const WishSchema = z.object({
  nama: z.string().trim().min(2).max(60),
  pesan: z.string().trim().min(1).max(300),
  hp: z.string().max(0).optional(),
  t: z.number(),
});

export type RsvpSchemaIn = z.infer<typeof RsvpSchema>;
export type WishSchemaIn = z.infer<typeof WishSchema>;