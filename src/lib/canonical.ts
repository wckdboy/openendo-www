import rawSnapshot from "@/generated/snapshot.json";
import { RAW_BASE } from "@/lib/site";

export type MetaCounts = {
  recruiting_global: number;
  denmark: number;
  denmark_recruiting: number;
  recent: number;
  pubmed_7d: number;
  pubmed_max_month: number;
};

export type Meta = {
  generated_at: string;
  updated: string;
  counts: MetaCounts;
};

export type FundingEntry = {
  id?: string;
  name: string;
  org?: string;
  country?: string;
  url?: string;
  deadline: string | null;
  open?: boolean;
  desc?: { en?: string; da?: string };
};

export type Localized = { en: string; da: string };

export type ContentStat = { value: string; label: Localized; source: string };

export type ContentBlock = { title: Localized; body: Localized; source: string };

export type ContentAction = {
  title: Localized;
  body: Localized;
  url: string;
  cta: Localized;
};

export type ContentResource = {
  name: string;
  desc: Localized;
  url: string;
  tag: Localized;
};

export type ContentFile = {
  stats: ContentStat[];
  problems: ContentBlock[];
  actions: ContentAction[];
  resources: ContentResource[];
  methodology: Localized;
};

export type RepoTrial = {
  nct_id: string;
  title: string;
  status: string;
  phase: string;
  sponsor: string;
  countries: string[];
  url: string;
};

export type TrialFile = { updated: string; trials: RepoTrial[] };

export type Paper = {
  date: string;
  pmid: string;
  title: string;
  journal: string;
  url: string;
};

export type PubmedFile = { updated: string; papers: Paper[] };

export type MonthlyFile = { updated: string; months: { month: string; count: number }[] };

export type Snapshot = {
  meta: Meta;
  funding: FundingEntry[];
  content: ContentFile;
  trialsGlobal: TrialFile;
  trialsDenmark: TrialFile;
  pubmedRecent: PubmedFile;
  pubmedMonthly: MonthlyFile;
  latestDigest: { date: string; markdown: string };
  digestIndex: string[];
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) throw new Error(`snapshot: ${label}`);
  return value;
}

function num(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`snapshot: ${label}`);
  return value;
}

function localized(value: unknown, label: string): Localized {
  if (!isRecord(value)) throw new Error(`snapshot: ${label}`);
  return { en: str(value.en, `${label}.en`), da: str(value.da, `${label}.da`) };
}

function optionalLocalized(value: unknown): Localized | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) return undefined;
  const en = typeof value.en === "string" ? value.en : "";
  const da = typeof value.da === "string" ? value.da : "";
  if (!en && !da) return undefined;
  return { en, da };
}

function parseMeta(value: unknown): Meta {
  if (!isRecord(value) || !isRecord(value.counts)) throw new Error("snapshot: meta");
  const counts = value.counts;
  return {
    generated_at: str(value.generated_at, "meta.generated_at"),
    updated: str(value.updated, "meta.updated"),
    counts: {
      recruiting_global: num(counts.recruiting_global, "counts.recruiting_global"),
      denmark: num(counts.denmark, "counts.denmark"),
      denmark_recruiting: num(counts.denmark_recruiting, "counts.denmark_recruiting"),
      recent: num(counts.recent, "counts.recent"),
      pubmed_7d: num(counts.pubmed_7d, "counts.pubmed_7d"),
      pubmed_max_month: num(counts.pubmed_max_month, "counts.pubmed_max_month"),
    },
  };
}

function parseFunding(value: unknown): FundingEntry[] {
  if (!Array.isArray(value)) throw new Error("snapshot: funding");
  return value.map((entry, index) => {
    if (!isRecord(entry)) throw new Error(`snapshot: funding[${index}]`);
    const deadline = entry.deadline;
    if (deadline !== null && typeof deadline !== "string") {
      throw new Error(`snapshot: funding[${index}].deadline`);
    }
    const parsed: FundingEntry = {
      name: str(entry.name, `funding[${index}].name`),
      deadline,
    };
    if (typeof entry.id === "string") parsed.id = entry.id;
    if (typeof entry.org === "string") parsed.org = entry.org;
    if (typeof entry.country === "string") parsed.country = entry.country;
    if (typeof entry.url === "string") parsed.url = entry.url;
    if (typeof entry.open === "boolean") parsed.open = entry.open;
    const desc = optionalLocalized(entry.desc);
    if (desc) parsed.desc = desc;
    return parsed;
  });
}

