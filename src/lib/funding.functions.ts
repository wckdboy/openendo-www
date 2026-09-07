import { createServerFn } from "@tanstack/react-start";

/**
 * The funding list lives in the OpenEndo repo as curated JSON. The repo is
 * canonical — we fetch it live and never copy its contents into app code.
 */
const FUNDING_URL =
  "https://raw.githubusercontent.com/wckdboy/openendo/main/docs/data/funding.json";

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

const CACHE_MS = 1000 * 60 * 30;
let cache: { at: number; data: FundingEntry[] } | null = null;

export const getFunding = createServerFn({ method: "GET" }).handler(
  async (): Promise<FundingEntry[]> => {
    if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;

    const res = await fetch(FUNDING_URL, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`funding.json ${res.status}`);
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) throw new Error("funding.json: unexpected shape");

    const list = data.filter(
      (e): e is FundingEntry => Boolean(e) && typeof (e as FundingEntry).name === "string",
    );
    cache = { at: Date.now(), data: list };
    return list;
  },
);

export const fundingQueryOptions = {
  queryKey: ["openendo-funding"] as const,
  queryFn: () => getFunding(),
  staleTime: CACHE_MS,
  retry: 1,
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Open calls with a real deadline, nearest first. */
export function openByDeadline(entries: FundingEntry[] | undefined, limit = 4): FundingEntry[] {
  if (!Array.isArray(entries)) return [];
  return entries
    .filter((e) => e.open === true && typeof e.deadline === "string" && ISO_DATE.test(e.deadline))
    .sort((a, b) => (a.deadline as string).localeCompare(b.deadline as string))
    .slice(0, limit);
}
