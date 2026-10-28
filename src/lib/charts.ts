export type BarRow = {
  label: string;
  count: number;
  denmark?: boolean;
  tone: "primary" | "muted" | "caution";
};

export type MonthPoint = {
  month: string;
  label: string;
  count: number;
  partial: boolean;
};

const STATUS_RANK = [
  "Recruiting",
  "Not yet recruiting",
  "Active",
  "Completed",
  "Terminated",
  "Unknown",
] as const;

/** A trial counts once for each distinct country on its registration. */
export function countryBars(
  trials: { countries: string[] }[],
  otherLabel: (count: number) => string,
): BarRow[] {
  const map = new Map<string, number>();
  for (const trial of trials) {
    const seen = new Set(trial.countries.map((name) => name.trim()).filter(Boolean));
    for (const name of seen) map.set(name, (map.get(name) ?? 0) + 1);
  }
  const ranked = [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const isDenmark = (label: string) => /^denmark$/i.test(label);
  const top = ranked.slice(0, 10);
  const shown = new Set(top.map((row) => row.label));
  const denmark = ranked.find((row) => isDenmark(row.label));
  const rows = [...top];
  if (denmark && !shown.has(denmark.label)) {
    rows.push(denmark);
    shown.add(denmark.label);
  }
  const others = ranked.filter((row) => !shown.has(row.label));
  const painted: BarRow[] = rows.map((row) => ({
    label: row.label,
    count: row.count,
    denmark: isDenmark(row.label),
    tone: "primary",
  }));
  if (others.length > 0) {
    painted.push({
      label: otherLabel(others.length),
      count: others.reduce((sum, row) => sum + row.count, 0),
      tone: "primary",
    });
  }
  return painted;
}

export function statusBucket(raw: string): string {
  const value = raw.toUpperCase().replace(/[\s-]+/g, "_");
  if (value === "RECRUITING" || value === "ENROLLING_BY_INVITATION") return "Recruiting";
  if (value === "NOT_YET_RECRUITING") return "Not yet recruiting";
  if (value === "ACTIVE_NOT_RECRUITING" || value === "ACTIVE") return "Active";
  if (value === "COMPLETED") return "Completed";
  if (value === "TERMINATED") return "Terminated";
  if (value === "UNKNOWN" || value === "NA" || value === "N/A" || value === "") return "Unknown";
  return raw
    .toLowerCase()
    .split("_")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export function statusBars(statuses: string[], labelFor: (bucket: string) => string): BarRow[] {
  const map = new Map<string, number>();
  for (const status of statuses) {
    const bucket = statusBucket(status);
    map.set(bucket, (map.get(bucket) ?? 0) + 1);
  }
  const rank = (label: string) => {
    const index = STATUS_RANK.indexOf(label as (typeof STATUS_RANK)[number]);
    return index === -1 ? STATUS_RANK.length + 1 : index;
  };
  return [...map.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
    .map(([bucket, count]) => ({
      label: labelFor(bucket),
      count,
      tone: bucket === "Recruiting" ? "primary" : bucket === "Terminated" ? "caution" : "muted",
    }));
}

export function monthPoints(
  months: { month: string; count: number }[],
  snapshotDay: string,
  locale: "en" | "da",
): MonthPoint[] {
  const current = snapshotDay.slice(0, 7);
  return months.map((item, index) => ({
    month: item.month,
    label: shortLabel(item.month, locale),
    count: item.count,
    partial: index === months.length - 1 && item.month === current,
  }));
}

function shortLabel(isoMonth: string, locale: "en" | "da"): string {
  const en = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const da = [
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
  const name = (locale === "da" ? da : en)[Number(isoMonth.slice(5, 7)) - 1];
  const year = isoMonth.slice(2, 4);
  return name ? `${name} ${year}` : isoMonth;
}

/** True when a YYYY-MM-DD snapshot is more than 10 days old. */
export function snapshotUpdateDue(isoDate: string, today = new Date()): boolean {
  const time = Date.parse(`${isoDate.slice(0, 10)}T00:00:00Z`);
  if (!Number.isFinite(time)) return false;
  return today.getTime() - time > 10 * 86_400_000;
}
