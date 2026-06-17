import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Psych References · PsychDispo" },
      {
        name: "description",
        content:
          "Comprehensive psychiatry reference: psychopharmacology, algorithms, diagnosis, and assessments.",
      },
    ],
  }),
  component: ReferencePage,
});

function ReferencePage() {
  return (
    <iframe
      src="/psychref.html"
      title="Psych Reference"
      style={{ border: 0, width: "100%", height: "100vh", display: "block" }}
    />
  );
}
