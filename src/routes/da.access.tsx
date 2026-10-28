import { createFileRoute } from "@tanstack/react-router";
import { Access } from "@/pages/Access";

const title = "Find hjælp — adgang til endometriosemedicin og behandling, land for land | OpenEndo";
const description =
  "Vælg dit land og se, hvilken endometriosemedicin der er godkendt og har tilskud, hvilke specialiserede centre behandler svær sygdom, og hvilke patientforeninger du kan kontakte. Med kilder og datoer.";

export const Route = createFileRoute("/da/access")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        property: "og:title",
        content: "Find hjælp — adgang til endometriosebehandling, land for land",
      },
      { property: "og:description", content: description },
      { property: "og:locale", content: "da_DK" },
      { property: "og:url", content: "https://openendo.org/da/access" },
    ],
    links: [
      { rel: "canonical", href: "https://openendo.org/da/access" },
      { rel: "alternate", hrefLang: "en", href: "https://openendo.org/access" },
      { rel: "alternate", hrefLang: "da", href: "https://openendo.org/da/access" },
    ],
  }),
  component: Access,
});
