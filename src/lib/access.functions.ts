import { createServerFn } from "@tanstack/react-start";

/**
 * Access data lives in the OpenEndo repo as a curated, sourced JSON
 * (schema: openendo-access-v1). We never hard-code its contents — the file
 * grows with more countries over time.
 */
const ACCESS_URL =
  "https://raw.githubusercontent.com/wckdboy/openendo/main/docs/data/access.json";

export type Localized = { en: string; da: string };

export type AccessLevel =
  | "reimbursed"
  | "out_of_pocket"
  | "nhs_option"
  | "prescription"
  | "specialist"
  | "conditional"
  | "not_approved"
  | (string & {});

export type Medication = {
  id?: string;
  name: string;
  class?: string;
  approved?: boolean;
  approval_note?: Localized;
  access_level: AccessLevel;
  access_note?: Localized;
  prescription_note?: Localized;
  price_note?: Localized;
  confidence?: string;
  verified?: string;
  sources?: string[];
};

export type Center = {
  id?: string;
  name: Localized;
  type?: string;
  area?: Localized;
  note?: Localized;
  url?: string;
  confidence?: string;
  verified?: string;
  sources?: string[];
};

export type Organization = {
  id?: string;
  name: Localized;
  services?: Localized;
  url?: string;
  contact?: Localized;
  confidence?: string;
  verified?: string;
  sources?: string[];
};

export type PostcodeConfig = {
  supported: boolean;
  format?: Localized;
  region_note?: Localized;
  region_ranges?: Record<string, [number, number][]>;
  confidence?: string;
  note?: string;
};

export type Country = {
  name: Localized;
  coverage: "full" | "orgs_only" | (string & {});
  verified?: string;
  medications?: Medication[];
  centers?: Center[];
  organizations?: Organization[];
  access_path?: { en: string[]; da: string[] };
  postcode?: PostcodeConfig;
};

export type AccessData = {
  schema: string;
  updated?: string;
  disclaimer: Localized;
  countries: Record<string, Country>;
};

let cache: { at: number; data: AccessData } | null = null;
const CACHE_MS = 1000 * 60 * 30;

export const getAccessData = createServerFn({ method: "GET" }).handler(
  async (): Promise<AccessData> => {
    if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;

    const res = await fetch(ACCESS_URL, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`access.json ${res.status}`);
    const data = (await res.json()) as AccessData;

    if (!data?.countries || typeof data.countries !== "object") {
      throw new Error("access.json: unexpected shape");
    }

    cache = { at: Date.now(), data };
    return data;
  },
);

export const accessQueryOptions = {
  queryKey: ["openendo-access"] as const,
  queryFn: () => getAccessData(),
  staleTime: CACHE_MS,
  retry: 1,
};

/** Pick a localized string, falling back to English then to an empty string. */
export function pick(value: Localized | undefined, locale: "en" | "da"): string {
  if (!value) return "";
  return value[locale] || value.en || "";
}

/** Resolve a Danish 4-digit postcode to its region + nearest specialised centre. */
export function resolveRegion(
  postcode: string,
  config: PostcodeConfig | undefined,
): { region: string; side: "east" | "west" } | null {
  const n = Number(postcode);
  if (!config?.region_ranges || !/^\d{4}$/.test(postcode) || Number.isNaN(n)) return null;
  for (const [region, ranges] of Object.entries(config.region_ranges)) {
    if (ranges.some(([lo, hi]) => n >= lo && n <= hi)) {
      const east = region === "Hovedstaden" || region === "Sjælland";
      return { region, side: east ? "east" : "west" };
    }
  }
  return null;
}
