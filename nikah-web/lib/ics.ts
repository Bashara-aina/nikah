/**
 * ICS (RFC 5545) generator for Save-to-Calendar (SPEC 03 §7).
 * Builds a single VEVENT from `config` and triggers a client-side download.
 */

import { config } from "./config";

const TZ_OFFSET = "+0700"; // WIB (UTC+7)

interface IcsParts {
  uid: string;
  dtStart: string;
  dtEnd: string;
  summary: string;
  description: string;
  location: string;
  url: string;
}

function fmtIcsUtc(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

/** Build ICS date in floating local time using +0700 (WIB) for cross-app safety. */
function fmtIcsLocal(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    TZ_OFFSET
  );
}

function buildIcs(p: IcsParts): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nikah//Wedding//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${p.uid}`,
    `DTSTAMP:${fmtIcsUtc(new Date())}`,
    `DTSTART:${p.dtStart}`,
    `DTEND:${p.dtEnd}`,
    `SUMMARY:${p.summary}`,
    `DESCRIPTION:${p.description}`,
    `LOCATION:${p.location}`,
    `URL:${p.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}

export interface IcsEventInput {
  summary: string;
  description: string;
  location: string;
  url: string;
  startLocal: Date;
  endLocal: Date;
}

function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildEventIcs(input: IcsEventInput): string {
  return buildIcs({
    uid: "nikah-bashara-hanifah-20260822@nikah.local",
    dtStart: fmtIcsLocal(input.startLocal),
    dtEnd: fmtIcsLocal(input.endLocal),
    summary: escapeIcs(input.summary),
    description: escapeIcs(input.description),
    location: escapeIcs(input.location),
    url: input.url,
  });
}

/** Returns a Date for the wedding start in local time (representing 10:00 WIB). */
export function getEventStartLocal(): Date {
  return new Date("2026-08-22T10:00:00+07:00");
}

/** Returns a Date for the wedding end in local time (13:00 WIB). */
export function getEventEndLocal(): Date {
  return new Date("2026-08-22T13:00:00+07:00");
}

/** Default wedding ICS — uses config.venue and config.couple. */
export function buildWeddingIcs(): string {
  const start = getEventStartLocal();
  const end = getEventEndLocal();
  return buildEventIcs({
    summary: `Pernikahan ${config.couple.groom} & ${config.couple.bride}`,
    description:
      `${config.date.iso} — ${config.date.akadStart}–${config.date.end} ${config.date.tz}\n` +
      `${config.site.url}`,
    location: `${config.venue.name} ${config.venue.floor}, ${config.venue.address} (${config.venue.landmark})`,
    url: config.site.url,
    startLocal: start,
    endLocal: end,
  });
}

/** Triggers a client-side download of the wedding ICS file. */
export function downloadWeddingIcs(): void {
  if (typeof window === "undefined") return;
  const ics = buildWeddingIcs();
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pernikahan-bashara-hanifah.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
