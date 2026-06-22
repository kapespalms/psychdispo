import { Link, useRouter } from "@tanstack/react-router";
import { PsychDispoLogo } from "@/components/psychdispo-logo";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/dispo" as const, label: "Plan", landingActive: true },
  { to: "/directory" as const, label: "Directory" },
  { to: "/social-care" as const, label: "Social" },
  { to: "/reference" as const, label: "Reference" },
] as const;

export function LandingHeader() {
  const router = useRouter();
  const path = router.state.location.pathname;
  const { user, signOut } = useAuth();

  const isActive = (to: string, landingActive?: boolean) => {
    if (landingActive && path === "/") return true;
    return (
      path === to ||
      (to === "/reference" && (path === "/emerg" || path === "/social-ref")) ||
      (to === "/social-care" && path === "/social-ref")
    );
  };

  return (
    <header className="shell-header shrink-0">
      <div className="site-logo-top">
        <Link to="/" className="no-underline" aria-label="PsychDispo home">
          <PsychDispoLogo />
        </Link>
      </div>

      <div className="shell-header-inner">
        <nav className="nav-pill-group" aria-label="Primary">
          {NAV.map(({ to, label, ...rest }) => {
            const active = isActive(to, "landingActive" in rest ? rest.landingActive : false);
            return (
              <Link
                key={to}
                to={to}
                className={active ? "nav-pill nav-pill-active-dot" : "nav-pill"}
              >
                {active && <span className="nav-pill-dot" aria-hidden="true" />}
                {label}
              </Link>
            );
          })}
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
            <Link to="/sign-in" className="nav-bar-link nav-bar-link-accent">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
