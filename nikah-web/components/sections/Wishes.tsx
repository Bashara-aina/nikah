"use client";

/**
 * L10 — Wishes. Copy §8 verbatim. GET /api/wishes renders the open wall
 * (honest empty state until the backend is wired); POST prepends the new wish
 * optimistically. Fade-in only — FLIP deferred (plan 05 A.7).
 */
import { useEffect, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/primitives/Reveal";
import { useGuest } from "@/components/GuestProvider";
import { FloatInput, FloatTextarea } from "@/components/ui/fields";
import { copy } from "@/lib/copy";

type Wish = { nama: string; pesan: string; timestamp?: string };
type Status = "idle" | "sending" | "success" | "error";

export const Wishes = () => {
  const guest = useGuest();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/wishes", { cache: "no-store" })
      .then(async (res) => ({
        ok: res.ok,
        body: (await res.json()) as { success: boolean; data?: { wishes?: Wish[] } },
      }))
      .then(({ ok, body }) => {
        if (cancelled) return;
        if (ok && body.success && Array.isArray(body.data?.wishes)) {
          setWishes(body.data.wishes);
          return;
        }
        setLoadFailed(true);
      })
      .catch((error: unknown) => {
        console.error("Wishes wall could not be loaded:", error);
        if (!cancelled) setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!nama.trim() || !pesan.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Links the wish to the guest record when it came from a personal link.
          slug: guest.slug ?? "",
          nama: nama.trim(),
          pesan: pesan.trim(),
          website,
        }),
      });
      const body = (await res.json()) as { success: boolean };
      if (body.success) {
        setWishes((prev) => [{ nama: nama.trim(), pesan: pesan.trim() }, ...prev]);
        setNama("");
        setPesan("");
        setStatus("success");
        window.setTimeout(() => setStatus("idle"), 2800);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="wishes"
      aria-label={copy.a11y.wishes}
      data-cv="auto"
      className="bg-paper px-7 pb-20 pt-16"
    >
      <Reveal className="text-center">
        <h2 className="type-display">{copy.wishes.heading}</h2>
        <div aria-hidden className="mx-auto mt-4 h-px w-20 bg-gold/70" />
        <p className="type-lede mx-auto mt-6">{copy.wishes.lead}</p>
      </Reveal>

      <Reveal className="mx-auto mt-9 max-w-sm">
        <form onSubmit={submit} className="relative flex flex-col gap-5">
          <FloatInput
            name="nama"
            label={copy.wishes.fields.name}
            value={nama}
            onChange={setNama}
            required
            maxLength={80}
          />
          <FloatTextarea
            name="pesan"
            label={copy.wishes.fields.message}
            value={pesan}
            onChange={setPesan}
            maxLength={300}
          />
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
            disabled={status === "sending"}
            className="type-button inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-ink/25 bg-surface px-8 py-3 text-ink shadow-petal transition-transform hover:bg-blush/25 active:scale-[0.97] disabled:opacity-70"
          >
            {status === "sending" ? (
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink"
              />
            ) : null}
            {status === "success" ? copy.wishes.ctaSent : copy.wishes.cta}
          </button>
          <div aria-live="polite">
            {status === "success" ? (
              <p className="type-lede mx-auto text-center text-sage">{copy.wishes.success}</p>
            ) : null}
            {status === "error" ? (
              <p className="type-body mx-auto text-center text-alert">{copy.wishes.error}</p>
            ) : null}
          </div>
        </form>
        <p className="type-meta mx-auto mt-3 text-center">{copy.wishes.openNote}</p>
      </Reveal>

      {/* Wall */}
      <div className="mx-auto mt-10 flex max-w-sm flex-col gap-4">
        {wishes.map((w) => (
          <figure
            key={`${w.timestamp ?? "new"}-${w.nama}-${w.pesan}`}
            className="animate-[fade-in_600ms_ease-out] break-words rounded-2xl border border-border bg-surface/80 px-5 py-4 shadow-petal"
          >
            <blockquote className="type-prose">{w.pesan}</blockquote>
            <figcaption className="type-label mt-3">
              <span aria-hidden>—&nbsp;</span>
              {w.nama}
            </figcaption>
          </figure>
        ))}
        {loaded && wishes.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Image
              src="/assets/florals/floral-sprig.webp"
              alt=""
              width={442}
              height={127}
              sizes="176px"
              className="h-auto w-44 max-w-[75%] opacity-90"
            />
            <p className="type-lede mt-5 text-muted">
              {loadFailed ? copy.wishes.loadError : copy.wishes.empty}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
};
