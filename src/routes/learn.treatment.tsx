import { createFileRoute } from "@tanstack/react-router";
import { LearnArticle } from "@/pages/LearnArticle";
import { learnArticleHead } from "@/lib/seo";

export const Route = createFileRoute("/learn/treatment")({
  head: () => learnArticleHead("en", "treatment"),
  component: function LearnTreatment() {
    return <LearnArticle slug="treatment" />;
  },
});
