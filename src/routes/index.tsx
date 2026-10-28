import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:locale", content: "en_GB" },
      { title: "OpenEndo — clear, sourced information about endometriosis" },
      {
        name: "description",
        content:
          "Live, open analytics on endometriosis clinical trials, research and funding. Because 190 million people deserve to be taken seriously.",
      },
      {
        property: "og:title",
        content: "OpenEndo — clear, sourced information about endometriosis",
      },
      {
        property: "og:description",
        content:
          "Every endometriosis trial, paper and grant, tracked in the open and refreshed from public registries.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://openendo.org/" },
      { rel: "alternate", hrefLang: "en", href: "https://openendo.org/" },
      { rel: "alternate", hrefLang: "da", href: "https://openendo.org/da" },
    ],
  }),
  component: Home,
});
