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
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = signIn(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate({ to: "/dispo" });
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to save disposition plans and pick up where you left off. Your session stays on this device."
      footer={
        <>
          New here?{" "}
          <Link to="/sign-up" className="text-[#2640C8] font-medium hover:underline">
            Create a free account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email
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
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2640C8]/30 focus:border-[#2640C8]"
          />
        </div>
        {error && (
          <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 px-3 py-2 rounded-sm">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-[#2640C8] text-white text-sm font-semibold tracking-wide hover:bg-[#1b2f9c] transition-colors"
        >
          Sign in
        </button>
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Or{" "}
          <Link to="/dispo" className="text-[#2640C8] hover:underline">
            continue as guest
          </Link>{" "}
          — no account required.
        </p>
      </form>
    </AuthShell>
  );
}
