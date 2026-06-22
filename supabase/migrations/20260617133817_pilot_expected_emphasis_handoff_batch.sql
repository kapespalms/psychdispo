-- Founder handoff v1 batch: psychiatry:attending (replace), general-surgery:resident,
-- internal-medicine:resident, internal-medicine:attending
-- Sources: src/lib/product-signal/handoff/expected_*.json

-- =============================================================================
-- psychiatry:attending (12 sparse cells — replaces salvage seed)
-- =============================================================================

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
) VALUES (
  'psychiatry:attending',
  'Psychiatry',
  NULL,
  'attending',
  NULL,
  'Psychiatry attending',
  'Expected emphasis for a psychiatry attending: still clinically grounded, but broadened into supervision/teaching, service leadership, quality, advocacy, and scholarship. Authored from ACGME psychiatry milestones plus the FISCMAK corpus; founder-review before seeding. Raw weights sum to ~1.0 and are renormalized across listed cells.',
  'Founder handoff v1 — ACGME psychiatry attending emphasis.',
  '{"ontology_version":"expected-work-v1","profile_version":"specialty-v0-handoff","handoff_source":"expected_psychiatry_attending.json"}'::jsonb
)
ON CONFLICT (profile_key) DO UPDATE SET
  specialty = EXCLUDED.specialty,
  subspecialty = EXCLUDED.subspecialty,
  career_stage = EXCLUDED.career_stage,
  practice_setting = EXCLUDED.practice_setting,
  profile_label = EXCLUDED.profile_label,
  profile_description = EXCLUDED.profile_description,
  source_summary = EXCLUDED.source_summary,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = now();

DELETE FROM public.specialty_lattice_profile_cells
WHERE profile_id IN (
  SELECT id FROM public.specialty_lattice_profiles WHERE profile_key = 'psychiatry:attending'
);

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
  jsonb_build_object(
    'profile_version', 'specialty-v0-handoff',
    'ontology_version', 'expected-work-v1',
    'handoff_source', 'expected_psychiatry_attending.json'
  )
FROM public.specialty_lattice_profiles p
JOIN (
  VALUES
    (0, 0, 0.130, 'Complex psychiatric care and oversight of treatment.'),
    (3, 0, 0.110, 'Therapeutic alliance, family meetings, difficult conversations.'),
    (1, 0, 0.080, 'Psychopharmacology and diagnostic expertise.'),
    (4, 0, 0.070, 'Capacity, commitment, boundaries, and ethical/legal duties.'),
    (2, 1, 0.120, 'Supervising and teaching residents — a core attending role.'),
    (3, 1, 0.070, 'Didactics, feedback, and clinical supervision.'),
    (5, 3, 0.100, 'Committee service, medical direction, and service-line leadership.'),
    (6, 3, 0.060, 'Leading interdisciplinary teams and programs.'),
    (5, 6, 0.070, 'Quality improvement, patient safety, and M&M.'),
    (3, 4, 0.060, 'Mental-health advocacy, access, and parity.'),
    (2, 2, 0.070, 'Scholarship, peer review, and dissemination (varies by track).'),
    (7, 7, 0.060, 'Wellbeing, mentoring, and professional identity.')
) AS c(row_index, column_index, expected_weight, rationale)
  ON p.profile_key = 'psychiatry:attending'
 AND p.is_active = true;

-- =============================================================================
-- general-surgery:resident (10 sparse cells)
-- =============================================================================

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
) VALUES (
  'general-surgery:resident',
  'General Surgery',
  NULL,
  'resident',
  NULL,
  'General surgery resident',
  'Expected emphasis for a general surgery resident: technical and perioperative clinical care, with strong professionalism, teamwork, and practice-based learning (M&M), plus teaching, quality, and wellbeing as growth edges. Authored from ACGME surgery milestones plus the FISCMAK corpus; founder-review before seeding. Raw weights sum to ~1.0 and are renormalized across listed cells.',
  'Founder handoff v1 — ACGME surgery resident emphasis.',
  '{"ontology_version":"expected-work-v1","profile_version":"specialty-v0-handoff","handoff_source":"expected_general_surgery_resident.json"}'::jsonb
)
ON CONFLICT (profile_key) DO UPDATE SET
  specialty = EXCLUDED.specialty,
  subspecialty = EXCLUDED.subspecialty,
  career_stage = EXCLUDED.career_stage,
  practice_setting = EXCLUDED.practice_setting,
  profile_label = EXCLUDED.profile_label,
  profile_description = EXCLUDED.profile_description,
  source_summary = EXCLUDED.source_summary,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = now();

