#!/usr/bin/env node
/** Button-first intake: insurance row, LOC columns, no-scroll cards, Enter advance */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "../public/psychdispo.html");
let html = fs.readFileSync(file, "utf8");

function mustReplace(from, to, label) {
  if (!html.includes(from)) {
    console.error("MISSING:", label);
    process.exit(1);
  }
  html = html.replace(from, to);
  console.log("OK:", label);
}

// --- CSS ---
const intakeCss = `
.ico-sf{display:inline-flex;align-items:center;justify-content:center;flex:none}
.ico-sf svg{width:1.15em;height:1.15em;stroke:currentColor;fill:none;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.slide-shell{padding:4px 0 0;margin-bottom:0}
.slide-panel{display:flex;flex-direction:column;min-height:calc(100dvh - 148px);max-height:calc(100dvh - 148px);overflow:hidden}
.slide-panel .float-card,.slide-panel .layer{flex:1;display:flex;flex-direction:column;overflow:hidden;padding:10px 16px 0;margin:0;min-height:0}
.slide-panel .card-body{flex:1;min-height:0;overflow:hidden}
.step-kicker{margin-bottom:2px;padding-top:2px}
.step-head{padding-bottom:2px}
.step-head .ltitle{font-size:24px;margin:0 0 2px;line-height:1.08}
.q{margin:7px 0}
.field-label{margin-bottom:6px}
.gate-grid{gap:6px 10px;margin-top:0}
.gate-row-2{gap:6px 10px}
.intake-divider{margin-top:8px;padding-top:8px}
.intake-divider>.sub2:first-child{display:none}
.intake-divider .sub2{margin:6px 0 4px;padding-top:6px;font-size:10px}
.pop-flags-grid{gap:6px 8px;margin-top:4px}
.pop-col{padding:6px 8px}
.pop-col .opt,.safety-col .opt{font-size:12px;padding:6px 10px;min-height:40px;white-space:normal;line-height:1.25}
.pop-flags-grid.compact .pop-col{padding:2px 0}
.safety-grid{gap:6px;margin-top:4px}
.safety-col{padding:6px 8px}
.safety-col .sub2{font-size:10px;margin-bottom:4px}
.ins-row .opt,.loc-opts .opt{min-height:42px;padding:8px 12px;font-size:13px;white-space:normal;line-height:1.2}
.loc-cols{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:start}
.loc-col-h{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--t);margin:0 0 6px}
.loc-col.dimmed .loc-col-h{color:var(--faint)}
.loc-col.dimmed .opt{opacity:.55}
.loc-opts{display:flex;flex-direction:column;gap:6px;flex-wrap:nowrap}
.loc-opts .opt{width:100%;text-align:left}
.chip-row .opt{font-size:12px;padding:6px 10px;min-height:38px}
.card-foot{flex:none;position:sticky;bottom:0;margin:8px -16px 0;padding:10px 16px calc(10px + env(safe-area-inset-bottom,0px));background:linear-gradient(180deg,rgba(255,253,248,0) 0%,var(--card) 28%);border-top:1px solid var(--line);z-index:4}
.card-foot .card-continue{width:100%;min-height:48px;font-size:15px;font-weight:700;border-radius:12px;border:none;background:var(--t);color:#fff;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:8px;touch-action:manipulation}
.card-foot .card-continue:disabled{background:#aebdbb;cursor:not-allowed;opacity:1}
.card-foot .card-continue svg{width:18px;height:18px;stroke-width:2;flex:none}
.pathway-card .pcard-ico{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:8px;color:var(--t)}
.pathway-card.ed .pcard-ico{background:#e8eaf8}
.pathway-card.op .pcard-ico{background:#e7f0ec;color:var(--sage)}
.pathway-card .pcard-ico svg{width:18px;height:18px;stroke-width:1.75}
@media(max-width:680px){
 .slide-panel{min-height:calc(100dvh - 132px);max-height:calc(100dvh - 132px)}
 .step-head .ltitle{font-size:21px}
 .gate-auto-note,.intake-divider .sub2,#zipMeta,.pop-col .sub2,.ref-deeplink,.collab-banner{display:none!important}
 .pop-flags-grid{grid-template-columns:1fr 1fr}
 .loc-cols{grid-template-columns:1fr}
 .statusbar .nav-btn.cont{display:none}
}
@media(min-width:681px){
 .card-foot{display:none}
}
`;

