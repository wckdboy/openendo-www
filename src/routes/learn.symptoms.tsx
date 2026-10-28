import { createFileRoute } from "@tanstack/react-router";
import { LearnArticle } from "@/pages/LearnArticle";
import { learnArticleHead } from "@/lib/seo";

export const Route = createFileRoute("/learn/symptoms")({
  head: () => learnArticleHead("en", "symptoms"),
  component: function LearnSymptoms() {
    return <LearnArticle slug="symptoms" />;
  },
});
