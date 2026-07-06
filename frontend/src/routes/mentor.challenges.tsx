import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/mentor/challenges")({
  component: () => <Outlet />,
});

