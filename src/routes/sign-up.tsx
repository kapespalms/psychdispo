import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { useAuth } from "@/lib/auth";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/sign-up")({
  head: () =>
    pageHead({
      path: "/sign-up",
      title: "Create account · PsychDispo",
      description: "Create a PsychDispo account.",
      noindex: true,
    }),
  component: SignUpPage,
});

function SignUpPage() {
  const { signInWithMagicLink, signInDemo, supabaseEnabled } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Enter your work email.");
      return;
    }
    if (!supabaseEnabled) {
      const result = signInDemo(email);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      navigate({ to: "/dispo" });
      return;
    }
    setLoading(true);
    const result = await signInWithMagicLink(email);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free for clinicians. Save templates and sync your library when signed in. No PHI required to sign up."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-[#2640C8] font-medium hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Check <strong>{email}</strong> for your sign-in link. First-time users are created
            automatically.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-sm text-[#2640C8] hover:underline"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Work email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2640C8]/30 focus:border-[#2640C8]"
              placeholder="you@hospital.org"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 px-3 py-2 rounded-sm">
              {error}
            </p>
          )}
          {!supabaseEnabled && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Supabase is not configured — this creates a demo account on this device only.
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2640C8] text-white text-sm font-semibold tracking-wide hover:bg-[#1b2f9c] transition-colors disabled:opacity-50"
          >
            {loading
              ? "Sending…"
              : supabaseEnabled
                ? "Email me a sign-in link"
                : "Create demo account"}
          </button>
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By creating an account you agree this tool is for clinical reference only and does not
            store patient identifiers.
          </p>
          <p className="text-xs text-muted-foreground text-center">
            <Link to="/dispo" className="text-[#2640C8] hover:underline">Continue as guest</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
