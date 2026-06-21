import { SESSION_KEY, type ClinicianUser } from "@/lib/auth";

export const GUEST_SAVE_KEY = "psychdispo-plan-v1";

export type PlanPayload = {
  S: Record<string, unknown>;
  savedAt: string;
};

export type SavedPlan = {
  id: string;
  name: string;
  savedAt: string;
  updatedAt: string;
  S: Record<string, unknown>;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function plansStorageKey(email: string) {
  return `psychdispo-plans-${normalizeEmail(email)}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readSessionUser(): ClinicianUser | null {
  return readJson<ClinicianUser | null>(SESSION_KEY, null);
}

export function loadGuestDraft(): PlanPayload | null {
  const p = readJson<PlanPayload | null>(GUEST_SAVE_KEY, null);
  return p?.S ? p : null;
}

/** Mirrors hasMeaningfulPlan() in public/psychdispo.html — filters empty auto-saves. */
export function hasMeaningfulPlan(p: PlanPayload | null): boolean {
  if (!p?.S) return false;
  const s = p.S as Record<string, unknown>;
  return !!(s.cleared || s.setting || s.zip || s.city || s.insurance || s.lifeStage);
}

export function guestDraftSummary(p: PlanPayload) {
  const s = p.S as {
    zip?: string;
    city?: string;
    setting?: string;
    insurance?: string;
  };
  const location = s.zip?.length === 5 ? s.zip : s.city || undefined;
  const parts: string[] = [];
  if (location) parts.push(location);
  if (s.setting) {
    parts.push(s.setting === "Acute" ? "Acute / Inpatient" : s.setting === "Outpatient" ? "Outpatient" : s.setting);
  }
  if (s.insurance) parts.push(s.insurance);
  return {
    savedLabel: new Date(p.savedAt).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    detail: parts.length ? parts.join(" · ") : "Disposition plan",
  };
}

export function saveGuestDraft(S: Record<string, unknown>) {
  writeJson(GUEST_SAVE_KEY, { S, savedAt: new Date().toISOString() });
}

export function listPlans(email: string): SavedPlan[] {
  const plans = readJson<SavedPlan[]>(plansStorageKey(email), []);
  return [...plans].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getPlan(email: string, id: string): SavedPlan | null {
  return listPlans(email).find((p) => p.id === id) ?? null;
}

export function savePlan(
  email: string,
  name: string,
  S: Record<string, unknown>,
  existingId?: string,
): SavedPlan {
  const trimmed = name.trim() || "Untitled plan";
  const now = new Date().toISOString();
  const plans = readJson<SavedPlan[]>(plansStorageKey(email), []);
  const id = existingId ?? crypto.randomUUID();
  const idx = plans.findIndex((p) => p.id === id);
  const record: SavedPlan = {
    id,
    name: trimmed,
    savedAt: idx >= 0 ? plans[idx].savedAt : now,
    updatedAt: now,
    S,
  };
  if (idx >= 0) plans[idx] = record;
  else plans.push(record);
  writeJson(plansStorageKey(email), plans);
  return record;
}

export function deletePlan(email: string, id: string) {
  const plans = readJson<SavedPlan[]>(plansStorageKey(email), []);
  writeJson(
    plansStorageKey(email),
    plans.filter((p) => p.id !== id),
  );
}

export function planMeta(plan: SavedPlan) {
  const s = plan.S as {
    zip?: string;
    city?: string;
    setting?: string;
    insurance?: string;
  };
  return {
    zip: s.zip?.length === 5 ? s.zip : undefined,
    city: s.city || undefined,
    setting: s.setting || undefined,
    insurance: s.insurance || undefined,
    location: s.zip?.length === 5 ? s.zip : s.city || "—",
  };
}

export function resumePlanToGuestDraft(plan: SavedPlan) {
  saveGuestDraft(plan.S);
}
