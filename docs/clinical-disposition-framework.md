# Clinical disposition framework — unified product spec

**PsychDispo flow:** Screen → Assess → Stratify → Mitigate → Decide → **Bridge** → Monitor  
**Regulatory anchors:** Joint Commission NPSG 15.01.01; VA/DoD Suicide Risk CPG 2024; ASAM Criteria (SUD LOC); 42 CFR Part 2 (substance records).  
**Companion doc:** [safety-disposition-documentation.md](./safety-disposition-documentation.md) (JC/VA 10-section detail).

**Scope split**
- **Chart copy / provider packet** — risk narrative, ASAM snapshot, transition-of-care, Tarasoff.
- **Patient safety handout (1-pager)** — crisis numbers, follow-up phone, plain-language steps, life-stage SPI footer.
- **Not on patient 1-pager** — C-SSRS level labels, formulation, Tarasoff, ASAM dimensions, protective-factor chips, clinician attestation.

---

## A. Safety domains UI map

Four gates on L2 Safety Review: **Suicide · Homicide · Violence · Substances**. Each offers **In EMR · Help me document · No concern**.

### Three-tier presentation

| Tier | When | UI | Chart |
|------|------|-----|-------|
| **A — Always** | Domain not “No concern” | Gate pill + tool result (C-SSRS level, acute Y/N, AUDIT-C) | `SAFETY SCREENING` |
| **B — Help me document** | `safetyGate.* === "help"` | Document risk accordion (protective chips + ≤2 formulation fields); domain-specific chips | + `PROTECTIVE FACTORS`, `CLINICAL FORMULATION`, substances ASAM snapshot |
| **C — Mod/high or ED** | C-SSRS moderate/high; violence/homicide acute yes; ED pathway | Collaboration banner + attestation + means grid (Stanley-Brown, firearms, meds) | + `SAFETY INTERVENTIONS`, `RISK STRATIFICATION`, `TARASOFF` |

**Express outpatient:** Tier A by default; Tier B if “Help me document”; Tier C when mod/high or acute violence. **Handoff transition chips (Phase 6)** shown on Express when suicide engaged, mod/high, or ED — not full safety accordion bloat.

### JC 10-section applicability by domain

| § | Suicide | Homicide | Violence | Substances |
|---|---------|----------|----------|------------|
| 1 Screening | C-SSRS | Acute Y/N | Acute + factors | Tool chip + result |
| 2 Findings | C-SSRS severity | Acute | Factor chips | ASAM snapshot chips |
| 3 Protective | ✓ accordion | — | ✓ accordion | — |
| 4 Stratification | C-SSRS L/M/H | Structured acute | Structured acute | Positive/negative screen |
| 5 Formulation | ✓ optional | — (use screen notes) | ✓ optional | Intoxication as dynamic factor (chart line) |
| 6 Mitigation | Safety plan + means | Hold/ED if acute | Plan if yes | Withdrawal concern; link to detox resources |
| 7 Disposition | Shared LOC (L1/L3) | Shared | Shared | Link ASAM LOC if IOP/residential flagged |
| 8 Tarasoff | — | ✓ acute yes | ✓ acute yes | — |
| 9 Transition | **L6 Transition of Care block** | Shared | Shared | Warm handoff to SUD program |
| 10 Capacity | Proxy: engagement chip, warm handoff | Proxy | Proxy | — (defer formal UI) |

---

## B. Life-stage SPI branching

SPI = Stanley-Brown Safety Planning (6 steps). PsychDispo adapts **patient handout footer** and **resource auto-match**, not a duplicate SPI form.

| Life stage / flag | SPI adaptation | Product behavior |
|-------------------|----------------|------------------|
| **Child / adolescent** | ASCP-style: caregiver in means restriction + “people who help” | Footer: share plan with parent/caregiver; means steps include trusted adult. Pediatric crisis lines auto-ranked. |
| **Geriatric** | Isolation + community services in plan | Footer: include trusted person; AAA / Eldercare / Meals / transport from Panel G + 211. Chart: note social isolation if formulation used. |
| **I/DD** (`flags.idd`) | Visual/concrete plan + teach-back | Spec: patient sheet uses picture-friendly layout (future); chart note “visual safety plan + teach-back documented.” Low-literacy plain language via `plain()` blurbs. |
| **Low literacy** | Plain language, teach-back | FKGL gates on L5/L6; no clinical jargon on 1-pager. |

### Pathway differences

| Pathway | Safety UI | Transition (Phase 6) |
|---------|-----------|----------------------|
| **ED / Acute** | Full four domains; Tier C default for mod/high | Transition block **always**; bridging appt required documentation |
| **Full outpatient** | Acute concern gate → full screen | Transition when suicide engaged or mod/high |
| **Express outpatient** | Express safety gate (suicide/violence/substances); homicide hidden | Tier A + **transition chips only** on Handoff |

