import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingHeader } from "@/components/landing-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PsychDispo · Psychiatric Disposition" },
      {
        name: "description",
        content:
          "From safety screen to patient packet — evidence-informed psychiatric disposition, verified community resources, and high-yield psychiatry reference.",
      },
    ],
  }),
  component: Index,
});

const DISPO_FEATURES = [
  "C-SSRS safety gate & means restriction",
  "ZIP-matched referrals · 1,400+ resources",
  "Printable clinician + patient packet",
];

const REF_FEATURES = [
  "9 chapters · psychopharm & algorithms",
  "Emergencies, CL psych, Step 3 review",
  "Full-text search · 140+ topics",
];

function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <LandingHeader />

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="border-b border-border bg-white">
          <div className="max-w-[1440px] mx-auto px-6 md:px-14 pt-14 md:pt-20 pb-12 md:pb-16">
            <p className="font-mono text-[10px] md:text-[11px] tracking-[0.32em] text-muted-foreground uppercase">
              Psychiatric disposition · discharge · reference
            </p>
            <h1 className="mt-4 font-serif text-[52px] sm:text-[64px] md:text-[80px] leading-[0.92] tracking-tight max-w-4xl">
              From risk to resources —{" "}
              <span className="italic text-[#2640C8]">in one workflow.</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              The disposition standard for psychiatry at the point of care. Verified resources in
              all 50 states · deepest coverage in Ohio, Washington, and NY/NJ metros.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 md:gap-8 font-mono text-[10px] md:text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              <span>Safety gate → LOC → referrals → packet</span>
              <span className="hidden md:inline text-border">|</span>
              <span>Under 10 minutes</span>
              <span className="hidden md:inline text-border">|</span>
              <span>Free for clinicians</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dispo"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#2640C8] text-white text-sm font-semibold tracking-wide hover:bg-[#1b2f9c] transition-colors"
              >
                Start planning
              </Link>
              <Link
                to="/reference"
                className="inline-flex items-center justify-center px-6 py-3 border border-border bg-white text-sm font-medium hover:bg-surface-2 transition-colors"
              >
                Open Psych Ref
              </Link>
            </div>
          </div>
        </section>

        {/* Split panels */}
        <section className="flex-1 border-b border-border">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 lg:min-h-[720px]">
            <RepoPanel
              to="/dispo"
              title="Psych"
              titleAccent="Dispo"
              cta="Start planning"
              tagline="Guided disposition workflow"
              description="Medically-cleared gate → safety screening → lethal means → local referrals → follow-up coordination → printable discharge packet."
              features={DISPO_FEATURES}
              theme="light"
            />
            <RepoPanel
              to="/reference"
              title="Psych"
              titleAccent="Ref"
              cta="Open reference"
              tagline="High-yield psychiatry reference"
              description="Assessment, algorithms, psychopharmacology, emergencies, disorders, substance use, consult-liaison, and Step 3 review."
              features={REF_FEATURES}
              theme="blue"
            />
          </div>
        </section>

        {/* Trust strip */}
        <section className="bg-white border-b border-border">
          <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-10 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <StatBlock
              value="1,400+"
              label="Verified community resources"
              detail="Crisis, psychiatry, therapy, SUD, social needs — matched by ZIP and population flags."
            />
            <StatBlock
              value="50"
              label="States with metro routing"
              detail="Deepest local data in Ohio, Washington (PeaceHealth), NY/NJ, WV, PA, MI, NV."
            />
            <StatBlock
              value="2"
              label="Clinical repositories"
              detail="Disposition workflow + comprehensive reference — one brand, bedside-ready."
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          <span>Reference only — not a substitute for clinical judgment</span>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <a
              href="mailto:KristenPalmerMD@gmail.com"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatBlock({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <div>
      <div className="font-serif text-4xl md:text-5xl font-semibold text-[#2640C8]">{value}</div>
      <div className="mt-2 font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
        {label}
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">{detail}</p>
    </div>
  );
}

function RepoPanel({
  to,
  title,
  titleAccent,
  cta,
  tagline,
  description,
  features,
  theme,
}: {
  to: string;
  title: string;
  titleAccent: string;
  cta: string;
  tagline: string;
  description: string;
  features: string[];
  theme: "light" | "blue";
}) {
  const isBlue = theme === "blue";

  return (
    <Link
      to={to}
      className={`group relative flex flex-col px-8 md:px-14 py-16 md:py-24 min-h-[520px] lg:min-h-0 transition-all duration-300 ${
        isBlue
          ? "bg-[#1b2f9c] text-white lg:border-l lg:border-white/10 hover:bg-[#162678]"
          : "bg-background hover:bg-surface-2 lg:border-r lg:border-border"
      }`}
    >
      <p
        className={`font-mono text-[10px] tracking-[0.28em] uppercase ${
          isBlue ? "text-white/50" : "text-muted-foreground"
        }`}
      >
        {tagline}
      </p>

      <h2 className="mt-4 font-serif text-[56px] md:text-[72px] lg:text-[80px] leading-[0.92] tracking-tight">
        {title}
        <br />
        <span
          className={`italic transition-colors duration-300 ${
            isBlue ? "text-white/65 group-hover:text-white/90" : "text-[#2640C8]"
          }`}
        >
          {titleAccent}
        </span>
      </h2>

      <div className="mt-8 flex items-center gap-3">
        <span
          className={`font-mono text-[12px] md:text-[13px] tracking-[0.28em] transition-all duration-300 group-hover:tracking-[0.36em] ${
            isBlue ? "text-white" : "text-foreground"
          }`}
        >
          {cta}
        </span>
        <span
          className={`h-px w-10 group-hover:w-20 transition-all duration-300 ${
            isBlue ? "bg-white/60 group-hover:bg-white" : "bg-foreground/70"
          }`}
        />
        <span className={`font-mono text-sm ${isBlue ? "text-white/80" : ""}`}>→</span>
      </div>

      <p
        className={`mt-8 max-w-md text-[15px] leading-relaxed ${
          isBlue ? "text-white/75" : "text-muted-foreground"
        }`}
      >
        {description}
      </p>

      <ul className={`mt-10 space-y-3 max-w-md ${isBlue ? "text-white/85" : ""}`}>
        {features.map((f) => (
          <li
            key={f}
            className={`flex items-start gap-3 text-[13px] leading-snug border-t pt-3 ${
              isBlue ? "border-white/15" : "border-border"
            }`}
          >
            <span className={`mt-0.5 ${isBlue ? "text-white/50" : "text-[#2640C8]"}`}>—</span>
            {f}
          </li>
        ))}
      </ul>
    </Link>
  );
}
