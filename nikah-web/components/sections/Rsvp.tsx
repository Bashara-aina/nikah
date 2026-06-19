"use client";

/**
 * RSVP — form (nama, kehadiran, jumlah 1–4, pesan) (docs/10 §9).
 * Submit to /api/rsvp; deadline D-7; loading/success/error/aria-live.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { copy } from "@/lib/copy";
import { config } from "@/lib/config";
import { isoToShortID } from "@/lib/date";
import { useToast } from "@/lib/toastStore";
import { useMotion } from "@/components/motion/MotionContext";
import { dur, ease, move, stagger as staggerToken } from "@/lib/motionTokens";
import Field from "@/components/ui/Field";
import Pill from "@/components/ui/Pill";
import Reveal from "@/components/primitives/Reveal";
import Breathing from "@/components/primitives/Breathing";

type Kehadiran = "hadir" | "tidak" | "diusahakan";

interface FormState {
  nama: string;
  kehadiran: Kehadiran;
  jumlah: number;
  pesan: string;
  hp: string;
}

const INITIAL: FormState = {
  nama: "",
  kehadiran: "hadir",
  jumlah: 1,
  pesan: "",
  hp: "",
};

function getGuestName(): string {
  if (typeof window === "undefined") return "";
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("to");
    if (!raw) return "";
    return decodeURIComponent(raw).trim();
  } catch {
    return "";
  }
}

export default function Rsvp() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deadlinePassed, setDeadlinePassed] = useState<boolean>(false);
  const { push } = useToast();
  const { reduced } = useMotion();
  const formRef = useRef<HTMLFormElement | null>(null);

  // Pre-fill nama from ?to= once mounted via microtask to avoid cascading renders.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const guest = getGuestName();
    if (guest.length > 0) {
      queueMicrotask(() => {
        setState((s) => (s.nama ? s : { ...s, nama: guest }));
      });
    }
  }, []);

  // Deadline check (microtask, no cascading render).
  useEffect(() => {
    if (typeof window === "undefined") return;
    queueMicrotask(() => {
      const now = new Date();
      const dl = new Date(config.rsvpDeadline);
      if (now > dl) {
        setDeadlinePassed(true);
      }
    });
  }, []);

  // Reveal stagger for fields.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = formRef.current;
    if (!root) return;
    const kids = root.querySelectorAll<HTMLElement>("[data-rsvp-field]");
    if (kids.length === 0) return;
    const tween = gsap.from(kids, {
      autoAlpha: 0,
      y: move.reveal,
      duration: dur.enter,
      ease: ease.enter,
      stagger: staggerToken.base,
    });
    return () => {
      tween.kill();
    };
  }, [reduced, success]);

  const deadlineLabel = useMemo(() => {
    try {
      return isoToShortID(config.rsvpDeadline);
    } catch {
      return config.rsvpDeadline;
    }
  }, []);

  const valid =
    state.nama.trim().length >= 2 &&
    (state.kehadiran !== "hadir" || (state.jumlah >= 1 && state.jumlah <= 4)) &&
    state.pesan.length <= 500;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (deadlinePassed) {
      push("info", "Batas konfirmasi sudah lewat. Terima kasih sudah melihat.");
      return;
    }
    if (!valid || submitting) return;
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: getGuestName() || undefined,
          nama: state.nama,
          kehadiran: state.kehadiran,
          jumlah: state.jumlah,
          pesan: state.pesan,
          hp: state.hp,
          t: Date.now(),
        }),
      });
      if (res.status === 429) {
        push("error", "Sebentar ya, coba lagi sebentar lagi.");
        return;
      }
      if (res.status === 503) {
        push(
          "error",
          "Konfirmasi belum bisa dikirim (backend belum terhubung). Coba lagi nanti.",
        );
        return;
      }
      if (res.status === 400) {
        const json = (await res.json().catch(() => null)) as
          | { ok: false; fields?: Record<string, string> }
          | null;
        setErrors(json?.fields ?? {});
        push("error", "Mohon periksa kembali isianmu.");
        return;
      }
      if (!res.ok) {
        push("error", "Gagal mengirim. Coba lagi.");
        return;
      }
      setSuccess(true);
      push("success", "Konfirmasi terkirim. Terima kasih! 🤍");
    } catch {
      push("error", "Tidak ada koneksi. Coba lagi saat online.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      ref={sectionRef}
      className="section cv-auto"
      aria-label="Konfirmasi kehadiran"
    >
      <div className="container-narrow" style={{ textAlign: "center" }}>
        <Reveal>
          <Breathing seed="rsvp-accent" as="div">
            <Image
              src="/assets/illustrations/gift-accent.png"
              alt="Aksen lembut untuk bagian konfirmasi kehadiran"
              width={220}
              height={120}
              loading="lazy"
              style={{ width: "min(100%, 220px)", height: "auto", margin: "0 auto" }}
            />
          </Breathing>
        </Reveal>

        <Reveal
          as="h2"
          className="t-h1"
          seed="rsvp-title"
          style={{ color: "var(--ink)", marginTop: 16 }}
        >
          {copy.rsvp.title}
        </Reveal>

        <p
          className="t-body"
          style={{ color: "var(--ink-soft)", margin: "8px 0 0" }}
        >
          {copy.rsvp.body}
        </p>
        <p
          className="t-small"
          style={{ color: "var(--ink-soft)", margin: "8px 0 24px" }}
        >
          {copy.rsvp.deadline(deadlineLabel)}
        </p>

        {success ? (
          <div
            role="status"
            aria-live="polite"
            style={{
              padding: "24px 16px",
              background: "var(--cream)",
              borderRadius: 18,
              boxShadow: "var(--shadow-sm)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: "1.4rem",
                color: "var(--ink)",
                margin: "0 0 8px",
              }}
            >
              Terima kasih atas konfirmasinya. 🤍
            </div>
            <p style={{ margin: 0, color: "var(--ink-soft)" }}>
              {state.kehadiran === "hadir"
                ? "Sampai jumpa di hari bahagia kami!"
                : state.kehadiran === "tidak"
                  ? "Doa kamu sudah lebih dari cukup. Semoga tetap diberikan kesehatan."
                  : "Semoga rencana baiknya dimudahkan. Kami menunggu kabar."}
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={(e) => void onSubmit(e)}
            noValidate
            style={{
              textAlign: "left",
              background: "var(--cream)",
              padding: 20,
              borderRadius: 18,
              boxShadow: "var(--shadow-sm)",
            }}
            aria-describedby="rsvp-status"
          >
            <div data-rsvp-field>
              <Field
                label={copy.rsvp.fields.nama}
                name="nama"
                value={state.nama}
                onChange={(v) => setState((s) => ({ ...s, nama: v }))}
                required
                autoComplete="name"
                maxLength={80}
                error={errors.nama}
              />
            </div>

            <div data-rsvp-field role="radiogroup" aria-label={copy.rsvp.fields.kehadiran} style={{ marginTop: 4 }}>
              <p
                className="t-small"
                style={{
                  color: "var(--ink-soft)",
                  letterSpacing: "0.04em",
                  margin: "16px 0 8px",
                }}
              >
                {copy.rsvp.fields.kehadiran}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <Pill
                  selected={state.kehadiran === "hadir"}
                  onClick={() => setState((s) => ({ ...s, kehadiran: "hadir" }))}
                >
                  {copy.rsvp.fields.hadir}
                </Pill>
                <Pill
                  selected={state.kehadiran === "tidak"}
                  onClick={() => setState((s) => ({ ...s, kehadiran: "tidak" }))}
                >
                  {copy.rsvp.fields.tidak}
                </Pill>
                <Pill
                  selected={state.kehadiran === "diusahakan"}
                  onClick={() =>
                    setState((s) => ({ ...s, kehadiran: "diusahakan" }))
                  }
                >
                  {copy.rsvp.fields.diusahakan}
                </Pill>
              </div>
            </div>

            {state.kehadiran === "hadir" ? (
              <div data-rsvp-field style={{ marginTop: 16 }}>
                <label
                  className="t-small"
                  htmlFor="rsvp-jumlah"
                  style={{
                    color: "var(--ink-soft)",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  {copy.rsvp.fields.jumlah}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        jumlah: Math.max(1, s.jumlah - 1),
                      }))
                    }
                    aria-label="Kurangi jumlah"
                    className="btn-ghost"
                    style={{ minWidth: 44, padding: "8px 12px" }}
                  >
                    −
                  </button>
                  <span
                    id="rsvp-jumlah"
                    style={{
                      minWidth: 36,
                      textAlign: "center",
                      fontFamily: "var(--font-serif), serif",
                      fontSize: "1.2rem",
                      color: "var(--ink)",
                    }}
                  >
                    {state.jumlah}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        jumlah: Math.min(config.capacity.maxPerInvite, s.jumlah + 1),
                      }))
                    }
                    aria-label="Tambah jumlah"
                    className="btn-ghost"
                    style={{ minWidth: 44, padding: "8px 12px" }}
                  >
                    +
                  </button>
                </div>
                <p
                  className="t-small"
                  style={{
                    color: "var(--ink-soft)",
                    margin: "6px 0 0",
                  }}
                >
                  {copy.rsvp.fields.hintJumlah}
                </p>
              </div>
            ) : null}

            <div data-rsvp-field>
              <Field
                label={copy.rsvp.fields.pesan}
                name="pesan"
                value={state.pesan}
                onChange={(v) => setState((s) => ({ ...s, pesan: v }))}
                multiline
                maxLength={500}
                rows={3}
                error={errors.pesan}
              />
            </div>

            {/* honeypot — visually hidden but accessible to bots */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: -9999,
                width: 1,
                height: 1,
                overflow: "hidden",
              }}
            >
              <label htmlFor="rsvp-hp">Jangan diisi</label>
              <input
                id="rsvp-hp"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={state.hp}
                onChange={(e) => setState((s) => ({ ...s, hp: e.target.value }))}
              />
            </div>

            <div data-rsvp-field style={{ marginTop: 8 }}>
              <button
                type="submit"
                disabled={!valid || submitting || deadlinePassed}
                className="btn-primary"
                style={{ width: "100%" }}
              >
                {submitting
                  ? "Mengirim..."
                  : deadlinePassed
                    ? "Batas waktu lewat"
                    : copy.rsvp.fields.submit}
              </button>
            </div>

            <p
              id="rsvp-status"
              role="status"
              aria-live="polite"
              className="t-small"
              style={{ margin: "12px 0 0", color: "var(--ink-soft)" }}
            >
              {deadlinePassed
                ? "Form konfirmasi sudah ditutup. Terima kasih sudah melihat."
                : "Kami menanti kabar darimu."}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
