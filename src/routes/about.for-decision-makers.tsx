import { createFileRoute } from "@tanstack/react-router";
import { DecisionMakers } from "@/pages/About";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about/for-decision-makers")({
  head: () =>
    pageHead({
      locale: "en",
      path: "/about/for-decision-makers",
      title: "For decision-makers — OpenEndo",
      description: "Open funding calls and public briefings. Past deadlines are omitted.",
    }),
  component: DecisionMakers,
});
