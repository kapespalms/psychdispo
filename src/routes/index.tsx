import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingHeader } from "@/components/landing-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PsychDispo · Psychiatric Disposition" },
      {
        name: "description",
        content:
          "Evidence-informed psychiatric disposition — verified community resources, structured safety review, and discharge documentation.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4EFE5] text-[#22202A]">
      <LandingHeader />

      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col lg:flex-row min-h-[560px]">
          <Link
            to="/dispo"
            className="group flex-1 flex flex-col justify-center px-12 md:px-14 py-16 md:py-24 bg-[#F4EFE5] hover:bg-[#efe9dc] transition-colors border-b lg:border-b-0 lg:border-r border-[#E6DECE]"
          >
            <p className="text-[11px] tracking-[0.24em] uppercase font-semibold text-[#BC5B3A] mb-3.5">
              Clinical workflow
            </p>
            <h2 className="font-serif text-[46px] md:text-[52px] font-bold leading-[1.02] tracking-tight mb-3.5">
              Disposition planning
            </h2>
            <p className="text-[15px] leading-relaxed text-[#6f6a5f] max-w-[340px] mb-7">
              From medical clearance to discharge — structured safety review, verified local
              referrals, chart documentation, and a patient handout.
            </p>
            <span className="text-xs tracking-[0.16em] uppercase font-semibold text-[#2A43C0] group-hover:tracking-[0.2em] transition-all">
              Open planner →
            </span>
          </Link>

          <Link
            to="/reference"
            className="group flex-1 flex flex-col justify-center px-12 md:px-14 py-16 md:py-24 bg-[#1b1f3a] text-[#efe9dc] hover:bg-[#151829] transition-colors"
          >
            <p className="text-[11px] tracking-[0.24em] uppercase font-semibold text-[#b9a36e] mb-3.5">
              Reference library
            </p>
            <h2 className="font-serif text-[46px] md:text-[52px] font-bold leading-[1.02] tracking-tight mb-3.5">
              Psychiatry reference
            </h2>
            <p className="text-[15px] leading-relaxed text-[#c8c2b2] max-w-[340px] mb-7">
              Assessment frameworks, level-of-care criteria, and emergency protocols — for
              bedside use and training.
            </p>
            <span className="text-xs tracking-[0.16em] uppercase font-semibold text-[#cdd9ff] group-hover:tracking-[0.2em] transition-all">
              Open reference →
            </span>
          </Link>
        </section>
      </main>

      <footer className="border-t border-[#E6DECE] bg-[#FFFDF8] text-center text-xs text-[#9b9587] py-4">
        Reference only — not a substitute for clinical judgment. In a life-threatening emergency
        call 911.
      </footer>
    </div>
  );
}
