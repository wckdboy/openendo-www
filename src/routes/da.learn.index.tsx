import { createFileRoute } from "@tanstack/react-router";
import { LearnIndex } from "@/pages/LearnIndex";
import { learnIndexHead } from "@/lib/seo";

export const Route = createFileRoute("/da/learn/")({
  head: () => learnIndexHead("da"),
  component: LearnIndex,
});
