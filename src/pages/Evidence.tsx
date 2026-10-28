import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { marked } from "marked";
import { Disclaimer } from "@/components/Disclaimer";
import { GuideNav } from "@/components/GuideNav";
import { canonicalQueryOptions, fetchDigestMarkdown } from "@/lib/canonical";
import { useLang } from "@/lib/i18n";
import { RAW_BASE } from "@/lib/site";

function renderMarkdown(markdown: string): string {
  const html = marked.parse(markdown, { async: false, gfm: true });
  if (typeof html !== "string") throw new Error("markdown did not render synchronously");
  return html;
}

export function Evidence() {
  const { c } = useLang();
  const t = c.evidence;
  const snapshot = useQuery(canonicalQueryOptions);
  const data = snapshot.data;
  const [selected, setSelected] = useState<string | null>(null);
  const date = selected ?? data?.latestDigest.date ?? "";
  const bundledDigest = data && date === data.latestDigest.date ? data.latestDigest.markdown : null;
  const digest = useQuery({
    queryKey: ["openendo-digest", date],
    queryFn: () => fetchDigestMarkdown(date),
    enabled: Boolean(date),
    ...(bundledDigest ? { initialData: bundledDigest } : {}),
    staleTime: Infinity,
    retry: 1,
  });

  const html = useMemo(() => (digest.data ? renderMarkdown(digest.data) : ""), [digest.data]);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:pt-20">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.eyebrow}</p>
        <div className="mt-3 h-1 w-16 rounded-full bg-ribbon" />
        <h1 className="mt-5 text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
          {t.titleA} <span className="accent font-normal">{t.titleAccent}</span>
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{t.lede}</p>
        <GuideNav current="/evidence" />
      </header>

      <div className="mt-8">
        <Disclaimer title={c.learn.notAdviceTitle} body={t.disclaimer} />
      </div>

      {data ? (
        <div className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t.archive}
          </h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {data.digestIndex.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelected(item)}
                aria-pressed={item === date}
                className={
                  item === date
                    ? "shrink-0 rounded-full bg-foreground px-3 py-1.5 text-[13px] font-medium text-background"
                    : "shrink-0 rounded-full bg-secondary px-3 py-1.5 text-[13px] text-muted-foreground"
                }
              >
                {item}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {t.sourceNote}{" "}
            <a
              href={`${RAW_BASE}/docs/research/evidence/digest-${date}.md`}
              className="underline decoration-hairline underline-offset-4"
            >
              digest-{date}.md
            </a>
            {" · "}
            <a
              href={`${RAW_BASE}/docs/research/evidence/weekly/${date}.json`}
              className="underline decoration-hairline underline-offset-4"
            >
              {date}.json
            </a>
          </p>
        </div>
      ) : null}

      {digest.isPending && <p className="mt-10 text-sm text-muted-foreground">{t.loading}</p>}
      {digest.isError && (
        <p className="mt-10 text-sm text-muted-foreground" role="alert">
          {t.error}
        </p>
      )}
      {html ? (
        <article
          className="knowledge-prose below-fold mt-10"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : null}
    </div>
  );
}
