/**
 * Fallback catalog only — slugs and folders, not article bodies.
 * Used when docs/knowledge/index.md cannot be parsed or fetched.
 * Canonical catalog: https://raw.githubusercontent.com/wckdboy/openendo/main/docs/knowledge/index.md
 */
export type KnowledgeFolder = "entities" | "concepts" | "comparisons" | "queries";

export type KnowledgeIndexEntry = {
  slug: string;
  folder: KnowledgeFolder;
  summary?: string;
};

export const KNOWLEDGE_INDEX_FALLBACK: KnowledgeIndexEntry[] = [
  { slug: "ryeqo", folder: "entities" },
  { slug: "yselty", folder: "entities" },
  { slug: "hmi-115", folder: "entities" },
  { slug: "my-endo-trial", folder: "entities" },
  { slug: "sirolimus", folder: "entities" },
  { slug: "gnrh-antagonists", folder: "concepts" },
  { slug: "saliva-diagnostics", folder: "concepts" },
  { slug: "ferroptosis", folder: "concepts" },
  { slug: "computational-drug-repurposing", folder: "concepts" },
  { slug: "mrgprx2-pain", folder: "concepts" },
  { slug: "diversity-gap", folder: "concepts" },
  { slug: "danish-registries", folder: "concepts" },
  { slug: "ryeqo-vs-yselty", folder: "comparisons" },
];
