import { createFileRoute, Link } from "@tanstack/react-router";
import { EditorialFooterLinks } from "@/components/editorial-footer-links";
import { EditorialPage, EditorialSection } from "@/components/editorial-page";
import { CONTACT_EMAIL, SECURITY_EMAIL } from "@/lib/contact";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/trust")({
  head: () =>
    pageHead({
      path: "/trust",
      title: "Trust & data · PsychDispo",
      description:
        "How PsychDispo handles patient information, guest mode, cloud storage, HIPAA positioning, and security reporting.",
    }),
  component: TrustPage,
});

function TrustPage() {
  return (
    <EditorialPage
      kicker="Trust"
      title="Data & privacy"
      subtitle="Plain-language summary of what stays on your device, what we store when you sign in, and how to reach us."
      footer={
        <>
          <EditorialFooterLinks />
          <span className="block mt-3">
            Full policy:{" "}
            <Link to="/privacy" className="text-link-accent">
              Privacy Policy
            </Link>
            . Reference only — not a substitute for clinical judgment. Life-threatening emergency:{" "}
            <strong className="text-[var(--ink)]">911</strong>.
          </span>
        </>
      }
    >
      <div className="space-y-10">
        <EditorialSection label="On your device" title="Patient information stays local">
          <p>
            Disposition workflow data — including safety screens, clinical notes you enter, patient
            identifiers, and saved plans — is stored in your browser on this device only. We do not
            upload patient PHI to our servers.
          </p>
          <p>
            Clearing browser data or switching devices removes local plans unless you export or
            print them yourself. Guest users can clear local data from{" "}
            <Link to="/settings" className="text-link-accent">
              Settings
            </Link>
            .
          </p>
        </EditorialSection>

        <EditorialSection label="Signed in" title="What Supabase stores">
          <p>
            If you create an account, Supabase stores your clinician profile (email, display name),
            plan templates (scaffold defaults and resource selections — no patient fields), and
            account preferences. Templates never include names, dates of birth, MRNs, or chart
            content.
          </p>
          <p>
            Sign-in today uses Supabase Auth: a one-time link to your work email or Google OAuth.
            We do not store passwords. You can export or delete account data from{" "}
            <Link to="/settings" className="text-link-accent">
              Settings
            </Link>
            .
          </p>
        </EditorialSection>

        <EditorialSection label="HIPAA" title="Honest positioning — not a covered BA by default">
          <p>
            In the current product, patient workflow data stays on your device. PsychDispo does not
            receive, store, or transmit PHI through our cloud stack in normal use. That means the
            core guest and signed-in workflow is <em>not</em> structured as a Business Associate
            relationship with your covered entity.
          </p>
          <p>
            We do not display &ldquo;HIPAA certified&rdquo; badges or imply SOC 2 / HITRUST
            certification we have not earned. Trust is earned through architecture and transparency,
            not stickers.
          </p>
          <p>
            <strong className="text-[var(--ink)] font-medium">Business Associate Agreements:</strong>{" "}
            If a future enterprise phase stores PHI in cloud infrastructure, integrates with
            institutional EHR/SSO, or processes identifiable data on our servers, a BAA would be
            available under an enterprise contract. That is not offered for the current free
            clinician tier.
          </p>
        </EditorialSection>

        <EditorialSection label="Enterprise" title="Single sign-on (Phase 2)">
          <p>
            Hospital and health-system SSO (SAML/OIDC through your identity provider) is planned for
            a later enterprise phase — not available yet. Institutional rollout would include
            security review, data-flow documentation, and BAA terms where PHI touches our systems.
          </p>
          <p>
            Until then, use email sign-in link or Google as above. If your organization needs SSO
            before Phase 2, contact us and we will note your interest.
          </p>
        </EditorialSection>

        <EditorialSection label="Guest mode" title="No account required">
          <p>
            You can use the full disposition workflow without signing in. Guest templates and saved
            plans remain on this device under a guest key. Signing in lets you sync templates across
            browsers that use the same account.
          </p>
        </EditorialSection>

        <EditorialSection label="Clinical use" title="Decision support, not medical advice">
          <p>
            PsychDispo organizes disposition planning, verified community resources, and
            documentation helpers. It does not replace your clinical judgment, local protocols,
            supervision, or emergency evaluation.
          </p>
          <p>
            For life-threatening emergencies, call <strong className="text-[var(--ink)]">911</strong>{" "}
            or your local crisis line.
          </p>
        </EditorialSection>

        <EditorialSection label="Security" title="Responsible disclosure">
          <p>
            If you believe you found a security vulnerability, please report it responsibly. Email{" "}
            <a href={`mailto:${SECURITY_EMAIL}`} className="text-link-accent">
              {SECURITY_EMAIL}
            </a>{" "}
            (clinician-operated mailbox while a dedicated security alias is configured) or use our{" "}
            <a href="/.well-known/security.txt" className="text-link-accent">
              security.txt
            </a>{" "}
            contact.
          </p>
          <p>
            Please include steps to reproduce, affected URLs, and your preferred contact. We aim to
            acknowledge reports within five business days and will not pursue legal action against
            good-faith researchers who avoid privacy violations, data destruction, and service
            disruption.
          </p>
        </EditorialSection>

        <EditorialSection label="Subprocessors" title="Infrastructure partners">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--ink)] font-medium">Supabase</strong> — authentication
              and cloud template storage (US region).
            </li>
            <li>
              <strong className="text-[var(--ink)] font-medium">Vercel</strong> — application
              hosting and content delivery.
            </li>
          </ul>
          <p className="!mt-4">
            These providers process account and template metadata only. Patient workflow data is not
            sent to them.
          </p>
        </EditorialSection>

        <EditorialSection label="Contact" title="Questions or corrections">
          <p>
            Resource updates, product questions, or privacy concerns:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-link-accent">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p>
            <Link to="/privacy" className="text-link-accent">
              Privacy Policy
            </Link>
            {" · "}
            <Link to="/about" className="text-link-accent">
              About PsychDispo
            </Link>
          </p>
        </EditorialSection>
      </div>
    </EditorialPage>
  );
}
