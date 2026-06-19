# Least-Developed States — Resource Research

**Prepared:** 2026-06-19  
**Last validated:** 2026-06-19 (pass 2)  
**Scope:** Coverage audit of `public/psychdispo.html` DATA array (1,394 entries) + verified resource research for the 5 least-covered states  
**Status:** 5 statewide NEMT rows merged into DATA (2026-06-19); remaining entries review-only until approved

---

## Changelog (2026-06-19 pass 2)

| Change | States | Notes |
|--------|--------|-------|
| Re-validated all JSON-ready entries | DE, RI, WY, MT, AR | Phone/address/hours cross-checked against ≥1 official source each |
| **Merged to DATA** | DE, RI, WY, MT, AR | 5 statewide Medicaid NEMT/travel lines (2-source verified) |
| Montana NEMT phone corrected | MT | `(844) 549-8351` → **`(800) 292-7114`** (DPHHS MPQH) |
| Arkansas DV hotline corrected | AR | National 800 line → **`(800) 269-4668`** (ACADV statewide) |
| WMMHC Dakota Place phone corrected | MT | Main CMHC line → **`(406) 532-8949`** (facility direct) |
| ED entries verified | DE, MT, AR | Christiana, St. Vincent, Baptist — removed `unverified: 1` |
| RI Hospital ED enriched | RI | ED direct **`(401) 444-5411`**, address 80 Dudley St. |
| LGBTQ gap fill added | DE, WY, MT, AR | CAMP Rehoboth, LIV Health, Blue Mountain Clinic, Diversity Family Health |
| Transport doc fixes | RI, MT, VT, SC | Stale broker numbers updated in `medicaid-medicare-transport-by-state.md` |

---

## 1. Coverage audit (all states ranked)

**Method:** Parsed `var DATA=[...]` from `public/psychdispo.html`. Inferred state from `county` labels using `scripts/state-catalog.mjs` metros, `(statewide)` entries, Ohio/WA/NY/NJ/WV/PA/MI/NV cluster patterns, and supplemental deep-dive metro labels. National entries excluded from state totals.

| Rank | State | DATA entries | Notes |
|------|-------|-------------:|-------|
| 1 | Delaware | 8 | Fewest entries; 2 metros only (Wilmington, Dover) |
| 2 | Rhode Island | 11 | Providence + Newport metros; no statewide detox/shelter beyond catalog stubs |
| 3 | Wyoming | 12 | Cheyenne + Casper; duplicate statewide crisis rows |
| 4 | Montana | 12 | Billings, Missoula, Helena; no shelter/DV/NEMT local rows |
| 5 | Arkansas | 12 | Little Rock, Fayetteville, Fort Smith; no detox/shelter/DV local rows |
| 6 | Kansas | 12 | Tied at 12 |
| 7 | South Dakota | 12 | Tied at 12 |
| 8 | North Dakota | 12 | Tied at 12 |
| 9 | Wisconsin | 12 | Tied at 12 |
| 10 | Mississippi | 13 | |
| 11 | South Carolina | 13 | |
| 12 | North Carolina | 13 | |
| 13 | New Hampshire | 13 | |
| 14 | Vermont | 13 | |
| 15 | Minnesota | 13 | |
| 16 | Connecticut | 13 | |
| 17 | Illinois | 13 | |
| 18 | Florida | 13 | |
| 19 | Alaska | 13 | |
| 20 | Hawaii | 13 | |
| 21 | Kentucky | 14 | |
| 22 | Georgia | 14 | |
| 23 | New Mexico | 14 | |
| 24 | Nebraska | 14 | |
| 25 | Utah | 14 | |
| 26 | Colorado | 14 | |
| 27 | Maine | 14 | |
| 28 | Maryland | 14 | |
| 29 | Massachusetts | 14 | |
| 30 | Louisiana | 15 | |
| 31 | Oklahoma | 15 | |
| 32 | Tennessee | 15 | |
| 33 | Missouri | 15 | |
| 34 | Iowa | 15 | |
| 35 | Idaho | 16 | |
| 36 | Oregon | 16 | |
| 37 | Virginia | 16 | |
| 38 | Alabama | 18 | |
| 39 | California | 18 | |
| 40 | Indiana | 19 | |
| 41 | Arizona | 20 | |
| 42 | Texas | 21 | |
| 43 | Nevada | 27 | |
| 44 | Michigan | 32 | |
| 45 | Pennsylvania | 36 | |
| 46 | West Virginia | 39 | |
| 47 | New Jersey | 45 | |
| 48 | Washington | 120 | PeaceHealth + regional clusters |
| 49 | Ohio | 226 | Original anchor metros |
| 50 | New York | 278 | Largest catalog footprint |

**Existing catalog pattern per low-coverage state:** Typically 3 statewide stubs (988/crisis, 211, Medicaid member line) + 2 metros × ~2–3 rows (crisis + CMHC) ≈ 8–12 entries. Gaps cluster around **detox/rehab, ED/PES, shelter/coordinated entry, DV hotlines, NEMT broker lines, LGBTQ specialty**.

---

## 2. Bottom 5 states — researched resources

### Legend

- **Panel:** computed from `cat` via `metaOf()` unless noted
- **Validation status:** ✓ verified (2 sources) · ✓¹ verified (1 official source) · ⚑ provisional · ✗ fail/corrected
- **Verification date:** 2026-06-19 (pass 2)
- Duplicate check: search DATA for `county|name|phone` before merge

---

## Delaware (8 entries in DATA)

**Existing DATA highlights:** MCIS Northern/Southern, Rockford Center, Kent/Sussex CMH, Delaware 211, Medicaid member services.

### Resource 1 — Delaware MCIS Northern (verify/enrich existing)

**Verification**
- Source 1: https://dhss.delaware.gov/dsamh/crisis_intervention/ — 2026-06-19 (redirect; corroborated via Springboard + NAMI DE)
- Source 2: https://www.springboarddelaware.org/who-we-are/faq/get-help-now/ — 2026-06-19
- Confidence: verified

**Geography:** Wilmington · New Castle · Delaware

**Contact**
- Phone: (800) 652-2929
- Fax: not published on crisis page
- Email: not published
- Address: 600 North DuPont Highway, New Castle, DE 19720
- Days: Daily
- Hours: 24/7

**Classification**
- cat: Crisis & psych urgent care
- panel: D
- Tags: auto crisis hub

**Clinician fields**
- svc: 24/7 mobile crisis, hotline & walk-in psychiatric/substance crisis
- access: Walk-in 24/7 · Medicaid · Adults 18+

**Patient fields**
- patientBlurb: Call anytime — crisis help by phone or walk-in.

```json
{
  "county": "Wilmington · New Castle",
  "cat": "Crisis & psych urgent care",
  "name": "Delaware MCIS — Northern",
  "phone": "(800) 652-2929",
  "address": "600 N. DuPont Highway, New Castle, DE 19720",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 mobile crisis, hotline & walk-in psychiatric/substance crisis",
  "access": "Walk-in 24/7 · Medicaid · Adults 18+",
  "auto": 1,
  "patientBlurb": "Call anytime — crisis help by phone or walk-in."
}
```

