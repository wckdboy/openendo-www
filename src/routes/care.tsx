import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/care")({
  beforeLoad: () => {
    throw redirect({ to: "/access" });
  },
});
