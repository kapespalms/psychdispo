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

const CONTENTS = [
  {
    num: "01",
    to: "/dispo" as const,
    title: "Disposition plan",
    desc: "Safety screen, resource match, chart note, patient packet.",
  },
  {
    num: "02",
    to: "/directory" as const,
    title: "Resource directory",
    desc: "Verified programs — all fifty states.",
  },
  {
    num: "03",
    to: "/social-care" as const,
    title: "Social care plan",
    desc: "Health-related social needs and handoff.",
  },
  {
    num: "04",
    to: "/reference" as const,
    title: "Psychiatric reference",
    desc: "High-yield emergency protocols — includes Psych Emerg Review.",
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
          <header className="min-w-0 max-w-[36rem]">
            <h1 className="headline-display headline-display-compact mb-3">
              Disposition to <span className="headline-accent">documented</span> handoff.
            </h1>
            <p className="text-[0.9375rem] leading-[1.5] text-[var(--mut)] mb-5 max-w-[28rem]">
              Safety documentation, verified referrals, and discharge materials for emergency and
              consult psychiatry.
            </p>
            <Link to="/dispo" className="btn-blue">
              Open plan
            </Link>
          </header>
        </section>

        <section className="landing-contents shrink-0 py-3 sm:py-4">
          <p className="kicker mb-2 sm:mb-3">Contents</p>
          <div className="landing-contents-grid">
            {CONTENTS.map(({ num, to, title, desc }) => (
              <Link key={to} to={to} className="landing-contents-item">
                <span className="landing-contents-num">{num}</span>
                <span className="landing-contents-title">{title}</span>
                <span className="landing-contents-desc">{desc}</span>
              </Link>
            ))}
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
