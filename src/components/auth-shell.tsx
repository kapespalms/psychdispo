import type { ReactNode } from "react";
import { EditorialFooterLinks } from "@/components/editorial-footer-links";

const FEATURES = [
  {
    title: "Secure by default",
    desc: "We never store patient information.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M8 11V8a4 4 0 0 1 8 0v3"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Sync your settings",
    desc: "Templates and preferences follow you.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M17 3a5 5 0 0 1 4 4.9V9h-3.5a2.5 2.5 0 0 0-2.45-2H17V3Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M7 21a5 5 0 0 1-4-4.9V15h3.5a2.5 2.5 0 0 0 2.45 2H7v4Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M7 3v4h3.5A2.5 2.5 0 0 1 12.95 9H7V3Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M17 21v-4h-3.5a2.5 2.5 0 0 1-2.45-2H17v6Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Your account",
    desc: "Only your account, templates, and preferences.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3 4 7v6c0 4.2 3.2 7.4 8 9 4.8-1.6 8-4.8 8-9V7l-8-4Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="m9.5 12 1.75 1.75L15 10"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

function AuthMark() {
  return (
    <div className="auth-mark" aria-hidden="true">
      <span className="auth-mark-letter">P</span>
      <span className="auth-mark-bar" />
    </div>
  );
}

function AuthIllustration() {
  return (
    <div className="auth-illustration" aria-hidden="true">
      <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax meet" className="auth-illustration-svg">
        <ellipse cx="80" cy="28" rx="22" ry="10" fill="#fff" opacity="0.85" />
        <ellipse cx="300" cy="22" rx="18" ry="8" fill="#fff" opacity="0.7" />
        <ellipse cx="340" cy="32" rx="14" ry="6" fill="#fff" opacity="0.55" />
        <path
          d="M0 95 Q60 72 120 88 T240 82 T360 90 T400 85 L400 120 L0 120 Z"
          fill="color-mix(in srgb, var(--t) 22%, #fff)"
        />
        <path
          d="M0 108 Q100 92 200 102 T400 98 L400 120 L0 120 Z"
          fill="color-mix(in srgb, var(--t) 38%, #fff)"
        />
        <rect x="168" y="52" width="64" height="48" rx="3" fill="#fff" />
        <rect x="176" y="60" width="12" height="12" rx="1" fill="color-mix(in srgb, var(--t) 15%, #fff)" />
        <rect x="192" y="60" width="12" height="12" rx="1" fill="color-mix(in srgb, var(--t) 15%, #fff)" />
        <rect x="208" y="60" width="12" height="12" rx="1" fill="color-mix(in srgb, var(--t) 15%, #fff)" />
        <rect x="188" y="78" width="24" height="22" rx="1" fill="color-mix(in srgb, var(--t) 12%, #fff)" />
        <rect x="196" y="34" width="8" height="18" fill="#fff" />
        <rect x="192" y="30" width="16" height="6" rx="1" fill="#fff" />
        <path
          d="M200 24v-6M197 21h6"
          stroke="color-mix(in srgb, var(--t) 55%, #fff)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function AuthEmailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="auth-input-icon"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="m4 8 8 6 8-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function AuthSendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m4 12 16-7-4 7 4 7-16-7Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M8 12h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function AuthShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 4 7v6c0 4.2 3.2 7.4 8 9 4.8-1.6 8-4.8 8-9V7l-8-4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AuthShell({
  kicker = "Account",
  title,
  subtitle,
  welcomeTitle = "Welcome back",
  welcomeSubtitle = "Sync plan templates and settings across devices. Patient work stays on your device.",
  children,
  belowForm,
  showFooterLinks = true,
}: {
  kicker?: string;
  title: string;
  subtitle: string;
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  children: ReactNode;
  belowForm?: ReactNode;
  showFooterLinks?: boolean;
}) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <aside className="auth-sidebar">
          <div className="auth-sidebar-body">
            <AuthMark />
            <h2 className="auth-welcome-title">{welcomeTitle}</h2>
            <p className="auth-welcome-subtitle">{welcomeSubtitle}</p>
            <ul className="auth-features">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="auth-feature">
                  <span className="auth-feature-icon">{feature.icon}</span>
                  <span className="auth-feature-text">
                    <strong>{feature.title}</strong>
                    {" — "}
                    {feature.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <AuthIllustration />
        </aside>

        <div className="auth-form-column">
          <p className="auth-kicker">{kicker}</p>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          <div className="auth-form-body">{children}</div>
          {belowForm ? <div className="auth-below-form">{belowForm}</div> : null}
          {showFooterLinks ? (
            <footer className="auth-footer-links">
              <EditorialFooterLinks />
            </footer>
          ) : null}
        </div>
      </div>
    </div>
  );
}