if (!html.includes(".card-foot{")) {
  html = html.replace(".intake-divider{margin-top:20px", intakeCss + "\n.intake-divider{margin-top:20px");
  console.log("OK: intake css");
}

// --- Pathway card icons ---
mustReplace(
  `  <button type="button" class="pathway-card ed" data-pathway="ed">
   <div class="pname">Psych ED Dispo</div>`,
  `  <button type="button" class="pathway-card ed" data-pathway="ed">
   <div class="pcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
   <div class="pname">Psych ED Dispo</div>`,
  "ed pathway icon"
);

mustReplace(
  `  <button type="button" class="pathway-card op" data-pathway="outpatient">
   <div class="pname">Psych Outpatient Dispo</div>`,
  `  <button type="button" class="pathway-card op" data-pathway="outpatient">
   <div class="pcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z"/></svg></div>
   <div class="pname">Psych Outpatient Dispo</div>`,
  "op pathway icon"
);

// --- Insurance button row ---
mustReplace(
  `  <div class="q"><div class="field-label"><span class="req-mark" data-req="insurance" aria-hidden="true">■</span>Insurance</div>
   <select id="selInsurance"><option value="">— Select —</option><option value="Medicaid">Medicaid</option><option value="Medicare">Medicare</option><option value="Commercial">Commercial</option><option value="VA">VA / Tricare</option><option value="Uninsured">Uninsured</option></select>
  </div>`,
  `  <div class="q gate-wide"><div class="field-label"><span class="req-mark" data-req="insurance" aria-hidden="true">■</span>Insurance</div>
   <div class="opts ins-row" id="insuranceOpts" role="group" aria-label="Insurance"></div>
  </div>`,
  "insurance buttons"
);

// --- LOC two columns ---
mustReplace(
  `  <div class="q gate-wide"><div class="field-label"><span class="req-mark" aria-hidden="true">■</span>Disposition / level of care</div>
   <select id="selDispLoc"><option value="">— Select level of care —</option></select>
   <div class="note" id="opOnlyNote" style="display:none;margin-top:5px">Outpatient — community only (OP, IOP, PHP).</div>
  </div>`,
  `  <div class="q gate-wide"><div class="field-label"><span class="req-mark" aria-hidden="true">■</span>Disposition / level of care</div>
   <div class="loc-cols" id="dispLocCols">
    <div class="loc-col community-col">
     <div class="loc-col-h">Community</div>
     <div class="opts loc-opts" id="locCommunityOpts"></div>
    </div>
    <div class="loc-col residential-col" id="residentialLocCol">
     <div class="loc-col-h">Residential</div>
     <div class="opts loc-opts" id="locResidentialOpts"></div>
    </div>
   </div>
   <div class="note" id="opOnlyNote" style="display:none;margin-top:5px">Outpatient — community only (OP, IOP, PHP).</div>
  </div>`,
  "loc columns"
);

// --- Language as buttons ---
mustReplace(
  `  <div><label class="qlabel">Preferred language</label>
   <select id="lang"><option value="English">English</option><option value="Spanish">Spanish</option><option value="Somali">Somali</option><option value="Arabic">Arabic</option><option value="Nepali">Nepali</option><option value="French">French</option><option value="ASL">ASL</option><option value="Other">Other</option></select></div>`,
  `  <div><div class="field-label">Preferred language</div>
   <div class="opts" data-field="lang" id="langOpts"><button type="button" class="opt sel" data-val="English">English</button><button type="button" class="opt" data-val="Spanish">Spanish</button><button type="button" class="opt" data-val="Somali">Somali</button><button type="button" class="opt" data-val="Arabic">Arabic</button><button type="button" class="opt" data-val="Nepali">Nepali</button><button type="button" class="opt" data-val="French">French</button><button type="button" class="opt" data-val="ASL">ASL</button><button type="button" class="opt" data-val="Other">Other</button></div></div>`,
  "lang buttons"
);

