import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { PlanTemplate } from "@/lib/templates";

type PlanTemplateRow = {
  id: string;
  user_id: string;
  name: string;
  scaffold_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

function rowToTemplate(row: PlanTemplateRow): PlanTemplate {
  return {
    id: row.id,
    name: row.name,
    type: "clinical",
    scaffold: row.scaffold_json,
    updatedAt: row.updated_at,
  };
}

export async function fetchCloudTemplates(): Promise<PlanTemplate[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("plan_templates")
    .select("id, user_id, name, scaffold_json, created_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as PlanTemplateRow[]).map(rowToTemplate);
}

export async function saveCloudTemplate(
  name: string,
  scaffold: Record<string, unknown>,
  existingId?: string,
): Promise<PlanTemplate> {
  if (!supabase) throw new Error("Supabase is not configured");
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not signed in");

  const trimmed = name.trim() || "Untitled template";
  const now = new Date().toISOString();

  if (existingId) {
    const { data, error } = await supabase
      .from("plan_templates")
      .update({ name: trimmed, scaffold_json: scaffold, updated_at: now })
      .eq("id", existingId)
      .select("id, user_id, name, scaffold_json, created_at, updated_at")
      .single();
    if (error) throw error;
    return rowToTemplate(data as PlanTemplateRow);
  }

  const { data, error } = await supabase
    .from("plan_templates")
    .insert({ user_id: user.id, name: trimmed, scaffold_json: scaffold })
    .select("id, user_id, name, scaffold_json, created_at, updated_at")
    .single();
  if (error) throw error;
  return rowToTemplate(data as PlanTemplateRow);
}

export async function deleteCloudTemplate(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("plan_templates").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchFavoriteKeys(): Promise<string[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("favorite_resources")
    .select("resource_key")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => row.resource_key as string);
}

export async function addFavoriteKey(resourceKey: string): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not signed in");
  const { error } = await supabase
    .from("favorite_resources")
    .upsert(
      { user_id: user.id, resource_key: resourceKey },
      { onConflict: "user_id,resource_key" },
    );
  if (error) throw error;
}

export async function removeFavoriteKey(resourceKey: string): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase
    .from("favorite_resources")
    .delete()
    .eq("resource_key", resourceKey);
  if (error) throw error;
}

export function cloudLibraryEnabled(): boolean {
  return isSupabaseConfigured();
}
