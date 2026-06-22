-- Output Studio working drafts — physician-private, user-owned.
-- Matches remote table created via SQL Editor; idempotent for local/CI apply.

CREATE TABLE IF NOT EXISTS public.output_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  document_type text NOT NULL,
  audience_lens text,
  status text NOT NULL DEFAULT 'working_draft',
  draft_body text NOT NULL,
  section_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  evidence_payload jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS output_drafts_user_id_updated_at_idx
  ON public.output_drafts (user_id, updated_at DESC);
ALTER TABLE public.output_drafts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users select own output_drafts" ON public.output_drafts;
CREATE POLICY "Users select own output_drafts"
  ON public.output_drafts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users insert own output_drafts" ON public.output_drafts;
CREATE POLICY "Users insert own output_drafts"
  ON public.output_drafts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own output_drafts" ON public.output_drafts;
CREATE POLICY "Users update own output_drafts"
  ON public.output_drafts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users delete own output_drafts" ON public.output_drafts;
CREATE POLICY "Users delete own output_drafts"
  ON public.output_drafts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
DROP TRIGGER IF EXISTS update_output_drafts_updated_at ON public.output_drafts;
CREATE TRIGGER update_output_drafts_updated_at
  BEFORE UPDATE ON public.output_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
COMMENT ON TABLE public.output_drafts IS
  'Output Studio working drafts — evidence-backed bullets only; not confirmed evidence.';
