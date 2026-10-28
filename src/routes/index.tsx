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
          "Clear, sourced information about endometriosis: symptoms, care, and the open research dataset.",
      },
      {
        property: "og:title",
        content: "OpenEndo — clear, sourced information about endometriosis",
      },
      {
        property: "og:description",
        content: "Guides with citations, and trial and paper counts from the open dataset.",
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
