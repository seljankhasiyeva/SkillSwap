import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/mentor/submissions")({
  component: () => <Outlet />,
});
