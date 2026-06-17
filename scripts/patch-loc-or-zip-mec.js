#!/usr/bin/env node
const fs = require("fs");
const paths = [
  require("path").join(__dirname, "../PsychDispo-CaringCompass-fixed/public/psychdispo.html"),
  require("path").join(__dirname, "../psychdispo.html"),
];

for (const p of paths) {
  let html = fs.readFileSync(p, "utf8");
  if (html.includes("function patientCounty()")) {
    console.log("Already patched:", p);
    continue;
  }

  // --- L0 UI: city OR zip + MEC instructions ---
  html = html.replace(
    `<div class="ltitle">Patient &amp; discharge context</div>
 <div class="ldesc">Medically cleared, where the patient is discharging from, and where they live — drives referrals and the discharge packet.</div>`,
    `<div class="ltitle">Clinical context</div>
 <div class="ldesc">Complete all four items to unlock the workflow. Patient home may be a <b>city name</b> or <b>5-digit ZIP</b> — either is sufficient for local resource matching.</div>`
  );

  html = html.replace(
    `<div class="q"><label class="qlabel">Medically cleared for psychiatric disposition?</label>`,
    `<div class="q"><label class="qlabel">Medically cleared?</label>`
  );

  html = html.replace(
    `<div class="q"><label class="qlabel">Patient location (after discharge)</label>
  <div class="loc-row">
   <div class="field"><label class="qlabel" style="font-size:12px;margin-bottom:4px">City</label>
    <input type="text" id="city" placeholder="e.g. Columbus" autocomplete="address-level2"></div>
   <div class="field"><label class="qlabel" style="font-size:12px;margin-bottom:4px">ZIP code</label>
    <input type="text" id="zip" inputmode="numeric" maxlength="5" placeholder="e.g. 43210"></div>
  </div>
  <span class="note" id="zipMeta"></span></div>`,
    `<div class="q"><label class="qlabel">Patient home — city or ZIP</label>
  <input type="text" id="loc" placeholder="e.g. Columbus or 43210" style="max-width:280px" autocomplete="address-level2">
  <div class="note" style="margin-top:5px">Type a city (e.g. Bellingham) or a 5-digit ZIP. Only one is required.</div>
  <span class="note" id="zipMeta"></span></div>`
  );

  html = html.replace(
    `<div class="ldesc">Unlocks when safety screening (L2), safety interventions (L4) and at least one referral are complete.</div>`,
    `<div class="ldesc">Available when safety screening (L2), safety interventions (L4), and at least one referral are documented.</div>`
  );

  html = html.replace(
    `Resources are individually verified (✓) or curated national/statewide lines. For medically-cleared patients. Not a substitute for clinical judgment.`,
    `Verified local resources and curated crisis lines for medically cleared patients. Clinical decision support only — not a substitute for judgment, policy, or state law.`
  );

  // --- JS: city lookup + patientCounty ---
  const locJs = `
var CITY_METRO={"columbus":"Columbus (Franklin)","cleveland":"Cleveland (Cuyahoga)","akron":"Akron (Summit)","youngstown":"Youngstown (Mahoning)","canton":"Canton (Stark)","toledo":"Toledo (Lucas)","cincinnati":"Cincinnati (Hamilton)","dayton":"Dayton (Montgomery)","bellingham":"Bellingham · Whatcom","vancouver":"Vancouver · Clark","longview":"Longview · Cowlitz","sedro woolley":"Sedro-Woolley · Skagit","sedro-woolley":"Sedro-Woolley · Skagit","mount vernon":"Sedro-Woolley · Skagit","anacortes":"Sedro-Woolley · Skagit","everett":"Everett · Snohomish (regional)","seattle":"Seattle · King (regional)","friday harbor":"Friday Harbor · San Juan","portland":"Portland, OR (regional)"};
function countyFromCity(raw){if(!raw)return null;var c=raw.toLowerCase().replace(/[,\\.\\-]/g," ").replace(/\\s+/g," ").trim();if(CITY_METRO[c])return CITY_METRO[c];var keys=Object.keys(CITY_METRO);for(var i=0;i<keys.length;i++){if(c.indexOf(keys[i])>=0||keys[i].indexOf(c)>=0)return CITY_METRO[keys[i]];}return null;}
function patientCounty(){if(S.zip.length===5){var z=countyFromZip(S.zip);if(z)return z;}return countyFromCity(S.city);}
function locOk(){return S.zip.length===5||!!(S.city&&S.city.trim().length>=2);}
function syncLocInput(v){v=(v||"").trim();if(/^\\d/.test(v)){S.zip=v.replace(/[^0-9]/g,"").slice(0,5);S.city="";}else{S.city=v;S.zip="";}}
function locDisplay(){if(S.zip.length===5)return S.zip;if(S.city)return S.city;return "";}
`;

  html = html.replace("function cityHintFromZip(z){", locJs + "function cityHintFromZip(z){");

  // --- renderGateSummary location ---
  html = html.replace(
    `if(S.city||S.zip.length===5){
  var loc=[S.city,S.zip.length===5?S.zip:""].filter(Boolean).join(", ");
  var m=countyFromZip(S.zip);if(m)loc+=" · "+m;
  chips.push('<span class="gate-chip"><b>Location</b> · '+esc(loc)+'</span>');
 }`,
    `if(locOk()){
  var loc=locDisplay();var m=patientCounty();if(m)loc+=" · "+m;
  chips.push('<span class="gate-chip"><b>Home</b> · '+esc(loc)+'</span>');
 }`
  );

  // --- countyOK + L0ok ---
  html = html.replace(
    "function countyOK(r){var c=countyFromZip(S.zip);",
    "function countyOK(r){var c=patientCounty();"
  );
  html = html.replace(
    "function L0ok(){return S.cleared===\"yes\"&&S.setting&&S.zip.length===5&&S.insurance;}",
    "function L0ok(){return S.cleared===\"yes\"&&S.setting&&locOk()&&S.insurance;}"
  );
  html = html.replace(/var c=countyFromZip\(S\.zip\);/g, "var c=patientCounty();");
  html = html.replace(/waCluster\(countyFromZip\(S\.zip\)\)/g, "waCluster(patientCounty())");

  // --- loc input listener (replace zip+city listeners) ---
  html = html.replace(
    /\$\("#zip"\)\.addEventListener\("input",function\(e\)\{[\s\S]*?\}\);\n\$\("#city"\)\.addEventListener\("input",function\(e\)\{S\.city=e\.target\.value;render\(\);\}\);/,
    `$("#loc").addEventListener("input",function(e){
 var v=e.target.value;
 if(/^\\d/.test(v.trim())){v=v.replace(/[^0-9]/g,"").slice(0,5);e.target.value=v;}
 syncLocInput(v);
 render();
});`
  );

  // --- zipMeta message ---
  html = html.replace(
    `$("#zipMeta").textContent=S.zip.length===5?(function(){var c=countyFromZip(S.zip);if(!c)return "→ outside listed metros — showing all + national";var cl=waCluster(c);return "→ "+c+(cl?" · regional ~100 mi":"");}()):"";`,
    `$("#zipMeta").textContent=locOk()?(function(){var c=patientCounty();if(!c)return "→ location noted — outside listed metros (national resources shown)";var cl=waCluster(c);return "→ "+c+(cl?" · regional ~100 mi":"");}()):"";`
  );

  // --- packet patient location ---
  html = html.replace(
    'kvRow("Patient location",esc([S.city,S.zip].filter(Boolean).join(", ")||"—")+(c?" · "+esc(c):""))',
    'kvRow("Patient home",esc(locDisplay()||"—")+(c?" · "+esc(c):""))'
  );

  // --- droperidol removal if still present ---
  html = html.replace(/<li><b>Droperidol<\/b>[^<]*<\/li>\s*/gi, "");
  html = html.replace(/,?\s*droperidol,?\s*/gi, ", ");

  fs.writeFileSync(p, html);
  console.log("Patched:", p);
}

// psychref droperidol
const psychref = require("path").join(__dirname, "../PsychDispo-CaringCompass-fixed/public/psychref.html");
if (fs.existsSync(psychref)) {
  let pr = fs.readFileSync(psychref, "utf8");
  const next = pr.replace(/,?\s*droperidol,?\s*/gi, ", ").replace(/,\s*,/g, ",");
  if (next !== pr) {
    fs.writeFileSync(psychref, next);
    console.log("Patched psychref droperidol");
  }
}
