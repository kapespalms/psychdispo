import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LandingHeader } from "@/components/landing-header";
import { useAuth } from "@/lib/auth";
import {
  guestDraftSummary,
  meaningfulDraftForSignedInUser,
  type PlanPayload,
} from "@/lib/plans";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      path: "/",
      title: "PsychDispo · Psychiatric Disposition",
      description:
        "Evidence-informed psychiatric disposition — verified community resources, structured safety review, and discharge documentation.",
    }),
  component: Index,
});

/** Four clinical tools — merged into hero house (replaces separate Contents section). */
const HERO_TOOLS = [
  {
    to: "/dispo" as const,
    label: "Dispo plan",
    desc: "Disposition planning — chart note and patient handoff.",
  },
  {
    to: "/directory" as const,
    label: "Resource directory",
    desc: "Verified programs across all fifty states.",
  },
  {
    to: "/social-care" as const,
    label: "Social care",
    desc: "Health-related social needs and handoff.",
  },
  {
    to: "/reference" as const,
    label: "Psych reference",
    desc: "High-yield emergency psychiatry protocols.",
  },
] as const;

const LANDING_RESUME_DISMISS_KEY = "psychdispo.landingResumeDismissed";

function Index() {
  const { user, ready } = useAuth();
  const [draft, setDraft] = useState<PlanPayload | null>(null);
  const [resumeDismissed, setResumeDismissed] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const p = meaningfulDraftForSignedInUser(user);
    setDraft(p);
    setResumeDismissed(sessionStorage.getItem(LANDING_RESUME_DISMISS_KEY) === "1");
  }, [user, ready]);

  const resume = draft ? guestDraftSummary(draft) : null;
  const showResumeChip = resume && !resumeDismissed;

  function dismissLandingResume() {
    sessionStorage.setItem(LANDING_RESUME_DISMISS_KEY, "1");
    setResumeDismissed(true);
  }

  return (
    <div className="landing-screen flex flex-col flex-1 min-h-0 overflow-hidden text-[var(--ink)]">
      <LandingHeader />

      <main className="flex flex-col flex-1 min-h-0 overflow-hidden px-5 sm:px-10">
        {showResumeChip && (
          <div className="landing-resume-chip shrink-0 mt-2 sm:mt-3" role="status">
            <span className="landing-resume-chip-text">
              Saved plan · {resume.savedLabel}
              {resume.detail !== "Disposition plan" && <> · {resume.detail}</>}
            </span>
            <Link to="/dispo" search={{ resume: "1" }} className="landing-resume-chip-link">
              Resume
            </Link>
            <button
              type="button"
              className="landing-resume-chip-close"
              onClick={dismissLandingResume}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <section className="landing-hero flex-1 min-h-0 flex flex-col justify-center py-4 sm:py-6">
          <div className="landing-hero-inner">
            <header className="landing-hero-copy min-w-0">
              <h1 className="headline-display headline-display-compact mb-3">
                A clinical disposition planner — safer handoff for your{" "}
                <span className="headline-accent">patient</span> and team.
              </h1>
              <p className="text-[0.9375rem] leading-[1.5] text-[var(--mut)] mb-5 max-w-[26rem]">
                Tools to plan disposition smoothly, with less broken communication between visits.
              </p>
              <Link to="/dispo" className="btn-blue">
                Open plan
              </Link>
            </header>

            <div className="hero-house" aria-label="Clinical tools">
              <div className="hero-house-roof" aria-hidden="true" />
              <div className="hero-house-body">
                <div className="hero-house-grid">
                  {HERO_TOOLS.map(({ to, label, desc }) => (
                    <Link key={to} to={to} className="hero-house-cell">
                      <span className="hero-house-cell-label">{label}</span>
                      <span className="hero-house-cell-desc">{desc}</span>
                    </Link>
                  ))}
                </div>
                {/*
                  Door metaphor: disposition as safe home / handoff.
                  Patient handoff paper goes to psychiatric patients who must follow it
                  for their next appointment and ongoing communication.
                */}
                <div className="hero-house-door" aria-hidden="true">
                  <span className="hero-house-door-frame" />
                  <span className="hero-house-door-knob" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="landing-foot shrink-0 py-2 text-[0.6875rem] leading-snug text-[var(--mut)] border-t border-[var(--line)]">
          <p>
            <Link to="/privacy" className="text-link">
              privacy
            </Link>
            <span aria-hidden="true"> · </span>
            <Link to="/terms" className="text-link">
              terms
            </Link>
            <span aria-hidden="true"> · </span>
            <Link to="/trust" className="text-link">
              trust
            </Link>
            <span aria-hidden="true"> · </span>
            <Link to="/about" className="text-link">
              about
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
