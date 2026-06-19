import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
  ready: boolean;
  signIn: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => { ok: true } | { ok: false; error: string };
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): Record<string, { name: string; password: string; createdAt: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, { name: string; password: string; createdAt: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession(): ClinicianUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(user: ClinicianUser | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClinicianUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readSession());
    setReady(true);
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) return { ok: false as const, error: "Enter a valid email." };
    if (!password) return { ok: false as const, error: "Enter your password." };

    const users = readUsers();
    const record = users[normalized];
    if (!record || record.password !== password) {
      return { ok: false as const, error: "Email or password is incorrect." };
    }

    const session: ClinicianUser = {
      id: normalized,
      email: normalized,
      name: record.name,
      createdAt: record.createdAt,
    };
    writeSession(session);
    setUser(session);
    return { ok: true as const };
  }, []);

  const signUp = useCallback((name: string, email: string, password: string) => {
    const trimmedName = name.trim();
    const normalized = normalizeEmail(email);
    if (!trimmedName) return { ok: false as const, error: "Enter your name." };
    if (!isValidEmail(normalized)) return { ok: false as const, error: "Enter a valid email." };
    if (password.length < 8) {
      return { ok: false as const, error: "Password must be at least 8 characters." };
    }

    const users = readUsers();
    if (users[normalized]) {
      return { ok: false as const, error: "An account with this email already exists." };
    }

    const createdAt = new Date().toISOString();
    users[normalized] = { name: trimmedName, password, createdAt };
    writeUsers(users);

    const session: ClinicianUser = {
      id: normalized,
      email: normalized,
      name: trimmedName,
      createdAt,
    };
    writeSession(session);
    setUser(session);
    return { ok: true as const };
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signUp, signOut }),
    [user, ready, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
