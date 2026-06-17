#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const deploy = path.join(__dirname, "../PsychDispo-CaringCompass-fixed/public/psychdispo.html");
const sibling = path.join(__dirname, "../psychdispo.html");
let html = fs.readFileSync(deploy, "utf8");

if (html.includes('data-view="directory"')) {
  console.log("Already patched (directory tab present)");
  process.exit(0);
}

// --- CSS ---
const extraCss = `
.gate-summary{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 4px;padding:12px 14px;background:#f8f9fd;border:1px solid var(--line);border-radius:10px;min-height:44px;align-items:center}
.gate-chip{font-size:12px;padding:5px 10px;border-radius:999px;background:#fff;border:1px solid var(--line);color:var(--ink)}
.gate-chip b{color:var(--t);font-weight:600}
.gate-chip.miss{color:var(--mut);font-style:italic;border-style:dashed}
.loc-row{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end}
.loc-row .field{flex:1;min-width:140px;max-width:220px}
.dir-toolbar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;align-items:center}
.dir-toolbar input[type=search],.dir-toolbar select{max-width:100%;flex:1;min-width:160px}
.dir-count{font-size:12px;color:var(--mut);margin:0 0 10px}
.dir-table{width:100%;border-collapse:collapse;font-size:13px}
.dir-table th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--mut);padding:8px 10px;border-bottom:2px solid var(--line);background:#fafbfd}
.dir-table td{padding:10px;border-bottom:1px solid var(--line);vertical-align:top}
.dir-table tr:hover td{background:#f8f9ff}
.dir-table .dn{font-weight:600;color:var(--ink)}
.dir-table .dm{font-size:11.5px;color:var(--mut);margin-top:2px}
.dir-table .dp{font-weight:700;color:var(--t2);white-space:nowrap}
.dir-table a{color:var(--t2);text-decoration:none}
.pk .setting-banner{background:#eef1fb;border-left:4px solid var(--t);padding:12px 16px;border-radius:8px;margin:12px 0;font-size:13px;line-height:1.5}
.pk .setting-banner b{color:var(--t2)}
`;

html = html.replace(
  "@media print{",
  extraCss + "\n@media print{"
);

// --- Tab bar ---
html = html.replace(
  '<button type="button" class="tab" data-view="ref">Psych Emerg · Review</button>',
  '<button type="button" class="tab" data-view="directory">Resource directory</button><button type="button" class="tab" data-view="ref">Psych Emerg · Review</button>'
);

// --- L0 gate section ---
const oldL0 = `<!-- LAYER 0 -->
<section class="layer" id="L0">
 <div class="ltag">Entry gate</div>
 <div class="q"><label class="qlabel">Q1. Medically cleared?</label>
  <div class="opts" data-field="cleared"><div class="opt" data-val="yes">Yes</div><div class="opt" data-val="no">No</div></div>
  <div class="reveal hidden alert red" id="notCleared">Not medically cleared — complete medical workup / stabilization before psychiatric disposition. This tool is for medically-cleared patients only.</div>
 </div>
 <div class="q"><label class="qlabel">Q2. Discharge setting?</label>
  <div class="opts" data-field="setting">
   <div class="opt" data-val="ED">Emergency Department</div>
   <div class="opt" data-val="InptPsych">Inpatient Psychiatry</div>
   <div class="opt" data-val="InptMed">Inpatient Medicine / Surgery</div>
   <div class="opt" data-val="Urgent">Urgent Care / Crisis Stabilization</div>
   <div class="opt" data-val="Outpatient">Outpatient clinic / office</div>
  </div></div>
 <div class="q"><label class="qlabel">Q3. Patient ZIP code</label>
  <input type="text" id="zip" inputmode="numeric" maxlength="5" placeholder="e.g. 43210" style="max-width:140px">
  <span class="note" id="zipMeta"></span></div>
 <div class="q"><label class="qlabel">Q4. Insurance</label>
  <div class="opts" data-field="insurance">
   <div class="opt" data-val="Medicaid">Medicaid</div><div class="opt" data-val="Medicare">Medicare</div>
   <div class="opt" data-val="Commercial">Commercial</div><div class="opt" data-val="VA">VA / Tricare</div>
   <div class="opt" data-val="Uninsured">Uninsured</div>
  </div></div>
</section>`;

