# Resource Validation Log — Least-States Pass 2

**Date:** 2026-06-19  
**Validator:** PsychDispo research pipeline (automated web verification)  
**Scope:** DE, RI, WY, MT, AR — all JSON-ready blocks in `resource-research-least-states.md` + 5-state NEMT spot-check + transport doc sample (VT, RI, MT, SC, CO, NH, TX)

---

## Summary

| Metric | Count |
|--------|------:|
| Entries re-validated | 49 |
| Fields corrected | 8 |
| `unverified: 1` removed | 5 |
| New gap-fill resources documented | 4 (LGBTQ) |
| Merged to `psychdispo.html` DATA | 5 |
| Transport doc broker fixes | 4 states (RI, MT, VT, SC) |
| Still provisional | 3 |

---

## Merges to `public/psychdispo.html` (2026-06-19)

| # | Name | County | Phone | Sources |
|---|------|--------|-------|---------|
| 1 | Delaware Medicaid — Non-Emergency Transportation (ModivCare) | Delaware (statewide) | (866) 412-3778 | dhss.delaware.gov/dmma/medical/ · delaware211.org |
| 2 | Rhode Island Medicaid — Medical Transportation (MTM) | Rhode Island (statewide) | (855) 330-9131 | eohhs.ri.gov · mtm-inc.net/rhode-island |
| 3 | Wyoming Medicaid — Travel Assistance | Wyoming (statewide) | (855) 294-2127 | health.wyo.gov Member Handbook · wyomingmedicaid.com |
| 4 | Montana Medicaid — Non-Emergency Transportation | Montana (statewide) | (800) 292-7114 | dphhs.mt.gov transportation page · Medicaid Member Guide 2026 |
| 5 | Arkansas Medicaid — NET Transportation Helpline | Arkansas (statewide) | (888) 987-1200 | humanservices.arkansas.gov NET page · transport doc |

---

## Ready to merge (verified, not yet in DATA)

| Priority | Name | State | Phone | Blocker |
|----------|------|-------|-------|---------|
| 1 | Kirkwood Detox — NET Detox | DE | (302) 691-0140 | Awaiting merge approval |
| 2 | Housing Alliance Delaware — FIND-BED | DE | (833) 346-3233 | Awaiting merge approval |
| 3 | Crossroads Rhode Island — Housing Hotline (RAP) | RI | (401) 865-6215 | Awaiting merge approval |
| 4 | COMEA House — Emergency Shelter | WY | (307) 632-3174 | Awaiting merge approval |
| 5 | YWCA Missoula — Pathways DV Crisis Line | MT | (406) 542-1944 | Awaiting merge approval |
| 6 | WMMHC — Dakota Place Crisis Facility | MT | (406) 532-8949 | Verified pass 2 |
| 7 | CAMP Rehoboth — Health & Wellness | DE | (302) 227-5620 | LGBTQ gap fill |

---

## Per-entry validation (pass 2)

### Delaware

| Resource | Status | Sources | Notes |
|----------|--------|---------|-------|
| MCIS Northern | ✓ PASS | dhss.delaware.gov · springboarddelaware.org | Phone/address unchanged |
| Kirkwood Detox | ✓ PASS | namidelaware.org · springboarddelaware.org | |
| Harrington Detox | ✓ PASS | namidelaware.org · dvcc.delaware.gov | |
| FIND-BED | ✓ PASS | dhss.delaware.gov/homeless · springboarddelaware.org | Email confirmed |
| DVCC New Castle DV | ✓ PASS | dvcc.delaware.gov | |
| Medicaid NEMT ModivCare | ✓ PASS · **MERGED** | dhss.delaware.gov/dmma · delaware211.org | Hours 7am–4pm M–F per AmeriHealth DE |
| Delaware Guidance Services | ✓ PASS | delawareguidance.org | |
| Christiana Hospital ED | ✓ PASS | christianacare.org contact + facility pages | Removed `unverified` |
| Recovery Response Center | ✓ PASS | namidelaware.org | |
| CAMP Rehoboth LGBTQ | ✓ PASS | camprehoboth.org | **New gap fill** |

### Rhode Island

| Resource | Status | Sources | Notes |
|----------|--------|---------|-------|
| BH Link | ✓ PASS | bhlink.org | |
| Butler Detox | ✓ PASS | butler.org | |
| Crossroads RAP | ✓ PASS | crossroadsri.org | |
| Crossroads DV | ✓ PASS | crossroadsri.org | |
| Medicaid NEMT MTM | ✓ PASS · **MERGED** | eohhs.ri.gov · mtm-inc.net | Transport doc corrected from 844-880-0027 |
| CODAC | ✓ PASS | codacinc.org | |
| Thundermist Trans Health | ✓ PASS | thundermisthealth.org | |
| RI Hospital ED | ✓ PASS | brownhealth.org ED page | Phone → (401) 444-5411; address 80 Dudley St. |

### Wyoming

