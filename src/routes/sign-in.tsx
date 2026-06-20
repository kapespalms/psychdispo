import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [{ title: "Sign in · PsychDispo" }],
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
      subtitle="Save your templates, favorite resources, and custom blurbs. Patient work always stays on your device."
      footer={
        <>
          No passwords. We never store patient information — only your account, templates, and
          preferences.{" "}
          <Link to="/dispo" className="text-[#2A43C0] font-medium hover:underline">
            Continue as guest
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-[#6f6a5f] leading-relaxed">
            Check <strong>{email}</strong> for your sign-in link. It expires in 15 minutes.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-sm text-[#2A43C0] hover:underline"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleMagicLink} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] tracking-[0.12em] uppercase font-semibold text-[#6f6a5f] mb-2"
            >
              Work email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#E6DECE] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2A43C0]/30 focus:border-[#2A43C0]"
              placeholder="you@hospital.org"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 px-3 py-2 rounded-sm">
              {error}
            </p>
          )}
          {!supabaseEnabled && (
            <p className="text-xs text-[#9b9587] leading-relaxed">
              Cloud sign-in is not configured — magic link requires Supabase env keys. Google uses
              demo mode on this device.
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !supabaseEnabled}
            className="w-full py-3 bg-[#2A43C0] text-white text-sm font-semibold rounded-[11px] hover:bg-[#1b2f9c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : "Email me a sign-in link"}
          </button>
          <div className="text-center text-xs text-[#9b9587]">or</div>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3 border border-[#E6DECE] bg-white text-sm font-semibold rounded-[10px] hover:bg-[#fbf7ee] transition-colors disabled:opacity-50"
          >
            {supabaseEnabled ? "Continue with Google" : "Continue with Google (demo)"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
