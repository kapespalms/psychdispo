import { createFileRoute, Link } from "@tanstack/react-router";
import { EditorialFooterLinks } from "@/components/editorial-footer-links";
import { EditorialPage, EditorialSection } from "@/components/editorial-page";
import { CONTACT_EMAIL } from "@/lib/contact";
import { pageHead } from "@/lib/seo";

const EFFECTIVE_DATE = "June 21, 2026";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      path: "/privacy",
      title: "Privacy Policy · PsychDispo",
      description:
        "How PsychDispo collects, uses, and retains account data and local patient workflow information.",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <EditorialPage
      kicker="Privacy"
      title="Privacy Policy"
      subtitle={`Effective ${EFFECTIVE_DATE}. Plain language about what we collect, what stays on your device, and your choices.`}
      footer={
        <>
          <EditorialFooterLinks />
          <span className="block mt-3">
            Summary version:{" "}
            <Link to="/trust" className="text-link-accent">
              Trust & data
            </Link>
          </span>
        </>
      }
    >
      <div className="space-y-10">
        <EditorialSection title="Scope">
          <p>
            PsychDispo is a clinical reference and disposition workflow tool for licensed clinicians
            and trainees. This policy describes PsychDispo operated at psychdispo.com.
          </p>
        </EditorialSection>

        <EditorialSection label="Categories" title="What data we handle">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--ink)] font-medium">Local PHI / workflow data</strong> —
              safety screens, notes, identifiers, and disposition plans you enter in the browser.
              Stored on your device only; not uploaded to our servers.
            </li>
            <li>
              <strong className="text-[var(--ink)] font-medium">Account data</strong> — email,
              display name, sign-in timestamps, and authentication tokens managed by Supabase when
              you create an account.
            </li>
            <li>
              <strong className="text-[var(--ink)] font-medium">Cloud library data</strong> — plan
              templates (scaffold defaults and resource selections) and favorited resource keys.
              No patient names, MRNs, dates of birth, or chart content.
            </li>
            <li>
              <strong className="text-[var(--ink)] font-medium">Device defaults</strong> — optional
              pre-fill preferences (setting, insurance, home location) stored in your browser.
            </li>
            <li>
              <strong className="text-[var(--ink)] font-medium">Technical logs</strong> — hosting
              and error logs from Vercel (URLs, timestamps, browser type). We do not intentionally
              log patient workflow content.
            </li>
          </ul>
        </EditorialSection>

        <EditorialSection title="How we use data">
          <p>
            Account and template data let you sign in and sync your library across browsers. We do
            not sell personal information. We do not use patient workflow data for advertising —
            that data never leaves your device in normal operation.
          </p>
        </EditorialSection>

        <EditorialSection title="Retention">
          <p>
            Cloud templates and favorites persist while your account is active. Local workflow data
            persists until you clear browser storage or uninstall the browser profile.
          </p>
          <p>
            You may export account data or delete your account from{" "}
            <Link to="/settings" className="text-link-accent">
              Settings
            </Link>
            . Account deletion removes your Supabase auth record and associated cloud rows.
          </p>
        </EditorialSection>

        <EditorialSection title="Subprocessors">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--ink)] font-medium">Supabase</strong> — authentication
              and database (US region).
            </li>
            <li>
              <strong className="text-[var(--ink)] font-medium">Vercel</strong> — application
              hosting and delivery.
            </li>
          </ul>
          <p className="!mt-4">
            These providers process account and template metadata only under our instructions.
          </p>
        </EditorialSection>

        <EditorialSection title="US state privacy rights">
          <p>
            Depending on your state, you may have rights to access, correct, delete, or obtain a copy
            of personal information we hold. Because patient workflow data stays on your device, we
            cannot retrieve it for you — export or print before clearing browser data.
          </p>
          <p>
            To exercise rights related to account data, use Settings or email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-link-accent">
              {CONTACT_EMAIL}
            </a>
            . We will verify requests from the account email where possible.
          </p>
        </EditorialSection>

        <EditorialSection title="Children">
          <p>PsychDispo is for professional clinical use and is not directed to children under 13.</p>
        </EditorialSection>

        <EditorialSection title="Changes">
          <p>
            We will post updates on this page with a revised effective date. Material changes to
            how account data is handled will be noted here and on{" "}
            <Link to="/trust" className="text-link-accent">
              Trust & data
            </Link>
            .
          </p>
        </EditorialSection>

        <EditorialSection title="Contact">
          <p>
            Privacy questions:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-link-accent">
              {CONTACT_EMAIL}
            </a>
          </p>
        </EditorialSection>
      </div>
    </EditorialPage>
  );
}