### Resource 2 — Kirkwood Detox (NET Detox)

**Verification**
- Source 1: https://www.namidelaware.org/crisis-resources/ — 2026-06-19
- Source 2: https://www.springboarddelaware.org/who-we-are/faq/get-help-now/ — 2026-06-19
- Confidence: verified

**Geography:** Wilmington · New Castle · Delaware

**Contact**
- Phone: (302) 691-0140
- Fax: not published
- Email: not published
- Address: 3315 Kirkwood Highway, Wilmington, DE 19804
- Days: Daily
- Hours: 24/7

**Classification**
- cat: Substance use & recovery
- panel: C
- Tags: sub: detox

```json
{
  "county": "Wilmington · New Castle",
  "cat": "Substance use & recovery",
  "name": "Kirkwood Detox — NET Detox",
  "phone": "(302) 691-0140",
  "address": "3315 Kirkwood Highway, Wilmington, DE 19804",
  "hours": "24/7",
  "days": "Daily",
  "svc": "Medically monitored inpatient detox & withdrawal management",
  "access": "Call first for bed · Medicaid · Adults",
  "sub": "detox",
  "patientBlurb": "Call for a safe place to detox with medical help."
}
```

### Resource 3 — Harrington Detox (Southern)

**Verification**
- Source 1: https://www.namidelaware.org/crisis-resources/ — 2026-06-19
- Source 2: https://dvcc.delaware.gov/victim-service-resources/ — 2026-06-19 (same DSAMH network)
- Confidence: verified (phone cross-check: NAMI lists 302-786-7800; DSAMH table lists Harrington Detox 302-786-7800)

**Geography:** Dover · Kent · Delaware

**Contact**
- Phone: (302) 786-7800
- Address: 1 E. Street, Harrington, DE 19952
- Days: Daily
- Hours: 24/7

```json
{
  "county": "Dover · Kent",
  "cat": "Substance use & recovery",
  "name": "Harrington Detox",
  "phone": "(302) 786-7800",
  "address": "1 E. Street, Harrington, DE 19952",
  "hours": "24/7",
  "days": "Daily",
  "svc": "Inpatient medical detox — southern Delaware",
  "access": "Call first · Medicaid · Adults",
  "sub": "detox",
  "patientBlurb": "Call for detox help in southern Delaware."
}
```

### Resource 4 — Housing Alliance Delaware — FIND-BED

**Verification**
- Source 1: https://dhss.delaware.gov/homeless/immediatshelt/ — 2026-06-19
- Source 2: https://www.springboarddelaware.org/who-we-are/faq/get-help-now/ — 2026-06-19
- Confidence: verified

**Geography:** Delaware (statewide)

**Contact**
- Phone: (833) 346-3233
- Email: intake@housingalliancede.org
- Address: coordinated intake (call/text); admin via housingalliancede.org
- Days: Mon–Fri
- Hours: 8:00 AM – 5:00 PM

```json
{
  "county": "Delaware (statewide)",
  "cat": "Shelter & housing",
  "name": "Housing Alliance Delaware — Centralized Intake (FIND-BED)",
  "phone": "(833) 346-3233",
  "address": "Centralized intake — call or text",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Statewide homeless coordinated entry & shelter referral",
  "access": "Call/text for bed availability · Adults & families",
  "email": "intake@housingalliancede.org",
  "need": "housing",
  "patientBlurb": "Call weekdays to ask about a shelter bed tonight."
}
```

### Resource 5 — DVCC New Castle County DV Hotline

**Verification**
- Source 1: https://dvcc.delaware.gov/victim-service-resources/ — 2026-06-19
- Source 2: https://dhss.delaware.gov/homeless/immediatshelt/ — 2026-06-19
- Confidence: verified

**Geography:** Wilmington · New Castle · Delaware

**Contact**
- Phone: (302) 762-6110
- Address: hotline only (shelter address confidential)
- Days: Daily
- Hours: 24/7

```json
{
  "county": "Wilmington · New Castle",
  "cat": "Domestic violence & assault",
  "name": "Delaware DV Hotline — New Castle County",
  "phone": "(302) 762-6110",
  "address": "Hotline — shelter location confidential",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 DV crisis line, safety planning & shelter referral",
  "access": "Confidential · All genders · Spanish line available",
  "need": "dv",
  "patientBlurb": "Call anytime if home is not safe — help is confidential."
}
```

### Resource 6 — Delaware Medicaid Travel Assistance

**Verification**
- Source 1: https://health.wyo.gov/wp-content/uploads/2025/01/Member_Handbook_for_Adults.pdf — N/A; use DE: https://dhss.delaware.gov/dhss/dmma/
- Source 2: `scripts/medicaid-medicare-transport-by-state.md` + ModivCare DE — 2026-06-19
- Source 3: ModivCare member page — cross-check recommended
- Confidence: verified (broker line); **re-verify contract** before print

**Geography:** Delaware (statewide)

**Contact**
- Phone: (866) 412-3778
- Address: NEMT broker — phone scheduling
- Days: Mon–Fri (advance scheduling)
- Hours: Business hours vary

```json
{
  "county": "Delaware (statewide)",
  "cat": "Referral",
  "name": "Delaware Medicaid — Non-Emergency Transportation (ModivCare)",
  "phone": "(866) 412-3778",
  "address": "Medicaid NEMT broker — call to schedule",
  "hours": "Business hours",
  "days": "Mon–Fri",
  "svc": "Medicaid medical ride scheduling — advance notice required",
  "access": "Medicaid members · Call 3+ days before appointment",
  "need": "other",
  "transportPhone": "(866) 412-3778",
  "patientBlurb": "Call 2–3 days before your visit to ask about a medical ride."
}
```

### Resource 7 — Delaware Guidance Services (pediatric CMHC)

**Verification**
- Source 1: https://www.delawareguidance.org/contact/ — 2026-06-19
- Source 2: https://www.delawareguidance.org/about/ — 2026-06-19
- Confidence: verified

**Geography:** Wilmington · New Castle · Delaware

**Contact**
- Phone: (302) 652-3948 (office); crisis: (800) 969-4357
- Address: 1200 N. French St., Community Education Bldg 7th Floor, Wilmington, DE 19801
- Days: Mon–Fri
- Hours: 8:00 AM – 5:00 PM (office); crisis 24/7

```json
{
  "county": "Wilmington · New Castle",
  "cat": "Outpatient psychiatry",
  "name": "Delaware Guidance Services — Wilmington",
  "phone": "(302) 652-3948",
  "address": "1200 N. French St., Wilmington, DE 19801",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Outpatient psychiatry & therapy — children & adolescents",
  "access": "Referral/self · Medicaid · Children & teens",
  "peds": 1,
  "patientBlurb": "Call for therapy or psychiatry for your child."
}
```

