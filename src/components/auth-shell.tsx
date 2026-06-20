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
    <div className="min-h-screen flex flex-col bg-[#F4EFE5] text-[#22202A]">
      <header className="border-b border-[#E6DECE] bg-[#FFFDF8]">
        <div className="max-w-[1000px] mx-auto px-7 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-[23px] font-bold tracking-tight">
            Psych<span className="italic text-[#2A43C0]">Dispo</span>
          </Link>
          <Link
            to="/"
            className="text-xs tracking-[0.13em] uppercase font-semibold text-[#2A43C0] hover:underline"
          >
            Back
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-[460px]">
          <div className="bg-[#FFFDF8] border border-[#E6DECE] rounded-[5px] overflow-hidden">
            <div className="px-8 py-7 md:px-9 md:py-8">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="font-serif text-[13px] text-[#BC5B3A] font-semibold">·</span>
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#9b9587] font-semibold">
                  {kicker}
                </span>
                <span className="flex-1 h-px bg-[#E6DECE]" />
              </div>
              <h1 className="font-serif text-[33px] font-bold tracking-tight">{title}</h1>
              <p className="mt-1 font-serif italic text-[15px] text-[#6f6a5f] leading-relaxed mb-6">
                {subtitle}
              </p>
              {children}
            </div>
          </div>
          <p className="mt-4 font-serif italic text-xs text-[#9b9587] text-center leading-relaxed">
            {footer}
          </p>
        </div>
      </main>
    </div>
  );
}
