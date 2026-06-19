"use client";

/**
 * Wishes — public guestbook (docs/10 §10).
 * Form + list; GET on mount; POST optimistically; aria-live.
 */

import { useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";
import { useWishes } from "@/lib/useWishes";
import { useToast } from "@/lib/toastStore";
import { useMotion } from "@/components/motion/MotionContext";
import { dur, ease, move, stagger as staggerToken } from "@/lib/motionTokens";
import { gsap } from "gsap";
import Reveal from "@/components/primitives/Reveal";
import Field from "@/components/ui/Field";

interface FormState {
  nama: string;
  pesan: string;
  hp: string;
}

const INITIAL: FormState = { nama: "", pesan: "", hp: "" };

function sanitize(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

function formatDate(ts: number): string {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function Wishes() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const { items, loading, error, refetch } = useWishes(50);
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const { push } = useToast();
  const { reduced } = useMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = formRef.current;
    if (!root) return;
    const kids = root.querySelectorAll<HTMLElement>("[data-wish-field]");
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
  }, [reduced]);

  // Reveal wish cards on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = listRef.current;
    if (!root) return;
    const kids = root.querySelectorAll<HTMLElement>("[data-wish-card]");
    if (kids.length === 0) return;
    const tween = gsap.from(kids, {
      autoAlpha: 0,
      y: move.reveal * 0.6,
      duration: dur.base,
      ease: ease.enter,
      stagger: staggerToken.tight,
    });
    return () => {
      tween.kill();
    };
  }, [items, reduced]);

  const valid =
    state.nama.trim().length >= 2 &&
    state.pesan.trim().length >= 1 &&
    state.pesan.length <= 300;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setErrors({});
    const optimisticId = Date.now() + Math.floor(Math.random() * 1000);
    setPendingIds((p) => new Set(p).add(optimisticId));

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: sanitize(state.nama),
          pesan: sanitize(state.pesan),
          hp: state.hp,
          t: Date.now(),
        }),
      });
      if (res.status === 429) {
        push("error", "Sebentar ya, coba lagi sebentar lagi.");
        setPendingIds((p) => {
          const next = new Set(p);
          next.delete(optimisticId);
          return next;
        });
        return;
      }
      if (res.status === 503) {
        push(
          "error",
          "Ucapan belum bisa dikirim (backend belum terhubung). Coba lagi nanti.",
        );
        setPendingIds((p) => {
          const next = new Set(p);
          next.delete(optimisticId);
          return next;
        });
        return;
      }
      if (res.status === 400) {
        const json = (await res.json().catch(() => null)) as
          | { ok: false; fields?: Record<string, string> }
          | null;
        setErrors(json?.fields ?? {});
        push("error", "Mohon periksa kembali isianmu.");
        setPendingIds((p) => {
          const next = new Set(p);
          next.delete(optimisticId);
          return next;
        });
        return;
      }
      if (!res.ok) {
        push("error", "Gagal mengirim. Coba lagi.");
        setPendingIds((p) => {
          const next = new Set(p);
          next.delete(optimisticId);
          return next;
        });
        return;
      }
      const json = (await res.json()) as
        | { ok: true; item: { nama: string; pesan: string; ts: number } }
        | { ok: false };
      setState(INITIAL);
      push("success", "Terima kasih atas ucapanmu 🤍");
      // Submitted wishes need approval per SPEC 04 §1 — they will show up
      // on next refetch; do not echo them into the public list locally.
      setPendingIds((p) => {
        const next = new Set(p);
        next.delete(optimisticId);
        return next;
      });
      void json;
    } catch {
      push("error", "Tidak ada koneksi. Coba lagi saat online.");
      setPendingIds((p) => {
        const next = new Set(p);
        next.delete(optimisticId);
        return next;
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="wishes"
      ref={sectionRef}
      className="section cv-auto"
      aria-label="Ucapan dan doa"
    >
      <div className="container-narrow" style={{ textAlign: "center" }}>
        <Reveal
          as="h2"
          className="t-h1"
          seed="wishes-title"
          style={{ color: "var(--ink)" }}
        >
          {copy.wishes.title}
        </Reveal>
        <p
          className="t-body"
          style={{ color: "var(--ink-soft)", margin: "8px 0 24px" }}
        >
          {copy.wishes.body}
        </p>
        <p
          className="t-small"
          style={{ color: "var(--ink-soft)", margin: "0 0 24px" }}
        >
          {copy.wishes.publicNote}
        </p>

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
          aria-describedby="wishes-status"
        >
          <div data-wish-field>
            <Field
              label={copy.wishes.fields.nama}
              name="nama"
              value={state.nama}
              onChange={(v) => setState((s) => ({ ...s, nama: v }))}
              required
              maxLength={60}
              autoComplete="name"
              error={errors.nama}
            />
          </div>
          <div data-wish-field>
            <Field
              label={copy.wishes.fields.pesan}
              name="pesan"
              value={state.pesan}
              onChange={(v) => setState((s) => ({ ...s, pesan: v }))}
              required
              multiline
              rows={3}
              maxLength={300}
              error={errors.pesan}
            />
          </div>
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
            <label htmlFor="wishes-hp">Jangan diisi</label>
            <input
              id="wishes-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={state.hp}
              onChange={(e) => setState((s) => ({ ...s, hp: e.target.value }))}
            />
          </div>
          <div data-wish-field style={{ marginTop: 8 }}>
            <button
              type="submit"
              disabled={!valid || submitting}
              className="btn-primary"
              style={{ width: "100%" }}
            >
              {submitting ? "Mengirim..." : copy.wishes.fields.submit}
            </button>
          </div>
          <p
            id="wishes-status"
            role="status"
            aria-live="polite"
            className="t-small"
            style={{ margin: "12px 0 0", color: "var(--ink-soft)" }}
          >
            Ucapanmu akan tampil setelah disetujui.
          </p>
        </form>

        <div
          ref={listRef}
          role="list"
          aria-label="Daftar ucapan"
          style={{ marginTop: 24, textAlign: "left" }}
        >
          {loading && items.length === 0 ? (
            <WishesSkeleton />
          ) : null}

          {!loading && error ? (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: 16,
                textAlign: "center",
                color: "var(--ink-soft)",
              }}
            >
              {error === "backend_not_configured" ? (
                <>
                  Ucapan akan muncul setelah backend terhubung.
                </>
              ) : (
                <>
                  Tidak dapat memuat daftar ucapan.{" "}
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => void refetch()}
                    style={{ minHeight: 44, padding: "8px 14px" }}
                  >
                    Coba lagi
                  </button>
                </>
              )}
            </div>
          ) : null}

          {!loading && !error && items.length === 0 ? (
            <div
              style={{
                padding: 16,
                textAlign: "center",
                color: "var(--ink-soft)",
              }}
            >
              {copy.wishes.empty}
            </div>
          ) : null}

          {items.map((w, i) => {
            const isPending = pendingIds.has(w.ts);
            return (
              <article
                key={`${w.ts}-${i}`}
                data-wish-card
                role="listitem"
                style={{
                  background: "var(--cream)",
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: "var(--shadow-sm)",
                  margin: "12px 0",
                }}
              >
                <header
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 12,
                    marginBottom: 6,
                  }}
                >
                  <strong
                    style={{
                      color: "var(--ink)",
                      fontFamily: "var(--font-serif), serif",
                    }}
                  >
                    {w.nama}
                  </strong>
                  <span
                    className="t-small"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {formatDate(w.ts)}
                    {isPending ? " · menunggu" : ""}
                  </span>
                </header>
                <p
                  style={{
                    margin: 0,
                    color: "var(--ink-soft)",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {w.pesan}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WishesSkeleton() {
  return (
    <div role="status" aria-label="Memuat ucapan" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            background: "var(--cream)",
            borderRadius: 16,
            padding: 16,
            margin: "12px 0",
            boxShadow: "var(--shadow-sm)",
            opacity: 0.6,
          }}
        >
          <div
            style={{
              width: "40%",
              height: 14,
              background:
                "color-mix(in srgb, var(--ink-soft) 20%, transparent)",
              borderRadius: 6,
              marginBottom: 8,
            }}
          />
          <div
            style={{
              width: "90%",
              height: 12,
              background:
                "color-mix(in srgb, var(--ink-soft) 18%, transparent)",
              borderRadius: 6,
              marginBottom: 4,
            }}
          />
          <div
            style={{
              width: "70%",
              height: 12,
              background:
                "color-mix(in srgb, var(--ink-soft) 18%, transparent)",
              borderRadius: 6,
            }}
          />
        </div>
      ))}
    </div>
  );
}
