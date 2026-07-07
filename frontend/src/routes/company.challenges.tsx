import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/company/challenges")({
  component: () => <Outlet />,
});