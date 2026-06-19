import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const router = useRouter();
  const path = router.state.location.pathname;
  const { user, signOut } = useAuth();

  const tabClass = (match: boolean) =>
    `px-4 md:px-5 py-2.5 font-mono text-[10px] md:text-[11px] tracking-[0.18em] md:tracking-[0.22em] text-white transition-colors ${
      match ? "bg-blue-900" : "hover:bg-blue-700"
    }`;

  return (
    <header className="bg-white border-b border-border shrink-0">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="font-serif text-2xl md:text-[28px] font-semibold tracking-tight shrink-0">
          Psych<span className="italic text-[#2640C8]">Dispo</span>
        </Link>
        <div className="hidden lg:flex items-center gap-6 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
          <span>1,400+ verified resources</span>
          <span className="text-border">·</span>
          <span>All 50 states</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link
                to="/plans"
                className="hidden sm:inline text-sm text-[#2640C8] hover:underline px-2 py-1.5"
              >
                My plans
              </Link>
              <Link
                to="/settings"
                className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground px-2 py-1.5"
              >
                Settings
              </Link>
              <span className="hidden sm:inline text-sm text-muted-foreground mr-1">
                {user.name.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={signOut}
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/sign-in"
              className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <div className="bg-[#1b2f9c]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex gap-0.5 overflow-x-auto">
          <Link to="/dispo" className={tabClass(path === "/dispo")}>
            PSYCHDISPO · PLAN
          </Link>
          <Link to="/emerg" className={tabClass(path === "/emerg")}>
            PSYCH EMERG · REVIEW
          </Link>
          <Link to="/directory" className={tabClass(path === "/directory")}>
            RESOURCE DIRECTORY
          </Link>
          <Link to="/reference" className={tabClass(path === "/reference")}>
            PSYCH REF
          </Link>
        </div>
      </div>
    </header>
  );
}
