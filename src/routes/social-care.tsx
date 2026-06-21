import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";
import { psychdispoEmbedSrc } from "@/lib/psychdispo-embed";

export const Route = createFileRoute("/social-care")({
  head: () => ({
    meta: [
      { title: "Social Care Plan · PsychDispo" },
      {
        name: "description",
        content:
          "HRSN-aligned social needs screener with tonight vs ongoing triage, resource matching, and printable handoff sheets.",
      },
    ],
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
