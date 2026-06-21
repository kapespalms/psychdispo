import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/dispo" as const, label: "Plan" },
  { to: "/directory" as const, label: "Directory" },
  { to: "/social-care" as const, label: "Social" },
  { to: "/reference" as const, label: "Reference" },
] as const;

export function SiteHeader() {
  const router = useRouter();
  const path = router.state.location.pathname;
  const { user, signOut } = useAuth();

  const isActive = (to: string) =>
    path === to ||
    (to === "/reference" && (path === "/emerg" || path === "/social-ref")) ||
    (to === "/social-care" && path === "/social-ref");

  return (
    <header className="shell-header">
      <div className="max-w-[var(--page)] mx-auto px-6 sm:px-10 py-4 flex items-baseline justify-between gap-6">
        <Link
          to="/"
          className="font-serif text-[1.5rem] tracking-tight text-[var(--ink)] shrink-0 no-underline"
        >
          PsychDispo
        </Link>

        <nav
          className="hidden md:flex items-baseline gap-5 flex-wrap justify-end"
          aria-label="Primary"
        >
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={isActive(to) ? "nav-text nav-text-active" : "nav-text"}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-baseline gap-4 shrink-0 ml-auto md:ml-0">
          {user ? (
            <>
              <Link to="/plans" className="nav-text hidden sm:inline">
                Plans
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="nav-text bg-transparent border-none cursor-pointer font-[inherit] p-0"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/sign-in" className="nav-text">
              Sign in
            </Link>
          )}
        </div>
      </div>

      <nav
        className="md:hidden border-t border-[var(--line)] px-6 py-3 flex gap-5 overflow-x-auto"
        aria-label="Primary mobile"
      >
        {NAV.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={isActive(to) ? "nav-text nav-text-active" : "nav-text"}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
