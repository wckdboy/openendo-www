import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/da/sources")({
  beforeLoad: () => {
    throw redirect({ to: "/da/about" });
  },
});
