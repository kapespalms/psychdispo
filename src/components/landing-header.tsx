import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function LandingHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-[#E6DECE] bg-[#FFFDF8]">
      <div className="max-w-[1000px] mx-auto px-7 py-4 flex items-center gap-5">
        <Link to="/" className="font-serif text-[23px] font-bold tracking-tight shrink-0">
          Psych<span className="italic text-[#2A43C0]">Dispo</span>
        </Link>

        <p className="hidden md:block text-[13px] text-[#6f6a5f] mx-auto text-center">
          <span className="font-semibold text-[#BC5B3A]">Verified resources</span>
          <span className="mx-2">·</span>
          all 50 states
        </p>

        <div className="ml-auto flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <span className="hidden sm:inline text-xs tracking-[0.13em] uppercase font-semibold text-[#6f6a5f]">
                {user.name.split(" ")[0]}
              </span>
              <Link
                to="/dispo"
                className="text-xs tracking-[0.13em] uppercase font-semibold text-[#2A43C0] hover:underline"
              >
                Continue
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="text-xs text-[#6f6a5f] hover:text-[#22202A]"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/sign-in"
              className="text-xs tracking-[0.13em] uppercase font-semibold text-[#2A43C0] hover:underline"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
