const EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DA = [
  "jan.",
  "feb.",
  "mar.",
  "apr.",
  "maj",
  "jun.",
  "jul.",
  "aug.",
  "sep.",
  "okt.",
  "nov.",
  "dec.",
];

/** Person-facing date. ISO stays in tables and file links. */
export function formatDate(iso: string, locale: "en" | "da"): string {
  const day = iso.slice(0, 10);
  const time = Date.parse(`${day}T00:00:00Z`);
  if (!Number.isFinite(time)) return iso;
  const date = new Date(time);
  const month = (locale === "da" ? DA : EN)[date.getUTCMonth()];
  if (!month) return day;
  return locale === "da"
    ? `${date.getUTCDate()}. ${month} ${date.getUTCFullYear()}`
    : `${date.getUTCDate()} ${month} ${date.getUTCFullYear()}`;
}

export function shortMonth(isoMonth: string, locale: "en" | "da"): string {
  const index = Number(isoMonth.slice(5, 7)) - 1;
  return (locale === "da" ? DA : EN)[index] ?? isoMonth;
}
