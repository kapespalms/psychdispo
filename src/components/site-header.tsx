import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

const TABS = [
  { to: "/dispo" as const, label: "PsychDispo · Plan", match: (p: string) => p === "/dispo" },
  {
    to: "/social-care" as const,
    label: "Social Care Plan",
    match: (p: string) => p === "/social-care",
  },
  {
    to: "/social-ref" as const,
    label: "Social Ref",
    match: (p: string) => p === "/social-ref",
  },
  {
    to: "/emerg" as const,
    label: "Psych Emerg · Review",
    match: (p: string) => p === "/emerg",
  },
  {
    to: "/directory" as const,
    label: "Resource Directory",
    match: (p: string) => p === "/directory",
  },
  {
    to: "/reference" as const,
    label: "Psych Ref",
    match: (p: string) => p === "/reference",
  },
] as const;

export function SiteHeader() {
  const router = useRouter();
  const path = router.state.location.pathname;
  const { user, signOut } = useAuth();

  const tabClass = (active: boolean) =>
    [
      "shrink-0 px-1 py-3 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap",
      active
        ? "text-[var(--t)] border-[var(--t)]"
        : "text-[var(--mut)] border-transparent hover:text-[var(--ink)]",
    ].join(" ");

  return (
    <header className="shrink-0 bg-white border-b border-[var(--line)]">
      <div className="max-w-[1040px] mx-auto px-5 sm:px-7 py-3.5 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-serif text-[1.375rem] font-semibold tracking-tight text-[var(--ink)] shrink-0"
        >
          Psych<span className="text-[var(--t)]">Dispo</span>
        </Link>

        <p className="hidden lg:block text-sm text-[var(--mut)]">
          Verified resources · all 50 states
        </p>

        <div className="flex items-center gap-1 shrink-0">
          {user ? (
            <>
              <Link
                to="/plans"
                className="hidden sm:inline-flex items-center min-h-[44px] px-3 text-sm font-medium text-[var(--t)] hover:underline"
              >
                My plans
              </Link>
              <span className="hidden sm:inline text-sm text-[var(--mut)] px-1">
                {user.name.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center min-h-[44px] px-3 text-sm text-[var(--mut)] hover:text-[var(--ink)]"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/sign-in"
              className="inline-flex items-center min-h-[44px] px-4 text-sm font-semibold text-[var(--t)] border border-[var(--t)] rounded-[var(--radius)] hover:bg-[#f0f3fc] transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <nav
        className="border-t border-[var(--line)] bg-white"
        aria-label="Product navigation"
      >
        <div className="max-w-[1040px] mx-auto px-5 sm:px-7 flex gap-6 sm:gap-8 overflow-x-auto">
          {TABS.map(({ to, label, match }) => (
            <Link key={to} to={to} className={tabClass(match(path))}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
