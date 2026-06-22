-- Output Studio career artifacts — per evidence unit + output type; physician-private.
-- v0b persistence: working copy only; never mutates evidence_units.

CREATE TABLE IF NOT EXISTS public.output_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evidence_unit_id uuid NOT NULL REFERENCES public.evidence_units(id) ON DELETE CASCADE,
  output_type text NOT NULL,
  generated_text text NOT NULL,
  edited_text text,
  display_text text NOT NULL,
  source_quote_excerpt text NOT NULL DEFAULT '',
  template_version text NOT NULL DEFAULT 'v0a-2026-06',
  pattern_bucket_id text,
  lattice_labels jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT output_artifacts_output_type_check CHECK (
    output_type IN ('cv_bullet', 'review_sentence', 'mentorship_reflection', 'bio_sentence')
  ),
  CONSTRAINT output_artifacts_user_evidence_type_unique UNIQUE (user_id, evidence_unit_id, output_type)
);

CREATE INDEX IF NOT EXISTS output_artifacts_user_id_updated_at_idx
  ON public.output_artifacts (user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS output_artifacts_user_evidence_idx
  ON public.output_artifacts (user_id, evidence_unit_id);

ALTER TABLE public.output_artifacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own output_artifacts" ON public.output_artifacts;
CREATE POLICY "Users select own output_artifacts"
  ON public.output_artifacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own output_artifacts" ON public.output_artifacts;
CREATE POLICY "Users insert own output_artifacts"
  ON public.output_artifacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own output_artifacts" ON public.output_artifacts;
CREATE POLICY "Users update own output_artifacts"
  ON public.output_artifacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own output_artifacts" ON public.output_artifacts;
CREATE POLICY "Users delete own output_artifacts"
  ON public.output_artifacts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_output_artifacts_updated_at ON public.output_artifacts;
CREATE TRIGGER update_output_artifacts_updated_at
  BEFORE UPDATE ON public.output_artifacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.output_artifacts IS
  'Output Studio career artifacts — working drafts from confirmed evidence; not evidence bank rows.';;
