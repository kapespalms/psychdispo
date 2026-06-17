import { createFileRoute } from "@tanstack/react-router";
import { RepoLayout } from "@/components/repo-layout";
import { getRepository } from "@/data/repositories";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "Psych Dispo · PsychDispo" },
      {
        name: "description",
        content:
          "Outpatient psychiatry resources in Ohio: medication management, acute crisis contacts, psychotherapy options, and social considerations.",
      },
    ],
  }),
  component: WorkflowPage,
});

function WorkflowPage() {
  const repo = getRepository("workflow")!;
  return <RepoLayout repo={repo} />;
}
