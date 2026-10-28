import { createFileRoute } from "@tanstack/react-router";
import { ManagingSymptoms } from "@/pages/ManagingSymptoms";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/learn/managing-symptoms")({
  head: () =>
    pageHead({
      locale: "en",
      path: "/learn/managing-symptoms",
      title: "Managing symptoms — OpenEndo",
      description:
        "Pain relief, hormonal treatment, surgery, fertility care, and support as NICE NG73 and ESHRE 2022 name them, plus a flare plan and a symptom diary.",
    }),
  component: ManagingSymptoms,
});
