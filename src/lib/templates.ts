export type PlanTemplate = {
  id: string;
  name: string;
  type: string;
  scaffold: Record<string, unknown>;
  updatedAt: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function templatesStorageKey(email: string) {
  return `psychdispo-templates-${normalizeEmail(email)}`;
}

export const GUEST_TEMPLATES_KEY = "psychdispo-templates-guest";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function listTemplates(email?: string): PlanTemplate[] {
  const key = email ? templatesStorageKey(email) : GUEST_TEMPLATES_KEY;
  const list = readJson<PlanTemplate[]>(key, []);
  return [...list].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function deleteTemplate(email: string, id: string) {
  const key = templatesStorageKey(email);
  const list = readJson<PlanTemplate[]>(key, []);
  localStorage.setItem(
    key,
    JSON.stringify(list.filter((t) => t.id !== id)),
  );
}
