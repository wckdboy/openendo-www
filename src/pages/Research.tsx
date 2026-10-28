import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { PageCredits } from "@/components/PageCredits";
import { LEARN_REVIEWED } from "@/content/learn";
import { useLang } from "@/lib/i18n";
import {
  RESEARCH_HTML_URL,
  RESEARCH_PDF_URL,
  researchQueryOptions,
} from "@/lib/research.functions";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Research() {
  const { c } = useLang();
  const t = c.research;
  const query = useQuery(researchQueryOptions);

  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1200);

  const measure = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc?.body) return;
    setHeight(Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight) + 24);
  }, []);

  useEffect(() => {
    if (!query.data) return;
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    // Fonts and images can settle after load; re-measure a couple of times.
    const timers = [200, 800, 2000].map((ms) => window.setTimeout(measure, ms));
    return () => {
      window.removeEventListener("resize", onResize);
      timers.forEach(window.clearTimeout);
    };
  }, [query.data, measure]);

  return (
    <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 sm:pt-20">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.eyebrow}</p>
        <div className="mt-3 h-1 w-16 rounded-full bg-ribbon" />
        <h1 className="mt-5 max-w-2xl text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
          {t.titleA} <span className="accent font-normal">{t.titleAccent}</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{t.lede}</p>
        <PageCredits
          reviewed={LEARN_REVIEWED}
          citations={[{ label: "what-we-know.html", href: RESEARCH_HTML_URL }]}
        />
      </header>

      {/* Toolbar */}
      <div className="mt-12 flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-4">
        <div className="min-w-0">
          <h2 className="text-[17px] font-semibold tracking-tight">{t.docTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.docCaption}</p>
        </div>
        <a
          href={RESEARCH_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 ${focusRing}`}
        >
          <Download className="h-4 w-4" />
          {t.pdf}
        </a>
      </div>

      {query.isPending && (
        <div className="mt-8 space-y-4" aria-busy="true">
          <p className="text-sm text-muted-foreground">{t.loading}</p>
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-secondary" />
          <div className="h-64 animate-pulse rounded-2xl bg-secondary" />
          <div className="h-64 animate-pulse rounded-2xl bg-secondary" />
        </div>
      )}

      {query.isError && (
        <div className="mt-8 rounded-2xl border border-hairline bg-secondary/50 p-6">
          <h3 className="text-[17px] font-semibold tracking-tight">{t.errorTitle}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t.errorBody}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              onClick={() => query.refetch()}
              className={`rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 ${focusRing}`}
            >
              {t.retry}
            </button>
            <a
              href={RESEARCH_HTML_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${focusRing}`}
            >
              <span className="marker">{t.openRaw}</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {query.data && (
        <iframe
          ref={frameRef}
          title={t.docTitle}
          srcDoc={query.data}
          onLoad={measure}
          sandbox="allow-same-origin"
          className="mt-8 w-full rounded-2xl border border-hairline bg-white"
          style={{ height }}
        />
      )}

      <p className="mt-8 text-sm text-muted-foreground">
        <a
          href={RESEARCH_HTML_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 font-medium text-foreground ${focusRing}`}
        >
          <span className="marker">{t.openRaw}</span>
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </p>
    </div>
  );
}
