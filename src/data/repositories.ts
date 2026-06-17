export type Entry = {
  id: string;
  ref: string;
  title: string;
  summary?: string;
  blocks: Block[];
};

export type Block =
  | { kind: "prose"; heading?: string; body: string }
  | { kind: "steps"; heading: string; items: { ref: string; title: string; detail?: string }[] }
  | { kind: "kv"; heading: string; rows: { label: string; value: string }[] }
  | { kind: "table"; heading: string; columns: string[]; rows: string[][] }
  | { kind: "alert"; variant: "warning" | "info"; label: string; body: string };

export type Category = {
  id: string;
  ref: string;
  title: string;
  entries: Entry[];
};

export type Repository = {
  slug: "workflow" | "reference";
  number: string;
  title: string;
  tagline: string;
  description: string;
  categories: Category[];
};

export const repositories: Repository[] = [
  {
    slug: "workflow",
    number: "01",
    title: "Psych Dispo",
    tagline: "Structured guidance for psychiatric disposition and resource navigation",
    description:
      "Step-by-step: outpatient clinics, acute crisis contacts, psychotherapy options, and social considerations.",
    categories: [
      {
        id: "outpatient",
        ref: "1.1",
        title: "Risk Assessment",
        entries: [
          {
            id: "med-management",
            ref: "1.1.a",
            title: "Medication Management",
            summary: "Guidelines for outpatient psychiatric medication follow-up and monitoring.",
            blocks: [
              {
                kind: "steps",
                heading: "Follow-up schedule",
                items: [
                  { ref: "01", title: "Initial visit within 2 weeks of discharge", detail: "Assess tolerability, adherence, and early response." },
                  { ref: "02", title: "Monthly visits for first 3 months", detail: "Titrate doses, monitor side effects, check drug levels where indicated." },
                  { ref: "03", title: "Quarterly maintenance visits", detail: "Stable patients: refill, screening, relapse prevention." },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "psychotherapy",
        ref: "1.2",
        title: "Outpatient Psychiatry",
        entries: [
          {
            id: "therapy-modalities",
            ref: "1.2.a",
            title: "Therapy Modalities",
            summary: "Evidence-based psychotherapy options for outpatient psychiatric care.",
            blocks: [
              {
                kind: "table",
                heading: "Common Modalities",
                columns: ["Modality", "Best for", "Duration"],
                rows: [
                  ["Cognitive Behavioral Therapy (CBT)", "Depression, anxiety, PTSD", "12–16 sessions"],
                  ["Dialectical Behavior Therapy (DBT)", "Borderline personality, self-harm", "6–12 months"],
                  ["Interpersonal Therapy (IPT)", "Major depression, grief", "12–16 sessions"],
                  ["Acceptance & Commitment Therapy (ACT)", "Chronic pain, anxiety, avoidance", "8–12 sessions"],
                ],
              },
            ],
          },
        ],
      },
      {
        id: "iop-php",
        ref: "1.3",
        title: "IOP/PHP",
        entries: [
          {
            id: "iop-php-overview",
            ref: "1.3.a",
            title: "Intensive Outpatient & Partial Hospitalization",
            summary: "Structured programs for patients needing more support than standard outpatient care.",
            blocks: [
              {
                kind: "steps",
                heading: "When to consider",
                items: [
                  { ref: "01", title: "Significant functional impairment", detail: "Unable to work or attend school; needs daily structure." },
                  { ref: "02", title: "Incomplete response to outpatient care", detail: "Ongoing severe symptoms despite medication and therapy." },
                  { ref: "03", title: "Post-inpatient transition", detail: "High risk of readmission without intensive support." },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "social",
        ref: "1.4",
        title: "Social Resources",
        entries: [
          {
            id: "social-needs",
            ref: "1.4.a",
            title: "Social Needs & Support",
            summary: "Social determinants of health and community resources for psychiatric patients.",
            blocks: [
              {
                kind: "steps",
                heading: "Key domains to address",
                items: [
                  { ref: "01", title: "Housing stability", detail: "Screen for homelessness, housing insecurity, unsafe living conditions." },
                  { ref: "02", title: "Insurance & coverage", detail: "Verify Medicaid, Medicare, commercial coverage; connect to patient assistance." },
                  { ref: "03", title: "Transportation", detail: "Access to appointments, pharmacy, crisis services." },
                  { ref: "04", title: "Employment & disability", detail: "Vocational rehab, FMLA, disability paperwork as needed." },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "reference",
    number: "02",
    title: "Psych References",
    tagline: "High-yield clinical reference",
    description:
      "Comprehensive psychiatry reference: psychopharmacology, algorithms, diagnosis, and assessment.",
    categories: [
      {
        id: "psychopharm",
        ref: "2.1",
        title: "Psychopharmacology",
        entries: [],
      },
      {
        id: "algorithms",
        ref: "2.2",
        title: "Treatment Algorithms",
        entries: [
          {
            id: "antidepressant-algorithm",
            ref: "2.2.a",
            title: "Antidepressant Algorithm",
            summary: "Stepwise approach to pharmacologic management of major depressive disorder.",
            blocks: [
              {
                kind: "steps",
                heading: "Treatment steps",
                items: [
                  { ref: "01", title: "First-line SSRI or SNRI", detail: "Sertraline, escitalopram, or venlafaxine. Start low, titrate to therapeutic dose." },
                  { ref: "02", title: "Reassess at 4–6 weeks", detail: "If partial response: optimize dose. If no response: switch within class or to different class." },
                  { ref: "03", title: "Augmentation strategies", detail: "Add bupropion, mirtazapine, or atypical antipsychotic for partial response." },
                  { ref: "04", title: "Consider ECT or TMS", detail: "Treatment-resistant depression after 2 failed trials." },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "diagnostic-criteria",
        ref: "2.3",
        title: "Diagnostic Features",
        entries: [
          {
            id: "depression-criteria",
            ref: "2.3.a",
            title: "Major Depressive Disorder Criteria",
            summary: "DSM-5 diagnostic criteria for major depressive episode.",
            blocks: [
              {
                kind: "prose",
                body: "Five or more of the following symptoms present during the same 2-week period, representing a change from previous functioning; at least one symptom is either depressed mood or loss of interest/pleasure.",
              },
              {
                kind: "steps",
                heading: "Symptom checklist",
                items: [
                  { ref: "01", title: "Depressed mood most of the day, nearly every day" },
                  { ref: "02", title: "Markedly diminished interest or pleasure in activities" },
                  { ref: "03", title: "Significant weight change or appetite disturbance" },
                  { ref: "04", title: "Insomnia or hypersomnia" },
                  { ref: "05", title: "Psychomotor agitation or retardation" },
                  { ref: "06", title: "Fatigue or loss of energy" },
                  { ref: "07", title: "Feelings of worthlessness or excessive guilt" },
                  { ref: "08", title: "Diminished ability to think or concentrate" },
                  { ref: "09", title: "Recurrent thoughts of death or suicidal ideation" },
                ],
              },
              {
                kind: "alert",
                variant: "info",
                label: "Note",
                body: "Symptoms cause clinically significant distress or impairment in social, occupational, or other important areas of functioning. Not attributable to substances or another medical condition.",
              },
            ],
          },
        ],
      },
      {
        id: "assessment-tools",
        ref: "2.4",
        title: "Assessment Tools",
        entries: [],
      },
    ],
  },
];

export const getRepository = (slug: string) =>
  repositories.find((r) => r.slug === slug);
