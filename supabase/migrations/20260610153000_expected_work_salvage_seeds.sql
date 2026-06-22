-- Expected Work salvage seeds (v4) — Claude reference assets → existing Expected Work tables.
--
-- Lane B/D — imports salvageable prototype data only. Does NOT:
--   touch evidence spine, create ONET catalog tables, product_signals, or user-specific rows.
--
-- Sources: FISCMAK_Lattice_Formula_Reference.md, FISCMAK_Subspecialty_Anchor_SOCs.csv,
--          CLAUDE_TABLE_ASSET_SALVAGE_AUDIT.md
--
-- Formula context: Expected Work − Actual Work = Product Signal (one-spine lattice).

-- =============================================================================
-- 1. reference_descriptors — Stage-4 O*NET skill bundles (7 rows; PPD excluded)
-- =============================================================================

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
    'onet',
    'stage4:skill:0',
    'onet_skill_bundle',
    'Clinical expertise descriptor bundle',
    'Stage-4 salvage: Knowledge/Skills/Activities backing for clinical expertise skill row.',
    'Clinical practice depth',
    'Depth in direct patient care, clinical reasoning, and treatment decisions.',
    '{"skill_index":0,"acgme":"PC","stage4_version":"salvage-v1","onet_files":["Knowledge","Skills","Work Activities"],"internal_elements":["Medicine and Dentistry","Biology","Science","Critical Thinking","Assisting and Caring for Others","Making Decisions"],"ontology_version":"expected-work-salvage-v1"}'::jsonb
  ),
  (
    'onet',
    'stage4:skill:1',
    'onet_skill_bundle',
    'Medical knowledge descriptor bundle',
    'Stage-4 salvage: backing for medical knowledge skill row.',
    'Medical knowledge application',
    'Applying biomedical and clinical science to patient care.',
    '{"skill_index":1,"acgme":"MK","stage4_version":"salvage-v1","onet_files":["Knowledge","Skills","Work Activities"],"internal_elements":["Medicine","Biology","Active Learning","Reading Comprehension","Updating and Using Knowledge","Analyzing Data"],"ontology_version":"expected-work-salvage-v1"}'::jsonb
  ),
  (
    'onet',
    'stage4:skill:2',
    'onet_skill_bundle',
    'Practice-based learning descriptor bundle',
    'Stage-4 salvage: backing for practice-based learning skill row.',
    'Practice improvement',
    'Evaluating and improving clinical practice using evidence and feedback.',
    '{"skill_index":2,"acgme":"PBLI","stage4_version":"salvage-v1","onet_files":["Knowledge","Skills","Work Activities"],"internal_elements":["Education and Training","Learning Strategies","Complex Problem Solving","Evaluating Information","Monitoring"],"ontology_version":"expected-work-salvage-v1"}'::jsonb
  ),
  (
    'onet',
    'stage4:skill:3',
    'onet_skill_bundle',
    'Communication descriptor bundle',
    'Stage-4 salvage: backing for communication skill row.',
    'Communication and relationships',
    'Interpersonal communication across patients, families, and teams.',
    '{"skill_index":3,"acgme":"ICS","stage4_version":"salvage-v1","onet_files":["Knowledge","Skills","Work Activities"],"internal_elements":["Psychology","Active Listening","Speaking","Social Perceptiveness","Resolving Conflicts"],"ontology_version":"expected-work-salvage-v1"}'::jsonb
  ),
  (
    'onet',
    'stage4:skill:4',
    'onet_skill_bundle',
    'Professionalism descriptor bundle',
    'Stage-4 salvage: backing for professionalism skill row.',
    'Professionalism and ethics',
    'Ethical practice, judgment, and professional responsibility.',
    '{"skill_index":4,"acgme":"PROF","stage4_version":"salvage-v1","onet_files":["Knowledge","Skills","Work Activities"],"internal_elements":["Philosophy and Theology","Law and Government","Judgment and Decision Making","Evaluating Information to Determine Compliance"],"ontology_version":"expected-work-salvage-v1"}'::jsonb
  ),
  (
    'onet',
    'stage4:skill:5',
    'onet_skill_bundle',
    'Systems thinking descriptor bundle',
    'Stage-4 salvage: backing for systems thinking skill row.',
    'Systems and improvement',
    'Systems analysis, coordination, and improvement across care settings.',
    '{"skill_index":5,"acgme":"SBP","stage4_version":"salvage-v1","onet_files":["Knowledge","Skills","Work Activities"],"internal_elements":["Administration and Management","Systems Analysis","Systems Evaluation","Coordinating Work and Activities","Developing Objectives and Strategies"],"ontology_version":"expected-work-salvage-v1"}'::jsonb
  ),
  (
    'onet',
    'stage4:skill:6',
    'onet_skill_bundle',
    'Collaboration descriptor bundle',
    'Stage-4 salvage: FISCMAK extension skill row for collaboration.',
    'Collaboration and teamwork',
    'Coordination, persuasion, and teamwork across roles.',
    '{"skill_index":6,"acgme":"IPC","stage4_version":"salvage-v1","onet_files":["Knowledge","Skills","Work Activities"],"internal_elements":["Customer and Personal Service","Coordination","Persuasion","Negotiation","Communicating with Supervisors Peers or Subordinates"],"ontology_version":"expected-work-salvage-v1"}'::jsonb
  )
