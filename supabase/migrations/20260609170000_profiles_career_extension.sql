-- Extend public.profiles for FISCMAK physician career profile persistence.
--
-- profile_data: JSONB blob for evolving onboarding/profile fields (role mix,
--   affiliations, considering paths, document metadata, etc.). Not normalized yet.
-- localStorage in the client is a cache/fallback only — this table is source of truth.
-- Private physician profile: user-owned via existing RLS (auth.uid() = id).
-- No institution visibility columns or policies added here.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS profile_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS career_stage text,
  ADD COLUMN IF NOT EXISTS specialty text,
  ADD COLUMN IF NOT EXISTS subspecialty text,
  ADD COLUMN IF NOT EXISTS practice_setting text;
COMMENT ON COLUMN public.profiles.profile_data IS
  'Evolving FISCMAK career profile fields (JSON). Source of truth — not browser localStorage.';
COMMENT ON COLUMN public.profiles.onboarding_completed_at IS
  'When the physician finished onboarding; null if incomplete. Does not block app access.';
COMMENT ON COLUMN public.profiles.career_stage IS
  'Denormalized career stage (e.g. resident, fellow) for dashboard and promotion context.';
COMMENT ON COLUMN public.profiles.specialty IS
  'Primary specialty label; denormalized from profile_data for quick reads.';
COMMENT ON COLUMN public.profiles.subspecialty IS
  'Primary subspecialty label; denormalized from profile_data for quick reads.';
COMMENT ON COLUMN public.profiles.practice_setting IS
  'Practice setting label (Academic, Community, etc.); denormalized from profile_data.';
