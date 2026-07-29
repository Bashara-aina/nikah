import type { Metadata } from "next";
import type { ReactNode } from "react";
import { hasDashboardSession, dashboardConfigured } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabaseAdmin";
import { listGuests, type GuestWithRsvp } from "@/lib/guests";
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

/** Any dead end here gets an explanation and a next step, never a 500 page. */
const Notice = ({ heading, children }: { heading: string; children: ReactNode }) => (
  <main className="mx-auto flex min-h-[100svh] max-w-sm flex-col justify-center px-8 text-center">
    <h1 className="type-display">{heading}</h1>
    <p className="type-body mt-4">{children}</p>
  </main>
);

const Code = ({ children }: { children: ReactNode }) => (
  <code className="font-sans text-sm">{children}</code>
);

export default async function DashboardPage() {
  if (!(await hasDashboardSession())) {
    return <LoginForm configured={dashboardConfigured()} />;
  }

  if (!supabaseConfigured()) {
    return (
      <Notice heading="Belum tersambung">
        Isi <Code>SUPABASE_URL</Code> dan <Code>SUPABASE_SECRET_KEY</Code> di environment, lalu
        jalankan migrasi di <Code>supabase/migrations/</Code>.
      </Notice>
    );
  }

  // The env vars can be present while the tables are not — that is exactly the
  // state a project sits in before the migrations are run. Say so instead of
  // throwing a 500 whose stack trace nobody can act on.
  let guests: GuestWithRsvp[];
  try {
    guests = await listGuests();
  } catch (error) {
    console.error("Dashboard guest list failed:", error);
    return (
      <Notice heading="Database belum siap">
        Supabase menjawab, tapi tabelnya belum ada. Jalankan berurutan{" "}
        <Code>0001_guests.sql</Code>, <Code>0002_tracking_and_dedupe.sql</Code>, dan{" "}
        <Code>0003_delivery_metadata.sql</Code> dari <Code>supabase/migrations/</Code> di SQL
        Editor, lalu muat ulang halaman ini.
      </Notice>
    );
  }

  return <GuestDashboard initialGuests={guests} />;
}
