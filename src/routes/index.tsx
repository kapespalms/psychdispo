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

function Index() {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--shell-bg)] text-[var(--ink)]">
      <LandingHeader />

      <main className="flex-1">
        <section className="max-w-[1040px] mx-auto px-5 sm:px-7 py-10 sm:py-14">
          <div className="mb-10 max-w-xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-[var(--mut)] mb-3">
              Clinical decision support
            </p>
            <h1 className="font-serif text-4xl sm:text-[2.75rem] font-semibold leading-tight tracking-tight mb-4">
              Psychiatric disposition, documented
            </h1>
            <p className="text-base leading-relaxed text-[var(--mut)]">
              Structured safety review, verified referrals, and discharge packets — built for
              emergency and consult psychiatry teams.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Link
              to="/dispo"
              className="clinical-card group p-7 sm:p-8 hover:border-[var(--t)] transition-colors"
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-[var(--mut)] mb-2">
                Disposition
              </p>
              <h2 className="font-serif text-2xl font-semibold mb-3 group-hover:text-[var(--t)] transition-colors">
                Plan workflow
              </h2>
              <p className="text-sm leading-relaxed text-[var(--mut)] mb-6">
                Medical clearance through deliver — safety domains, resource matching, chart note,
                and patient packet.
              </p>
              <span className="text-sm font-semibold text-[var(--t)]">Open planner →</span>
            </Link>

            <Link
              to="/directory"
              className="clinical-card group p-7 sm:p-8 hover:border-[var(--t)] transition-colors"
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-[var(--mut)] mb-2">
                Directory
              </p>
              <h2 className="font-serif text-2xl font-semibold mb-3 group-hover:text-[var(--t)] transition-colors">
                Verified resources
              </h2>
              <p className="text-sm leading-relaxed text-[var(--mut)] mb-6">
                Search psychiatric and community programs by metro, category, or keyword — all 50
                states.
              </p>
              <span className="text-sm font-semibold text-[var(--t)]">Browse directory →</span>
            </Link>

            <Link
              to="/social-care"
              className="clinical-card group p-7 sm:p-8 hover:border-[var(--t)] transition-colors"
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-[var(--mut)] mb-2">
                Social Care
              </p>
              <h2 className="font-serif text-2xl font-semibold mb-3 group-hover:text-[var(--t)] transition-colors">
                HRSN screener
              </h2>
              <p className="text-sm leading-relaxed text-[var(--mut)] mb-6">
                Tonight vs ongoing triage, resource matching, and printable handoff sheets.
              </p>
              <span className="text-sm font-semibold text-[var(--t)]">Open screener →</span>
            </Link>

            <Link
              to="/emerg"
              className="clinical-card group p-7 sm:p-8 hover:border-[var(--t)] transition-colors"
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-[var(--mut)] mb-2">
                Emergency
              </p>
              <h2 className="font-serif text-2xl font-semibold mb-3 group-hover:text-[var(--t)] transition-colors">
                Psych emerg review
              </h2>
              <p className="text-sm leading-relaxed text-[var(--mut)] mb-6">
                Suicide, agitation, psychosis, delirium — evidence-based protocols for acute
                settings.
              </p>
              <span className="text-sm font-semibold text-[var(--t)]">Open reference →</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] bg-white text-center text-xs text-[var(--mut)] py-4 px-5">
        Reference only — not a substitute for clinical judgment. In a life-threatening emergency
        call 911.
      </footer>
    </div>
  );
}
