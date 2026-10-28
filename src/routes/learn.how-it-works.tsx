import { createFileRoute } from "@tanstack/react-router";
import { HowItWorks } from "@/pages/HowItWorks";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/learn/how-it-works")({
  head: () =>
    pageHead({
      locale: "en",
      path: "/learn/how-it-works",
      title: "How endometriosis works — OpenEndo",
      description:
        "Diagrams of how endometriosis develops, the theories of origin, what happens in the body, diagnosis, treatment, and what is still unknown. Each claim has a source.",
    }),
  component: HowItWorks,
});
