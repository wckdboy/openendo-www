import { createServerFn } from "@tanstack/react-start";

export type Trial = {
  id: string;
  title: string;
  status: string;
  phase: string;
  sponsor: string;
  countries: string[];
  updated: string;
};

export type Paper = {
  id: string;
  title: string;
  journal: string;
  date: string;
};

export type Counted = { label: string; count: number };

export type OpenEndoData = {
  fetchedAt: string;
  trials: {
    ok: boolean;
    globalTotal: number;
    global: Trial[];
    byCountry: Counted[];
    denmarkTotal: number;
    denmark: Trial[];
    denmarkByStatus: Counted[];
  };
  papers: {
    ok: boolean;
    yearTotal: number;
    weekTotal: number;
    recent: Paper[];
    monthly: Counted[];
  };
};

const CTG = "https://clinicaltrials.gov/api/v2/studies";
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const FIELDS = "NCTId|BriefTitle|OverallStatus|Phase|LeadSponsorName|LocationCountry|LastUpdatePostDate";

const titleCase = (s: string) => {
  if (s === "NA" || s === "N/A") return "N/A";
  return s
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/([a-z])(\d)/g, "$1 $2");
};

/** NCBI allows ~3 requests per second without a key. Run in small, spaced batches. */
async function throttled<T>(tasks: (() => Promise<T>)[], size = 2, gapMs = 400): Promise<T[]> {
  const out: T[] = [];
  for (let i = 0; i < tasks.length; i += size) {
    const batch = tasks.slice(i, i + size).map((t) => t());
    out.push(...(await Promise.all(batch)));
    if (i + size < tasks.length) await new Promise((r) => setTimeout(r, gapMs));
  }
  return out;
}

async function json(url: string) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json() as Promise<any>;
}

function mapStudies(payload: any): { total: number; trials: Trial[] } {
  const studies: any[] = Array.isArray(payload?.studies) ? payload.studies : [];
  const trials = studies.map((s) => {
    const p = s?.protocolSection ?? {};
    const phases: string[] = p?.designModule?.phases ?? [];
    const locations: any[] = p?.contactsLocationsModule?.locations ?? [];
    const countries = Array.from(
      new Set(locations.map((l) => l?.country).filter((x): x is string => Boolean(x))),
    );
    return {
      id: p?.identificationModule?.nctId ?? "",
      title: p?.identificationModule?.briefTitle ?? "Untitled study",
      status: titleCase(p?.statusModule?.overallStatus ?? "UNKNOWN"),
      phase: phases.length ? phases.map(titleCase).join(", ") : "N/A",
      sponsor: p?.sponsorCollaboratorsModule?.leadSponsor?.name ?? "—",
      countries,
      updated: p?.statusModule?.lastUpdatePostDateStruct?.date ?? "",
    } satisfies Trial;
  });
  return { total: Number(payload?.totalCount ?? trials.length), trials };
}

function tally(values: string[], limit?: number): Counted[] {
  const map = new Map<string, number>();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  const sorted = [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
  return limit ? sorted.slice(0, limit) : sorted;
}

async function pubmedCount(term: string) {
  const data = await json(
    `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=0&term=${encodeURIComponent(term)}`,
  );
  return Number(data?.esearchresult?.count ?? 0);
}

const TERM = "endometriosis[tiab]";
const pad = (n: number) => String(n).padStart(2, "0");

async function loadTrials(): Promise<OpenEndoData["trials"]> {
  const [globalRaw, denmarkRaw] = await Promise.all([
    json(
      `${CTG}?query.cond=endometriosis&filter.overallStatus=RECRUITING&pageSize=200&countTotal=true&fields=${FIELDS}`,
    ),
    json(
      `${CTG}?query.cond=endometriosis&query.locn=Denmark&pageSize=200&countTotal=true&fields=${FIELDS}`,
    ),
  ]);

  const globalMapped = mapStudies(globalRaw);
  const denmarkMapped = mapStudies(denmarkRaw);

  return {
    ok: true,
    globalTotal: globalMapped.total,
    global: globalMapped.trials,
    byCountry: tally(globalMapped.trials.flatMap((t) => t.countries), 10),
    denmarkTotal: denmarkMapped.total,
    denmark: denmarkMapped.trials,
    denmarkByStatus: tally(denmarkMapped.trials.map((t) => t.status)),
  };
}

async function loadPapers(): Promise<OpenEndoData["papers"]> {
  const now = new Date();
  const year = now.getUTCFullYear();

  const months: { label: string; start: string; end: string }[] = [];
  for (let i = 8; i >= 0; i--) {
    const d = new Date(Date.UTC(year, now.getUTCMonth() - i, 1));
    const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
    months.push({
      label: `${d.toLocaleString("en", { month: "short", timeZone: "UTC" })} ${String(d.getUTCFullYear()).slice(2)}`,
      start: `${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/01`,
      end: `${last.getUTCFullYear()}/${pad(last.getUTCMonth() + 1)}/${pad(last.getUTCDate())}`,
    });
  }

  const [yearTotal, weekTotal, ...monthlyCounts] = await throttled<number>([
    () => pubmedCount(`${TERM} AND ("${year}/01/01"[dp] : "3000"[dp])`),
    () => pubmedCount(`${TERM} AND ("last 7 days"[dp])`),
    ...months.map((m) => () => pubmedCount(`${TERM} AND ("${m.start}"[dp] : "${m.end}"[dp])`)),
  ]);

  const recentIds = await json(
    `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=25&sort=pub_date&term=${encodeURIComponent(TERM)}`,
  );

  const ids: string[] = recentIds?.esearchresult?.idlist ?? [];
  let recent: Paper[] = [];
  if (ids.length) {
    const summary = await json(`${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}`);
    const result = summary?.result ?? {};
    recent = ids
      .map((id) => result[id])
      .filter(Boolean)
      .map((r: any) => ({
        id: String(r.uid),
        title: String(r.title ?? "").replace(/\.$/, ""),
        journal: String(r.source ?? "—"),
        date: String(r.epubdate || r.pubdate || ""),
      }));
  }

  return {
    ok: true,
    yearTotal,
    weekTotal,
    recent,
    monthly: months.map((m, i) => ({ label: m.label, count: monthlyCounts[i] ?? 0 })),
  };
}

const emptyTrials: OpenEndoData["trials"] = {
  ok: false,
  globalTotal: 0,
  global: [],
  byCountry: [],
  denmarkTotal: 0,
  denmark: [],
  denmarkByStatus: [],
};

const emptyPapers: OpenEndoData["papers"] = {
  ok: false,
  yearTotal: 0,
  weekTotal: 0,
  recent: [],
  monthly: [],
};

export const getOpenEndoData = createServerFn({ method: "GET" }).handler(
  async (): Promise<OpenEndoData> => {
    const [trials, papers] = await Promise.all([
      loadTrials().catch((e) => {
        console.error("clinicaltrials.gov failed", e);
        return emptyTrials;
      }),
      loadPapers().catch((e) => {
        console.error("pubmed failed", e);
        return emptyPapers;
      }),
    ]);

    return { fetchedAt: new Date().toISOString(), trials, papers };
  },
);

export const openEndoQueryOptions = {
  queryKey: ["openendo-data"] as const,
  queryFn: () => getOpenEndoData(),
  staleTime: 1000 * 60 * 30,
};
