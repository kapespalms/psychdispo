-- Expected Work layer (v2): lattice cell descriptor mappings.
--
-- Lane B — maps reference_descriptors onto the 8×8 FISCMAK lattice.
-- Not evidence. Not user-specific. Does NOT touch evidence spine.
--
-- Bridge: reference_descriptors → lattice_cell_descriptors → (future) specialty_lattice_profiles
-- Formula context: Expected Work − Actual Work = Product Signal (one-spine lattice).

-- -----------------------------------------------------------------------------
-- TABLE: lattice_cell_descriptors
-- -----------------------------------------------------------------------------

CREATE TABLE public.lattice_cell_descriptors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descriptor_id uuid NOT NULL REFERENCES public.reference_descriptors (id) ON DELETE CASCADE,
  row_index integer NOT NULL,
  column_index integer NOT NULL,
  descriptor_weight numeric NOT NULL DEFAULT 1.0,
  mapping_type text NOT NULL DEFAULT 'descriptor',
  mapping_source text NOT NULL DEFAULT 'manual_seed',
  specialty text,
  subspecialty text,
  career_stage text,
  physician_facing boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lattice_cell_descriptors_row_range CHECK (row_index >= 0 AND row_index <= 7),
  CONSTRAINT lattice_cell_descriptors_column_range CHECK (column_index >= 0 AND column_index <= 7),
  CONSTRAINT lattice_cell_descriptors_weight_positive CHECK (descriptor_weight > 0),
  CONSTRAINT lattice_cell_descriptors_unique_mapping UNIQUE NULLS NOT DISTINCT (
    descriptor_id,
    row_index,
    column_index,
    specialty,
    subspecialty,
    career_stage
  )
);
CREATE INDEX lattice_cell_descriptors_row_column_idx
  ON public.lattice_cell_descriptors (row_index, column_index);
CREATE INDEX lattice_cell_descriptors_descriptor_id_idx
  ON public.lattice_cell_descriptors (descriptor_id);
CREATE INDEX lattice_cell_descriptors_active_row_column_idx
  ON public.lattice_cell_descriptors (row_index, column_index)
  WHERE is_active;
CREATE INDEX lattice_cell_descriptors_specialty_context_idx
  ON public.lattice_cell_descriptors (specialty, subspecialty, career_stage)
  WHERE specialty IS NOT NULL OR subspecialty IS NOT NULL OR career_stage IS NOT NULL;
CREATE TRIGGER update_lattice_cell_descriptors_updated_at
  BEFORE UPDATE ON public.lattice_cell_descriptors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
COMMENT ON TABLE public.lattice_cell_descriptors IS
  'Maps reference descriptors to FISCMAK lattice cells (row_index × column_index). '
  'Descriptor/expected-work language only — not evidence_cell_weights.';
COMMENT ON COLUMN public.lattice_cell_descriptors.descriptor_weight IS
  'Mapping strength for this descriptor at this cell. Not evidence weight.';
COMMENT ON COLUMN public.lattice_cell_descriptors.specialty IS
  'Nullable scope filter for future specialty-specific overrides; NULL = global default.';
-- -----------------------------------------------------------------------------
-- Grants — authenticated read-only; service_role manages seeds/ETL
-- -----------------------------------------------------------------------------

GRANT SELECT ON public.lattice_cell_descriptors TO authenticated;
GRANT ALL ON public.lattice_cell_descriptors TO service_role;
REVOKE ALL ON public.lattice_cell_descriptors FROM anon;
-- -----------------------------------------------------------------------------
-- RLS — authenticated may read active mappings only; no writes
-- -----------------------------------------------------------------------------

ALTER TABLE public.lattice_cell_descriptors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read active lattice_cell_descriptors"
  ON public.lattice_cell_descriptors FOR SELECT
  TO authenticated
  USING (is_active = true);
-- No INSERT / UPDATE / DELETE policies for authenticated (default deny).

-- -----------------------------------------------------------------------------
-- Seed: ACGME competencies → relevant FISCMAK lattice cells (16 rows)
-- Primary + secondary cell per competency; weights sum to 1.0 per descriptor.
-- -----------------------------------------------------------------------------

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
  m.row_index,
  m.column_index,
  m.descriptor_weight,
  'competency',
  'manual_seed',
  true,
  jsonb_build_object(
    'mapping_version', 'lattice-map-v1',
    'competency_code', d.source_code,
    'cell_role', m.cell_role
  )
FROM public.reference_descriptors d
JOIN (
  VALUES
    ('PC',   0, 0, 0.60::numeric, 'primary'),
    ('PC',   0, 6, 0.40::numeric, 'secondary'),
    ('MK',   1, 0, 0.60::numeric, 'primary'),
    ('MK',   1, 2, 0.40::numeric, 'secondary'),
    ('PBLI', 2, 6, 0.60::numeric, 'primary'),
    ('PBLI', 2, 2, 0.40::numeric, 'secondary'),
    ('ICS',  3, 0, 0.55::numeric, 'primary'),
    ('ICS',  3, 1, 0.45::numeric, 'secondary'),
    ('PROF', 4, 4, 0.55::numeric, 'primary'),
    ('PROF', 4, 7, 0.45::numeric, 'secondary'),
    ('SBP',  5, 3, 0.55::numeric, 'primary'),
    ('SBP',  5, 6, 0.45::numeric, 'secondary'),
    ('IPC',  6, 1, 0.55::numeric, 'primary'),
    ('IPC',  6, 3, 0.45::numeric, 'secondary'),
    ('PPD',  7, 7, 0.60::numeric, 'primary'),
    ('PPD',  7, 1, 0.40::numeric, 'secondary')
) AS m(source_code, row_index, column_index, descriptor_weight, cell_role)
  ON d.source_code = m.source_code
WHERE d.descriptor_source = 'acgme'
  AND d.descriptor_type = 'competency'
  AND d.is_active = true;
-- -----------------------------------------------------------------------------
-- Seed: FISCMAK skill_row descriptors → full row span (8 × 8 = 64 rows)
-- Equal weight 0.125 per column within each skill row.
-- -----------------------------------------------------------------------------

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
  'skill_row',
  'manual_seed',
  true,
  jsonb_build_object(
    'mapping_version', 'lattice-map-v1',
    'skill_index', (d.metadata ->> 'skill_index')::integer,
    'spread', 'row'
  )
FROM public.reference_descriptors d
CROSS JOIN generate_series(0, 7) AS col(column_index)
WHERE d.descriptor_source = 'fiscmak_lattice'
  AND d.descriptor_type = 'skill_row'
  AND d.is_active = true
  AND d.metadata ? 'skill_index';
-- -----------------------------------------------------------------------------
-- Seed: FISCMAK domain_column descriptors → full column span (8 × 8 = 64 rows)
-- Equal weight 0.125 per row within each domain column.
-- -----------------------------------------------------------------------------

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
  row.row_index,
  (d.metadata ->> 'domain_index')::integer,
  0.125,
  'domain_column',
  'manual_seed',
  true,
  jsonb_build_object(
    'mapping_version', 'lattice-map-v1',
    'domain_index', (d.metadata ->> 'domain_index')::integer,
    'spread', 'column'
  )
FROM public.reference_descriptors d
CROSS JOIN generate_series(0, 7) AS row(row_index)
WHERE d.descriptor_source = 'fiscmak_lattice'
  AND d.descriptor_type = 'domain_column'
  AND d.is_active = true
  AND d.metadata ? 'domain_index';
