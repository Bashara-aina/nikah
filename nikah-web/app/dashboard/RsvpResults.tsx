"use client";

/**
 * The RSVP tab: what the guests answered, and who still owes an answer.
 *
 * The guest list answers "have I sent this one yet". This view answers the
 * question that outranks it once the invitations are out — how many people are
 * actually coming — so it leads with the head count rather than the guest count,
 * and keeps the chasing list on the same screen instead of a filter away.
 */
import { useMemo, useState } from "react";
import { ATTENDANCE, type Attendance, type DashboardRsvp, type GuestWithRsvp } from "@/lib/db.types";
import { formatPhone, whatsappLink } from "@/lib/phone";
import { countGuests, rsvpState, summarizeReplies } from "@/lib/rsvpSummary";
import { renderMessage } from "@/lib/waTemplates";
import {
  ATTENDANCE_SHORT,
  AttendanceBadge,
  AttendanceDot,
  Chip,
  GROUP_LABEL,
  formatDateTime,
  formatDay,
  inputClass,
} from "./dashboardShared";

type RsvpResultsProps = {
  guests: GuestWithRsvp[];
  replies: DashboardRsvp[] | null;
  loadError: string;
  /** Refreshes the whole page; the header owns the everyday reload. */
  onRetry: () => void;
};

type AttendanceFilter = Attendance | "all";

