"use client";

import type { DashboardStatsData } from "./dashboardShared";
import { Menu, MenuItem } from "./ui";

type DashboardHeaderProps = {
  stats: DashboardStatsData;
  onSignOut: () => void;
  onRefresh: () => void;
  refreshing: boolean;
};

const EXPORTS = [
  { table: "guests", label: "Daftar tamu" },
  { table: "rsvps", label: "RSVP" },
  { table: "wishes", label: "Ucapan" },
] as const;

/**
 * A bar with no label only says "some of something is done". Labels name the
 * job: sending, answering, arriving, collecting a souvenir.
 */
const PaxCard = ({
  value,
  label,
  detail,
}: {
  value: number;
  label: string;
  detail: string;
}) => (
  <div className="rounded-2xl border border-border bg-surface/80 px-4 py-3">
    <p className="font-sans text-2xl font-medium tabular-nums text-ink">{value}</p>
    <p className="type-meta mt-0.5 leading-tight">{label}</p>
    <p className="type-meta mt-1 leading-tight">{detail}</p>
  </div>
);

const Progress = ({ label, value, total, bar }: {
  label: string;
  value: number;
  total: number;
  bar: string;
}) => {
  const percent = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="type-label">{label}</p>
        <p className="type-meta tabular-nums">
          {value} / {total}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${percent} persen`}
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-cream"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${bar}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export const DashboardHeader = ({
  stats,
  onSignOut,
  onRefresh,
  refreshing,
}: DashboardHeaderProps) => {
  // One line, naming whichever job is still open. Reporting what is already done
  // reads well and tells the couple nothing they can act on.
  const summary =
    stats.total === 0
      ? "Belum ada tamu di daftar."
      : stats.uninvited > 0
        ? `${stats.uninvited} dari ${stats.total} undangan belum dikirim.`
        : stats.unanswered > 0
          ? `Semua undangan terkirim · ${stats.unanswered} tamu belum mengisi RSVP.`
          : `Semua ${stats.total} tamu sudah mengisi RSVP.`;

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="type-display">Dashboard Tamu</h1>
          <p className="type-meta mt-1">{summary}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {/* One refresh for every tab — the guest list, the replies, and the
              wishes are all a page-load old together. */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="type-button min-h-[44px] rounded-full border border-border bg-surface px-4 disabled:opacity-60"
          >
            {refreshing ? "Menyegarkan…" : "Muat ulang"}
          </button>
          <Menu label="Unduh CSV">
            {(close) =>
              EXPORTS.map(({ table, label }) => (
                <MenuItem
                  key={table}
                  href={`/api/dashboard/export?table=${table}`}
                  onClick={close}
                >
                  {label}
                </MenuItem>
              ))
            }
          </Menu>
          <button
            type="button"
            onClick={onSignOut}
            className="type-button min-h-[44px] rounded-full px-4 text-ink-soft underline"
          >
            Keluar
          </button>
        </div>
      </div>

      {stats.total > 0 ? (
        <div className="flex flex-col gap-3">
          <Progress
            label="Undangan terkirim"
            value={stats.invited}
            total={stats.total}
            bar="bg-dusty-deep"
          />
          <Progress
            label="Sudah mengisi RSVP"
            value={stats.answered}
            total={stats.total}
            bar="bg-ink"
          />
          {/* Guest tiles above count invitations; these count people — party_max
              for what was sent, jumlah for what came back on the form. */}
          <div
            className="grid grid-cols-2 gap-2"
            role="group"
            aria-label="Ringkasan jumlah orang"
          >
            <PaxCard
              value={stats.paxInvited}
              label="Pax diundang"
              detail={`Dari ${stats.invited} undangan terkirim`}
            />
            <PaxCard
              value={stats.paxRsvp}
              label="Pax RSVP"
              detail={`Dari ${stats.answered} tamu yang sudah mengisi`}
            />
          </div>

          <Progress
            label="Kedatangan"
            value={stats.attended}
            total={stats.total}
            bar="bg-navy"
          />
          <Progress
            label="Sudah ambil souvenir"
            value={stats.souvenir}
            total={stats.total}
            bar="bg-muted"
          />
          <div
            className="grid grid-cols-2 gap-2"
            role="group"
            aria-label="Ringkasan kedatangan dan souvenir"
          >
            <PaxCard
              value={stats.paxAttended}
              label="Pax datang"
              detail={`Dari ${stats.attended} undangan`}
            />
            <PaxCard
              value={stats.paxSouvenir}
              label="Pax souvenir"
              detail={`Dari ${stats.souvenir} undangan`}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
};
