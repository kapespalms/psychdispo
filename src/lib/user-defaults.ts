export type UserDefaults = {
  setting?: string;
  insurance?: string;
  homeZip?: string;
  homeCity?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function defaultsStorageKey(email: string) {
  return `psychdispo-defaults-${normalizeEmail(email)}`;
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

export function getDefaults(email: string): UserDefaults {
  return readJson<UserDefaults>(defaultsStorageKey(email), {});
}

export function saveDefaults(email: string, defaults: UserDefaults) {
  localStorage.setItem(defaultsStorageKey(email), JSON.stringify(defaults));
}

export function applyDefaultsToPlanState(
  defaults: UserDefaults,
  S: Record<string, unknown>,
) {
  if (defaults.setting && !S.setting) S.setting = defaults.setting;
  if (defaults.insurance && !S.insurance) S.insurance = defaults.insurance;
  if (defaults.homeZip && !S.zip && !S.city) S.zip = defaults.homeZip.replace(/[^0-9]/g, "").slice(0, 5);
  else if (defaults.homeCity && !S.zip && !S.city) S.city = defaults.homeCity;
}
