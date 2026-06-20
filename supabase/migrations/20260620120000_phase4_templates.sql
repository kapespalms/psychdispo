-- Phase 4: scaffold-only plan templates + favorite resources (no PHI columns)

create table if not exists public.plan_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  scaffold_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorite_resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  resource_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, resource_key)
);

create index if not exists plan_templates_user_id_idx on public.plan_templates (user_id);
create index if not exists favorite_resources_user_id_idx on public.favorite_resources (user_id);

alter table public.plan_templates enable row level security;
alter table public.favorite_resources enable row level security;

create policy "plan_templates_select_own"
  on public.plan_templates for select
  using (auth.uid() = user_id);

create policy "plan_templates_insert_own"
  on public.plan_templates for insert
  with check (auth.uid() = user_id);

create policy "plan_templates_update_own"
  on public.plan_templates for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "plan_templates_delete_own"
  on public.plan_templates for delete
  using (auth.uid() = user_id);

create policy "favorite_resources_select_own"
  on public.favorite_resources for select
  using (auth.uid() = user_id);

create policy "favorite_resources_insert_own"
  on public.favorite_resources for insert
  with check (auth.uid() = user_id);

create policy "favorite_resources_delete_own"
  on public.favorite_resources for delete
  using (auth.uid() = user_id);