ON CONFLICT (descriptor_source, source_code, descriptor_type, label) DO NOTHING;
-- =============================================================================
-- 2. reference_descriptors — specialty → primary SOC (internal metadata only)
-- =============================================================================

INSERT INTO public.reference_descriptors (
  descriptor_source,
  source_code,
  descriptor_type,
  label,
  description,
  physician_facing_label,
  metadata
) VALUES
  ('specialty_anchor', 'soc:psychiatry', 'specialty_soc', 'Psychiatry specialty anchor', 'Internal primary SOC for psychiatry expected-work profiles.', 'Psychiatry', '{"specialty":"Psychiatry","primary_soc_internal":"29-1223.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:internal_medicine', 'specialty_soc', 'Internal Medicine specialty anchor', 'Internal primary SOC for internal medicine.', 'Internal Medicine', '{"specialty":"Internal Medicine","primary_soc_internal":"29-1216.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:family_medicine', 'specialty_soc', 'Family Medicine specialty anchor', 'Internal primary SOC for family medicine.', 'Family Medicine', '{"specialty":"Family Medicine","primary_soc_internal":"29-1215.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:emergency_medicine', 'specialty_soc', 'Emergency Medicine specialty anchor', 'Internal primary SOC for emergency medicine.', 'Emergency Medicine', '{"specialty":"Emergency Medicine","primary_soc_internal":"29-1214.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:pediatrics', 'specialty_soc', 'Pediatrics specialty anchor', 'Internal primary SOC for pediatrics.', 'Pediatrics', '{"specialty":"Pediatrics","primary_soc_internal":"29-1221.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:obgyn', 'specialty_soc', 'OB/GYN specialty anchor', 'Internal primary SOC for obstetrics and gynecology.', 'OB/GYN', '{"specialty":"OB/GYN","primary_soc_internal":"29-1218.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:surgery', 'specialty_soc', 'General Surgery specialty anchor', 'Internal primary SOC for general surgery.', 'Surgery', '{"specialty":"Surgery","primary_soc_internal":"29-1249.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:orthopedic_surgery', 'specialty_soc', 'Orthopedic Surgery specialty anchor', 'Internal primary SOC for orthopedic surgery.', 'Orthopedic Surgery', '{"specialty":"Orthopedic Surgery","primary_soc_internal":"29-1242.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:neurology', 'specialty_soc', 'Neurology specialty anchor', 'Internal primary SOC for neurology.', 'Neurology', '{"specialty":"Neurology","primary_soc_internal":"29-1217.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:radiology', 'specialty_soc', 'Radiology specialty anchor', 'Internal primary SOC for radiology.', 'Radiology', '{"specialty":"Radiology","primary_soc_internal":"29-1224.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:pathology', 'specialty_soc', 'Pathology specialty anchor', 'Internal primary SOC for pathology.', 'Pathology', '{"specialty":"Pathology","primary_soc_internal":"29-1222.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:dermatology', 'specialty_soc', 'Dermatology specialty anchor', 'Internal primary SOC for dermatology.', 'Dermatology', '{"specialty":"Dermatology","primary_soc_internal":"29-1213.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:anesthesiology', 'specialty_soc', 'Anesthesiology specialty anchor', 'Internal primary SOC for anesthesiology.', 'Anesthesiology', '{"specialty":"Anesthesiology","primary_soc_internal":"29-1211.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:pmr', 'specialty_soc', 'PM&R specialty anchor', 'Internal primary SOC for physical medicine and rehabilitation.', 'PM&R', '{"specialty":"PM&R","primary_soc_internal":"29-1229.04","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:ophthalmology', 'specialty_soc', 'Ophthalmology specialty anchor', 'Internal primary SOC for ophthalmology.', 'Ophthalmology', '{"specialty":"Ophthalmology","primary_soc_internal":"29-1241.00","salvage_version":"specialty-soc-v1"}'::jsonb),
  ('specialty_anchor', 'soc:cardiology', 'specialty_soc', 'Cardiology subspecialty anchor parent', 'Parent SOC reference for cardiology (internal medicine base).', 'Cardiology', '{"specialty":"Cardiology","primary_soc_internal":"29-1212.00","parent_specialty":"Internal Medicine","salvage_version":"specialty-soc-v1"}'::jsonb)
