-- Expected Work layer (v3): specialty lattice expected-work profiles.
--
-- Lane B — defines Expected Work by specialty, subspecialty, career stage, practice setting.
-- Not evidence. Not user-specific. Does NOT touch evidence spine or product_signals.
--
-- Bridge: reference_descriptors → lattice_cell_descriptors → specialty_lattice_profiles
-- Formula context: Expected Work − Actual Work = Product Signal (one-spine lattice).

-- -----------------------------------------------------------------------------
-- TABLE: specialty_lattice_profiles
-- -----------------------------------------------------------------------------

CREATE TABLE public.specialty_lattice_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key text NOT NULL,
  specialty text NOT NULL,
  subspecialty text,
  career_stage text,
  practice_setting text,
  profile_label text NOT NULL,
  profile_description text,
  source_summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT specialty_lattice_profiles_profile_key_unique UNIQUE (profile_key)
);
CREATE INDEX specialty_lattice_profiles_lookup_idx
  ON public.specialty_lattice_profiles (specialty, subspecialty, career_stage, practice_setting);
CREATE TRIGGER update_specialty_lattice_profiles_updated_at
  BEFORE UPDATE ON public.specialty_lattice_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
COMMENT ON TABLE public.specialty_lattice_profiles IS
  'Expected Work profile anchors by specialty context. Not physician performance scores. '
  'Composes with lattice_cell_descriptors; no user_id.';
COMMENT ON COLUMN public.specialty_lattice_profiles.profile_key IS
  'Stable lookup key, e.g. psychiatry:resident, psychiatry:consultation_liaison.';
-- -----------------------------------------------------------------------------
-- TABLE: specialty_lattice_profile_cells
-- -----------------------------------------------------------------------------

CREATE TABLE public.specialty_lattice_profile_cells (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.specialty_lattice_profiles (id) ON DELETE CASCADE,
  row_index integer NOT NULL,
  column_index integer NOT NULL,
  expected_weight numeric NOT NULL,
  rationale text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT specialty_profile_cells_row_range CHECK (row_index >= 0 AND row_index <= 7),
  CONSTRAINT specialty_profile_cells_column_range CHECK (column_index >= 0 AND column_index <= 7),
  CONSTRAINT specialty_profile_cells_weight_nonnegative CHECK (expected_weight >= 0),
  CONSTRAINT specialty_profile_cells_unique_cell UNIQUE (profile_id, row_index, column_index)
);
CREATE INDEX specialty_lattice_profile_cells_profile_id_idx
  ON public.specialty_lattice_profile_cells (profile_id);
CREATE INDEX specialty_lattice_profile_cells_row_column_idx
  ON public.specialty_lattice_profile_cells (row_index, column_index);
CREATE TRIGGER update_specialty_lattice_profile_cells_updated_at
  BEFORE UPDATE ON public.specialty_lattice_profile_cells
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
COMMENT ON TABLE public.specialty_lattice_profile_cells IS
  'Sparse expected-work emphasis per lattice cell for a specialty profile. '
  'expected_weight is interpretable emphasis — not evidence weight, not a performance score.';
-- -----------------------------------------------------------------------------
-- Grants — authenticated read-only; service_role manages seeds/ETL
-- -----------------------------------------------------------------------------

GRANT SELECT ON public.specialty_lattice_profiles TO authenticated;
GRANT SELECT ON public.specialty_lattice_profile_cells TO authenticated;
GRANT ALL ON public.specialty_lattice_profiles TO service_role;
GRANT ALL ON public.specialty_lattice_profile_cells TO service_role;
REVOKE ALL ON public.specialty_lattice_profiles FROM anon;
REVOKE ALL ON public.specialty_lattice_profile_cells FROM anon;
-- -----------------------------------------------------------------------------
-- RLS — authenticated read active profiles and their active-profile cells only
-- -----------------------------------------------------------------------------

ALTER TABLE public.specialty_lattice_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialty_lattice_profile_cells ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read active specialty_lattice_profiles"
  ON public.specialty_lattice_profiles FOR SELECT
  TO authenticated
  USING (is_active = true);
CREATE POLICY "Authenticated read cells of active specialty_lattice_profiles"
  ON public.specialty_lattice_profile_cells FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.specialty_lattice_profiles p
      WHERE p.id = profile_id
        AND p.is_active = true
    )
  );
-- No INSERT / UPDATE / DELETE policies for authenticated (default deny).

-- -----------------------------------------------------------------------------
-- Seed: v0 psychiatry expected-work profiles (6 profiles)
-- -----------------------------------------------------------------------------