DELETE FROM public.specialty_lattice_profile_cells
WHERE profile_id IN (
  SELECT id FROM public.specialty_lattice_profiles WHERE profile_key = 'general-surgery:resident'
);

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
  jsonb_build_object(
    'profile_version', 'specialty-v0-handoff',
    'ontology_version', 'expected-work-v1',
    'handoff_source', 'expected_general_surgery_resident.json'
  )
FROM public.specialty_lattice_profiles p
JOIN (
  VALUES
    (0, 0, 0.220, 'Operative and perioperative technical skill — the clinical core of surgical training.'),
    (1, 0, 0.120, 'Surgical disease and perioperative management knowledge.'),
    (4, 0, 0.100, 'Consent, capacity, and professionalism under pressure.'),
    (6, 0, 0.100, 'Operating-room team and perioperative coordination.'),
    (3, 0, 0.090, 'Consent conversations, family updates, and handoffs.'),
    (2, 0, 0.090, 'M&M and learning from complications.'),
    (5, 0, 0.070, 'Perioperative systems, checklists, and safety.'),
    (2, 1, 0.070, 'Teaching junior residents and students.'),
    (5, 6, 0.070, 'Surgical quality and safety (e.g., NSQIP, checklists) — growth edge.'),
    (7, 7, 0.070, 'Wellbeing and professional identity (growth edge).')
) AS c(row_index, column_index, expected_weight, rationale)
  ON p.profile_key = 'general-surgery:resident'
 AND p.is_active = true;

-- =============================================================================
-- internal-medicine:resident (10 sparse cells)
-- =============================================================================

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
) VALUES (
  'internal-medicine:resident',
  'Internal Medicine',
  NULL,
  'resident',
  NULL,
  'Internal medicine resident',
  'Expected emphasis for an internal medicine resident: knowledge-forward direct clinical care, diagnostic reasoning, care coordination, and team-based practice, with teaching, quality, and wellbeing as growth edges. Authored from ACGME internal medicine milestones plus the FISCMAK corpus; founder-review before seeding. Raw weights sum to ~1.0 and are renormalized across listed cells.',
  'Founder handoff v1 — ACGME internal medicine resident emphasis.',
  '{"ontology_version":"expected-work-v1","profile_version":"specialty-v0-handoff","handoff_source":"expected_internal_medicine_resident.json"}'::jsonb
)
ON CONFLICT (profile_key) DO UPDATE SET
  specialty = EXCLUDED.specialty,
  subspecialty = EXCLUDED.subspecialty,
  career_stage = EXCLUDED.career_stage,
  practice_setting = EXCLUDED.practice_setting,
  profile_label = EXCLUDED.profile_label,
  profile_description = EXCLUDED.profile_description,
  source_summary = EXCLUDED.source_summary,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = now();

DELETE FROM public.specialty_lattice_profile_cells
WHERE profile_id IN (
  SELECT id FROM public.specialty_lattice_profiles WHERE profile_key = 'internal-medicine:resident'
);

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
  jsonb_build_object(
    'profile_version', 'specialty-v0-handoff',
    'ontology_version', 'expected-work-v1',
    'handoff_source', 'expected_internal_medicine_resident.json'
  )