ON CONFLICT (descriptor_source, source_code, descriptor_type, label) DO NOTHING;
-- =============================================================================
-- 3. reference_descriptors — RIASEC domain codes (internal; never raw codes in UI)
-- =============================================================================

INSERT INTO public.reference_descriptors (
  descriptor_source,
  source_code,
  descriptor_type,
  label,
  description,
  physician_facing_label,
  metadata
) VALUES
  ('riasec', 'domain:0', 'domain_interest_profile', 'Clinician domain interest profile', 'Internal RIASEC blend for clinician domain.', 'Clinician', '{"domain_index":0,"riasec_primary":"I","riasec_secondary":"S","riasec_tertiary":"R","salvage_version":"riasec-v1"}'::jsonb),
  ('riasec', 'domain:1', 'domain_interest_profile', 'Educator domain interest profile', 'Internal RIASEC blend for educator domain.', 'Educator', '{"domain_index":1,"riasec_primary":"S","riasec_secondary":"I","riasec_tertiary":"A","salvage_version":"riasec-v1"}'::jsonb),
  ('riasec', 'domain:2', 'domain_interest_profile', 'Researcher domain interest profile', 'Internal RIASEC blend for researcher domain.', 'Researcher', '{"domain_index":2,"riasec_primary":"I","riasec_secondary":"A","riasec_tertiary":"C","salvage_version":"riasec-v1"}'::jsonb),
  ('riasec', 'domain:3', 'domain_interest_profile', 'Administrator domain interest profile', 'Internal RIASEC blend for administrator/leader domain.', 'Administrator/Leader', '{"domain_index":3,"riasec_primary":"E","riasec_secondary":"S","riasec_tertiary":"C","salvage_version":"riasec-v1"}'::jsonb),
  ('riasec', 'domain:4', 'domain_interest_profile', 'Advocate domain interest profile', 'Internal RIASEC blend for advocate domain.', 'Advocate', '{"domain_index":4,"riasec_primary":"S","riasec_secondary":"E","riasec_tertiary":"A","salvage_version":"riasec-v1"}'::jsonb),
  ('riasec', 'domain:5', 'domain_interest_profile', 'Innovator domain interest profile', 'Internal RIASEC blend for innovator domain.', 'Innovator', '{"domain_index":5,"riasec_primary":"I","riasec_secondary":"R","riasec_tertiary":"E","salvage_version":"riasec-v1"}'::jsonb),
  ('riasec', 'domain:6', 'domain_interest_profile', 'Quality/Safety domain interest profile', 'Internal RIASEC blend for quality/safety domain.', 'Quality/Safety', '{"domain_index":6,"riasec_primary":"C","riasec_secondary":"I","riasec_tertiary":"S","salvage_version":"riasec-v1"}'::jsonb),
  ('riasec', 'domain:7', 'domain_interest_profile', 'Wellness Champion domain interest profile', 'Internal RIASEC blend for wellness champion domain.', 'Wellness Champion', '{"domain_index":7,"riasec_primary":"S","riasec_secondary":"A","riasec_tertiary":"I","salvage_version":"riasec-v1"}'::jsonb)
