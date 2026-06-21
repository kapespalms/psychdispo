import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingHeader } from "@/components/landing-header";
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
    desc: "Safety screen, resource match, chart note, patient packet. Inpatient, ED, or outpatient.",
  },
  {
    num: "02",
    to: "/directory" as const,
    title: "Resource directory",
    desc: "Verified psychiatric and community programs — all fifty states, searchable by metro.",
  },
  {
    num: "03",
    to: "/social-care" as const,
    title: "Social care plan",
    desc: "Health-related social needs — tonight versus ongoing, handoff to community programs.",
  },
  {
    num: "04",
    to: "/reference" as const,
    title: "Psychiatric reference",
    desc: "High-yield protocols for emergency and consult settings. Suicide, agitation, psychosis.",
  },
] as const;

function Index() {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      <LandingHeader />

      <main className="flex-1">
        <article className="max-w-[var(--page)] mx-auto px-6 sm:px-10 py-16 sm:py-24">
          <header className="max-w-[var(--measure)] mb-16 sm:mb-20">
            <p className="kicker mb-6">Psychiatric disposition</p>
            <h1 className="font-serif text-[2.75rem] sm:text-[3.5rem] leading-[1.05] tracking-tight mb-8">
              From risk screen to safe handoff.
            </h1>
            <p className="text-[1.0625rem] leading-[1.65] text-[var(--mut)] mb-10 max-w-[34rem]">
              Structured safety documentation, verified referrals, and discharge materials for
              emergency and consult psychiatry. Patient details remain on your device.
            </p>
            <p>
              <Link to="/dispo" className="btn-solid">
                Open plan
              </Link>
              <span className="mx-4 text-[var(--line)]">|</span>
              <Link to="/directory" className="text-link text-[0.9375rem]">
                Directory
              </Link>
            </p>
          </header>

          <hr className="journal-rule mb-12" />

          <section>
            <p className="kicker mb-8">Contents</p>
            <div>
              {CONTENTS.map(({ num, to, title, desc }) => (
                <Link key={to} to={to} className="toc-row block">
                  <span className="toc-num">{num}</span>
                  <span className="toc-title">{title}</span>
                  <span className="toc-desc sm:col-start-3">{desc}</span>
                </Link>
              ))}
            </div>
          </section>

          <hr className="journal-rule-light mt-16 mb-8" />

          <footer className="max-w-[var(--measure)] text-[0.8125rem] leading-relaxed text-[var(--mut)]">
            <p>
              Reference only — not a substitute for clinical judgment. Consult psychiatry when
              available. Life-threatening emergency: 911.
            </p>
          </footer>
        </article>
      </main>
    </div>
  );
}
