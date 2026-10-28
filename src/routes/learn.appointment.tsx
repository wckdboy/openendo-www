import { createFileRoute } from "@tanstack/react-router";
import { AppointmentSheet } from "@/pages/AppointmentSheet";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/learn/appointment")({
  head: () =>
    pageHead({
      locale: "en",
      path: "/learn/appointment",
      title: "Bring this to your appointment — OpenEndo",
      description:
        "A printable checklist of the signs NICE NG73 says should raise suspicion of endometriosis, and a symptom diary.",
    }),
  component: AppointmentSheet,
});
