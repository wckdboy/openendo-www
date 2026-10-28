import type { KnowledgeFolder, KnowledgeIndexEntry } from "@/content/knowledge-index";
import {
  parseKnowledgeIndex,
  parseKnowledgePage,
  renderKnowledgeMarkdown,
} from "@/lib/knowledge-markdown";
import type { KnowledgePage, KnowledgePayload } from "@/lib/knowledge.types";
import bundledKnowledge from "@/generated/knowledge.json";
import { RAW_BASE } from "@/lib/site";

/**
 * Knowledge pages live in the OpenEndo repo as sourced markdown.
 * The repo is canonical — we fetch the index and listed pages live and never
 * copy their bodies into app code. If the repository does not respond, the
 * page shows an error instead of a bundled article.
 */
export const KNOWLEDGE_RAW_BASE = `${RAW_BASE}/docs/knowledge`;

export const KNOWLEDGE_BLOB_BASE = "https://github.com/wckdboy/openendo/blob/main/docs/knowledge";

export const KNOWLEDGE_INDEX_URL = `${KNOWLEDGE_RAW_BASE}/index.md`;

const CACHE_MS = 1000 * 60 * 30;
const FETCH_MS = 10_000;
const MAX_PAGES = 30;

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { accept: "text/plain, text/markdown;q=0.9, */*;q=0.8" },
    signal: AbortSignal.timeout(FETCH_MS),
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function loadCatalog(): Promise<KnowledgeIndexEntry[]> {
  const markdown = await fetchText(KNOWLEDGE_INDEX_URL);
  const parsed = parseKnowledgeIndex(markdown);
  if (!parsed.length) throw new Error("knowledge index was empty");
  return parsed;
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

export async function loadKnowledge(): Promise<KnowledgePayload> {
  const pages = await loadLivePages();
  if (!pages.length) throw new Error("knowledge: no pages loaded");
  return { source: "live", pages };
}

function pagesFromBundle(): KnowledgePage[] {
  const titles = new Map<string, string>();
  const docs = bundledKnowledge.pages
    .map((entry) => {
      const parsed = parseKnowledgePage(
        entry.markdown,
        { slug: entry.slug, folder: entry.folder as KnowledgeFolder },
        `${KNOWLEDGE_BLOB_BASE}/${entry.folder}/${entry.slug}.md`,
      );
      return parsed;
    })
    .filter((doc): doc is NonNullable<typeof doc> => Boolean(doc));
  for (const doc of docs) titles.set(doc.id, doc.heading);
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

const bundledPages = pagesFromBundle();

export const knowledgeQueryOptions = {
  queryKey: ["openendo-knowledge"] as const,
  queryFn: loadKnowledge,
  initialData: { source: "live" as const, pages: bundledPages },
  staleTime: Infinity,
  refetchOnMount: false as const,
  retry: 1,
};
