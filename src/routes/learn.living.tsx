import { createFileRoute } from "@tanstack/react-router";
import { LearnArticle } from "@/pages/LearnArticle";
import { learnArticleHead } from "@/lib/seo";

export const Route = createFileRoute("/learn/living")({
  head: () => learnArticleHead("en", "living"),
  component: function LearnLiving() {
    return <LearnArticle slug="living" />;
  },
});
