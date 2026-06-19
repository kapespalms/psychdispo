import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { deletePlan, listPlans, planMeta, resumePlanToGuestDraft, type SavedPlan } from "@/lib/plans";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [{ title: "My plans · PsychDispo" }],
  }),
  component: PlansPage,
});

function PlansPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SavedPlan[]>([]);

  const refresh = useCallback(() => {
    if (user) setPlans(listPlans(user.email));
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

  if (!ready || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
              My plans
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Saved disposition plans on this device. Resume to continue or delete when no longer
              needed.
            </p>
          </div>
          <Link
            to="/dispo"
            className="shrink-0 text-sm font-medium text-[#2640C8] hover:underline pt-1"
          >
            New plan →
          </Link>
        </div>

        {plans.length === 0 ? (
          <div className="border border-border bg-white rounded-sm p-8 text-center">
            <p className="font-serif text-xl text-muted-foreground">No saved plans yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete a disposition workflow and save your plan from the packet step.
            </p>
            <Link
              to="/dispo"
              className="inline-block mt-6 px-5 py-2.5 bg-[#2640C8] text-white text-sm font-semibold hover:bg-[#1b2f9c] transition-colors"
            >
              Start a plan
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
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
                <li
                  key={plan.id}
                  className="border border-border bg-white rounded-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-lg font-semibold truncate">{plan.name}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{date}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-[#eef1fb] text-[#1b2f9c] rounded-full">
                        {meta.location}
                      </span>
                      {meta.setting && (
                        <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                          {meta.setting === "Acute" ? "Acute / Inpatient" : "Outpatient"}
                        </span>
                      )}
                      {meta.insurance && (
                        <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                          {meta.insurance}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleResume(plan)}
                      className="px-4 py-2 text-sm font-semibold bg-[#2640C8] text-white hover:bg-[#1b2f9c] transition-colors"
                    >
                      Resume
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(plan.id)}
                      className="px-4 py-2 text-sm text-muted-foreground border border-border hover:text-destructive hover:border-destructive/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
