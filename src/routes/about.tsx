import { createFileRoute, Link } from "@tanstack/react-router";
import { EditorialFooterLinks } from "@/components/editorial-footer-links";
import { EditorialPage, EditorialSection } from "@/components/editorial-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      path: "/about",
      title: "About · PsychDispo",
      description: "About PsychDispo — psychiatric disposition and resource navigation.",
    }),
  component: About,
});

function About() {
  return (
    <EditorialPage
      kicker="About"
      title="PsychDispo"
      subtitle="Psychiatric disposition and discharge planning with verified community resources in all 50 states. Created by Kristen Palmer, MD."
      footer={
        <>
          <EditorialFooterLinks />
          <span className="block mt-3">
            Resources are individually verified (✓) or curated national/statewide lines. For
            medically cleared patients.{" "}
            <Link to="/trust" className="text-link-accent">
              Trust & data
            </Link>
          </span>
        </>
      }
    >
      <div className="space-y-10">
        <EditorialSection title="Built for real disposition moments">
          <p>
            PsychDispo was built for the moments when psychiatric disposition is clinically
            important, time-sensitive, and logistically messy. The tool organizes the pieces
            clinicians often need in one place: risk assessment, disposition planning, documentation
            support, crisis resources, outpatient options, and social supports.
          </p>
          <p>
            Designed for emergency psychiatry, consultation-liaison psychiatry, residents, social
            workers, APPs, and emergency clinicians who need a clearer way to move from assessment
            to plan.
          </p>
        </EditorialSection>

        <EditorialSection title="The goal">
          <p>
            Help clinicians make thoughtful, well-documented, resource-aware disposition plans
            without having to hunt through scattered information every time.
          </p>
        </EditorialSection>

        <hr className="journal-rule-light" />

        <p className="kicker">Two core areas</p>

        <div className="space-y-8">
          <div className="editorial-list-row">
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-[1.375rem] font-medium tracking-tight mb-2">
                Psych<span className="italic text-[var(--t)]">Dispo</span>
              </h3>
              <p className="text-[0.9375rem] leading-relaxed text-[var(--mut)]">
                Guided disposition workflow: safety gate, level of care, ZIP-matched referrals
                (1,400+ resources), follow-up coordination, and a printable discharge packet.
                Deepest local coverage in Ohio, Washington, NY/NJ, and expanding metros nationwide.
              </p>
            </div>
            <Link to="/dispo" className="nav-bar-link shrink-0">
              open plan
            </Link>
          </div>

          <div className="editorial-list-row">
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-[1.375rem] font-medium tracking-tight mb-2">
                Psych<span className="italic text-[var(--t)]">Ref</span>
              </h3>
              <p className="text-[0.9375rem] leading-relaxed text-[var(--mut)]">
                A high-yield psychiatry reference for quick clinical review, including
                psychopharmacology, treatment algorithms, diagnostic features, assessment tools,
                emergency psychiatry, and consultation-liaison psychiatry.
              </p>
            </div>
            <Link to="/reference" className="nav-bar-link shrink-0">
              open reference
            </Link>
          </div>
        </div>

        <EditorialSection title="Clinical support, not a substitute">
          <p>
            PsychDispo is a clinical support and resource navigation tool. It does not replace
            clinical judgment, emergency evaluation, supervision, local policy, or institutional
            protocols.
          </p>
        </EditorialSection>
      </div>
    </EditorialPage>
  );
}
