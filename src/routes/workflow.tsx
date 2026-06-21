import { createFileRoute } from "@tanstack/react-router";
import { RepoLayout } from "@/components/repo-layout";
import { getRepository } from "@/data/repositories";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/workflow")({
  head: () =>
    pageHead({
      path: "/workflow",
      title: "Psych Dispo · PsychDispo",
      description:
        "Outpatient psychiatry resources in Ohio: medication management, acute crisis contacts, psychotherapy options, and social considerations.",
    }),
  component: WorkflowPage,
});

function WorkflowPage() {
  const repo = getRepository("workflow")!;
  return <RepoLayout repo={repo} />;
}
