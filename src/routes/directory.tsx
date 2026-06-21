import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";
import { psychdispoEmbedSrc } from "@/lib/psychdispo-embed";

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
    <ToolFrame
      src={psychdispoEmbedSrc("directory")}
      title="PsychDispo resource directory"
    />
  );
}