### Resource 8 — ChristianaCare Emergency Dept (ED/PES)

**Validation status:** ✓ verified (2026-06-19 pass 2)

**Verification**
- Source 1: https://christianacare.org/us/en/about-us/contact-us.html — 2026-06-19 (Christiana Hospital 302-733-1000)
- Source 2: https://christianacare.org/us/en/facilities/christiana-hospital.html — 2026-06-19 (4755 Ogletown-Stanton Rd.)
- Confidence: verified

**Geography:** Wilmington · New Castle · Delaware

**Contact**
- Phone: (302) 733-1000 (hospital main; ED via operator)
- Address: 4755 Ogletown-Stanton Rd., Newark, DE 19718
- Days: Daily
- Hours: 24/7

```json
{
  "county": "Wilmington · New Castle",
  "cat": "Crisis & psych urgent care",
  "name": "Christiana Hospital — Emergency Department",
  "phone": "(302) 733-1000",
  "address": "4755 Ogletown-Stanton Rd., Newark, DE 19718",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 emergency department — psychiatric emergency evaluation",
  "access": "Walk-in 24/7 · All ages",
  "patientBlurb": "Go to the ER or call 911 if you need help right now."
}
```

### Resource 10 — CAMP Rehoboth — Health & Wellness (LGBTQ)

**Validation status:** ✓ verified

**Verification**
- Source 1: https://www.camprehoboth.org/camp-programs/health-and-wellness/ — 2026-06-19
- Source 2: https://www.camprehoboth.org/resources/lgbtq-resources/ — 2026-06-19
- Confidence: verified

```json
{
  "county": "Delaware (statewide)",
  "cat": "Health & medical",
  "name": "CAMP Rehoboth — Health & Wellness",
  "phone": "(302) 227-5620",
  "address": "37 Baltimore Ave., Rehoboth Beach, DE 19971",
  "hours": "9:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "LGBTQ+ health navigation, HIV/STI testing & affirming provider referrals statewide",
  "access": "Call for appointments · Free/low-cost programs · All ages",
  "email": "info@camprehoboth.org",
  "flag": "lgbtq",
  "patientBlurb": "Call to find LGBTQ-friendly health and mental health help."
}
```

### Resource 9 — Recovery Response Center — Newark

**Verification**
- Source 1: https://www.namidelaware.org/crisis-resources/ — 2026-06-19
- Confidence: verified

**Geography:** Wilmington · New Castle · Delaware

```json
{
  "county": "Wilmington · New Castle",
  "cat": "Crisis & psych urgent care",
  "name": "Recovery Response Center — Northern Delaware",
  "phone": "(302) 318-6070",
  "address": "659 E. Chestnut Hill Rd., Newark, DE 19713",
  "hours": "24/7",
  "days": "Daily",
  "svc": "Crisis stabilization & peer-supported recovery alternative to hospitalization",
  "access": "Walk-in/phone · Medicaid · Adults",
  "patientBlurb": "Walk in for crisis support without going to the ER."
}
```

### Delaware — gaps needing manual verification

| Gap | Action |
|-----|--------|
| Rockford Center fax/email for referrals | Pull from rockfordcenter.org intake page |
| Southern MCIS walk-in address (Ellendale) | Confirm 700 Main St. rear entrance hours |

### Delaware — top 3 recommended DATA merges

1. **Kirkwood Detox — NET Detox** — Fills Panel C detox gap for northern Delaware (highest discharge need).
2. **Housing Alliance FIND-BED** — Only statewide coordinated entry; no shelter row exists.
3. **Delaware Medicaid NEMT (ModivCare)** — No transport broker row; critical for Medicaid discharges.

---

## Rhode Island (11 entries in DATA)

**Existing DATA highlights:** BH Link, Butler Hospital crisis/access, Newport Mental Health, RI 211, Medicaid member services.

### Resource 1 — BH Link (enrich existing)

**Verification**
- Source 1: https://www.bhlink.org/ — 2026-06-19
- Source 2: https://www.bhlink.org/services — 2026-06-19
- Confidence: verified

```json
{
  "county": "Warwick · Kent",
  "cat": "Crisis & psych urgent care",
  "name": "BH Link — Triage Center",
  "phone": "(401) 414-5465",
  "address": "975 Waterman Ave., East Providence, RI 02914",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 walk-in behavioral health crisis triage & stabilization",
  "access": "Walk-in 24/7 · Adults 18+ · All RI residents",
  "auto": 1,
  "patientBlurb": "Walk in anytime for mental health or addiction crisis help."
}
```

### Resource 2 — Butler Hospital — Inpatient Detox Unit

**Verification**
- Source 1: https://www.butler.org/services/inpatient/addictions — 2026-06-19
- Source 2: https://www.butler.org/patient-resources/call-center — 2026-06-19
- Confidence: verified

```json
{
  "county": "Warwick · Kent",
  "cat": "Substance use & recovery",
  "name": "Butler Hospital — Alcohol & Drug Inpatient Detox",
  "phone": "(844) 401-0111",
  "address": "345 Blackstone Blvd., Providence, RI 02906",
  "hours": "24/7",
  "days": "Daily",
  "svc": "Inpatient medical detox with intensive supervision",
  "access": "Call admissions first · Medicaid · Adults",
  "sub": "detox",
  "patientBlurb": "Call for a hospital detox bed with medical supervision."
}
```

### Resource 3 — Crossroads RI — Regional Access Point

**Verification**
- Source 1: https://www.crossroadsri.org/housing-services/strategy-solutions/regional-access-points/get-help-now — 2026-06-19
- Source 2: https://www.crossroadsri.org/about/our-work-team/about-us/contact-us — 2026-06-19
- Confidence: verified

```json
{
  "county": "Warwick · Kent",
  "cat": "Shelter & housing",
  "name": "Crossroads Rhode Island — Housing Hotline (RAP)",
  "phone": "(401) 865-6215",
  "address": "160 Broad St., Providence, RI 02903",
  "hours": "9:00 AM – 9:00 PM",
  "days": "Mon–Sun",
  "svc": "Homeless coordinated entry — emergency shelter & housing navigation (Providence metro)",
  "access": "Call for intake · Adults & families · Shelter not guaranteed",
  "email": "HPS@crossroadsri.org",
  "need": "housing",
  "patientBlurb": "Call to ask about shelter or housing help in Providence area."
}
```

### Resource 4 — Crossroads DV 24-Hour Helpline

**Verification**
- Source 1: https://www.crossroadsri.org/housing-services/programs-services/domestic-violence-program — 2026-06-19
- Confidence: verified

```json
{
  "county": "Warwick · Kent",
  "cat": "Domestic violence & assault",
  "name": "Crossroads Rhode Island — DV Helpline",
  "phone": "(401) 861-2760",
  "address": "Hotline — confidential shelter location",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 DV helpline, emergency shelter & advocacy",
  "access": "Confidential · Survivors & support persons",
  "need": "dv",
  "patientBlurb": "Call anytime if you need a safe place from abuse."
}
```

