-- Expected Work layer (v1): global reference descriptor vocabulary.
--
-- Lane B — founder-approved first Expected Work migration.
-- Creates catalog only. Does NOT touch evidence spine, capture, Output Studio,
-- Career Lattice UI, Career Explorer UI, or profile flows.
--
-- Formula context: Expected Work − Actual Work = Product Signal (one-spine lattice).
-- Actual Work remains evidence_units + evidence_cell_weights (unchanged).

-- -----------------------------------------------------------------------------
-- ENUM: descriptor_source
-- -----------------------------------------------------------------------------

CREATE TYPE public.descriptor_source AS ENUM (
  'onet',
  'riasec',
  'work_values',
  'work_styles',
  'acgme',
  'fiscmak_lattice',
  'specialty_anchor',
  'cmap',
  'oppe'
);
-- -----------------------------------------------------------------------------
-- TABLE: reference_descriptors
-- -----------------------------------------------------------------------------

CREATE TABLE public.reference_descriptors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descriptor_source public.descriptor_source NOT NULL,
  source_code text,
  descriptor_type text NOT NULL,
  label text NOT NULL,
  description text,
  physician_facing_label text,
  physician_facing_description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reference_descriptors_unique_entry UNIQUE NULLS NOT DISTINCT (
    descriptor_source,
    source_code,
    descriptor_type,
    label
  )
);
CREATE INDEX reference_descriptors_source_idx
  ON public.reference_descriptors (descriptor_source);
CREATE INDEX reference_descriptors_active_idx
  ON public.reference_descriptors (descriptor_source, descriptor_type)
  WHERE is_active;
CREATE TRIGGER update_reference_descriptors_updated_at
  BEFORE UPDATE ON public.reference_descriptors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
COMMENT ON TABLE public.reference_descriptors IS
  'Global Expected Work reference vocabulary. Not physician evidence. No user_id. '
  'Feeds future lattice_cell_descriptors and specialty_lattice_profiles.';
COMMENT ON COLUMN public.reference_descriptors.source_code IS
  'Internal stable code (e.g. ACGME PC, fiscmak:skill:0). Never expose raw O*NET/SOC codes in UI.';
COMMENT ON COLUMN public.reference_descriptors.physician_facing_label IS
  'Optional physician-safe display label; falls back to label in application layer.';
-- -----------------------------------------------------------------------------
-- Grants — authenticated read-only; service_role manages seeds/ETL
-- -----------------------------------------------------------------------------

GRANT SELECT ON public.reference_descriptors TO authenticated;
GRANT ALL ON public.reference_descriptors TO service_role;
REVOKE ALL ON public.reference_descriptors FROM anon;
-- -----------------------------------------------------------------------------
-- RLS — authenticated may read active rows only; no writes
-- -----------------------------------------------------------------------------

ALTER TABLE public.reference_descriptors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read active reference_descriptors"
  ON public.reference_descriptors FOR SELECT
  TO authenticated
  USING (is_active = true);
-- No INSERT / UPDATE / DELETE policies for authenticated (default deny).

-- -----------------------------------------------------------------------------
-- Seed: ACGME competency labels (8)
-- -----------------------------------------------------------------------------

INSERT INTO public.reference_descriptors (
  descriptor_source,
  source_code,
  descriptor_type,
  label,
  description,
  physician_facing_label,
  physician_facing_description,
  metadata
) VALUES
  (
    'acgme',
    'PC',
    'competency',
    'Patient Care',
    'ACGME Patient Care competency — clinical care for patients across settings.',
    'Patient Care',
    'Providing compassionate, appropriate, and effective patient care.',
    '{"competency_code":"PC","ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'acgme',
    'MK',
    'competency',
    'Medical Knowledge',
    'ACGME Medical Knowledge competency — biomedical and clinical science application.',
    'Medical Knowledge',
    'Applying established and evolving biomedical and clinical sciences to patient care.',
    '{"competency_code":"MK","ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'acgme',
    'PBLI',
    'competency',
    'Practice-Based Learning and Improvement',
    'ACGME Practice-Based Learning and Improvement competency.',
    'Practice-Based Learning',
    'Investigating and evaluating care, appraising evidence, and improving practice.',
    '{"competency_code":"PBLI","ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'acgme',
    'ICS',
    'competency',
    'Interpersonal and Communication Skills',
    'ACGME Interpersonal and Communication Skills competency.',
    'Communication',
    'Effective information exchange and collaboration with patients, families, and teams.',
    '{"competency_code":"ICS","ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'acgme',
    'PROF',
    'competency',
    'Professionalism',
    'ACGME Professionalism competency.',
    'Professionalism',
    'Commitment to professional responsibilities, ethical practice, and sensitivity.',
    '{"competency_code":"PROF","ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'acgme',
    'SBP',
    'competency',
    'Systems-Based Practice',
    'ACGME Systems-Based Practice competency.',
    'Systems-Based Practice',
    'Awareness of and responsiveness to the larger health care system.',
    '{"competency_code":"SBP","ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'acgme',
    'IPC',
    'competency',
    'Interprofessional Collaboration',
    'ACGME Interprofessional Collaboration competency.',
    'Collaboration & Teamwork',
    'Working effectively in interprofessional teams toward shared goals.',
    '{"competency_code":"IPC","ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'acgme',
    'PPD',
    'competency',
    'Personal and Professional Development',
    'ACGME Personal and Professional Development competency.',
    'Personal & Professional Development',
    'Ongoing self-assessment and lifelong learning for professional growth.',
    '{"competency_code":"PPD","ontology_version":"expected-work-v1"}'::jsonb
  );
