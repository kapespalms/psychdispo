# PsychDispo Build Spec — Gap Analysis

**Date:** 2026-06-19  
**Spec source:** [`PsychDispo_Build_Spec.md`](./PsychDispo_Build_Spec.md) (Phases 1–4 + Addendum A + Addendum B)  
**Compared against:** `public/psychdispo.html`, Lovable shell (`src/routes`, `src/lib/auth.tsx`, `src/lib/plans.ts`), `scripts/` research deliverables, `.cursor/skills/research-verified-resources/`, and canvases `psychdispo-dual-documents` + `psychdispo-social-ref-plan`.

---

## Spec summary (1 page)

PsychDispo’s build spec defines a **four-phase, client-first roadmap** with guardrails: MECE workflow (one shared trunk, clinical vs social tracks), **no PHI server-side**, patient text at **≤ grade 5**, curatable verified resources, and “less is more” printouts.

| Phase | Goal | Key deliverables |
|-------|------|------------------|
| **1** | Content model | `patient` block on resources (blurb, cost, bring, hours, grade, lastVerified); Flesch-Kincaid checker + curation UI; blurbs on patient/agency outputs |
| **2** | Patient + handoff | **One-page patient sheet** (crisis → follow-up → ER-if → top resources); **agency handoff** (patient-carried, consent, needs checkboxes, no clinical detail) |
| **3** | Social Care Plan | Standalone tab **or** auto-activate from social flags; **HRSN-aligned screener**; **DV safe-to-print gate**; **tonight vs ongoing** triage; feeds Match → Generate |
| **4** | Accounts + library | Supabase/Clerk auth (optional); schema with **no patient-identifier columns**; save **scaffold-only templates**; library UI (templates, favorites, blurbs, preferences) |

**Addendum A** supersedes the single handoff with **three documents**: provider note (copy-paste + print), referral cover (fax/email/print, blank PHI + attach face sheet), and patient sheet (crisis with nearest ER + ride, follow-up, **Clinical vs Daily needs** split, icons, safe-print gate for LGBTQ+/DV). Nearest ER auto from ZIP with override.

**Addendum B** adds an evidence-based **safety workflow**: ED/inpatient always full screen; outpatient acute-concern gate; C-SSRS + Stanley-Brown + CALM; violence as risk factors + duty-to-warn (not predictive score); **“Already in EMR?”** off-ramp; collaboration banner + attestation for moderate/high before proceed.

**Build order:** 1 → 2 → 3 → 4. Phases 1–3 ship on the static tool; Phase 4 adds backend last.

---

## Already done ✓

| Area | Evidence |
|------|----------|
| **Core L0–L6 psych workflow** | `psychdispo.html` — context, safety (L2), interventions (L4), referrals (L5), packet (L6) |
| **C-SSRS capture + risk levels** | L2 suicide screen with low/moderate/high; disposition text references C-SSRS |
| **Stanley-Brown + lethal means (CALM-style)** | L4: `planDone`, firearm/meds/other means checkboxes |
| **Outpatient acute-concern gate** | `#quickSafety` / `acuteConcern` — skips full screen when “No” (Addendum B partial) |
| **Violence + Tarasoff prompt** | L2C acute violence with duty-to-warn message |
| **Social need flags + Panel F** | `S.social` checkboxes (housing, food, transport, DV, financial, childcare, legal, employment); Panel F subgroups in `renderPanels()` |
| **Plain-language fallback** | `plain()` jargon map for patient-facing text |
| **`nearestED()`** | County-based ED pick; rendered in patient crisis table |
| **Provider chart text export** | `buildChartText()` + “Copy for chart” button |
| **Warm handoff UI** | Overlay with tap-to-call contacts at L5/L6 |
| **Packet variants** | Full / outpatient brief / consult stub |
| **Print CSS foundations** | `@page`, page breaks, `.patientpage`, unused `.doc-referral-cover` styles |
| **Verified DATA corpus** | ~1,394 entries in `psychdispo.html`; `clinical_verified.json` mirror; state expansion scripts |
| **Research pipeline (planned fields)** | `.cursor/skills/research-verified-resources/` documents `patientBlurb`, `transportPhone`, verification rules |
| **Research deliverables** | `scripts/resource-research-least-states.md`, transport guides, state deep-dive tooling |
| **Lovable shell + routes** | `/dispo`, `/directory`, `/emerg`, `/reference`, `/plans`, sign-in/up |
| **Local save/resume** | Guest + per-email localStorage plans (`psychdispo-plan-v1`, `plans.ts`) |
| **Dual-documents & social-ref canvases** | Implementation plans aligned with Addendum A layout and social incorporation |

