import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-white">
        <div className="max-w-lg mx-auto px-6 py-5">
          <Link to="/" className="font-serif text-2xl font-semibold tracking-tight">
            Psych<span className="italic text-[#2640C8]">Dispo</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
          <div className="mt-8 border border-border bg-white p-6 md:p-8 shadow-sm">{children}</div>
          <p className="mt-6 text-sm text-muted-foreground text-center">{footer}</p>
        </div>
      </main>
    </div>
  );
}
