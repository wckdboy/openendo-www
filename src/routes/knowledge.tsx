import { createFileRoute } from "@tanstack/react-router";
import { Knowledge } from "@/pages/Knowledge";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Endometriosis explained plainly — OpenEndo Knowledge" },
      {
        name: "description",
        content:
          "Plain-language reference on endometriosis: what it is, symptoms, how diagnosis works, treatment options, harmful myths and a glossary.",
      },
      { property: "og:title", content: "Endometriosis explained plainly — OpenEndo Knowledge" },
      {
        property: "og:description",
        content:
          "A sourced, plain-language guide to endometriosis for patients, relatives and clinicians.",
      },
    ],
  }),
  component: Knowledge,
});
