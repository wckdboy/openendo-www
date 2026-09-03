import { Link } from "@tanstack/react-router";
import { RibbonMark } from "./RibbonMark";
import { useLang } from "@/lib/i18n";
import { GITHUB_URL } from "@/content/data";

const sources = [
  { label: "ClinicalTrials.gov", url: "https://clinicaltrials.gov/" },
  { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/" },
  { label: "WHO", url: "https://www.who.int/news-room/fact-sheets/detail/endometriosis" },
  {
    label: "ESHRE guideline",
    url: "https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-guideline",
  },
];

export function SiteFooter() {
  const { c, locale, setLocale, path } = useLang();

  return (
    <footer className="mt-32 border-t border-hairline">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5 text-[15px] font-semibold">
            <RibbonMark className="h-6 w-6" />
            OpenEndo
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {c.footer.tagline}
          </p>
          <p className="mt-6 text-xs text-muted-foreground">{c.footer.license}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {c.footer.sources}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {sources.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 transition-colors hover:text-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {c.footer.project}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to={path("/dashboard")} className="text-foreground/80 hover:text-foreground">
                {c.nav.dashboard}
              </Link>
            </li>
            <li>
              <Link to={path("/knowledge")} className="text-foreground/80 hover:text-foreground">
                {c.nav.knowledge}
              </Link>
            </li>
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-foreground"
              >
                {c.nav.github}
              </a>
            </li>
          </ul>

          <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {c.footer.language}
          </h2>
          <div className="mt-3 flex gap-1 text-sm">
            {(["en", "da"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={
                  locale === l
                    ? "rounded-full bg-secondary px-3 py-1 text-foreground"
                    : "rounded-full px-3 py-1 text-muted-foreground hover:text-foreground"
                }
              >
                {l === "en" ? "English" : "Dansk"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl border-t border-hairline px-6 py-6 text-xs text-muted-foreground">
        © {new Date().getUTCFullYear()} {c.footer.rights}
      </div>
    </footer>
  );
}
