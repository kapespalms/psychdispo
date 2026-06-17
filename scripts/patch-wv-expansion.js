#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const targets = [
  path.join(__dirname, "../PsychDispo-CaringCompass-fixed/public/psychdispo.html"),
  path.join(__dirname, "../psychdispo.html"),
];

const WV = [
  { county: "West Virginia (statewide)", cat: "Crisis & psych urgent care", name: "HELP4WV — 24/7 Addiction & Mental Health", phone: "(844) 435-7498", svc: "Statewide call, text & chat — crisis assessment & resource navigation", access: "24/7 · All WV · Free", auto: 1 },
  { county: "West Virginia (statewide)", cat: "Benefits & financial", name: "WV 211", phone: "211", svc: "24/7 information & referral — housing, food, crisis, benefits", access: "Dial 211 · 1-833-848-9905 · text zip to 898-211", auto: 1 },
  { county: "West Virginia (statewide)", cat: "Benefits & financial", name: "WV Medicaid Member Services", phone: "(888) 483-0797", svc: "Medicaid coverage, ID card & billing questions", access: "Medicaid members", auto: 1 },
  { county: "West Virginia (statewide)", cat: "Benefits & financial", name: "WV Medicaid Client Services", phone: "(800) 642-8589", svc: "Eligibility, enrollment & member services", access: "Medicaid applicants & members" },

  { county: "Charleston · Kanawha", cat: "Crisis & psych urgent care", name: "Prestera — 24/7 Crisis Line", phone: "(800) 642-3434", address: "511 Morris St, Charleston", svc: "24/7 mobile crisis, CSU & hospital coordination — Kanawha region", access: "24/7 · Medicaid · Adults & youth", auto: 1 },
  { county: "Charleston · Kanawha", cat: "Crisis & psych urgent care", name: "Highland Hospital — Psychiatric Services", phone: "(304) 926-3200", address: "300 56th St SE, Charleston", svc: "Inpatient psychiatric hospital & emergency assessment", access: "24/7 · Medicaid · Adults" },
  { county: "Charleston · Kanawha", cat: "Crisis & psych urgent care", name: "CAMC — Behavioral Health Services", phone: "(304) 388-6061", address: "3200 MacCorkle Ave SE, Charleston", svc: "Psychiatric evaluation, inpatient & outpatient behavioral health", access: "Medicaid · Commercial" },
  { county: "Charleston · Kanawha", cat: "Outpatient psychiatry", name: "Prestera — Charleston Outpatient", phone: "(304) 345-8300", address: "511 Morris St, Charleston", svc: "Psychiatry, therapy, SUD treatment & walk-in screening", access: "Medicaid · Sliding scale" },
  { county: "Charleston · Kanawha", cat: "IOP / PHP", name: "Prestera — Charleston IOP / PHP", phone: "(304) 345-8300", address: "511 Morris St, Charleston", svc: "Intensive outpatient & partial hospitalization", access: "Medicaid · Adults" },
  { county: "Charleston · Kanawha", cat: "Substance use & recovery", name: "Recovery Point of Charleston", phone: "(304) 344-2323", address: "1016 Smith St, Charleston", svc: "Residential recovery & peer support", access: "Medicaid · Uninsured" },
  { county: "Charleston · Kanawha", cat: "Therapy & counseling", name: "Appalachian Community Health Centers — Kanawha", phone: "(304) 720-8680", address: "1535 Washington St W, Charleston", svc: "FQHC behavioral health integrated with primary care", access: "Medicaid · Sliding scale" },
  { county: "Charleston · Kanawha", cat: "Domestic violence & assault", name: "YWCA Resolve — Family Justice Center", phone: "(304) 340-3549", svc: "DV advocacy, safety planning & shelter referrals", access: "Free · All ages" },
  { county: "Charleston · Kanawha", cat: "Food", name: "Manna Meal — Charleston", phone: "(304) 345-7121", address: "1105 Quarrier St, Charleston", svc: "Daily meals & food pantry", access: "Free" },

  { county: "Huntington · Cabell", cat: "Crisis & psych urgent care", name: "Prestera — 24/7 Crisis Line", phone: "(800) 642-3434", address: "55 Donohoe Dr, Huntington", svc: "24/7 mobile crisis & stabilization — Cabell region", access: "24/7 · Medicaid · Adults & youth", auto: 1 },
  { county: "Huntington · Cabell", cat: "Crisis & psych urgent care", name: "Cabell Huntington Hospital — Behavioral Medicine", phone: "(304) 526-2000", address: "1340 Hal Greer Blvd, Huntington", svc: "Psychiatric emergency & inpatient behavioral health", access: "24/7 · Medicaid" },
  { county: "Huntington · Cabell", cat: "Outpatient psychiatry", name: "Prestera — Huntington Outpatient", phone: "(304) 525-7841", address: "55 Donohoe Dr, Huntington", svc: "Psychiatry, therapy, SUD & walk-in screening", access: "Medicaid · Sliding scale" },
  { county: "Huntington · Cabell", cat: "Outpatient psychiatry", name: "Marshall Health — Psychiatry", phone: "(304) 691-1600", address: "1600 Medical Center Dr, Huntington", svc: "Outpatient psychiatry & therapy", access: "Medicaid · Commercial" },
  { county: "Huntington · Cabell", cat: "Substance use & recovery", name: "Recovery Point of Huntington", phone: "(304) 523-4673", address: "2424 3rd Ave, Huntington", svc: "Residential recovery & peer support", access: "Medicaid · Uninsured" },
  { county: "Huntington · Cabell", cat: "Shelter & housing", name: "Huntington City Mission", phone: "(304) 523-0293", address: "624 10th St, Huntington", svc: "Emergency shelter & meals", access: "Walk-in" },

  { county: "Morgantown · Monongalia", cat: "Crisis & psych urgent care", name: "Valley HealthCare — 24/7 Crisis", phone: "(800) 232-0020", address: "301 Scott Ave, Morgantown", svc: "24/7 crisis hotline, mobile team & crisis residential unit", access: "24/7 · Marion · Monongalia · Preston · Taylor", auto: 1 },
  { county: "Morgantown · Monongalia", cat: "Crisis & psych urgent care", name: "WVU Medicine — Chestnut Ridge Center", phone: "(304) 293-3100", address: "930 Chestnut Ridge Rd, Morgantown", svc: "Psychiatric emergency, inpatient & PHP", access: "24/7 · Medicaid" },
  { county: "Morgantown · Monongalia", cat: "Outpatient psychiatry", name: "Valley HealthCare — Morgantown Outpatient", phone: "(304) 296-1731", address: "301 Scott Ave, Morgantown", svc: "Psychiatry, therapy, SUD & case management", access: "Medicaid · Sliding scale" },
  { county: "Morgantown · Monongalia", cat: "IOP / PHP", name: "Valley HealthCare — IOP / PHP", phone: "(304) 296-1731", address: "301 Scott Ave, Morgantown", svc: "Intensive outpatient & partial hospitalization", access: "Medicaid" },
  { county: "Morgantown · Monongalia", cat: "Therapy & counseling", name: "Appalachian Community Health Centers — Morgantown", phone: "(304) 296-5211", address: "252 Decker's Creek Rd, Morgantown", svc: "FQHC integrated behavioral health", access: "Medicaid · Sliding scale" },

  { county: "Wheeling · Northern Panhandle", cat: "Crisis & psych urgent care", name: "Northwood — 24/7 Crisis", phone: "(304) 234-7777", address: "1819 Wood St, Wheeling", svc: "24/7 crisis line, mobile response & 16-bed CSU", access: "24/7 · Ohio · Marshall · Hancock · Brooke", auto: 1 },
  { county: "Wheeling · Northern Panhandle", cat: "Outpatient psychiatry", name: "Northwood — Wheeling Outpatient", phone: "(304) 234-7777", address: "1819 Wood St, Wheeling", svc: "Psychiatry, therapy, SUD & medication-assisted treatment", access: "Medicaid · Sliding scale" },
  { county: "Wheeling · Northern Panhandle", cat: "Crisis & psych urgent care", name: "Northwood — Weirton Crisis Stabilization", phone: "(304) 723-5440", address: "2028 Main St, Weirton", svc: "24-hour crisis stabilization unit", access: "24/7 · Medicaid" },
  { county: "Wheeling · Northern Panhandle", cat: "Therapy & counseling", name: "Appalachian Community Health Centers — Wheeling", phone: "(304) 233-6400", address: "601 E Bethlehem Blvd, Wheeling", svc: "FQHC behavioral health", access: "Medicaid · Sliding scale" },

  { county: "Parkersburg · Wood", cat: "Crisis & psych urgent care", name: "Westbrook — 24/7 Crisis", phone: "(800) 579-5844", address: "2121 Seventh St, Parkersburg", svc: "24/7 crisis hotline & mobile response — Mid-Ohio Valley", access: "24/7 · Wood · Jackson · Roane · Pleasants", auto: 1 },
  { county: "Parkersburg · Wood", cat: "Outpatient psychiatry", name: "Westbrook Health Services — Parkersburg", phone: "(304) 485-1721", address: "2121 Seventh St, Parkersburg", svc: "Psychiatry, therapy, SUD & case management", access: "Medicaid · Sliding scale" },
  { county: "Parkersburg · Wood", cat: "Crisis & psych urgent care", name: "WVU Medicine Camden Clark — Behavioral Health", phone: "(304) 424-2100", address: "800 Garfield Ave, Parkersburg", svc: "Psychiatric evaluation & inpatient behavioral health", access: "Medicaid · 24/7" },

  { county: "Beckley · Raleigh", cat: "Crisis & psych urgent care", name: "Seneca — 24/7 Crisis & Access", phone: "(888) 736-3229", address: "812 S Kanawha St, Beckley", svc: "24/7 mobile crisis response — Greenbrier · Nicholas · Pocahontas · Webster", access: "24/7 · Medicaid · Free", auto: 1 },
  { county: "Beckley · Raleigh", cat: "Outpatient psychiatry", name: "Seneca Health Services — Beckley", phone: "(304) 255-7217", address: "812 S Kanawha St, Beckley", svc: "Psychiatry, therapy, SUD & peer support", access: "Medicaid · Sliding scale" },
  { county: "Beckley · Raleigh", cat: "Crisis & psych urgent care", name: "Beckley ARH Hospital — Behavioral Health", phone: "(304) 255-3000", address: "306 Stanaford Rd, Beckley", svc: "Psychiatric emergency & inpatient behavioral health", access: "24/7 · Medicaid" },
  { county: "Beckley · Raleigh", cat: "Substance use & recovery", name: "FMRS Health Systems — Lewisburg", phone: "(304) 647-5424", address: "101 S Court St, Lewisburg", svc: "Outpatient SUD & mental health — southern WV", access: "Medicaid · Sliding scale" },

  { county: "Eastern Panhandle · Berkeley", cat: "Crisis & psych urgent care", name: "EastRidge — 24/7 Crisis", phone: "(855) 807-1258", address: "235 S Water St, Martinsburg", svc: "24/7 crisis line & mobile COMPASS team", access: "24/7 · Berkeley · Jefferson · Morgan", auto: 1 },
  { county: "Eastern Panhandle · Berkeley", cat: "Outpatient psychiatry", name: "EastRidge Health Systems — Martinsburg", phone: "(304) 263-8954", address: "235 S Water St, Martinsburg", svc: "Psychiatry, therapy, SUD & psychiatric rehab", access: "Medicaid · Sliding scale" },
  { county: "Eastern Panhandle · Berkeley", cat: "Crisis & psych urgent care", name: "WVU Medicine Berkeley Medical Center — Behavioral Health", phone: "(304) 596-6000", address: "2500 Hospital Dr, Martinsburg", svc: "Psychiatric evaluation & inpatient behavioral health", access: "24/7 · Medicaid" },
  { county: "Eastern Panhandle · Berkeley", cat: "Shelter & housing", name: "Eastern Panhandle Empowerment Center", phone: "(304) 263-8292", address: "237 S Queen St, Martinsburg", svc: "DV shelter & advocacy", access: "Free · 24/7 hotline" },
];

