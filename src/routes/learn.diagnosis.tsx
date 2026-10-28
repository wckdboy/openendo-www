import { createFileRoute } from "@tanstack/react-router";
import { LearnArticle } from "@/pages/LearnArticle";
import { learnArticleHead } from "@/lib/seo";

export const Route = createFileRoute("/learn/diagnosis")({
  head: () => learnArticleHead("en", "diagnosis"),
  component: function LearnDiagnosis() {
    return <LearnArticle slug="diagnosis" />;
  },
});