const newL0 = `<!-- LAYER 0 -->
<section class="layer" id="L0">
 <div class="ltag">Entry gate</div>
 <div class="ltitle">Patient &amp; discharge context</div>
 <div class="ldesc">Medically cleared, where the patient is discharging from, and where they live — drives referrals and the discharge packet.</div>
 <div id="gateSummary" class="gate-summary"><span class="gate-chip miss">Complete the fields below to begin</span></div>
 <div class="q"><label class="qlabel">Medically cleared for psychiatric disposition?</label>
  <div class="opts" data-field="cleared"><div class="opt" data-val="yes">Yes</div><div class="opt" data-val="no">No</div></div>
  <div class="reveal hidden alert red" id="notCleared">Not medically cleared — complete medical workup / stabilization before psychiatric disposition. This tool is for medically-cleared patients only.</div>
 </div>
 <div class="q"><label class="qlabel">Discharging from</label>
  <div class="opts" data-field="setting">
   <div class="opt" data-val="ED">Emergency Department</div>
   <div class="opt" data-val="InptPsych">Inpatient Psychiatry</div>
   <div class="opt" data-val="InptMed">Inpatient Medicine / Surgery</div>
   <div class="opt" data-val="Urgent">Urgent Care / Crisis Stabilization</div>
   <div class="opt" data-val="Outpatient">Outpatient clinic / office</div>
  </div></div>
 <div class="q"><label class="qlabel">Patient location (after discharge)</label>
  <div class="loc-row">
   <div class="field"><label class="qlabel" style="font-size:12px;margin-bottom:4px">City</label>
    <input type="text" id="city" placeholder="e.g. Columbus" autocomplete="address-level2"></div>
   <div class="field"><label class="qlabel" style="font-size:12px;margin-bottom:4px">ZIP code</label>
    <input type="text" id="zip" inputmode="numeric" maxlength="5" placeholder="e.g. 43210"></div>
  </div>
  <span class="note" id="zipMeta"></span></div>
 <div class="q"><label class="qlabel">Insurance</label>
  <div class="opts" data-field="insurance">
   <div class="opt" data-val="Medicaid">Medicaid</div><div class="opt" data-val="Medicare">Medicare</div>
   <div class="opt" data-val="Commercial">Commercial</div><div class="opt" data-val="VA">VA / Tricare</div>
   <div class="opt" data-val="Uninsured">Uninsured</div>
  </div></div>
</section>`;

if (!html.includes(oldL0)) throw new Error("L0 block not found");
html = html.replace(oldL0, newL0);

// --- Directory view before view-ref ---
const directoryView = `
<div id="view-directory" class="hidden">
<section class="layer">
 <div class="ltag">Resource directory</div>
 <div class="ltitle">Search verified community resources</div>
 <div class="ldesc">Browse all entries in the database — no disposition required. Filter by metro, category, or keyword. Use the Plan tab to build a discharge packet.</div>
 <div class="dir-toolbar">
  <input type="search" id="dirQ" placeholder="Search name, service, phone…" aria-label="Search resources">
  <select id="dirCounty" aria-label="Filter by metro"><option value="">All metros / regions</option></select>
  <select id="dirCat" aria-label="Filter by category"><option value="">All categories</option></select>
 </div>
 <div class="dir-count" id="dirCount"></div>
 <div style="overflow-x:auto"><table class="dir-table"><thead><tr><th>Organization</th><th>Category</th><th>Metro / region</th><th>Contact</th></tr></thead><tbody id="dirBody"></tbody></table></div>
</section>
</div>
`;

html = html.replace('<div id="view-ref" class="hidden">', directoryView + '<div id="view-ref" class="hidden">');

// --- State: add city ---
html = html.replace(
  'var S={cleared:null,setting:null,zip:"",insurance:null',
  'var S={cleared:null,setting:null,city:"",zip:"",insurance:null'
);

