import type { BasePath } from "@/lib/site";

export type SectionId =
  "understand" | "diagnosis" | "treatment" | "living" | "denmark" | "research" | "data";

/** Primary entry points. Labels live in copy so EN and DA stay together. */
export const PRIMARY_SECTIONS: { id: SectionId; path: BasePath }[] = [
  { id: "understand", path: "/learn" },
  { id: "diagnosis", path: "/learn/diagnosis" },
  { id: "treatment", path: "/learn/treatment" },
  { id: "living", path: "/learn/living" },
  { id: "denmark", path: "/learn/denmark" },
  { id: "research", path: "/evidence" },
  { id: "data", path: "/dashboard" },
];

/** Extra pages included in the index, beyond the seven entry points. */
export const INDEX_PATHS = [
  "/learn/symptoms",
  "/learn/how-it-works",
  "/learn/managing-symptoms",
  "/learn/appointment",
  "/access",
  "/research",
  "/knowledge",
  "/sources",
] as const satisfies readonly BasePath[];
