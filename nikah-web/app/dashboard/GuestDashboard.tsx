"use client";

/**
 * The guest dashboard.
 *
 * One screen, mobile-first, because the WhatsApp button is tapped from a phone:
 * `wa.me` opens the app with the message already typed, and the couple taps
 * send. The browser cannot send it for them, so "Sudah diundang" is a manual
 * checkbox rather than something inferred from the click.
 *
 * The message box holds the template with its `{nama}` / `{link}` placeholders
 * and shows the resolved text underneath, so an edited message keeps working
 * if the guest's name or slug changes later.
 */
import { useMemo, useState } from "react";
import { GUEST_GROUPS, INVITE_TYPES } from "@/lib/db.types";
import type { GuestGroup, GuestRow, GuestWithRsvp, InviteType } from "@/lib/db.types";
import { dashboardRequest } from "@/lib/dashboardClient";
import { formatPhone, normalizePhone, whatsappLink } from "@/lib/phone";
import { guestLink, renderMessage, templateFor } from "@/lib/waTemplates";
import { slugify } from "@/lib/slug";
import { WishesModeration } from "./WishesModeration";

const GROUP_LABEL: Record<GuestGroup, string> = {
  groom_family: "Keluarga Bashara",
  bride_family: "Keluarga Hanifah",
  friend: "Teman",
};

const TYPE_LABEL: Record<InviteType, string> = {
  venue: "Hadir di Bandung",
  online: "Siaran langsung",
};

type StatusFilter = "all" | "belum" | "sudah" | "dibuka" | "rsvp" | "unanswered";
type SortOrder = "newest" | "name" | "uninvited";

const STATUS_LABEL: Record<StatusFilter, string> = {
  all: "Semua",
  belum: "Belum diundang",
  sudah: "Sudah diundang",
  dibuka: "Sudah dibuka",
  rsvp: "Sudah konfirmasi",
  unanswered: "Belum dibalas",
};

const SORT_LABEL: Record<SortOrder, string> = {
  newest: "Terbaru",
  name: "Nama A–Z",
  uninvited: "Belum diundang dulu",
};

type FormState = {
  id: string | null;
  display_name: string;
  slug: string;
  whatsapp_name: string;
  phone: string;
  guest_group: GuestGroup;
  invite_type: InviteType;
  party_label: string;
  party_max: number;
  message: string;
  notes: string;
  alternative_channel: string;
  reminder_note: string;
};

const emptyForm = (): FormState => ({
  id: null,
  display_name: "",
  slug: "",
  whatsapp_name: "",
  phone: "",
  guest_group: "friend",
  invite_type: "venue",
  party_label: "",
  party_max: 2,
  message: templateFor({ guest_group: "friend", invite_type: "venue" }),
  notes: "",
  alternative_channel: "",
  reminder_note: "",
});

const formFromGuest = (guest: GuestWithRsvp): FormState => ({
  id: guest.id,
  display_name: guest.display_name,
  slug: guest.slug,
  whatsapp_name: guest.whatsapp_name ?? "",
  phone: guest.phone ?? "",
  guest_group: guest.guest_group,
  invite_type: guest.invite_type,
  party_label: guest.party_label,
  party_max: guest.party_max,
  message: guest.message_override || templateFor(guest),
  notes: guest.notes ?? "",
  alternative_channel: guest.alternative_channel ?? "",
  reminder_note: guest.reminder_note ?? "",
});

const inputClass =
  "min-h-[48px] w-full rounded-2xl border border-border bg-surface px-4 font-sans text-base text-ink";

