#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "..");
const sibling = path.join(base, "psychdispo.html");
const deploy = path.join(base, "PsychDispo-CaringCompass-fixed/public/psychdispo.html");

let html = fs.readFileSync(sibling, "utf8");

// --- CSS fixes ---
html = html.replace(
  /body\{margin:0;font-family:var\(--sans\);background:var\(--bg\);color:var\(--ink\);font-size:15px;line-height:1\.45;-webkit-font-smoothing:antialiased\}/,
  "body{margin:0;font-family:var(--sans);background:var(--bg);color:var(--ink);font-size:15px;line-height:1.45;-webkit-font-smoothing:antialiased;padding-bottom:72px}"
);
html = html.replace(
  /\.statusbar\{position:sticky;bottom:0;/,
  ".statusbar{position:fixed;left:0;right:0;bottom:0;"
);

// mh-top shell CSS (for deploy embed)
const mhCss = `body.embed .tabbar{display:none!important}
/* Top white brand bar */
.mh-top{display:flex;align-items:center;justify-content:space-between;gap:24px;
  background:#fff;border-bottom:1px solid var(--line);padding:15px 34px}
.mh-brand{display:flex;align-items:center;gap:15px;flex-wrap:wrap;text-decoration:none;color:inherit}
.mh-word{font-family:var(--serif);font-size:29px;font-weight:700;color:var(--ink);letter-spacing:-.5px;line-height:1}
.mh-word i{color:var(--t);font-style:italic}
.mh-kicker{font-size:10px;letter-spacing:1.9px;text-transform:uppercase;color:var(--mut);font-weight:600}
.mh-tagline{font-family:var(--serif);font-style:italic;font-size:16px;color:var(--mut);white-space:nowrap}
@media(max-width:900px){.mh-tagline,.mh-kicker{display:none}.mh-top{padding:12px 16px}}`;

if (!html.includes(".mh-top{")) {
  html = html.replace(
    /body\.embed \.tabbar\{display:none!important\}/,
    mhCss
  );
  if (!html.includes(".mh-top{")) {
    html = html.replace(".lines div{border-bottom:1px solid #cdd6d5;height:1.7em}", ".lines div{border-bottom:1px solid #cdd6d5;height:1.7em}\n" + mhCss);
  }
}

// --- UI strings ---
html = html.replace(
  /PsychRef · Review/g,
  "Psych Emerg · Review"
);
html = html.replace(
  '<p class="sub">Resources are individually verified',
  '<p class="sub" id="heroSub">Resources are individually verified'
);

// --- countyFromZip: PeaceHealth + regional hubs ---
const oldCountyFn = /function countyFromZip\(z\)\{[\s\S]*?return null;\}/;
const newCountyFn = `function countyFromZip(z){
 if(/^43[0-2]/.test(z))return "Columbus (Franklin)";
 if(/^44[01]/.test(z))return "Cleveland (Cuyahoga)";
 if(/^44[23]/.test(z))return "Akron (Summit)";
 if(/^44[45]/.test(z))return "Youngstown (Mahoning)";
 if(/^44[67]/.test(z))return "Canton (Stark)";
 if(/^436/.test(z)||["43537","43560","43528","43566","43571","43542","43558","43504","43547"].indexOf(z)>=0)return "Toledo (Lucas)";
 if(/^45[012]/.test(z))return "Cincinnati (Hamilton)";
 if(/^454/.test(z)||["45342","45377","45322","45426","45449","45417","45315","45424"].indexOf(z)>=0)return "Dayton (Montgomery)";
 // Washington — PeaceHealth communities + ~100 mi regional clusters (specific before broad)
 if(["98250","98261","98279","98245","98243","98280","98286","98297"].indexOf(z)>=0)return "Friday Harbor · San Juan";
 if(["98284","98273","98233","98221","98274","98232","98235","98237","98257","98263","98267","98238","98255","98239","98256","98282","98283","98234"].indexOf(z)>=0)return "Sedro-Woolley · Skagit";
 if(["98632","98626","98611","98625","98645","98674","98612","98616","98621","98643","98647","98603","98609","98601","98604","98649"].indexOf(z)>=0)return "Longview · Cowlitz";
 if(/^9820[1-8]|^9824[13]|^9825[124]|^9827[01]|^9829[016]|^98012|^98020|^98021|^98026|^98036|^98037|^98043|^98082|^98252|^98258|^98259|^98270|^98271|^98272|^98275|^98287|^98290|^98291|^98296/.test(z))return "Everett · Snohomish (regional)";
 if(/^981|^980(?:0[1-9]|1[01359]|2[023789]|3[0-5]|4[025689]|5[0-57-9]|6[2-5]|7[0-78]|8[39]|9[23])/.test(z))return "Seattle · King (regional)";
 if(/^9822[5-9]|^9823[0-4]|^9824[0-689]|^9826[2468]|^9827[6-9]|^9828[01]/.test(z))return "Bellingham · Whatcom";
 if(/^972|^970[3-8]/.test(z))return "Portland, OR (regional)";
 if(/^986/.test(z))return "Vancouver · Clark";
 return null;}
function isWaZip(z){var c=countyFromZip(z);if(!c||/Portland, OR/.test(c))return false;return c.indexOf("·")>=0||/\\(regional\\)/.test(c);}`;

if (!oldCountyFn.test(html)) throw new Error("countyFromZip block not found");
html = html.replace(oldCountyFn, newCountyFn);

// --- countyOK: Washington statewide ---
html = html.replace(
  /function countyOK\(r\)\{var c=countyFromZip\(S\.zip\);\n if\(r\.national\)\{ if\(r\.county&&\/Columbus\|Cleveland\/\.test\(r\.county\)\)\{return !c\|\|r\.county===c;\} return true; \}\n if\(!c\)return true;\n var cl=waCluster\(c\);if\(cl\)return cl\.indexOf\(r\.county\)>=0;\n return r\.county===c;\}/,
  `function countyOK(r){var c=countyFromZip(S.zip);
 if(r.national){ if(r.county&&/Columbus|Cleveland/.test(r.county)){return !c||r.county===c;} return true; }
 if(r.county==="Washington (statewide)")return isWaZip(S.zip);
 if(!c)return true;
 var cl=waCluster(c);if(cl)return cl.indexOf(r.county)>=0;
 return r.county===c;}`
);

// --- autoMatch: WA Apple Health vs Ohio Medicaid ---
html = html.replace(
  /function autoMatch\(r\)\{var nm=r\.name;\n if\(r\.auto\)return true;\n if\(nm==="211 — United Way"\|\|^988 \/.test\(nm\)\|\|nm==="911 — Emergency"\|\|nm==="Crisis Text Line"\|\|nm==="Trans Lifeline"\|\|nm==="Ohio Medicaid Consumer Hotline"\|\|isFoodBank\(r\)\)return true;\n if\(S\.insurance==="Medicaid"&&\(nm==="Ohio Medicaid Consumer Hotline"\|\|\/Non-Emergency Transportation\/.test\(nm\)\)\)return true;\n if\(r\.national&&r\.flag&&activeFlag\(r\.flag\)\)return true;\n if\(\(S\.flags\.sud\|\|sudPositive\(\)\)&&r\.panel==="C"&&r\.national\)return true;\n return false;\}/,
  `function autoMatch(r){var nm=r.name;
 if(r.auto)return true;
 if(nm==="211 — United Way"||/^988 /.test(nm)||nm==="911 — Emergency"||nm==="Crisis Text Line"||nm==="Trans Lifeline"||isFoodBank(r))return true;
 if(isWaZip(S.zip)&&(nm==="Washington Recovery Help Line"||nm.indexOf("Apple Health")>=0||nm==="Washington Relay (Deaf / HoH)"))return true;
 if(!isWaZip(S.zip)&&nm==="Ohio Medicaid Consumer Hotline")return true;
 if(S.insurance==="Medicaid"){
  if(isWaZip(S.zip)&&(nm.indexOf("Apple Health")>=0||nm==="Washington Recovery Help Line"))return true;
  if(!isWaZip(S.zip)&&(nm==="Ohio Medicaid Consumer Hotline"||/Non-Emergency Transportation/.test(nm)))return true;
 }
 if(r.national&&r.flag&&activeFlag(r.flag))return true;
 if((S.flags.sud||sudPositive())&&r.panel==="C"&&r.national)return true;
 return false;}`
);

// --- alwaysList WA ---
html = html.replace(
  /var alwaysList=pick\(function\(r\)\{return r\.panel==="F"&&\(r\.need==="catchall"\|\|r\.name==="Ohio Medicaid Consumer Hotline"\|\|isFoodBank\(r\)\|\|\(S\.insurance==="Medicaid"&&\/Non-Emergency Transportation\/.test\(r\.name\)\)\);\}\);/,
  `var alwaysList=pick(function(r){return r.panel==="F"&&(r.need==="catchall"||isFoodBank(r)||(isWaZip(S.zip)&&r.name.indexOf("Apple Health")>=0)||(!isWaZip(S.zip)&&r.name==="Ohio Medicaid Consumer Hotline")||(S.insurance==="Medicaid"&&!isWaZip(S.zip)&&/Non-Emergency Transportation/.test(r.name)));});`
);

// --- render() wiring fixes ---
html = html.replace(
  /} else if\(opt\.dataset\.mc!==undefined\)\{\n  var mc=opt\.dataset\.mc;S\.refContact\[mc\]=S\.refContact\[mc\]\?0:1;opt\.classList\.toggle\("sel",!!S\.refContact\[mc\]\);\n \}/,
  `} else if(opt.dataset.mc!==undefined){
  var mc=opt.dataset.mc;S.refContact[mc]=S.refContact[mc]?0:1;opt.classList.toggle("sel",!!S.refContact[mc]);render();
 }`
);

