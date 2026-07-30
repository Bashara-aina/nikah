"use client";

/**
 * Add / edit a guest, in a dialog over the list.
 *
 * It sits in a modal rather than inline because the couple edits guest number
 * 150 as often as guest number 2, and an inline panel yanks the page back to
 * the top and loses their place in the list.
 *
 * The fields are grouped into the four questions actually answered in order —
 * who, how to reach them, what link, what text — with the private notes folded
 * away until asked for. Before, thirteen fields sat in one flat column and the
 * required name carried the same weight as a reminder note.
 *
 * The message box keeps the template's `{nama}` / `{link}` placeholders so an
 * edited message still follows a later rename, and the preview underneath
 * shows the text that will really arrive.
 */
import { useMemo, useState } from "react";
import { GUEST_GROUPS, INVITE_TYPES } from "@/lib/db.types";
import type { GuestGroup, GuestWithRsvp, InviteType } from "@/lib/db.types";
import { formatPhone, normalizePhone } from "@/lib/phone";
import { guestLink, renderMessage, templateFor } from "@/lib/waTemplates";
import { slugify } from "@/lib/slug";
import { GROUP_LABEL, TYPE_LABEL, inputClass, type FormState } from "./dashboardShared";
import { Modal } from "./ui";

type GuestFormProps = {
  form: FormState;
  guests: GuestWithRsvp[];
  onChange: (next: FormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
  busy: boolean;
  error: string;
};

const Section = ({
  step,
  title,
  hint,
  children,
}: {
  step: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-4 rounded-3xl border border-border bg-surface/60 p-4">
    <div>
      <h3 className="type-label">
        {step}. {title}
      </h3>
      {hint ? <p className="type-meta mt-1">{hint}</p> : null}
    </div>
    {children}
  </section>
);

const Field = ({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="type-label" htmlFor={htmlFor}>
      {label}
    </label>
    {children}
    {hint ? <p className="type-meta">{hint}</p> : null}
  </div>
);

export const GuestForm = ({
  form,
  guests,
  onChange,
  onSubmit,
  onCancel,
  busy,
  error,
}: GuestFormProps) => {
  const [showNotes, setShowNotes] = useState(
    form.notes.length > 0 || form.reminder_note.length > 0,
  );
  const [duplicateOk, setDuplicateOk] = useState(false);

  const template = templateFor(form);
  const isTemplate = form.message.trim() === template.trim();
  const normalized = normalizePhone(form.phone);
  const slug = form.slug.trim() || slugify(form.display_name);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    onChange({ ...form, [key]: value });
  };

  /**
   * A repeated number is usually a paste slip and occasionally a shared
   * household phone. Naming the collision and asking for a tick beats the old
   * flow, which rejected the first Simpan and accepted an identical second one
   * — indistinguishable from the save having simply failed once.
   */
  const duplicates = useMemo(() => {
    if (!normalized) return [];
    return guests
      .filter((guest) => guest.id !== form.id && guest.phone === normalized)
      .map((guest) => guest.display_name);
  }, [guests, form.id, normalized]);

  /** The server rejects a taken slug; saying so here saves a round trip. */
  const slugTaken = useMemo(
    () => slug.length > 0 && guests.some((guest) => guest.id !== form.id && guest.slug === slug),
    [guests, form.id, slug],
  );

  const preview = useMemo(
    () =>
      renderMessage({
        slug: slug || "slug",
        display_name: form.display_name || "Nama tamu",
        whatsapp_name: form.whatsapp_name || null,
        guest_group: form.guest_group,
        invite_type: form.invite_type,
        message_override: form.message,
      }),
    [slug, form.display_name, form.whatsapp_name, form.guest_group, form.invite_type, form.message],
  );

  /** Switching group or type swaps the text only while it is still untouched,
   *  so a hand-written message survives a change of mind about the category. */
  const applyGroupOrType = (patch: Partial<Pick<FormState, "guest_group" | "invite_type">>) => {
    const merged = { ...form, ...patch };
    onChange({ ...merged, message: isTemplate ? templateFor(merged) : form.message });
  };

  const nameMissing = form.display_name.trim().length === 0;
  const needsDuplicateConsent = duplicates.length > 0 && !duplicateOk;
  const blocked = nameMissing || slugTaken || needsDuplicateConsent;

  const blockedReason = nameMissing
    ? "Nama di undangan masih kosong."
    : slugTaken
      ? "Slug tautannya masih bentrok dengan tamu lain."
      : needsDuplicateConsent
        ? "Centang dulu persetujuan nomor ganda di langkah 2."
        : "";

  return (
    <Modal
      title={form.id ? `Ubah ${form.display_name || "tamu"}` : "Tamu baru"}
      onClose={onCancel}
      footer={
        <div className="flex flex-col gap-2">
          {blocked ? <p className="type-meta text-alert">{blockedReason}</p> : null}
          <div className="flex gap-3">
            <button
              type="submit"
              form="guest-form"
              disabled={busy || blocked}
              className="type-button min-h-[48px] flex-1 rounded-full bg-ink px-6 text-paper disabled:opacity-50"
            >
              {busy ? "Menyimpan…" : form.id ? "Simpan perubahan" : "Tambahkan tamu"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="type-button min-h-[48px] rounded-full border border-border px-6"
            >
              Batal
            </button>
          </div>
        </div>
      }
    >
      <form
        id="guest-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!blocked && !busy) onSubmit();
        }}
        className="flex flex-col gap-4"
      >
        {error ? (
          <p aria-live="polite" className="type-body rounded-2xl bg-blush/40 p-4 text-alert">
            {error}
          </p>
        ) : null}

        <Section step={1} title="Siapa yang diundang" hint="Nama ini yang tercetak di undangan.">
          <Field
            label="Nama di undangan"
            htmlFor="display_name"
            hint="Tulis lengkap dengan sapaan, contoh “Bapak Achmad Fuad Bay”."
          >
            <input
              id="display_name"
              value={form.display_name}
              onChange={(e) => setField("display_name", e.target.value)}
              placeholder="Bapak Achmad Fuad Bay"
              required
              maxLength={120}
              autoComplete="off"
              className={inputClass}
            />
          </Field>

          <Field label="Keterangan rombongan (opsional)" htmlFor="party_label">
            <div className="flex gap-2">
              <input
                id="party_label"
                value={form.party_label}
                onChange={(e) => setField("party_label", e.target.value)}
                placeholder="Beserta Keluarga"
                maxLength={60}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setField("party_label", "Beserta Keluarga")}
                className="type-button min-h-[48px] shrink-0 rounded-2xl border border-border px-4"
              >
                Keluarga
              </button>
            </div>
          </Field>

          <div className="flex flex-wrap gap-3">
            <div className="min-w-[11rem] flex-1">
              <Field label="Kelompok" htmlFor="guest_group">
                <select
                  id="guest_group"
                  value={form.guest_group}
                  onChange={(e) => applyGroupOrType({ guest_group: e.target.value as GuestGroup })}
                  className={inputClass}
                >
                  {GUEST_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {GROUP_LABEL[group]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="min-w-[11rem] flex-1">
              <Field label="Jenis undangan" htmlFor="invite_type">
                <select
                  id="invite_type"
                  value={form.invite_type}
                  onChange={(e) => applyGroupOrType({ invite_type: e.target.value as InviteType })}
                  className={inputClass}
                >
                  {INVITE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {TYPE_LABEL[type]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* A head count means nothing to a guest who is watching the stream. */}
          {form.invite_type === "venue" ? (
            <Field
              label="Maksimal orang yang bisa dikonfirmasi"
              htmlFor="party_max"
              hint="Batas angka yang bisa dipilih tamu di form RSVP."
            >
              <input
                id="party_max"
                type="number"
                min={1}
                max={10}
                value={form.party_max}
                onChange={(e) =>
                  setField("party_max", Math.min(10, Math.max(1, Number(e.target.value) || 1)))
                }
                className={inputClass}
              />
            </Field>
          ) : null}
        </Section>

        <Section
          step={2}
          title="Cara mengirim"
          hint="Nomor WhatsApp, atau kanal lain kalau tidak punya."
        >
          <Field
            label="Nomor WhatsApp"
            htmlFor="phone"
            hint={
              form.phone.trim().length === 0
                ? "Nomor luar Indonesia: tulis dengan tanda + di depan."
                : normalized
                  ? `Tersimpan sebagai ${formatPhone(normalized)}`
                  : "Nomor ini belum terbaca sebagai nomor yang sah."
            }
          >
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => {
                setDuplicateOk(false);
                setField("phone", e.target.value);
              }}
              placeholder="0812… atau +81 90…"
              maxLength={32}
              className={`${inputClass} ${
                form.phone.trim().length > 0 && !normalized ? "border-alert" : ""
              }`}
            />
          </Field>

          {duplicates.length > 0 ? (
            <label className="flex items-start gap-3 rounded-2xl border border-alert/40 bg-blush/25 p-4">
              <input
                type="checkbox"
                checked={duplicateOk}
                onChange={(e) => setDuplicateOk(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-[color:var(--color-dusty-deep,#8a6f7b)]"
              />
              <span className="type-body">
                Nomor ini juga dipakai {duplicates.join(", ")}. Centang kalau memang satu nomor
                untuk beberapa undangan.
              </span>
            </label>
          ) : null}

          <Field
            label="Nama sapaan di WhatsApp (opsional)"
            htmlFor="whatsapp_name"
            hint="Menggantikan {nama} di pesan. Kosongkan untuk memakai nama di undangan."
          >
            <input
              id="whatsapp_name"
              value={form.whatsapp_name}
              onChange={(e) => setField("whatsapp_name", e.target.value)}
              placeholder="Om Fuad"
              maxLength={120}
              className={inputClass}
            />
          </Field>

          <Field
            label="Kanal lain jika tanpa WhatsApp"
            htmlFor="alternative_channel"
            hint="Diisi supaya tamu tanpa nomor tidak terlewat waktu menyisir daftar."
          >
            <input
              id="alternative_channel"
              value={form.alternative_channel}
              onChange={(e) => setField("alternative_channel", e.target.value)}
              placeholder="Instagram @nama, SMS, atau disampaikan langsung"
              maxLength={120}
              className={inputClass}
            />
          </Field>
        </Section>

        <Section step={3} title="Tautan undangan">
          <Field label="Slug tautan" htmlFor="slug">
            <div className="flex gap-2">
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
                placeholder={slugify(form.display_name) || "bapak-achmad"}
                maxLength={80}
                className={`${inputClass} ${slugTaken ? "border-alert" : ""}`}
              />
              <button
                type="button"
                onClick={() => setField("slug", slugify(form.display_name))}
                disabled={nameMissing}
                className="type-button min-h-[48px] shrink-0 rounded-2xl border border-border px-4 disabled:opacity-50"
              >
                Dari nama
              </button>
            </div>
          </Field>
          <p className={`type-meta break-all ${slugTaken ? "text-alert" : ""}`}>
            {slugTaken
              ? `Slug “${slug}” sudah dipakai tamu lain. Ganti dulu, ya.`
              : guestLink(slug || "slug")}
          </p>
        </Section>

        <Section
          step={4}
          title="Pesan WhatsApp"
          hint={
            isTemplate
              ? "Ini template kelompoknya. Diubah pun, {nama} dan {link} tetap terisi otomatis."
              : "Pesan ini sudah diubah dari template kelompoknya."
          }
        >
          <textarea
            id="message"
            aria-label="Pesan WhatsApp"
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            rows={10}
            maxLength={1500}
            className="w-full rounded-2xl border border-border bg-surface p-4 font-sans text-sm leading-relaxed text-ink outline-none focus:border-dusty/60"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setField("message", template)}
              disabled={isTemplate}
              className="type-button min-h-[44px] rounded-full border border-border px-4 disabled:opacity-50"
            >
              Kembalikan ke template
            </button>
            <span className="type-meta ml-auto tabular-nums">{form.message.length}/1500</span>
          </div>
          <div className="rounded-2xl border border-dashed border-border bg-paper/70 p-4">
            <p className="type-label mb-2">Pratinjau</p>
            <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink-soft">
              {preview}
            </p>
          </div>
        </Section>

        <section className="rounded-3xl border border-border bg-surface/60 p-4">
          <button
            type="button"
            aria-expanded={showNotes}
            onClick={() => setShowNotes((value) => !value)}
            className="type-button flex min-h-[44px] w-full items-center justify-between gap-4 text-left"
          >
            Catatan (hanya untuk kalian)
            <span aria-hidden>{showNotes ? "−" : "+"}</span>
          </button>
          {showNotes ? (
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Catatan pribadi" htmlFor="notes">
                <input
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  placeholder="Contoh: teman kantor Hanifah"
                  maxLength={500}
                  className={inputClass}
                />
              </Field>
              <Field label="Catatan kirim ulang" htmlFor="reminder_note">
                <input
                  id="reminder_note"
                  value={form.reminder_note}
                  onChange={(e) => setField("reminder_note", e.target.value)}
                  placeholder="Contoh: ingatkan lagi 12 Agustus lewat Instagram"
                  maxLength={300}
                  className={inputClass}
                />
              </Field>
            </div>
          ) : null}
        </section>
      </form>
    </Modal>
  );
};
