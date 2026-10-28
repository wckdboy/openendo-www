import { useId, type ReactNode } from "react";
import type { BarRow, MonthPoint } from "@/lib/charts";
import { formatDate } from "@/lib/dates";

const TONE = {
  primary: "var(--primary)",
  muted: "var(--ink-muted)",
  caution: "var(--caution)",
} as const;

export function ChartFrame({
  title,
  caption,
  snapshot,
  stale,
  staleText,
  tail = "update due",
  locale = "en",
  emptyText,
  hasData,
  tableLabel,
  table,
  children,
}: {
  title: string;
  caption: string;
  snapshot: string;
  stale: boolean;
  staleText: string;
  tail?: string;
  locale?: "en" | "da";
  emptyText: string;
  hasData: boolean;
  tableLabel: string;
  table: ReactNode;
  children: ReactNode;
}) {
  const titleId = useId();
  const captionId = useId();
  return (
    <figure className="min-w-0">
      <h2 id={titleId} className="text-[var(--text-xl)]">
        {title}
      </h2>
      {stale ? (
        <p className="mt-2 text-sm text-[var(--caution)]">
          {staleText} {formatDate(snapshot, locale)}, {tail}.
        </p>
      ) : null}
      <div className="mt-4">
        {hasData ? (
          children
        ) : (
          <p className="text-base text-[var(--ink-muted)]">
            {emptyText} {formatDate(snapshot, locale)}
          </p>
        )}
      </div>
      {hasData ? (
        <figcaption id={captionId} className="mt-3 text-sm text-[var(--ink-muted)]">
          {caption}
        </figcaption>
      ) : null}
      {hasData ? (
        <details className="mt-3">
          <summary className="min-h-11 cursor-pointer text-base">{tableLabel}</summary>
          <div className="mt-2">{table}</div>
        </details>
      ) : null}
    </figure>
  );
}

export function HorizontalBars({
  rows,
  locale,
  describedBy,
}: {
  rows: BarRow[];
  locale: "en" | "da";
  describedBy?: string;
}) {
  const max = Math.max(...rows.map((row) => row.count), 1);
  const label = locale === "da" ? "Danmark" : "Denmark";
  return (
    <ul className="space-y-1" aria-describedby={describedBy}>
      {rows.map((row) => (
        <li key={row.label} className="flex min-h-11 items-center gap-2 sm:min-h-8">
          <span
            className={`w-36 shrink-0 text-[15px] leading-tight text-[var(--ink)] ${row.denmark ? "font-bold" : ""}`}
          >
            {row.label}
            {row.denmark ? (
              <span className="ml-1 inline-flex rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-1.5 text-[12px] font-normal leading-4">
                {label}
              </span>
            ) : null}
          </span>
          <svg
            width="100%"
            height="14"
            role="img"
            aria-label={`${row.label} ${row.count}`}
            className="min-w-0 flex-1"
          >
            <rect
              x="0"
              y="2"
              height="10"
              width={`${Math.max(1, (row.count / max) * 100)}%`}
              fill={TONE[row.tone]}
              rx="2"
            />
            <rect x="0" y="2" width="2" height="10" fill={TONE[row.tone]} />
          </svg>
          <span className="w-10 shrink-0 text-right font-mono text-sm tabular-nums text-[var(--ink)]">
            {row.count.toLocaleString(locale)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function DataTable({ rows }: { rows: { label: string; count: number }[] }) {
  return (
    <table className="w-full text-left text-sm">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-hairline">
            <th scope="row" className="py-2 pr-4 font-medium">
              {row.label}
            </th>
            <td className="py-2 text-right font-mono tabular-nums">{row.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function MonthColumns({
  points,
  soFar,
  locale,
}: {
  points: MonthPoint[];
  soFar: string;
  locale: "en" | "da";
}) {
  const max = Math.max(...points.map((point) => point.count), 1);
  const hatchId = useId().replace(/:/g, "");
  return (
    <div>
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <pattern
            id={hatchId}
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--primary)" strokeWidth="2" />
          </pattern>
        </defs>
      </svg>
      <ol className="flex items-end gap-1">
        {points.map((point, index) => {
          const height = Math.max(2, Math.round((point.count / max) * 120));
          const older = index < points.length - 6;
          return (
            <li
              key={point.month}
              className={`flex min-w-0 flex-1 flex-col items-center ${older ? "hidden sm:flex" : "flex"}`}
            >
              <span className="font-mono text-[13px] tabular-nums text-[var(--ink)]">
                {point.count.toLocaleString(locale)}
              </span>
              <svg
                width="60%"
                height={height}
                role="img"
                aria-label={`${point.label} ${point.count}`}
                className="mt-1"
              >
                <rect
                  width="100%"
                  height="100%"
                  fill={point.partial ? `url(#${hatchId})` : "var(--primary)"}
                />
              </svg>
              <span className="mt-1 text-[13px] text-[var(--ink-muted)]">{point.label}</span>
              {point.partial ? (
                <span className="text-[13px] text-[var(--ink)]">{soFar}</span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="mt-1 h-px bg-[var(--hairline)]" />
    </div>
  );
}
