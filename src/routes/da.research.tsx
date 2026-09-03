import { createFileRoute } from "@tanstack/react-router";
import { Research } from "@/pages/Research";

const title = "Forskningsgennemgang — det vi ved, det vi tester | OpenEndo";
const description =
  "En gennemgang i almindeligt sprog af OpenEndos endometrioseforskning: hvad evidensen understøtter, hvad der bliver testet, og hvad ingen endnu ved. Udgivet live fra det åbne repositorium.";

export const Route = createFileRoute("/da/research")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        property: "og:title",
        content: "Forskningsgennemgang — det vi ved, det vi tester, og det vi endnu ikke ved",
      },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "da_DK" },
      { property: "og:url", content: "https://openendo.org/da/research" },
    ],
    links: [
      { rel: "canonical", href: "https://openendo.org/da/research" },
      { rel: "alternate", hrefLang: "en", href: "https://openendo.org/research" },
      { rel: "alternate", hrefLang: "da", href: "https://openendo.org/da/research" },
    ],
  }),
  component: Research,
});
