# Phase 4 setup — Supabase auth + scaffold library

PsychDispo works fully in **guest mode** without Supabase. Add these steps when you want cloud-synced plan templates and OAuth sign-in.

## Wired project (2026-06-20)

| Item | Value |
|------|-------|
| **Project ref** | `kqvpptcmnaeqvmlxlvba` |
| **Project URL** | `https://kqvpptcmnaeqvmlxlvba.supabase.co` |
| **Migration** | `phase4_templates` applied via MCP (`plan_templates`, `favorite_resources`, RLS) |
| **Local env** | `.env.local` created (gitignored; not committed) |

## 1. Environment variables

### Local development

`.env.local` is already wired with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Vite loads `.env.local` automatically.

To recreate from scratch:

```bash
cp .env.example .env.local
# Edit .env.local with values from Supabase → Project Settings → API
```

Never commit `.env`, `.env.local`, or real keys.

### Vercel (production)

**Status (2026-06-20):** Production env vars are set on `fiscmak/psychdispo-caringcompass` via Vercel CLI:

| Name | Production |
|------|------------|
| `VITE_SUPABASE_URL` | Encrypted (matches `https://kqvpptcmnaeqvmlxlvba.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Encrypted (from Supabase → Project Settings → API) |

Add or rotate via CLI (values from `.env.local`, never echo keys in logs):

```bash
cd psychdispo
set -a && source .env.local && set +a
npx vercel env add VITE_SUPABASE_URL production --value "$VITE_SUPABASE_URL" --yes --force
npx vercel env add VITE_SUPABASE_ANON_KEY production --value "$VITE_SUPABASE_ANON_KEY" --yes --force
npx vercel deploy --prod --yes
```

Preview/Development: add the same names in Vercel if you want Supabase on preview deployments.

## 2. Database migration

Migration `supabase/migrations/20260620120000_phase4_templates.sql` has been applied to project `kqvpptcmnaeqvmlxlvba`.

Tables created:

- `plan_templates` — scaffold JSON only (pathway, flags, resource selections; no patient fields)
- `favorite_resources` — `resource_key` per user

RLS policies scope all rows to `auth.uid()`.

To re-apply on another project:

**Option A — Supabase Dashboard:** SQL Editor → paste migration → Run.

**Option B — Supabase CLI:**

```bash
supabase link --project-ref your-project-ref
supabase db push
```

## 3. Auth configuration (Supabase Dashboard — required for magic link/OAuth)

Supabase MCP has no tool for auth URL configuration (only database, logs, keys, etc.). Set redirects in the Supabase Dashboard for project `kqvpptcmnaeqvmlxlvba` (or use the [Management API](https://supabase.com/docs/reference/api/update-auth-config) with a personal access token):

### URL configuration

**Authentication → URL Configuration:**

| Setting | Value |
|---------|-------|
| **Site URL** | `https://psychdispo.com` (production) or `http://localhost:5173` (local dev) |
| **Redirect URLs** | `http://localhost:5173/auth/callback` |
| | `https://psychdispo.com/auth/callback` |

### Magic link (email OTP)

Enabled by default. Customize email templates under **Authentication → Email Templates** if needed (subject line, confirmation link text).

### Google OAuth (optional)

1. **Authentication → Providers → Google** → enable.
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5173`, `https://psychdispo.com`
   - Authorized redirect URI: `https://kqvpptcmnaeqvmlxlvba.supabase.co/auth/v1/callback`
3. Paste Client ID and Client Secret into Supabase Google provider settings.

## 4. Verify

1. `npm run build` — should succeed with `.env.local` present.
2. `npm run dev` with `.env.local` populated.
3. Sign in at `/sign-in` via magic link or Google.
4. Complete a disposition plan → **Save as template** on Deliver.
5. Open **My plans** — template should appear (loaded from Supabase when signed in).


## Phase 4 production checklist

| Step | Status | Notes |
|------|--------|-------|
| Local `.env.local` with `VITE_SUPABASE_*` | Done | Gitignored |
| Migration `phase4_templates` on `kqvpptcmnaeqvmlxlvba` | Done | MCP |
| Vercel Production `VITE_SUPABASE_URL` | Done | CLI 2026-06-20 |
| Vercel Production `VITE_SUPABASE_ANON_KEY` | Done | CLI 2026-06-20 |
| Production redeploy | Done | `vercel deploy --prod` |
| `https://psychdispo.com/sign-in` returns 200 | Done | Magic link button enabled when env present |
| Supabase **Site URL** = `https://psychdispo.com` | **Manual** | Authentication → URL Configuration |
| Redirect URLs (localhost + production callback) | **Manual** | See table in §3 |
| Google OAuth (optional) | Optional | §3 |

## Guest vs signed-in

| Feature | Guest | Signed in (no Supabase) | Signed in + Supabase |
|--------|-------|-------------------------|----------------------|
| Full disposition workflow | ✓ | ✓ | ✓ |
| Save plan (full state) | localStorage | localStorage | localStorage |
| Save as template | localStorage guest key | localStorage per email | Supabase `plan_templates` |
| Magic link / Google | — | demo localStorage only | Supabase Auth |
| PHI on server | Never | Never | Never |

Patient details never leave the device. Templates strip ZIP, names, notes, and follow-up specifics before save.