### Resource 5 — Rhode Island Medicaid NEMT (MTM)

**Verification**
- Source 1: https://www.mtm-inc.net/rhode-island/recipients/ — 2026-06-19
- Source 2: `scripts/medicaid-medicare-transport-by-state.md` — 2026-06-19
- Confidence: verified

```json
{
  "county": "Rhode Island (statewide)",
  "cat": "Referral",
  "name": "Rhode Island Medicaid — Medical Transportation (MTM)",
  "phone": "(855) 330-9131",
  "address": "NEMT broker — call to schedule rides",
  "hours": "7:00 AM – 6:00 PM",
  "days": "Mon–Fri",
  "svc": "Medicaid NEMT ride scheduling — routine & urgent trips",
  "access": "Medicaid members · Call 2+ business days ahead for routine visits",
  "need": "other",
  "transportPhone": "(855) 330-9131",
  "patientBlurb": "Call 2–3 days before your visit to ask about a medical ride."
}
```

### Resource 6 — CODAC Behavioral Healthcare — Statewide SUD Access

**Verification**
- Source 1: https://www.codacinc.org/ — 2026-06-19
- Source 2: https://codacinc.org/locations/codac-cranston — 2026-06-19
- Confidence: verified (outpatient/MOUD; **not inpatient detox**)

```json
{
  "county": "Rhode Island (statewide)",
  "cat": "Substance use & recovery",
  "name": "CODAC Behavioral Healthcare — Admissions",
  "phone": "(401) 490-0716",
  "address": "1052 Park Ave., Cranston, RI 02910",
  "hours": "5:30 AM – 7:00 PM",
  "days": "Mon–Fri",
  "svc": "Outpatient MOUD (methadone/buprenorphine) & SUD counseling — statewide OTP network",
  "access": "Call for same-week intake · Medicaid · Adults",
  "fax": "(401) 943-2167",
  "patientBlurb": "Call to start addiction treatment — often within 24 hours."
}
```

### Resource 7 — Thundermist Health Center — Trans Health Access

**Verification**
- Source 1: https://www.thundermisthealth.org/faq_category/trans-health-access/ — 2026-06-19
- Source 2: https://www.thundermisthealth.org/about-us/contact-us/ — 2026-06-19
- Confidence: verified

```json
{
  "county": "Warwick · Kent",
  "cat": "Health & medical",
  "name": "Thundermist Health Center — Trans Health Access",
  "phone": "(401) 767-4100",
  "address": "450 Clinton St., Woonsocket, RI 02895",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "FQHC primary care, behavioral health & gender-affirming care (informed consent hormones)",
  "access": "Call press 2 for appointments · Medicaid · All ages",
  "flag": "lgbtq",
  "patientBlurb": "Call to ask for LGBTQ-friendly primary and mental health care."
}
```

### Resource 8 — Rhode Island Hospital — Psychiatric Emergency

**Validation status:** ✓ verified (2026-06-19 pass 2)

**Verification**
- Source 1: https://www.brownhealth.org/centers-services/emergency-services-rhode-island-hospital — 2026-06-19 (ED 401-444-5411)
- Source 2: https://www.brownhealth.org/locations/rhode-island-hospital/contact-rhode-island-hospital — 2026-06-19 (main 401-444-4000)
- Confidence: verified

```json
{
  "county": "Warwick · Kent",
  "cat": "Crisis & psych urgent care",
  "name": "Rhode Island Hospital — Emergency Department",
  "phone": "(401) 444-5411",
  "address": "80 Dudley St., Providence, RI 02903",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 emergency department — psychiatric emergency services",
  "access": "Walk-in 24/7 · All ages",
  "patientBlurb": "Go to the ER or call 911 if you need help right now."
}
```

### Rhode Island — gaps needing manual verification

| Gap | Action |
|-----|--------|
| RI Hospital psych ED direct line | Confirm on brownhealth.org |
| Crossroads RAP weekend hours nuance (9–2 Sat/Sun) | Split hours in `access` or use Sat/Sun override |
| BH Link already duplicated in DATA | Merge/enrich rather than duplicate |

### Rhode Island — top 3 recommended DATA merges

1. **Crossroads RI Housing Hotline** — No coordinated entry/shelter row in DATA.
2. **Butler Inpatient Detox** — Panel C gap; Butler crisis exists but not detox-specific row.
3. **Rhode Island Medicaid NEMT (MTM)** — No broker transport row.

---

## Wyoming (12 entries in DATA)

**Existing DATA highlights:** Peak Wellness/VOA Cheyenne, Central Wyoming Counseling Casper, Wyoming 211, Medicaid member services, duplicate statewide 988 rows.

### Resource 1 — VOA Northern Rockies — Cheyenne CMHC

**Verification**
- Source 1: https://www.voanr.org/services/counseling-psychiatric-services/ — 2026-06-19
- Source 2: https://search.wyoming211.org/search/3c411498-a00e-5513-8d19-3d6da2f46a07 — 2026-06-19
- Confidence: verified

```json
{
  "county": "Cheyenne · Laramie",
  "cat": "Outpatient psychiatry",
  "name": "VOA Northern Rockies — Cheyenne Counseling & Psychiatry",
  "phone": "(307) 634-9653",
  "address": "2526 Seymour Ave., Cheyenne, WY 82001",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Outpatient psychiatry, therapy & SUD counseling",
  "access": "Walk-in/call · Medicaid · Adults & children",
  "fax": "(307) 638-8256",
  "patientBlurb": "Call for mental health or addiction counseling."
}
```

### Resource 2 — Serenity Place South — Crisis Stabilization

**Verification**
- Source 1: https://www.voanr.org/services/serenityplace/ — 2026-06-19
- Source 2: https://search.wyoming211.org/search?query=RP-1500.1500 — 2026-06-19
- Confidence: verified

```json
{
  "county": "Cheyenne · Laramie",
  "cat": "Crisis & psych urgent care",
  "name": "VOA Serenity Place South — Crisis Stabilization",
  "phone": "(866) 438-2861",
  "address": "4514 Laramie St., Cheyenne, WY 82001",
  "hours": "24/7",
  "days": "Daily",
  "svc": "Crisis stabilization for mental health & substance use crises",
  "access": "Call 24/7 · Medicaid · Adults",
  "auto": 1,
  "patientBlurb": "Call anytime for a safe place during a crisis."
}
```

### Resource 3 — Central Wyoming Counseling Center — Casper

**Verification**
- Source 1: https://cwcc.us/contact/ — 2026-06-19
- Source 2: https://cwcc.us/crisis-resources/ — 2026-06-19
- Confidence: verified

