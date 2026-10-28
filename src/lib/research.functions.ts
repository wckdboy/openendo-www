import bundledResearch from "@/generated/research.html?raw";
import { RAW_BASE } from "@/lib/site";

/**
 * The research explainer lives in the OpenEndo repo as a self-contained styled
 * HTML document. The repo is canonical — we fetch it live and never copy its
 * contents into app code. Only the relative font urls are rewritten so the
 * document's own typography loads inside the sandboxed iframe.
 */

export const RESEARCH_HTML_URL = `${RAW_BASE}/docs/what-we-know.html`;

export const RESEARCH_PDF_URL = `${RAW_BASE}/docs/what-we-know.pdf`;

const ASSET_BASE = `${RAW_BASE}/docs/`;

const CACHE_MS = 1000 * 60 * 10;

export async function loadResearchHtml(): Promise<string> {
  const res = await fetch(RESEARCH_HTML_URL, { headers: { accept: "text/html" } });
  if (!res.ok) throw new Error(`${res.status} ${RESEARCH_HTML_URL}`);
  const raw = await res.text();
  return raw.replace(/(["'(])assets\/fonts\//g, `$1${ASSET_BASE}assets/fonts/`);
}

export const researchQueryOptions = {
  queryKey: ["openendo-research-html"] as const,
  queryFn: loadResearchHtml,
  initialData: bundledResearch.replace(/(["'(])assets\/fonts\//g, `$1${ASSET_BASE}assets/fonts/`),
  staleTime: Infinity,
  refetchOnMount: false as const,
};
