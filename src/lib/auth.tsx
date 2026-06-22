import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  GUEST_TEMPLATES_KEY,
  listTemplates,
  templatesStorageKey,
  writeTemplatesList,
  type PlanTemplate,
} from "@/lib/templates";
import { saveCloudTemplate } from "@/lib/cloud-library";
import { getAuthCallbackUrl } from "@/lib/auth-redirect";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type ClinicianUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export const SESSION_KEY = "psychdispo-clinician-session";
const USERS_KEY = "psychdispo-clinician-users";

type AuthContextValue = {
  user: ClinicianUser | null;
  session: Session | null;
  ready: boolean;
  supabaseEnabled: boolean;
  signInWithMagicLink: (email: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  /** Demo localStorage sign-in when Supabase is not configured */
  signInDemo: (email: string) => { ok: true } | { ok: false; error: string };
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function userFromSupabase(user: User): ClinicianUser {
  const meta = user.user_metadata ?? {};
  const name =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    user.email?.split("@")[0] ||
    "Clinician";
  return {
    id: user.id,
    email: user.email ?? "",
    name,
    createdAt: user.created_at ?? new Date().toISOString(),
  };
}

function writeSession(user: ClinicianUser | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

function readDemoUsers(): Record<string, { name: string; password: string; createdAt: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function migrateGuestTemplates(email: string, userId: string) {
  if (typeof window === "undefined") return;
  const guest = listTemplates();
  if (guest.length === 0) return;

  if (isSupabaseConfigured() && supabase) {
    for (const t of guest) {
      try {
        await saveCloudTemplate(t.name, t.scaffold);
      } catch {
        /* keep local copy if cloud fails */
      }
    }
    localStorage.removeItem(GUEST_TEMPLATES_KEY);
    return;
  }

  const key = templatesStorageKey(email);
  const existing = listTemplates(email);
  writeTemplatesList(email, [...existing, ...guest]);
  localStorage.removeItem(GUEST_TEMPLATES_KEY);
}

async function syncSupabaseSession(session: Session | null) {
  if (!session?.user) {
    writeSession(null);
    return null;
  }
  const clinician = userFromSupabase(session.user);
  writeSession(clinician);
  await migrateGuestTemplates(clinician.email, clinician.id);
  return clinician;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClinicianUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const supabaseEnabled = isSupabaseConfigured();

  useEffect(() => {
    if (!supabase) {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
      setReady(true);
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session: initial } }) => {
      if (cancelled) return;
      setSession(initial);
      syncSupabaseSession(initial).then((clinician) => {
        if (!cancelled) setUser(clinician);
        if (!cancelled) setReady(true);
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      syncSupabaseSession(nextSession).then((clinician) => setUser(clinician));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithMagicLink = useCallback(async (email: string) => {
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) return { ok: false as const, error: "Enter a valid email." };
    if (!supabase) {
      return {
        ok: false as const,
        error: "Cloud sign-in is not configured. Continue as guest or add Supabase keys.",
      };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: { emailRedirectTo: getAuthCallbackUrl() },
    });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  }, []);

  const signInDemo = useCallback((email: string) => {
    const normalized = normalizeEmail(email || "guest@psychdispo.local");
    if (!isValidEmail(normalized)) return { ok: false as const, error: "Enter a valid email." };
    const users = readDemoUsers();
    const record = users[normalized];
    const session: ClinicianUser = {
      id: normalized,
      email: normalized,
      name: record?.name ?? normalized.split("@")[0],
      createdAt: record?.createdAt ?? new Date().toISOString(),
    };
    writeSession(session);
    setUser(session);
    migrateGuestTemplates(session.email, session.id);
    return { ok: true as const };
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    writeSession(null);
    setUser(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      ready,
      supabaseEnabled,
      signInWithMagicLink,
      signInDemo,
      signOut,
    }),
    [
      user,
      session,
      ready,
      supabaseEnabled,
      signInWithMagicLink,
      signInDemo,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
