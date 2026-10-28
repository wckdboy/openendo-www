import { createFileRoute } from "@tanstack/react-router";
import { LearnArticle } from "@/pages/LearnArticle";
import { learnArticleHead } from "@/lib/seo";

export const Route = createFileRoute("/da/learn/diagnosis")({
  head: () => learnArticleHead("da", "diagnosis"),
  component: function LearnDaDiagnosis() {
    return <LearnArticle slug="diagnosis" />;
  },
});
