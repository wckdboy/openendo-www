import { createFileRoute } from "@tanstack/react-router";
import { LearnArticle } from "@/pages/LearnArticle";
import { learnArticleHead } from "@/lib/seo";

export const Route = createFileRoute("/da/learn/living")({
  head: () => learnArticleHead("da", "living"),
  component: function LearnDaLiving() {
    return <LearnArticle slug="living" />;
  },
});
