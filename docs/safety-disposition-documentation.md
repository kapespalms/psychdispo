# Safety disposition documentation — product spec

**Regulatory anchors:** Joint Commission NPSG 15.01.01 (suicide risk assessment and mitigation); VA/DoD Suicide Risk CPG 2024 (screen → assess → stratify → formulate → mitigate → disposition → transition); PsychDispo Addendum B (C-SSRS, Stanley-Brown, CALM, violence as risk factors + duty-to-protect, EMR off-ramp, clinician attestation).

**Scope:** Provider/chart copy and discharge packet clinician sections only. **Not** the patient 1-pager, Social Care Plan, or intake population flags.

**Safety domain gates (existing):** Each of Suicide / Homicide / Violence / Substances offers **In EMR · Help me document · No concern**. This spec applies when the clinician opens a domain and chooses **Help me document**, or when risk is moderate/high (suicide) or acute violence/homicide (Tier C).

---

## Three-tier presentation model

| Tier | When | What the clinician sees | Chart output |
|------|------|-------------------------|--------------|
| **A — Always** | Any safety domain engaged (not “No concern”) | Risk level + tool name + disposition one-liner in status/packet summary | `SAFETY SCREENING` block: tool result lines (C-SSRS level, homicide yes/no, violence factors) |
| **B — Help me document** | `safetyGate.* === "help"` | Collapsible **Document risk** accordion inside the expanded domain: 4–5 chip groups + ≤2 short narrative fields | Adds `PROTECTIVE FACTORS` and `CLINICAL FORMULATION` when filled |
| **C — Mod/high or ED** | C-SSRS moderate/high; violence/homicide acute yes; ED/inpatient full screen | Collaboration banner + required attestation + full mitigation block (Stanley-Brown, means/CALM, formulation) | Full `SAFETY INTERVENTIONS` + `RISK STRATIFICATION` + `TARASOFF` when applicable |

**Express outpatient:** Tier A only unless user picks “Help me document” on express safety gate → then Tier B inside domains. Tier C triggers same as full path when mod/high or acute violence.

---

## Section mapping (10 JC / VA-DoD elements)

### 1. Screening Result

| | |
|---|---|
| **When shown** | Tier A: domain not “No concern.” Tier B/C: `help` or `emr` with result captured. |
| **UI pattern** | Gate chips (In EMR / Help me document / No concern) → tool picker: C-SSRS level chips (suicide); yes/no acute (homicide/violence); AUDIT-C (substances). |
| **MECE** | Screening lives in L2 safety domains only — not duplicated in intake flags or Social Care. |
| **Maps to** | `suicideScreenNote()`, `homicideScreenNote()`, `violenceScreenNote()`, `substanceScreenNote()` → `buildChartText()` `SAFETY SCREENING`; `buildPacket()` Safety screening section. **Not** patient 1-pager. |
| **Less is more** | Express + “No concern” → one line “No concern.” EMR path → “Documented in EMR” + optional risk level. |

### 2. Risk Assessment Findings (domains)

| | |
|---|---|
| **When shown** | Tier B/C when `help`: suicide C-SSRS; violence factor chips; homicide acute question. |
| **UI pattern** | Multi-select chips (violence: weapons, prior violence, substance, command, identifiable target). No long forms. |
| **MECE** | Violence factors ≠ SUD screen (separate domain). Homicide acute ≠ violence factors (homicide = intent toward others; violence = behavioral risk screen). |
| **Maps to** | `violenceFactorsNote()` inline in screen notes; chart `Acute violence risk:` line. |
| **Less is more** | Low suicide risk → level chip only. No factor checklist unless violence = yes. |

### 3. Protective Factors

| | |
|---|---|
| **When shown** | Tier B: `suicide/help` or `violence/help`, inside **Document risk** accordion (optional). Tier C: encouraged when mod/high (not hard-required in v1). |
| **UI pattern** | 5–6 toggle chips: social support, reasons for living, treatment engagement, means already restricted, future orientation, family/community. |
| **MECE** | Distinct from mitigation (means restriction *actions* in interventions grid). Protective = existing strengths; mitigation = what we did today. |
| **Maps to** | `buildChartText()` → `PROTECTIVE FACTORS` section. **Not** packet patient sections. |
| **Less is more** | Express: omit unless accordion opened and chips selected. |

### 4. Risk Stratification (low / intermediate / high — JC required)

