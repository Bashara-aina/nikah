"use client";

import { useState } from "react";
import type { WishRow } from "@/lib/db.types";
import { dashboardRequest } from "@/lib/dashboardClient";

type WishesModerationProps = {
  wishes: WishRow[] | null;
  loadError: string;
  /** Refreshes the whole page; the header owns the everyday reload. */
  onRetry: () => void;
  onWishesChange: (wishes: WishRow[]) => void;
};

export const WishesModeration = ({
  wishes,
  loadError,
  onRetry,
  onWishesChange,
}: WishesModerationProps) => {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loading = wishes === null && !loadError;
  const visibleCount = wishes?.filter((wish) => !wish.hidden).length ?? 0;
  const hiddenCount = wishes?.filter((wish) => wish.hidden).length ?? 0;

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
    const updated = response.data.wish;
    onWishesChange(
      (wishes ?? []).map((item) => (item.id === updated.id ? updated : item)),
    );
    setMessage(updated.hidden ? "Ucapan disembunyikan." : "Ucapan ditampilkan lagi.");
  };

  return (
    <section className="mt-6" aria-label="Moderasi ucapan">
      <h2 className="type-display-sm">Moderasi ucapan</h2>
      <p className="type-meta mt-1">
        {wishes
          ? `${visibleCount} tampil di situs${hiddenCount > 0 ? ` · ${hiddenCount} disembunyikan` : ""}`
          : "Kelola ucapan yang tampil di undangan."}
      </p>

      {loading ? (
        <p className="type-body mt-6 text-center text-ink-soft">Memuat ucapan…</p>
      ) : null}

      {loadError ? (
        <div className="mt-6 rounded-2xl bg-blush/40 p-5 text-center">
          <p className="type-body text-alert">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              setMessage("");
              onRetry();
            }}
            className="type-button mt-3 min-h-[44px] rounded-full border border-border bg-paper px-5"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      {!loading && !loadError && wishes && wishes.length === 0 ? (
        <p className="type-body mt-10 text-center">Belum ada ucapan.</p>
      ) : null}

      {wishes && wishes.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-3">
          {wishes.map((wish) => (
            <li key={wish.id}>
              <article
                className={`rounded-2xl border border-border bg-paper p-4 ${
                  wish.hidden ? "opacity-60" : ""
                }`}
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
                  className={`type-button mt-3 min-h-[44px] rounded-full px-5 disabled:opacity-60 ${
                    wish.hidden
                      ? "bg-ink text-paper"
                      : "border border-border bg-surface text-ink"
                  }`}
                >
                  {busyId === wish.id
                    ? "Sebentar…"
                    : wish.hidden
                      ? "Tampilkan"
                      : "Sembunyikan"}
                </button>
              </article>
            </li>
          ))}
        </ul>
      ) : null}

      <p aria-live="polite" className="type-body mt-3 min-h-6 text-center text-ink-soft">
        {message}
      </p>
    </section>
  );
};