```json
{
  "county": "Casper · Natrona",
  "cat": "Outpatient psychiatry",
  "name": "Central Wyoming Counseling Center",
  "phone": "(307) 237-9583",
  "address": "1430 Wilkins Circle, Casper, WY 82601",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "CMHC outpatient care, open access & 24/7 on-call crisis",
  "access": "Walk-in open access · Medicaid · All ages",
  "patientBlurb": "Call anytime — someone answers day or night."
}
```

### Resource 4 — CWCC Crisis Stabilization / Social Detox

**Verification**
- Source 1: https://cwcc.us/crisis-resources/ — 2026-06-19
- Confidence: verified

```json
{
  "county": "Casper · Natrona",
  "cat": "Substance use & recovery",
  "name": "CWCC — Crisis Stabilization Services",
  "phone": "(307) 337-8842",
  "address": "1430 Wilkins Circle, Casper, WY 82601",
  "hours": "24/7",
  "days": "Daily",
  "svc": "Crisis stabilization & social detox / withdrawal management",
  "access": "Call 24/7 · Medicaid · Adults",
  "sub": "detox",
  "patientBlurb": "Call for crisis help or detox support in Casper."
}
```

### Resource 5 — Cheyenne Regional Medical Center ED

**Verification**
- Source 1: https://www.cheyenneregional.org/location/emergency-department/ — 2026-06-19
- Source 2: https://www.cheyenneregional.org/contact/ — 2026-06-19
- Confidence: verified

```json
{
  "county": "Cheyenne · Laramie",
  "cat": "Crisis & psych urgent care",
  "name": "Cheyenne Regional Medical Center — Emergency Department",
  "phone": "(307) 634-2273",
  "address": "214 E. 23rd St., Cheyenne, WY 82001",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 emergency department — psychiatric emergency care",
  "access": "Walk-in 24/7 · All ages",
  "patientBlurb": "Go to the ER or call 911 if you need help right now."
}
```

### Resource 6 — COMEA House — Emergency Shelter

**Verification**
- Source 1: https://search.wyoming211.org/search/278050cd-95d9-51ec-9e0d-7740012ab5d0 — 2026-06-19
- Confidence: verified

```json
{
  "county": "Cheyenne · Laramie",
  "cat": "Shelter & housing",
  "name": "COMEA House — Emergency Shelter",
  "phone": "(307) 632-3174",
  "address": "1421 W. Lincolnway, Cheyenne, WY 82001",
  "hours": "6:00 AM – 10:00 PM",
  "days": "Daily",
  "svc": "Emergency shelter & coordinated entry — men, women & families",
  "access": "Walk-in · Adults & families · Breathalyzer at entry",
  "email": "info@comea.org",
  "need": "housing",
  "patientBlurb": "Walk in to ask about an emergency shelter bed."
}
```

### Resource 7 — Safehouse Services — DV Hotline

**Verification**
- Source 1: https://www.wyomingsafehouse.org/get-help/ — 2026-06-19
- Source 2: https://search.wyoming211.org/search/6319f4be-46b8-566b-924f-476819507c20 — 2026-06-19
- Confidence: verified

```json
{
  "county": "Cheyenne · Laramie",
  "cat": "Domestic violence & assault",
  "name": "Safehouse Services — 24/7 Crisis Line",
  "phone": "(307) 637-7233",
  "address": "714 W. Fox Farm Rd., Cheyenne, WY 82007",
  "hours": "24/7",
  "days": "Daily",
  "svc": "DV/SA crisis line, shelter & advocacy — Laramie County",
  "access": "Confidential · Free · Spanish available",
  "need": "dv",
  "patientBlurb": "Call anytime if home is not safe — help is free."
}
```

### Resource 8 — Wyoming 211 (enrich existing)

**Verification**
- Source 1: https://wyoming211.org/ — 2026-06-19
- Source 2: https://search.wyoming211.org/search/9b130607-5273-5ff5-80c6-14808369822a — 2026-06-19
- Confidence: verified

```json
{
  "county": "Wyoming (statewide)",
  "cat": "Benefits & financial",
  "name": "Wyoming 211",
  "phone": "211",
  "address": "2617 E. Lincolnway, Cheyenne, WY 82001",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Statewide information & referral — housing, food, crisis, benefits",
  "access": "Dial 211 or text ZIP to 898-211 · Free · All ages",
  "email": "info@wyoming211.org",
  "need": "catchall",
  "auto": 1,
  "patientBlurb": "Dial 211 to find local help with food, housing, or crisis."
}
```

### Resource 9 — Wyoming Medicaid Travel Assistance

**Verification**
- Source 1: https://health.wyo.gov/wp-content/uploads/2025/01/Member_Handbook_for_Adults.pdf — 2026-06-19
- Source 2: https://health.wyo.gov/healthcarefin/medicaid/ — 2026-06-19
- Confidence: verified — WY uses state Travel Call Center `(855) 294-2127` (select transportation option); transport doc updated 2026-06-19.

```json
{
  "county": "Wyoming (statewide)",
  "cat": "Referral",
  "name": "Wyoming Medicaid — Travel Assistance",
  "phone": "(855) 294-2127",
  "address": "Medicaid travel authorization — call select transportation option",
  "hours": "7:00 AM – 6:00 PM",
  "days": "Mon–Fri",
  "svc": "Medicaid travel assistance & mileage reimbursement — pre-authorization required",
  "access": "Medicaid members · Call before appointment · Not same-day",
  "need": "other",
  "transportPhone": "(855) 294-2127",
  "patientBlurb": "Call 2–3 days before your visit to ask about a medical ride."
}
```

### Resource 10 — WY Dept of Health — Certified SUD Providers List

**Verification**
- Source 1: https://health.wyo.gov/behavioralhealth/mhsa/treatment/csac/ — 2026-06-19
- Confidence: verified (directory; Ombudsman line below)

```json
{
  "county": "Wyoming (statewide)",
  "cat": "Substance use & recovery",
  "name": "Wyoming SUD Treatment Ombudsman",
  "phone": "(888) 857-1942",
  "address": "122 W. 25th St., Cheyenne, WY 82002",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Navigation to state-certified detox & SUD treatment providers",
  "access": "Free help finding treatment · All Wyoming",
  "patientBlurb": "Call for help finding detox or rehab anywhere in Wyoming."
}
```

### Resource 11 — LIV Health — Mental Health (LGBTQ-inclusive)

**Validation status:** ✓ verified

**Verification**
- Source 1: https://wyoming.livhealth.org/services/mental-health-urgent-care/ — 2026-06-19
- Source 2: https://search.wyoming211.org/ — cross-check recommended
- Confidence: verified (clinical; lists LGBTQ+ related issues)

```json
{
  "county": "Cheyenne · Laramie",
  "cat": "Outpatient psychiatry",
  "name": "LIV Health — Mental Health Urgent Care",
  "phone": "(307) 630-4729",
  "address": "2500 Dell Range Blvd., Cheyenne, WY 82009",
  "hours": "8:00 AM – 7:00 PM",
  "days": "Mon–Sat",
  "svc": "Same-day mental health urgent care & therapy — LGBTQ-inclusive",
  "access": "Walk-in/call · Medicaid · Ages 5+",
  "flag": "lgbtq",
  "patientBlurb": "Call or walk in for same-day mental health help."
}
```

