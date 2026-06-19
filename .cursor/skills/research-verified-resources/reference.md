# PsychDispo DATA Reference

Source of truth: `public/psychdispo.html` — `DATA` (~1394 entries) and `NATIONAL` (~76 entries).

## DATA field table

| Field | Type | Required | Present in DATA | Purpose |
|-------|------|----------|-----------------|---------|
| `county` | string | Yes | 100% | Geographic filter; must match app county labels (e.g. `Columbus (Franklin)`, `National`, `Ohio (statewide)`) |
| `cat` | string | Yes | 100% | Category string → drives `metaOf()` panel assignment |
| `name` | string | Yes | 100% | Official program or facility name |
| `phone` | string | Yes | 100% | Main intake, crisis, or scheduling line |
| `address` | string | Yes* | ~most local | Street address; omit for phone-only hotlines in NATIONAL |
| `hours` | string | Yes** | Rare (legacy uses `access`) | Hours of operation: `8:00 AM – 5:00 PM`, `24/7` |
| `days` | string | Yes** | Rare (legacy uses `access`) | Days open: `Mon–Fri`, `Daily`, `24/7` |
| `svc` | string | Yes | 100% | Clinician-facing service description |
| `access` | string | Yes | 100% | Eligibility & mode: walk-in, referral, insurance, ages, language |
| `fax` | string | Preferred | ~18 entries | Referral fax; enables fax workflow in disposition UI |
| `email` | string | Preferred | ~13 entries | Intake/referral email |
| `patientBlurb` | string | Recommended | Planned | Patient print: ≤80 chars, grade ≤5, action-first |
| `patientBlurb_es` | string | Optional | Planned | Spanish patient blurb |
| `transportPhone` | string | When relevant | Planned | NEMT / Medicaid ride line |
| `panel` | string | Auto | NATIONAL + some DATA | A, B, C, D, F, G, I — usually computed by `metaOf()` |
| `sub` | string | Optional | ~30 | Sub-classification (Panel A/C): e.g. `detox`, therapy subs |
| `need` | string | Optional | ~22 | Panel F social need: `housing`, `food`, `dv`, `financial`, `legal`, `employment`, `catchall`, `other` |
| `spec` | string | Optional | ~3 | Panel G specialty: `fep`, `perinatal`, `geriatric`, `pediatric`, `veteran`, etc. |
| `flag` | string | Optional | ~41 | UI flag match: `lgbtq`, `veteran`, `geriatric`, `idd`, `perinatal` |
| `peds` | 1 | Optional | ~57 | Restrict to child/teen life stage |
| `auto` | 1 | Optional | ~397 | Auto-select for regional crisis / key hubs |
| `national` | 1 | NATIONAL only | 76 | Marks NATIONAL array entries |
| `unverified` | 1 | Optional | ~2 | Show ⚑ badge; use only with documented gaps |
| `edPriority` | number | Optional | Planned | Sort nearest ED/PES when multiple in county |

\* Required for walk-in sites, clinics, shelters. Phone-only crisis lines may omit.  
\*\* Required for curation; legacy rows encode in `access`/`svc` (e.g. `Walk-in 24/7`).

### Record identity

```javascript
function rid(r){ return (r.county||"")+"|"+r.name+"|"+r.phone; }
```

Check for duplicates before adding.

## Category → panel mapping (`metaOf`)

| `cat` value | Panel | Notes |
|-------------|-------|-------|
| Outpatient psychiatry | A | sub: Psychiatrist / PMHNP |
| Therapy & counseling | A | sub: Therapy / counseling |
| IOP / PHP | A | sub: IOP / PHP programs |
| Specialty psychiatry | G | spec from `specOf()` |
| Substance use & recovery | C | use `sub: "detox"` for withdrawal management |
| Crisis & psych urgent care | D | crisis hubs, mobile crisis, BH urgent care |
| Health & medical | B | FQHC, PCP bridge |
| Shelter & housing | F | need: `housing` |
| Food | F | need: `food` |
| Domestic violence & assault | F | need: `dv` |
| Benefits & financial | F | need: `financial` |
| Employment & re-entry | F | need: `employment` |
| Legal, ID & records | F | need: `legal` |
| Veterans | G | spec: `veteran` |
| Seniors & aging | G | flag: `geriatric` |
| Developmental disabilities | G | flag: `idd` |
| Interpreter / language access | I | language access |
| Referral | F | need: `other` (catch-all) |

