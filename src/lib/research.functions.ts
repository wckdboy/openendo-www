import { createServerFn } from "@tanstack/react-start";

/**
 * The research explainer lives in the OpenEndo repo as a self-contained styled
 * HTML document. The repo is canonical — we fetch it live and never copy its
 * contents into app code. Only the relative font urls are rewritten so the
 * document's own typography loads inside the sandboxed iframe.
 */
export const RESEARCH_HTML_URL =
  "https://raw.githubusercontent.com/wckdboy/openendo/main/docs/what-we-know.html";

export const RESEARCH_PDF_URL =
  "https://raw.githubusercontent.com/wckdboy/openendo/main/docs/what-we-know.pdf";

const ASSET_BASE = "https://raw.githubusercontent.com/wckdboy/openendo/main/docs/";

const CACHE_MS = 1000 * 60 * 10;
let cache: { at: number; html: string } | null = null;

export const getResearchHtml = createServerFn({ method: "GET" }).handler(
  async (): Promise<string> => {
    if (cache && Date.now() - cache.at < CACHE_MS) return cache.html;

    const res = await fetch(RESEARCH_HTML_URL, { headers: { accept: "text/html" } });
    if (!res.ok) throw new Error(`${res.status} ${RESEARCH_HTML_URL}`);
    const raw = await res.text();

    // Relative -> absolute: src="assets/fonts/..." and url("assets/fonts/...")
    const html = raw.replace(/(["'(])assets\/fonts\//g, `$1${ASSET_BASE}assets/fonts/`);

    cache = { at: Date.now(), html };
    return html;
  },
);

export const researchQueryOptions = {
  queryKey: ["openendo-research-html"] as const,
  queryFn: () => getResearchHtml(),
  staleTime: CACHE_MS,
};
