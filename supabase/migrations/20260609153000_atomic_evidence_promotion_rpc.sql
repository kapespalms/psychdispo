-- Atomic evidence promotion RPC.
-- Single transaction: evidence_units + evidence_cell_weights + candidate_evidence confirm.
-- Aligns with promote-to-evidence.ts; TS validates before call; RPC persists atomically.
--
-- Draft for founder review. Do not assume adapters until applied and types regenerated.

-- -----------------------------------------------------------------------------
-- Source reliability (mirrors SOURCE_RELIABILITY in types.ts)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.spine_source_reliability(p_source_type public.spine_source_type)
RETURNS numeric(4, 3)
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE p_source_type
    WHEN 'manual_entry' THEN 1.000
    WHEN 'mak_conversation' THEN 0.600
    WHEN 'cv_upload' THEN 0.500
    WHEN 'document_upload' THEN 0.500
    WHEN 'pulse' THEN 0.400
    WHEN 'daily_capture' THEN 0.600
    WHEN 'voice_note' THEN 0.600
    WHEN 'instrument' THEN 0.500
    WHEN 'schedule_import' THEN 0.500
    ELSE 0.500
  END;
$$;
REVOKE EXECUTE ON FUNCTION public.spine_source_reliability(public.spine_source_type) FROM PUBLIC, anon;
-- -----------------------------------------------------------------------------
-- promote_candidate_to_evidence
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.promote_candidate_to_evidence(
  p_candidate_id uuid,
  p_raw_capture_id uuid,
  p_source_artifact_id uuid,
  p_claim_text text,
  p_source_quote text,
  p_career_stage public.spine_career_stage,
  p_specialty text DEFAULT NULL,
  p_subspecialty text DEFAULT NULL,
  p_cell_weights jsonb DEFAULT NULL,
  p_confirmed_at timestamptz DEFAULT now(),
  p_review_note text DEFAULT NULL
)
RETURNS TABLE (
  evidence_unit_id uuid,
  cell_weight_ids uuid[]
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_candidate public.candidate_evidence%ROWTYPE;
  v_artifact public.source_artifacts%ROWTYPE;
  v_capture public.raw_captures%ROWTYPE;
  v_unit_id uuid;
  v_weight_ids uuid[] := '{}'::uuid[];
  v_quote text;
  v_claim text;
  v_cell jsonb;
  v_skill_index integer;
  v_domain_index integer;
  v_weight numeric(5, 4);
  v_cell_quad public.spine_recognition_quadrant;
  v_weight_id uuid;
  v_cell_count integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated: Authentication required';
  END IF;

  -- Lock candidate row for duration of promotion (prevents double-promote races).
  SELECT *
  INTO v_candidate
  FROM public.candidate_evidence
  WHERE id = p_candidate_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'candidate_not_found: Candidate evidence not found';
  END IF;

  IF v_candidate.user_id IS DISTINCT FROM v_user_id THEN
    RAISE EXCEPTION 'candidate_not_found: Candidate evidence not found';
  END IF;

  IF v_candidate.status IS DISTINCT FROM 'pending' THEN
    RAISE EXCEPTION 'candidate_not_pending: Candidate status must be pending';
  END IF;

  IF v_candidate.raw_capture_id IS DISTINCT FROM p_raw_capture_id THEN
    RAISE EXCEPTION 'raw_capture_not_found: Candidate raw capture mismatch';
  END IF;

  IF v_candidate.source_artifact_id IS NOT NULL
    AND v_candidate.source_artifact_id IS DISTINCT FROM p_source_artifact_id THEN
    RAISE EXCEPTION 'source_artifact_not_found: Candidate source artifact mismatch';
  END IF;

  SELECT *
  INTO v_artifact
  FROM public.source_artifacts
  WHERE id = p_source_artifact_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'source_artifact_not_found: Source artifact not found';
  END IF;

  IF v_artifact.user_id IS DISTINCT FROM v_user_id THEN
    RAISE EXCEPTION 'source_artifact_not_found: Source artifact not found';
  END IF;

  IF v_artifact.deleted_at IS NOT NULL THEN
    RAISE EXCEPTION 'source_artifact_not_found: Source artifact is deleted';
  END IF;

  IF public.spine_artifact_is_non_evidence(COALESCE(v_artifact.metadata, '{}'::jsonb)) THEN
    RAISE EXCEPTION 'source_artifact_not_allowed: Reference or template artifacts cannot produce evidence';
  END IF;

  SELECT *
  INTO v_capture
  FROM public.raw_captures
  WHERE id = p_raw_capture_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'raw_capture_not_found: Raw capture not found';
  END IF;

  IF v_capture.user_id IS DISTINCT FROM v_user_id THEN
    RAISE EXCEPTION 'raw_capture_not_found: Raw capture not found';
  END IF;

  IF v_capture.source_artifact_id IS NOT NULL
    AND v_capture.source_artifact_id IS DISTINCT FROM p_source_artifact_id THEN
    RAISE EXCEPTION 'raw_capture_source_mismatch: Raw capture must belong to the source artifact';
  END IF;

  v_quote := trim(p_source_quote);
  v_claim := trim(p_claim_text);

  IF char_length(v_quote) < 10 THEN
    RAISE EXCEPTION 'source_quote_invalid: Source quote must be at least 10 characters';
  END IF;

  IF char_length(v_claim) < 1 THEN
    RAISE EXCEPTION 'source_quote_invalid: Claim text is required';
  END IF;

  IF position(lower(v_quote) IN lower(trim(v_capture.sanitized_text))) = 0 THEN
    RAISE EXCEPTION 'source_quote_invalid: Source quote must appear in sanitized capture text';
  END IF;

  IF p_cell_weights IS NULL
    OR jsonb_typeof(p_cell_weights) <> 'array'
    OR jsonb_array_length(p_cell_weights) < 1 THEN
    RAISE EXCEPTION 'cell_weights_required: At least one cell weight is required';
  END IF;

  v_cell_count := jsonb_array_length(p_cell_weights);
  IF v_cell_count > 4 THEN
    RAISE EXCEPTION 'cell_weight_invalid: At most four cell weights are allowed';
  END IF;

  -- p_review_note accepted for API parity; audit persistence deferred (no audit_log table v1).
  PERFORM p_review_note;

  v_unit_id := gen_random_uuid();

  INSERT INTO public.evidence_units (
    id,
    user_id,
    candidate_id,
    source_quote,
    sanitized_text,
    source_type,
    source_artifact_id,
    raw_capture_id,
    source_reliability,
    recognition_quadrant,
    energy_tag,
    energy_score,
    career_stage,
    specialty,
    subspecialty,
    occurred_at,
    captured_at,
    confirmed_at,
    physician_confirmed,
    visibility_scope,
    formula_version,
    ontology_version
  )
  VALUES (
    v_unit_id,
    v_user_id,
    p_candidate_id,
    v_quote,
    v_claim,
    v_capture.source_type,
    p_source_artifact_id,
    p_raw_capture_id,
    public.spine_source_reliability(v_capture.source_type),
    v_candidate.suggested_recognition_quadrant,
    v_candidate.suggested_energy_tag,
    v_candidate.suggested_energy_score,
    p_career_stage,
    p_specialty,
    p_subspecialty,
    v_capture.occurred_at,
    v_capture.captured_at,
    p_confirmed_at,
    true,
    'physician_private',
    'fiscmak-v1',
    'fiscmak-ontology-v1'
  );

  FOR v_cell IN
    SELECT value
    FROM jsonb_array_elements(p_cell_weights)
  LOOP
    IF jsonb_typeof(v_cell) <> 'object' THEN
      RAISE EXCEPTION 'cell_weight_invalid: Each cell weight must be a JSON object';
    END IF;

    BEGIN
      v_skill_index := (v_cell ->> 'skill_index')::integer;
      v_domain_index := (v_cell ->> 'domain_index')::integer;
      v_weight := (v_cell ->> 'weight')::numeric(5, 4);
    EXCEPTION
      WHEN OTHERS THEN
        RAISE EXCEPTION 'cell_weight_invalid: Cell weight fields must be numeric';
    END;

    IF v_skill_index IS NULL OR v_domain_index IS NULL OR v_weight IS NULL THEN
      RAISE EXCEPTION 'cell_weight_invalid: skill_index, domain_index, and weight are required';
    END IF;

    IF v_skill_index < 0 OR v_skill_index > 7 OR v_domain_index < 0 OR v_domain_index > 7 THEN
      RAISE EXCEPTION 'cell_weight_invalid: skill_index and domain_index must be between 0 and 7';
    END IF;

    IF v_weight <= 0 OR v_weight > 1 THEN
      RAISE EXCEPTION 'cell_weight_invalid: weight must be greater than 0 and at most 1';
    END IF;

    IF v_cell ? 'recognition_quadrant' AND v_cell ->> 'recognition_quadrant' IS NOT NULL THEN
      BEGIN
        v_cell_quad := (v_cell ->> 'recognition_quadrant')::public.spine_recognition_quadrant;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE EXCEPTION 'cell_weight_invalid: recognition_quadrant is invalid';
      END;
    ELSE
      v_cell_quad := v_candidate.suggested_recognition_quadrant;
    END IF;

    v_weight_id := gen_random_uuid();

    INSERT INTO public.evidence_cell_weights (
      id,
      evidence_unit_id,
      user_id,
      skill_index,
      domain_index,
      weight,
      recognition_quadrant
    )
    VALUES (
      v_weight_id,
      v_unit_id,
      v_user_id,
      v_skill_index,
      v_domain_index,
      v_weight,
      v_cell_quad
    );

    v_weight_ids := array_append(v_weight_ids, v_weight_id);
  END LOOP;

  UPDATE public.candidate_evidence
  SET
    status = 'confirmed',
    evidence_unit_id = v_unit_id,
    source_quote = v_quote,
    sanitized_text = v_claim,
    reviewed_at = p_confirmed_at,
    updated_at = now()
  WHERE id = p_candidate_id
    AND user_id = v_user_id
    AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'candidate_not_pending: Candidate status must be pending';
  END IF;

  evidence_unit_id := v_unit_id;
  cell_weight_ids := v_weight_ids;
  RETURN NEXT;
END;
$$;
COMMENT ON FUNCTION public.promote_candidate_to_evidence IS
  'Atomically promotes pending candidate_evidence to confirmed evidence_units + evidence_cell_weights. '
  'Call only after promoteCandidateToEvidence() passes in application layer. SECURITY INVOKER — RLS applies.';
REVOKE EXECUTE ON FUNCTION public.promote_candidate_to_evidence(
  uuid,
  uuid,
  uuid,
  text,
  text,
  public.spine_career_stage,
  text,
  text,
  jsonb,
  timestamptz,
  text
) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.promote_candidate_to_evidence(
  uuid,
  uuid,
  uuid,
  text,
  text,
  public.spine_career_stage,
  text,
  text,
  jsonb,
  timestamptz,
  text
) TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_candidate_to_evidence(
  uuid,
  uuid,
  uuid,
  text,
  text,
  public.spine_career_stage,
  text,
  text,
  jsonb,
  timestamptz,
  text
) TO service_role;