// --- Violence / means checkboxes → chips ---
mustReplace(
  `     <div class="mini" id="violenceFactorsWrap">
      <label><input type="checkbox" data-store="violenceFactors.weapons"> Weapons access</label>
      <label><input type="checkbox" data-store="violenceFactors.priorViolence"> Prior violence</label>
      <label><input type="checkbox" data-store="violenceFactors.substance"> Substance use</label>
      <label><input type="checkbox" data-store="violenceFactors.command"> Command symptoms</label>
      <label><input type="checkbox" data-store="violenceFactors.identifiableTarget"> Identifiable target</label>
     </div>`,
  `     <div class="opts chip-row" id="violenceFactorsWrap">
      <button type="button" class="opt" data-store="violenceFactors.weapons">Weapons access</button>
      <button type="button" class="opt" data-store="violenceFactors.priorViolence">Prior violence</button>
      <button type="button" class="opt" data-store="violenceFactors.substance">Substance use</button>
      <button type="button" class="opt" data-store="violenceFactors.command">Command symptoms</button>
      <button type="button" class="opt" data-store="violenceFactors.identifiableTarget">Identifiable target</button>
     </div>`,
  "violence chips"
);

mustReplace(
  `      <div class="mini">
       <label><input type="checkbox" data-store="firearmPlan.safe"> Locked in safe</label>
       <label><input type="checkbox" data-store="firearmPlan.noaccess"> No access</label>
       <label><input type="checkbox" data-store="firearmPlan.removed"> Removed</label>
       <label><input type="checkbox" data-store="firearmPlan.other"> Other</label>
      </div>`,
  `      <div class="opts chip-row">
       <button type="button" class="opt" data-store="firearmPlan.safe">Locked in safe</button>
       <button type="button" class="opt" data-store="firearmPlan.noaccess">No access</button>
       <button type="button" class="opt" data-store="firearmPlan.removed">Removed</button>
       <button type="button" class="opt" data-store="firearmPlan.other">Other</button>
      </div>`,
  "firearm chips"
);

mustReplace(
  `      <div class="mini">
       <label><input type="checkbox" data-store="medsPlan.safe"> Locked</label>
       <label><input type="checkbox" data-store="medsPlan.noaccess"> No access</label>
       <label><input type="checkbox" data-store="medsPlan.removed"> Removed</label>
       <label><input type="checkbox" data-store="medsPlan.other"> Other</label>
      </div>`,
  `      <div class="opts chip-row">
       <button type="button" class="opt" data-store="medsPlan.safe">Locked</button>
       <button type="button" class="opt" data-store="medsPlan.noaccess">No access</button>
       <button type="button" class="opt" data-store="medsPlan.removed">Removed</button>
       <button type="button" class="opt" data-store="medsPlan.other">Other</button>
      </div>`,
  "meds chips"
);

mustReplace(
  `      <div class="mini">
       <label><input type="checkbox" data-store="otherMeans.caustic"> Caustic liquids</label>
       <label><input type="checkbox" data-store="otherMeans.other"> Other</label>
      </div>`,
  `      <div class="opts chip-row">
       <button type="button" class="opt" data-store="otherMeans.caustic">Caustic liquids</button>
       <button type="button" class="opt" data-store="otherMeans.other">Other</button>
      </div>`,
  "other means chips"
);

// --- Card foot continue on each slide ---
const cardFoot =
  '<div class="card-foot"><button type="button" class="card-continue" id="cardContinue{{N}}" disabled>Continue<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 6l6 6-6 6"/></svg></button></div>';
