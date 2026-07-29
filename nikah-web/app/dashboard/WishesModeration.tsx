"use client";

import { useState } from "react";
import type { WishRow } from "@/lib/db.types";
import { dashboardRequest } from "@/lib/dashboardClient";

export const WishesModeration = () => {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (!nextOpen || loaded) return;
    const response = await dashboardRequest<{ wishes: WishRow[] }>("/api/dashboard/wishes");
    if (response.success && response.data?.wishes) {
      setWishes(response.data.wishes);
      setLoaded(true);
      return;
    }
    setMessage(response.error?.message ?? "Ucapan belum bisa dimuat.");
  };

  const toggleHidden = async (wish: WishRow) => {
    setBusyId(wish.id);
    setMessage("");
    const response = await dashboardRequest<{ wish: WishRow }>(
      `/api/dashboard/wishes/${wish.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ hidden: !wish.hidden }),
      },
    );
    setBusyId(null);
    if (!response.success || !response.data?.wish) {
      setMessage(response.error?.message ?? "Ucapan belum bisa diperbarui.");
      return;
    }
    setWishes((current) =>
      current.map((item) => (item.id === response.data?.wish.id ? response.data.wish : item)),
    );
    setMessage(response.data.wish.hidden ? "Ucapan disembunyikan." : "Ucapan ditampilkan lagi.");
  };

  return (
    <section className="mt-6 rounded-3xl border border-border bg-surface/70 p-5">
      <button
        type="button"
        aria-expanded={open}
        onClick={load}
        className="type-button flex min-h-[44px] w-full items-center justify-between gap-4 text-left"
      >
        Moderasi ucapan
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <div className="mt-4 flex flex-col gap-3">
          {loaded && wishes.length === 0 ? <p className="type-body">Belum ada ucapan.</p> : null}
          {wishes.map((wish) => (
            <article
              key={wish.id}
              className={`rounded-2xl border border-border bg-paper p-4 ${wish.hidden ? "opacity-60" : ""}`}
            >
              <p className="type-prose">{wish.pesan}</p>
              <p className="type-label mt-2">{wish.nama}</p>
              <p className="type-meta mt-1">
                {new Date(wish.created_at).toLocaleString("id-ID")}
                {wish.hidden ? " · Disembunyikan" : ""}
              </p>
              <button
                type="button"
                disabled={busyId === wish.id}
                onClick={() => toggleHidden(wish)}
                className="type-button mt-3 min-h-[44px] rounded-full border border-border px-5 disabled:opacity-60"
              >
                {wish.hidden ? "Tampilkan" : "Sembunyikan"}
              </button>
            </article>
          ))}
          <p aria-live="polite" className="type-body min-h-6 text-alert">
            {message}
          </p>
        </div>
      ) : null}
    </section>
  );
};
