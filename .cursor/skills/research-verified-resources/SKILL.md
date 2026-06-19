---
name: research-verified-resources
description: >-
  Researches, verifies, and documents community and clinical resources for
  Psychiatry and Social Work in PsychDispo DATA curation. Captures required
  contact fields (hours, days, address, phone) and preferred fax/email.
  Use when the user mentions psychiatry resources, social work resources,
  community resources, verify hours, fax numbers, DATA curation, PsychDispo,
  resource verification, or adding/updating entries in psychdispo.html.
disable-model-invocation: true
---

# Research Verified Resources (PsychDispo)

Curate trustworthy community and clinical resources for `public/psychdispo.html` (`DATA` array, ~1400 entries). Every entry must be **verified from primary sources** before merge.

## Quick start

1. Clarify **need/scenario** + **geography** (state, county, ZIP).
2. Search **primary sources** (see hierarchy below).
3. **Cross-check** at least two sources when possible.
4. Fill the **required field checklist**; add preferred fax/email.
5. Draft **patientBlurb** (5th-grade reading level).
6. Assign **panel** (clinical vs social) and service tags.
7. Output using the **resource template** below.
8. For field definitions and panel taxonomy, read [reference.md](reference.md).
9. For worked examples, read [examples.md](examples.md).

## Step 1 — Define need and geography

Before searching, document:

| Item | Example |
|------|---------|
| Clinical/social need | Outpatient psychiatry, detox, housing, DV hotline |
| Patient context | Adult, child (`peds:1`), veteran, LGBTQ+, perinatal |
| Geography | County label used in DATA (e.g. `Columbus (Franklin)`), state, ZIP |
| Insurance/access | Medicaid, walk-in vs referral, language needs |

Match existing `county` labels in DATA when adding local entries. Use `National` for hotlines and `State (statewide)` patterns only when the app already uses them.

## Step 2 — Primary source hierarchy

Search in this order. Stop at the best available **official** source; never rely on a single unverified aggregator.

| Priority | Source type | Examples |
|----------|-------------|----------|
| 1 | Official program website | Hospital BH dept, CMHC, county BH board |
| 2 | Government / public agency | State MH authority, county crisis network, VA facility locator |
| 3 | Curated directories | **211** (call or 211.org), SAMHSA treatment locator, state SUD bed registry |
| 4 | Licensed facility registries | CMS, state licensing DB for detox/rehab |
| 5 | Insurer provider directory | Only to **confirm** phone/address after finding the official site |

**Do not use as primary sources:** Reddit, Yelp/Google reviews, random PDFs without dates, scraped third-party lists, ChatGPT memory, or social media posts.

## Step 3 — Verification rules

```
Verification checklist:
- [ ] Name matches official site (not outdated DBA)
- [ ] Phone tested or listed on ≥1 official page
- [ ] Address is street-level (not PO Box alone for walk-in sites)
- [ ] Hours AND days captured separately (see Step 4)
- [ ] Fax/email from official contact or intake page (not guessed)
- [ ] Second source agrees on phone or address (when feasible)
- [ ] Verification source URL + date recorded in commit notes
- [ ] Flag `unverified: 1` only if adding provisionally with explicit gap list
```

**Staleness:** If the only source is older than **12 months** and hours/access cannot be reconfirmed, flag for re-verification. National crisis lines (988, 911) are exceptions.

**Phone format:** Use display format consistent with existing DATA, e.g. `(614) 276-2273`. Crisis short codes: `988`, `911`, `741741`.

## Step 4 — Required vs preferred fields

### Always required (research must not finish without these)

| Field | Where stored | Format |
|-------|--------------|--------|
| **Hours of operation** | `hours` (preferred) or start of `access` | `8:00 AM – 5:00 PM` or `24/7` |
| **Days open** | `days` (preferred) or in `access` | `Mon–Fri`, `Mon–Sat`, `Daily`, `24/7` |
| **Address** | `address` | Street + city if not implied by county |
| **Phone** | `phone` | Main intake or crisis line |

Legacy entries embed hours/days in `access` (e.g. `Walk-in M-F 8am–5pm · Medicaid · Adults`). **New and updated entries** should use dedicated `hours` and `days` when patching DATA, and keep `access` for eligibility/mode (walk-in, referral, insurance, ages).

### Preferred (capture whenever published)

| Field | Key | Notes |
|-------|-----|-------|
| Fax | `fax` | Required for referral workflow when fax is offered |
| Email | `email` | Intake/referral email only — not personal staff emails |

### Capture when relevant

| Field | Key | When |
|-------|-----|------|
| Patient-facing blurb | `patientBlurb` | Max ~80 chars, 5th-grade, action-first (see Step 6) |
| Spanish blurb | `patientBlurb_es` | When Spanish materials exist |
| Ride/NEMT line | `transportPhone` | Medicaid transport, paratransit, NEMT |
| Panel override | `panel`, `sub`, `need`, `spec`, `flag` | When `metaOf()` auto-classification is wrong |
| Auto-select crisis | `auto: 1` | Regional crisis hub (existing pattern) |
| Pediatric | `peds: 1` | Children/teens only |
| Service tags | `sub`, `need`, `flag` | detox, moud, housing, dv, lgbtq, veteran, etc. |
| Provisional | `unverified: 1` | Missing required fields — rare |