for (let i = 0; i < 5; i++) {
  const foot = cardFoot.replace("{{N}}", i);
  const panelRe = new RegExp(`(<div class="slide-panel" data-step="${i}">[\\s\\S]*?</section>\\s*)</div>`, "m");
  if (!panelRe.test(html)) {
    console.error("MISSING slide panel", i);
    process.exit(1);
  }
  html = html.replace(panelRe, `$1${foot}\n</div>`);
  console.log("OK: card foot step", i);
}

// Wrap slide content in card-body for step 1 (biggest panel)
mustReplace(
  `<div class="slide-panel" data-step="1">
<section class="layer float-card" id="L0">
 <div class="step-kicker">`,
  `<div class="slide-panel" data-step="1">
<section class="layer float-card" id="L0">
 <div class="card-body">
 <div class="step-kicker">`,
  "L0 card-body open"
);
mustReplace(
  ` </div>
</section>
<div class="card-foot"><button type="button" class="card-continue" id="cardContinue1"`,
  ` </div>
 </div>
</section>
<div class="card-foot"><button type="button" class="card-continue" id="cardContinue1"`,
  "L0 card-body close"
);

// --- JS: insurance + LOC ---
mustReplace(
  `var DISPO_LOC_OPTS=[
 {v:"community|outpatient",t:"Community · Outpatient (weekly or less)",community:true},
 {v:"community|iop",t:"Community · IOP (9–19 hrs/wk)",community:true},
 {v:"community|php",t:"Community · PHP (≥20 hrs/wk)",community:true},
 {v:"residential|psychres",t:"Residential · Psychiatric residential",community:false},
 {v:"residential|sudres",t:"Residential · SUD / sober living",community:false},
 {v:"residential|grouphome",t:"Residential · Group home / supported living",community:false},
 {v:"residential|snf",t:"Residential · Skilled nursing / LTC",community:false}
];`,
  `var INSURANCE_OPTS=["Medicaid","Medicare","Dual","Private","Uninsured","Other"];
var DISPO_LOC_OPTS=[
 {v:"community|outpatient",t:"Outpatient",community:true,col:"community"},
 {v:"community|iop",t:"IOP",community:true,col:"community"},
 {v:"community|php",t:"PHP",community:true,col:"community"},
 {v:"residential|psychres",t:"Inpatient",community:false,col:"residential"},
 {v:"residential|sudres",t:"Detox / SUD",community:false,col:"residential"},
 {v:"residential|grouphome",t:"Residential",community:false,col:"residential"},
 {v:"residential|snf",t:"SNF / LTC",community:false,col:"residential"}
];
function normalizeInsurance(v){
 if(!v)return null;
 if(v==="Commercial")return "Private";
 if(v==="VA"||v==="VA / Tricare")return "Other";
 return v;
}
function rebuildInsuranceOpts(){
 var el=$("#insuranceOpts");if(!el)return;
 var ins=normalizeInsurance(S.insurance);
 el.innerHTML=INSURANCE_OPTS.map(function(v){
  return '<button type="button" class="opt'+(ins===v?" sel":"")+'" data-ins="'+v+'" aria-pressed="'+(ins===v?"true":"false")+'">'+v+'</button>';
 }).join("");
}
function rebuildDispLocButtons(){
 var cur=dispLocValue(),opOnly=isOutpatient();
 var comm=$("#locCommunityOpts"),res=$("#locResidentialOpts");
 if(!comm||!res)return;
 function btn(o){
  return '<button type="button" class="opt'+(o.v===cur?" sel":"")+'" data-disp-loc="'+o.v+'" aria-pressed="'+(o.v===cur?"true":"false")+'">'+o.t+'</button>';
 }
 comm.innerHTML=DISPO_LOC_OPTS.filter(function(o){return o.col==="community";}).map(btn).join("");
 res.innerHTML=DISPO_LOC_OPTS.filter(function(o){return o.col==="residential";}).map(btn).join("");
 var rc=$("#residentialLocCol");if(rc)rc.classList.toggle("dimmed",opOnly);
}
function syncStoreChips(){
 $$("[data-store]").forEach(function(el){
  if(el.type==="checkbox")return;
  var p=el.dataset.store.split("."),on=false;
  if(p.length===2&&p[0]==="violenceFactors")on=!!S.violenceFactors[p[1]];
  else if(p.length===2)on=!!S[p[0]][p[1]];
  el.classList.toggle("sel",on);
  el.setAttribute("aria-pressed",on?"true":"false");
 });`,
  "insurance loc js"
);