// --- cityHint + gate summary + directory JS (before countyFromZip) ---
const injectJs = `
function cityHintFromZip(z){var c=countyFromZip(z);if(!c)return "";
 if(c.indexOf("·")>=0)return c.split("·")[0].trim();
 if(c.indexOf("(")>=0)return c.split("(")[0].trim();
 return c.replace(/ \\(regional\\)/,"").trim();}
function settingLabel(k){return ({ED:"Emergency Department",InptPsych:"Inpatient Psychiatry",InptMed:"Inpatient Medicine / Surgery",Urgent:"Urgent / Crisis Stabilization",Outpatient:"Outpatient clinic"}[k]||"—");}
function renderGateSummary(){
 var el=$("#gateSummary");if(!el)return;
 var chips=[];
 if(S.cleared==="yes")chips.push('<span class="gate-chip"><b>Cleared</b> · medically stable</span>');
 else if(S.cleared==="no")chips.push('<span class="gate-chip miss">Not cleared — stop</span>');
 if(S.setting)chips.push('<span class="gate-chip"><b>From</b> · '+esc(settingLabel(S.setting))+'</span>');
 if(S.city||S.zip.length===5){
  var loc=[S.city,S.zip.length===5?S.zip:""].filter(Boolean).join(", ");
  var m=countyFromZip(S.zip);if(m)loc+=" · "+m;
  chips.push('<span class="gate-chip"><b>Location</b> · '+esc(loc)+'</span>');
 }
 if(S.insurance)chips.push('<span class="gate-chip"><b>Insurance</b> · '+esc(S.insurance)+'</span>');
 el.innerHTML=chips.length?chips.join(""):'<span class="gate-chip miss">Complete the fields below to begin</span>';
}
var DIR_INIT=0;
function initDirectory(){
 if(DIR_INIT)return;DIR_INIT=1;
 var counties=[...new Set(DATA.map(function(r){return r.county;}).filter(Boolean))].sort();
 var cats=[...new Set(DATA.map(function(r){return r.cat;}).filter(Boolean))].sort();
 var cs=$("#dirCounty");counties.forEach(function(c){var o=document.createElement("option");o.value=c;o.textContent=c;cs.appendChild(o);});
 var ct=$("#dirCat");cats.forEach(function(c){var o=document.createElement("option");o.value=c;o.textContent=c;ct.appendChild(o);});
 ["dirQ","dirCounty","dirCat"].forEach(function(id){var el=$("#"+id);if(el)el.addEventListener("input",renderDirectory);if(el&&el.tagName==="SELECT")el.addEventListener("change",renderDirectory);});
}
function renderDirectory(){
 initDirectory();
 var q=($("#dirQ")&&$("#dirQ").value||"").toLowerCase().trim();
 var fc=$("#dirCounty")?$("#dirCounty").value:"";
 var fcat=$("#dirCat")?$("#dirCat").value:"";
 var list=DATA.filter(function(r){
  if(fc&&r.county!==fc)return false;
  if(fcat&&r.cat!==fcat)return false;
  if(!q)return true;
  var blob=((r.name||"")+" "+(r.svc||"")+" "+(r.cat||"")+" "+(r.county||"")+" "+(r.phone||"")+" "+(r.address||"")).toLowerCase();
  return blob.indexOf(q)>=0;
 });
 if($("#dirCount"))$("#dirCount").textContent=list.length+" resource"+(list.length===1?"":"s")+" · "+DATA.length+" total in directory";
 if(!$("#dirBody"))return;
 $("#dirBody").innerHTML=list.slice(0,200).map(function(r){
  return '<tr><td><div class="dn">'+esc(r.name)+'</div>'+(r.svc?'<div class="dm">'+esc(r.svc)+'</div>':'')+(r.address?'<div class="dm">'+esc(r.address)+'</div>':'')+'</td><td>'+esc(r.cat||"—")+'</td><td>'+esc(r.county||"—")+'</td><td class="dp"><a href="tel:'+tel(r.phone)+'">'+esc(r.phone)+'</a></td></tr>';
 }).join("")+(list.length>200?'<tr><td colspan="4" class="dm">Showing first 200 — narrow your search.</td></tr>':"");
}
function settingPacketBanner(){
 var s=S.setting;
 if(s==="ED")return '<div class="setting-banner"><b>After your emergency visit:</b> This plan lists who to call if you feel unsafe, plus follow-up appointments and community resources. Return to the ER or call 911 if you cannot stay safe.</div>';
 if(s==="InptPsych"||s==="InptMed")return '<div class="setting-banner"><b>After hospital discharge:</b> You are moving to a lower level of care in the community. Keep crisis numbers visible and follow the follow-up plan below.</div>';
 if(s==="Urgent")return '<div class="setting-banner"><b>After crisis stabilization:</b> Use the numbers below for ongoing care and return to crisis services if symptoms worsen.</div>';
 if(s==="Outpatient")return '<div class="setting-banner"><b>From your clinic visit:</b> These are recommended next steps and community supports. Call your clinic if symptoms worsen before your next appointment.</div>';
 return "";
}
function settingClinicianNote(){
 var s=S.setting;
 if(s==="ED")return "ED discharge · crisis resources emphasized · follow-up within 72 h recommended when risk elevated";
 if(s==="InptPsych"||s==="InptMed")return "Inpatient discharge · step-down to "+({outpatient:"outpatient",iop:"IOP",php:"PHP"}[S.intensity]||"community level")+" · aftercare coordination documented";
 if(s==="Outpatient")return "Outpatient encounter · referral coordination · safety plan provided";
 return "";
}
`;

html = html.replace("function countyFromZip(z){", injectJs + "function countyFromZip(z){");

// --- zip listener: suggest city ---
html = html.replace(
  '$("#zip").addEventListener("input",function(e){S.zip=e.target.value.replace(/[^0-9]/g,"").slice(0,5);e.target.value=S.zip;render();});',
  '$("#zip").addEventListener("input",function(e){S.zip=e.target.value.replace(/[^0-9]/g,"").slice(0,5);e.target.value=S.zip;if(S.zip.length===5&&!S.city){var h=cityHintFromZip(S.zip);if(h&&$("#city")){$("#city").placeholder=h;}}render();});\n$("#city").addEventListener("input",function(e){S.city=e.target.value;render();});'
);

