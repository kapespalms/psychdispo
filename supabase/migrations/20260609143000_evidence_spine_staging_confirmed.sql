-- FISCMAK evidence spine: staging (source_artifacts → raw_captures → candidate_evidence)
-- and confirmed bank (evidence_units → evidence_cell_weights).
--
-- Draft for founder review. Aligns with src/lib/spine/types.ts and promote-to-evidence.ts.
-- Does NOT modify profiles or auth triggers.

-- -----------------------------------------------------------------------------
-- ENUM types
-- -----------------------------------------------------------------------------

CREATE TYPE public.spine_source_type AS ENUM (
  'daily_capture',
  'voice_note',
  'document_upload',
  'cv_upload',
  'manual_entry',
  'mak_conversation',
  'instrument',
  'pulse',
  'schedule_import'
);
CREATE TYPE public.spine_source_artifact_type AS ENUM (
  'voice',
  'document',
  'cv',
  'capture_session',
  'transcript'
);
CREATE TYPE public.spine_capture_lane AS ENUM (
  'career_item',
  'invisible_energy',
  'patient_volume',
  'hours',
  'goal',
  'career_direction',
  'none'
);
-- pending = inbox; confirmed = promoted to evidence (conceptual); discarded/skipped = closed without bank entry
CREATE TYPE public.spine_candidate_status AS ENUM (
  'pending',
  'confirmed',
  'discarded',
  'skipped'
);
CREATE TYPE public.spine_recognition_quadrant AS ENUM (
  'OI',
  'SI',
  'OV',
  'SV'
);
CREATE TYPE public.spine_energy_tag AS ENUM (
  'energizing',
  'neutral',
  'draining',
  'mixed_unclear'
);
CREATE TYPE public.spine_triage_band AS ENUM (
  'confident',
  'needs_review',
  'unclassified'
);
CREATE TYPE public.spine_career_stage AS ENUM (
  'medical_student',
  'resident',
  'fellow',
  'early_attending',
  'mid_career',
  'legacy'
);
CREATE TYPE public.spine_visibility_scope AS ENUM (
  'physician_private',
  'trainee_program_shared',
  'institution_pushed',
  'aggregate_only'
);
-- -----------------------------------------------------------------------------
-- Helper: non-evidence source artifact detection (mirrors promote-to-evidence.ts)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.spine_artifact_is_non_evidence(metadata jsonb)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (metadata->>'is_physician_evidence')::boolean IS FALSE
    OR (metadata->>'reference_library')::boolean IS TRUE
    OR (metadata->>'is_reference_document')::boolean IS TRUE
    OR metadata->>'document_class' = 'reference_library'
    OR (
      metadata ? 'reference_document_type'
      AND jsonb_typeof(metadata->'reference_document_type') = 'string'
    )
    OR (
      metadata ? 'reference_document_id'
      AND jsonb_typeof(metadata->'reference_document_id') = 'string'
    )
    OR (metadata->>'application_requirement')::boolean IS TRUE
    OR (metadata->>'template_only')::boolean IS TRUE
    OR (metadata->>'is_application_template')::boolean IS TRUE
    OR metadata->>'document_class' IN (
      'application_template',
      'institutional_template',
      'application_requirement'
    ),
    false
  );
$$;
REVOKE EXECUTE ON FUNCTION public.spine_artifact_is_non_evidence(jsonb) FROM PUBLIC, anon;
-- -----------------------------------------------------------------------------
-- Helper: enforce child user_id matches parent owner
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.spine_enforce_raw_capture_user_id()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  artifact_owner uuid;
BEGIN
  IF NEW.source_artifact_id IS NOT NULL THEN
    SELECT user_id INTO artifact_owner
    FROM public.source_artifacts
    WHERE id = NEW.source_artifact_id;

    IF artifact_owner IS NULL THEN
      RAISE EXCEPTION 'source_artifact_id % not found', NEW.source_artifact_id;
    END IF;

    IF NEW.user_id IS DISTINCT FROM artifact_owner THEN
      RAISE EXCEPTION 'raw_captures.user_id must match source_artifacts.user_id';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION public.spine_enforce_candidate_evidence_user_id()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  capture_owner uuid;
  artifact_owner uuid;
