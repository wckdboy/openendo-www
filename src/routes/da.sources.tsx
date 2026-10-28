import { createFileRoute } from "@tanstack/react-router";
import { Sources } from "@/pages/Sources";
import { sourcesHead } from "@/lib/seo";

export const Route = createFileRoute("/da/sources")({
  head: () => sourcesHead("da"),
  component: Sources,
});