INSERT INTO public.specialty_lattice_profiles (
  profile_key,
  specialty,
  subspecialty,
  career_stage,
  practice_setting,
  profile_label,
  profile_description,
  source_summary,
  metadata
) VALUES
  (
    'psychiatry:resident',
    'Psychiatry',
    NULL,
    'resident',
    NULL,
    'Psychiatry Resident',
    'Broad v0 expected-work scaffold for psychiatry trainees across inpatient, outpatient, and consult exposure.',
    'Curated v0 seed from ACGME psychiatry training emphasis and FISCMAK lattice axes.',
    '{"ontology_version":"expected-work-v1","profile_version":"specialty-v0"}'::jsonb
  ),
  (
    'psychiatry:attending',
    'Psychiatry',
    NULL,
    'attending',
    NULL,
    'Psychiatry Attending',
    'Broad v0 expected-work scaffold for practicing psychiatrist attendings.',
    'Curated v0 seed for general attending practice patterns; not individual performance.',
    '{"ontology_version":"expected-work-v1","profile_version":"specialty-v0"}'::jsonb
  ),
  (
    'psychiatry:consultation_liaison',
    'Psychiatry',
    'Consultation-Liaison Psychiatry',
    NULL,
    NULL,
    'Consultation-Liaison Psychiatry',
    'Expected-work emphasis for CL psychiatry — medical-psychiatric interface and hospital consultation.',
    'Curated v0 CL psychiatry scaffold; subspecialty context without O*NET SOC exposure.',
    '{"ontology_version":"expected-work-v1","profile_version":"specialty-v0"}'::jsonb
  ),
  (
    'psychiatry:emergency',
    'Psychiatry',
    'Emergency Psychiatry',
    NULL,
    NULL,
    'Emergency Psychiatry',
    'Expected-work emphasis for emergency and crisis psychiatry practice.',
    'Curated v0 emergency psychiatry scaffold focused on acute care and crisis systems.',
    '{"ontology_version":"expected-work-v1","profile_version":"specialty-v0"}'::jsonb
  ),
  (
    'psychiatry:academic',
    'Psychiatry',
    NULL,
    NULL,
    'Academic',
    'Academic Psychiatry',
    'Expected-work emphasis for academic psychiatry — clinical service, teaching, and scholarship.',
    'Curated v0 academic practice setting scaffold.',
    '{"ontology_version":"expected-work-v1","profile_version":"specialty-v0"}'::jsonb
  ),
  (
    'psychiatry:community',
    'Psychiatry',
    NULL,
    NULL,
    'Community',
    'Community Psychiatry',
    'Expected-work emphasis for community psychiatry — access, advocacy, and longitudinal community care.',
    'Curated v0 community practice setting scaffold.',
    '{"ontology_version":"expected-work-v1","profile_version":"specialty-v0"}'::jsonb
  );
-- -----------------------------------------------------------------------------
-- Seed: expected lattice cells per profile
-- row_index = FISCMAK skill row; column_index = FISCMAK domain column
-- -----------------------------------------------------------------------------

INSERT INTO public.specialty_lattice_profile_cells (
  profile_id,
  row_index,
  column_index,
  expected_weight,
  rationale,
  metadata
)
SELECT
  p.id,
  c.row_index,
  c.column_index,
  c.expected_weight,
  c.rationale,
  jsonb_build_object('profile_version', 'specialty-v0', 'ontology_version', 'expected-work-v1')
