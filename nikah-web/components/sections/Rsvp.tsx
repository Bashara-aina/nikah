"use client";

/**
 * L9 — RSVP. Copy §7 verbatim; posts `{ slug, nama, kehadiran, jumlah,
 * catatan, website }` to /api/rsvp (REF-03 contract). Honeypot `website` stays
 * empty + visually hidden. Success = quiet petal burst; errors human-readable.
 */
import { useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/primitives/Reveal";
import { FloatInput, FloatTextarea, PetalBurst, PillRadioGroup } from "@/components/ui/fields";
import { copy } from "@/lib/copy";
import { siteConfig } from "@/lib/config";

type Attendance = (typeof copy.rsvp.fields.attendanceOptions)[number];
type Status = "idle" | "sending" | "success" | "error";

export const Rsvp = () => {
  const [nama, setNama] = useState("");
  const [kehadiran, setKehadiran] = useState<Attendance | null>(null);
  const [jumlah, setJumlah] = useState(2);
  const [catatan, setCatatan] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending" || status === "success") return;
    if (!nama.trim() || !kehadiran) {
      setStatus("error");
      setErrorMsg(copy.rsvp.errors.incomplete);
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const slug = new URLSearchParams(window.location.search).get("to") ?? "";
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          nama: nama.trim(),
          kehadiran,
          jumlah,
          catatan: catatan.trim(),
          website,
        }),
      });
      const body = (await res.json()) as { success: boolean; error?: { message?: string } };
      if (body.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(
          res.status === 503 ? copy.rsvp.errors.unavailable : copy.rsvp.errors.generic,
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg(copy.rsvp.errors.network);
    }
  };

  return (
    <section
      id="rsvp"
      aria-label={copy.a11y.rsvp}
      data-cv="auto"
      className="relative bg-paper px-7 pb-20 pt-16"
    >
      <Reveal className="text-center">
        <h2 className="type-display">{copy.rsvp.heading}</h2>
        <div aria-hidden className="mx-auto mt-4 h-px w-20 bg-gold/70" />
        <p className="type-lede mx-auto mt-6">{copy.rsvp.lead}</p>
        <p className="type-meta mx-auto mt-2">
          {copy.rsvp.deadlineTemplate}{" "}
          <strong className="font-medium text-ink">{copy.rsvp.deadlineDate}</strong>.
        </p>
      </Reveal>

      <Reveal className="relative mx-auto mt-10 max-w-sm">
        {/* Single floral accent for this practical section (plan 04 §8). */}
        <Image
          src="/assets/florals/rsvp-card-corner.webp"
          alt=""
          width={296}
          height={277}
          sizes="88px"
          className="pointer-events-none absolute -right-3 -top-8 h-auto w-[5.5rem]"
        />

        <form
          onSubmit={submit}
          className="relative flex flex-col gap-5 rounded-3xl border border-border bg-surface/80 p-6 shadow-card"
        >
          <FloatInput
            name="nama"
            label={copy.rsvp.fields.name}
            value={nama}
            onChange={setNama}
            required
            maxLength={80}
          />

          <PillRadioGroup
            legend={copy.rsvp.fields.attendance}
            name="kehadiran"
            options={copy.rsvp.fields.attendanceOptions}
            value={kehadiran}
            onChange={setKehadiran}
          />

          <div>
            <p className="type-label mb-3">{copy.rsvp.fields.partySize}</p>
            <div className="flex gap-2.5" role="group" aria-label={copy.rsvp.fields.partySize}>
              {Array.from({ length: siteConfig.rsvp.maxParty }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setJumlah(n)}
                  aria-pressed={jumlah === n}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border font-sans text-sm tabular-nums transition-colors ${
                    jumlah === n
                      ? "border-dusty bg-blush/35 font-medium text-ink"
                      : "border-border bg-surface text-ink-soft hover:bg-cream"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="type-meta mt-2.5">{copy.rsvp.fields.partySizeNote}</p>
          </div>

          <FloatTextarea
            name="catatan"
            label={copy.rsvp.fields.message}
            value={catatan}
            onChange={setCatatan}
            maxLength={300}
          />

          {/* Honeypot — hidden from humans, present for bots. */}
          <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label>
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={status === "sending" || status === "success"}
            className="type-button relative mt-1 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-ink px-8 py-3 text-paper shadow-card transition-transform hover:scale-[1.02] active:scale-[0.97] disabled:opacity-80 disabled:hover:scale-100"
          >
            {status === "sending" ? (
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper"
              />
            ) : null}
            {status === "success" ? copy.rsvp.ctaSent : copy.rsvp.cta}
            <PetalBurst fire={status === "success"} />
          </button>

          <div aria-live="polite">
            {status === "success" ? (
              <p className="type-lede mx-auto text-center text-sage">{copy.rsvp.success}</p>
            ) : null}
            {status === "error" ? (
              <p className="type-body mx-auto text-center text-alert">{errorMsg}</p>
            ) : null}
          </div>
        </form>
      </Reveal>
    </section>
  );
};
