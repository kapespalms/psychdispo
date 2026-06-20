import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const router = useRouter();
  const path = router.state.location.pathname;
  const { user, signOut } = useAuth();

  const tabClass = (match: boolean) =>
    `px-1 py-3.5 text-[11px] tracking-[0.15em] uppercase font-semibold border-b-2 transition-colors ${
      match
        ? "text-[#2A43C0] border-[#2A43C0]"
        : "text-[#6f6a5f] border-transparent hover:text-[#22202A]"
    }`;

  return (
    <header className="bg-[#FFFDF8] border-b border-[#E6DECE] shrink-0">
      <div className="max-w-[1000px] mx-auto px-7 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-serif text-[23px] font-bold tracking-tight shrink-0">
          Psych<span className="italic text-[#2A43C0]">Dispo</span>
        </Link>
        <div className="hidden lg:flex items-center gap-2 font-serif italic text-[13.5px] text-[#6f6a5f]">
          <span className="not-italic font-semibold text-[#BC5B3A] text-[11px] tracking-[0.13em] uppercase">
            1,400+ verified resources
          </span>
          <span>·</span>
          <span>all 50 states</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link
                to="/plans"
                className="hidden sm:inline text-xs text-[#2A43C0] hover:underline px-2"
              >
                My plans
              </Link>
              <span className="hidden sm:inline text-xs tracking-[0.1em] uppercase font-semibold text-[#6f6a5f]">
                {user.name.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={signOut}
                className="text-xs text-[#6f6a5f] hover:text-[#22202A] px-2"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/sign-in"
              className="text-xs tracking-[0.13em] uppercase font-semibold text-[#2A43C0] hover:underline px-2"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <nav className="border-t border-[#E6DECE] bg-[#FFFDF8]">
        <div className="max-w-[1000px] mx-auto px-7 flex gap-8 overflow-x-auto">
          <Link to="/dispo" className={tabClass(path === "/dispo")}>
            PsychDispo · Plan
          </Link>
          <Link to="/social-care" className={tabClass(path === "/social-care")}>
            Social Care Plan
          </Link>
          <Link to="/emerg" className={tabClass(path === "/emerg")}>
            Psych Emerg · Review
          </Link>
          <Link to="/directory" className={tabClass(path === "/directory")}>
            Resource Directory
          </Link>
          <Link to="/reference" className={tabClass(path === "/reference")}>
            Psych Ref
          </Link>
        </div>
      </nav>
    </header>
  );
}
