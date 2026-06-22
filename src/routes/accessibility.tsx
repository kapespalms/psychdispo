import { createFileRoute, Link } from "@tanstack/react-router";
import { EditorialFooterLinks } from "@/components/editorial-footer-links";
import { EditorialPage, EditorialSection } from "@/components/editorial-page";
import { CONTACT_EMAIL } from "@/lib/contact";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/accessibility")({
  head: () =>
    pageHead({
      path: "/accessibility",
      title: "Accessibility · PsychDispo",
      description:
        "PsychDispo accessibility statement — WCAG 2.1 AA aspiration, known gaps, and how to report issues.",
    }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return (
    <EditorialPage
      kicker="Accessibility"
      title="Accessibility statement"
      subtitle="We aim for WCAG 2.1 Level AA across PsychDispo shell pages and are improving embedded clinical tools."
      footer={<EditorialFooterLinks />}
    >
      <div className="space-y-10">
        <EditorialSection title="Our goal">
          <p>
            PsychDispo should be usable by clinicians with diverse needs — including keyboard-only
            navigation, screen reader support, and sufficient color contrast on editorial pages.
          </p>
        </EditorialSection>

        <EditorialSection title="What we are working toward">
          <ul className="list-disc pl-5 space-y-2">
            <li>WCAG 2.1 Level AA for site navigation, auth flows, and editorial content.</li>
            <li>Visible focus states and semantic headings on shell pages.</li>
            <li>Text alternatives for meaningful images where we control the markup.</li>
            <li>Respect for reduced-motion preferences where supported.</li>
          </ul>
        </EditorialSection>

        <EditorialSection title="Known gaps">
          <p>Some areas still need improvement:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--ink)] font-medium">Embedded workflow iframes</strong>{" "}
              — disposition and reference tools load legacy HTML inside iframes. Phase 1 added
              keyboard Space/Enter on option buttons, step focus management, and inline print-gate
              errors; full screen-reader parity and PDF accessibility remain in progress.
            </li>
            <li>
              <strong className="text-[var(--ink)] font-medium">Third-party maps and links</strong>{" "}
              — external program websites vary in accessibility.
            </li>
            <li>
              <strong className="text-[var(--ink)] font-medium">PDF / print outputs</strong> —
              generated packets may not inherit all digital accessibility features.
            </li>
          </ul>
        </EditorialSection>

        <EditorialSection title="Compatibility">
          <p>
            PsychDispo is tested on current versions of Chrome, Safari, Firefox, and Edge on desktop
            and mobile. Older browsers may not support all features.
          </p>
        </EditorialSection>

        <EditorialSection title="Feedback">
          <p>
            If you encounter a barrier — especially in sign-in, navigation, or editorial pages —
            please tell us what you were trying to do, the page URL, your browser, and any assistive
            technology in use.
          </p>
          <p>
            Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-link-accent">
              {CONTACT_EMAIL}
            </a>{" "}
            with subject line &ldquo;Accessibility.&rdquo; We aim to respond within ten business days.
          </p>
        </EditorialSection>

        <EditorialSection title="Related">
          <p>
            <Link to="/trust" className="text-link-accent">
              Trust & data
            </Link>
          </p>
        </EditorialSection>
      </div>
    </EditorialPage>
  );
}
