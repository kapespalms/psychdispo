import { SITE_URL } from "@/lib/seo";

/** Canonical post-auth redirect for magic links (and any legacy OAuth callbacks). */
export function getAuthCallbackUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : (configured ?? SITE_URL).replace(/\/$/, "");
  const canonical = (configured ?? (base.includes("psychdispo.com") ? SITE_URL : base)).replace(
    /\/$/,
    "",
  );
  return `${canonical}/auth/callback`;
}
