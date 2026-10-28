import { createFileRoute } from "@tanstack/react-router";
import { AppointmentSheet } from "@/pages/AppointmentSheet";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/da/learn/appointment")({
  head: () =>
    pageHead({
      locale: "da",
      path: "/learn/appointment",
      title: "Tag dette med til lægen — OpenEndo",
      description:
        "En liste til udskrift med de tegn, NICE NG73 siger man skal mistænke endometriose ved, og en symptomdagbog.",
    }),
  component: AppointmentSheet,
});
