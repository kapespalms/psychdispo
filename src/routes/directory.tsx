import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";

export const Route = createFileRoute("/directory")({
  head: () => ({
    meta: [
      { title: "Resource Directory · PsychDispo" },
      {
        name: "description",
        content:
          "Search verified psychiatric and community resources by metro, category, or keyword.",
      },
    ],
  }),
  component: DirectoryPage,
});

function DirectoryPage() {
  return (
    <ToolFrame src="/psychdispo.html?embed=1#directory" title="PsychDispo resource directory" />
  );
}
