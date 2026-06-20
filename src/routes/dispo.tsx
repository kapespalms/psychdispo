import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";

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
  const params = new URLSearchParams({ embed: "1" });
  if (resume) params.set("resume", "1");
  if (template) params.set("template", "1");
  if (fresh) params.set("fresh", "1");
  const src = `/psychdispo.html?${params.toString()}#plan`;
  return (
    <ToolFrame
      src={src}
      title="Psych Dispo — disposition workflow"
      showPhiBanner
    />
  );
}
