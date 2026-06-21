import type { ReactNode } from "react";

export function EditorialPage({
  kicker,
  title,
  subtitle,
  actions,
  children,
  footer,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden text-[var(--ink)]">
      <div className="editorial-scroll flex-1 min-h-0 overflow-y-auto">
        <div className="editorial-content">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="min-w-0">
              <p className="script-kicker script-kicker-compact">{kicker}</p>
              <h1 className="headline-display headline-display-compact">{title}</h1>
              {subtitle && (
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--mut)] max-w-[36rem]">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="shrink-0 pt-1">{actions}</div>}
          </div>

          <hr className="journal-rule mb-8" />

          {children}

          {footer && (
            <p className="mt-10 pt-4 border-t border-[var(--line)] text-[0.75rem] leading-relaxed text-[var(--mut)]">
              {footer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function EditorialSection({
  label,
  title,
  children,
}: {
  label?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="editorial-section">
      {label && <p className="kicker mb-2">{label}</p>}
      <h2 className="font-serif text-[1.25rem] font-medium tracking-tight mb-3">{title}</h2>
      <div className="text-[0.9375rem] leading-relaxed text-[var(--mut)] space-y-3">{children}</div>
    </section>
  );
}