export const RsvpResults = ({ guests, replies, loadError, onRetry }: RsvpResultsProps) => {
  const [attendance, setAttendance] = useState<AttendanceFilter>("all");
  const [query, setQuery] = useState("");
  const [showRevisions, setShowRevisions] = useState(false);

  const loading = replies === null && loadError.length === 0;
  const summary = useMemo(() => summarizeReplies(replies ?? []), [replies]);
  const counts = useMemo(() => countGuests(guests), [guests]);
  const waiting = useMemo(() => guests.filter((guest) => rsvpState(guest) === "waiting"), [guests]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (replies ?? []).filter((reply) => {
      if (reply.superseded && !showRevisions) return false;
      if (attendance !== "all" && reply.kehadiran !== attendance) return false;
      if (q.length === 0) return true;
      return [reply.nama, reply.catatan, reply.guest?.display_name ?? "", reply.guest?.slug ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [replies, attendance, query, showRevisions]);

  return (
    <section className="mt-6" aria-label="Balasan RSVP">
      <h2 className="type-display-sm">Balasan RSVP</h2>
      {/* Counted from the guest list, which is already on the page — this line
          stays truthful while the replies are still in flight. */}
      <p className="type-meta mt-1">
        {`${counts.answered} dari ${counts.total} tamu sudah menjawab · ${counts.unanswered} masih ditunggu`}
      </p>
      <p className="type-meta mt-1">
        {`Pax diundang ${counts.paxInvited} · Pax RSVP ${counts.paxRsvp}`}
      </p>

      {loadError ? (
        <div className="mt-6 rounded-2xl bg-blush/40 p-5 text-center">
          <p className="type-body mx-auto text-alert">{loadError}</p>
          <button
            type="button"
            onClick={onRetry}
            className="type-button mt-3 min-h-[44px] rounded-full border border-border bg-paper px-5"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      {loading ? <p className="type-body mt-6 text-center text-ink-soft">Memuat balasan…</p> : null}

      {replies && !loadError ? (
        <>
          {/* The number the venue actually needs. Everything else on this screen
              is a way of checking it. */}
          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-sage/60 bg-sage/20 px-5 py-4">
            <div>
              <p className="type-label">Perkiraan hadir di Bandung</p>
              <p className="type-meta mt-1">{`Dari ${summary.byAttendance.Hadir} balasan “Hadir”`}</p>
            </div>
            <p className="shrink-0 whitespace-nowrap font-sans text-3xl font-medium tabular-nums text-ink">
              {summary.seats}{" "}
              <span className="type-meta">orang</span>
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-2" role="group" aria-label="Saring balasan">
            <button
              type="button"
              title="Tampilkan semua balasan"
              aria-pressed={attendance === "all"}
              onClick={() => setAttendance("all")}
              className={`flex min-h-[48px] items-center justify-between rounded-2xl border px-4 transition-colors ${
                attendance === "all"
                  ? "border-dusty bg-blush/40 text-ink"
                  : "border-border bg-surface/80 text-ink-soft hover:bg-cream"
              }`}
            >
              <span className="type-button">Semua balasan</span>
              <span className="font-sans text-xl font-medium tabular-nums text-ink">
                {summary.replies}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ATTENDANCE.map((value) => {
                const selected = attendance === value;
                return (
                  <button
                    key={value}
                    type="button"
                    title={value}
                    aria-pressed={selected}
                    onClick={() => setAttendance(value)}
                    className={`flex min-h-[64px] flex-col justify-center rounded-2xl border px-3 py-2 text-left transition-colors ${
                      selected
                        ? "border-dusty bg-blush/40 text-ink"
                        : "border-border bg-surface/80 text-ink-soft hover:bg-cream"
                    }`}
                  >
                    <span className="font-sans text-xl font-medium tabular-nums text-ink">
                      {summary.byAttendance[value]}
                    </span>
                    <span className="type-meta mt-0.5 flex items-center gap-1.5 leading-tight">
                      <AttendanceDot kehadiran={value} />
                      {ATTENDANCE_SHORT[value]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama atau isi pesan"
            aria-label="Cari balasan"
            className={`${inputClass} mt-3`}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="type-meta">
              Menampilkan {visible.length} dari {summary.replies} balasan
            </p>
            {summary.revisions > 0 ? (
              <button
                type="button"
                aria-pressed={showRevisions}
                onClick={() => setShowRevisions((value) => !value)}
                className="type-button min-h-[44px] rounded-full border border-border px-4"
              >
                {showRevisions
                  ? "Sembunyikan jawaban lama"
                  : `Jawaban lama (${summary.revisions})`}
              </button>
            ) : null}
          </div>

          {visible.length === 0 ? (
            <p className="type-body mt-8 text-center">
              {summary.replies === 0
                ? "Belum ada yang mengisi RSVP."
                : "Tidak ada balasan yang cocok dengan saringan ini."}
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {visible.map((reply) => (
                <ReplyCard key={reply.id} reply={reply} />
              ))}
            </ul>
          )}
        </>
      ) : null}

      {/* Who to chase. Sitting under the results rather than behind a filter,
          because "who has not answered" is the follow-up to every reading of
          the numbers above. */}
      {waiting.length > 0 ? (
        <div className="mt-10">
          <h3 className="type-label">Belum menjawab ({waiting.length})</h3>
          <p className="type-meta mt-1">
            Undangannya sudah dikirim. {counts.uninvited > 0
              ? `${counts.uninvited} tamu lain belum dikirimi undangan sama sekali.`
              : "Semua undangan lain sudah terkirim."}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {waiting.map((guest) => (
              <WaitingRow key={guest.id} guest={guest} />
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
};

const ReplyCard = ({ reply }: { reply: DashboardRsvp }) => {
  const name = reply.guest?.display_name ?? reply.nama;
  // The form pre-fills the guest's own name, so a different one means somebody
  // answered on their behalf — worth showing, never worth guessing about.
  const answeredBy = reply.nama.trim() !== name.trim() ? reply.nama : null;
  const venue = reply.guest === null || reply.guest.invite_type === "venue";

  return (
    <li
      className={`flex flex-col gap-2 rounded-2xl border border-border bg-surface/70 p-4 ${
        reply.superseded ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <AttendanceBadge
          kehadiran={reply.kehadiran}
          jumlah={venue && reply.kehadiran === "Hadir" ? reply.jumlah : undefined}
        />
        {reply.superseded ? <Chip>Sudah diganti</Chip> : null}
        {reply.guest === null ? (
          <Chip tone="warn" title="Balasan ini tidak terhubung ke satu pun tamu di daftar">
            Tanpa tautan tamu
          </Chip>
        ) : null}
      </div>

      <div>
        <p className="font-sans text-base font-medium text-ink">{name}</p>
        <p className="type-meta">
          {reply.guest ? (
            <>
              {GROUP_LABEL[reply.guest.guest_group]} · /undangan/{reply.guest.slug}
            </>
          ) : (
            "Dikirim dari tautan umum atau tamu yang sudah dihapus"
          )}
        </p>
        {answeredBy ? <p className="type-meta">Diisi atas nama: {answeredBy}</p> : null}
      </div>

      {reply.catatan ? <p className="type-body">“{reply.catatan}”</p> : null}
      <p className="type-meta">{formatDateTime(reply.created_at)}</p>
    </li>
  );
};

const WaitingRow = ({ guest }: { guest: GuestWithRsvp }) => {
  const wa = whatsappLink(guest.phone, renderMessage(guest));

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface/70 px-4 py-3">
      <div className="min-w-0">
        <p className="font-sans text-base text-ink">{guest.display_name}</p>
        <p className="type-meta">
          {GROUP_LABEL[guest.guest_group]} · dikirim {formatDay(guest.invited_at)}
          {guest.opened_confirmed_count > 0 ? " · sudah dibuka" : " · belum dibuka"}
        </p>
      </div>
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="type-button inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-border px-4"
        >
          Kirim ulang
        </a>
      ) : (
        <span className="type-meta shrink-0">
          {guest.alternative_channel || (guest.phone ? formatPhone(guest.phone) : "Tanpa nomor")}
        </span>
      )}
    </li>
  );
};
