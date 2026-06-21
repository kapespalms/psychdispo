import { createFileRoute, Link } from "@tanstack/react-router";
import { EditorialFooterLinks } from "@/components/editorial-footer-links";
import { EditorialPage, EditorialSection } from "@/components/editorial-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/trust")({
  head: () =>
    pageHead({
      path: "/trust",
      title: "Trust & data · PsychDispo",
      description:
        "How PsychDispo handles patient information, guest mode, cloud storage, and clinical use.",
    }),
  component: TrustPage,
});

const CONTACT_EMAIL = "KristenPalmerMD@gmail.com";

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
            Reference only — not a substitute for clinical judgment. Life-threatening emergency:{" "}
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
            print them yourself.
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
            We do not store passwords.
          </p>
        </EditorialSection>

        <EditorialSection label="Enterprise" title="Single sign-on (Phase 2)">
          <p>
            Hospital and health-system SSO (SAML/OIDC through your identity provider) is planned for
            a later enterprise phase — not available yet.
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
            <Link to="/about" className="text-link-accent">
              About PsychDispo
            </Link>
          </p>
        </EditorialSection>
      </div>
    </EditorialPage>
  );
}