FROM public.specialty_lattice_profiles p
JOIN (
  VALUES
    (0, 0, 0.180, 'Inpatient and outpatient management; diagnostic and procedural care.'),
    (1, 0, 0.150, 'Broad diagnostic and therapeutic knowledge — central to internal medicine.'),
    (3, 0, 0.120, 'Patient communication, goals-of-care, and shared decision-making.'),
    (5, 0, 0.100, 'Care coordination, transitions of care, and discharge planning.'),
    (4, 0, 0.090, 'Ethics, capacity, and professionalism in complex care.'),
    (6, 0, 0.090, 'Interdisciplinary rounds and team-based care.'),
    (2, 0, 0.080, 'Evidence-based practice and learning from clinical outcomes.'),
    (2, 1, 0.070, 'Teaching students and interns on the wards.'),
    (5, 6, 0.060, 'Quality-improvement and patient-safety participation (growth edge).'),
    (7, 7, 0.060, 'Wellbeing and professional identity formation (growth edge).')
) AS c(row_index, column_index, expected_weight, rationale)
  ON p.profile_key = 'internal-medicine:resident'
 AND p.is_active = true;

-- =============================================================================
-- internal-medicine:attending (12 sparse cells)
-- =============================================================================

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
) VALUES (
  'internal-medicine:attending',
  'Internal Medicine',
  NULL,
  'attending',
  NULL,
  'Internal medicine attending',
  'Expected emphasis for an internal medicine attending: clinical oversight plus teaching, a strong quality/systems load (high-value care, QI, M&M), service leadership, and scholarship. Authored from ACGME internal medicine milestones plus the FISCMAK corpus, which shows quality/safety prominence in IM; founder-review before seeding. Raw weights sum to ~1.0 and are renormalized across listed cells.',
  'Founder handoff v1 — ACGME internal medicine attending emphasis.',
  '{"ontology_version":"expected-work-v1","profile_version":"specialty-v0-handoff","handoff_source":"expected_internal_medicine_attending.json"}'::jsonb
)
ON CONFLICT (profile_key) DO UPDATE SET
  specialty = EXCLUDED.specialty,
  subspecialty = EXCLUDED.subspecialty,
  career_stage = EXCLUDED.career_stage,
  practice_setting = EXCLUDED.practice_setting,
  profile_label = EXCLUDED.profile_label,
  profile_description = EXCLUDED.profile_description,
  source_summary = EXCLUDED.source_summary,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = now();

DELETE FROM public.specialty_lattice_profile_cells
WHERE profile_id IN (
  SELECT id FROM public.specialty_lattice_profiles WHERE profile_key = 'internal-medicine:attending'
);

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
  jsonb_build_object(
    'profile_version', 'specialty-v0-handoff',
    'ontology_version', 'expected-work-v1',
    'handoff_source', 'expected_internal_medicine_attending.json'
  )
FROM public.specialty_lattice_profiles p
JOIN (
  VALUES
    (0, 0, 0.130, 'Clinical oversight of complex inpatient and outpatient care.'),
    (1, 0, 0.090, 'Diagnostic and therapeutic expertise across broad presentations.'),
    (3, 0, 0.090, 'Goals-of-care and complex communication.'),
    (5, 0, 0.080, 'High-value care and transitions of care.'),
    (2, 1, 0.120, 'Teaching and precepting residents and students — a core attending role.'),
    (3, 1, 0.060, 'Feedback, didactics, and bedside teaching.'),
    (5, 6, 0.110, 'QI leadership, high-value-care initiatives, and M&M — strong in IM.'),
    (2, 6, 0.070, 'Improvement projects and outcomes review.'),
    (5, 3, 0.090, 'Committee service and service-line leadership.'),
    (6, 3, 0.050, 'Leading interdisciplinary teams.'),
    (2, 2, 0.060, 'Scholarship, peer review, and dissemination (varies by track).'),
    (7, 7, 0.050, 'Wellbeing and mentoring.')
) AS c(row_index, column_index, expected_weight, rationale)
  ON p.profile_key = 'internal-medicine:attending'
 AND p.is_active = true;;
