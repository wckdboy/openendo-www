import { createFileRoute } from "@tanstack/react-router";
import { Access } from "@/pages/Access";

export const Route = createFileRoute("/access")({
  head: () => ({
    meta: [
      { property: "og:locale", content: "en_GB" },
      { title: "Find help — endometriosis medication and care access by country | OpenEndo" },
      {
        name: "description",
        content:
          "Select your country to see which endometriosis medications are approved and reimbursed, which specialised centres treat severe disease, and which support organisations to contact. Sourced and dated.",
      },
      {
        property: "og:title",
        content: "Find help — endometriosis medication and care access by country",
      },
      {
        property: "og:description",
        content:
          "Country-by-country endometriosis access: reimbursement status, specialised centres, care path and patient organisations — every entry sourced and verified.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://openendo.org/access" },
      { rel: "alternate", hrefLang: "en", href: "https://openendo.org/access" },
      { rel: "alternate", hrefLang: "da", href: "https://openendo.org/da/access" },
    ],
  }),
  component: Access,
});
