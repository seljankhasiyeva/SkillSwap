import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/learner/challenges")({
  component: () => <Outlet />,
});
