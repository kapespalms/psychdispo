import { SESSION_KEY, type ClinicianUser } from "@/lib/auth";

const DEMO_USERS_KEY = "psychdispo-clinician-users";
import { fetchCloudTemplates, fetchFavoriteKeys } from "@/lib/cloud-library";
import { GUEST_SAVE_KEY } from "@/lib/plans";
import { supabase } from "@/lib/supabase";
import { GUEST_TEMPLATES_KEY, listTemplates, templatesStorageKey } from "@/lib/templates";
import { defaultsStorageKey, getDefaults } from "@/lib/user-defaults";

export type AccountExport = {
  exportedAt: string;
  account: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
  defaults: ReturnType<typeof getDefaults>;
  templates: Awaited<ReturnType<typeof fetchCloudTemplates>>;
  favorites: string[];
  source: "supabase" | "local";
};

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function exportSignedInAccountData(
  user: ClinicianUser,
  supabaseEnabled: boolean,
): Promise<AccountExport> {
  const payload: AccountExport = {
    exportedAt: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    defaults: getDefaults(user.email),
    templates: [],
    favorites: [],
    source: supabaseEnabled ? "supabase" : "local",
  };

  if (supabaseEnabled && supabase) {
    payload.templates = await fetchCloudTemplates();
    payload.favorites = await fetchFavoriteKeys();
  } else {
    payload.templates = listTemplates(user.email);
  }

  return payload;
}

export type GuestExport = {
  exportedAt: string;
  templates: ReturnType<typeof listTemplates>;
  guestPlanDraft: unknown;
  source: "guest-local";
};

export function exportGuestData(): GuestExport {
  let guestPlanDraft: unknown = null;
  try {
    const raw = localStorage.getItem(GUEST_SAVE_KEY);
    guestPlanDraft = raw ? JSON.parse(raw) : null;
  } catch {
    guestPlanDraft = null;
  }

  return {
    exportedAt: new Date().toISOString(),
    templates: listTemplates(),
    guestPlanDraft,
    source: "guest-local",
  };
}

export function clearGuestLocalData() {
  localStorage.removeItem(GUEST_TEMPLATES_KEY);
  localStorage.removeItem(GUEST_SAVE_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function clearSignedInLocalData(email: string) {
  localStorage.removeItem(templatesStorageKey(email));
  localStorage.removeItem(defaultsStorageKey(email));
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(DEMO_USERS_KEY);
}

export async function deleteSignedInAccount(
  user: ClinicianUser,
  supabaseEnabled: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (supabaseEnabled && supabase) {
    const { error: rpcError } = await supabase.rpc("delete_own_account");
    if (rpcError) {
      await supabase.from("plan_templates").delete().not("id", "is", null);
      await supabase.from("favorite_resources").delete().not("id", "is", null);
      const { error: signOutError } = await supabase.auth.signOut();
      clearSignedInLocalData(user.email);
      if (signOutError) return { ok: false, error: signOutError.message };
      return {
        ok: false,
        error:
          "Your cloud library was removed and you were signed out. Full auth account removal may need a database update — contact us if you can still sign in.",
      };
    }
    await supabase.auth.signOut();
    clearSignedInLocalData(user.email);
    return { ok: true };
  }

  clearSignedInLocalData(user.email);
  return { ok: true };
}
