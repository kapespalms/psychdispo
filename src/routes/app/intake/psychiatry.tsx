import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/intake/psychiatry")({
  beforeLoad: () => {
    throw redirect({ to: "/dispo" });
  },
});
