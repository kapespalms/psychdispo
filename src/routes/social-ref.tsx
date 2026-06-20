import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";

export const Route = createFileRoute("/social-ref")({
  head: () => ({
    meta: [
      { title: "Social Ref · PsychDispo" },
      {
        name: "description",
        content:
          "Social needs reference: 211, housing coordinated entry, domestic violence hotlines, and Medicaid transport scripts for clinicians.",
      },
    ],
  }),
  component: SocialRefPage,
});

function SocialRefPage() {
  return <ToolFrame src="/socialref.html" title="Social Reference" />;
}
