import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{ title: "Signing in · PsychDispo" }],
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

    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (cancelled) return;
      if (sessionError) {
        setError(sessionError.message);
        return;
      }
      if (session) {
        navigate({ to: "/dispo", replace: true });
      }
    });

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
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <a href="/sign-in" className="text-sm text-[#2A43C0] hover:underline">Back to sign in</a>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
      Signing you in…
    </div>
  );
}
