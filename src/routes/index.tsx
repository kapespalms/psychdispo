import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
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

type HeroTool = {
  to: "/dispo" | "/directory" | "/social-care" | "/reference";
  label: string;
  desc: string;
  icon: ReactNode;
  iconClass: string;
};

function IconClipboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.75" />
      <rect x="5" y="5" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 11h6M9 15h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M15.5 20c.3-2.2 1.8-3.5 3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4.5A2.5 2.5 0 0 1 7.5 2H18v18H7.5A2.5 2.5 0 0 0 5 22.5V4.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M5 6.5H18" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 10h6M9 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HERO_TOOLS: HeroTool[] = [
  {
    to: "/dispo",
    label: "Dispo plan",
    desc: "Build a chart-ready disposition and handoff.",
    icon: <IconClipboard />,
    iconClass: "hero-house-cell-icon--blue",
  },
  {
    to: "/directory",
    label: "Resource directory",
    desc: "Find verified programs by location and need.",
    icon: <IconMapPin />,
    iconClass: "hero-house-cell-icon--green",
  },
  {
    to: "/social-care",
    label: "Social care",
    desc: "Capture barriers, supports, and next steps.",
    icon: <IconPeople />,
    iconClass: "hero-house-cell-icon--purple",
  },
  {
    to: "/reference",
    label: "Psych reference",
    desc: "Quick protocols for high-yield ED questions.",
    icon: <IconBook />,
    iconClass: "hero-house-cell-icon--orange",
  },
];

const FEATURES = [
  {
    title: "Save time",
    desc: "Spend less time rebuilding notes.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Improve continuity",
    desc: "Better handoffs. Better outcomes.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <circle cx="17" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M15.5 20c.3-2.2 1.8-3.5 3.5-3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Reduce risk",
    desc: "Built for standards and safety.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3 4 7v5c0 5 3.5 8.5 8 9 3.5-.5 8-4 8-9V7l-8-4Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path d="M9.5 12 11 13.5 15 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Trusted resources",
    desc: "Verified programs. Real-time updates.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M8.5 14.5 7 21l5-2.5L17 21l-1.5-6.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
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

      <main className="landing-main flex flex-col flex-1 min-h-0 px-5 sm:px-10">
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
              <h1 className="landing-headline mb-3">
                A clinical disposition planner for{" "}
                <span className="headline-accent">safer handoffs.</span>
              </h1>
              <p className="landing-subcopy mb-5 max-w-[26rem]">
                Plan disposition, identify barriers, and hand off the next step — without rebuilding
                the same note every visit.
              </p>
              <div className="landing-cta-row">
                <Link to="/dispo" className="btn-landing-primary">
                  Open plan
                  <span aria-hidden="true">→</span>
                </Link>
                <Link to="/directory" className="btn-landing-secondary">
                  View directory
                </Link>
              </div>
            </header>

            <div className="hero-house" aria-label="Clinical tools">
              <div className="hero-house-roof-wrap" aria-hidden="true">
                <div className="hero-house-roof" />
                <span className="hero-house-badge">P</span>
              </div>
              <div className="hero-house-body">
                <div className="hero-house-grid">
                  {HERO_TOOLS.map(({ to, label, desc, icon, iconClass }) => (
                    <Link key={to} to={to} className="hero-house-cell">
                      <span className={`hero-house-cell-icon ${iconClass}`}>{icon}</span>
                      <span className="hero-house-cell-content">
                        <span className="hero-house-cell-label">{label}</span>
                        <span className="hero-house-cell-desc">{desc}</span>
                      </span>
                      <span className="hero-house-cell-chevron">
                        <IconChevron />
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="hero-house-door" aria-hidden="true">
                  <span className="hero-house-door-frame" />
                  <span className="hero-house-door-knob" />
                </div>
                <div className="hero-house-plants" aria-hidden="true">
                  <span className="hero-house-plant hero-house-plant--left" />
                  <span className="hero-house-plant hero-house-plant--right" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-feature-bar shrink-0" aria-label="Benefits">
          {FEATURES.map(({ title, desc, icon }, i) => (
            <div key={title} className="landing-feature-item">
              {i > 0 && <span className="landing-feature-divider" aria-hidden="true" />}
              <span className="landing-feature-icon">{icon}</span>
              <span className="landing-feature-text">
                <strong className="landing-feature-title">{title}</strong>
                <span className="landing-feature-desc">{desc}</span>
              </span>
            </div>
          ))}
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