mustReplace(
  `function rebuildDispLocSelect(){
 var el=$("#selDispLoc");if(!el)return;
 var cur=dispLocValue(),opOnly=isOutpatient();
 el.innerHTML='<option value="">— Select level of care —</option>'+
  DISPO_LOC_OPTS.filter(function(o){return opOnly?o.community:true;}).map(function(o){
   return '<option value="'+o.v+'"'+(o.v===cur?' selected':'')+'>'+o.t+'</option>';}).join("");
 if(opOnly&&cur&&!cur.startsWith("community|"))applyDispLoc("");
}`,
  `function rebuildDispLocSelect(){rebuildDispLocButtons();}`,
  "rebuildDispLocSelect shim"
);

mustReplace(
  `function syncGateSelects(){
 var si=$("#selInsurance");if(si)si.value=S.insurance||"";
 var ss=$("#selSetting");if(ss)ss.value=normalizeSetting(S.setting)||"";
 rebuildDispLocSelect();
}`,
  `function syncGateSelects(){
 S.insurance=normalizeInsurance(S.insurance);
 rebuildInsuranceOpts();
 var ss=$("#selSetting");if(ss)ss.value=normalizeSetting(S.setting)||"";
 rebuildDispLocSelect();
 syncStoreChips();
}`,
  "syncGateSelects"
);

// Insurance + disp-loc click handlers
mustReplace(
  `[{id:"selInsurance",f:"insurance"},{id:"selSetting",f:"setting"}].forEach(function(x){
 var el=$("#"+x.id);if(!el)return;
 el.addEventListener("change",function(){
  setField(x.f,el.value);
  if(x.f==="setting"&&el.value==="Outpatient"&&!dispLocValue())applyDispLoc("community|outpatient");
  render();
  if(x.f==="setting"&&el.value&&!dispLocValue()){var d=$("#selDispLoc");if(d)d.focus();}
 });
});
var selDisp=$("#selDispLoc");if(selDisp)selDisp.addEventListener("change",function(e){applyDispLoc(e.target.value);render();});`,
  `[{id:"selSetting",f:"setting"}].forEach(function(x){
 var el=$("#"+x.id);if(!el)return;
 el.addEventListener("change",function(){
  setField(x.f,el.value);
  if(x.f==="setting"&&el.value==="Outpatient"&&!dispLocValue())applyDispLoc("community|outpatient");
  render();
 });
});
document.addEventListener("click",function(e){
 var ins=e.target.closest("[data-ins]");if(ins){
  setField("insurance",ins.dataset.ins);render();return;
 }
 var loc=e.target.closest("[data-disp-loc]");if(loc){
  if(isOutpatient()&&!loc.dataset.dispLoc.startsWith("community|"))return;
  applyDispLoc(loc.dataset.dispLoc);render();return;
 }
});`,
  "insurance disp handlers"
);

// Store chip toggle (buttons)
mustReplace(
  ` if(e.target.dataset.store!==undefined){setPath(e.target.dataset.store,e.target.checked);render();}`,
  ` if(e.target.dataset.store!==undefined){
  if(e.target.type==="checkbox"){setPath(e.target.dataset.store,e.target.checked);}
  else{
   var st=e.target.dataset.store,sp=st.split("."),cur=0;
   if(sp.length===2&&sp[0]==="violenceFactors")cur=S.violenceFactors[sp[1]];
   else if(sp.length===2)cur=S[sp[0]][sp[1]];
   setPath(st,!cur);
  }
  render();return;
 }`,
  "store chip toggle"
);