const WV_CITIES =
  '"charleston":"Charleston · Kanawha","south charleston":"Charleston · Kanawha","huntington":"Huntington · Cabell","morgantown":"Morgantown · Monongalia","fairmont":"Morgantown · Monongalia","wheeling":"Wheeling · Northern Panhandle","weirton":"Wheeling · Northern Panhandle","parkersburg":"Parkersburg · Wood","vienna":"Parkersburg · Wood","beckley":"Beckley · Raleigh","lewisburg":"Beckley · Raleigh","martinsburg":"Eastern Panhandle · Berkeley","charles town":"Eastern Panhandle · Berkeley","harper\'s ferry":"Eastern Panhandle · Berkeley"';

function patch(html) {
  if (html.includes("Charleston · Kanawha")) return { html, changed: false };

  const m = html.match(/<script>var DATA=(\[.*?\]);<\/script>/s);
  if (!m) throw new Error("DATA block not found");
  const D = JSON.parse(m[1]);
  const merged = D.concat(WV);
  html = html.replace(
    /<script>var DATA=\[.*?\];<\/script>/s,
    "<script>var DATA=" + JSON.stringify(merged) + ";</script>"
  );

  html = html.replace(
    'var CITY_METRO={"columbus"',
    "var CITY_METRO={" + WV_CITIES + ',"columbus"'
  );

  html = html.replace(
    " if(/^972|^970[3-8]/.test(z))return \"Portland, OR (regional)\";",
    [
      " // West Virginia",
      " if(/^250|^251|^252|^253/.test(z))return \"Charleston · Kanawha\";",
      " if(/^255|^256|^257/.test(z))return \"Huntington · Cabell\";",
      " if(/^264|^265/.test(z))return \"Morgantown · Monongalia\";",
      " if(/^260|^262|^263/.test(z))return \"Wheeling · Northern Panhandle\";",
      " if(/^261/.test(z))return \"Parkersburg · Wood\";",
      " if(/^247|^248|^249|^258|^259/.test(z))return \"Beckley · Raleigh\";",
      " if(/^254|^267|^268/.test(z))return \"Eastern Panhandle · Berkeley\";",
      " if(/^972|^970[3-8]/.test(z))return \"Portland, OR (regional)\";",
    ].join("\n")
  );

  html = html.replace(
    "function isNjMetro(z){return countyFromZip(z)===\"Northern New Jersey\";}",
    [
      'var WVREGION=["Charleston · Kanawha","Huntington · Cabell","Morgantown · Monongalia","Wheeling · Northern Panhandle","Parkersburg · Wood","Beckley · Raleigh","Eastern Panhandle · Berkeley"];',
      "function wvCluster(c){return WVREGION.indexOf(c)>=0?WVREGION:null;}",
      "function isWvZip(z){var c=countyFromZip(z);return !!(c&&WVREGION.indexOf(c)>=0);}",
      "function isWvMetro(z){return isWvZip(z);}",
      'function isNjMetro(z){return countyFromZip(z)==="Northern New Jersey";}',
    ].join("\n")
  );

  html = html.replace(
    ' if(r.county==="Washington (statewide)")return isWaZip(S.zip);',
    ' if(r.county==="West Virginia (statewide)")return isWvZip(S.zip);\n if(r.county==="Washington (statewide)")return isWaZip(S.zip);'
  );

  html = html.replace(
    " var upcl=upstateCluster(c);if(upcl)return upcl.indexOf(r.county)>=0;",
    " var upcl=upstateCluster(c);if(upcl)return upcl.indexOf(r.county)>=0;\n var wvcl=wvCluster(c);if(wvcl)return wvcl.indexOf(r.county)>=0;"
  );

  html = html.replace(
    "var cl=waCluster(c)||nyCluster(c)||upstateCluster(c);",
    "var cl=waCluster(c)||nyCluster(c)||upstateCluster(c)||wvCluster(c);"
  );

  html = html.replace(
    " return false;}\nfunction isEmergencyDept(r){",
    [
      " return false;}",
      "function isWvRegionalCrisis(r){",
      " var c=patientCounty();",
      " if(!c||!wvCluster(c))return false;",
      " if(/HELP4WV/i.test(r.name))return true;",
      " if(/Prestera — 24\\/7 Crisis/i.test(r.name))return c===\"Charleston · Kanawha\"||c===\"Huntington · Cabell\";",
      " if(/Valley HealthCare — 24\\/7 Crisis/i.test(r.name))return c===\"Morgantown · Monongalia\";",
      " if(/Northwood — 24\\/7 Crisis/i.test(r.name))return c===\"Wheeling · Northern Panhandle\";",
      " if(/Westbrook — 24\\/7 Crisis/i.test(r.name))return c===\"Parkersburg · Wood\";",
      " if(/Seneca — 24\\/7 Crisis/i.test(r.name))return c===\"Beckley · Raleigh\";",
      " if(/EastRidge — 24\\/7 Crisis/i.test(r.name))return c===\"Eastern Panhandle · Berkeley\";",
      " return false;}",
      "function isEmergencyDept(r){",
    ].join("\n")
  );

  html = html.replace(
    "  if(r.county&&UPSTATEREGION.indexOf(r.county)>=0&&pc&&UPSTATEREGION.indexOf(pc)>=0)return r.county===pc;",
    "  if(r.county&&UPSTATEREGION.indexOf(r.county)>=0&&pc&&UPSTATEREGION.indexOf(pc)>=0)return r.county===pc;\n  if(r.county&&WVREGION.indexOf(r.county)>=0&&pc&&WVREGION.indexOf(pc)>=0)return r.county===pc;"
  );

  html = html.replace(
    "if(isRegionalCrisisLine(r)||isNyRegionalCrisis(r)||isUpstateRegionalCrisis(r))return true;",
    "if(isRegionalCrisisLine(r)||isNyRegionalCrisis(r)||isUpstateRegionalCrisis(r)||isWvRegionalCrisis(r))return true;"
  );

  html = html.replace(
    'if(nm.indexOf("Ohio Relay")>=0)return !isWaZip(S.zip)&&!isNyMetro(S.zip);',
    'if(nm.indexOf("Ohio Relay")>=0)return !isWaZip(S.zip)&&!isNyMetro(S.zip)&&!isWvMetro(S.zip);'
  );

  html = html.replace(
    '||nm==="Ohio Medicaid Consumer Hotline"||nm==="NY Medicaid Consumer Helpline"||isFoodBank(r))return true;',
    '||nm==="Ohio Medicaid Consumer Hotline"||nm==="NY Medicaid Consumer Helpline"||nm==="WV Medicaid Member Services"||isFoodBank(r))return true;'
  );

  html = html.replace(
    'if(S.insurance==="Medicaid"&&(nm==="Ohio Medicaid Consumer Hotline"||nm==="NY Medicaid Consumer Helpline"||/Non-Emergency Transportation/.test(nm)))return true;',
    'if(S.insurance==="Medicaid"&&(nm==="Ohio Medicaid Consumer Hotline"||nm==="NY Medicaid Consumer Helpline"||nm==="WV Medicaid Member Services"||/Non-Emergency Transportation/.test(nm)))return true;'
  );

  html = html.replace(
    "(!isWaZip(S.zip)&&!isNyMetro(S.zip)&&r.name===\"Ohio Medicaid Consumer Hotline\")",
    "(!isWaZip(S.zip)&&!isNyMetro(S.zip)&&!isWvMetro(S.zip)&&r.name===\"Ohio Medicaid Consumer Hotline\")"
  );

  html = html.replace(
    "(S.insurance===\"Medicaid\"&&!isWaZip(S.zip)&&!isNyMetro(S.zip)&&/Non-Emergency Transportation/.test(r.name))",
    "(S.insurance===\"Medicaid\"&&!isWaZip(S.zip)&&!isNyMetro(S.zip)&&!isWvMetro(S.zip)&&/Non-Emergency Transportation/.test(r.name))"
  );

  html = html.replace(
    '(countyFromZip(S.zip)==="Syracuse · Onondaga"&&r.name.indexOf("211 Central New York")>=0)',
    '(countyFromZip(S.zip)==="Syracuse · Onondaga"&&r.name.indexOf("211 Central New York")>=0)||(isWvMetro(S.zip)&&r.name==="WV 211")||(isWvMetro(S.zip)&&r.name==="WV Medicaid Member Services")||(S.insurance==="Medicaid"&&isWvMetro(S.zip)&&r.name.indexOf("WV Medicaid")>=0)'
  );

  html = html.replace(
    "var cl=waCluster(c)||nyCluster(c)||upstateCluster(c);return \"→ \"+c+(cl?\" · regional metro\":\"\");}())",
    "var cl=waCluster(c)||nyCluster(c)||upstateCluster(c)||wvCluster(c);return \"→ \"+c+(cl?\" · regional metro\":\"\");}())"
  );

  html = html.replace(
    "Ohio & Washington",
    "Ohio · WA · NY/NJ · West Virginia"
  );

  return { html, changed: true, count: merged.length, wv: WV.length };
}

for (const p of targets) {
  if (!fs.existsSync(p)) {
    console.log("skip", p);
    continue;
  }
  const raw = fs.readFileSync(p, "utf8");
  const { html, changed, count, wv } = patch(raw);
  if (!changed) {
    console.log("already patched:", p);
    continue;
  }
  fs.writeFileSync(p, html);
  console.log("patched:", p, "DATA", count, "WV+", wv);
}