BEGIN
  SELECT user_id INTO capture_owner
  FROM public.raw_captures
  WHERE id = NEW.raw_capture_id;

  IF capture_owner IS NULL THEN
    RAISE EXCEPTION 'raw_capture_id % not found', NEW.raw_capture_id;
  END IF;

  IF NEW.user_id IS DISTINCT FROM capture_owner THEN
    RAISE EXCEPTION 'candidate_evidence.user_id must match raw_captures.user_id';
  END IF;

  IF NEW.source_artifact_id IS NOT NULL THEN
    SELECT user_id INTO artifact_owner
    FROM public.source_artifacts
    WHERE id = NEW.source_artifact_id;

    IF artifact_owner IS NULL THEN
      RAISE EXCEPTION 'source_artifact_id % not found', NEW.source_artifact_id;
    END IF;

    IF NEW.user_id IS DISTINCT FROM artifact_owner THEN
      RAISE EXCEPTION 'candidate_evidence.user_id must match source_artifacts.user_id';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION public.spine_enforce_evidence_unit_user_id()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  parent_owner uuid;
BEGIN
  IF NEW.candidate_id IS NOT NULL THEN
    SELECT user_id INTO parent_owner
    FROM public.candidate_evidence
    WHERE id = NEW.candidate_id;

    IF parent_owner IS NULL THEN
      RAISE EXCEPTION 'candidate_id % not found', NEW.candidate_id;
    END IF;

    IF NEW.user_id IS DISTINCT FROM parent_owner THEN
      RAISE EXCEPTION 'evidence_units.user_id must match candidate_evidence.user_id';
    END IF;
  END IF;

  IF NEW.raw_capture_id IS NOT NULL THEN
    SELECT user_id INTO parent_owner
    FROM public.raw_captures
    WHERE id = NEW.raw_capture_id;

    IF parent_owner IS NULL THEN
      RAISE EXCEPTION 'raw_capture_id % not found', NEW.raw_capture_id;
    END IF;

    IF NEW.user_id IS DISTINCT FROM parent_owner THEN
      RAISE EXCEPTION 'evidence_units.user_id must match raw_captures.user_id';
    END IF;
  END IF;

  IF NEW.source_artifact_id IS NOT NULL THEN
    SELECT user_id INTO parent_owner
    FROM public.source_artifacts
    WHERE id = NEW.source_artifact_id;

    IF parent_owner IS NULL THEN
      RAISE EXCEPTION 'source_artifact_id % not found', NEW.source_artifact_id;
    END IF;

    IF NEW.user_id IS DISTINCT FROM parent_owner THEN
      RAISE EXCEPTION 'evidence_units.user_id must match source_artifacts.user_id';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION public.spine_enforce_cell_weight_user_id()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  unit_owner uuid;
BEGIN
  SELECT user_id INTO unit_owner
  FROM public.evidence_units
  WHERE id = NEW.evidence_unit_id;

  IF unit_owner IS NULL THEN
    RAISE EXCEPTION 'evidence_unit_id % not found', NEW.evidence_unit_id;
  END IF;

  IF NEW.user_id IS DISTINCT FROM unit_owner THEN
    RAISE EXCEPTION 'evidence_cell_weights.user_id must match evidence_units.user_id';
  END IF;

  RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION public.spine_prevent_evidence_from_non_evidence_artifact()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  artifact_metadata jsonb;
BEGIN
  IF NEW.source_artifact_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT metadata INTO artifact_metadata
  FROM public.source_artifacts
  WHERE id = NEW.source_artifact_id;

  IF public.spine_artifact_is_non_evidence(COALESCE(artifact_metadata, '{}'::jsonb)) THEN
    RAISE EXCEPTION 'reference or template artifacts cannot produce evidence_units';
  END IF;

  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.spine_enforce_raw_capture_user_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.spine_enforce_candidate_evidence_user_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.spine_enforce_evidence_unit_user_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.spine_enforce_cell_weight_user_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.spine_prevent_evidence_from_non_evidence_artifact() FROM PUBLIC, anon;
-- -----------------------------------------------------------------------------
-- 1. source_artifacts
-- -----------------------------------------------------------------------------