html = html.replace(
  /if\(tx\)\{S\[tx\]=e\.target\.value;\}\n\}\);/,
  `if(tx){S[tx]=e.target.value;render();}
});`
);

html = html.replace(
  /if\(e\.target\.dataset\.store!==undefined\)\{setPath\(e\.target\.dataset\.store,e\.target\.checked\);\}/,
  `if(e.target.dataset.store!==undefined){setPath(e.target.dataset.store,e.target.checked);render();}`
);

// --- zipMeta regional hint ---
html = html.replace(
  /\$\("#zipMeta"\)\.textContent=S\.zip\.length===5\?\(countyFromZip\(S\.zip\)\?\("→ "\+countyFromZip\(S\.zip\)\):"→ outside listed metros — showing all \+ national"\):"";/,
  `$("#zipMeta").textContent=S.zip.length===5?(function(){var c=countyFromZip(S.zip);if(!c)return "→ outside listed metros — showing all + national";var cl=waCluster(c);return "→ "+c+(cl?" · regional ~100 mi":"");}()):"";`
);

// --- activateView: Psych Emerg hero ---
html = html.replace(
  /if\(v==="ref"\)\{\$\("#heroTitle"\)\.innerHTML="Psych<i>Ref<\/i>";\$\("#heroKicker"\)\.textContent="High-yield clinical reference · evidence-based";\}/,
  `if(v==="ref"){$("#heroTitle").innerHTML="Psych <i>Emerg</i>";$("#heroKicker").textContent="Psych emergency review — evidence-based";if($("#heroSub"))$("#heroSub").textContent="The safety gate & level-of-care knowledge base. Reference only — does not replace clinical judgment or state-specific law.";}`
);
html = html.replace(
  /else\{\$\("#heroTitle"\)\.innerHTML="Psych<i>Dispo<\/i>";\$\("#heroKicker"\)\.textContent="Psychiatric disposition & discharge · 8 Ohio metros \+ WA \(PeaceHealth\)";\}/,
  `else{$("#heroTitle").innerHTML="Psych<i>Dispo</i>";$("#heroKicker").textContent="Psychiatric disposition & discharge · 8 Ohio metros + WA (PeaceHealth)";if($("#heroSub"))$("#heroSub").textContent="Resources are individually verified (✓) or curated national/statewide lines. For medically-cleared patients. Not a substitute for clinical judgment.";}`
);

