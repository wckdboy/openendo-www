import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/pages/Dashboard";

const title = "Live dashboard for endometrioseforskning — OpenEndo";
const description =
  "Kliniske forsøg om endometriose der rekrutterer globalt og i Danmark, samt publiceret forskning fra PubMed — hentet live fra offentlige registre.";

export const Route = createFileRoute("/da/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "da_DK" },
      { property: "og:url", content: "https://openendo.org/da/dashboard" },
    ],
    links: [
      { rel: "canonical", href: "https://openendo.org/da/dashboard" },
      { rel: "alternate", hrefLang: "en", href: "https://openendo.org/dashboard" },
      { rel: "alternate", hrefLang: "da", href: "https://openendo.org/da/dashboard" },
    ],
  }),
  component: Dashboard,
});
