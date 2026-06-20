# Phase 4 setup — Supabase auth + scaffold library

PsychDispo works fully in **guest mode** without Supabase. Add these steps when you want cloud-synced plan templates and OAuth sign-in.

## 1. Create a Supabase project

1. Sign in at [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 2. Local environment

```bash
cp .env.example .env
# Edit .env with your URL and anon key
```

Never commit `.env` or real keys.

## 3. Run the migration

Apply `supabase/migrations/20260620120000_phase4_templates.sql` to your project:

**Option A — Supabase Dashboard:** SQL Editor → paste migration → Run.

**Option B — Supabase CLI:**

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Tables created:

- `plan_templates` — scaffold JSON only (pathway, flags, resource selections; no patient fields)
- `favorite_resources` — `resource_key` per user

RLS policies scope all rows to `auth.uid()`.

## 4. Configure Auth providers

In **Authentication → URL Configuration**, set:

- **Site URL:** your app origin (e.g. `http://localhost:5173` or production URL)
- **Redirect URLs:** add `http://localhost:5173/auth/callback` and your production `/auth/callback`

### Magic link (email OTP)

Enabled by default. Customize email templates under **Authentication → Email Templates** if needed.

### Google OAuth (optional)

1. **Authentication → Providers → Google** → enable.
2. Add Google OAuth client ID/secret from Google Cloud Console.
3. Authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`

## 5. Verify

1. `npm run dev` with `.env` populated.
2. Sign in at `/sign-in` via magic link or Google.
3. Complete a disposition plan → **Save as template** on Deliver.
4. Open **My plans** — template should appear (loaded from Supabase when signed in).

## Guest vs signed-in

| Feature | Guest | Signed in (no Supabase) | Signed in + Supabase |
|--------|-------|-------------------------|----------------------|
| Full disposition workflow | ✓ | ✓ | ✓ |
| Save plan (full state) | localStorage | localStorage | localStorage |
| Save as template | localStorage guest key | localStorage per email | Supabase `plan_templates` |
| Magic link / Google | — | demo localStorage only | Supabase Auth |
| PHI on server | Never | Never | Never |

Patient details never leave the device. Templates strip ZIP, names, notes, and follow-up specifics before save.
