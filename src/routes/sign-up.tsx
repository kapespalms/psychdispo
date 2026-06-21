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
      kicker="Account"
      title="Create your account"
      subtitle="Free for clinicians. Save templates and sync your library when signed in. No PHI required to sign up."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-link-accent">
            Sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-[var(--mut)] leading-relaxed">
            Check <strong className="text-[var(--ink)]">{email}</strong> for your sign-in link. First-time
            users are created automatically.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-link text-sm bg-transparent border-none cursor-pointer font-[inherit] p-0"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="kicker block mb-2">
              Work email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "sign-up-error" : undefined}
              className="form-input"
              placeholder="you@hospital.org"
            />
          </div>
          {error && (
            <p id="sign-up-error" className="form-error" role="alert">
              {error}
            </p>
          )}
          {!supabaseEnabled && (
            <p className="text-xs text-[var(--mut)] leading-relaxed">
              Cloud sign-in is not configured — this creates a demo account on this device only.
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-blue w-full text-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? "Sending…"
              : supabaseEnabled
                ? "Email sign-in link"
                : "Create demo account"}
          </button>
          <p className="text-xs text-[var(--mut)] text-center leading-relaxed">
            By creating an account you agree this tool is for clinical reference only and does not store
            patient identifiers.
          </p>
          <p className="text-xs text-[var(--mut)] text-center">
            <Link to="/dispo" className="text-link-accent">
              Continue as guest
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
