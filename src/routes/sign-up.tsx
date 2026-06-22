import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthEmailIcon,
  AuthSendIcon,
  AuthShieldIcon,
  AuthShell,
} from "@/components/auth-shell";
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
      title="Create account"
      subtitle="Free for clinicians. Use your work email to receive a secure sign-in link."
      welcomeTitle="Get started"
      welcomeSubtitle="Save templates and sync your library when signed in. No PHI required to sign up."
      belowForm={
        <>
          <p className="auth-shield-line">
            <AuthShieldIcon />
            <span>
              No passwords. We never store patient information — only your account, templates, and
              preferences.
            </span>
          </p>
          <p className="auth-terms-note">
            By creating an account you agree to our{" "}
            <Link to="/terms" className="text-link-accent">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-link-accent">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="auth-alt-link">
            <Link to="/dispo" className="text-link-accent">
              Continue as guest
            </Link>
          </p>
          <p className="auth-alt-link auth-alt-link-muted">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-link-accent">
              Sign in
            </Link>
          </p>
        </>
      }
    >
      {sent ? (
        <div className="auth-sent-panel">
          <p>
            Check <strong>{email}</strong> for your sign-in link. First-time users are created
            automatically.
          </p>
          <button type="button" onClick={() => setSent(false)} className="auth-text-button">
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div>
            <label htmlFor="email" className="auth-label">
              Work email
            </label>
            <div className="auth-input-wrap">
              <AuthEmailIcon />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? "sign-up-error" : undefined}
                className="auth-input"
                placeholder="you@hospital.org"
              />
            </div>
          </div>
          {error ? (
            <p id="sign-up-error" className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          {!supabaseEnabled ? (
            <p className="auth-hint">
              Cloud sign-in is not configured — this creates a demo account on this device only.
            </p>
          ) : null}
          <button type="submit" disabled={loading} className="btn-auth-primary">
            <span>
              {loading ? "Sending…" : supabaseEnabled ? "Email sign-in link" : "Create demo account"}
            </span>
            <AuthSendIcon />
          </button>
        </form>
      )}
    </AuthShell>
  );
}