const Chip = ({ children, tone = "quiet" }: { children: React.ReactNode; tone?: "quiet" | "on" }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 font-sans text-xs ${
      tone === "on" ? "bg-blush/45 text-ink" : "border border-border bg-surface text-ink-soft"
    }`}
  >
    {children}
  </span>
);

export const GuestDashboard = ({ initialGuests }: { initialGuests: GuestWithRsvp[] }) => {
  const [guests, setGuests] = useState<GuestWithRsvp[]>(initialGuests);
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<GuestGroup | "all">("all");
  const [typeFilter, setTypeFilter] = useState<InviteType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [form, setForm] = useState<FormState | null>(null);
  const [duplicateApproval, setDuplicateApproval] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  const stats = useMemo(
    () => ({
      total: guests.length,
      invited: guests.filter((g) => g.invited_at !== null).length,
      opened: guests.filter((g) => g.opened_confirmed_count > 0).length,
      answered: guests.filter((g) => g.rsvp !== null).length,
    }),
    [guests],
  );

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

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
    } catch {
      setError("Browser menolak akses clipboard. Salin manual dari kotak pesan, ya.");
    }
  };

  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || busyId === "form") return;

    const normalized = normalizePhone(form.phone);
    const duplicateNames = normalized
      ? guests
          .filter((guest) => guest.id !== form.id && guest.phone === normalized)
          .map((guest) => guest.display_name)
      : [];
    const duplicateKey = `${form.id ?? "new"}:${normalized ?? ""}`;
    if (duplicateNames.length > 0 && duplicateApproval !== duplicateKey) {
      setDuplicateApproval(duplicateKey);
      setError(
        `Nomor ini juga dipakai ${duplicateNames.join(", ")}. Tekan Simpan sekali lagi jika memang benar.`,
      );
      return;
    }

    setBusyId("form");
    setError("");

    // An untouched message keeps following the group template instead of
    // freezing a copy of it.
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
      setError(body.error?.message ?? "Gagal menyimpan tamu.");
      return;
    }

    const saved = body.data.guest;
    setGuests((list) =>
      form.id
        ? list.map((g) => (g.id === saved.id ? { ...saved, rsvp: g.rsvp } : g))
        : [{ ...saved, rsvp: null }, ...list],
    );
    setDuplicateApproval(null);
    setForm(null);
  };

  const toggleInvited = async (guest: GuestWithRsvp) => {
    setBusyId(guest.id);
    setError("");
    const body = await dashboardRequest<{ guest: GuestRow }>(
      `/api/dashboard/guests/${guest.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ invited: guest.invited_at === null }),
      },
    );
    setBusyId(null);
    if (!body.success || !body.data?.guest) {
      setError(body.error?.message ?? "Gagal memperbarui status.");
      return;
    }
    const saved = body.data.guest;
    setGuests((list) => list.map((g) => (g.id === saved.id ? { ...saved, rsvp: g.rsvp } : g)));
  };

  const remove = async (guest: GuestWithRsvp) => {
    if (!window.confirm(`Hapus ${guest.display_name} dari daftar tamu?`)) return;
    setBusyId(guest.id);
    setError("");
    const body = await dashboardRequest<null>(`/api/dashboard/guests/${guest.id}`, {
      method: "DELETE",
    });
    setBusyId(null);
    if (!body.success) {
      setError(body.error?.message ?? "Gagal menghapus tamu.");
      return;
    }
    setGuests((list) => list.filter((g) => g.id !== guest.id));
  };

  const signOut = async () => {
    const response = await dashboardRequest<null>("/api/dashboard/session", { method: "DELETE" });
    if (!response.success) {
      setError(response.error?.message ?? "Gagal keluar.");
      return;
    }
    window.location.reload();
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="type-display">Daftar Tamu</h1>
          <p className="type-meta mt-1">
            {stats.total} tamu · {stats.invited} sudah diundang · {stats.opened} membuka ·{" "}
            {stats.answered} konfirmasi
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <details className="relative">
            <summary className="type-button flex min-h-[44px] cursor-pointer list-none items-center rounded-full border border-border px-4">
              Unduh CSV
            </summary>
            <div className="absolute right-0 z-20 mt-2 flex min-w-44 flex-col gap-1 rounded-2xl border border-border bg-paper p-2 shadow-float">
              {(["guests", "rsvps", "wishes"] as const).map((table) => (
                <a
                  key={table}
                  href={`/api/dashboard/export?table=${table}`}
                  className="type-button inline-flex min-h-[44px] items-center rounded-xl px-3 hover:bg-blush/25"
                >
                  {table === "guests" ? "Daftar tamu" : table === "rsvps" ? "RSVP" : "Ucapan"}
                </a>
              ))}
            </div>
          </details>
          <button type="button" onClick={signOut} className="type-button min-h-[44px] px-4 underline">
            Keluar
          </button>
        </div>
      </header>

      <WishesModeration />

      <div className="mt-6 flex flex-col gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama, slug, atau nomor"
          aria-label="Cari tamu"
          className={inputClass}
        />
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Saring kelompok"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value as GuestGroup | "all")}
            className="min-h-[44px] rounded-full border border-border bg-surface px-4 font-sans text-sm"
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
            onChange={(e) => setTypeFilter(e.target.value as InviteType | "all")}
            className="min-h-[44px] rounded-full border border-border bg-surface px-4 font-sans text-sm"
          >
            <option value="all">Semua jenis</option>
            {INVITE_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABEL[t]}
              </option>
            ))}
          </select>
          <select
            aria-label="Saring status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="min-h-[44px] rounded-full border border-border bg-surface px-4 font-sans text-sm"
          >
            {(Object.keys(STATUS_LABEL) as StatusFilter[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <select
            aria-label="Urutkan tamu"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="min-h-[44px] rounded-full border border-border bg-surface px-4 font-sans text-sm"
          >
            {(Object.keys(SORT_LABEL) as SortOrder[]).map((order) => (
              <option key={order} value={order}>
                {SORT_LABEL[order]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setStatusFilter("unanswered")}
            className="type-button min-h-[44px] rounded-full border border-border px-4"
          >
            Belum dibalas
          </button>
          <button
            type="button"
            onClick={() => {
              setDuplicateApproval(null);
              setForm(emptyForm());
            }}
            className="type-button ml-auto min-h-[44px] rounded-full bg-ink px-6 text-paper"
          >
            Tambah tamu
          </button>
        </div>
      </div>

      {error ? (
        <p aria-live="polite" className="type-body mt-4 rounded-2xl bg-blush/40 p-4 text-alert">
          {error}
        </p>
      ) : null}

      {form ? (
        <form
          onSubmit={saveForm}
          className="mt-6 flex flex-col gap-4 rounded-3xl border border-border bg-surface/80 p-5"
        >
          <h2 className="type-name">{form.id ? "Ubah tamu" : "Tamu baru"}</h2>

          <label className="type-label" htmlFor="display_name">
            Nama di undangan (tulis lengkap dengan sapaan)
          </label>
          <input
            id="display_name"
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            placeholder="Bapak Achmad Fuad Bay"
            required
            maxLength={120}
            className={inputClass}
          />

          <label className="type-label" htmlFor="slug">
            Slug tautan
          </label>
          <div className="flex gap-2">
            <input
              id="slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="bapak-achmad"
              maxLength={80}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, slug: slugify(form.display_name) })}
              className="type-button min-h-[48px] shrink-0 rounded-2xl border border-border px-4"
            >
              Dari nama
            </button>
          </div>
          <p className="type-meta break-all">{guestLink(form.slug || "slug")}</p>

          <label className="type-label" htmlFor="whatsapp_name">
            Nama sapaan di WhatsApp (opsional)
          </label>
          <input
            id="whatsapp_name"
            value={form.whatsapp_name}
            onChange={(e) => setForm({ ...form, whatsapp_name: e.target.value })}
            placeholder="Om Fuad"
            maxLength={120}
            className={inputClass}
          />

          <label className="type-label" htmlFor="phone">
            Nomor WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            value={form.phone}
             onChange={(e) => {
               setDuplicateApproval(null);
               setForm({ ...form, phone: e.target.value });
             }}
            placeholder="0812… atau +81 90…"
            maxLength={32}
            className={inputClass}
          />
          <p className="type-meta">
            {form.phone.trim().length === 0
              ? "Nomor luar Indonesia: tulis dengan tanda + di depan."
              : (normalizePhone(form.phone)
                  ? `Tersimpan sebagai ${formatPhone(normalizePhone(form.phone))}`
                  : "Nomor ini belum terbaca sebagai nomor yang sah.")}
          </p>

          <label className="type-label" htmlFor="alternative_channel">
            Kanal lain jika tanpa WhatsApp
          </label>
          <input
            id="alternative_channel"
            value={form.alternative_channel}
            onChange={(e) => setForm({ ...form, alternative_channel: e.target.value })}
            placeholder="Instagram @nama, SMS, atau disampaikan langsung"
            maxLength={120}
            className={inputClass}
          />

          <div className="flex flex-wrap gap-3">
            <div className="flex-1">
              <label className="type-label" htmlFor="guest_group">
                Kelompok
              </label>
              <select
                id="guest_group"
                value={form.guest_group}
                onChange={(e) => {
                  const guest_group = e.target.value as GuestGroup;
                  const wasTemplate =
                    form.message.trim() ===
                    templateFor({ guest_group: form.guest_group, invite_type: form.invite_type })
                      .trim();
                  setForm({
                    ...form,
                    guest_group,
                    // Only swap the text when it is still the untouched template.
                    message: wasTemplate
                      ? templateFor({ guest_group, invite_type: form.invite_type })
                      : form.message,
                  });
                }}
                className={inputClass}
              >
                {GUEST_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {GROUP_LABEL[g]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="type-label" htmlFor="invite_type">
                Jenis undangan
              </label>
              <select
                id="invite_type"
                value={form.invite_type}
                onChange={(e) => {
                  const invite_type = e.target.value as InviteType;
                  const wasTemplate =
                    form.message.trim() ===
                    templateFor({ guest_group: form.guest_group, invite_type: form.invite_type })
                      .trim();
                  setForm({
                    ...form,
                    invite_type,
                    message: wasTemplate
                      ? templateFor({ guest_group: form.guest_group, invite_type })
                      : form.message,
                  });
                }}
                className={inputClass}
              >
                {INVITE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="type-label" htmlFor="party_label">
            Keterangan rombongan
          </label>
          <div className="flex gap-2">
            <input
              id="party_label"
              value={form.party_label}
              onChange={(e) => setForm({ ...form, party_label: e.target.value })}
              placeholder="Beserta Keluarga"
              maxLength={60}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, party_label: "Beserta Keluarga" })}
              className="type-button min-h-[48px] shrink-0 rounded-2xl border border-border px-4"
            >
              Keluarga
            </button>
          </div>

          <label className="type-label" htmlFor="party_max">
            Maksimal orang yang bisa dikonfirmasi
          </label>
          <input
            id="party_max"
            type="number"
            min={1}
            max={10}
            value={form.party_max}
            onChange={(e) => setForm({ ...form, party_max: Number(e.target.value) })}
            className={inputClass}
          />

          <label className="type-label" htmlFor="message">
            Pesan WhatsApp
          </label>
          <textarea
            id="message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={12}
            maxLength={1500}
            className="w-full rounded-2xl border border-border bg-surface p-4 font-sans text-sm leading-relaxed text-ink"
          />
          <p className="type-meta">
            {"{nama}"} dan {"{link}"} diisi otomatis. Kosongkan perubahan untuk kembali memakai
            template kelompok.
          </p>

          <label className="type-label" htmlFor="notes">
            Catatan pribadi (tidak dilihat tamu)
          </label>
          <input
            id="notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            maxLength={500}
            className={inputClass}
          />

          <label className="type-label" htmlFor="reminder_note">
            Catatan kirim ulang
          </label>
          <input
            id="reminder_note"
            value={form.reminder_note}
            onChange={(e) => setForm({ ...form, reminder_note: e.target.value })}
            placeholder="Contoh: ingatkan lagi 12 Agustus lewat Instagram"
            maxLength={300}
            className={inputClass}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busyId === "form"}
              className="type-button min-h-[48px] flex-1 rounded-full bg-ink px-6 text-paper disabled:opacity-70"
            >
              {busyId === "form" ? "Menyimpan…" : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => {
                setDuplicateApproval(null);
                setForm(null);
              }}
              className="type-button min-h-[48px] rounded-full border border-border px-6"
            >
              Batal
            </button>
          </div>
        </form>
      ) : null}

      <ul className="mt-6 flex flex-col gap-4">
        {visible.map((guest) => {
          const message = renderMessage(guest);
          const wa = whatsappLink(guest.phone, message);
          const link = guestLink(guest.slug);
          return (
            <li
              key={guest.id}
              className="flex flex-col gap-3 rounded-3xl border border-border bg-surface/70 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="type-name">{guest.display_name}</p>
                  {guest.party_label ? <p className="type-meta">{guest.party_label}</p> : null}
                  <p className="type-meta break-all">/undangan/{guest.slug}</p>
                </div>
                <label className="flex min-h-[44px] items-center gap-2 rounded-xl px-2 font-sans text-sm">
                  <input
                    type="checkbox"
                    checked={guest.invited_at !== null}
                    disabled={busyId === guest.id}
                    onChange={() => toggleInvited(guest)}
                    className="h-5 w-5 accent-[color:var(--color-dusty-deep,#8a6f7b)]"
                  />
                  Sudah diundang
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <Chip>{GROUP_LABEL[guest.guest_group]}</Chip>
                <Chip tone={guest.invite_type === "venue" ? "on" : "quiet"}>
                  {TYPE_LABEL[guest.invite_type]}
                </Chip>
                {guest.phone ? <Chip>{formatPhone(guest.phone)}</Chip> : <Chip>Tanpa nomor</Chip>}
                {guest.opened_confirmed_count > 0 ? (
                  <span title={`Permintaan halaman mentah: ${guest.opened_count}× (perkiraan, termasuk pratinjau)`}>
                    <Chip tone="on">Dibuka {guest.opened_confirmed_count}×</Chip>
                  </span>
                ) : guest.invited_at ? (
                  <span title={`Permintaan halaman mentah: ${guest.opened_count}× (perkiraan, termasuk pratinjau)`}>
                    <Chip>Belum dibuka</Chip>
                  </span>
                ) : null}
                {guest.rsvp ? (
                  <Chip tone="on">
                    {guest.rsvp.kehadiran}
                    {guest.invite_type === "venue" ? ` · ${guest.rsvp.jumlah} orang` : ""}
                  </Chip>
                ) : null}
              </div>

              {guest.rsvp?.catatan ? <p className="type-body">“{guest.rsvp.catatan}”</p> : null}
              {guest.notes ? <p className="type-meta">Catatan: {guest.notes}</p> : null}
              {guest.alternative_channel ? (
                <p className="type-meta">Kanal lain: {guest.alternative_channel}</p>
              ) : null}
              {guest.reminder_note ? (
                <p className="type-meta">Kirim ulang: {guest.reminder_note}</p>
              ) : null}
              {!guest.phone && !guest.alternative_channel ? (
                <p className="type-meta text-alert">Belum ada kanal pengiriman.</p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-button inline-flex min-h-[44px] items-center rounded-full bg-ink px-5 text-paper"
                  >
                    Kirim WhatsApp
                  </a>
                ) : (
                  <span className="type-button inline-flex min-h-[44px] items-center rounded-full border border-border px-5 text-ink-soft opacity-70">
                    Nomor belum diisi
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => copy(`link-${guest.id}`, link)}
                  className="type-button min-h-[44px] rounded-full border border-border px-5"
                >
                  {copied === `link-${guest.id}` ? "Tersalin" : "Salin link"}
                </button>
                <button
                  type="button"
                  onClick={() => copy(`text-${guest.id}`, message)}
                  className="type-button min-h-[44px] rounded-full border border-border px-5"
                >
                  {copied === `text-${guest.id}` ? "Tersalin" : "Salin teks"}
                </button>
                <a
                  href={`/undangan/${guest.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-button inline-flex min-h-[44px] items-center rounded-full border border-border px-5"
                >
                  Lihat
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setDuplicateApproval(null);
                    setForm(formFromGuest(guest));
                  }}
                  className="type-button min-h-[44px] rounded-full border border-border px-5"
                >
                  Ubah
                </button>
                <button
                  type="button"
                  onClick={() => remove(guest)}
                  disabled={busyId === guest.id}
                  className="type-button min-h-[44px] rounded-full px-5 text-alert underline disabled:opacity-60"
                >
                  Hapus
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 ? (
        <p className="type-body mt-10 text-center">
          {guests.length === 0
            ? "Belum ada tamu. Mulai dari tombol “Tambah tamu”."
            : "Tidak ada tamu yang cocok dengan saringan ini."}
        </p>
      ) : null}
    </main>
  );
};
