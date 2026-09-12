export type KnowledgeKind = "entity" | "concept" | "comparison" | "query";

export type KnowledgeConfidence = "high" | "medium" | "low";

export type KnowledgeSource = {
  label: string;
  url: string;
};

export type KnowledgePage = {
  id: string;
  heading: string;
  html: string;
  sources: KnowledgeSource[];
  url: string;
  kind?: KnowledgeKind;
  confidence?: KnowledgeConfidence;
  contested?: boolean;
  updated?: string;
  tags?: string[];
};

export type KnowledgePayload = {
  source: "live" | "fallback";
  pages: KnowledgePage[];
};
