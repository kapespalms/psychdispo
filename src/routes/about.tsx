import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · PsychDispo" },
      {
        name: "description",
        content: "About PsychDispo — psychiatric disposition and resource navigation.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero */}
      <div className="bg-white px-8 md:px-14 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </Link>

          <h1 className="mt-6 font-serif text-[48px] md:text-[72px] leading-[0.95] tracking-tight">
            Psych<span className="italic text-blue-800">Dispo</span>
          </h1>

          <p className="mt-3 font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
            Psychiatric disposition &amp; discharge · 5 Ohio metros
          </p>

          <p className="mt-4 font-serif text-[14px] italic text-foreground">
            Created by Kristen Palmer, MD
          </p>

          <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground max-w-xl">
            Resources are individually verified (✓) or curated national/statewide lines. For medically-cleared patients. Not a substitute for clinical judgment.
          </p>
        </div>
      </div>

      {/* Content sections */}
      <main className="flex-1 px-8 md:px-14 py-10 md:py-14">
        <div className="max-w-3xl mx-auto space-y-10">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            PsychDispo was built for the moments when psychiatric disposition is clinically important, time-sensitive, and logistically messy. The tool organizes the pieces clinicians often need in one place: risk assessment, disposition planning, documentation support, crisis resources, outpatient options, and social supports. PsychDispo is designed for emergency psychiatry, consultation-liaison psychiatry, residents, social workers, APPs, and emergency clinicians who need a clearer way to move from assessment to plan.
          </p>

          <div>
            <p className="font-serif text-[18px] md:text-[20px] leading-snug tracking-tight">
              The goal is simple:
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              Help clinicians make thoughtful, well-documented, resource-aware disposition plans without having to hunt through scattered information every time.
            </p>
          </div>

          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            PsychDispo includes two core areas
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-border border-t border-border border-b">
            {/* Left — white card */}
            <div className="px-8 md:px-14 py-12 md:py-16 flex flex-col">
              <h3 className="font-serif text-[48px] md:text-[64px] leading-[0.95] tracking-tight">
                Psych
                <br />
                <span className="italic text-muted-foreground/80">
                  Dispo
                </span>
              </h3>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                Structured support for psychiatric disposition, including risk assessment, discharge planning, crisis pathways, outpatient follow-up, IOP/PHP, social resources, Medicaid information, 988, 211, food access, and Cleveland/Columbus resource navigation.
              </p>
            </div>

            {/* Right — blue card */}
            <div className="px-8 md:px-14 py-12 md:py-16 flex flex-col bg-blue-800 text-white">
              <h3 className="font-serif text-[48px] md:text-[64px] leading-[0.95] tracking-tight">
                Psych
                <br />
                <span className="italic text-white/70">
                  Ref
                </span>
              </h3>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/70">
                A high-yield psychiatry reference for quick clinical review, including psychopharmacology, treatment algorithms, diagnostic features, assessment tools, emergency psychiatry, and consultation-liaison psychiatry.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              PsychDispo is a clinical support and resource navigation tool. It does not replace clinical judgment, emergency evaluation, supervision, local policy, or institutional protocols.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-8 py-5 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
          <span>Reference only — not a substitute for clinical judgment</span>
          <span>Last Updated: June 2026</span>
        </div>
      </footer>
    </div>
  );
}
