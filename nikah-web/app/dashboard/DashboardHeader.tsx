"use client";

import type { DashboardStatsData } from "./dashboardShared";
import { Menu, MenuItem } from "./ui";

type DashboardHeaderProps = {
  stats: DashboardStatsData;
  onSignOut: () => void;
};

const EXPORTS = [
  { table: "guests", label: "Daftar tamu" },
  { table: "rsvps", label: "RSVP" },
  { table: "wishes", label: "Ucapan" },
] as const;

/**
 * The one line that answers "how far along are we". A run-on list of four
 * numbers made the couple do the subtraction themselves; the bar shows the
 * remaining share of the list at a glance, and the count names what is left to
 * do rather than what is already done.
 */
export const DashboardHeader = ({ stats, onSignOut }: DashboardHeaderProps) => {
  const percent = stats.total === 0 ? 0 : Math.round((stats.invited / stats.total) * 100);

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="type-display">Dashboard Tamu</h1>
          <p className="type-meta mt-1">
            {stats.total === 0
              ? "Belum ada tamu di daftar."
              : stats.uninvited > 0
                ? `${stats.uninvited} dari ${stats.total} tamu belum dikirimi undangan.`
                : `Semua ${stats.total} undangan sudah dikirim.`}
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
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
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percent} persen undangan terkirim`}
          className="h-2 w-full overflow-hidden rounded-full bg-cream"
        >
          <div
            className="h-full rounded-full bg-dusty-deep transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      ) : null}
    </header>
  );
};
