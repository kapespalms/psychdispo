import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PsychDispoLogo } from "@/components/psychdispo-logo";

export function AuthShell({
  kicker = "Account",
  title,
  subtitle,
  children,
  footer,
}: {
  kicker?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden text-[var(--ink)]">
      <header className="shell-header shrink-0">
        <div className="site-logo-top">
          <Link to="/" className="no-underline" aria-label="PsychDispo home">
            <PsychDispoLogo />
          </Link>
        </div>
        <div className="shell-header-inner">
          <span />
          <Link to="/" className="nav-bar-link">
            back
          </Link>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-hidden flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-[24rem]">
          <p className="script-kicker script-kicker-compact">{kicker}</p>
          <h1 className="headline-display headline-display-compact mb-3">{title}</h1>
          <p className="text-[0.9375rem] leading-relaxed text-[var(--mut)] mb-6">{subtitle}</p>
          <hr className="journal-rule-light mb-6" />
          {children}
          <p className="mt-6 text-[0.75rem] leading-relaxed text-[var(--mut)]">{footer}</p>
        </div>
      </main>
    </div>
  );
}
