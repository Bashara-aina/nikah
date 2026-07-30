"use client";

/**
 * Dashboard sign-in. One shared passphrase, checked server-side — the value
 * typed here is posted once and never stored in the browser.
 */
import { useState, type FormEvent } from "react";

export const LoginForm = ({ configured }: { configured: boolean }) => {
  const [passphrase, setPassphrase] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending" || passphrase.length === 0) return;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/dashboard/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });
      const body = (await res.json()) as { success: boolean; error?: { message?: string } };
      if (body.success) {
        window.location.reload();
        return;
      }
      setStatus("error");
      setMessage(body.error?.message ?? "Tidak bisa masuk. Coba lagi.");
    } catch {
      setStatus("error");
      setMessage("Jaringannya sedang tersendat. Coba sekali lagi.");
    }
  };

  const canSubmit = passphrase.length > 0 && status !== "sending";

  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-sm flex-col justify-center px-8">
      <div className="rounded-3xl border border-border bg-surface/70 p-6 shadow-petal">
        <h1 className="type-display text-center">Dashboard Tamu</h1>
        <p className="type-meta mt-3 text-center">
          Hanya untuk Hanifah &amp; Bashara. Masuk dengan kata sandi bersama.
        </p>

        {configured ? (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
            <label className="type-label" htmlFor="passphrase">
              Kata sandi
            </label>
            <div className="relative">
              <input
                id="passphrase"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={passphrase}
                onChange={(e) => {
                  setPassphrase(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className="min-h-[48px] w-full rounded-2xl border border-border bg-paper px-4 pr-24 font-sans text-base text-ink outline-none transition-colors focus:border-dusty/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="type-button absolute right-2 top-1/2 min-h-[40px] -translate-y-1/2 rounded-full px-3 text-ink-soft"
                aria-pressed={showPassword}
              >
                {showPassword ? "Sembunyi" : "Tampil"}
              </button>
            </div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="type-button min-h-[48px] rounded-full bg-ink px-8 text-paper disabled:opacity-50"
            >
              {status === "sending" ? "Sebentar…" : "Masuk"}
            </button>
            <p aria-live="polite" className="type-body min-h-[1.5rem] text-center text-alert">
              {status === "error" ? message : ""}
            </p>
          </form>
        ) : (
          <p className="type-body mt-8 rounded-2xl border border-border bg-paper p-5 text-center">
            <code className="font-sans text-sm">DASHBOARD_PASSPHRASE</code> belum diatur di
            environment. Isi dulu di <code className="font-sans text-sm">.env</code> atau di
            Vercel, lalu muat ulang halaman ini.
          </p>
        )}
      </div>
    </main>
  );
};