---

## Partially done ~

| Spec item | Current state | Gap |
|-----------|---------------|-----|
| **Phase 1 — patient blurbs** | `plain(svc)` fallback; skill/scripts draft `patientBlurb` | **Zero** `patientBlurb` / `patient` blocks in live DATA; no `lastVerified`, `cost`, `callFirst`, `bring` |
| **Phase 1 — reading-level checker** | Skill mentions grade ≤5 | No `countSyllables` / `gradeOf` / publish gate / curator meter |
| **Phase 2 — one-page patient sheet** | Patient page exists but includes all selected refs, notes lines, generic 211 block | No 3–5 cap, no Clinical vs Social split, often >1 page |
| **Addendum A — three documents** | Clinician page + patient page; copy-for-chart ≈ provider note | **No referral cover sheet** in `buildPacket()` (CSS only); no separate print bundle options |
| **Addendum A — nearest ER** | `nearestED()` in crisis row | No ZIP/geo distance; no editable override field; not on provider resource table |
| **Addendum A — icons** | Emoji/panel headers in UI | No neutral SVG icon map on patient print |
| **Phase 2 / A — agency handoff** | Warm handoff **calling** UI only | No printable resource handoff / referral cover with needs checkboxes, consent, initials |
| **Phase 3 — Social Care Plan** | Social flags + Panel F inside psych flow | No standalone entry; no module name; no HRSN/Hunger Vital Sign screen |
| **Phase 3 — DV / safe-print gate** | DV checkbox + Panel F | No “safe to print?” prompt; DV/LGBTQ addresses not suppressed on print |
| **Phase 3 — tonight vs ongoing** | — | Not implemented |
| **Addendum B — safety workflow** | C-SSRS, means, outpatient gate | No **“Already in EMR?”** path; no collaboration **banner**; no **attestation** required for moderate/high; violence lacks structured risk-factor checklist + validity caveat |
| **Phase 4 — auth** | Local email/password in `auth.tsx` | Not Supabase/Clerk; not magic link/OAuth |
| **Phase 4 — saved library** | `/plans` lists saved plans | Saves **full `S` state** (not scaffold-only); no templates/blurbs/favorites/preferences sections; no PHI banner |
| **Phase 4 — no PHI** | Blank PHI on print id row | localStorage plans may contain workflow fields; no IndexedDB isolation; no RLS |

---

## Not started ✗

| Spec item | Notes |
|-----------|--------|
| **Flesch-Kincaid checker UI** | Meter, grade chip, hard stop >6, “suggest simpler” |
| **`patient` JSON schema in DATA** | Spec nested block vs flat `patientBlurb` in skill/canvas — needs one canonical shape |
| **`safePrint: false` gating** | LGBTQ+/DV suppress on print unless clinician confirms |
| **`ride` / transport line on patient rows** | `transportPhone` researched in scripts, not wired in HTML |
| **HRSN + Hunger Vital Sign screener** | Replace/enhance 8 checkboxes with validated one-screen domains |
| **Social Care Plan standalone tab** | Spec: enter with trunk only; canvas proposes `socialdispo.html` — neither built |
| **Referral cover (fax/email/print)** | To/From, LOC, services, insurance, blank patient fields, signature |
| **Provider note as first-class doc** | Monospace copy block + print layout per Addendum A (copy exists, layout partial) |
| **Large-print toggle** | Patient sheet accessibility |
| **Tonight vs ongoing resource grouping** | Patient page sections |
| **Curation: “My blurbs” panel** | Inline edit pre-accounts; library panel post-accounts |
| **Backend schema** | `clinician`, `template`, `blurb_override`, `favorite`, `preference` + RLS |
| **Save as template vs print/export** | Distinct actions; strip patient values on save |
| **Supabase Auth or Clerk** | Phase 4 provider choice still open |
| **IndexedDB for patient instances** | Spec guardrail — not used |

---

## Conflicts with current direction

