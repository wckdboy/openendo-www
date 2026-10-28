import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { GuideNav } from "@/components/GuideNav";
import { PageCredits } from "@/components/PageCredits";
import { LEARN_REVIEWED } from "@/content/learn";
import { canonicalQueryOptions, fetchDigestMarkdown } from "@/lib/canonical";
import { useLang } from "@/lib/i18n";
import { parseDigest, type StudyType } from "@/lib/digest";
import { RAW_BASE } from "@/lib/site";

export function Evidence() {
  const { c, path } = useLang();
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

  const parsed = useMemo(() => (digest.data ? parseDigest(digest.data) : null), [digest.data]);
  const [topic, setTopic] = useState<string>("All");
  const [patientOnly, setPatientOnly] = useState(false);
  const topics = ["All", ...new Set(parsed?.entries.map((entry) => entry.topic) ?? [])];
  const visible =
    parsed?.entries.filter((entry) => {
      if (topic !== "All" && entry.topic !== topic) return false;
      if (patientOnly && (entry.topic === "Mechanisms" || entry.studyType === "Preclinical"))
        return false;
      return true;
    }) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:pt-20">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.eyebrow}</p>
        <div className="mt-3 h-1 w-16 rounded-full bg-ribbon" />
        <h1 className="mt-5 text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
          {t.titleA} <span className="accent font-normal">{t.titleAccent}</span>
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{t.lede}</p>
        <PageCredits
          reviewed={data?.latestDigest.date ?? LEARN_REVIEWED}
          citations={
            date
              ? [
                  {
                    label: `digest-${date}.md`,
                    href: `${RAW_BASE}/docs/research/evidence/digest-${date}.md`,
                  },
                ]
              : []
          }
        />
        <GuideNav current="/evidence" />
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link to={path("/research")} className="underline underline-offset-4">
            {c.nav.research}
          </Link>
          <Link to={path("/knowledge")} className="underline underline-offset-4">
            {c.nav.knowledge}
          </Link>
          <Link to={path("/sources")} className="underline underline-offset-4">
            {c.nav.sources}
          </Link>
        </p>
      </header>

      <p className="mt-4 text-sm text-[var(--ink-subtle)]">{t.disclaimer}</p>

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
      {parsed ? (
        <div className="mt-8">
          <h2 className="text-[var(--text-2xl)]">{parsed.weekLabel}</h2>
          <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--sunken)] p-5">
            <h3 className="text-base font-semibold">{c.learn.inShort}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {parsed.signals.slice(0, 5).map((signal) => (
                <li key={signal.slice(0, 40)}>{signal}</li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {topics.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={item === topic}
                onClick={() => setTopic(item)}
                className="min-h-11 rounded-full bg-[var(--sunken)] px-3 text-sm text-[var(--ink)]"
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={patientOnly}
              onClick={() => setPatientOnly((value) => !value)}
              className="min-h-11 rounded-full bg-[var(--sunken)] px-3 text-sm text-[var(--ink)]"
            >
              {t.patientOnly}
            </button>
          </div>
          <ul className="mt-8 space-y-4">
            {visible.map((entry) => (
              <li
                key={entry.id}
                className="rounded-[var(--radius-md)] bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <h3 className="text-[var(--text-lg)]">{entry.title}</h3>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">
                  <Badge type={entry.studyType} /> {entry.certainty}
                  {entry.people ? ` · ${entry.people}` : ""}
                </p>
                <p className="mt-3">
                  <span className="font-semibold">{t.found} </span>
                  {entry.found}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">{t.matters} </span>
                  {entry.matters}
                </p>
                {entry.pmid ? (
                  <p className="mt-3">
                    <a className="mono-id" href={`https://pubmed.ncbi.nlm.nih.gov/${entry.pmid}/`}>
                      PMID {entry.pmid}
                    </a>
                  </p>
                ) : null}
                <details className="mt-3">
                  <summary className="min-h-11 cursor-pointer">{t.details}</summary>
                  <p className="mt-2 text-base">{entry.details}</p>
                </details>
              </li>
            ))}
          </ul>
          <details className="mt-10">
            <summary className="min-h-11 cursor-pointer text-base font-semibold">
              {t.method}
            </summary>
            <p className="mt-3 whitespace-pre-wrap text-base text-[var(--ink-muted)]">
              {parsed.method}
            </p>
          </details>
        </div>
      ) : null}
    </div>
  );
}

function Badge({ type }: { type: StudyType }) {
  return (
    <span className="mr-2 inline-flex rounded-full bg-[var(--sunken)] px-2 py-0.5">{type}</span>
  );
}