Full field table: [reference.md](reference.md).

## Step 5 — Format for PsychDispo DATA JSON

Entries live in the `DATA` array inside `public/psychdispo.html`. One object per resource, comma-separated, no trailing comma on last item.

**Minimal local entry template:**

```json
{
  "county": "Columbus (Franklin)",
  "cat": "Outpatient psychiatry",
  "name": "Example Community Mental Health",
  "phone": "(614) 555-0100",
  "address": "123 Main St.",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Outpatient psychiatry & therapy",
  "access": "Referral or self · Medicaid · Adults",
  "fax": "(614) 555-0101",
  "email": "intake@example.org"
}
```

**Rules:**

- **`cat`** must be one of the 18 category strings (see reference.md). Panel letter is derived by `metaOf()` unless you set `panel` explicitly (national entries).
- **`svc`** — clinician-facing one-liner: services, modality, population.
- **`access`** — how to get in: walk-in vs appointment, insurance, ages, language. Do not duplicate full hours here if `hours`/`days` exist.
- **`fax` / `email`** — omit keys entirely if unknown (do not use placeholders).
- Insert alphabetically or grouped by county to match surrounding entries.
- After edit, spot-check in the PsychDispo UI: card shows phone, address, fax/email row.

**National / hotline entries** go in `NATIONAL`, not `DATA`, with `panel` preset (usually `D` for crisis).

## Step 6 — patientBlurb writing rules

The patient discharge sheet uses plain language. Write `patientBlurb` for every new entry when possible.

| Rule | Do | Don't |
|------|----|-------|
| Reading level | 5th grade; short sentences | Jargon: IOP, PHP, MAT, FQHC, co-occurring |
| Tone | Neutral, welcoming, action-first | Stigmatizing labels, political commentary |
| Length | ≤80 characters | Long clinical descriptions |
| Content | What to do: "Call for a same-day visit" | Diagnosis requirements, insurance fine print |

Use the app's `plain()` jargon map as a fallback only — prefer an explicit `patientBlurb`.

**Examples:**

- Crisis: `Call anytime — someone will listen and help.`
- Detox: `Call for a safe place to detox with medical help.`
- Housing: `Call to ask about a bed or shelter tonight.`

## Step 7 — Clinical vs social (icon / bucket)

PsychDispo groups resources into **panels** for UI and (future) patient print buckets.

| Bucket | Panels | Icon intent |
|--------|--------|-------------|
| **Clinical** | A (MH), B (primary care), C (SUD), D (crisis), G (specialty), I (interpreter) | Phone, heart, building, shield |
| **Social** | F (social needs) | Home (housing), phone, heart (support) |

Assign `cat` correctly and let `metaOf()` set `panel`. Override with `need` (Panel F), `sub` (Panel C: `detox`, `moud`, etc.), or `flag` (`lgbtq`, `veteran`, `geriatric`, `idd`, `perinatal`) when needed.

**Neutral icons only** — no rainbow flags, military insignia, syringes, or emoji on patient-facing output. See dual-doc spec in project canvases.

## Output template (per resource)

Deliver each researched resource in this block for review before merge:

```markdown
## [Resource name]

**Verification**
- Source 1: [URL] — accessed YYYY-MM-DD
- Source 2: [URL or "phone confirmation"] — accessed YYYY-MM-DD
- Confidence: verified | provisional (list gaps)

**Geography:** [county label] · [state]

**Contact**
- Phone: …
- Fax: … (or "not published")
- Email: … (or "not published")
- Address: …
- Days: …
- Hours: …

**Classification**
- cat: …
- panel (computed): …
- Tags: …

**Clinician fields**
- svc: …
- access: …

**Patient fields**
- patientBlurb: …
- transportPhone: … (if applicable)

**DATA JSON**
```json
{ … }
```
```

## Anti-patterns

| Anti-pattern | Why it fails |
|--------------|--------------|
| Reddit, forums, or Yelp as sole source | Unverified, outdated, not accountable |
| PDF handouts without date | Hours and intake process change |
| Missing hours or days | Clinicians and patients cannot plan contact |
| PO Box only for walk-in crisis/detox | Patient cannot physically arrive |
| Guessed fax (`555-…`) | Breaks referral workflow |
| Personal staff email | Not durable; privacy risk |
| Duplicate entries | Search by `county|name|phone` (`rid()`) before adding |
| Wrong county label | Resource hidden for target ZIP |
| Clinical jargon in patientBlurb | Fails readability requirement |
| Leaving `unverified` off when gaps exist | False sense of verification |

## Additional resources

- [reference.md](reference.md) — DATA field table, panel taxonomy, verification source types
- [examples.md](examples.md) — crisis line, detox facility, housing org (raw research → DATA)