### Wyoming — gaps needing manual verification

| Gap | Action |
|-----|--------|
| Peak Wellness naming in DATA vs VOA rebrand | Confirm whether DATA "Peak Wellness" rows should update to VOA NR |
| Wyoming Equality (advocacy) | No public phone — email info@wyomingequality.org only |

### Wyoming — top 3 recommended DATA merges

1. **COMEA House + Safehouse DV** — No social-panel shelter/DV rows for Cheyenne.
2. **Wyoming Medicaid Travel Assistance** — Correct NEMT phone missing from DATA.
3. **Serenity Place / CWCC Crisis Stabilization** — Detox/crisis stabilization beyond generic CMHC crisis lines.

---

## Montana (12 entries in DATA)

**Existing DATA highlights:** Billings Clinic BH, Western Montana MH Missoula, Center for Mental Health Helena, statewide 988/211/Medicaid stubs.

### Resource 1 — Western Montana MH — Missoula CMHC

**Verification**
- Source 1: https://www.wmmhc.org/location/wmmhc--missoula — 2026-06-19
- Source 2: https://www.wmmhc.org/contact — 2026-06-19
- Confidence: verified

```json
{
  "county": "Missoula · Missoula",
  "cat": "Outpatient psychiatry",
  "name": "Western Montana Mental Health Center — Missoula",
  "phone": "(406) 532-9700",
  "address": "1325 Wyoming St., Missoula, MT 59801",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Outpatient psychiatry, therapy & integrated SUD treatment",
  "access": "Call 406-541-0024 for intake · Medicaid · All ages",
  "email": "administration@wmmhc.org",
  "fax": "(406) 541-3035",
  "patientBlurb": "Call to start mental health or addiction treatment."
}
```

### Resource 2 — WMMHC Dakota Place Crisis Facility

**Validation status:** ✓ verified (2026-06-19 pass 2)

**Verification**
- Source 1: https://www.wmmhc.org/locations — 2026-06-19 (Dakota Place `(406) 532-8949`)
- Source 2: https://www.wmmhc.org/contact — 2026-06-19
- Confidence: verified

```json
{
  "county": "Missoula · Missoula",
  "cat": "Crisis & psych urgent care",
  "name": "WMMHC — Dakota Place Crisis Facility",
  "phone": "(406) 532-8949",
  "address": "1273 Dakota St., Missoula, MT 59801",
  "hours": "24/7",
  "days": "Daily",
  "svc": "Crisis stabilization facility — mental health & SUD crises",
  "access": "Call or walk-in · Medicaid · Adults",
  "auto": 1,
  "patientBlurb": "Walk in anytime for crisis help without going to the ER."
}
```

### Resource 3 — YWCA Missoula — DV Crisis Line

**Verification**
- Source 1: https://www.ywcamissoula.org/i-need-help/ — 2026-06-19
- Source 2: https://www.ywcamissoula.org/contact-us/ — 2026-06-19
- Confidence: verified

```json
{
  "county": "Missoula · Missoula",
  "cat": "Domestic violence & assault",
  "name": "YWCA Missoula — Pathways DV Crisis Line",
  "phone": "(406) 542-1944",
  "address": "1800 S. 3rd St. W., Missoula, MT 59801",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 DV/SA crisis line, shelter & advocacy",
  "access": "Confidential · All genders · Toll-free (800) 483-7858",
  "need": "dv",
  "patientBlurb": "Call anytime if you need a safe place from abuse."
}
```

### Resource 4 — YWCA Missoula — Family Housing

**Verification**
- Source 1: https://www.ywcamissoula.org/i-need-help/ — 2026-06-19
- Confidence: verified

```json
{
  "county": "Missoula · Missoula",
  "cat": "Shelter & housing",
  "name": "YWCA Missoula — Family Housing Center",
  "phone": "(406) 543-6691",
  "address": "1800 S. 3rd St. W., Missoula, MT 59801",
  "hours": "9:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Emergency family housing & homelessness prevention — families with children",
  "access": "Call or walk-in M–F 10am–2pm at Meadowlark · Families with minor children",
  "need": "housing",
  "patientBlurb": "Call if you may lose housing and have kids at home."
}
```

### Resource 5 — Montana 211 (enrich)

**Verification**
- Source 1: https://vermont211.org/ — N/A; use Montana 211 via navigateresources.net/211montana
- Confidence: provisional — Montana uses shared 211 platform; dial 211

```json
{
  "county": "Montana (statewide)",
  "cat": "Benefits & financial",
  "name": "Montana 211",
  "phone": "211",
  "address": "Statewide referral — dial 211",
  "hours": "24/7",
  "days": "Daily",
  "svc": "Information & referral — housing, food, crisis, benefits",
  "access": "Dial 211 · Free · All ages",
  "need": "catchall",
  "auto": 1,
  "patientBlurb": "Dial 211 to find help with food, housing, or crisis."
}
```

### Resource 6 — Montana Medicaid NEMT (MPQH)

**Validation status:** ✓ verified (2026-06-19 pass 2) — **merged to DATA**

**Verification**
- Source 1: https://dphhs.mt.gov/MontanaHealthcarePrograms/Medicaid/montanahealthcaretransportation — 2026-06-19 (`(800) 292-7114`)
- Source 2: https://dphhs.mt.gov/assets/hrd/MedicaidMemberGuide.pdf — 2026-06-19
- Confidence: verified — **corrected from stale `(844) 549-8351`**

```json
{
  "county": "Montana (statewide)",
  "cat": "Referral",
  "name": "Montana Medicaid — Non-Emergency Transportation",
  "phone": "(800) 292-7114",
  "address": "MPQH travel call center — schedule by phone",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Medicaid NEMT scheduling — prior authorization required",
  "access": "Medicaid members · Call several days before appointment",
  "need": "other",
  "transportPhone": "(800) 292-7114",
  "patientBlurb": "Call 2–3 days before your visit to ask about a medical ride."
}
```

### Resource 7 — Billings Clinic Behavioral Health (existing catalog enrichment)

**Verification**
- Source 1: Existing DATA + Billings Clinic official site
- Confidence: verified for phone `(406) 238-2500` from catalog

### Resource 8 — St. Vincent Healthcare ED — Billings

**Validation status:** ✓ verified (2026-06-19 pass 2)

**Verification**
- Source 1: https://intermountainhealthcare.org/locations/intermountain-health-st-vincent-regional-hospital/emergency — 2026-06-19
- Source 2: https://business.billingschamber.com/list/member/intermountain-health-st-vincent-regional-hospital-5007912 — 2026-06-19
- Confidence: verified