Entries with preset `panel` (NATIONAL) skip auto-mapping.

## Panel definitions

| Panel | Label | Bucket | Typical resources |
|-------|-------|--------|-------------------|
| **A** | Mental health treatment | Clinical | Outpatient psych, therapy, IOP/PHP |
| **B** | Primary care & health | Clinical | FQHC, medical home, bridge care |
| **C** | Substance use treatment | Clinical | Detox, rehab, MOUD, harm reduction |
| **D** | Crisis services | Clinical | 988, regional crisis, walk-in crisis, BH urgent care |
| **F** | Social needs | Social | Housing, food, DV, benefits, legal, 211 |
| **G** | Specialty & population | Clinical | LGBTQ+, veteran, perinatal, pediatric, geriatric, IDD |
| **I** | Interpreter / language access | Clinical | Relay, in-person interpretation |

### Panel C `sub` values

| sub | Meaning |
|-----|---------|
| `detox` | Medical withdrawal management / detoxification |
| (default) | Outpatient SUD, rehab, MOUD — non-detox |

### Panel F `need` values

| need | Meaning |
|------|---------|
| `housing` | Shelter, coordinated entry, eviction prevention |
| `food` | Food bank, SNAP navigation |
| `dv` | DV hotline, advocacy (shelter address policy: hotline on patient sheet) |
| `financial` | Benefits, utility assistance |
| `legal` | Legal aid, records, ID |
| `employment` | Job training, re-entry |
| `catchall` | 211, general navigation |
| `other` | Uncategorized social |

## Verification source types

| Type | Trust level | Capture in notes |
|------|-------------|------------------|
| Official website — contact/about page | High | URL + date |
| Official website — location/hours page | High | URL + date |
| State/county BH authority listing | High | Agency + URL + date |
| 211 database entry | High | 211 query + date |
| SAMHSA Find Treatment / Buprenorphine | High | Locator ID + date |
| VA facility locator | High | Facility ID + date |
| CMS / state licensing registry | High | License # + date |
| Phone call to facility intake | Medium-high | "Phone confirm YYYY-MM-DD" + staff name optional |
| Insurer directory | Medium | Cross-check against official site |
| Printed brochure (<12 mo) | Medium | Document title + date |
| Insurer-only / single aggregator | Low | Do not merge without official corroboration |
| Social media, Reddit, Yelp | Unacceptable alone | Do not use |

## `access` field conventions

Pipe-separated segments (middle dot ` · `):

```
[Mode & hours/days if no dedicated fields] · [Insurance/payment] · [Ages/population]
```

Examples from live DATA:

- `Walk-in 24/7 · Medicaid · Adults`
- `Walk-in M-F · Medicaid · Adults`
- `Referral/self · Medicaid · Adults & adolescents`
- `All ages` (national lines)

## Service type tags (informal)

Use in `svc`, `sub`, `need`, or `flag` — not free-form tags:

| Tag domain | Keys / patterns |
|------------|-----------------|
| SUD | `sub: detox`, MAT/MOUD in svc |
| Crisis | `cat: Crisis & psych urgent care`, `panel: D` |
| LGBTQ+ | `flag: lgbtq` |
| Veteran | `flag: veteran`, `spec: veteran` |
| Support group | Mention in svc; Panel A therapy |
| Nearest hospital/ED | Panel D + name matches ED/PES pattern |
| Housing | `need: housing` |
| DV | `need: dv` |
| 211 | NATIONAL or F with `need: catchall` |

## UI display (verification badge)

- Default: `✓ verified` (no `unverified` key)
- `unverified: 1` → `⚑ unverified`
- `national: 1` → `national` badge

Footer note in app: "Resources verified Jun 2026 · Always call to confirm hours, eligibility & insurance."
