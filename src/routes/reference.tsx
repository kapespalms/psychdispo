import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Psych Ref · PsychDispo" },
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
  return <ToolFrame src="/psychref.html" title="Psych Reference" />;
}
