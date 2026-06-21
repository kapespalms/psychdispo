import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";
import { psychdispoEmbedSrc } from "@/lib/psychdispo-embed";

export const Route = createFileRoute("/dispo")({
  validateSearch: (search: Record<string, unknown>) => ({
    resume: search.resume === "1" ? ("1" as const) : undefined,
    template: search.template === "1" ? ("1" as const) : undefined,
    fresh: search.fresh === "1" ? ("1" as const) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Psych Dispo · Plan" },
      {
        name: "description",
        content:
          "Guided psychiatric disposition workflow with safety screening, level of care, verified referrals, and a printable discharge packet.",
      },
    ],
  }),
  component: DispoPage,
});

function DispoPage() {
  const { resume, template, fresh } = Route.useSearch();
  const src = psychdispoEmbedSrc("plan", { resume, template, fresh });
  return (
    <ToolFrame
      src={src}
      title="Psych Dispo — disposition workflow"
      showPhiBanner
    />
  );
}