CREATE TABLE public.source_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  artifact_type public.spine_source_artifact_type NOT NULL,
  source_type public.spine_source_type NOT NULL,
  storage_path text,
  file_name text,
  mime_type text,
  sha256 text,
  captured_at timestamptz NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX source_artifacts_user_id_idx ON public.source_artifacts (user_id);
CREATE INDEX source_artifacts_user_active_idx ON public.source_artifacts (user_id)
  WHERE deleted_at IS NULL;
CREATE TRIGGER update_source_artifacts_updated_at
  BEFORE UPDATE ON public.source_artifacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- -----------------------------------------------------------------------------
-- 2. raw_captures
-- -----------------------------------------------------------------------------

CREATE TABLE public.raw_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  source_artifact_id uuid REFERENCES public.source_artifacts (id) ON DELETE SET NULL,
  sanitized_text text NOT NULL,
  capture_lane public.spine_capture_lane NOT NULL DEFAULT 'none',
  source_type public.spine_source_type NOT NULL,
  mak_conversation_id text,
  mak_message_id text,
  occurred_at timestamptz,
  captured_at timestamptz NOT NULL,
  phi_tokens_found text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT raw_captures_sanitized_text_nonempty CHECK (char_length(trim(sanitized_text)) >= 1)
);
CREATE INDEX raw_captures_user_id_idx ON public.raw_captures (user_id);
CREATE INDEX raw_captures_source_artifact_id_idx ON public.raw_captures (source_artifact_id);
CREATE TRIGGER spine_raw_captures_user_id
  BEFORE INSERT OR UPDATE ON public.raw_captures
  FOR EACH ROW EXECUTE FUNCTION public.spine_enforce_raw_capture_user_id();
CREATE TRIGGER update_raw_captures_updated_at
  BEFORE UPDATE ON public.raw_captures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- -----------------------------------------------------------------------------
-- 3. candidate_evidence (evidence_unit_id FK added after evidence_units)
-- -----------------------------------------------------------------------------

CREATE TABLE public.candidate_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  raw_capture_id uuid NOT NULL REFERENCES public.raw_captures (id) ON DELETE RESTRICT,
  source_artifact_id uuid REFERENCES public.source_artifacts (id) ON DELETE SET NULL,
  status public.spine_candidate_status NOT NULL DEFAULT 'pending',
  source_quote text NOT NULL,
  sanitized_text text NOT NULL,
  suggested_label text,
  ontology_term_ids text[] NOT NULL DEFAULT '{}'::text[],
  onet_descriptor_hints jsonb,
  suggested_cells jsonb NOT NULL DEFAULT '[]'::jsonb,
  suggested_energy_tag public.spine_energy_tag,
  suggested_energy_score smallint,
  suggested_recognition_quadrant public.spine_recognition_quadrant NOT NULL,
  confidence_triage numeric,
  triage_band public.spine_triage_band,
  classification_trace jsonb,
  dedup_cluster_id text,
  evidence_unit_id uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT candidate_evidence_source_quote_min_length CHECK (
    char_length(trim(source_quote)) >= 10
  ),
  CONSTRAINT candidate_evidence_sanitized_text_nonempty CHECK (
    char_length(trim(sanitized_text)) >= 1
  ),
  CONSTRAINT candidate_evidence_suggested_cells_is_array CHECK (
    jsonb_typeof(suggested_cells) = 'array'
  ),
  CONSTRAINT candidate_evidence_energy_score_range CHECK (
    suggested_energy_score IS NULL
    OR (suggested_energy_score >= 1 AND suggested_energy_score <= 5)
  ),
  CONSTRAINT candidate_evidence_pending_no_unit CHECK (
    status <> 'pending' OR evidence_unit_id IS NULL
  ),
  CONSTRAINT candidate_evidence_confirmed_requires_unit CHECK (
    status <> 'confirmed' OR evidence_unit_id IS NOT NULL
  )
);
CREATE INDEX candidate_evidence_user_id_idx ON public.candidate_evidence (user_id);
CREATE INDEX candidate_evidence_pending_inbox_idx ON public.candidate_evidence (user_id, created_at DESC)
  WHERE status = 'pending';
