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
          "Sourced knowledge on endometriosis: treatments, diagnostics and research concepts, published from the open repository.",
      },
      { property: "og:title", content: "Endometriosis explained plainly — OpenEndo Knowledge" },
      {
        property: "og:description",
        content:
          "A sourced knowledge base on endometriosis treatments, diagnostics and research — fetched live from the open repository.",
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
