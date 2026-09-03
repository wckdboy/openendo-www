import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/pages/Dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
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
  }),
  component: Dashboard,
});
