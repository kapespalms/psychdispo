import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";
import { psychrefEmbedSrc } from "@/lib/ref-embed";
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
  return <ToolFrame src={psychrefEmbedSrc()} title="Psych Reference" />;
}
