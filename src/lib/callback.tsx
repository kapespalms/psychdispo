import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/auth/callback")({
  head: () =>
    pageHead({
      path: "/auth/callback",
      title: "Signing in · PsychDispo",
      description: "Completing sign in.",
      noindex: true,
    }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      navigate({ to: "/sign-in", replace: true });
      return;
    }

    let cancelled = false;

    async function finishSignIn() {
      const params = new URLSearchParams(window.location.search);
      if (params.has("code")) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
          window.location.href,
        );
        if (cancelled) return;
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (cancelled) return;
      if (sessionError) {
        setError(sessionError.message);
        return;
      }
      if (session) {
        navigate({ to: "/dispo", replace: true });
      }
    }

    finishSignIn();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "SIGNED_IN" && session) {
        navigate({ to: "/dispo", replace: true });
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-1 min-h-0 items-center justify-center px-6 py-10">
        <div className="state-panel">
          <p className="script-kicker script-kicker-compact">Sign in</p>
          <h1>Could not complete sign in</h1>
          <p className="form-error" role="alert">
            {error}
          </p>
          <Link to="/sign-in" className="text-link-accent text-sm">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 items-center justify-center px-6 py-10">
      <div className="state-panel">
        <p className="script-kicker script-kicker-compact">Account</p>
        <h1>Signing you in</h1>
        <p>Completing authentication…</p>
      </div>
    </div>
  );
}
