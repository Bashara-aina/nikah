"use client";

import type { DashboardStatsData, StatusFilter } from "./dashboardShared";

type StatKey = {
  id: StatusFilter;
  label: string;
  value: number;
  hint: string;
  detail?: string;
};

type DashboardStatsProps = {
  stats: DashboardStatsData;
  active: StatusFilter;
  onSelect: (filter: StatusFilter) => void;
};

const Tile = ({
  item,
  selected,
  onSelect,
}: {
  item: StatKey;
  selected: boolean;
  onSelect: (filter: StatusFilter) => void;
}) => (
  <button
    type="button"
    title={item.hint}
    aria-pressed={selected}
    onClick={() => onSelect(item.id)}
    className={`flex min-h-[64px] flex-col justify-center rounded-2xl border px-3 py-2 text-left transition-colors ${
      selected
        ? "border-dusty bg-blush/40 text-ink"
        : "border-border bg-surface/80 text-ink-soft hover:bg-cream"
    }`}
  >
    <span className="font-sans text-xl font-medium tabular-nums text-ink">{item.value}</span>
    <span className="type-meta mt-0.5 leading-tight">{item.label}</span>
    {item.detail ? (
      <span className="type-meta mt-0.5 leading-tight tabular-nums">{item.detail}</span>
    ) : null}
  </button>
);

/**
 * The only status control on the page — these tiles both report and filter.
 *
 * They used to sit in one horizontal scroller where "Sudah dikirim" and "Sudah
 * RSVP" looked like alternatives, though the second is a subset of the first.
 * Splitting them under headings says what each number counts: sending, answering,
 * and — on the day — who has arrived and who has collected a souvenir.
 */
export const DashboardStats = ({ stats, active, onSelect }: DashboardStatsProps) => {
  const delivery: StatKey[] = [
    {
      id: "belum",
      label: "Belum dikirim",
      value: stats.uninvited,
      hint: "Belum ditandai diundang",
    },
    {
      id: "sudah",
      label: "Sudah dikirim",
      value: stats.invited,
      hint: "Sudah ditandai diundang",
    },
    { id: "dibuka", label: "Sudah dibuka", value: stats.opened, hint: "Sudah membuka undangan" },
  ];

  const replies: StatKey[] = [
    { id: "rsvp", label: "Sudah RSVP", value: stats.answered, hint: "Sudah mengisi RSVP" },
    {
      id: "unanswered",
      label: "Belum RSVP",
      value: stats.unanswered,
      hint: "Sudah dikirim, belum mengisi RSVP",
    },
  ];

  const dayOf: StatKey[] = [
    {
      id: "attended",
      label: "Sudah datang",
      value: stats.attended,
      hint: "Sudah ditandai kedatangan",
      detail: `${stats.paxAttended} pax`,
    },
    {
      id: "souvenir",
      label: "Sudah souvenir",
      value: stats.souvenir,
      hint: "Sudah ditandai ambil souvenir",
      detail: `${stats.paxSouvenir} pax`,
    },
  ];

  return (
    <div className="mt-5 flex flex-col gap-3" role="group" aria-label="Ringkasan status">
      <button
        type="button"
        title="Tampilkan semua tamu"
        aria-pressed={active === "all"}
        onClick={() => onSelect("all")}
        className={`flex min-h-[48px] items-center justify-between rounded-2xl border px-4 transition-colors ${
          active === "all"
            ? "border-dusty bg-blush/40 text-ink"
            : "border-border bg-surface/80 text-ink-soft hover:bg-cream"
        }`}
      >
        <span className="type-button">Semua tamu</span>
        <span className="font-sans text-xl font-medium tabular-nums text-ink">{stats.total}</span>
      </button>

      <div>
        <p className="type-label">Pengiriman undangan</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {delivery.map((item) => (
            <Tile key={item.id} item={item} selected={active === item.id} onSelect={onSelect} />
          ))}
        </div>
      </div>

      <div>
        <p className="type-label">Balasan RSVP</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {replies.map((item) => (
            <Tile key={item.id} item={item} selected={active === item.id} onSelect={onSelect} />
          ))}
        </div>
      </div>

      <div>
        <p className="type-label">Hari H</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {dayOf.map((item) => (
            <Tile key={item.id} item={item} selected={active === item.id} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
};
