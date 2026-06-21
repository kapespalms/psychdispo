import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { EditorialFooterLinks } from "@/components/editorial-footer-links";
import { EditorialPage } from "@/components/editorial-page";
import { useAuth } from "@/lib/auth";
import { deleteCloudTemplate, fetchCloudTemplates } from "@/lib/cloud-library";
import { isSupabaseConfigured } from "@/lib/supabase";
import { deletePlan, listPlans, planMeta, resumePlanToGuestDraft, type SavedPlan } from "@/lib/plans";
import {
  applyTemplateToGuestDraft,
  deleteTemplate,
  listTemplates,
  type PlanTemplate,
} from "@/lib/templates";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/plans")({
  head: () =>
    pageHead({
      path: "/plans",
      title: "My plans · PsychDispo",
      description: "Saved disposition plans and templates.",
      noindex: true,
    }),
  component: PlansPage,
});

function PlansPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [templates, setTemplates] = useState<PlanTemplate[]>([]);
  const [cloudError, setCloudError] = useState("");

  const refresh = useCallback(async () => {
    if (!user) return;
    setPlans(listPlans(user.email));

    if (isSupabaseConfigured()) {
      try {
        const cloud = await fetchCloudTemplates();
        setTemplates(cloud);
        setCloudError("");
      } catch (err) {
        setCloudError(err instanceof Error ? err.message : "Could not load cloud templates.");
        setTemplates(listTemplates(user.email));
      }
    } else {
      setTemplates(listTemplates(user.email));
    }
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate({ to: "/sign-in", replace: true });
      return;
    }
    refresh();
  }, [ready, user, navigate, refresh]);

  function handleResume(plan: SavedPlan) {
    resumePlanToGuestDraft(plan);
    navigate({ to: "/dispo", search: { resume: "1" } });
  }

  function handleDelete(id: string) {
    if (!user) return;
    if (!window.confirm("Delete this saved plan? This cannot be undone.")) return;
    deletePlan(user.email, id);
    refresh();
  }

  async function handleDeleteTemplate(id: string) {
    if (!user) return;
    if (!window.confirm("Delete this template?")) return;
    if (isSupabaseConfigured()) {
      try {
        await deleteCloudTemplate(id);
      } catch {
        deleteTemplate(user.email, id);
      }
    } else {
      deleteTemplate(user.email, id);
    }
    refresh();
  }

  function handleUseTemplate(template: PlanTemplate) {
    applyTemplateToGuestDraft(template.scaffold);
    navigate({ to: "/dispo", search: { template: "1" } });
  }

  if (!ready || !user) {
    return (
      <div className="flex flex-1 min-h-0 items-center justify-center text-sm text-[var(--mut)]">
        Loading…
      </div>
    );
  }

  return (
    <EditorialPage
      kicker="Account"
      title="My plans"
      subtitle="Saved disposition plans stay on this device. Cloud-synced templates store defaults and resource selections only — never patient details."
      actions={
        <Link to="/dispo" search={{ fresh: "1" }} className="nav-bar-link">
          new plan →
        </Link>
      }
      footer={<EditorialFooterLinks />}
    >
      {cloudError && (
        <p className="form-error mb-6" role="alert">
          Cloud library: {cloudError}
        </p>
      )}

      {templates.length > 0 && (
        <section className="mb-10">
          <p className="kicker mb-3">Templates</p>
          <p className="text-[0.875rem] leading-relaxed text-[var(--mut)] mb-4">
            Scaffold-only — no patient identifiers. Save new templates from the Deliver step.
          </p>
          <ul>
            {templates.map((t) => {
              const date = new Date(t.updatedAt).toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <li key={t.id} className="editorial-list-row">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-[1.125rem] font-medium truncate">{t.name}</h3>
                    <p className="text-xs text-[var(--mut)] mt-1">
                      {t.type} · edited {date}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button type="button" onClick={() => handleUseTemplate(t)} className="btn-blue">
                      Use template
                    </button>
                    <button type="button" onClick={() => handleDeleteTemplate(t.id)} className="nav-bar-link">
                      delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {plans.length === 0 ? (
        <div className="py-8 text-center border-t border-[var(--line)]">
          <p className="font-serif text-[1.25rem] text-[var(--mut)]">No saved plans yet</p>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-[var(--mut)] max-w-md mx-auto">
            Complete a disposition workflow and save your plan from the Deliver step. You can also{" "}
            <strong className="text-[var(--ink)] font-medium">Save as template</strong> on Deliver to
            reuse defaults (scaffold only — no patient info) on your next case.
          </p>
          <Link to="/dispo" search={{ fresh: "1" }} className="btn-blue inline-block mt-6">
            Start a plan
          </Link>
        </div>
      ) : (
        <section>
          <p className="kicker mb-3">This device</p>
          <ul>
            {plans.map((plan) => {
              const meta = planMeta(plan);
              const date = new Date(plan.updatedAt).toLocaleString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });
              return (
                <li key={plan.id} className="editorial-list-row">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-[1.125rem] font-medium truncate">{plan.name}</h2>
                    <p className="text-xs text-[var(--mut)] mt-1">{date}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-[var(--mut)]">
                      <span>{meta.location}</span>
                      {meta.setting && (
                        <span>
                          · {meta.setting === "Acute" ? "Acute / Inpatient" : "Outpatient"}
                        </span>
                      )}
                      {meta.insurance && <span>· {meta.insurance}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button type="button" onClick={() => handleResume(plan)} className="btn-blue">
                      Resume
                    </button>
                    <button type="button" onClick={() => handleDelete(plan.id)} className="nav-bar-link">
                      delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </EditorialPage>
  );
}
