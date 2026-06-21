import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function LandingHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="shrink-0 bg-white border-b border-[var(--line)]">
      <div className="max-w-[1040px] mx-auto px-5 sm:px-7 py-3.5 flex items-center gap-4">
        <Link
          to="/"
          className="font-serif text-[1.375rem] font-semibold tracking-tight text-[var(--ink)] shrink-0"
        >
          Psych<span className="text-[var(--t)]">Dispo</span>
        </Link>

        <p className="hidden md:block text-sm text-[var(--mut)] mx-auto text-center">
          Verified resources · all 50 states
        </p>

        <div className="ml-auto flex items-center gap-1 shrink-0">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-[var(--mut)] px-1">
                {user.name.split(" ")[0]}
              </span>
              <Link
                to="/dispo"
                className="inline-flex items-center min-h-[44px] px-4 text-sm font-semibold text-white bg-[var(--t)] rounded-[var(--radius)] hover:bg-[var(--t2)] transition-colors"
              >
                Continue
              </Link>
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
    </header>
  );
}