ON CONFLICT (descriptor_source, source_code, descriptor_type, label) DO NOTHING;
-- =============================================================================
-- 4. reference_descriptors — work values themes (internal Expected Work layer)
-- =============================================================================

INSERT INTO public.reference_descriptors (
  descriptor_source,
  source_code,
  descriptor_type,
  label,
  description,
  physician_facing_label,
  metadata
) VALUES
  ('work_values', 'achievement', 'work_value_theme', 'Achievement work value', 'Internal O*NET work value theme — not a performance score.', 'Achievement', '{"work_value":"Achievement","salvage_version":"work-values-v1"}'::jsonb),
  ('work_values', 'independence', 'work_value_theme', 'Independence work value', 'Internal O*NET work value theme.', 'Independence', '{"work_value":"Independence","salvage_version":"work-values-v1"}'::jsonb),
  ('work_values', 'recognition', 'work_value_theme', 'Recognition work value', 'Internal O*NET work value theme — not institutional recognition gap score.', 'Recognition', '{"work_value":"Recognition","salvage_version":"work-values-v1"}'::jsonb),
  ('work_values', 'relationships', 'work_value_theme', 'Relationships work value', 'Internal O*NET work value theme.', 'Relationships', '{"work_value":"Relationships","salvage_version":"work-values-v1"}'::jsonb),
  ('work_values', 'support', 'work_value_theme', 'Support work value', 'Internal O*NET work value theme.', 'Support', '{"work_value":"Support","salvage_version":"work-values-v1"}'::jsonb),
  ('work_values', 'working_conditions', 'work_value_theme', 'Working conditions work value', 'Internal O*NET work value theme.', 'Working conditions', '{"work_value":"Working Conditions","salvage_version":"work-values-v1"}'::jsonb)
ON CONFLICT (descriptor_source, source_code, descriptor_type, label) DO NOTHING;
-- =============================================================================
-- 5. reference_descriptors — rank matrix links (64 domain×skill rank weights)
-- =============================================================================

INSERT INTO public.reference_descriptors (
  descriptor_source,
  source_code,
  descriptor_type,
  label,
  description,
  physician_facing_label,
  metadata
)
SELECT
  'fiscmak_lattice',
  format('rank:d%s:s%s', m.column_index, m.row_index),
  'domain_skill_rank',
  format('Domain %s × Skill %s rank weight', m.column_index, m.row_index),
  'Salvaged 8×8 rank matrix cell — ipsative domain→skill emphasis.',
  NULL,
  jsonb_build_object(
    'domain_index', m.column_index,
    'skill_index', m.row_index,
    'rank', m.rank,
    'rank_weight', m.rank_weight,
    'salvage_version', 'rank-matrix-v1',
    'ontology_version', 'expected-work-salvage-v1'
  )
