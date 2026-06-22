import { createFileRoute, Link } from "@tanstack/react-router";
import { EditorialFooterLinks } from "@/components/editorial-footer-links";
import { EditorialPage, EditorialSection } from "@/components/editorial-page";
import { CONTACT_EMAIL } from "@/lib/contact";
import { pageHead } from "@/lib/seo";

const EFFECTIVE_DATE = "June 21, 2026";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead({
      path: "/terms",
      title: "Terms of Use · PsychDispo",
      description:
        "Terms of use for PsychDispo — a clinical reference and disposition planning tool for clinicians.",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <EditorialPage
      kicker="Terms"
      title="Terms of Use"
      subtitle={`Effective ${EFFECTIVE_DATE}. By using PsychDispo you agree to these terms.`}
      footer={<EditorialFooterLinks />}
    >
      <div className="space-y-10">
        <EditorialSection title="The service">
          <p>
            PsychDispo provides disposition workflow tools, verified community resource navigation,
            and psychiatry reference material for licensed clinicians and supervised trainees. Access
            may be offered with or without an account.
          </p>
        </EditorialSection>

        <EditorialSection title="Clinical tool — not medical advice">
          <p>
            PsychDispo is decision support and reference material. It does not diagnose, treat, or
            replace your clinical judgment, supervision, institutional protocols, or emergency
            evaluation.
          </p>
          <p>
            For life-threatening emergencies, call <strong className="text-[var(--ink)]">911</strong>{" "}
            or your local crisis line.
          </p>
        </EditorialSection>

        <EditorialSection title="Acceptable use">
          <p>You agree to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use PsychDispo only for lawful professional clinical purposes.</li>
            <li>Keep patient identifiers and PHI in local workflow data under your own policies.</li>
            <li>Not attempt to disrupt, scrape, reverse engineer, or misuse the service.</li>
            <li>Not misrepresent PsychDispo as an official product of your employer unless authorized.</li>
          </ul>
        </EditorialSection>

        <EditorialSection title="Accounts">
          <p>
            You are responsible for activity under your account and for maintaining access to your
            email. Sign-in uses passwordless email links through Supabase — we do not store
            passwords.
          </p>
          <p>
            You may export or delete your account from{" "}
            <Link to="/settings" className="text-link-accent">
              Settings
            </Link>
            . See our{" "}
            <Link to="/privacy" className="text-link-accent">
              Privacy Policy
            </Link>{" "}
            for data handling.
          </p>
        </EditorialSection>

        <EditorialSection title="Intellectual property">
          <p>
            PsychDispo content, design, and software are owned by the project operator unless
            otherwise noted. You receive a limited, non-exclusive license to use the service for
            clinical reference. Resource listings may include third-party program information; verify
            details before relying on them clinically.
          </p>
        </EditorialSection>

        <EditorialSection title="Disclaimer of warranties">
          <p>
            PsychDispo is provided &ldquo;as is.&rdquo; We do not warrant uninterrupted availability,
            complete accuracy of every resource listing, or fitness for a particular clinical
            scenario. You remain responsible for verification and documentation.
          </p>
        </EditorialSection>

        <EditorialSection title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, PsychDispo and its operator are not liable for
            indirect, incidental, or consequential damages arising from use of the service, including
            clinical decisions made with or without the tool. Our total liability for any claim is
            limited to amounts you paid us for the service in the prior twelve months (typically
            zero for the free tier).
          </p>
        </EditorialSection>

        <EditorialSection title="Termination">
          <p>
            You may stop using PsychDispo at any time. We may suspend or end access for misuse or
            operational reasons. Sections on clinical limitations, disclaimers, and liability survive
            termination.
          </p>
        </EditorialSection>

        <EditorialSection title="Changes">
          <p>
            We may update these terms. Continued use after the posted effective date constitutes
            acceptance of the revised terms.
          </p>
        </EditorialSection>

        <EditorialSection title="Contact">
          <p>
            Questions:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-link-accent">
              {CONTACT_EMAIL}
            </a>
          </p>
        </EditorialSection>
      </div>
    </EditorialPage>
  );
}
