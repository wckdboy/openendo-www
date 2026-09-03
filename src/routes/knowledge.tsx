import { createFileRoute } from "@tanstack/react-router";
import { Knowledge } from "@/pages/Knowledge";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { property: "og:locale", content: "en_GB" },
      { title: "Endometriosis explained plainly — OpenEndo Knowledge" },
      {
        name: "description",
        content:
          "Plain-language reference on endometriosis: what it is, symptoms, how diagnosis works, treatment options, harmful myths and a glossary.",
      },
      { property: "og:title", content: "Endometriosis explained plainly — OpenEndo Knowledge" },
      {
        property: "og:description",
        content:
          "A sourced, plain-language guide to endometriosis for patients, relatives and clinicians.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://openendo.org/knowledge" },
      { rel: "alternate", hrefLang: "en", href: "https://openendo.org/knowledge" },
      { rel: "alternate", hrefLang: "da", href: "https://openendo.org/da/knowledge" },
    ],
  }),
  component: Knowledge,
});
