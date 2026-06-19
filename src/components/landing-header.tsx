import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function LandingHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-border/60 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-serif text-[26px] md:text-[32px] font-semibold tracking-tight">
          Psych<span className="italic text-[#2640C8]">Dispo</span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-3">
          <Link
            to="/about"
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground px-3 py-2"
          >
            About
          </Link>
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-muted-foreground">
                {user.name}
              </span>
              <Link
                to="/dispo"
                className="inline-flex items-center justify-center px-4 py-2.5 bg-[#2640C8] text-white text-sm font-medium tracking-wide hover:bg-[#1b2f9c] transition-colors"
              >
                Continue planning
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="text-sm text-muted-foreground hover:text-foreground px-2 py-2"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-2 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center px-4 py-2.5 bg-[#2640C8] text-white text-sm font-medium tracking-wide hover:bg-[#1b2f9c] transition-colors"
              >
                Start free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
