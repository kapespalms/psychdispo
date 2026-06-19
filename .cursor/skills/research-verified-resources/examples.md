# Worked Examples: Research → DATA Entry

Three common resource types with raw research notes and final JSON.

---

## Example 1 — Regional crisis line (Panel D)

### Raw research notes

```
Search: "Franklin County Ohio mental health crisis line"
Source 1: https://netcareaccess.org/ — "24/7 Crisis Line (614) 276-CARE (2273)"
Source 2: Ohio MHAS county board listing — same number
Walk-in: 199 S Central Ave, Columbus — 24/7
No fax for crisis line; email not public
```

### Gaps checked

- [x] Phone — two sources
- [x] Hours/days — 24/7
- [x] Address — for walk-in arm (same org)
- [ ] Fax — N/A for crisis line
- [ ] Email — not published

### Verified output

```markdown
**Verification**
- Source 1: https://netcareaccess.org/ — 2026-06-19
- Source 2: Ohio MHAS directory — 2026-06-19
- Confidence: verified
```

```json
{
  "county": "Columbus (Franklin)",
  "cat": "Crisis & psych urgent care",
  "name": "Netcare Access",
  "phone": "(614) 276-2273",
  "address": "199 S. Central Ave.",
  "hours": "24/7",
  "days": "Daily",
  "svc": "24/7 adult crisis assessment, stabilization & mobile team",
  "access": "Walk-in 24/7 · Medicaid · Adults",
  "auto": 1
}
```

**patientBlurb:** `Call anytime — crisis help and walk-in care.`

**Notes:** Existing DATA entry matches; use this pattern for new regional crisis lines. Add `auto: 1` when the app should pre-select for that county.

---

## Example 2 — Detox facility (Panel C, sub detox)

### Raw research notes

```
Search: "medical detox Franklin County Ohio Medicaid"
Source 1: Facility website — Intake (614) 555-0200, fax (614) 555-0201
          456 Recovery Way — Admissions Mon–Sun 8am–8pm
Source 2: SAMHSA locator — confirms address + phone
Source 3: Phone call to intake — beds require call first; no walk-in after 8pm
Email: admissions@recoveryexample.org (footer of official site)
```

### Before (unverified scrape — DO NOT MERGE)

```json
{
  "county": "Columbus (Franklin)",
  "cat": "Substance use & recovery",
  "name": "Recovery Example Center",
  "phone": "614-555-0200",
  "address": "456 Recovery Way",
  "svc": "Detox",
  "access": "Call for availability"
}
```

**Problems:** No hours/days; phone format inconsistent; no fax/email; no verification; missing `sub: detox`.

### After (verified DATA entry)

```json
{
  "county": "Columbus (Franklin)",
  "cat": "Substance use & recovery",
  "name": "Recovery Example Center — Medical Detox",
  "phone": "(614) 555-0200",
  "address": "456 Recovery Way",
  "hours": "8:00 AM – 8:00 PM",
  "days": "Mon–Sun",
  "svc": "Medical detox & withdrawal management",
  "access": "Call first for bed · Medicaid · Adults",
  "fax": "(614) 555-0201",
  "email": "admissions@recoveryexample.org",
  "sub": "detox"
}
```

**patientBlurb:** `Call for a safe place to detox with medical help.`

**Verification log:** SAMHSA FTLoc + official site + phone confirm 2026-06-19.

---

## Example 3 — Housing / shelter org (Panel F, need housing)

### Raw research notes

```
Search: "Franklin County homeless shelter coordinated entry"
Source 1: https://columbus.gov/shelter — Coordinated Entry (614) 555-0300
          789 Shelter Rd — Office Mon–Fri 9am–4pm; after-hours line same number
Source 2: 211 Central Ohio — matches phone; "call for bed availability"
No public fax; email: shelterinfo@columbus.gov (listed on .gov site)
NEMT: Ohio Medicaid transportation (614) 555-9999 (state NEMT broker — separate entry)
```

### Before (forum post — REJECT)

```
"Try calling the shelter on Main St, I think it's 614-555-0XXX, open sometimes"
```

Do not use. No official source.

### After (verified DATA entry)

```json
{
  "county": "Columbus (Franklin)",
  "cat": "Shelter & housing",
  "name": "Franklin County Coordinated Entry",
  "phone": "(614) 555-0300",
  "address": "789 Shelter Rd",
  "hours": "9:00 AM – 4:00 PM",
  "days": "Mon–Fri",
  "svc": "Shelter referral & coordinated entry for people without housing",
  "access": "Call for bed availability · Adults & families",
  "email": "shelterinfo@columbus.gov",
  "need": "housing"
}
```

**patientBlurb:** `Call to ask about a bed or shelter tonight.`

**transportPhone (optional separate resource or note):** `(614) 555-9999` on Medicaid NEMT entry, not duplicated here unless this org runs its own ride line.

**Clinical vs social:** Panel F → social bucket. Icon: home (housing).

**DV note:** For DV shelters, follow app policy — hotline on patient sheet; full shelter address may be withheld on patient printout.

---

## Quick comparison table

| Example | Panel | Required fields | Preferred captured |
|---------|-------|-----------------|-------------------|
| Crisis line | D | 24/7 phone, address (walk-in), days/hours | — |
| Detox | C | phone, address, days, hours | fax, email, sub:detox |
| Housing | F | phone, address, days, hours | email, need:housing, patientBlurb |
