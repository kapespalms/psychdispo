import { Link, useRouter } from "@tanstack/react-router";
import { PsychDispoLogo } from "@/components/psychdispo-logo";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/dispo" as const, label: "plan" },
  { to: "/directory" as const, label: "directory" },
  { to: "/social-care" as const, label: "social" },
  { to: "/reference" as const, label: "reference" },
] as const;

export function LandingHeader() {
  const router = useRouter();
  const path = router.state.location.pathname;
  const { user, signOut } = useAuth();

  const isActive = (to: string) =>
    path === to ||
    (to === "/reference" && (path === "/emerg" || path === "/social-ref")) ||
    (to === "/social-care" && path === "/social-ref");

  return (
    <header className="shell-header shrink-0">
      <div className="site-logo-top">
        <Link to="/" className="no-underline" aria-label="PsychDispo home">
          <PsychDispoLogo />
        </Link>
      </div>

      <div className="shell-header-inner">
        <nav className="nav-pill-group" aria-label="Primary">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={isActive(to) ? "nav-pill nav-pill-active" : "nav-pill"}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-auto">
          {user ? (
            <>
              <Link to="/plans" className="nav-bar-link">
                plans
              </Link>
              <Link to="/settings" className="nav-bar-link">
                settings
              </Link>
              <button type="button" onClick={signOut} className="nav-bar-link">
                sign out
              </button>
            </>
          ) : (
            <Link to="/sign-in" className="nav-bar-link">
              sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