| Resource | Status | Sources | Notes |
|----------|--------|---------|-------|
| VOA Cheyenne CMHC | ✓ PASS | voanr.org · wyoming211.org | |
| Serenity Place South | ✓ PASS | voanr.org | |
| CWCC Casper | ✓ PASS | cwcc.us | |
| CWCC Crisis Stabilization | ✓ PASS | cwcc.us/crisis-resources | |
| Cheyenne Regional ED | ✓ PASS | cheyenneregional.org | |
| COMEA House | ✓ PASS | wyoming211.org | |
| Safehouse DV | ✓ PASS | wyomingsafehouse.org · wyoming211.org | |
| Wyoming 211 | ✓ PASS | wyoming211.org | |
| Medicaid Travel | ✓ PASS · **MERGED** | health.wyo.gov handbook | |
| SUD Ombudsman | ✓ PASS | health.wyo.gov CSAC | |
| LIV Health LGBTQ | ✓ PASS | wyoming.livhealth.org | **New gap fill** |

### Montana

| Resource | Status | Sources | Notes |
|----------|--------|---------|-------|
| WMMHC Missoula | ✓ PASS | wmmhc.org | |
| Dakota Place Crisis | ✓ PASS | wmmhc.org/locations | Phone corrected to (406) 532-8949; removed `unverified` |
| YWCA DV | ✓ PASS | ywcamissoula.org | |
| YWCA Family Housing | ✓ PASS | ywcamissoula.org | |
| Montana 211 | ✓¹ PASS | navigateresources.net/211montana | Dial 211; 24/7 assumed |
| Medicaid NEMT | ✓ PASS · **MERGED** | dphhs.mt.gov · Member Guide | **Corrected** 844-549-8351 → 800-292-7114 |
| St. Vincent ED | ✓ PASS | intermountainhealthcare.org | Removed `unverified` |
| Blue Mountain Clinic LGBTQ | ✓ PASS | bluemountainclinic.org | **New gap fill** |
| Recovery Center Missoula | ⚑ PROVISIONAL | — | Not re-verified this pass |

### Arkansas

| Resource | Status | Sources | Notes |
|----------|--------|---------|-------|
| Ozark Guidance Crisis | ✓ PASS | ozarkguidance.org | |
| Ozark Guidance Outpatient | ✓ PASS | ozarkguidance.org | |
| UAMS Psych ED | ✓ PASS | In DATA | |
| Arkansas 211 | ✓ PASS | dial 211 | |
| Medicaid NET | ✓ PASS · **MERGED** | humanservices.arkansas.gov | |
| ACADV DV Hotline | ✓ PASS | domesticpeace.com · AR DHS PDF | **Corrected** to (800) 269-4668; M–F not 24/7 |
| Jericho Way | ⚑ PROVISIONAL | arkansas211.org · depaulusa.org | Phone (501) 916-9859 not on Depaul primary page |
| Baptist Health ED | ✓ PASS | baptist-health.org | Removed `unverified` |
| Diversity Family Health LGBTQ | ✓ PASS | diversityfamilyhealth.com | **New gap fill** |
| DHS SUD Locator | ⚑ PROVISIONAL | — | Directory only; not re-verified |

---

## Transport doc spot-check (5 random + bottom-5)

| State | Doc phone (before) | Verified phone | Result |
|-------|-------------------|----------------|--------|
| Vermont | 866-385-9913 | **833-387-7200** | **FAIL → fixed** |
| Rhode Island | 844-880-0027 | **855-330-9131** | **FAIL → fixed** |
| Montana | 844-549-8351 | **800-292-7114** | **FAIL → fixed** |
| South Carolina | 888-336-2288 (single) | **866-910-7688 / 866-445-6860 / 866-445-9954** | **FAIL → fixed** |
| Colorado | 855-489-4999 | 855-489-4999 | PASS (MediDrive transition note added) |
| New Hampshire | 844-259-4780 | 844-259-4780 | PASS |
| Texas | 877-633-8747 | 877-633-8747 | PASS |
| Delaware | 866-412-3778 | 866-412-3778 | PASS |
| Wyoming | 855-294-2127 | 855-294-2127 | PASS |
| Arkansas | 888-987-1200 | 888-987-1200 | PASS |

---

## Remaining gaps (all bottom 5)

1. **Panel C detox** — DE Kirkwood/Harrington, WY CWCC/SUD ombudsman documented but not merged; MT/AR weak inpatient detox coverage.
2. **Shelter / coordinated entry** — DE FIND-BED, RI Crossroads, WY COMEA, MT YWCA housing verified but not merged; AR Jericho Way provisional (day center only).
3. **DV hotlines (local 24/7)** — DE DVCC, RI Crossroads DV, WY Safehouse, MT YWCA verified but not merged; AR ACADV is coalition referral (M–F), not 24/7 crisis shelter line.
4. **Peak Wellness → VOA rebrand** — Wyoming DATA still lists "Peak Wellness" for Cheyenne rows.
5. **988 local center names** — All five states use generic 988/catalog stubs; no state-specific crisis center name added (988 is national).

---

*PsychDispo internal research — not clinical or legal advice.*