function parseContent(value: unknown): ContentFile {
  if (!isRecord(value)) throw new Error("snapshot: content");
  if (
    !Array.isArray(value.stats) ||
    !Array.isArray(value.problems) ||
    !Array.isArray(value.actions)
  ) {
    throw new Error("snapshot: content lists");
  }
  const resources = Array.isArray(value.resources) ? value.resources : [];
  return {
    stats: value.stats.map((item, index) => {
      if (!isRecord(item)) throw new Error(`snapshot: stats[${index}]`);
      return {
        value: str(item.value, `stats[${index}].value`),
        label: localized(item.label, `stats[${index}].label`),
        source: typeof item.source === "string" ? item.source : "",
      };
    }),
    problems: value.problems.map((item, index) => {
      if (!isRecord(item)) throw new Error(`snapshot: problems[${index}]`);
      return {
        title: localized(item.title, `problems[${index}].title`),
        body: localized(item.body, `problems[${index}].body`),
        source: typeof item.source === "string" ? item.source : "",
      };
    }),
    actions: value.actions.map((item, index) => {
      if (!isRecord(item)) throw new Error(`snapshot: actions[${index}]`);
      return {
        title: localized(item.title, `actions[${index}].title`),
        body: localized(item.body, `actions[${index}].body`),
        url: str(item.url, `actions[${index}].url`),
        cta: localized(item.cta, `actions[${index}].cta`),
      };
    }),
    resources: resources.map((item, index) => {
      if (!isRecord(item)) throw new Error(`snapshot: resources[${index}]`);
      return {
        name: str(item.name, `resources[${index}].name`),
        desc: localized(item.desc, `resources[${index}].desc`),
        url: str(item.url, `resources[${index}].url`),
        tag: localized(item.tag, `resources[${index}].tag`),
      };
    }),
    methodology: localized(value.methodology, "methodology"),
  };
}

function parseTrials(value: unknown, label: string): TrialFile {
  if (!isRecord(value) || !Array.isArray(value.trials)) throw new Error(`snapshot: ${label}`);
  return {
    updated: str(value.updated, `${label}.updated`),
    trials: value.trials.map((trial, index) => {
      if (!isRecord(trial)) throw new Error(`snapshot: ${label}[${index}]`);
      const countries = Array.isArray(trial.countries)
        ? trial.countries.filter((country): country is string => typeof country === "string")
        : [];
      return {
        nct_id: str(trial.nct_id, `${label}[${index}].nct_id`),
        title: str(trial.title, `${label}[${index}].title`),
        status: typeof trial.status === "string" ? trial.status : "UNKNOWN",
        phase: typeof trial.phase === "string" ? trial.phase : "NA",
        sponsor: typeof trial.sponsor === "string" ? trial.sponsor : "—",
        countries,
        url:
          typeof trial.url === "string"
            ? trial.url
            : `https://clinicaltrials.gov/study/${String(trial.nct_id)}`,
      };
    }),
  };
}

