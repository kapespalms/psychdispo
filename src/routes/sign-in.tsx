import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthEmailIcon,
  AuthSendIcon,
  AuthShieldIcon,
  AuthShell,
} from "@/components/auth-shell";
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
  const { signInWithMagicLink, supabaseEnabled } = useAuth();
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

  return (
    <AuthShell
      kicker="Account"
      title="Sign in"
      subtitle="Use your work email to receive a secure sign-in link."
      belowForm={
        <>
          <p className="auth-shield-line">
            <AuthShieldIcon />
            <span>
              No passwords. We never store patient information — only your account, templates, and
              preferences.
            </span>
          </p>
          <p className="auth-alt-link">
            <Link to="/dispo" className="text-link-accent">
              Continue as guest
            </Link>
          </p>
          <p className="auth-alt-link auth-alt-link-muted">
            New here?{" "}
            <Link to="/sign-up" className="text-link-accent">
              Create account
            </Link>
          </p>
        </>
      }
    >
      {sent ? (
        <div className="auth-sent-panel">
          <p>
            Check <strong>{email}</strong> for your sign-in link. It expires in 15 minutes.
          </p>
          <button type="button" onClick={() => setSent(false)} className="auth-text-button">
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleMagicLink} className="auth-form" noValidate>
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
                aria-describedby={error ? "sign-in-error" : undefined}
                className="auth-input"
                placeholder="you@hospital.org"
              />
            </div>
          </div>
          {error ? (
            <p id="sign-in-error" className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          {!supabaseEnabled ? (
            <p className="auth-hint">
              Cloud sign-in is not configured — magic link requires Supabase env keys.
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading || !supabaseEnabled}
            className="btn-auth-primary"
          >
            <span>{loading ? "Sending…" : "Email sign-in link"}</span>
            <AuthSendIcon />
          </button>
        </form>
      )}
    </AuthShell>
  );
}
