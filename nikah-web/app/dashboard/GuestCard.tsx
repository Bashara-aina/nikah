"use client";

import type { GuestWithRsvp } from "@/lib/db.types";
import { formatPhone, whatsappLink } from "@/lib/phone";
import { guestLink, renderMessage } from "@/lib/waTemplates";
import { Chip, GROUP_LABEL, TYPE_LABEL, formatDay } from "./dashboardShared";

type GuestCardProps = {
  guest: GuestWithRsvp;
  busy: boolean;
  copied: string | null;
  showWaPrompt: boolean;
  onToggleInvited: () => void;
  onMarkInvited: () => void;
  onDismissWaPrompt: () => void;
  onWaClick: () => void;
  onCopy: (key: string, text: string) => void;
  onEdit: () => void;
  onRemove: () => void;
};

export const GuestCard = ({
  guest,
  busy,
  copied,
  showWaPrompt,
  onToggleInvited,
  onMarkInvited,
  onDismissWaPrompt,
  onWaClick,
  onCopy,
  onEdit,
  onRemove,
}: GuestCardProps) => {
  const message = renderMessage(guest);
  const wa = whatsappLink(guest.phone, message);
  const link = guestLink(guest.slug);
  const invited = guest.invited_at !== null;

  return (
    <li className="flex flex-col gap-3 rounded-3xl border border-border bg-surface/70 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="type-name">{guest.display_name}</p>
          {guest.party_label ? <p className="type-meta">{guest.party_label}</p> : null}
          <p className="type-meta break-all">/undangan/{guest.slug}</p>
        </div>
        {/* The couple sends from WhatsApp by hand, so this is a claim they make,
            not something the click can prove. The date makes the claim auditable. */}
        <label className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl px-2 font-sans text-sm">
          <input
            type="checkbox"
            checked={invited}
            disabled={busy}
            onChange={onToggleInvited}
            aria-label={`Tandai ${guest.display_name} sudah diundang`}
            className="h-5 w-5 accent-[color:var(--color-dusty-deep,#8a6f7b)]"
          />
          <span>
            Sudah diundang
            {invited && guest.invited_at ? (
              <span className="type-meta block leading-tight">{formatDay(guest.invited_at)}</span>
            ) : null}
          </span>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip>{GROUP_LABEL[guest.guest_group]}</Chip>
        <Chip tone={guest.invite_type === "venue" ? "on" : "quiet"}>
          {TYPE_LABEL[guest.invite_type]}
        </Chip>
        {guest.phone ? (
          <Chip>{formatPhone(guest.phone)}</Chip>
        ) : (
          <Chip tone={guest.alternative_channel ? "quiet" : "warn"}>Tanpa nomor</Chip>
        )}
        {guest.opened_confirmed_count > 0 ? (
          <span
            title={`Permintaan halaman mentah: ${guest.opened_count}× (perkiraan, termasuk pratinjau)`}
          >
            <Chip tone="on">Dibuka {guest.opened_confirmed_count}×</Chip>
          </span>
        ) : invited ? (
          <span
            title={`Permintaan halaman mentah: ${guest.opened_count}× (perkiraan, termasuk pratinjau)`}
          >
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

      {showWaPrompt && !invited ? (
        <div
          role="status"
          className="flex flex-col gap-2 rounded-2xl border border-dusty/40 bg-blush/30 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="type-body">Sudah terkirim? Tandai sebagai diundang.</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={onMarkInvited}
              className="type-button min-h-[44px] rounded-full bg-ink px-5 text-paper disabled:opacity-70"
            >
              Tandai diundang
            </button>
            <button
              type="button"
              onClick={onDismissWaPrompt}
              className="type-button min-h-[44px] rounded-full border border-border px-5"
            >
              Nanti
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWaClick}
              className="type-button inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-ink px-5 text-paper sm:flex-none"
            >
              Kirim WhatsApp
            </a>
          ) : (
            <span className="type-button inline-flex min-h-[48px] items-center rounded-full border border-border px-5 text-ink-soft opacity-70">
              Nomor belum diisi
            </span>
          )}
          <button
            type="button"
            onClick={() => onCopy(`link-${guest.id}`, link)}
            className="type-button min-h-[44px] rounded-full border border-border px-5"
          >
            {copied === `link-${guest.id}` ? "Tersalin" : "Salin link"}
          </button>
          <button
            type="button"
            onClick={() => onCopy(`text-${guest.id}`, message)}
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
        </div>

        <details className="rounded-2xl border border-border/70 bg-paper/40">
          <summary className="type-button flex min-h-[44px] cursor-pointer list-none items-center px-4 text-ink-soft">
            Lainnya
          </summary>
          <div className="flex flex-wrap gap-2 border-t border-border/60 px-3 py-3">
            <button
              type="button"
              onClick={onEdit}
              className="type-button min-h-[44px] rounded-full border border-border px-5"
            >
              Ubah
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={busy}
              className="type-button min-h-[44px] rounded-full px-5 text-alert underline disabled:opacity-60"
            >
              Hapus
            </button>
          </div>
        </details>
      </div>
    </li>
  );
};
