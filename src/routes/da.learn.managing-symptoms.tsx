import { createFileRoute } from "@tanstack/react-router";
import { ManagingSymptoms } from "@/pages/ManagingSymptoms";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/da/learn/managing-symptoms")({
  head: () =>
    pageHead({
      locale: "da",
      path: "/learn/managing-symptoms",
      title: "Håndter symptomer — OpenEndo",
      description:
        "Smertelindring, hormoner, operation, fertilitet og støtte som NICE NG73 og ESHRE 2022 nævner dem, plus en plan når smerten stiger og en symptomdagbog.",
    }),
  component: ManagingSymptoms,
});
