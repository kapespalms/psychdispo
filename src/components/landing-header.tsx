import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function LandingHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="shell-header">
      <div className="max-w-[var(--page)] mx-auto px-6 sm:px-10 py-4 flex items-baseline justify-between gap-6">
        <Link
          to="/"
          className="font-serif text-[1.5rem] tracking-tight text-[var(--ink)] no-underline"
        >
          PsychDispo
        </Link>

        <p className="hidden sm:block kicker">All fifty states</p>

        <div className="flex items-baseline gap-4 ml-auto">
          {user ? (
            <>
              <Link to="/dispo" className="text-link-accent text-[0.8125rem] font-medium">
                Open plan
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
            <>
              <Link to="/sign-in" className="nav-text">
                Sign in
              </Link>
              <Link to="/dispo" className="text-link-accent text-[0.8125rem] font-medium">
                Open plan
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
