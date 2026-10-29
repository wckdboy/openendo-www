import { Marked, Renderer } from "marked";
import type { KnowledgeFolder, KnowledgeIndexEntry } from "@/content/knowledge-index";
import type { KnowledgeConfidence, KnowledgeKind, KnowledgeSource } from "@/lib/knowledge.types";

const FOLDER_HEADINGS: Record<string, KnowledgeFolder> = {
  entities: "entities",
  concepts: "concepts",
  comparisons: "comparisons",
  queries: "queries",
};

export function folderToKind(folder: KnowledgeFolder): KnowledgeKind {
  switch (folder) {
    case "entities":
      return "entity";
    case "concepts":
      return "concept";
    case "comparisons":
      return "comparison";
    case "queries":
      return "query";
    default: {
      const _exhaustive: never = folder;
      return _exhaustive;
    }
  }
}

export function parseKnowledgeIndex(markdown: string): KnowledgeIndexEntry[] {
  const entries: KnowledgeIndexEntry[] = [];
  let folder: KnowledgeFolder | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      const key = heading[1]?.trim().toLowerCase() ?? "";
      folder = FOLDER_HEADINGS[key] ?? null;
      continue;
    }
    if (!folder) continue;

    const item = line.match(/^\s*-\s*\[\[([a-z0-9-]+)\]\](?:\s*[—–-]\s*(.+))?/i);
    if (!item?.[1]) continue;
    const summary = item[2]?.replace(/\*\*/g, "").trim();
    entries.push({
      slug: item[1],
      folder,
      ...(summary ? { summary } : {}),
    });
  }

  return entries;
}

type RawMeta = Record<string, unknown>;

function unquote(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseInlineList(value: string): string[] {
  const inner = value.trim();
  if (!inner.startsWith("[") || !inner.endsWith("]")) return [];
  return inner
    .slice(1, -1)
    .split(",")
    .map((part) => unquote(part))
    .filter(Boolean);
}

function parseFrontmatter(raw: string): { meta: RawMeta; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta: RawMeta = {};
  let listKey: string | null = null;

  for (const line of (match[1] ?? "").split(/\r?\n/)) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && listKey) {
      const current = meta[listKey];
      if (Array.isArray(current)) current.push(unquote(listItem[1] ?? ""));
      continue;
    }

    listKey = null;
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv?.[1]) continue;
    const key = kv[1];
    const value = kv[2] ?? "";
    if (value === "") {
      listKey = key;
      meta[key] = [];
      continue;
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = parseInlineList(value);
      continue;
    }
    if (value === "true" || value === "false") {
      meta[key] = value === "true";
      continue;
    }
    meta[key] = unquote(value);
  }

  return { meta, body: match[2] ?? "" };
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
  }
  const single = asString(value);
  return single ? [single] : [];
}

function asConfidence(value: unknown): KnowledgeConfidence | undefined {
  if (value === "high" || value === "medium" || value === "low") return value;
  return undefined;
}

function asKind(value: unknown): KnowledgeKind | undefined {
  if (value === "entity" || value === "concept" || value === "comparison" || value === "query") {
    return value;
  }
  return undefined;
}

function sourceLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripLeadingH1(body: string): string {
  return body.replace(/^\s*#\s+.+\n+/, "");
}

function replaceWikilinks(markdown: string, titles: Map<string, string>): string {
  return markdown.replace(/\[\[([a-z0-9-]+)\]\]/gi, (_full, slug: string) => {
    const label = titles.get(slug) ?? slug;
    return `[${label}](#${slug})`;
  });
}

function replaceCitations(markdown: string): string {
  return markdown.replace(/\^\[((?:https?:\/\/)[^\]]+)\]/gi, (_full, url: string) => {
    return ` ([${sourceLabel(url)}](${url}))`;
  });
}

class KnowledgeRenderer extends Renderer {
  override html() {
    return "";
  }

  override image() {
    return "";
  }

  override link({ href, title, text, tokens, autolink }: Parameters<Renderer["link"]>[0]) {
    const inner = autolink ? escapeHtml(text) : this.parser.parseInline(tokens);
    let safe: string | null = null;
    try {
      if (href.startsWith("#") || /^https?:\/\//i.test(href)) safe = href;
    } catch {
      safe = null;
    }
    if (!safe) return inner;
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
    const extra = safe.startsWith("#") ? "" : ' target="_blank" rel="noopener noreferrer"';
    return `<a href="${escapeHtml(safe)}"${titleAttr}${extra}>${inner}</a>`;
  }
}

const marked = new Marked({
  gfm: true,
});
// Constructor/use renderer extensions copy enumerable methods. Class prototype
// overrides are not enumerable, so install the renderer instance as an option.
marked.setOptions({ renderer: new KnowledgeRenderer() });

export function renderKnowledgeMarkdown(markdown: string, titles: Map<string, string>): string {
  const prepared = replaceCitations(replaceWikilinks(stripLeadingH1(markdown), titles));
  return marked.parse(prepared, { async: false });
}

export type ParsedKnowledgeDoc = {
  id: string;
  heading: string;
  kind: KnowledgeKind;
  bodyMarkdown: string;
  sources: KnowledgeSource[];
  tags: string[];
  url: string;
  confidence?: KnowledgeConfidence;
  contested?: boolean;
  updated?: string;
  summary?: string;
};

export function parseKnowledgePage(
  raw: string,
  entry: KnowledgeIndexEntry,
  pageUrl: string,
): ParsedKnowledgeDoc | null {
  const { meta, body } = parseFrontmatter(raw);
  const heading = asString(meta["title"]) || entry.slug;
  const kind = asKind(meta["type"]) ?? folderToKind(entry.folder);
  const sources = asStringList(meta["sources"])
    .filter(isHttpUrl)
    .map((url) => ({ label: sourceLabel(url), url }));
  const confidence = asConfidence(meta["confidence"]);
  const updated = asString(meta["updated"]);
  const contested = meta["contested"] === true;
  const tags = asStringList(meta["tags"]);

  return {
    id: entry.slug,
    heading,
    kind,
    bodyMarkdown: body.trim(),
    sources,
    tags,
    url: pageUrl,
    ...(confidence ? { confidence } : {}),
    ...(contested ? { contested: true } : {}),
    ...(updated ? { updated } : {}),
    ...(entry.summary ? { summary: entry.summary } : {}),
  };
}