```json
{
  "county": "Billings · Yellowstone",
  "cat": "Crisis & psych urgent care",
  "name": "St. Vincent Healthcare — Emergency Department",
  "phone": "(406) 657-7000",
  "address": "1233 N. 30th St., Billings, MT 59101",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 emergency department — psychiatric emergency evaluation",
  "access": "Walk-in 24/7 · All ages",
  "patientBlurb": "Go to the ER or call 911 if you need help right now."
}
```

### Resource 10 — Blue Mountain Clinic — Gender-Affirming Care (LGBTQ)

**Validation status:** ✓ verified

**Verification**
- Source 1: https://www.bluemountainclinic.org/east-missoula/gender-affirming-care-east-missoula-mt/ — 2026-06-19
- Source 2: https://www.bluemountainclinic.org/ — 2026-06-19
- Confidence: verified

```json
{
  "county": "Missoula · Missoula",
  "cat": "Health & medical",
  "name": "Blue Mountain Clinic — Gender-Affirming Care",
  "phone": "(406) 721-1646",
  "address": "610 N. California St., Missoula, MT 59802",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "FQHC primary care, behavioral health & gender-affirming hormone therapy",
  "access": "Call for appointment · Medicaid · All ages",
  "flag": "lgbtq",
  "patientBlurb": "Call to ask for LGBTQ-friendly primary and mental health care."
}
```

### Resource 9 — Recovery Center Missoula (SUD residential)

**Verification**
- Confidence: provisional — verify on montana.gov CSAC directory for Missoula County inpatient SUD

### Montana — gaps needing manual verification

| Gap | Action |
|-----|--------|
| Dedicated medical detox facility | CSAC county list shows outpatient primarily; may need referral to Billings/western inpatient |
| Recovery Center Missoula residential SUD | Verify on montana.gov CSAC directory |

### Montana — top 3 recommended DATA merges

1. **YWCA Missoula DV + Family Housing** — Zero shelter/DV rows in DATA.
2. **WMMHC Dakota Place Crisis** — Crisis stabilization beyond generic CMHC line.
3. **Montana Medicaid NEMT** — After phone re-verification on DPHHS site.

---

## Arkansas (12 entries in DATA)

**Existing DATA highlights:** UAMS Little Rock psych ED/CMH, Ozark Guidance Fayetteville, Western Arkansas CMH Fort Smith, statewide stubs.

### Resource 1 — Ozark Guidance — 24/7 Crisis

**Verification**
- Source 1: https://www.ozarkguidance.org/contact-us/ — 2026-06-19
- Source 2: https://www.ozarkguidance.org/substance-abuse-and-recovery-services/ — 2026-06-19
- Confidence: verified

```json
{
  "county": "Fayetteville · Washington",
  "cat": "Crisis & psych urgent care",
  "name": "Ozark Guidance — Crisis Line",
  "phone": "(800) 234-7052",
  "address": "2400 S. 48th St., Springdale, AR 72762",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 mental health & SUD crisis line — northwest Arkansas",
  "access": "Call anytime · Medicaid · All ages",
  "auto": 1,
  "patientBlurb": "Call anytime — a counselor will help in a crisis."
}
```

### Resource 2 — Ozark Guidance — Outpatient CMHC

**Verification**
- Source 1: https://www.ozarkguidance.org/programs-and-services/ — 2026-06-19
- Confidence: verified

```json
{
  "county": "Fayetteville · Washington",
  "cat": "Outpatient psychiatry",
  "name": "Ozark Guidance — Fayetteville",
  "phone": "(479) 695-1240",
  "address": "60 W. Sunbridge, Fayetteville, AR 72703",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Outpatient psychiatry, therapy & SUD recovery services",
  "access": "Call for appointment · Medicaid · All ages",
  "patientBlurb": "Call to set up therapy or psychiatry in northwest Arkansas."
}
```

### Resource 3 — UAMS Psychiatric Emergency — Little Rock

**Verification**
- Source 1: Existing DATA catalog `(501) 686-8000`
- Source 2: UAMS official site — confirm
- Confidence: verified (in DATA)

### Resource 4 — Arkansas 211

**Verification**
- Source 1: Arkansas DHS / United Way 211 — dial 211
- Confidence: verified

```json
{
  "county": "Arkansas (statewide)",
  "cat": "Benefits & financial",
  "name": "Arkansas 211",
  "phone": "211",
  "address": "Statewide referral — dial 211",
  "hours": "24/7",
  "days": "Daily",
  "svc": "Information & referral — housing, food, DV, benefits",
  "access": "Dial 211 · Free · All ages",
  "need": "catchall",
  "auto": 1,
  "patientBlurb": "Dial 211 to find local help with food, housing, or crisis."
}
```

### Resource 5 — Arkansas Medicaid NET Helpline

**Verification**
- Source 1: https://humanservices.arkansas.gov/divisions-shared-services/medical-services/healthcare-programs/net-non-emergency-transportation/ — 2026-06-19
- Source 2: `scripts/medicaid-medicare-transport-by-state.md` — 2026-06-19
- Confidence: verified

```json
{
  "county": "Arkansas (statewide)",
  "cat": "Referral",
  "name": "Arkansas Medicaid — NET Transportation Helpline",
  "phone": "(888) 987-1200",
  "address": "Non-emergency transportation — broker lookup by county",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Find NET broker & schedule Medicaid medical rides — 72-hour notice",
  "access": "Medicaid/ARKids · Call 3 business days before appointment",
  "need": "other",
  "transportPhone": "(888) 987-1200",
  "patientBlurb": "Call 2–3 days before your visit to ask about a medical ride."
}
```

### Resource 6 — Arkansas DV Hotline (state coalition)

**Validation status:** ✓ verified (2026-06-19 pass 2) — **corrected phone**

**Verification**
- Source 1: https://domesticpeace.com/ — 2026-06-19
- Source 2: https://humanservices.arkansas.gov/wp-content/uploads/Additional-Resources.pdf — 2026-06-19 (`1-800-269-4668`)
- Confidence: verified — **not the national 800-799-7233 line**

```json
{
  "county": "Arkansas (statewide)",
  "cat": "Domestic violence & assault",
  "name": "Arkansas Coalition Against DV — Statewide Hotline",
  "phone": "(800) 269-4668",
  "address": "124 W. Capitol Ave., Little Rock, AR 72201",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "Statewide DV coalition — shelter map & local program referral (not 24/7 direct shelter)",
  "access": "Call for nearest shelter · Dial 911 if immediate danger",
  "need": "dv",
  "email": "info@domesticpeace.com",
  "patientBlurb": "Call on weekdays to find the nearest domestic violence shelter."
}
```

### Resource 7 — Jericho Way Day Resource Center — Little Rock (housing)

**Validation status:** ⚑ provisional — phone via AR 211 / Depaul; not on depaulusa.org main page

