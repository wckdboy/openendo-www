import { createFileRoute } from "@tanstack/react-router";
import { Sources } from "@/pages/Sources";
import { sourcesHead } from "@/lib/seo";

export const Route = createFileRoute("/sources")({
  head: () => sourcesHead("en"),
  component: Sources,
});
