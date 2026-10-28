import { createFileRoute } from "@tanstack/react-router";
import { DecisionMakers } from "@/pages/About";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/da/about/for-decision-makers")({
  head: () =>
    pageHead({
      locale: "da",
      path: "/about/for-decision-makers",
      title: "Til beslutningstagere — OpenEndo",
      description: "Åbne bevillinger og offentlige notater. Frister der er passeret, er udeladt.",
    }),
  component: DecisionMakers,
});