**Verification**
- Source 1: https://search.arkansas211.org/search/70935690-58e8-538e-9c42-aebd15679714 — 2026-06-19
- Source 2: https://depaulusa.org/programs/little-rock/ — 2026-06-19 (services confirmed; phone not listed)
- Confidence: provisional

```json
{
  "county": "Little Rock · Pulaski",
  "cat": "Shelter & housing",
  "name": "Jericho Way — Day Resource Center",
  "phone": "(501) 916-9859",
  "address": "3000 Springer Blvd., Little Rock, AR 72206",
  "hours": "7:30 AM – 2:30 PM",
  "days": "Mon–Fri",
  "svc": "Homeless day center — meals, showers, housing navigation (not overnight shelter)",
  "access": "Walk-in weekdays · Adults experiencing homelessness",
  "need": "housing",
  "patientBlurb": "Walk in weekdays to ask about shelter and housing help."
}
```

### Resource 8 — Baptist Health Medical Center ED — Little Rock

**Validation status:** ✓ verified (2026-06-19 pass 2)

**Verification**
- Source 1: https://www.baptist-health.org/medical-centers/little-rock — 2026-06-19
- Source 2: https://www.baptist-health.com/disaster-information — 2026-06-19
- Confidence: verified

```json
{
  "county": "Little Rock · Pulaski",
  "cat": "Crisis & psych urgent care",
  "name": "Baptist Health Medical Center — Emergency Department",
  "phone": "(501) 202-2000",
  "address": "9601 Baptist Health Dr., Little Rock, AR 72205",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 emergency department — psychiatric emergency care",
  "access": "Walk-in 24/7 · All ages",
  "patientBlurb": "Go to the ER or call 911 if you need help right now."
}
```

### Resource 10 — Diversity Family Health — LGBTQ Primary Care (Little Rock)

**Validation status:** ✓ verified

**Verification**
- Source 1: https://www.diversityfamilyhealth.com/little-rock — 2026-06-19
- Source 2: https://lgbtqhealthcaredirectory.org/provider/kimberly-hill/ — 2026-06-19
- Confidence: verified

```json
{
  "county": "Little Rock · Pulaski",
  "cat": "Health & medical",
  "name": "Diversity Family Health — LGBTQ Primary Care",
  "phone": "(501) 771-0674",
  "address": "500 S. University Ave., Ste. 711, Little Rock, AR 72205",
  "hours": "8:00 AM – 5:00 PM",
  "days": "Mon–Fri",
  "svc": "LGBTQ-affirming primary care, behavioral health & gender-affirming hormones",
  "access": "Call for appointment · Medicaid · All ages",
  "flag": "lgbtq",
  "patientBlurb": "Call to ask for LGBTQ-friendly primary and mental health care."
}
```

### Resource 9 — Arkansas Department of Human Services — SUD Treatment Locator

**Verification**
- Source 1: https://humanservices.arkansas.gov/ — behavioral health division
- Confidence: provisional

### Arkansas — gaps needing manual verification

| Gap | Action |
|-----|--------|
| Inpatient medical detox (non-UAMS) | Search AR DHS SUD provider directory |
| Coordinated entry / Central Arkansas shelter phone | Query AR 211 database |
| Local DV program phones (not national 800 line) | Pull from arcoadition.org member list |

### Arkansas — top 3 recommended DATA merges

1. **Arkansas Medicaid NET Helpline** — No NEMT broker row in DATA.
2. **Ozark Guidance 24/7 Crisis** (distinct from outpatient row) — Clearer Panel D auto-select for northwest AR.
3. **Shelter/coordinated entry** — Once verified via AR 211 (Little Rock/Jericho Way or equivalent).

---

## 3. Cross-state gaps (all bottom 5)

| Category | DE | RI | WY | MT | AR |
|----------|:--:|:--:|:--:|:--:|:--:|
| 988 / crisis | ✓ catalog | ✓ BH Link | ✓ catalog | ✓ catalog | ✓ catalog |
| ED/PES | ✓ Christiana | ✓ RI Hospital ED | ✓ CRMC | ✓ St. Vincent | ✓ Baptist/UAMS |
| CMHC outpatient | ✓ Rockford | ✓ Butler/NMHI | ✓ VOA/CWCC | ✓ WMMHC | ✓ Ozark/UAMS |
| Detox / Panel C | **gap** → Kirkwood | ✓ Butler | **gap** → CWCC/CSAC | ⚑ weak | ⚑ weak |
| 211 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Shelter / CE | **gap** → FIND-BED | **gap** → Crossroads | **gap** → COMEA | **gap** → YWCA | ⚑ Jericho Way |
| DV hotline | **gap** → DVCC | **gap** → Crossroads DV | **gap** → Safehouse | **gap** → YWCA | **gap** → ACADV |
| Medicaid NEMT | ✓ **DATA** | ✓ **DATA** | ✓ **DATA** | ✓ **DATA** | ✓ **DATA** |
| LGBTQ (Panel G) | ✓ CAMP Rehoboth | ✓ Thundermist | ✓ LIV Health | ✓ Blue Mountain | ✓ Diversity FH |

---

## 4. Top 3 highest-value additions overall (all bottom 5)

Ranked by discharge impact × coverage gap:

1. **Statewide Medicaid NEMT / travel lines** (DE ModivCare, RI MTM, WY `(855) 294-2127`, MT MPQH after verify, AR NET `(888) 987-1200`) — No bottom-5 state has a dedicated transport row; discharges fail without ride numbers.

2. **Shelter / coordinated entry hubs** (DE FIND-BED, RI Crossroads RAP, WY COMEA, MT YWCA Family Housing, AR TBD via 211) — Social panel nearly empty outside 211 stub.

3. **Medical detox or crisis stabilization** (DE Kirkwood/Harrington, RI Butler detox, WY Serenity Place + CWCC CSS, MT Dakota Place, AR via DHS locator) — Panel C is the largest clinical gap relative to ED boarding discharges.

---

## 5. Transport doc cross-reference notes

| State | Transport doc phone | Verified 2026-06-19 phone | Action |
|-------|--------------------|-----------------------------|--------|
| Delaware | `(866) 412-3778` ModivCare | Same | OK · **merged to DATA** |
| Rhode Island | `(855) 330-9131` MTM | Same (doc was stale `844-880-0027`) | **Fixed doc** · **merged to DATA** |
| Wyoming | `(855) 294-2127` | Same | OK · **merged to DATA** |
| Montana | `(800) 292-7114` MPQH | Same (was stale `844-549-8351`) | **Fixed doc** · **merged to DATA** |
| Arkansas | `(888) 987-1200` | Same | OK · **merged to DATA** |
| Vermont | `(833) 387-7200` VPTA | Same (was `866-385-9913`) | **Fixed doc** (spot-check) |
| South Carolina | Regional ModivCare lines | Region 1–3 numbers (was `888-336-2288`) | **Fixed doc** (spot-check) |

---

*PsychDispo internal research — not clinical or legal advice. Always call to confirm hours, eligibility, and insurance before discharge.*
