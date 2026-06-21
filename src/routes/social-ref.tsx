import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/social-ref")({
  head: () =>
    pageHead({
      path: "/social-ref",
      title: "Social Ref · PsychDispo",
      description:
        "Social needs reference: 211, housing coordinated entry, domestic violence hotlines, and Medicaid transport scripts for clinicians.",
    }),
  component: SocialRefPage,
});

function SocialRefPage() {
  return <ToolFrame src="/socialref.html" title="Social Reference" />;
}
