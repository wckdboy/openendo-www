import { createFileRoute } from "@tanstack/react-router";
import { LearnArticle } from "@/pages/LearnArticle";
import { learnArticleHead } from "@/lib/seo";

export const Route = createFileRoute("/da/learn/denmark")({
  head: () => learnArticleHead("da", "denmark"),
  component: function LearnDaDenmark() {
    return <LearnArticle slug="denmark" />;
  },
});
