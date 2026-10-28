import { createFileRoute } from "@tanstack/react-router";
import { Evidence } from "@/pages/Evidence";
import { evidenceHead } from "@/lib/seo";

export const Route = createFileRoute("/evidence")({
  head: () => evidenceHead("en"),
  component: Evidence,
});
