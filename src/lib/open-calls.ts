const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type DeadlineCall = {
  open?: boolean;
  deadline: string | null;
};

/** UTC calendar day, `YYYY-MM-DD`. */
export function utcToday(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/**
 * A call is open only when the dataset marks it open and any deadline has not passed.
 * A deadline of today is still open. A missing deadline stays open when `open` is true.
 * `open: true` with a past deadline is not open — the flag can lag the calendar.
 */
export function isOpenCall(entry: DeadlineCall, today: string): boolean {
  if (entry.open !== true) return false;
  if (entry.deadline == null) return true;
  if (!ISO_DATE.test(entry.deadline)) return false;
  return entry.deadline >= today;
}

export function openCalls<T extends DeadlineCall>(entries: readonly T[], today: string): T[] {
  return entries
    .filter((entry) => isOpenCall(entry, today))
    .sort((a, b) => {
      if (a.deadline == null && b.deadline == null) return 0;
      if (a.deadline == null) return 1;
      if (b.deadline == null) return -1;
      return a.deadline.localeCompare(b.deadline);
    });
}
