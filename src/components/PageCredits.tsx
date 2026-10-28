import type { Citation } from "@/content/learn";
import { useLang } from "@/lib/i18n";

export function PageCredits({ reviewed, citations }: { reviewed: string; citations: Citation[] }) {
  const { c } = useLang();

  return (
    <div className="mt-4 max-w-[var(--token-measure)] space-y-2 text-sm">
      <p className="text-muted-foreground">
        {c.learn.reviewed} <time dateTime={reviewed}>{reviewed}</time>
      </p>
      {citations.length > 0 ? (
        <ul className="space-y-1">
          {citations.map((citation) => (
            <li key={citation.href}>
              <a
                href={citation.href}
                className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
              >
                {citation.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
