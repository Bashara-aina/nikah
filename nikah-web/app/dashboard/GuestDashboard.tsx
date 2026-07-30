"use client";

/**
 * Couple dashboard shell: tabs (Tamu / Ucapan), guest list workflow, and session
 * actions. Data mutations stay on the existing /api/dashboard routes.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { GuestGroup, GuestRow, GuestWithRsvp, InviteType, WishRow } from "@/lib/db.types";
import { dashboardRequest } from "@/lib/dashboardClient";
import { templateFor } from "@/lib/waTemplates";
import { slugify } from "@/lib/slug";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardStats } from "./DashboardStats";
import { GuestCard } from "./GuestCard";
import { GuestFilters } from "./GuestFilters";
import { GuestForm } from "./GuestForm";
import { WishesModeration } from "./WishesModeration";
import { ConfirmDialog, ToastHost, useToasts } from "./ui";
import {
  emptyForm,
  formFromGuest,
  type DashboardTab,
  type FormState,
  type SortOrder,
  type StatusFilter,
} from "./dashboardShared";

export const GuestDashboard = ({ initialGuests }: { initialGuests: GuestWithRsvp[] }) => {
  const [guests, setGuests] = useState<GuestWithRsvp[]>(initialGuests);
  const [tab, setTab] = useState<DashboardTab>("tamu");
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<GuestGroup | "all">("all");
  const [typeFilter, setTypeFilter] = useState<InviteType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [form, setForm] = useState<FormState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<GuestWithRsvp | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [waPromptId, setWaPromptId] = useState<string | null>(null);
  const [wishes, setWishes] = useState<WishRow[] | null>(null);
  const [wishesError, setWishesError] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const { toasts, push, dismiss } = useToasts();

  // `/` jumps to the search box — the couple works through ~200 names and
  // reaching for the mouse each time is the slowest part of the loop.
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadWishes = async () => {
      const response = await dashboardRequest<{ wishes: WishRow[] }>("/api/dashboard/wishes");
      if (cancelled) return;
      if (response.success && response.data?.wishes) {
        setWishes(response.data.wishes);
        setWishesError("");
        return;
      }
      setWishesError(response.error?.message ?? "Ucapan belum bisa dimuat.");
      setWishes([]);
    };
    void loadWishes();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const invited = guests.filter((g) => g.invited_at !== null).length;
    const answered = guests.filter((g) => g.rsvp !== null).length;
    const unanswered = guests.filter((g) => g.invited_at !== null && g.rsvp === null).length;
    return {
      total: guests.length,
      invited,
      uninvited: guests.length - invited,
      opened: guests.filter((g) => g.opened_confirmed_count > 0).length,
      answered,
      unanswered,
    };
  }, [guests]);

  const wishVisibleCount = wishes?.filter((wish) => !wish.hidden).length ?? null;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = guests.filter((g) => {
      if (groupFilter !== "all" && g.guest_group !== groupFilter) return false;
      if (typeFilter !== "all" && g.invite_type !== typeFilter) return false;
      if (statusFilter === "belum" && g.invited_at !== null) return false;
      if (statusFilter === "sudah" && g.invited_at === null) return false;
      if (statusFilter === "dibuka" && g.opened_confirmed_count === 0) return false;
      if (statusFilter === "rsvp" && g.rsvp === null) return false;
      if (statusFilter === "unanswered" && (g.invited_at === null || g.rsvp !== null)) return false;
      if (q.length === 0) return true;
      return [
        g.display_name,
        g.slug,
        g.whatsapp_name ?? "",
        g.phone ?? "",
        g.notes ?? "",
        g.alternative_channel ?? "",
        g.reminder_note ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === "name") return a.display_name.localeCompare(b.display_name, "id");
      if (sortOrder === "uninvited") {
        const invitedDifference = Number(a.invited_at !== null) - Number(b.invited_at !== null);
        if (invitedDifference !== 0) return invitedDifference;
        return a.display_name.localeCompare(b.display_name, "id");
      }
      return b.created_at.localeCompare(a.created_at);
    });
  }, [guests, query, groupFilter, typeFilter, statusFilter, sortOrder]);

  const reloadWishes = async () => {
    setWishes(null);
    setWishesError("");
    const response = await dashboardRequest<{ wishes: WishRow[] }>("/api/dashboard/wishes");
    if (response.success && response.data?.wishes) {
      setWishes(response.data.wishes);
      setWishesError("");
      return;
    }
    setWishes([]);
    setWishesError(response.error?.message ?? "Ucapan belum bisa dimuat.");
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      push("Tersalin ke clipboard.");
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
    } catch {
      push("Browser menolak akses clipboard. Salin manual dari kotak pesan, ya.", "bad");
    }
  };

  const openNewForm = () => {
    setFormError("");
    setForm(emptyForm());
  };

  const openEditForm = (guest: GuestWithRsvp) => {
    setFormError("");
    setForm(formFromGuest(guest));
  };

  const closeForm = () => {
    setFormError("");
    setForm(null);
  };

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setGroupFilter("all");
    setTypeFilter("all");
    setSortOrder("newest");
  };

  // The duplicate-number check lives in the form, which asks for a tick rather
  // than silently rejecting the first Simpan and accepting an identical second.
  const saveForm = async () => {
    if (!form || busyId === "form") return;

    setBusyId("form");
    setFormError("");

    const template = templateFor({
      guest_group: form.guest_group,
      invite_type: form.invite_type,
    });
    const payload = {
      display_name: form.display_name,
      slug: form.slug.trim() || slugify(form.display_name),
      whatsapp_name: form.whatsapp_name,
      phone: form.phone,
      guest_group: form.guest_group,
      invite_type: form.invite_type,
      party_label: form.party_label,
      party_max: form.party_max,
      message_override: form.message.trim() === template.trim() ? null : form.message,
      notes: form.notes,
      alternative_channel: form.alternative_channel,
      reminder_note: form.reminder_note,
    };

    const body = form.id
      ? await dashboardRequest<{ guest: GuestRow }>(`/api/dashboard/guests/${form.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : await dashboardRequest<{ guest: GuestRow }>("/api/dashboard/guests", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    setBusyId(null);
    if (!body.success || !body.data?.guest) {
      setFormError(body.error?.message ?? "Gagal menyimpan tamu.");
      return;
    }

    const saved = body.data.guest;
    setGuests((list) =>
      form.id
        ? list.map((g) => (g.id === saved.id ? { ...saved, rsvp: g.rsvp } : g))
        : [{ ...saved, rsvp: null }, ...list],
    );
    setForm(null);
    push(form.id ? `${saved.display_name} diperbarui.` : `${saved.display_name} ditambahkan.`);
  };

  const setInvited = async (guest: GuestWithRsvp, invited: boolean) => {
    setBusyId(guest.id);
    const body = await dashboardRequest<{ guest: GuestRow }>(
      `/api/dashboard/guests/${guest.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ invited }),
      },
    );
    setBusyId(null);
    if (!body.success || !body.data?.guest) {
      push(body.error?.message ?? "Gagal memperbarui status.", "bad");
      return;
    }
    const saved = body.data.guest;
    setGuests((list) => list.map((g) => (g.id === saved.id ? { ...saved, rsvp: g.rsvp } : g)));
    setWaPromptId((current) => (current === guest.id ? null : current));
    push(
      invited
        ? `${guest.display_name} ditandai diundang.`
        : `Tanda diundang dilepas dari ${guest.display_name}.`,
    );
  };

  const toggleInvited = async (guest: GuestWithRsvp) => {
    await setInvited(guest, guest.invited_at === null);
  };

  const confirmRemove = async () => {
    const guest = pendingDelete;
    if (!guest) return;
    setBusyId(guest.id);
    const body = await dashboardRequest<null>(`/api/dashboard/guests/${guest.id}`, {
      method: "DELETE",
    });
    setBusyId(null);
    if (!body.success) {
      setPendingDelete(null);
      push(body.error?.message ?? "Gagal menghapus tamu.", "bad");
      return;
    }
    setGuests((list) => list.filter((g) => g.id !== guest.id));
    if (form?.id === guest.id) closeForm();
    setPendingDelete(null);
    push(`${guest.display_name} dihapus dari daftar.`);
  };

  const signOut = async () => {
    const response = await dashboardRequest<null>("/api/dashboard/session", { method: "DELETE" });
    if (!response.success) {
      push(response.error?.message ?? "Gagal keluar.", "bad");
      return;
    }
    window.location.reload();
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 pb-16">
      <DashboardHeader stats={stats} onSignOut={signOut} />

      <div
        className="mt-6 flex gap-1 rounded-full border border-border bg-surface/70 p-1"
        role="tablist"
        aria-label="Bagian dashboard"
      >
        {(
          [
            { id: "tamu" as const, label: "Tamu", count: stats.total },
            { id: "ucapan" as const, label: "Ucapan", count: wishVisibleCount },
          ] as const
        ).map((item) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(item.id)}
              className={`type-button flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-4 transition-colors ${
                selected ? "bg-ink text-paper" : "text-ink-soft hover:bg-cream"
              }`}
            >
              {item.label}
              {item.count !== null ? (
                <span
                  className={`rounded-full px-2 py-0.5 font-sans text-xs tabular-nums ${
                    selected ? "bg-paper/20 text-paper" : "bg-blush/40 text-ink"
                  }`}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {tab === "tamu" ? (
        <>
          <DashboardStats
            stats={stats}
            active={statusFilter}
            onSelect={setStatusFilter}
          />

          <GuestFilters
            searchRef={searchRef}
            query={query}
            onQueryChange={setQuery}
            statusFilter={statusFilter}
            groupFilter={groupFilter}
            onGroupChange={setGroupFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            onAddGuest={openNewForm}
            onReset={resetFilters}
          />

          <p className="type-meta mt-5">
            Menampilkan {visible.length} dari {guests.length} tamu
          </p>

          <ul className="mt-3 flex flex-col gap-4">
            {visible.map((guest) => (
              <GuestCard
                key={guest.id}
                guest={guest}
                busy={busyId === guest.id}
                copied={copied}
                showWaPrompt={waPromptId === guest.id}
                onToggleInvited={() => toggleInvited(guest)}
                onMarkInvited={() => setInvited(guest, true)}
                onDismissWaPrompt={() => setWaPromptId(null)}
                onWaClick={() => {
                  if (guest.invited_at === null) setWaPromptId(guest.id);
                }}
                onCopy={copy}
                onEdit={() => openEditForm(guest)}
                onRemove={() => setPendingDelete(guest)}
              />
            ))}
          </ul>

          {/* An empty list is either "nothing here yet" or "your filter hid it".
              Those need different next steps, so each gets its own button. */}
          {visible.length === 0 ? (
            <div className="mt-10 flex flex-col items-center gap-4 text-center">
              <p className="type-body">
                {guests.length === 0
                  ? "Belum ada tamu di daftar."
                  : statusFilter === "belum"
                    ? "Semua tamu sudah ditandai diundang."
                    : statusFilter === "unanswered"
                      ? "Tidak ada yang menunggu balasan."
                      : statusFilter === "dibuka"
                        ? "Belum ada tamu yang membuka undangan."
                        : statusFilter === "rsvp"
                          ? "Belum ada konfirmasi kehadiran."
                          : "Tidak ada tamu yang cocok dengan saringan ini."}
              </p>
              {guests.length === 0 ? (
                <button
                  type="button"
                  onClick={openNewForm}
                  className="type-button min-h-[48px] rounded-full bg-ink px-6 text-paper"
                >
                  Tambah tamu pertama
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="type-button min-h-[48px] rounded-full border border-border px-6"
                >
                  Tampilkan semua tamu
                </button>
              )}
            </div>
          ) : null}
        </>
      ) : (
        <WishesModeration
          wishes={wishes}
          loadError={wishesError}
          onReload={reloadWishes}
          onWishesChange={setWishes}
        />
      )}

      {/* Overlays live at the root so they float above the list regardless of
          which guest, three screens down, opened them. */}
      {form ? (
        <GuestForm
          form={form}
          guests={guests}
          onChange={setForm}
          onSubmit={saveForm}
          onCancel={closeForm}
          busy={busyId === "form"}
          error={formError}
        />
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          title="Hapus tamu"
          body={`${pendingDelete.display_name} akan dihapus dari daftar, beserta tautan undangannya. Tindakan ini tidak bisa dibatalkan.`}
          confirmLabel="Hapus tamu"
          busyLabel="Menghapus…"
          busy={busyId === pendingDelete.id}
          onConfirm={confirmRemove}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}

      <ToastHost toasts={toasts} onDismiss={dismiss} />
    </main>
  );
};
