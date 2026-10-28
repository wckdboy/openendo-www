export type SiteLocale = "en" | "da";

export const SITE_ORIGIN = "https://openendo.org";
export const GITHUB_URL = "https://github.com/wckdboy/openendo";
export const RAW_BASE = "https://raw.githubusercontent.com/wckdboy/openendo/main";

export const WHO_FACT_SHEET = "https://www.who.int/news-room/fact-sheets/detail/endometriosis";
export const NICE_NG73 = "https://www.nice.org.uk/guidance/ng73";
export const NICE_NG73_RECS = "https://www.nice.org.uk/guidance/ng73/chapter/Recommendations";
export const ESHRE_GUIDELINE =
  "https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-guideline";
export const ESHRE_PMID = "https://pubmed.ncbi.nlm.nih.gov/35350465/";

/** Canonical English paths. Danish URLs are `/da` + path, with `/da` for home. */
export const BASE_PATHS = [
  "/",
  "/learn",
  "/learn/symptoms",
  "/learn/diagnosis",
  "/learn/treatment",
  "/learn/living",
  "/learn/denmark",
  "/learn/how-it-works",
  "/learn/managing-symptoms",
  "/learn/appointment",
  "/evidence",
  "/dashboard",
  "/research",
  "/access",
  "/knowledge",
  "/sources",
  "/find",
  "/about",
  "/about/for-decision-makers",
] as const;

export type BasePath = (typeof BASE_PATHS)[number];

export type AppPath =
  | BasePath
  | "/da"
  | "/da/learn"
  | "/da/learn/symptoms"
  | "/da/learn/diagnosis"
  | "/da/learn/treatment"
  | "/da/learn/living"
  | "/da/learn/denmark"
  | "/da/learn/how-it-works"
  | "/da/learn/managing-symptoms"
  | "/da/learn/appointment"
  | "/da/evidence"
  | "/da/dashboard"
  | "/da/research"
  | "/da/access"
  | "/da/knowledge"
  | "/da/sources"
  | "/da/find"
  | "/da/about"
  | "/da/about/for-decision-makers";

const SITEMAP_META: Record<BasePath, { changefreq: string; priority: string }> = {
  "/": { changefreq: "daily", priority: "1.0" },
  "/learn": { changefreq: "monthly", priority: "0.9" },
  "/learn/symptoms": { changefreq: "monthly", priority: "0.8" },
  "/learn/diagnosis": { changefreq: "monthly", priority: "0.8" },
  "/learn/treatment": { changefreq: "monthly", priority: "0.8" },
  "/learn/living": { changefreq: "monthly", priority: "0.8" },
  "/learn/denmark": { changefreq: "monthly", priority: "0.8" },
  "/learn/how-it-works": { changefreq: "monthly", priority: "0.8" },
  "/learn/managing-symptoms": { changefreq: "monthly", priority: "0.8" },
  "/learn/appointment": { changefreq: "monthly", priority: "0.6" },
  "/evidence": { changefreq: "weekly", priority: "0.8" },
  "/dashboard": { changefreq: "daily", priority: "0.9" },
  "/research": { changefreq: "weekly", priority: "0.7" },
  "/access": { changefreq: "weekly", priority: "0.8" },
  "/knowledge": { changefreq: "weekly", priority: "0.7" },
  "/sources": { changefreq: "monthly", priority: "0.6" },
  "/find": { changefreq: "monthly", priority: "0.5" },
  "/about": { changefreq: "monthly", priority: "0.5" },
  "/about/for-decision-makers": { changefreq: "monthly", priority: "0.4" },
};

export function localizedPath(path: BasePath, locale: SiteLocale): AppPath {
  if (locale === "en") return path;
  if (path === "/") return "/da";
  return `/da${path}`;
}

/** Drop a Danish prefix without treating `/dashboard` as Danish. */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/da(?=\/|$)/, "") || "/";
  return stripped.length > 1 ? stripped.replace(/\/$/, "") : stripped;
}

export function basePathFromPathname(pathname: string): BasePath {
  const normalised = stripLocale(pathname);
  return (BASE_PATHS as readonly string[]).includes(normalised) ? (normalised as BasePath) : "/";
}

export function absoluteUrl(path: AppPath): string {
  return path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

export type SitemapEntry = { path: AppPath; changefreq: string; priority: string };

export function sitemapEntries(): SitemapEntry[] {
  return BASE_PATHS.flatMap((path) => {
    const meta = SITEMAP_META[path];
    const danish = localizedPath(path, "da");
    return [
      { path, changefreq: meta.changefreq, priority: meta.priority },
      {
        path: danish,
        changefreq: meta.changefreq,
        priority: path === "/" ? "0.9" : meta.priority,
      },
    ];
  });
}