function parsePapers(value: unknown): PubmedFile {
  if (!isRecord(value) || !Array.isArray(value.papers)) throw new Error("snapshot: pubmed");
  return {
    updated: str(value.updated, "pubmed.updated"),
    papers: value.papers.map((paper, index) => {
      if (!isRecord(paper)) throw new Error(`snapshot: paper[${index}]`);
      const pmid = str(paper.pmid, `paper[${index}].pmid`);
      return {
        pmid,
        title: str(paper.title, `paper[${index}].title`),
        journal: typeof paper.journal === "string" ? paper.journal : "—",
        date: typeof paper.date === "string" ? paper.date : "",
        url: typeof paper.url === "string" ? paper.url : `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      };
    }),
  };
}

function parseMonthly(value: unknown): MonthlyFile {
  if (!isRecord(value) || !Array.isArray(value.months)) throw new Error("snapshot: monthly");
  return {
    updated: str(value.updated, "monthly.updated"),
    months: value.months.map((month, index) => {
      if (!isRecord(month)) throw new Error(`snapshot: month[${index}]`);
      return {
        month: str(month.month, `month[${index}]`),
        count: num(month.count, `month[${index}].count`),
      };
    }),
  };
}

export function parseSnapshot(value: unknown): Snapshot {
  if (!isRecord(value)) throw new Error("snapshot: root");
  if (!isRecord(value.latestDigest)) throw new Error("snapshot: latestDigest");
  const digestIndex = Array.isArray(value.digestIndex)
    ? value.digestIndex.filter((item): item is string => typeof item === "string")
    : [];
  return {
    meta: parseMeta(value.meta),
    funding: parseFunding(value.funding),
    content: parseContent(value.content),
    trialsGlobal: parseTrials(value.trialsGlobal, "trialsGlobal"),
    trialsDenmark: parseTrials(value.trialsDenmark, "trialsDenmark"),
    pubmedRecent: parsePapers(value.pubmedRecent),
    pubmedMonthly: parseMonthly(value.pubmedMonthly),
    latestDigest: {
      date: str(value.latestDigest.date, "latestDigest.date"),
      markdown: str(value.latestDigest.markdown, "latestDigest.markdown"),
    },
    digestIndex,
  };
}

export const bundledSnapshot = parseSnapshot(rawSnapshot);

async function getJson(path: string): Promise<unknown> {
  const res = await fetch(`${RAW_BASE}/${path}`, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json() as Promise<unknown>;
}

async function getText(path: string): Promise<string> {
  const res = await fetch(`${RAW_BASE}/${path}`, {
    headers: { accept: "text/plain, text/markdown" },
  });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.text();
}

async function listDigestDates(): Promise<string[]> {
  const res = await fetch(
    "https://api.github.com/repos/wckdboy/openendo/contents/docs/research/evidence",
    { headers: { accept: "application/vnd.github+json" } },
  );
  if (!res.ok) throw new Error(`digest index ${res.status}`);
  const items: unknown = await res.json();
  if (!Array.isArray(items)) throw new Error("digest index shape");
  const dates: string[] = [];
  for (const item of items) {
    if (!isRecord(item) || typeof item.name !== "string") continue;
    const match = /^digest-(\d{4}-\d{2}-\d{2})\.md$/.exec(item.name);
    if (match?.[1]) dates.push(match[1]);
  }
  dates.sort((a, b) => b.localeCompare(a));
  return dates;
}

export async function loadCanonical(): Promise<Snapshot> {
  const [
    meta,
    funding,
    content,
    trialsGlobal,
    trialsDenmark,
    pubmedRecent,
    pubmedMonthly,
    latestFile,
  ] = await Promise.all([
    getJson("docs/data/meta.json"),
    getJson("docs/data/funding.json"),
    getJson("docs/data/content.json"),
    getJson("docs/data/trials_global_recruiting.json"),
    getJson("docs/data/trials_denmark.json"),
    getJson("docs/data/pubmed_recent.json"),
    getJson("docs/data/pubmed_monthly.json"),
    getText("docs/research/evidence/weekly/LATEST"),
  ]);

  const date = latestFile.trim().replace(/\.json$/, "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`LATEST: ${latestFile.trim()}`);
  const markdown = await getText(`docs/research/evidence/digest-${date}.md`);

  let digestIndex: string[];
  try {
    digestIndex = await listDigestDates();
  } catch (error) {
    console.error("digest index failed", error);
    digestIndex = bundledSnapshot.digestIndex;
  }
  if (!digestIndex.includes(date)) digestIndex = [date, ...digestIndex];

  return parseSnapshot({
    meta,
    funding,
    content,
    trialsGlobal,
    trialsDenmark,
    pubmedRecent,
    pubmedMonthly,
    latestDigest: { date, markdown },
    digestIndex,
  });
}

export async function fetchDigestMarkdown(date: string): Promise<string> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`digest date ${date}`);
  return getText(`docs/research/evidence/digest-${date}.md`);
}

export const canonicalQueryOptions = {
  queryKey: ["openendo-canonical"] as const,
  queryFn: loadCanonical,
  initialData: bundledSnapshot,
  initialDataUpdatedAt: Date.parse(bundledSnapshot.meta.generated_at) || 0,
  staleTime: Infinity,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  retry: 1,
};

export function displayStatus(status: string): string {
  if (status === "NA" || status === "N/A") return "N/A";
  return status
    .toLowerCase()
    .split("_")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export function displayPhase(phase: string, locale: "en" | "da" = "en"): string {
  if (!phase || phase === "NA" || phase === "N/A" || phase === "NOT_APPLICABLE") {
    return locale === "da" ? "Observationelt / ingen fase" : "Observational / not phased";
  }
  return displayStatus(phase);
}

/** True when a YYYY-MM-DD snapshot is more than 8 days before `today`. */
export function snapshotIsStale(isoDate: string, today = new Date()): boolean {
  const time = Date.parse(`${isoDate.slice(0, 10)}T00:00:00Z`);
  if (!Number.isFinite(time)) return false;
  return today.getTime() - time > 8 * 86_400_000;
}

export function monthLabel(isoMonth: string): string {
  const [year, month] = isoMonth.split("-");
  const index = Number(month) - 1;
  const name = MONTHS[index];
  if (!year || !name) return isoMonth;
  return `${name} ${year}`;
}

export function tally(labels: string[], limit?: number): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const label of labels) map.set(label, (map.get(label) ?? 0) + 1);
  const sorted = [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return limit ? sorted.slice(0, limit) : sorted;
}
