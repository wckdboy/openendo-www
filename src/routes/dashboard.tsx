import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/pages/Dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { property: "og:locale", content: "en_GB" },
      { title: "Live endometriosis research dashboard — OpenEndo" },
      {
        name: "description",
        content:
          "Recruiting endometriosis clinical trials worldwide and in Denmark, plus PubMed publication output, fetched live from public registries.",
      },
      { property: "og:title", content: "Live endometriosis research dashboard — OpenEndo" },
      {
        property: "og:description",
        content:
          "Trials by country, Danish trial statuses, monthly publication counts and the newest papers on endometriosis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://openendo.org/dashboard" },
      { rel: "alternate", hrefLang: "en", href: "https://openendo.org/dashboard" },
      { rel: "alternate", hrefLang: "da", href: "https://openendo.org/da/dashboard" },
    ],
  }),
  component: Dashboard,
});
