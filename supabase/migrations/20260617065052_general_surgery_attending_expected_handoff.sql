-- Founder handoff v1: general-surgery:attending Expected Emphasis (12 sparse cells)

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
  'general-surgery:attending',
  'General Surgery',
  NULL,
  'attending',
  NULL,
  'General surgery attending',
  'Expected emphasis for a general surgery attending: operative expertise plus a strong teaching/coaching load (operative autonomy), surgical quality and outcomes, service leadership, and scholarship. Authored from ACGME surgery milestones plus the FISCMAK corpus, which shows educator and quality prominence in surgery; founder-review before seeding. Raw weights sum to ~1.0 and are renormalized across listed cells.',
  'Founder handoff v1 — ACGME surgery attending emphasis.',
  '{"ontology_version":"expected-work-v1","profile_version":"specialty-v0-handoff","handoff_source":"expected_general_surgery_attending.json"}'::jsonb
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
  SELECT id FROM public.specialty_lattice_profiles WHERE profile_key = 'general-surgery:attending'
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
    'handoff_source', 'expected_general_surgery_attending.json'
  )
FROM public.specialty_lattice_profiles p
JOIN (
  VALUES
    (0, 0, 0.160, 'Operative expertise and complex perioperative care.'),
    (1, 0, 0.070, 'Surgical disease and management knowledge.'),
    (6, 0, 0.080, 'Operating-room and perioperative team leadership.'),
    (4, 0, 0.070, 'Consent, ethics, and professionalism.'),
    (2, 1, 0.130, 'Operative teaching and coaching with graded autonomy — a core attending role.'),
    (3, 1, 0.060, 'Intraoperative feedback and titrating autonomy.'),
    (0, 1, 0.060, 'Teaching technical skill (skills lab, simulation).'),
    (5, 6, 0.100, 'Surgical QI, NSQIP, and M&M leadership.'),
    (2, 6, 0.060, 'Outcomes review and complication analysis.'),
    (5, 3, 0.080, 'Committee service, OR governance, and service-line leadership.'),
    (2, 2, 0.070, 'Scholarship and dissemination (varies by track).'),
    (7, 7, 0.060, 'Wellbeing and mentoring.')
) AS c(row_index, column_index, expected_weight, rationale)
  ON p.profile_key = 'general-surgery:attending'
 AND p.is_active = true;;
