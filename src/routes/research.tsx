import { createFileRoute } from "@tanstack/react-router";
import { Research } from "@/pages/Research";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { property: "og:locale", content: "en_GB" },
      { title: "Research explainer — what we know, what we're testing | OpenEndo" },
      {
        name: "description",
        content:
          "A plain-language tour of OpenEndo's endometriosis research: what the evidence supports, what is being tested, and what nobody knows yet. Published live from the open repository.",
      },
      {
        property: "og:title",
        content: "Research explainer — what we know, what we're testing, what we don't know yet",
      },
      {
        property: "og:description",
        content:
          "Open, sourced and honest: OpenEndo's endometriosis research explainer, rendered live from the canonical repository document.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://openendo.org/research" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://openendo.org/research" },
      { rel: "alternate", hrefLang: "en", href: "https://openendo.org/research" },
      { rel: "alternate", hrefLang: "da", href: "https://openendo.org/da/research" },
    ],
  }),
  component: Research,
});
