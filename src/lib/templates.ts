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

export function writeTemplatesList(email: string, list: PlanTemplate[]) {
  localStorage.setItem(templatesStorageKey(email), JSON.stringify(list));
}

export function saveLocalTemplate(
  email: string | undefined,
  name: string,
  scaffold: Record<string, unknown>,
  type = "clinical",
): PlanTemplate {
  const key = email ? templatesStorageKey(email) : GUEST_TEMPLATES_KEY;
  const list = readJson<PlanTemplate[]>(key, []);
  const trimmed = name.trim() || "Untitled template";
  const now = new Date().toISOString();
  const record: PlanTemplate = {
    id: crypto.randomUUID(),
    name: trimmed,
    type,
    scaffold,
    updatedAt: now,
  };
  list.push(record);
  localStorage.setItem(key, JSON.stringify(list));
  return record;
}

export function deleteTemplate(email: string, id: string) {
  const key = templatesStorageKey(email);
  const list = readJson<PlanTemplate[]>(key, []);
  localStorage.setItem(
    key,
    JSON.stringify(list.filter((t) => t.id !== id)),
  );
}

export function getTemplate(email: string, id: string): PlanTemplate | null {
  return listTemplates(email).find((t) => t.id === id) ?? null;
}

/** Write scaffold-only state for psychdispo.html to load on /dispo?template=1 */
export function applyTemplateToGuestDraft(scaffold: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    "psychdispo-plan-v1",
    JSON.stringify({ S: scaffold, savedAt: new Date().toISOString() }),
  );
}