**Not in product:** no-suicide contract (explicitly excluded).

---

## C. Phase 6 — Transition of Care (product centerpiece)

**Evidence:** Post-discharge window highest risk; **72 h structured follow-up** (~45% ED revisit reduction); **7-day bridging appointment** (NCQA); warm handoff; means verification; support-person engagement.

**UI location:** L6 Handoff — `transitionOfCareBlock` (visible when suicide domain engaged, ED pathway, or mod/high C-SSRS).

**Interaction model:** Toggle chips + ≤2 short fields (no new wizard).

| Element | UI | Chart `TRANSITION OF CARE` |
|---------|-----|----------------------------|
| Bridging appt scheduled | Chip + optional With / When | Yes — name · date/time |
| 72 h callback plan | Chip + optional who-calls-whom line | Yes — detail |
| Warm handoff done | Chip (+ syncs `S.warm`) + one-line note | Yes — detail |
| Support person engaged | Chip | Yes/— |
| Means plan enacted | Chip (counseling **enacted**, not discussed) | Yes/— |
| Crisis resources | Auto | “988 on patient handout” |

**MECE:** Transition lives on Handoff only — not re-entered in safety accordion. L5 follow-up referral supplies phone; transition block documents **coordination actions**. Social Care Plan covers SDOH separately.

**Express:** Same chip row; no extra narrative fields required to proceed.

---

## D. Substances domain — ASAM documentation

When **Substances → Help me document**:

1. **Tool chip:** AUDIT-C · CRAFFT · SBIRT · In EMR  
2. **Result:** Positive / Negative (existing)  
3. **Withdrawal concern:** Y/N  
4. **ASAM snapshot chips (chart only, not full 6 dimensions):** Intoxication/withdrawal · Psych co-occurring · Environment/recovery  
5. **Integrated risk chart line:** “Document intoxication/withdrawal as acute dynamic factor for suicide/violence risk.”  
6. **LOC link:** If intake LOC is IOP/PHP/residential, chart references disposition LOC — formal ASAM LOC assessment remains in EMR.  
7. **42 CFR Part 2:** Substance documentation stays in chart copy / provider packet — not on patient 1-pager or CBO resource handoff.

---

## E. Patient 1-pager vs safety handout

### Belongs on patient safety handout (1-pager)

- 988 / 911 / regional crisis lines  
- Nearest ED/PES (when appropriate)  
- **Your follow-up** hero (program name + phone + appt date if scheduled)  
- Plain-language “If you feel unsafe” and “Go to ER if” bullets  
- Selected care + daily-needs resources (plain blurbs)  
- **SPI life-stage footer** (child: caregiver; geriatric: trusted person + 211) when suicide domain engaged  
- Social Care “tonight” block when completed  

### Do NOT put on patient 1-pager

- C-SSRS level (Low/Moderate/High)  
- Homicide/violence screen details or Tarasoff actions  
- Protective factors / clinical formulation  
- ASAM dimensions or withdrawal scores  
- AUDIT-C positive/negative label (use “your care team discussed alcohol/drugs” if needed — optional future)  
- Transition-of-care chip checklist (chart only)  
- Clinician attestation or collaboration notes  
- No-suicide contract  

### Provider packet / chart copy carries

All JC/VA sections, ASAM snapshot, `TRANSITION OF CARE`, Tarasoff, means restriction narrative, PCP/pharmacy coordination.

---

## Implementation status

| Item | Status |
|------|--------|
| Unified spec (this document) | ✓ |
| Prior 10-section spec | ✓ [safety-disposition-documentation.md](./safety-disposition-documentation.md) |
| L6 Transition of Care block + chart section | ✓ code |
| SPI child/geriatric patient footer | ✓ code |
| Substances tool + ASAM snapshot + withdrawal | ✓ code |
| I/DD visual SPI layout | Spec only |
| Formal capacity 4-component UI | Spec only — Phase 2 |
| 72 h callback automated scheduling | Out of scope — documentation chip only |

---

## Seven-phase mapping to PsychDispo steps

| Phase | PsychDispo step | Primary UI |
|-------|-----------------|------------|
| 1 Screen | L2 safety gates | Domain toggles + tools |
| 2 Assess | L2 help reveals | C-SSRS, factors, AUDIT-C |
| 3 Stratify | L2 + chart | Risk level chips |
| 4 Mitigate | L2 interventions grid | Stanley-Brown, means |
| 5 Decide | L1 context | LOC + pathway |
| 6 Bridge | **L5 follow-up + L6 transition** | Referral + transition chips |
| 7 Monitor | Chart copy + PCP/callback defaults | 72 h callback, 7-day appt |
