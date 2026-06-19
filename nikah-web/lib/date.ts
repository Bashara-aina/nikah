/**
 * Date helpers — countdown + Indonesian formatting.
 * All counts are computed against `config.date.countdownTargetIso`.
 */

const WIB_OFFSET_MIN = 7 * 60;

export function getCountdownTargetMs(): number {
  // countdownTargetIso includes +07:00, parsed natively by Date.
  const target = new Date("2026-08-22T10:00:00+07:00");
  return target.getTime();
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

export function diffParts(targetMs: number, now: number): CountdownParts {
  const diff = Math.max(0, targetMs - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

/** 22 Agustus 2026 */
export function formatTanggalID(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Sabtu, 22 Agustus 2026 */
export function formatTanggalLengkapID(date: Date): string {
  return `${DAYS[date.getDay()]}, ${formatTanggalID(date)}`;
}

/** 22 Agt 2026 */
export function formatTanggalShortID(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
}

/** Format a Date object's HH:mm in WIB regardless of where the date was constructed. */
export function formatWIB(date: Date): string {
  const minutes = date.getUTCMinutes() + WIB_OFFSET_MIN;
  const hours =
    (date.getUTCHours() + Math.floor(minutes / 60)) % 24;
  const mm = ((minutes % 60) + 60) % 60;
  return `${String(hours).padStart(2, "0")}.${String(mm).padStart(2, "0")} WIB`;
}

/** Format `2026-08-15` to ID short. */
export function isoToShortID(iso: string): string {
  const [y, m, d] = iso.split("-").map((s) => Number(s));
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`;
}