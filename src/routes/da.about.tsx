import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/pages/About";
import { aboutHead } from "@/lib/seo";

export const Route = createFileRoute("/da/about")({
  head: () => aboutHead("da"),
  component: About,
});
