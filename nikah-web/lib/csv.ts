/**
 * Excel and Google Sheets execute a cell that opens with `=`, `+`, `-` or `@`
 * as a formula. Guests write `catatan` and `pesan` freely and the couple opens
 * these exports in a spreadsheet, so text starting with one of those is
 * prefixed with an apostrophe — the standard spreadsheet escape, which the
 * application strips again on display. Only strings are guarded; a negative
 * number stays a negative number.
 */
const neutralizeFormula = (value: string): string =>
  /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;

const escapeCell = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const text = typeof value === "string" ? neutralizeFormula(value) : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export const toCsv = (
  rows: ReadonlyArray<object>,
  columns: readonly string[],
): string => {
  const header = columns.map(escapeCell).join(",");
  const body = rows.map((row) =>
    columns.map((column) => escapeCell((row as Record<string, unknown>)[column])).join(","),
  );
  return `\uFEFF${[header, ...body].join("\r\n")}\r\n`;
};
