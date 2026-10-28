import { createFileRoute } from "@tanstack/react-router";
import { Find } from "@/pages/Find";
import { findHead } from "@/lib/seo";

export const Route = createFileRoute("/find")({
  head: () => findHead("en"),
  component: Find,
});
