-- Founder handoff v1: psychiatry:resident Expected Emphasis (11 sparse cells)
-- Source: src/lib/product-signal/handoff/expected_psychiatry_resident.json

UPDATE public.specialty_lattice_profiles
SET
  profile_label = 'Psychiatry resident',
  profile_description = 'Expected emphasis for a psychiatry resident: weighted toward direct clinical care and the therapeutic relationship, with education, quality, advocacy, and wellbeing as lighter growth edges. Authored from ACGME psychiatry milestones plus the FISCMAK corpus; founder-review before seeding. Raw weights sum to ~1.0 and are renormalized across listed cells at compare time.',
  updated_at = now()
WHERE profile_key = 'psychiatry:resident'
  AND is_active = true;

DELETE FROM public.specialty_lattice_profile_cells
WHERE profile_id IN (
  SELECT id FROM public.specialty_lattice_profiles WHERE profile_key = 'psychiatry:resident'
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
    'handoff_source', 'expected_psychiatry_resident.json'
  )
FROM public.specialty_lattice_profiles p
JOIN (
  VALUES
    (0, 0, 0.180, 'Psychiatric evaluation, risk assessment, and management — the clinical core of residency.'),
    (3, 0, 0.160, 'Therapeutic communication, interviewing, and alliance-building.'),
    (1, 0, 0.120, 'Psychopharmacology, diagnosis, and treatment planning.'),
    (4, 0, 0.100, 'Boundaries, capacity, consent, and ethical/legal duties such as commitment.'),
    (6, 0, 0.100, 'Interdisciplinary team and milieu-based care.'),
    (2, 0, 0.080, 'Reflective practice and learning from clinical outcomes.'),
    (5, 0, 0.070, 'Coordinating care and navigating systems on behalf of patients.'),
    (2, 1, 0.060, 'Teaching medical students and junior residents.'),
    (5, 6, 0.050, 'Early quality-improvement and patient-safety participation (growth edge).'),
    (3, 4, 0.040, 'Patient advocacy and access navigation (growth edge).'),
    (7, 7, 0.040, 'Wellbeing and professional identity formation (growth edge).')
) AS c(row_index, column_index, expected_weight, rationale)
  ON p.profile_key = 'psychiatry:resident'
 AND p.is_active = true;;
