import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { EditorialFooterLinks } from "@/components/editorial-footer-links";
import { useAuth } from "@/lib/auth";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/sign-in")({
  head: () =>
    pageHead({
      path: "/sign-in",
      title: "Sign in · PsychDispo",
      description: "Sign in to PsychDispo.",
      noindex: true,
    }),
  component: SignInPage,
});

function SignInPage() {
  const { signInWithMagicLink, signInWithGoogle, signInDemo, supabaseEnabled } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Enter your work email.");
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

  async function handleGoogle() {
    setError("");
    if (!supabaseEnabled) {
      const result = signInDemo(email || "guest@psychdispo.local");
      if (!result.ok) {
        setError(result.error);
        return;
      }
      navigate({ to: "/dispo" });
      return;
    }
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    if (!result.ok) setError(result.error);
  }

  return (
    <AuthShell
      kicker="Account"
      title="Sign in"
      subtitle="Save templates, favorite resources, and custom blurbs. Patient work stays on your device."
      footer={
        <>
          No passwords. We never store patient information — only your account, templates, and
          preferences.{" "}
          <Link to="/dispo" className="text-link-accent">
            Continue as guest
          </Link>
          <span className="block mt-2">
            <EditorialFooterLinks />
          </span>
        </>
      }
    >
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-[var(--mut)] leading-relaxed">
            Check <strong className="text-[var(--ink)]">{email}</strong> for your sign-in link. It
            expires in 15 minutes.
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
        <form onSubmit={handleMagicLink} className="space-y-5" noValidate>
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
              aria-describedby={error ? "sign-in-error" : undefined}
              className="form-input"
              placeholder="you@hospital.org"
            />
          </div>
          {error && (
            <p id="sign-in-error" className="form-error" role="alert">
              {error}
            </p>
          )}
          {!supabaseEnabled && (
            <p className="text-xs text-[var(--mut)] leading-relaxed">
              Cloud sign-in is not configured — magic link requires Supabase env keys. Google uses
              demo mode on this device.
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !supabaseEnabled}
            className="btn-blue w-full text-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : "Email sign-in link"}
          </button>
          <div className="text-center text-xs text-[var(--mut)]">or</div>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="btn-secondary"
          >
            {supabaseEnabled ? "Continue with Google" : "Continue with Google (demo)"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