CREATE INDEX candidate_evidence_raw_capture_id_idx ON public.candidate_evidence (raw_capture_id);
CREATE TRIGGER spine_candidate_evidence_user_id
  BEFORE INSERT OR UPDATE ON public.candidate_evidence
  FOR EACH ROW EXECUTE FUNCTION public.spine_enforce_candidate_evidence_user_id();
CREATE TRIGGER update_candidate_evidence_updated_at
  BEFORE UPDATE ON public.candidate_evidence
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- -----------------------------------------------------------------------------
-- 4. evidence_units
-- -----------------------------------------------------------------------------

CREATE TABLE public.evidence_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  candidate_id uuid REFERENCES public.candidate_evidence (id) ON DELETE SET NULL,
  source_quote text NOT NULL,
  sanitized_text text NOT NULL,
  source_type public.spine_source_type NOT NULL,
  source_artifact_id uuid REFERENCES public.source_artifacts (id) ON DELETE SET NULL,
  raw_capture_id uuid REFERENCES public.raw_captures (id) ON DELETE SET NULL,
  source_reliability numeric(4, 3) NOT NULL,
  recognition_quadrant public.spine_recognition_quadrant NOT NULL,
  energy_tag public.spine_energy_tag,
  energy_score smallint,
  career_stage public.spine_career_stage NOT NULL,
  specialty text,
  subspecialty text,
  occurred_at timestamptz,
  captured_at timestamptz NOT NULL,
  confirmed_at timestamptz NOT NULL,
  physician_confirmed boolean NOT NULL DEFAULT true,
  visibility_scope public.spine_visibility_scope NOT NULL DEFAULT 'physician_private',
  formula_version text NOT NULL,
  ontology_version text NOT NULL,
  confidence_score_internal numeric,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT evidence_units_physician_confirmed_true CHECK (physician_confirmed IS TRUE),
  CONSTRAINT evidence_units_visibility_physician_private CHECK (
    visibility_scope = 'physician_private'
  ),
  CONSTRAINT evidence_units_source_quote_min_length CHECK (
    char_length(trim(source_quote)) >= 10
  ),
  CONSTRAINT evidence_units_sanitized_text_nonempty CHECK (
    char_length(trim(sanitized_text)) >= 1
  ),
  CONSTRAINT evidence_units_source_reliability_range CHECK (
    source_reliability >= 0 AND source_reliability <= 1
  ),
  CONSTRAINT evidence_units_energy_score_range CHECK (
    energy_score IS NULL OR (energy_score >= 1 AND energy_score <= 5)
  )
);
CREATE INDEX evidence_units_user_id_idx ON public.evidence_units (user_id);
CREATE INDEX evidence_units_user_active_idx ON public.evidence_units (user_id, confirmed_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX evidence_units_candidate_id_idx ON public.evidence_units (candidate_id);
CREATE TRIGGER spine_evidence_units_user_id
  BEFORE INSERT OR UPDATE ON public.evidence_units
  FOR EACH ROW EXECUTE FUNCTION public.spine_enforce_evidence_unit_user_id();
CREATE TRIGGER spine_evidence_units_non_evidence_artifact
  BEFORE INSERT OR UPDATE OF source_artifact_id ON public.evidence_units
  FOR EACH ROW EXECUTE FUNCTION public.spine_prevent_evidence_from_non_evidence_artifact();
CREATE TRIGGER update_evidence_units_updated_at
  BEFORE UPDATE ON public.evidence_units
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Deferred FK: candidate → confirmed unit.
-- Promotion transaction order (single txn):
--   1. INSERT evidence_units (candidate_id set; candidate still pending)
--   2. INSERT evidence_cell_weights
--   3. UPDATE candidate_evidence SET status = 'confirmed', evidence_unit_id = ...
ALTER TABLE public.candidate_evidence
  ADD CONSTRAINT candidate_evidence_evidence_unit_id_fkey
  FOREIGN KEY (evidence_unit_id) REFERENCES public.evidence_units (id) ON DELETE SET NULL;
CREATE INDEX candidate_evidence_evidence_unit_id_idx ON public.candidate_evidence (evidence_unit_id);
-- -----------------------------------------------------------------------------
-- 5. evidence_cell_weights
-- -----------------------------------------------------------------------------

CREATE TABLE public.evidence_cell_weights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_unit_id uuid NOT NULL REFERENCES public.evidence_units (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  skill_index smallint NOT NULL,
  domain_index smallint NOT NULL,
  weight numeric(5, 4) NOT NULL,
  recognition_quadrant public.spine_recognition_quadrant NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT evidence_cell_weights_skill_index_range CHECK (
    skill_index >= 0 AND skill_index <= 7
  ),
  CONSTRAINT evidence_cell_weights_domain_index_range CHECK (
    domain_index >= 0 AND domain_index <= 7
  ),
  CONSTRAINT evidence_cell_weights_weight_range CHECK (
    weight > 0 AND weight <= 1
  ),
  CONSTRAINT evidence_cell_weights_unique_cell UNIQUE (evidence_unit_id, skill_index, domain_index)
);
CREATE INDEX evidence_cell_weights_evidence_unit_id_idx ON public.evidence_cell_weights (evidence_unit_id);
CREATE INDEX evidence_cell_weights_user_id_idx ON public.evidence_cell_weights (user_id);
CREATE TRIGGER spine_evidence_cell_weights_user_id
  BEFORE INSERT OR UPDATE ON public.evidence_cell_weights
  FOR EACH ROW EXECUTE FUNCTION public.spine_enforce_cell_weight_user_id();
CREATE TRIGGER update_evidence_cell_weights_updated_at
  BEFORE UPDATE ON public.evidence_cell_weights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- -----------------------------------------------------------------------------
-- Grants (match profiles pattern; no anon access)
-- -----------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.source_artifacts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.raw_captures TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_evidence TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evidence_units TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evidence_cell_weights TO authenticated;
GRANT ALL ON public.source_artifacts TO service_role;
GRANT ALL ON public.raw_captures TO service_role;
GRANT ALL ON public.candidate_evidence TO service_role;
GRANT ALL ON public.evidence_units TO service_role;
GRANT ALL ON public.evidence_cell_weights TO service_role;
REVOKE ALL ON public.source_artifacts FROM anon;
REVOKE ALL ON public.raw_captures FROM anon;
REVOKE ALL ON public.candidate_evidence FROM anon;
REVOKE ALL ON public.evidence_units FROM anon;
REVOKE ALL ON public.evidence_cell_weights FROM anon;
-- -----------------------------------------------------------------------------
-- Row Level Security — physician owns rows via auth.uid() = user_id
-- -----------------------------------------------------------------------------

ALTER TABLE public.source_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_cell_weights ENABLE ROW LEVEL SECURITY;
-- source_artifacts
CREATE POLICY "Physicians select own source_artifacts"
  ON public.source_artifacts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Physicians insert own source_artifacts"
  ON public.source_artifacts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Physicians update own source_artifacts"
  ON public.source_artifacts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Physicians delete own source_artifacts"
  ON public.source_artifacts FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
-- raw_captures
CREATE POLICY "Physicians select own raw_captures"
  ON public.raw_captures FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Physicians insert own raw_captures"
  ON public.raw_captures FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Physicians update own raw_captures"
  ON public.raw_captures FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Physicians delete own raw_captures"
  ON public.raw_captures FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
-- candidate_evidence
CREATE POLICY "Physicians select own candidate_evidence"
  ON public.candidate_evidence FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Physicians insert own candidate_evidence"
  ON public.candidate_evidence FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Physicians update own candidate_evidence"
  ON public.candidate_evidence FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Physicians delete own candidate_evidence"
  ON public.candidate_evidence FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
-- evidence_units
CREATE POLICY "Physicians select own evidence_units"
  ON public.evidence_units FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Physicians insert own evidence_units"
  ON public.evidence_units FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Physicians update own evidence_units"
  ON public.evidence_units FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Physicians delete own evidence_units"
  ON public.evidence_units FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
-- evidence_cell_weights
CREATE POLICY "Physicians select own evidence_cell_weights"
  ON public.evidence_cell_weights FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Physicians insert own evidence_cell_weights"
  ON public.evidence_cell_weights FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Physicians update own evidence_cell_weights"
  ON public.evidence_cell_weights FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Physicians delete own evidence_cell_weights"
  ON public.evidence_cell_weights FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
