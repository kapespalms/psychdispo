import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";
import { psychdispoEmbedSrc } from "@/lib/psychdispo-embed";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/social-care")({
  head: () =>
    pageHead({
      path: "/social-care",
      title: "Social Care Plan · PsychDispo",
      description:
        "HRSN-aligned social needs screener with tonight vs ongoing triage, resource matching, and printable handoff sheets.",
    }),
  component: SocialCarePage,
});

function SocialCarePage() {
  return (
    <ToolFrame
      src={psychdispoEmbedSrc("social-care")}
      title="PsychDispo — Social Care Plan"
    />
  );
}
