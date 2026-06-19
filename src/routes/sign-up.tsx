import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [{ title: "Create account · PsychDispo" }],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = signUp(name, email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate({ to: "/dispo" });
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free for clinicians. Save plans, resume workflows, and sync preferences on this device. No PHI required to sign up."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-[#2640C8] font-medium hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2640C8]/30 focus:border-[#2640C8]"
            placeholder="Dr. Smith"
          />
        </div>
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
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2640C8]/30 focus:border-[#2640C8]"
            placeholder="At least 8 characters"
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
          Create account
        </button>
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          By creating an account you agree this tool is for clinical reference only and does not
          store patient identifiers.
        </p>
      </form>
    </AuthShell>
  );
}
