import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HeroIllustration } from "@/components/hero-illustration";
import { LandingHeader } from "@/components/landing-header";
import {
  guestDraftSummary,
  hasMeaningfulPlan,
  loadGuestDraft,
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
  const [draft, setDraft] = useState<PlanPayload | null>(null);
  const [resumeDismissed, setResumeDismissed] = useState(false);

  useEffect(() => {
    const p = loadGuestDraft();
    setDraft(hasMeaningfulPlan(p) ? p : null);
    setResumeDismissed(sessionStorage.getItem(LANDING_RESUME_DISMISS_KEY) === "1");
  }, []);

  const resume = draft ? guestDraftSummary(draft) : null;
  const showResumePanel = resume && !resumeDismissed;

  function dismissLandingResume() {
    sessionStorage.setItem(LANDING_RESUME_DISMISS_KEY, "1");
    setResumeDismissed(true);
  }

  return (
    <div className="landing-screen flex flex-col flex-1 min-h-0 overflow-hidden text-[var(--ink)]">
      <LandingHeader />

      <main className="flex flex-col flex-1 min-h-0 overflow-hidden px-5 sm:px-10">
        <section className="landing-hero flex-1 min-h-0 grid lg:grid-cols-[minmax(0,1fr)_minmax(180px,36%)] gap-4 lg:gap-8 items-center py-3 sm:py-5 overflow-hidden">
          <header className="min-w-0">
            <p className="script-kicker script-kicker-compact">Disposition</p>
            <h1 className="headline-display headline-display-compact mb-3 sm:mb-4">
              From risk screen to <span className="headline-accent">safe</span> handoff.
            </h1>
            <p className="text-[0.9375rem] sm:text-[1rem] leading-[1.55] text-[var(--mut)] mb-4 sm:mb-5 max-w-[32rem]">
              Structured safety documentation, verified referrals, and discharge materials for
              emergency and consult psychiatry. Patient details remain on your device.
            </p>
            <p className="flex flex-wrap items-center gap-3 sm:gap-4">
              {resume ? (
                <>
                  <Link to="/dispo" search={{ fresh: "1" }} className="nav-bar-link">
                    start fresh
                  </Link>
                  <Link to="/directory" className="nav-bar-link">
                    directory
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dispo" className="btn-blue">
                    Open plan
                  </Link>
                  <Link to="/directory" className="nav-bar-link">
                    directory
                  </Link>
                </>
              )}
            </p>
          </header>

          <HeroIllustration className="landing-hero-art w-full max-w-[360px] mx-auto lg:max-w-none lg:ml-auto hidden sm:block" />
        </section>

        {resume && (
          <section className="landing-resume shrink-0 mb-2 sm:mb-3" aria-labelledby="landing-resume-heading">
            <div className="landing-resume-inner">
              <div className="landing-resume-copy min-w-0">
                <p id="landing-resume-heading" className="landing-resume-title">
                  Resume saved plan
                </p>
                <p className="landing-resume-meta">
                  Saved {resume.savedLabel}
                  {resume.detail !== "Disposition plan" && (
                    <>
                      {" "}
                      · <span className="text-[var(--ink)]">{resume.detail}</span>
                    </>
                  )}
                </p>
              </div>
              <div className="landing-resume-actions">
                <Link to="/dispo" search={{ fresh: "1" }} className="landing-resume-btn landing-resume-btn-sec">
                  Start fresh
                </Link>
                <Link to="/dispo" search={{ resume: "1" }} className="landing-resume-btn">
                  Resume
                </Link>
              </div>
            </div>
          </section>
        )}

        <hr className="journal-rule shrink-0" />

        <section className="landing-contents shrink-0 py-3 sm:py-4">
          <p className="kicker mb-3 sm:mb-4">Contents</p>
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
          <p className="mb-1">
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
            <span aria-hidden="true"> · </span>
            <Link to="/accessibility" className="text-link">
              accessibility
            </Link>
          </p>
          Reference only — not a substitute for clinical judgment. Life-threatening emergency: 911.
        </footer>
      </main>
    </div>
  );
}