FROM public.specialty_lattice_profiles p
JOIN (
  VALUES
    -- psychiatry:resident (10 cells)
    ('psychiatry:resident', 0, 0, 0.220, 'Core inpatient and outpatient direct patient care during training.'),
    ('psychiatry:resident', 1, 0, 0.140, 'Psychopharmacology, diagnosis, and clinical reasoning foundations.'),
    ('psychiatry:resident', 3, 0, 0.160, 'Therapeutic communication, interviews, and alliance-building.'),
    ('psychiatry:resident', 3, 1, 0.080, 'Teaching and presenting on rounds and didactics.'),
    ('psychiatry:resident', 2, 6, 0.100, 'Participation in QI and practice-improvement activities.'),
    ('psychiatry:resident', 4, 4, 0.100, 'Professionalism in complex and stigmatized clinical encounters.'),
    ('psychiatry:resident', 6, 0, 0.120, 'Interdisciplinary team work on inpatient and consult services.'),
    ('psychiatry:resident', 7, 7, 0.080, 'Reflective practice and trainee wellbeing habits.'),
    ('psychiatry:resident', 2, 1, 0.050, 'Early teaching and feedback skills.'),
    ('psychiatry:resident', 5, 0, 0.050, 'Learning hospital and clinic systems during rotations.'),

    -- psychiatry:attending (10 cells)
    ('psychiatry:attending', 0, 0, 0.200, 'Sustained direct clinical care across settings.'),
    ('psychiatry:attending', 1, 0, 0.120, 'Maintaining and applying current clinical knowledge.'),
    ('psychiatry:attending', 3, 0, 0.140, 'Complex therapeutic relationships and longitudinal care.'),
    ('psychiatry:attending', 5, 3, 0.110, 'Service-line, clinic, or program leadership.'),
    ('psychiatry:attending', 6, 6, 0.100, 'Quality, safety, and outcomes oversight.'),
    ('psychiatry:attending', 2, 2, 0.080, 'Scholarship and practice-based learning contributions.'),
    ('psychiatry:attending', 4, 4, 0.080, 'Patient and access advocacy.'),
    ('psychiatry:attending', 7, 1, 0.090, 'Mentoring trainees and colleagues.'),
    ('psychiatry:attending', 5, 6, 0.100, 'Systems improvement in clinical environments.'),
    ('psychiatry:attending', 6, 0, 0.080, 'Collaboration across care teams.'),

    -- psychiatry:consultation_liaison (9 cells)
    ('psychiatry:consultation_liaison', 0, 0, 0.240, 'Consultation psychiatry embedded in medical and surgical settings.'),
    ('psychiatry:consultation_liaison', 1, 0, 0.160, 'Medical-psychiatric interface and comorbidity knowledge.'),
    ('psychiatry:consultation_liaison', 3, 0, 0.180, 'Communication with patients, families, and non-psychiatry teams.'),
    ('psychiatry:consultation_liaison', 5, 0, 0.120, 'Hospital systems, pathways, and capacity navigation.'),
    ('psychiatry:consultation_liaison', 6, 0, 0.140, 'Collaboration with medicine, surgery, and allied services.'),
    ('psychiatry:consultation_liaison', 2, 6, 0.080, 'Consult pathway and protocol improvement.'),
    ('psychiatry:consultation_liaison', 4, 4, 0.080, 'Advocacy for psychiatric patients in medical settings.'),
    ('psychiatry:consultation_liaison', 1, 2, 0.050, 'Case series and interface scholarship.'),
    ('psychiatry:consultation_liaison', 4, 0, 0.050, 'Brief intervention and recommendation clarity.'),

    -- psychiatry:emergency (9 cells)
    ('psychiatry:emergency', 0, 0, 0.260, 'Acute assessment, stabilization, and crisis intervention.'),
    ('psychiatry:emergency', 3, 0, 0.180, 'Crisis communication, de-escalation, and risk dialogue.'),
    ('psychiatry:emergency', 6, 0, 0.140, 'ED, crisis, and mobile team collaboration.'),
    ('psychiatry:emergency', 5, 6, 0.120, 'Safety, throughput, and emergency care systems.'),
    ('psychiatry:emergency', 1, 0, 0.120, 'Acute pharmacology and risk formulation.'),
    ('psychiatry:emergency', 4, 4, 0.080, 'Advocacy in high-acuity and resource-constrained settings.'),
    ('psychiatry:emergency', 7, 7, 0.100, 'Managing high-stress clinical environments sustainably.'),
    ('psychiatry:emergency', 5, 0, 0.060, 'ED and crisis service operational awareness.'),
    ('psychiatry:emergency', 6, 6, 0.040, 'Safety event review and learning.'),

    -- psychiatry:academic (10 cells)
    ('psychiatry:academic', 0, 0, 0.160, 'Clinical service within an academic medical center.'),
    ('psychiatry:academic', 1, 1, 0.180, 'Teaching medical students, residents, and fellows.'),
    ('psychiatry:academic', 1, 2, 0.160, 'Research, scholarship, and evidence generation.'),
    ('psychiatry:academic', 2, 2, 0.120, 'Practice-based learning and scholarly improvement.'),
    ('psychiatry:academic', 3, 1, 0.100, 'Didactic, small-group, and bedside teaching.'),
    ('psychiatry:academic', 5, 3, 0.120, 'Academic leadership, committees, and program roles.'),
    ('psychiatry:academic', 6, 1, 0.080, 'Collaborative education and training teams.'),
    ('psychiatry:academic', 2, 6, 0.080, 'QI and outcomes work in academic practice.'),
    ('psychiatry:academic', 4, 2, 0.050, 'Dissemination and advocacy through scholarship.'),
    ('psychiatry:academic', 7, 1, 0.050, 'Faculty development and mentoring.'),

    -- psychiatry:community (10 cells)
    ('psychiatry:community', 0, 0, 0.220, 'Community-based direct care and longitudinal relationships.'),
    ('psychiatry:community', 4, 4, 0.160, 'Population access, stigma, and policy advocacy.'),
    ('psychiatry:community', 5, 5, 0.120, 'Care delivery innovation in community settings.'),
    ('psychiatry:community', 3, 0, 0.140, 'Therapeutic work across diverse community populations.'),
    ('psychiatry:community', 6, 0, 0.120, 'Care coordination with community agencies and PCPs.'),
    ('psychiatry:community', 5, 6, 0.100, 'Community safety and quality programs.'),
    ('psychiatry:community', 7, 7, 0.100, 'Recovery-oriented and wellness-forward practice.'),
    ('psychiatry:community', 1, 0, 0.060, 'Broad generalist psychiatry knowledge.'),
    ('psychiatry:community', 5, 0, 0.050, 'Navigating fragmented community health systems.'),
    ('psychiatry:community', 4, 0, 0.030, 'Outreach and engagement for underserved groups.')
) AS c(profile_key, row_index, column_index, expected_weight, rationale)
  ON p.profile_key = c.profile_key
WHERE p.is_active = true;
