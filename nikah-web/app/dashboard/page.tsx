import type { Metadata } from "next";
import { hasDashboardSession, dashboardConfigured } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabaseAdmin";
import { listGuests } from "@/lib/guests";
import { LoginForm } from "./LoginForm";
import { GuestDashboard } from "./GuestDashboard";

/**
 * The couple's dashboard. Guarded by the shared passphrase — the guest list
 * holds ~200 phone numbers, so the page renders nothing but the sign-in form
 * until the session cookie checks out.
 *
 * The whole site is already `noindex` (see `app/layout.tsx`).
 */
export const metadata: Metadata = { title: "Dashboard Tamu" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await hasDashboardSession())) {
    return <LoginForm configured={dashboardConfigured()} />;
  }

  if (!supabaseConfigured()) {
    return (
      <main className="mx-auto flex min-h-[100svh] max-w-sm flex-col justify-center px-8 text-center">
        <h1 className="type-display">Belum tersambung</h1>
        <p className="type-body mt-4">
          Isi <code className="font-sans text-sm">SUPABASE_URL</code> dan{" "}
          <code className="font-sans text-sm">SUPABASE_SECRET_KEY</code> di environment, lalu
          jalankan migrasi <code className="font-sans text-sm">supabase/migrations/0001_guests.sql</code>{" "}
          di SQL Editor.
        </p>
      </main>
    );
  }

  const guests = await listGuests();
  return <GuestDashboard initialGuests={guests} />;
}