FROM (
  VALUES
    -- column 0 Clinician
    (0, 0, 1, 8::numeric / 36), (0, 1, 2, 7::numeric / 36), (0, 3, 3, 6::numeric / 36),
    (0, 4, 4, 5::numeric / 36), (0, 6, 5, 4::numeric / 36), (0, 2, 6, 3::numeric / 36),
    (0, 5, 7, 2::numeric / 36), (0, 7, 8, 1::numeric / 36),
    -- column 1 Educator
    (1, 3, 1, 8::numeric / 36), (1, 2, 2, 7::numeric / 36), (1, 6, 3, 6::numeric / 36),
    (1, 7, 4, 5::numeric / 36), (1, 0, 5, 4::numeric / 36), (1, 1, 6, 3::numeric / 36),
    (1, 4, 7, 2::numeric / 36), (1, 5, 8, 1::numeric / 36),
    -- column 2 Researcher
    (2, 1, 1, 8::numeric / 36), (2, 2, 2, 7::numeric / 36), (2, 7, 3, 6::numeric / 36),
    (2, 3, 4, 5::numeric / 36), (2, 0, 5, 4::numeric / 36), (2, 6, 6, 3::numeric / 36),
    (2, 5, 7, 2::numeric / 36), (2, 4, 8, 1::numeric / 36),
    -- column 3 Administrator/Leader
    (3, 5, 1, 8::numeric / 36), (3, 6, 2, 7::numeric / 36), (3, 4, 3, 6::numeric / 36),
    (3, 3, 4, 5::numeric / 36), (3, 2, 5, 4::numeric / 36), (3, 0, 6, 3::numeric / 36),
    (3, 1, 7, 2::numeric / 36), (3, 7, 8, 1::numeric / 36),
    -- column 4 Advocate
    (4, 5, 1, 8::numeric / 36), (4, 4, 2, 7::numeric / 36), (4, 3, 3, 6::numeric / 36),
    (4, 6, 4, 5::numeric / 36), (4, 0, 5, 4::numeric / 36), (4, 1, 6, 3::numeric / 36),
    (4, 2, 7, 2::numeric / 36), (4, 7, 8, 1::numeric / 36),
    -- column 5 Innovator
    (5, 2, 1, 8::numeric / 36), (5, 5, 2, 7::numeric / 36), (5, 1, 3, 6::numeric / 36),
    (5, 3, 4, 5::numeric / 36), (5, 0, 5, 4::numeric / 36), (5, 6, 6, 3::numeric / 36),
    (5, 4, 7, 2::numeric / 36), (5, 7, 8, 1::numeric / 36),
    -- column 6 Quality/Safety
    (6, 2, 1, 8::numeric / 36), (6, 5, 2, 7::numeric / 36), (6, 0, 3, 6::numeric / 36),
    (6, 6, 4, 5::numeric / 36), (6, 3, 5, 4::numeric / 36), (6, 4, 6, 3::numeric / 36),
    (6, 1, 7, 2::numeric / 36), (6, 7, 8, 1::numeric / 36),
    -- column 7 Wellness Champion
    (7, 7, 1, 8::numeric / 36), (7, 6, 2, 7::numeric / 36), (7, 4, 3, 6::numeric / 36),
    (7, 3, 4, 5::numeric / 36), (7, 0, 5, 4::numeric / 36), (7, 2, 6, 3::numeric / 36),
    (7, 5, 7, 2::numeric / 36), (7, 1, 8, 1::numeric / 36)
) AS m(column_index, row_index, rank, rank_weight)
ON CONFLICT (descriptor_source, source_code, descriptor_type, label) DO NOTHING;
-- =============================================================================
-- 6. lattice_cell_descriptors — Stage-4 O*NET bundles → skill rows
-- =============================================================================

