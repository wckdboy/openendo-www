import { createFileRoute } from "@tanstack/react-router";
import { LearnArticle } from "@/pages/LearnArticle";
import { learnArticleHead } from "@/lib/seo";

export const Route = createFileRoute("/da/learn/symptoms")({
  head: () => learnArticleHead("da", "symptoms"),
  component: function LearnDaSymptoms() {
    return <LearnArticle slug="symptoms" />;
  },
});
