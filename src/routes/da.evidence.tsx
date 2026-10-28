import { createFileRoute } from "@tanstack/react-router";
import { Evidence } from "@/pages/Evidence";
import { evidenceHead } from "@/lib/seo";

export const Route = createFileRoute("/da/evidence")({
  head: () => evidenceHead("da"),
  component: Evidence,
});