INSERT INTO public.lattice_cell_descriptors (
  descriptor_id,
  row_index,
  column_index,
  descriptor_weight,
  mapping_type,
  mapping_source,
  physician_facing,
  metadata
)
SELECT
  d.id,
  (d.metadata ->> 'skill_index')::integer,
  col.column_index,
  0.125,
  'onet_skill_wiring',
  'salvage_claude_stage4',
  false,
  jsonb_build_object(
    'mapping_version', 'salvage-stage4-v1',
    'skill_index', (d.metadata ->> 'skill_index')::integer,
    'spread', 'row'
  )
FROM public.reference_descriptors d
CROSS JOIN generate_series(0, 7) AS col(column_index)
WHERE d.descriptor_source = 'onet'
  AND d.descriptor_type = 'onet_skill_bundle'
  AND d.is_active = true
ON CONFLICT (descriptor_id, row_index, column_index, specialty, subspecialty, career_stage) DO NOTHING;
-- =============================================================================
-- 7. lattice_cell_descriptors — rank matrix → lattice cells
-- =============================================================================

INSERT INTO public.lattice_cell_descriptors (
  descriptor_id,
  row_index,
  column_index,
  descriptor_weight,
  mapping_type,
  mapping_source,
  physician_facing,
  metadata
)
SELECT
  d.id,
  (d.metadata ->> 'skill_index')::integer,
  (d.metadata ->> 'domain_index')::integer,
  (d.metadata ->> 'rank_weight')::numeric,
  'domain_skill_rank',
  'salvage_claude_rank_matrix',
  false,
  jsonb_build_object(
    'mapping_version', 'salvage-rank-matrix-v1',
    'rank', (d.metadata ->> 'rank')::integer
  )
FROM public.reference_descriptors d
WHERE d.descriptor_source = 'fiscmak_lattice'
  AND d.descriptor_type = 'domain_skill_rank'
  AND d.is_active = true
ON CONFLICT (descriptor_id, row_index, column_index, specialty, subspecialty, career_stage) DO NOTHING;
-- =============================================================================
-- 8. specialty_lattice_profiles — enrich existing psychiatry profiles (anchors)
-- =============================================================================

UPDATE public.specialty_lattice_profiles AS p
SET
  metadata = p.metadata || v.patch,
  updated_at = now()
FROM (
  VALUES
    (
      'psychiatry:resident',
      '{"primary_soc_internal":"29-1223.00","salvage_version":"subspecialty-anchor-v1","profile_version":"specialty-v0-salvage"}'::jsonb
    ),
    (
      'psychiatry:attending',
      '{"primary_soc_internal":"29-1223.00","salvage_version":"subspecialty-anchor-v1","profile_version":"specialty-v0-salvage"}'::jsonb
    ),
    (
      'psychiatry:academic',
      '{"primary_soc_internal":"29-1223.00","salvage_version":"subspecialty-anchor-v1","profile_version":"specialty-v0-salvage"}'::jsonb
    ),
    (
      'psychiatry:community',
      '{"primary_soc_internal":"29-1223.00","salvage_version":"subspecialty-anchor-v1","profile_version":"specialty-v0-salvage"}'::jsonb
    ),
    (
      'psychiatry:consultation_liaison',
      '{"primary_soc_internal":"29-1223.00","anchor_soc_internal":"11-9111.00","anchor_alpha":0.20,"anchor_tier":2,"hidden_function_hint":"hospital systems coordination and medical-psychiatric interface","salvage_version":"subspecialty-anchor-v1","profile_version":"specialty-v0-salvage"}'::jsonb
    ),
    (
      'psychiatry:emergency',
      '{"primary_soc_internal":"29-1223.00","salvage_version":"subspecialty-anchor-v1","profile_version":"specialty-v0-salvage","hidden_function_hint":"crisis operations and acute stabilization"}'::jsonb
    )
) AS v(profile_key, patch)
WHERE p.profile_key = v.profile_key
  AND p.is_active = true;
