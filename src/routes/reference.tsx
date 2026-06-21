import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/reference")({
  head: () =>
    pageHead({
      path: "/reference",
      title: "Psych Ref · PsychDispo",
      description:
        "Comprehensive psychiatry reference: psychopharmacology, algorithms, diagnosis, and assessments.",
    }),
  component: ReferencePage,
});

function ReferencePage() {
  return <ToolFrame src="/psychref.html" title="Psych Reference" />;
}
