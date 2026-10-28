import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/da/learn")({
  component: function LearnDaLayout() {
    return <Outlet />;
  },
});
