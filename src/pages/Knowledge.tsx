import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { articles } from "@/content/data";


export function Knowledge() {
  const { c, locale } = useLang();
  const entries = articles[locale];

  return (
    <div className="mx-auto max-w-6xl px-6 pt-20">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {c.knowledge.eyebrow}
      </p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        {c.knowledge.title.split(",")[0]},{" "}
        <span className="accent font-normal">{c.knowledge.title.split(",").slice(1).join(",").trim()}</span>
      </h1>
      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {c.knowledge.lede}
      </p>

      <div className="mt-20 gap-16 lg:flex">
        <aside className="mb-14 lg:sticky lg:top-24 lg:mb-0 lg:h-fit lg:w-56 lg:shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {c.knowledge.toc}
          </h2>
          <ul className="mt-4 space-y-2.5 border-l border-hairline">
            {entries.map((a) => (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  className="-ml-px block border-l border-transparent pl-4 text-sm text-muted-foreground transition-colors hover:border-ribbon hover:text-foreground"
                >
                  {a.heading}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 max-w-2xl">
          {entries.map((a) => (
            <article key={a.id} id={a.id} className="scroll-mt-24 border-t border-hairline py-12 first:border-t-0 first:pt-0">
              <h2 className="text-2xl font-semibold tracking-tight">{a.heading}</h2>
              {a.body.map((p) => (
                <p key={p.slice(0, 24)} className="mt-4 text-[16px] leading-[1.75] text-foreground/85">
                  {p}
                </p>
              ))}
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {c.knowledge.source}: {a.source}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
