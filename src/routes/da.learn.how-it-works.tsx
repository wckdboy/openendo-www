import { createFileRoute } from "@tanstack/react-router";
import { HowItWorks } from "@/pages/HowItWorks";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/da/learn/how-it-works")({
  head: () =>
    pageHead({
      locale: "da",
      path: "/learn/how-it-works",
      title: "Sådan virker endometriose — OpenEndo",
      description:
        "Diagrammer af hvordan endometriose udvikler sig, teorier om årsag, det der sker i kroppen, udredning, behandling og det der stadig er ukendt. Hvert udsagn har en kilde.",
    }),
  component: HowItWorks,
});
