/** Folders used by the OpenEndo knowledge index. Article bodies are fetched, not bundled. */
export type KnowledgeFolder = "entities" | "concepts" | "comparisons" | "queries";

export type KnowledgeIndexEntry = {
  slug: string;
  folder: KnowledgeFolder;
  summary?: string;
};
