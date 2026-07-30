"use client";

import type { DashboardStatsData, StatusFilter } from "./dashboardShared";

type StatKey = {
  id: StatusFilter;
  label: string;
  value: number;
  hint: string;
};

type DashboardStatsProps = {
  stats: DashboardStatsData;
  active: StatusFilter;
  onSelect: (filter: StatusFilter) => void;
};

export const DashboardStats = ({ stats, active, onSelect }: DashboardStatsProps) => {
  // These tiles are the only status control on the page. They used to sit above
  // a second row of pills carrying the same six labels, so every status could be
  // set two ways and the two rows disagreed about which was active.
  const items: StatKey[] = [
    { id: "all", label: "Semua", value: stats.total, hint: "Tampilkan semua tamu" },
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
    {
      id: "unanswered",
      label: "Menunggu balasan",
      value: stats.unanswered,
      hint: "Sudah dikirim, belum RSVP",
    },
    { id: "rsvp", label: "Konfirmasi", value: stats.answered, hint: "Sudah RSVP" },
  ];

  return (
    <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Ringkasan status">
      {items.map((item) => {
        const selected = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            title={item.hint}
            aria-pressed={selected}
            onClick={() => onSelect(item.id)}
            className={`flex min-h-[64px] min-w-[6.5rem] shrink-0 flex-col justify-center rounded-2xl border px-4 py-2 text-left transition-colors ${
              selected
                ? "border-dusty bg-blush/40 text-ink"
                : "border-border bg-surface/80 text-ink-soft hover:bg-cream"
            }`}
          >
            <span className="font-sans text-xl font-medium tabular-nums text-ink">{item.value}</span>
            <span className="type-meta mt-0.5 leading-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
