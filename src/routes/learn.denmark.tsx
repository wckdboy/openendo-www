import { createFileRoute } from "@tanstack/react-router";
import { LearnArticle } from "@/pages/LearnArticle";
import { learnArticleHead } from "@/lib/seo";

export const Route = createFileRoute("/learn/denmark")({
  head: () => learnArticleHead("en", "denmark"),
  component: function LearnDenmark() {
    return <LearnArticle slug="denmark" />;
  },
});