// Remove lang select listener, lang is data-field now
mustReplace(
  `var langEl=$("#lang");if(langEl)langEl.addEventListener("change",function(){S.lang=langEl.value;setField("lang",S.lang);render();});`,
  ``,
  "remove lang select listener"
);

// renderStatus: card continue + chevron
mustReplace(
  ` var contLbl=step>=WORKFLOW_STEPS-2?"Continue →":"Continue →";
 $("#statusInner").innerHTML=
  '<button type="button" class="nav-btn back" id="wfBack"'+backDis+'>← Back</button>'+
  saveNote+
  '<button type="button" class="btn nav-btn cont" id="wfContinue"'+contDis+'>'+contLbl+'</button>';
 var b=$("#wfBack");if(b&&!b.disabled)b.onclick=workflowBack;
 var c=$("#wfContinue");if(c&&!c.disabled)c.onclick=workflowContinue;
}`,
  ` var contLbl="Continue";
 var contSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 6l6 6-6 6"/></svg>';
 $("#statusInner").innerHTML=
  '<button type="button" class="nav-btn back" id="wfBack"'+backDis+'>← Back</button>'+
  saveNote+
  '<button type="button" class="btn nav-btn cont" id="wfContinue"'+contDis+'>'+contLbl+contSvg+'</button>';
 var b=$("#wfBack");if(b&&!b.disabled)b.onclick=workflowBack;
 var c=$("#wfContinue");if(c&&!c.disabled)c.onclick=workflowContinue;
 var canCont=!contDis.replace(/\\s/g,"").length||contDis.indexOf("disabled")<0;
 $$(".card-continue").forEach(function(btn){
  btn.disabled=!canCont;
  if(!btn.disabled)btn.onclick=workflowContinue;
 });
}`,
  "renderStatus card continue"
);

// Enter key advance
mustReplace(
  `document.addEventListener("pointerup",onOptPointer,true);`,
  `document.addEventListener("keydown",function(e){
 if(e.key!=="Enter"||e.defaultPrevented)return;
 if(e.target.closest(".save-overlay"))return;
 var tag=(e.target.tagName||"").toLowerCase();
 if(tag==="textarea")return;
 if(tag==="input"&&(e.target.type==="text"||e.target.type==="number"||e.target.type==="search"||e.target.type==="email"))return;
 if(!S.pathway)return;
 var step=S.workflowStep||0;
 if(step>=WORKFLOW_STEPS-1||!workflowStepDone(step))return;
 e.preventDefault();
 workflowContinue();
});
document.addEventListener("pointerup",onOptPointer,true);`,
  "enter key advance"
);

// Veteran: also treat Dual for transport; keep VA legacy
mustReplace(
  `function activeFlag(f){if(f==="veteran")return !!(S.flags.veteran||S.insurance==="VA");`,
  `function activeFlag(f){if(f==="veteran")return !!(S.flags.veteran||S.insurance==="VA"||S.insurance==="Other");`,
  "veteran legacy - revert - only flag"
);

// Revert veteran change - user didn't ask for Other→veteran. Keep VA check only:
html = html.replace(
  `function activeFlag(f){if(f==="veteran")return !!(S.flags.veteran||S.insurance==="VA"||S.insurance==="Other");`,
  `function activeFlag(f){if(f==="veteran")return !!(S.flags.veteran||S.insurance==="VA");`
);

// Dual insurance for Medicaid transport benefits
mustReplace(
  ` if(S.insurance==="Medicaid"&&(nm==="Ohio Medicaid Consumer Helpline"`,
  ` if((S.insurance==="Medicaid"||S.insurance==="Dual")&&(nm==="Ohio Medicaid Consumer Helpline"`,
  "dual medicaid transport"
);

// Load saved insurance normalize
mustReplace(
  ` if(d.insurance&&!S.insurance)S.insurance=d.insurance;`,
  ` if(d.insurance&&!S.insurance)S.insurance=normalizeInsurance(d.insurance);`,
  "load insurance normalize"
);

fs.writeFileSync(file, html);
console.log("Wrote", file);