| | |
|---|---|
| **When shown** | Tier A always for suicide `help` or `emr` with level; homicide/violence use structured yes/no + factors (no pseudo-score). |
| **UI pattern** | C-SSRS: Low · Moderate · High chips (maps to low / intermediate / high for chart). |
| **MECE** | Single stratification source — C-SSRS level only for suicide; do not re-derive from PHQ-9 or intake flags. |
| **Maps to** | `buildChartText()` → `RISK STRATIFICATION` line; `suicideScreenNote()`; collaboration/attestation gating via `hiRisk()`. |
| **Less is more** | Tier A one-liner: `C-SSRS MODERATE`. Full label in chart copy only. |

### 5. Clinical Formulation narrative (“why”)

| | |
|---|---|
| **When shown** | Tier B optional; Tier C recommended when mod/high or acute violence/homicide. |
| **UI pattern** | Two text areas max (driving factors; mitigating factors), ~2 sentences each, inside **Document risk** accordion. |
| **MECE** | Formulation ≠ disposition rationale (L3 LOC) ≠ Social Care context line. |
| **Maps to** | `S.riskFormulation.driving` / `.mitigating` → `buildChartText()` `CLINICAL FORMULATION`. |
| **Less is more** | Blank allowed on Express; chart omits section if empty. |

### 6. Risk Mitigation Plan (safety plan, means, support person)

| | |
|---|---|
| **When shown** | Tier C: `needsInterventionQuestions()` — mod/high C-SSRS or violence yes. |
| **UI pattern** | Existing `#safetyInterventions` grid: Stanley-Brown done, firearm/meds/other means chips. Support person = warm handoff + follow-up resource (L5/L6). |
| **MECE** | Mitigation actions here; protective chips in §3; crisis lines on patient sheet are operational, not narrative duplication. |
| **Maps to** | `buildChartText()` `SAFETY INTERVENTIONS`; `buildPacket()` Safety interventions. **Not** patient 1-pager narrative blocks. |
| **Less is more** | Low suicide risk → interventions hidden. Express “No concern” → skip entire grid. |

### 7. Disposition Decision and Rationale

| | |
|---|---|
| **When shown** | Tier A always (L1/L3 disposition + pathway). |
| **UI pattern** | Disposition LOC buttons (community/residential); pathway ED vs outpatient. Rationale = auto-composed one-liner from setting + LOC + risk gates. |
| **MECE** | LOC choice is L1; not repeated in safety accordion. Risk gates *inform* disposition but do not replace LOC picker. |
| **Maps to** | `buildChartText()` `DISPOSITION`; `buildPacket()` Disposition section. |
| **Less is more** | Express: LOC + “Outpatient express” tagline. Full rationale in chart copy, not safety slide. |

### 8. Tarasoff / duty to protect

| | |
|---|---|
| **When shown** | Homicide `help` + acute yes; Violence `help` + acute yes + identifiable target factor (Tier B/C). |
| **UI pattern** | Chip group inside expanded homicide/violence domain: victim warned · law enforcement notified · hold · N/A no identifiable victim. |
| **MECE** | Legal duty documentation only for homicide/violence; suicide domain does not show Tarasoff. |
| **Maps to** | `buildChartText()` `TARASOFF / DUTY TO PROTECT`; homicide/violence screen notes reference duty when acute. |
| **Less is more** | No acute risk → section omitted from chart. |

### 9. Transition of Care

| | |
|---|---|
| **When shown** | L5/L6 always when plan complete (partial today). |
| **UI pattern** | Follow-up resource, appointment scheduled, warm handoff, PCP/pharmacy, 72h callback — existing L6 fields. |
| **MECE** | Transition = coordination block; not re-entered in safety accordion. Social Care Plan covers SDOH handoff separately. |
| **Maps to** | `buildChartText()` `FOLLOW-UP` + `COORDINATION`; `buildPacket()` Follow-up section. |
| **Less is more** | Express: primary follow-up phone hero only on patient sheet; full transition in chart copy. |

### 10. Capacity and Engagement

| | |
|---|---|
| **When shown** | **Not in safety slide v1** — reference content in Psych Ref §1E; chart stub when engagement captured via formulation chip “treatment engagement” or warm handoff = yes. |
| **UI pattern** | Future: optional chip in Document risk or L6 “Patient had capacity for discharge decision: Y/N.” v1: formulation + warm handoff proxy only. |
| **MECE** | Capacity ≠ collaboration attestation (attestation = trained clinician review of risk, not Appelbaum capacity). |
| **Maps to** | Chart: `Warm handoff:` line; optional future `CAPACITY` block. **Not** patient 1-pager. |
| **Less is more** | Defer formal 4-component capacity UI to Phase 2; avoid duplicate with attestation checkbox. |