// --- print CSS: hide mh-top ---
html = html.replace(
  /header,\.hero,\.statusbar,\.layer,\.note,\.toolnote,\.tabbar\{display:none!important\}/,
  ".mh-top,.hero,.tabbar,.statusbar,.layer,.note,.toolnote{display:none!important}"
);

fs.writeFileSync(sibling, html);

// Deploy copy: swap legacy header for embed shell
const deployHeader = `<header class="mh-top">
<a class="mh-brand" href="/" target="_parent">
<span class="mh-word">Psych<i>Dispo</i></span>
<span class="mh-kicker">Psychiatric Disposition · Discharge Planning · Ohio & Washington</span>
</a>
<span class="mh-tagline">Inspiring safer disposition</span>
</header>`;

let deployHtml = html.replace(
  /<header><div class="brandbar">[\s\S]*?<\/div><\/header>/,
  deployHeader
);

// Ensure Outpatient setting exists in deploy (should from sibling)
if (!deployHtml.includes('data-val="Outpatient"')) {
  throw new Error("Outpatient setting missing after sync");
}

fs.writeFileSync(deploy, deployHtml);
console.log("Synced psychdispo.html → sibling + deploy");
console.log("  Outpatient:", deployHtml.includes('data-val="Outpatient"'));
console.log("  waCluster:", deployHtml.includes("function waCluster"));
console.log("  isWaZip:", deployHtml.includes("function isWaZip"));
console.log("  Seattle DATA:", deployHtml.includes("Seattle · King"));
console.log("  DATA rows:", (deployHtml.match(/"county":/g) || []).length);