| Topic | Build spec | Current codebase / canvases | Recommendation |
|-------|------------|----------------------------|----------------|
| **Patient field shape** | Nested `patient.{blurb, grade, lastVerified, …}` | Flat `patientBlurb`, `transportPhone`; skill + dual-doc canvas | **Pick one schema** before Phase 1 backfill; nested block matches spec; flat fields match existing research output |
| **Blurb length** | ≤220 chars, ≤2 sentences | Skill/canvas: ≤80 chars, ~12 words | Align checker + curation to spec (220) or amend spec to 80 |
| **Three documents vs “agency handoff”** | Addendum A: provider note + referral cover + patient sheet | Phase 2 text still says “agency handoff”; code is 2-page `.pk` | Treat Addendum A as source of truth (matches dual-documents canvas) |
| **Social module naming** | **Social Care Plan** | Social-ref canvas: “Social Safety Plan”, “Social SW Substitute”, `socialdispo.html` | Confirm naming with Kp (spec open decision #1); avoid collision with Stanley-Brown |
| **Social entry point** | Two doors in **one module** (standalone tab + auto from flags) | Social-ref plan: separate `socialdispo.html` route | Merge into spec’s “one module, two doors” unless SW workflow must stay fully separate |
| **Phase 4 save semantics** | Scaffold-only templates, no PHI | `savePlan()` persists entire `S` including any filled workflow values | **Breaking change** needed before cloud sync; add “Save as template” that strips instance fields |
| **Auth** | Supabase or Clerk, optional, HIPAA-upgrade path | localStorage mock auth with password in plain object | Replace before any multi-device library; do not sync current save format |
| **DATA file split** | `clinical_verified.json` / `wa_verified.json` | Single inline `DATA` in `psychdispo.html` (+ partial JSON extract) | Spec naming vs monolith — implementation detail, not product conflict |
| **Addendum B attestation / EMR path** | Required for moderate/high | Not in UI | Add when touching L2/L4; aligns with existing clinician training disclaimers in `#ref` |

**Alignment (no conflict):** Dual-documents canvas PHASE_ORDER and PATIENT_LAYOUT match Addendum A. Social-ref canvas HANDOFF_FIELDS match Phase 2 agency handoff intent. Research skill verification cadence matches spec guardrail #4 (curatable but verified).

---

## Recommended priority order (next 5 builds)

1. **Phase 1 foundation — schema + `blurbFor(r)`**  
   Canonical field model (`patient` block or agreed flat keys), `lastVerified` on cards, backfill blurbs from research deliverables + `plain()` fallback, show verified date on resource cards.

2. **Addendum A patient one-pager (Phase 2 core)**  
   `buildPatientOnePager()`: crisis (988 + regional + nearest ER + ride) → follow-up hero → Clinical (cap 4) → Daily needs (cap 3) → 3 ER bullets; strict print CSS one page; wire `transportPhone`.

3. **Referral cover + provider packet split (Addendum A docs 1 & 2)**  
   Implement `buildReferralCover()` using existing `.doc-referral-cover` CSS; L6 print options (Provider / Patient / Both); extend provider page with bucket-split resource table.

4. **Safe-print gate + DV/LGBTQ suppress (Phase 3 §3.3 + A.5)**  
   `safePrint:false` on sensitive resources; one prompt in flow; suppress addresses on print; “memorize this number” line.

5. **Reading-level checker + inline blurb edit (Phase 1.2 + 1.3)**  
   FKGL in JS, grade chip on cards, block publish >6; then Social Care Plan screener (HRSN) as follow-on build #6.

*Defer Phase 4 (Supabase/Clerk + library) until 1–3 are solid per spec dependency map.*

---

## Quick reference: spec acceptance criteria vs status

| Criterion | Status |
|-----------|--------|
| Every patient-doc resource shows curated blurb or “auto” flag | ✗ |
| Grade chip; nothing >6 publishes without override | ✗ |
| `lastVerified` on card and handoff | ✗ |
| Patient page ≤1 page, four zones only | ✗ (~ long multi-section page) |
| Agency/referral handoff 1 page, consent, no clinical detail | ✗ |
| DV suppresses resource details on print | ✗ |
| Social module standalone + auto-activate, zero re-entry | ~ / ✗ |
| HRSN screener + DV gate + tonight/ongoing | ✗ |
| Logged-out full function; no PHI server-side | ~ (local only; save format risky) |
| Save as template = scaffold only | ✗ |
| Three documents from one plan | ~ (2 + copy text) |
| ED/inpatient always full screen; outpatient gate | ~ |
| EMR off-ramp; attestation moderate/high | ✗ |

---

*Generated by gap analysis pass against workspace state 2026-06-19.*