---

## Domain applicability matrix

| Section | Suicide | Homicide | Violence |
|---------|---------|----------|----------|
| 1 Screening result | C-SSRS | Acute yes/no | Acute yes/no + factors |
| 2 Risk findings | C-SSRS severity | Acute risk | Factor chips |
| 3 Protective factors | ✓ Document risk | — | ✓ Document risk |
| 4 Stratification | C-SSRS L/M/H | Structured (acute) | Structured (acute + factors) |
| 5 Formulation | ✓ | — (use violence/homicide notes) | ✓ |
| 6 Mitigation | Safety plan + means | Hold/ED if acute | Attestation + plan if yes |
| 7 Disposition | ✓ (shared LOC) | ✓ | ✓ |
| 8 Tarasoff | — | ✓ when acute yes | ✓ when acute yes |
| 9 Transition | ✓ (shared L5/L6) | ✓ | ✓ |
| 10 Capacity | Proxy via engagement chip | Proxy | Proxy |

**Substances domain:** AUDIT-C screen only; links to SUD resources, not suicide/violence documentation tree.

---

## UX wireframe (markdown)

### L2 Safety Review — layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Collaboration banner — mod/high or violence yes]            │
├─────────────────────────────────────────────────────────────┤
│ ▼ Suicide          [pill: Help me document]                 │
│   ┌─────────┬──────────────┬────────────┐                   │
│   │ In EMR  │ Help document│ No concern │                   │
│   └─────────┴──────────────┴────────────┘                   │
│   C-SSRS: [Low] [Moderate] [High]          ← Tier A         │
│   ▶ Document risk                          ← Tier B accordion│
│     Protective: [Support][Reasons][Engaged][Means][Future]  │
│     Driving:   [________________________]  ≤2 sentences     │
│     Mitigating:[________________________]                   │
├─────────────────────────────────────────────────────────────┤
│ ▼ Homicide       [pill: …]                                   │
│   … gate chips …                                             │
│   Acute homicide risk? [Yes] [No]                            │
│   Tarasoff: [Warned][LE notified][Hold][N/A]  ← if Yes      │
├─────────────────────────────────────────────────────────────┤
│ ▼ Violence       [pill: …]                                   │
│   … gate chips …                                             │
│   Acute violence? [Yes] [No]                                 │
│   Factors: [Weapons][Prior][Substance][Command][Target]      │
│   ▶ Document risk (same as suicide)                          │
│   Tarasoff chips (if Yes)                                    │
├─────────────────────────────────────────────────────────────┤
│ #safetyInterventions — Stanley-Brown + means    ← Tier C     │
│ [ ] Reviewed with trained clinician                          │
└─────────────────────────────────────────────────────────────┘
```

### Chart copy structure (`buildChartText`)

```
DISPOSITION
…
SAFETY SCREENING          ← Tier A
…
RISK STRATIFICATION       ← Tier A (suicide help)
…
PROTECTIVE FACTORS        ← Tier B (optional)
…
CLINICAL FORMULATION      ← Tier B (optional)
…
SAFETY INTERVENTIONS      ← Tier C
…
TARASOFF / DUTY TO PROTECT ← homicide/violence acute
…
COORDINATION / FOLLOW-UP  ← §9
…
```

### Express path

```
Anything to document for safety?
[No concern] [In EMR] [Help me document]
  → if Help: show domain rows (homicide hidden in express)
  → Tier B accordion optional; Tier C if mod/high
```

---

## Implementation status (this pass)

| Item | Status |
|------|--------|
| Product spec (this document) | ✓ |
| UX wireframe | ✓ (above) |
| `S.riskFormulation` + UI in suicide/violence `help` | ✓ code |
| `buildChartText` PROTECTIVE FACTORS / CLINICAL FORMULATION | ✓ code |
| Tarasoff chips + chart section for homicide/violence acute | ✓ code |
| Formal capacity UI (§10) | Spec only — Phase 2 |
| Patient 1-pager changes | Explicitly out of scope |

---

## Acceptance (aligned with Addendum B)

- [ ] ED/inpatient always full screen; outpatient acute gate preserved
- [x] C-SSRS stratification drives attestation and interventions
- [x] Violence/homicide = factors + Tarasoff, not predictive score
- [x] EMR off-ramp preserves result-only documentation
- [x] Chart copy carries JC/VA-DoD narrative elements without bloating patient handout
- [ ] Capacity 4-component UI (deferred)
