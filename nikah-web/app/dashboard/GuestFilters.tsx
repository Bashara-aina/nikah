"use client";

import { GUEST_GROUPS, INVITE_TYPES } from "@/lib/db.types";
import type { GuestGroup, InviteType } from "@/lib/db.types";
import {
  GROUP_LABEL,
  SORT_LABEL,
  TYPE_LABEL,
  inputClass,
  type SortOrder,
  type StatusFilter,
} from "./dashboardShared";

type GuestFiltersProps = {
  searchRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: StatusFilter;
  groupFilter: GuestGroup | "all";
  onGroupChange: (value: GuestGroup | "all") => void;
  typeFilter: InviteType | "all";
  onTypeChange: (value: InviteType | "all") => void;
  sortOrder: SortOrder;
  onSortChange: (value: SortOrder) => void;
  onAddGuest: () => void;
  onReset: () => void;
};

export const GuestFilters = ({
  searchRef,
  query,
  onQueryChange,
  statusFilter,
  groupFilter,
  onGroupChange,
  typeFilter,
  onTypeChange,
  sortOrder,
  onSortChange,
  onAddGuest,
  onReset,
}: GuestFiltersProps) => {
  // Four controls can combine into an empty list, and clearing them one by one
  // to get back to a full list is a puzzle. One button undoes the lot.
  const filtered =
    query.trim().length > 0 ||
    statusFilter !== "all" ||
    groupFilter !== "all" ||
    typeFilter !== "all" ||
    sortOrder !== "newest";

  return (
  <div className="mt-5 flex flex-col gap-3">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        ref={searchRef}
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Cari nama, slug, atau nomor  —  tekan /"
        aria-label="Cari tamu"
        className={`${inputClass} flex-1`}
      />
      <button
        type="button"
        onClick={onAddGuest}
        className="type-button min-h-[48px] shrink-0 rounded-full bg-ink px-6 text-paper sm:ml-auto"
      >
        Tambah tamu
      </button>
    </div>

    {/* Two per row on a phone rather than three stacked rows, which pushed the
        first guest card off the bottom of the screen. */}
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <select
        aria-label="Saring kelompok"
        value={groupFilter}
        onChange={(e) => onGroupChange(e.target.value as GuestGroup | "all")}
        className="min-h-[44px] w-full rounded-full border border-border bg-surface px-4 font-sans text-sm outline-none focus:border-dusty/60 sm:w-auto"
      >
        <option value="all">Semua kelompok</option>
        {GUEST_GROUPS.map((g) => (
          <option key={g} value={g}>
            {GROUP_LABEL[g]}
          </option>
        ))}
      </select>
      <select
        aria-label="Saring jenis undangan"
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as InviteType | "all")}
        className="min-h-[44px] w-full rounded-full border border-border bg-surface px-4 font-sans text-sm outline-none focus:border-dusty/60 sm:w-auto"
      >
        <option value="all">Semua jenis</option>
        {INVITE_TYPES.map((t) => (
          <option key={t} value={t}>
            {TYPE_LABEL[t]}
          </option>
        ))}
      </select>
      <select
        aria-label="Urutkan tamu"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value as SortOrder)}
        className="min-h-[44px] w-full rounded-full border border-border bg-surface px-4 font-sans text-sm outline-none focus:border-dusty/60 sm:w-auto"
      >
        {(Object.keys(SORT_LABEL) as SortOrder[]).map((order) => (
          <option key={order} value={order}>
            {SORT_LABEL[order]}
          </option>
        ))}
      </select>
      {filtered ? (
        <button
          type="button"
          onClick={onReset}
          className="type-button min-h-[44px] rounded-full px-4 text-ink-soft underline"
        >
          Reset saringan
        </button>
      ) : null}
    </div>
  </div>
  );
};
