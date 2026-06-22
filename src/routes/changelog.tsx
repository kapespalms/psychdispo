import { createFileRoute, Link } from "@tanstack/react-router";
import { EditorialFooterLinks } from "@/components/editorial-footer-links";
import { EditorialPage, EditorialSection } from "@/components/editorial-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/changelog")({
  head: () =>
    pageHead({
      path: "/changelog",
      title: "Resource changelog · PsychDispo",
      description:
        "Public release notes for PsychDispo resource directory updates and verification dates.",
    }),
  component: ChangelogPage,
});

const ENTRIES = [
  {
    date: "2026-06",
    title: "Phase 1 — clinician beta foundations",
    items: [
      "Guided C-SSRS screener in disposition safety step with automatic risk stratification.",
      "Directory cards show verified date where available; coverage density notes by metro/state.",
      "PWA shell caching for guest workflow and national crisis lines when offline.",
    ],
  },
  {
    date: "2026-06",
    title: "Directory label & population pass",
    items: [
      "Centralized MECE directory labels and unified filter vocabulary (commit 31d0ec7).",
      "Population tabs hide when not applicable to selected life stage.",
    ],
  },
  {
    date: "2026-06",
    title: "Safety documentation UX",
    items: [
      "Evidence-based safety framing and structured chart-note sections for suicide, violence, and substances.",
      "Collaboration attestation for moderate/high C-SSRS before plan and deliver steps.",
    ],
  },
  {
    date: "2026-06",
    title: "Multi-state catalog expansion",
    items: [
      "Scaffold metro entries for Pennsylvania, Michigan, Nevada, and additional states (see directory coverage notes).",
      "Deep verified local lists maintained for Ohio, Washington, and New York / New Jersey metros.",
    ],
  },
];

function ChangelogPage() {
  return (
    <EditorialPage
      kicker="Changelog"
      title="Resource & product updates"
      subtitle="Honest release notes for directory verification and clinical workflow changes. No fabricated SLAs — dates reflect last known verification or ship date."
      footer={
        <>
          <EditorialFooterLinks />
          <span className="block mt-3 text-[0.875rem] text-[var(--mut)]">
            Spot an outdated program?{" "}
            <a href="mailto:KristenPalmerMD@gmail.com?subject=PsychDispo%20outdated%20resource" className="text-link-accent">
              Report an entry
            </a>
            . See also{" "}
            <Link to="/trust" className="text-link-accent">
              Trust & data
            </Link>
            .
          </span>
        </>
      }
    >
      <div className="space-y-10">
        <EditorialSection title="How to read this">
          <p>
            <strong className="text-[var(--ink)] font-medium">Verified</strong> dates on directory
            entries come from individual program checks.{" "}
            <strong className="text-[var(--ink)] font-medium">Scaffold</strong> metros use curated
            statewide catalog rows that still require local confirmation. National crisis lines
            (988, 211, SAMHSA) are longstanding public services.
          </p>
        </EditorialSection>

        {ENTRIES.map((entry) => (
          <EditorialSection key={entry.title} title={`${entry.date} · ${entry.title}`}>
            <ul className="list-disc pl-5 space-y-2">
              {entry.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </EditorialSection>
        ))}

        <EditorialSection title="Template for future entries">
          <p className="text-[0.9375rem] text-[var(--mut)] italic">
            YYYY-MM — Short title. Bullet: what changed, which metros/states, verification method
            (phone, website, partner feed). Omit if nothing material shipped.
          </p>
        </EditorialSection>
      </div>
    </EditorialPage>
  );
}
