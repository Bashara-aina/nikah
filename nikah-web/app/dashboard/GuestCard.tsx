"use client";

import type { GuestFlag, GuestWithRsvp } from "@/lib/db.types";
import { formatPhone, whatsappLink } from "@/lib/phone";
import { rsvpState } from "@/lib/rsvpSummary";
import { guestLink, renderMessage } from "@/lib/waTemplates";
import {
  AttendanceBadge,
  Chip,
  GROUP_LABEL,
  TYPE_LABEL,
  formatDateTime,
  formatDay,
} from "./dashboardShared";

type GuestCardProps = {
  guest: GuestWithRsvp;
  busy: boolean;
  copied: string | null;
  showWaPrompt: boolean;
  onToggleFlag: (flag: GuestFlag) => void;
  onMarkInvited: () => void;
  onDismissWaPrompt: () => void;
  onWaClick: () => void;
  onCopy: (key: string, text: string) => void;
  onEdit: () => void;
  onRemove: () => void;
};

const FlagCheck = ({
  label,
  checked,
  stampedAt,
  busy,
  onChange,
  ariaLabel,
}: {
  label: string;
  checked: boolean;
  stampedAt: string | null;
  busy: boolean;
  onChange: () => void;
  ariaLabel: string;
}) => (
  <label className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl px-2 font-sans text-sm">
    <input
      type="checkbox"
      checked={checked}
      disabled={busy}
      onChange={onChange}
      aria-label={ariaLabel}
      className="h-5 w-5 accent-[color:var(--color-dusty-deep,#8a6f7b)]"
    />
    <span>
      {label}
      {checked && stampedAt ? (
        <span className="type-meta block leading-tight">{formatDay(stampedAt)}</span>
      ) : null}
    </span>
  </label>
);

export const GuestCard = ({
  guest,
  busy,
  copied,
  showWaPrompt,
  onToggleFlag,
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
  const invited = guest.invited_at != null;
  const attended = guest.attended_at != null;
  const souvenir = guest.souvenir_at != null;
  const state = rsvpState(guest);

  return (
    <li className="flex flex-col gap-3 rounded-3xl border border-border bg-surface/70 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="type-name">{guest.display_name}</p>
          {guest.party_label ? <p className="type-meta">{guest.party_label}</p> : null}
          <p className="type-meta break-all">/undangan/{guest.slug}</p>
        </div>
        {/* Day-of ops: send → arrive → souvenir. Dates make each claim auditable. */}
        <div className="flex flex-col items-stretch gap-1 sm:items-end">
          <FlagCheck
            label="Sudah diundang"
            checked={invited}
            stampedAt={guest.invited_at}
            busy={busy}
            onChange={() => onToggleFlag("invited")}
            ariaLabel={`Tandai ${guest.display_name} sudah diundang`}
          />
          <FlagCheck
            label="Kedatangan"
            checked={attended}
            stampedAt={guest.attended_at}
            busy={busy}
            onChange={() => onToggleFlag("attended")}
            ariaLabel={`Tandai ${guest.display_name} sudah datang`}
          />
          <FlagCheck
            label="Souvenir"
            checked={souvenir}
            stampedAt={guest.souvenir_at}
            busy={busy}
            onChange={() => onToggleFlag("souvenir")}
            ariaLabel={`Tandai ${guest.display_name} sudah ambil souvenir`}
          />
        </div>
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
      </div>

      {/* RSVP gets its own block rather than a chip in the row above. "Has this
          person answered yet" is the question the couple opens this page to
          settle, and a missing chip is not an answer — the empty state has to
          say so out loud, and say whose move it is. */}
      {guest.rsvp ? (
        <div className="rounded-2xl border border-border bg-paper/60 p-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="type-label">Sudah RSVP</span>
            <AttendanceBadge
              kehadiran={guest.rsvp.kehadiran}
              jumlah={guest.invite_type === "venue" ? guest.rsvp.jumlah : undefined}
            />
          </div>
          {guest.rsvp.catatan ? (
            <p className="type-body mt-2">“{guest.rsvp.catatan}”</p>
          ) : null}
          <p className="type-meta mt-1">Dijawab {formatDateTime(guest.rsvp.created_at)}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-4">
          <p className="type-label">Belum RSVP</p>
          <p className="type-meta mt-1">
            {state === "waiting"
              ? `Undangan terkirim ${formatDay(guest.invited_at)} — menunggu balasan.`
              : "Undangannya belum dikirim."}
          </p>
        </div>
      )}

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
