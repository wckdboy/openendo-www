import { createFileRoute } from "@tanstack/react-router";
import { Find } from "@/pages/Find";
import { findHead } from "@/lib/seo";

export const Route = createFileRoute("/da/find")({
  head: () => findHead("da"),
  component: Find,
});