-- =============================================================================
-- 9. specialty_lattice_profiles — new psychiatry subspecialty profiles (CSV salvage)
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
) VALUES
  (
    'psychiatry:child_adolescent',
    'Psychiatry',
    'Child and Adolescent Psychiatry',
    NULL,
    NULL,
    'Child and Adolescent Psychiatry',
    'Expected-work emphasis for developmental and youth-focused psychiatric practice.',
    'Salvaged subspecialty anchor metadata from Claude CSV; sparse v0 cell scaffold.',
    '{"primary_soc_internal":"29-1223.00","anchor_soc_internal":"25-2054.00","anchor_alpha":0.20,"anchor_tier":2,"hidden_function_hint":"developmental education and family systems support","salvage_version":"subspecialty-anchor-v1","profile_version":"specialty-v0-salvage"}'::jsonb
  ),
  (
    'psychiatry:addiction',
    'Psychiatry',
    'Addiction Psychiatry',
    NULL,
    NULL,
    'Addiction Psychiatry',
    'Expected-work emphasis for addiction psychiatry and recovery-oriented care.',
    'Salvaged subspecialty anchor metadata from Claude CSV; sparse v0 cell scaffold.',
    '{"primary_soc_internal":"29-1223.00","anchor_soc_internal":"21-1011.00","anchor_alpha":0.20,"anchor_tier":2,"hidden_function_hint":"recovery systems and substance-use treatment pathways","salvage_version":"subspecialty-anchor-v1","profile_version":"specialty-v0-salvage"}'::jsonb
  ),
  (
    'psychiatry:forensic',
    'Psychiatry',
    'Forensic Psychiatry',
    NULL,
    NULL,
    'Forensic Psychiatry',
    'Expected-work emphasis for forensic and legal-psychiatric interface work.',
    'Salvaged subspecialty anchor metadata from Claude CSV; sparse v0 cell scaffold.',
    '{"primary_soc_internal":"29-1223.00","anchor_soc_internal":"19-4092.00","anchor_alpha":0.20,"anchor_tier":2,"hidden_function_hint":"legal-medical interface and structured forensic analysis","salvage_version":"subspecialty-anchor-v1","profile_version":"specialty-v0-salvage"}'::jsonb
  ),
  (
    'psychiatry:geriatric',
    'Psychiatry',
    'Geriatric Psychiatry',
    NULL,
    NULL,
    'Geriatric Psychiatry',
    'Expected-work emphasis for geriatric psychiatry and aging-population care.',
    'Salvaged subspecialty anchor metadata from Claude CSV; sparse v0 cell scaffold.',
    '{"primary_soc_internal":"29-1223.00","anchor_soc_internal":"21-1015.00","anchor_alpha":0.20,"anchor_tier":2,"hidden_function_hint":"rehabilitation-oriented aging and long-term care systems","salvage_version":"subspecialty-anchor-v1","profile_version":"specialty-v0-salvage"}'::jsonb
  )
ON CONFLICT (profile_key) DO UPDATE SET
  metadata = specialty_lattice_profiles.metadata || EXCLUDED.metadata,
  source_summary = EXCLUDED.source_summary,
  updated_at = now();
-- =============================================================================
-- 10. specialty_lattice_profile_cells — new psychiatry subspecialty sparse cells
-- =============================================================================

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
  jsonb_build_object('profile_version', 'specialty-v0-salvage', 'ontology_version', 'expected-work-salvage-v1')
