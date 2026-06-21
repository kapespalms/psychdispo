import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

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
    <div className="min-h-dvh flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      <header className="shell-header">
        <div className="max-w-[var(--page)] mx-auto px-6 sm:px-10 py-4 flex items-baseline justify-between">
          <Link to="/" className="font-serif text-[1.5rem] tracking-tight no-underline">
            PsychDispo
          </Link>
          <Link to="/" className="nav-text">
            Back
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-16 sm:py-20">
        <div className="max-w-[24rem] mx-auto">
          <p className="kicker mb-4">{kicker}</p>
          <h1 className="font-serif text-[2rem] leading-tight mb-3">{title}</h1>
          <p className="text-[0.9375rem] leading-relaxed text-[var(--mut)] mb-10">{subtitle}</p>
          <hr className="journal-rule-light mb-10" />
          {children}
          <p className="mt-10 text-[0.75rem] leading-relaxed text-[var(--mut)]">{footer}</p>
        </div>
      </main>
    </div>
  );
}
