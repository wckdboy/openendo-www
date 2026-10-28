import { createFileRoute } from "@tanstack/react-router";
import { LearnArticle } from "@/pages/LearnArticle";
import { learnArticleHead } from "@/lib/seo";

export const Route = createFileRoute("/da/learn/treatment")({
  head: () => learnArticleHead("da", "treatment"),
  component: function LearnDaTreatment() {
    return <LearnArticle slug="treatment" />;
  },
});
