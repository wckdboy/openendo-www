import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/trials")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
