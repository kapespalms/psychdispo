# PsychDispo Build Spec — Gap Analysis

**Date:** 2026-06-19 (revised after Phase 3 ship)  
**Spec source:** [`PsychDispo_Build_Spec.md`](./PsychDispo_Build_Spec.md) (Phases 1–4 + Addendum A + Addendum B)  
**Baseline commits:** `18a673c` (Phases 1–3 shell + dual-doc workflow), `f170cb9` (FKGL + safe-print publish gates), `0deb322` (Social Care Plan + `/social-care`). HEAD: `0deb322` — no newer mockup/library UI commits.

**Compared against:** `public/psychdispo.html`, Lovable shell (`src/routes`, `src/lib/auth.tsx`, `src/lib/plans.ts`), `scripts/` research deliverables, `.cursor/skills/research-verified-resources/`.

---

## Spec summary (1 page)

PsychDispo ships a **client-first, four-phase** roadmap: one shared trunk (clinical + social), **no PHI server-side**, patient text **≤ grade 5**, verified resources, tight printouts.

| Phase | Goal | Key deliverables |
|-------|------|------------------|
| **1** | Content model | `patient` block (blurb, cost, bring, hours, grade, lastVerified); FKGL checker + curation; blurbs on all patient outputs |
| **2** | Patient + handoff | One-page patient sheet; agency / resource handoff (consent, needs, no clinical detail) |
| **3** | Social Care Plan | Standalone tab + auto from flags; HRSN screener; DV safe-print; tonight vs ongoing; feeds Match → Generate |
| **4** | Accounts + library | Supabase/Clerk (optional); scaffold-only templates; library (templates, favorites, blurbs, preferences) |

**Addendum A:** Three documents — provider note, **referral cover** (blank PHI + attach face sheet), **patient sheet** (crisis, follow-up hero, Clinical vs Daily, icons, safe-print). Nearest ER from county/ZIP with override.

**Addendum B:** ED/inpatient full screen; outpatient acute gate; C-SSRS + Stanley-Brown + CALM; violence as risk factors + Tarasoff; **“Already in EMR?”** off-ramp; **collaboration banner + attestation** for moderate/high.

**Build order:** 1 → 2 → 3 → 4 (1–3 on static tool; backend last).

---

## Phase status (audit checklist)

| Phase / addendum | Status | Notes |
|------------------|--------|--------|
| **Phase 1** | **Partial** | `gradeOf` / `countSyllables`, `fkglChip`, print **publish gate** (>6 requires ack). `patientBlurbFor()` supports `patientBlurb` / `patient.blurb` + `plain()` fallback. **~5** curated `patientBlurb` keys in live `DATA`; **no** `lastVerified`, cost/bring/hours on cards; no curator meter / inline “My blurbs” UI. |
| **Phase 2** | **Mostly done** | `buildPatientOnePager()` — crisis → follow-up hero → Tonight block → Clinical (capped) → Daily needs → ER bullets. `buildReferralCover()` + L6 toggles. `buildResourceHandoffSheet()` optional. Gaps: strict one-page QA, ZIP-based ER override, fuller agency consent copy vs spec. |
| **Phase 3** | **Mostly done** | Tab + **`/social-care`** iframe route; auto-prompt/banner from psych flags; **HRSN** screener + **tonight vs ongoing**; DV **safe-to-print** checkbox; injects clinician summary, patient Tonight block, CBO handoff; `socialCare` state syncs to L6 packet. |
| **Phase 4** | **Partial** | Local email/password `auth.tsx` + `/plans` localStorage saves **full `S`**. No Supabase/Clerk, scaffold-only templates, library sections, or approved mockup UI. |
| **Addendum A** | **Mostly done** | Provider packet + copy-for-chart; referral cover; patient one-pager; SVG icons; `transportLine()`; sensitive-resource discreet print + publish gate. Gaps: ER geo override; large-print toggle; verification dates on handoffs. |
| **Addendum B** | **Partial** | C-SSRS, means/CALM, outpatient `#quickSafety` / `acuteConcern` skip, Tarasoff text. **Missing:** “Already in EMR?” path, moderate/high **collaboration banner**, required **attestation** before proceed, structured violence risk-factor checklist + validity caveat. |

---

## Already done ✓

