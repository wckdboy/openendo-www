import { createServerFn } from "@tanstack/react-start";
import { KNOWLEDGE_INDEX_FALLBACK, type KnowledgeIndexEntry } from "@/content/knowledge-index";
import { articles } from "@/content/data";
import type { Locale } from "@/content/copy";
import {
  escapeHtml,
  parseKnowledgeIndex,
  parseKnowledgePage,
  renderKnowledgeMarkdown,
} from "@/lib/knowledge-markdown";
import type { KnowledgePage, KnowledgePayload } from "@/lib/knowledge.types";

/**
 * Knowledge pages live in the OpenEndo repo as sourced markdown.
 * The repo is canonical — we fetch the index and listed pages live and never
 * copy their bodies into app code. Bundled articles are a fallback only.
 */
export const KNOWLEDGE_RAW_BASE =
  "https://raw.githubusercontent.com/wckdboy/openendo/main/docs/knowledge";

export const KNOWLEDGE_BLOB_BASE = "https://github.com/wckdboy/openendo/blob/main/docs/knowledge";

export const KNOWLEDGE_INDEX_URL = `${KNOWLEDGE_RAW_BASE}/index.md`;

const CACHE_MS = 1000 * 60 * 30;
const FETCH_MS = 10_000;
const MAX_PAGES = 30;

let cache: { at: number; data: KnowledgePayload } | null = null;

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { accept: "text/plain, text/markdown;q=0.9, */*;q=0.8" },
    signal: AbortSignal.timeout(FETCH_MS),
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function loadCatalog(): Promise<KnowledgeIndexEntry[]> {
  try {
    const markdown = await fetchText(KNOWLEDGE_INDEX_URL);
    const parsed = parseKnowledgeIndex(markdown);
    if (parsed.length) return parsed;
  } catch (error) {
    console.error("knowledge index fetch failed", error);
  }
  return KNOWLEDGE_INDEX_FALLBACK;
}

function rawPageUrl(entry: KnowledgeIndexEntry): string {
  return `${KNOWLEDGE_RAW_BASE}/${entry.folder}/${entry.slug}.md`;
}

function blobPageUrl(entry: KnowledgeIndexEntry): string {
  return `${KNOWLEDGE_BLOB_BASE}/${entry.folder}/${entry.slug}.md`;
}

async function loadLivePages(): Promise<KnowledgePage[]> {
  const catalog = (await loadCatalog()).slice(0, MAX_PAGES);
  const fetched = await Promise.all(
    catalog.map(async (entry) => {
      try {
        const raw = await fetchText(rawPageUrl(entry));
        return parseKnowledgePage(raw, entry, blobPageUrl(entry));
      } catch (error) {
        console.error(`knowledge page ${entry.slug} failed`, error);
        return null;
      }
    }),
  );

  const docs = fetched.filter((doc): doc is NonNullable<typeof doc> => Boolean(doc));
  const titles = new Map(docs.map((doc) => [doc.id, doc.heading]));

  return docs.map((doc) => {
    const page: KnowledgePage = {
      id: doc.id,
      heading: doc.heading,
      html: renderKnowledgeMarkdown(doc.bodyMarkdown, titles),
      sources: doc.sources,
      url: doc.url,
      kind: doc.kind,
    };
    if (doc.confidence) page.confidence = doc.confidence;
    if (doc.contested) page.contested = true;
    if (doc.updated) page.updated = doc.updated;
    if (doc.tags.length) page.tags = doc.tags;
    return page;
  });
}

export function fallbackKnowledge(locale: Locale): KnowledgePage[] {
  return articles[locale].map((article) => ({
    id: article.id,
    heading: article.heading,
    html: article.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join(""),
    sources: [{ label: article.source, url: article.url }],
    url: article.url,
  }));
}

export const getKnowledge = createServerFn({ method: "GET" }).handler(
  async (): Promise<KnowledgePayload> => {
    if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;

    try {
      const pages = await loadLivePages();
      if (!pages.length) throw new Error("knowledge: no pages loaded");
      const data: KnowledgePayload = { source: "live", pages };
      cache = { at: Date.now(), data };
      return data;
    } catch (error) {
      console.error("knowledge fetch failed", error);
      throw error;
    }
  },
);

export const knowledgeQueryOptions = {
  queryKey: ["openendo-knowledge"] as const,
  queryFn: () => getKnowledge(),
  staleTime: CACHE_MS,
  retry: 1,
};
