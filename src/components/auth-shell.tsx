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
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden text-[var(--ink)]">
      <main className="flex-1 min-h-0 overflow-hidden flex items-center justify-center px-6 py-10">
        <div className="auth-panel">
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
