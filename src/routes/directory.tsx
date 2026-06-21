import { createFileRoute } from "@tanstack/react-router";
import { ToolFrame } from "@/components/tool-frame";
import { psychdispoEmbedSrc } from "@/lib/psychdispo-embed";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/directory")({
  head: () =>
    pageHead({
      path: "/directory",
      title: "Resource Directory · PsychDispo",
      description:
        "Search verified psychiatric and community resources by metro, category, or keyword.",
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