FROM public.specialty_lattice_profiles p
JOIN (
  VALUES
    -- psychiatry:child_adolescent
    ('psychiatry:child_adolescent', 3, 0, 0.200, 'Developmentally attuned communication with youth and caregivers.'),
    ('psychiatry:child_adolescent', 0, 0, 0.180, 'Age-specific diagnostic assessment and treatment planning.'),
    ('psychiatry:child_adolescent', 6, 1, 0.140, 'Collaboration with schools, families, and multidisciplinary teams.'),
    ('psychiatry:child_adolescent', 1, 2, 0.100, 'Developmental psychopathology and evidence-based youth treatments.'),
    ('psychiatry:child_adolescent', 4, 4, 0.120, 'Advocacy for youth mental health access and family support.'),
    ('psychiatry:child_adolescent', 5, 6, 0.100, 'Systems navigation across pediatric and behavioral health services.'),
    ('psychiatry:child_adolescent', 7, 7, 0.080, 'Reflective practice in emotionally demanding youth care.'),
    ('psychiatry:child_adolescent', 2, 1, 0.080, 'Teaching families and trainees about developmental behavioral health.'),

    -- psychiatry:addiction
    ('psychiatry:addiction', 0, 0, 0.220, 'Direct addiction psychiatry treatment and recovery-oriented care.'),
    ('psychiatry:addiction', 3, 0, 0.160, 'Motivational and relapse-prevention communication.'),
    ('psychiatry:addiction', 5, 5, 0.120, 'Innovation in recovery program design and harm reduction.'),
    ('psychiatry:addiction', 6, 0, 0.140, 'Team-based care with counselors, peers, and primary care.'),
    ('psychiatry:addiction', 4, 4, 0.120, 'Advocacy for recovery resources and destigmatizing care.'),
    ('psychiatry:addiction', 1, 0, 0.100, 'Psychopharmacology for substance use and co-occurring disorders.'),
    ('psychiatry:addiction', 2, 6, 0.080, 'Outcome tracking and program quality improvement.'),
    ('psychiatry:addiction', 7, 7, 0.060, 'Sustainable practice in high-burden addiction settings.'),

    -- psychiatry:forensic
    ('psychiatry:forensic', 4, 0, 0.200, 'Structured forensic evaluation and expert reasoning.'),
    ('psychiatry:forensic', 3, 0, 0.180, 'Clear communication in legal and correctional contexts.'),
    ('psychiatry:forensic', 1, 0, 0.140, 'Risk assessment and medico-legal knowledge application.'),
    ('psychiatry:forensic', 5, 3, 0.120, 'Navigation of courts, corrections, and hospital legal systems.'),
    ('psychiatry:forensic', 4, 4, 0.100, 'Policy and justice-system advocacy where appropriate.'),
    ('psychiatry:forensic', 0, 0, 0.100, 'Clinical evaluation within forensic settings.'),
    ('psychiatry:forensic', 2, 2, 0.080, 'Case law-informed practice improvement and scholarship.'),
    ('psychiatry:forensic', 6, 6, 0.080, 'Safety and quality in secure treatment environments.'),

    -- psychiatry:geriatric
    ('psychiatry:geriatric', 0, 0, 0.220, 'Geriatric diagnostic assessment and longitudinal psychiatric care.'),
    ('psychiatry:geriatric', 3, 0, 0.160, 'Communication with older adults, families, and care partners.'),
    ('psychiatry:geriatric', 6, 0, 0.140, 'Coordination with primary care, neurology, and social services.'),
    ('psychiatry:geriatric', 1, 0, 0.120, 'Complex pharmacology and medical-psychiatric comorbidity knowledge.'),
    ('psychiatry:geriatric', 5, 6, 0.100, 'Safety, falls, and dementia-care pathway improvement.'),
    ('psychiatry:geriatric', 4, 4, 0.100, 'Advocacy for aging populations and caregiver support.'),
    ('psychiatry:geriatric', 7, 7, 0.100, 'Professional sustainability in long-term and post-acute care.'),
    ('psychiatry:geriatric', 2, 1, 0.060, 'Teaching trainees about geriatric behavioral health.')
) AS c(profile_key, row_index, column_index, expected_weight, rationale)
  ON p.profile_key = c.profile_key
WHERE p.is_active = true
ON CONFLICT (profile_id, row_index, column_index) DO NOTHING;
