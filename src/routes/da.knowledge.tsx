import { createFileRoute } from "@tanstack/react-router";
import { Knowledge } from "@/pages/Knowledge";

const title = "Endometriose forklaret i klart sprog — OpenEndo Viden";
const description =
  "Opslagsværk i almindeligt sprog om endometriose: hvad det er, symptomer, hvordan diagnosen stilles, behandlingsmuligheder, skadelige myter og en ordliste.";

export const Route = createFileRoute("/da/knowledge")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "da_DK" },
      { property: "og:url", content: "https://openendo.org/da/knowledge" },
    ],
    links: [
      { rel: "canonical", href: "https://openendo.org/da/knowledge" },
      { rel: "alternate", hrefLang: "en", href: "https://openendo.org/knowledge" },
      { rel: "alternate", hrefLang: "da", href: "https://openendo.org/da/knowledge" },
    ],
  }),
  component: Knowledge,
});