-- -----------------------------------------------------------------------------
-- Seed: FISCMAK 8×8 lattice row labels (skill_index 0–7)
-- -----------------------------------------------------------------------------

INSERT INTO public.reference_descriptors (
  descriptor_source,
  source_code,
  descriptor_type,
  label,
  description,
  physician_facing_label,
  metadata
) VALUES
  (
    'fiscmak_lattice',
    'skill:0',
    'skill_row',
    'Clinical Expertise',
    'FISCMAK lattice skill row 0 — clinical expertise and patient care skill.',
    'Clinical Expertise',
    '{"skill_index":0,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'skill:1',
    'skill_row',
    'Medical Knowledge',
    'FISCMAK lattice skill row 1 — medical knowledge application.',
    'Medical Knowledge',
    '{"skill_index":1,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'skill:2',
    'skill_row',
    'Practice-Based Learning',
    'FISCMAK lattice skill row 2 — practice-based learning and improvement.',
    'Practice-Based Learning',
    '{"skill_index":2,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'skill:3',
    'skill_row',
    'Communication',
    'FISCMAK lattice skill row 3 — communication and interpersonal skill.',
    'Communication',
    '{"skill_index":3,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'skill:4',
    'skill_row',
    'Professionalism & Ethics',
    'FISCMAK lattice skill row 4 — professionalism and ethics.',
    'Professionalism & Ethics',
    '{"skill_index":4,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'skill:5',
    'skill_row',
    'Systems Thinking',
    'FISCMAK lattice skill row 5 — systems thinking and improvement.',
    'Systems Thinking',
    '{"skill_index":5,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'skill:6',
    'skill_row',
    'Collaboration & Teamwork',
    'FISCMAK lattice skill row 6 — collaboration and teamwork.',
    'Collaboration & Teamwork',
    '{"skill_index":6,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'skill:7',
    'skill_row',
    'Personal & Professional Development',
    'FISCMAK lattice skill row 7 — personal and professional development.',
    'Personal & Professional Development',
    '{"skill_index":7,"ontology_version":"expected-work-v1"}'::jsonb
  );
-- -----------------------------------------------------------------------------
-- Seed: FISCMAK 8×8 lattice column labels (domain_index 0–7)
-- -----------------------------------------------------------------------------

INSERT INTO public.reference_descriptors (
  descriptor_source,
  source_code,
  descriptor_type,
  label,
  description,
  physician_facing_label,
  metadata
) VALUES
  (
    'fiscmak_lattice',
    'domain:0',
    'domain_column',
    'Clinician',
    'FISCMAK lattice domain column 0 — direct clinical practice.',
    'Clinician',
    '{"domain_index":0,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'domain:1',
    'domain_column',
    'Educator',
    'FISCMAK lattice domain column 1 — teaching and education.',
    'Educator',
    '{"domain_index":1,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'domain:2',
    'domain_column',
    'Researcher',
    'FISCMAK lattice domain column 2 — research and scholarship.',
    'Researcher',
    '{"domain_index":2,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'domain:3',
    'domain_column',
    'Administrator/Leader',
    'FISCMAK lattice domain column 3 — administration and leadership.',
    'Administrator/Leader',
    '{"domain_index":3,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'domain:4',
    'domain_column',
    'Advocate',
    'FISCMAK lattice domain column 4 — advocacy and policy.',
    'Advocate',
    '{"domain_index":4,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'domain:5',
    'domain_column',
    'Innovator',
    'FISCMAK lattice domain column 5 — innovation and new models of care.',
    'Innovator',
    '{"domain_index":5,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'domain:6',
    'domain_column',
    'Quality/Safety',
    'FISCMAK lattice domain column 6 — quality improvement and safety.',
    'Quality/Safety',
    '{"domain_index":6,"ontology_version":"expected-work-v1"}'::jsonb
  ),
  (
    'fiscmak_lattice',
    'domain:7',
    'domain_column',
    'Wellness Champion',
    'FISCMAK lattice domain column 7 — wellness and wellbeing leadership.',
    'Wellness Champion',
    '{"domain_index":7,"ontology_version":"expected-work-v1"}'::jsonb
  );
