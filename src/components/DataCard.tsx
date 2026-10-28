import { Link } from "@tanstack/react-router";
import { snapshotIsStale } from "@/lib/canonical";
import type { AppPath } from "@/lib/site";

export function DataCard({
  label,
  value,
  context,
  snapshot,
  href,
  staleLabel,
}: {
  label: string;
  value: string;
  context: string;
  snapshot: string;
  href: AppPath;
  staleLabel: string;
}) {
  const stale = snapshotIsStale(snapshot);
  return (
    <article className="rounded-[var(--radius-md)] bg-card p-5 shadow-[var(--shadow-card)]">
      <p className="text-sm font-medium uppercase tracking-[0.04em] text-[var(--ink-subtle)]">
        {label}
      </p>
      <p className="numeral mt-2 text-[var(--ink)]">{value}</p>
      <p className="mt-2 text-base text-[var(--ink-muted)]">{context}</p>
      <p className="mt-4 text-sm text-[var(--ink-subtle)]">
        Snapshot {snapshot}
        {stale ? (
          <span className="ml-2 inline-flex rounded-full bg-[var(--caution-bg)] px-2 py-0.5 text-[var(--caution)]">
            {staleLabel} {snapshot}
          </span>
        ) : null}
        {" · "}
        <Link to={href} className="underline underline-offset-4">
          See all
        </Link>
      </p>
    </article>
  );
}