| Area | Evidence |
|------|----------|
| **Core L0–L6 psych workflow** | `psychdispo.html` — context, safety, interventions, referrals, packet |
| **Dual-document + triple print bundle** | `buildPacket()` — provider page + optional `buildReferralCover()` + `buildPatientOnePager()` + optional `buildResourceHandoffSheet()` |
| **FKGL + publish gates** | `gradeOf`, `runPrintWithGates()`, `#publishGateOverlay` (f170cb9) |
| **Safe-print (LGBTQ+/DV)** | `safePrint`, `isSensitiveResource`, discreet labels, Social Care DV default |
| **Social Care Plan module** | Tab, overlay prompt, HRSN + tonight triage, handoff outputs (0deb322); `src/routes/social-care.tsx` |
| **Verified DATA corpus + research** | ~1,394 entries; skill + `scripts/resource-research-least-states.md`, transport guides |
| **Lovable shell + routes** | `/dispo`, `/directory`, `/emerg`, `/reference`, `/plans`, `/social-care`, sign-in/up |
| **Local save/resume** | Guest + per-email plans (`plans.ts`) |
| **App shell (18a673c)** | Build spec doc, resource-validation skill, TanStack route wiring |

---

## Still open (grouped)

| Area | Gap |
|------|-----|
| **Phase 1 content** | Backfill blurbs + `lastVerified` from research; canonical schema (`patient` block vs flat keys); grade chip on resource cards; block/suggest >6 in curation (not only at print) |
| **Phase 2 / A polish** | One-page print regression tests; ER ZIP override; large-print; wire more `transportPhone` from scripts |
| **Addendum B safety** | EMR off-ramp; collaboration banner + attestation for moderate/high suicide risk |
| **Phase 4** | Real auth; PHI-safe saves; template scaffold; library UI per spec §4.4 mockup |
| **Process** | Align blurb length rule (spec 220 chars vs skill ~80) before mass backfill |

---

## Conflicts / decisions (unchanged priority)

| Topic | Spec | Code today | Recommendation |
|-------|------|------------|----------------|
| **Patient field shape** | Nested `patient.*` | Flat `patientBlurb` + optional nested | Lock schema, then backfill |
| **Three documents** | Addendum A | Implemented in `buildPacket()` | Addendum A is source of truth |
| **Phase 4 saves** | Scaffold-only | Full `S` in localStorage | Strip instance fields before cloud sync |
| **Auth** | Supabase or Clerk | Local mock | Replace before multi-device library |

---

## Top 3 next builds

1. **Phase 1 blurb backfill** — Canonical fields, import from research deliverables, `lastVerified` on cards/handoffs, expand curated blurbs beyond ~5 entries; keep `plain()` fallback.
2. **Addendum B safety completion** — “Already in EMR?” off-ramp; collaboration banner + attestation when C-SSRS moderate/high before L4/L6 proceed.
3. **Phase 2/4 polish + template scaffold** — One-page patient QA, ER override, large-print; “Save as template” (scaffold-only) + library section stubs toward Phase 4 mockup.

*Defer Supabase/Clerk production auth until content + safety gates are stable.*

---

## Acceptance criteria snapshot

| Criterion | Status |
|-----------|--------|
| Curated blurb or flagged auto on every patient-doc resource | ✗ (~5 / ~1,394) |
| Grade chip; >6 blocked without override | ~ (print gate ✓; cards ✗) |
| `lastVerified` on card and handoff | ✗ |
| Patient page ≤1 page, spec zones | ~ (layout ✓; QA needed) |
| Referral cover 1 page, blank PHI, no clinical narrative | ~ ✓ |
| DV/LGBTQ suppress on print unless confirmed | ~ ✓ |
| Social module: standalone + auto, zero re-entry | ~ ✓ |
| HRSN + tonight/ongoing + DV gate | ~ ✓ |
| Logged-out full function; no PHI server-side | ~ (local saves still full state) |
| Save as template = scaffold only | ✗ |
| Three documents from one plan | ~ ✓ |
| ED/inpatient full screen; outpatient gate | ~ ✓ |
| EMR off-ramp; attestation moderate/high | ✗ |

---

*Revised gap analysis — workspace HEAD `0deb322`, 2026-06-19.*