// --- render(): gate summary ---
html = html.replace(
  'function render(){\n rev("#notCleared",S.cleared==="no");',
  'function render(){\n renderGateSummary();\n rev("#notCleared",S.cleared==="no");'
);

// --- buildPacket: PsychDispo brand + city + setting banner ---
html = html.replace(
  `var head='<div class="pkhead"><div><div class="wm">Safe<b>Dispo</b></div><div class="doc">Discharge plan</div></div><div class="dt">Printed '+fmtDate(new Date())+'<br>'+esc(loc)+'</div></div>';`,
  `var head='<div class="pkhead"><div><div class="wm">Psych<b>Dispo</b></div><div class="doc">'+esc(settingLabel(S.setting)||"Discharge")+' · discharge plan</div></div><div class="dt">Printed '+fmtDate(new Date())+'<br>'+esc(loc)+'<br><span style="font-size:10px">'+esc(settingClinicianNote())+'</span></div></div>';`
);

html = html.replace(
  'kvRow("Location",("ZIP "+esc(S.zip))+(c?" · "+esc(c):""))',
  'kvRow("Patient location",esc([S.city,S.zip].filter(Boolean).join(", ")||"—")+(c?" · "+esc(c):""))'
);

html = html.replace(
  `'<div class="pkfoot"><span>SafeDispo · PsychDispo — clinical decision support</span>`,
  `'<div class="pkfoot"><span>PsychDispo — psychiatric disposition & discharge</span>`
);

html = html.replace(
  `var p2='<div class="patientpage">'
  +'<h2>Your care plan</h2><div class="lede">Keep this paper with you.`,
  `var p2='<div class="patientpage">'+settingPacketBanner()
  +'<h2>Your care plan</h2><div class="lede">Keep this paper with you.`
);

// --- activateView: directory ---
html = html.replace(
  'function activateView(v,fromHash){\n v=(v==="ref")?"ref":"tool";',
  'function activateView(v,fromHash){\n v=(v==="ref")?"ref":(v==="directory")?"directory":"tool";'
);

html = html.replace(
  '$("#view-tool").classList.toggle("hidden",v!=="tool");\n $("#view-ref").classList.toggle("hidden",v!=="ref");',
  '$("#view-tool").classList.toggle("hidden",v!=="tool");\n $("#view-directory").classList.toggle("hidden",v!=="directory");\n $("#view-ref").classList.toggle("hidden",v!=="ref");\n if(v==="directory")renderDirectory();'
);

html = html.replace(
  'if(v==="ref"){$("#heroTitle").innerHTML="Psych <i>Emerg</i>";',
  'if(v==="directory"){$("#heroTitle").innerHTML="Resource <i>Directory</i>";$("#heroKicker").textContent="Verified community resources · Ohio & Washington";if($("#heroSub"))$("#heroSub").textContent="Search all entries without running the disposition workflow. Switch to PsychDispo · Plan to build a discharge packet.";}\n else if(v==="ref"){$("#heroTitle").innerHTML="Psych <i>Emerg</i>";'
);

html = html.replace(
  'else{$("#heroTitle").innerHTML="Psych<i>Dispo</i>";$("#heroKicker").textContent="Psychiatric disposition & discharge · 8 Ohio metros + WA (PeaceHealth)";',
  'else if(v==="tool"){$("#heroTitle").innerHTML="Psych<i>Dispo</i>";$("#heroKicker").textContent="Psychiatric disposition & discharge · 8 Ohio metros + WA (PeaceHealth)";'
);

html = html.replace(
  'if(h==="ref"||h==="review"||h==="psychref"||h==="reference")return "ref";',
  'if(h==="ref"||h==="review"||h==="psychref"||h==="reference")return "ref";\n if(h==="directory"||h==="resources"||h==="search")return "directory";'
);

// --- print hide directory ---
html = html.replace(
  ".mh-top,.hero,.tabbar,.statusbar,.layer,.note,.toolnote{display:none!important}",
  ".mh-top,.hero,.tabbar,.statusbar,.layer,.note,.toolnote,#view-directory{display:none!important}"
);

for (const p of [deploy, sibling]) {
  let out = html;
  if (p === sibling) {
    out = out.replace(/<header class="mh-top">[\s\S]*?<\/header>/,
      `<header><div class="brandbar">
<svg class="mark" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 3.5 3.6 12.7V28a2 2 0 0 0 2 2h20.8a2 2 0 0 0 2-2V12.7L16 3.5Z" fill="#2640C8"/><path d="M16 15.3v7.4M12.3 19h7.4" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/></svg>
<span class="brand">Psych<span class="b2">Dispo</span></span>
<span class="tagi">Inspiring safer disposition</span>
</div></header>`);
  }
  fs.writeFileSync(p, out);
  console.log("Patched:", p);
}
