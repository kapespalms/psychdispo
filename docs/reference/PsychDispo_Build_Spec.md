# PsychDispo — Build Spec (Phases 1–4)

**Scope:** plain-language blurbs + reading-level checker · trimmed patient packet + 1-page agency handoff · Social Care Plan module · accounts + saved-documents library.
**Build order:** 1 → 2 → 3 → 4 (each phase depends on the content model laid down by the one before).
**Audience:** implementers (Claude in this tool's `app_template.html`; Cursor for the Lovable shell + backend).

---

## 0 · Guardrails (apply to every phase)

1. **MECE workflow.** Shared trunk is entered once (context + person + need flags). Clinical and Social tracks hold mutually exclusive content. Match + Generate are shared. No field is collected in two places.
2. **No PHI server-side.** A specific patient's filled-in plan is rendered/printed client-side only (`IndexedDB`/in-memory). The account stores only clinician content. The schema has no patient-identifier columns.
3. **Patient-facing text ≤ grade 5**, short, verb-first, one idea per sentence. Enforced by the checker (Phase 1), not by hope.
4. **Curatable but verified.** Every resource and blurb carries a `lastVerified` date that is visible wherever it renders.
5. **Less is more.** If a line doesn't change what the patient or agency *does*, it doesn't print.

---

## Phase 1 · Plain-language blurbs + reading-level checker

**Why first:** it's the reusable content model that Phases 2–4 all consume, and it improves today's packet immediately.

### 1.1 Resource record — new patient-facing fields
Extend each resource object in the data file (`clinical_verified.json` / `wa_verified.json`) with a `patient` block:

```json
{
  "name": "Netcare Access",
  "phone": "614-276-2273",
  "patient": {
    "blurb": "A walk-in place for a mental health crisis. Open day and night. You do not need insurance.",
    "callFirst": false,
    "cost": "free",                // enum: "free" | "sliding" | "insurance" | "unknown"
    "bring": "Photo ID if you have one",
    "hours": "24/7",
    "grade": 4,                    // computed Flesch-Kincaid grade, stored at curation time
    "lastVerified": "2026-06-01"
  }
}
```

Rules:
- `blurb` ≤ 220 characters, ≤ 2 sentences.
- `bring`, `hours` are short fragments, not sentences.
- `cost` renders as a plain chip ("Free", "Sliding scale", "Use insurance").
- If `patient` is missing, fall back to the existing `plain()` translator (so nothing breaks pre-curation), but flag it as "auto — needs review."

### 1.2 Reading-level checker (JS, no dependency)
Implement Flesch-Kincaid Grade Level:

```
FKGL = 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
```

- `countSyllables(word)`: lowercase, strip non-alpha, count vowel groups, subtract silent trailing "e", floor at 1.
- `gradeOf(text)`: returns rounded FKGL.
- UI: a meter beside each blurb — `≤5` shows success ("Grade 4"); `>5` shows warning ("Grade 7 — simplify") and a one-tap "suggest simpler" that calls back to Claude (`sendPrompt`) or an inline rephrase.
- Block "publish blurb" if grade > 6 (hard stop) unless overridden by the curator.

### 1.3 Where blurbs render
Patient 1-page (Phase 2) and Agency handoff (Phase 2). Clinician summary keeps the clinical names. Curation surface = the library "My blurbs" panel (Phase 4); pre-accounts, expose an inline "edit blurb" in the resource card.

### 1.4 Acceptance criteria
- [ ] Every selected resource that appears on a patient document shows a curated blurb (or an explicit "auto" flag).
- [ ] Each blurb shows a grade chip; nothing above grade 6 publishes without override.
- [ ] `lastVerified` shows on the resource card and on the agency handoff.

---

## Phase 2 · Trim the patient packet + the 1-page agency handoff

**Why:** highest visible patient impact; uses Phase 1 blurbs.

### 2.1 Patient take-home — exactly one page, four blocks
Replace the current long patient page with **only**:

1. **Crisis numbers** (top, large): 988 + the matched local crisis line.
2. **Your follow-up**: who · when · where · phone (from the follow-up block).
3. **Go back to the ER if…**: 3 bullets max, plain language.
4. **Your resources**: top 3–5 selected, each = name + one-line blurb + phone (+ cost chip, "call first" if set).

Everything else (reasoning, all flags, screen scores, coordination) moves to the **clinician summary**, never the patient page.

Print CSS: force the patient page to a single physical page (`@page` + `break-inside: avoid` on blocks); add a large-print toggle (scale body font for low-vision/elderly).

### 2.2 The agency handoff — new 1-page sheet the patient hands to a resource
A referral cover letter, **patient-carried** (so it stays HIPAA-clean — the patient shares their own info).

Fields:
- Patient **first name or initials** (curator chooses; default initials) + date.
- **Needs at a glance**: checkbox row from the social-need flags (housing ☐ food ☐ transport ☐ benefits ☐ childcare ☐ legal ☐ employment ☐).
- **One plain line of context**: e.g., "Recently seen for a mental health visit, medically cleared."
- **Referring clinician / facility + callback number** for the agency.
- **Consent line** the patient signs ("I agree to share this with the program above.").
- Optional: the specific resource(s) being referred to, with the verified blurb.

DV rule: if a DV need is flagged, the handoff **must not** auto-print DV resources/addresses; show a "memorize, don't print" notice instead (see Phase 3 DV gate).

### 2.3 Acceptance criteria
- [ ] Patient page never exceeds one printed page; contains only the four blocks.
- [ ] Agency handoff prints on one page, contains no clinical detail beyond the one-line context, includes callback + consent line.
- [ ] DV-flagged cases suppress DV resource details on anything printed.

---

## Phase 3 · Social Care Plan module

**Why:** the new track; runs standalone (when no SW is available) and auto-incorporates into the dispo flow.
**Naming:** call it **Social Care Plan** (avoid collision with the clinical Stanley-Brown "Safety Plan").

### 3.1 Entry (two doors, one module)
- **Standalone tab** in the tool: enter the module directly with only the shared trunk (context + person), skip the clinical track.
- **Auto-incorporate**: when any social-need flag is set in the clinical flow, the Social Care Plan activates and folds into the same packet — no re-entry of trunk data.

### 3.2 Screener (anchor to a validated instrument)
Use the **CMS Accountable Health Communities HRSN** core domains (+ Hunger Vital Sign for food). One screen, each domain a yes/flag:
- Housing instability / homelessness
- Food insecurity (Hunger Vital Sign 2 items)
- Transportation
- Utilities
- Interpersonal safety (DV) — routes to the DV gate
- Plus existing: benefits/financial, childcare, legal, employment

Store as `social.needs{...}` flags — reuse the existing social checkboxes; this elevates them from an add-on to a first-class screen.

### 3.3 DV safe-to-print gate
If interpersonal-safety / DV is flagged:
- Prompt: "Safe to put DV resources on a printed sheet the patient carries?" Yes / No.
- **No (default):** suppress DV resources from all printed outputs; show "memorize this number" with the local DV hotline; add a discreet line only.
- Never list a shelter address on the agency handoff for a DV case.

### 3.4 Now vs. later triage
For each active need, classify **tonight** (shelter bed, food tonight, safety) vs **ongoing** (apply for SNAP/Medicaid/housing voucher, benefits enrollment). Render them in two groups on the patient page so immediate needs don't drown in process steps.

### 3.5 Output
Feeds the same Match → Generate engine: social resources matched from trunk + need flags, into the patient page ("Your resources") and the agency handoff ("Needs at a glance").

### 3.6 Acceptance criteria
- [ ] Module runs standalone with only trunk data; also auto-activates from clinical flags with zero re-entry.
- [ ] Screener maps to HRSN domains; DV flag triggers the gate.
- [ ] Outputs split tonight vs ongoing; DV gate governs what prints.

---

## Phase 4 · Accounts + saved-documents library

**Why last:** needs the content model settled; introduces backend, so it's the heaviest. Architecture = option (b) from the strategy brief — lightweight auth, **no PHI**.

### 4.1 Auth
- Magic link or Google/Apple OAuth via **Supabase Auth** or **Clerk** (pick one; both have a HIPAA upgrade path for later, but we sign **no BAA** now because we store no PHI).
- The SPA stays static; auth is optional — logged-out users keep full local functionality.

### 4.2 Schema (no patient-identifier columns anywhere)
```
clinician      ( id, email, display_name, created_at )
template       ( id, clinician_id, name, type[clinical|social], scenario_tag,
                 scaffold_json, updated_at )     -- scaffold_json holds field defaults & selected
                                                 -- resource ids ONLY; never patient values
blurb_override ( id, clinician_id, resource_key, blurb, cost, bring, hours, grade, last_verified )
favorite       ( id, clinician_id, resource_key )
preference     ( clinician_id, home_region, default_insurance, patient_language,
                 patient_sheet_len, large_print )
```
Row-level security: every row scoped to `clinician_id = auth.uid()`.

### 4.3 Save flow (two distinct actions, never blurred)
- **Save as template** — strips any patient-specific values, persists the scaffold (defaults + selected resource ids) to `template`. Available inside any plan.
- **Print / export** — renders the patient instance client-side and prints. Never uploaded.
- Persistent banner in the library: "Your library saves templates, blurbs, favorites — never patient information."

### 4.4 Library UI (per the approved mockup)
Sections, stacked: **Plan templates** (cards: name, type badge, edited date, use/duplicate/edit) · **Saved resources** (favorites with lastVerified) · **My blurbs** (text + grade chip + verified + edit) · **Preferences** (region, insurance, language, sheet length, large print).

### 4.5 Acceptance criteria
- [ ] Logged-out experience is fully functional and stores nothing server-side.
- [ ] No table/column can hold a patient identifier; RLS verified per clinician.
- [ ] "Save as template" persists scaffold only; patient values never leave the device.
- [ ] Templates pre-fill a new plan's trunk + selections without carrying patient data.

---

## Dependency map

```
Phase 1 (blurbs + grader)
   └─ feeds → Phase 2 (patient 1-page + agency handoff)
                 └─ both consumed by → Phase 3 (Social Care Plan outputs)
                                          └─ all curatable content saved by → Phase 4 (accounts/library)
```

Phases 1–3 are client-side and can ship on the static tool now. Phase 4 adds the only backend; defer until 1–3 are solid.

---

## Open decisions for Kp

1. **Naming:** confirm "Social Care Plan" (vs "Social Needs Plan") to avoid clashing with the clinical Safety Plan.
2. **Auth provider:** Supabase Auth vs Clerk for Phase 4.
3. **Agency handoff identity:** default to patient **initials** (recommended) or first name?
4. **Hard grade ceiling:** block publishing blurbs above grade 6 (recommended) or grade 5?

---

## Addendum A · Document set + resource model (decisions locked)

This addendum refines Phase 1–2 with requirements added after the first draft. It supersedes the earlier single "agency handoff" idea: there are now **three documents**.

### A.1 The three documents

| Document | Audience | Delivery | Contents |
|---|---|---|---|
| **Provider note ("For the chart")** | The clinician's own record | **Copy-paste plain text** + printable | Full clinical detail: setting, clearance, disposition, level of care (LOCUS/ASAM), safety screen results, interventions, referrals with phone/fax, nearest ER. A monospace block with a "Copy text" button. |
| **Referral cover** | Receiving program | **Fax · email · print** | To (program + fax/email), From (clinician, facility, callback), level of care requested, services needed, insurance, **blank patient fields + "attach face sheet" note** (we never store patient identifiers). Signature + date. |
| **Patient sheet** | The patient | Print (1 page) | 5th-grade. Crisis → follow-up → resources. See A.3. |

### A.2 Resource record — additional fields
Extend the `patient` block (Phase 1) and add structural fields:

```json
{
  "category": "clinical",         // "clinical" | "social"  (drives the split + color)
  "scenario": ["detox","rehab"],  // tags: detox, rehab, mat, lgbtq, support-group,
                                  //       food, housing, dv, benefits, transport, ...
  "address": "2616 Kwina Rd, Bellingham",
  "ride": { "name": "Whatcom Transit", "phone": "360-676-7433", "note": "free with Medicaid" },
  "safePrint": true,              // false => gated by the safe-to-print toggle (A.5)
  "patient": { "blurb": "...", "grade": 4, "lastVerified": "2026-06-01", ... }
}
```

### A.3 Patient sheet layout (final)
One page, four zones, in order:
1. **Crisis** (red): 988 · **nearest ER** (name + address, 911) · **"Need a ride?"** transit line.
2. **Your follow-up**: who · when · where · phone.
3. **Your care** (clinical, blue heading): each item = neutral icon + name + plain blurb + address + phone (+ ride line if available).
4. **Daily needs** (social, gold heading): same row format.
Color stays rationed: red = crisis, blue = clinical, gold = social, green = verified/ride.

### A.4 Nearest ER — auto + override
- Curate a small **hospital/ED list per metro** (name, address, phone) in the verified data, same freshness rules as other resources.
- `nearestER(zip)` returns the closest ED for the patient ZIP; render it in the crisis block.
- Always show an **editable field** so the clinician can correct/confirm. (Auto where we have data, fill-in where we don't.)

### A.5 Safe-to-print gate (LGBTQ+ / DV)
- Any resource with `safePrint:false` (LGBTQ+, DV, and similar identity/safety-sensitive entries) is gated.
- The flow asks once: **"Safe to print these on the sheet the patient carries?"** Yes / No.
- **No (default for DV):** suppress the resource's identifying details from anything printed; show a discreet "memorize this number" line instead. Never print a DV shelter address.
- **Yes:** print normally (affirming, by name).
- This reuses the DV gate from Phase 3 §3.3; it now also governs LGBTQ+ entries.

### A.6 Icon principles (patient-facing)
Icons double as low-literacy / ESL wayfinding, so they must be **universal and non-stigmatizing**:
- Substance care → a neutral care/heart mark, **never** bottles, glasses, or needles.
- Medical → a pulse/heart or building-with-plus, **not** a religious cross.
- Identity/affirming → a neutral "welcome/people" mark on the carried sheet (no flags that could out a patient); affirming language lives in the blurb, governed by A.5.
- Transport → vehicle/bus; food → basket; housing → house; support group → people.

### A.7 Updated acceptance criteria
- [ ] Three documents generate from one completed plan: provider note (copy-paste + print), referral cover (fax/email/print), patient sheet (1 page).
- [ ] Patient resources render split into Clinical vs Daily needs, each with icon, address, phone, and ride line where present.
- [ ] Nearest ER auto-fills from ZIP and is editable; appears in the crisis block.
- [ ] `safePrint:false` resources are suppressed/discreet unless the clinician confirms safe-to-print.
- [ ] Referral cover contains no stored patient identifiers — only blank fields + the attach-face-sheet note.

### A.8 Resolved decisions
- Nearest ER: **auto from ZIP with clinician override.**
- LGBTQ+/DV on print: **safe-to-print gate.**
- (Still open from the main list: naming "Social Care Plan", auth provider, handoff identity default, grade ceiling.)

---

## Addendum B · Safety workflow (two pathways, evidence-based, clinician-led)

Safety is decision **support**, not decision-making. The whole module is built around three non-negotiables: it is **prompted and evidence-based only**, it is **performed/reviewed with a trained clinician**, and it **never duplicates the EMR**.

### B.1 Two entry pathways
| Setting | Safety behavior |
|---|---|
| **ED / Inpatient** | Full evidence-based safety screen is **always required** before disposition. |
| **Outpatient** | Opens with one gate — *"Any acute safety concern (suicidal, homicidal/violent, or substance crisis)?"* **No** → skip the full screen (a safety plan is still offered; crisis lines still print). **Yes** → the full screen. |

### B.2 The evidence-based safety screen
Only validated instruments; the tool prompts them, it does not invent scores.
- **Suicide risk → C-SSRS (Columbia).** Capture screen completion + risk level (low / moderate / high).
- **Violence / homicide → structured risk factors + duty-to-warn**, NOT a pseudo-predictive score. State plainly in-UI that acute violence prediction has limited validity; the tool documents risk factors (access to weapons, prior violence, substance use, command symptoms, identifiable target) and routes to **Tarasoff / duty-to-protect** actions. Clinical judgment governs.
- **Mitigation = protective factors:** reasons for living, social support, means restriction, treatment engagement, future orientation.
- **Planning (evidence-based):** **Stanley-Brown Safety Planning Intervention** + **Counseling on Access to Lethal Means (CALM)**.

### B.3 "Already done in the EMR?" off-ramp
At the top of the screen: *"Screening already completed in the EMR?"*
- **Yes** → attest + enter only the **result / risk level** (no re-administration). The note records "C-SSRS completed in EMR; risk = X."
- **No** → the prompted screen above.
This prevents double documentation, which is a top clinician complaint.

### B.4 Collaboration — stated loudly and enforced
- Persistent banner on every safety screen: *"Complete with a trained clinician (psychiatry / crisis). This tool supports the decision; it does not make it."*
- An **attestation checkbox** ("Reviewed with a trained clinician") is required to pass a **moderate/high** screen.
- The disclaimer also prints on the provider note.

### B.5 Gating
- **Low risk** → continue to plan.
- **Moderate / high risk** → **mitigation + Stanley-Brown safety plan + lethal-means counseling become required** before discharge; crisis lines (988 + local) auto-pin to the patient sheet; the attestation is required.

### B.6 Acceptance criteria
- [ ] ED/inpatient always show the full screen; outpatient shows it only on an acute concern (else skip, safety plan still offered).
- [ ] Only validated instruments are prompted (C-SSRS; Stanley-Brown; CALM); violence is risk-factors + duty-to-warn, not a predictive score, with the validity caveat shown.
- [ ] "Already in EMR" path captures result only and writes it to the note.
- [ ] Moderate/high cannot proceed without mitigation + safety plan + lethal-means + the trained-clinician attestation.
- [ ] The collaboration disclaimer appears in-app and on the provider note.
