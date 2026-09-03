import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/pages/Home";

const title = "OpenEndo — åbne data om endometrioseforskning, forsøg og bevillinger";
const description =
  "Åbne, live analyser af kliniske forsøg, forskning og bevillinger om endometriose. Fordi 190 millioner mennesker fortjener at blive taget alvorligt.";

export const Route = createFileRoute("/da/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "da_DK" },
      { property: "og:url", content: "https://openendo.org/da" },
    ],
    links: [
      { rel: "canonical", href: "https://openendo.org/da" },
      { rel: "alternate", hrefLang: "en", href: "https://openendo.org/" },
      { rel: "alternate", hrefLang: "da", href: "https://openendo.org/da" },
    ],
  }),
  component: Home,
});
