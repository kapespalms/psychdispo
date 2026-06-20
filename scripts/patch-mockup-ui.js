#!/usr/bin/env node
/** Apply mockup-aligned UI patch to public/psychdispo.html */
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

// --- CSS: design tokens + mockup components ---
mustReplace(
  `:root{--t:#2640C8;--t2:#1b2f9c;--bg:#f6f6f3;--ink:#16182b;--mut:#6b6f80;--line:#e5e5ec;--card:#fff;--red:#b3261e;--redbg:#fdeceb;--amber:#8a5d00;--amberbg:#fff6e5;--good:#1c7a3f;--goodbg:#e6f4ea;--serif:"Playfair Display",Georgia,"Times New Roman",serif;--sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}`,
  `:root{--paper:#F4EFE5;--t:#2A43C0;--t2:#1b2f9c;--bg:var(--paper);--ink:#22202A;--mut:#6f6a5f;--faint:#9b9587;--line:#E6DECE;--card:#FFFDF8;--red:#B23A2E;--redbg:#fbeae8;--amber:#9A6A1E;--amberbg:#f7efdc;--good:#3C7A66;--goodbg:#e7f0ec;--terra:#BC5B3A;--sage:#3C7A66;--gold:#9A7320;--serif:"Playfair Display",Georgia,"Times New Roman",serif;--sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}`,
  "css vars"
);

const mockupCss = `
.workflow-sheet{background:var(--card);border:1px solid var(--line);border-radius:5px;overflow:hidden;margin:16px 0}
.workflow-body{padding:0 0 8px}
.spine{display:flex;gap:6px;padding:14px 34px 0}
.spine .seg{flex:1}
.spine .seg .bar{height:4px;border-radius:2px;background:#e8e0d0}
.spine .seg.done .bar{background:var(--sage)}
.spine .seg.now .bar{background:var(--t)}
.spine .seg .t{font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--faint);font-weight:600;margin-top:7px}
.spine .seg.now .t{color:var(--t)}
.spine .seg.done .t{color:var(--sage)}
.step-kicker{display:flex;align-items:center;gap:10px;margin-bottom:4px;padding:0 34px}
.step-kicker .num{font-family:var(--serif);font-size:13px;color:var(--terra);font-weight:600}
.step-kicker .lbl{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--faint);font-weight:600}
.step-kicker .ln{flex:1;height:1px;background:var(--line)}
.step-head{padding:0 34px 6px}
.step-head .ltitle{font-family:var(--serif);font-weight:700;font-size:33px;letter-spacing:-.3px;margin:2px 0 5px;line-height:1.1}
.step-head .ldesc{font-family:var(--serif);font-style:italic;font-size:15px;color:var(--mut);margin:0 0 14px}
.layer{border:none;border-radius:0;margin:0;padding:18px 34px 24px;box-shadow:none}
.layer+.layer{border-top:1px solid var(--line)}
.legend{display:flex;align-items:center;gap:18px;border:1px solid var(--line);background:#fbf7ee;border-radius:8px;padding:9px 16px;margin-bottom:22px;font-size:12.5px}
.legend .it{display:flex;align-items:center;gap:7px;color:var(--mut)}
.sq{width:9px;height:9px;border-radius:2px}
.sq.need{background:var(--terra)}.sq.done{background:var(--sage)}
.legend .cnt{margin-left:auto;font-family:var(--serif);font-style:italic;color:var(--mut)}
.field-label{display:flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);font-weight:600;margin-bottom:9px}
.req-dot{width:9px;height:9px;border-radius:2px;flex:none}
.req-dot.need{background:var(--terra)}.req-dot.done{background:var(--sage)}
.field-help{font-family:var(--serif);font-style:italic;font-size:12.5px;color:var(--faint);margin-top:8px;line-height:1.5}
.clips{font-size:0}
.clip{display:inline-block;width:46%;vertical-align:top;margin:0 2% 16px;font-size:14px;background:#fff;border:1px solid var(--line);border-left-width:3px;border-radius:8px;padding:13px 15px;cursor:pointer;position:relative}
.clip.sel{box-shadow:0 0 0 1.5px var(--t) inset;background:#f8f9ff}
.clip.crisis{border-left-color:var(--red)}.clip.clinical{border-left-color:var(--t)}.clip.sud{border-left-color:var(--sage)}.clip.social{border-left-color:var(--gold)}
.clip .top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px}
.clip .nm{font-weight:600;font-size:15px}
.cat{font-size:10px;letter-spacing:.08em;text-transform:uppercase;font-weight:600;padding:2px 8px;border-radius:999px}
.cat.crisis{background:#f6e3e0;color:var(--red)}.cat.clinical{background:#e8eaf8;color:var(--t)}.cat.sud{background:#e7f0ec;color:var(--sage)}.cat.social{background:#f5edda;color:var(--gold)}
.clip .blurb{font-size:12.5px;color:var(--mut);line-height:1.5;margin:3px 0 8px}
.clip .meta{display:flex;align-items:center;gap:10px;font-size:12.5px;flex-wrap:wrap}
.clip .ph{color:var(--t);font-weight:600;text-decoration:none}
.vchip{display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--sage);background:#e7f0ec;border-radius:999px;padding:2px 8px;font-weight:500}
.tray{border:1px solid var(--line);background:#fbf7ee;border-radius:10px;padding:12px 16px;margin-bottom:16px}
.tray .h{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--mut);font-weight:600;margin-bottom:8px}
.trow{display:flex;align-items:center;gap:10px;font-size:13.5px;padding:5px 0;border-bottom:1px solid #efe7d8}
.trow:last-child{border-bottom:none}
.tnum{width:20px;height:20px;border-radius:50%;background:var(--t);color:#fff;font-size:11px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;flex:none}
.trow .nm{font-weight:500}.trow .ph{margin-left:auto;color:var(--t);font-weight:600}
.deliver-gate{display:flex;align-items:center;gap:9px;font-size:12.5px;color:var(--mut);background:#f6efe0;border:1px solid var(--line);border-radius:8px;padding:9px 14px;margin:6px 0 16px}
.deliver-gate svg{width:16px;height:16px;color:var(--terra);flex:none}
.act{display:flex;align-items:center;gap:18px;border:1px solid var(--line);border-left-width:3px;border-radius:10px;background:#fff;padding:17px 20px;margin-bottom:13px}
.act .ico{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.act .ico svg{width:21px;height:21px;stroke-width:1.7}
.act.patient{border-left-color:var(--t)}.act.patient .ico{background:#e8eaf8;color:var(--t)}
.act.note{border-left-color:var(--ink)}.act.note .ico{background:#eee9dc;color:var(--ink)}
.act.ref{border-left-color:var(--terra)}.act.ref .ico{background:#f6e9e2;color:var(--terra)}
.act .meta{flex:1}.act .ti{font-weight:600;font-size:16px;margin-bottom:1px}.act .ds{font-size:12.5px;color:var(--mut)}
.act .who{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);font-weight:600;margin-top:3px}
.act .btns{display:flex;gap:8px;flex-shrink:0}
.act .btn{font-size:13px;font-weight:600;border-radius:9px;padding:9px 15px;border:1px solid var(--line);background:#fff;color:var(--ink);cursor:pointer;font-family:inherit}
.act .btn.primary{background:var(--t);border-color:var(--t);color:#fff}
.act .btn.ghost{color:var(--mut)}
.act .btn:disabled{opacity:.45;cursor:not-allowed}
.deliver-foot{font-size:12px;color:var(--faint);margin-top:8px;display:flex;align-items:center;gap:8px;padding:0 34px 8px}
.deliver-foot svg{width:15px;height:15px;color:var(--sage);flex:none}
.deliver-advanced{margin:0 34px 16px;padding:12px 14px;border:1px dashed var(--line);border-radius:8px;background:#fbf7ee;font-size:12.5px}
.mh-tagline b{font-style:normal;font-weight:600;color:var(--terra);letter-spacing:.13em;font-size:11px;text-transform:uppercase}
@media(max-width:680px){.clip{width:96%;margin-left:2%;margin-right:2%}.spine,.step-kicker,.step-head,.layer,.deliver-foot,.deliver-advanced{padding-left:18px;padding-right:18px}}
.patient-onepager h2{font-family:var(--serif);font-weight:700}
.patient-onepager .doc-sec-h{font-family:var(--serif)}
@media print{
 .workflow-sheet,.spine,.step-kicker,.step-head,.deliver-gate,.act,.deliver-foot,.deliver-advanced{display:none!important}
}
`;

if (!html.includes(".workflow-sheet{")) {
  html = html.replace(
    "/* resource panels */",
    mockupCss + "\n/* resource panels */"
  );
  console.log("OK: mockup css");
}

// --- Header tagline ---
mustReplace(
  `<span class="mh-tagline">Inspiring safer disposition</span>`,
  `<span class="mh-tagline" id="mhTagline"><b>1,400+ verified resources</b> &nbsp;·&nbsp; all 50 states</span>`,
  "header tagline"
);

// --- Wrap workflow ---
mustReplace(
  `<div id="view-tool">\n\n<!-- LAYER 0 -->`,
  `<div id="view-tool">\n<div class="workflow-sheet"><div id="spine" class="spine"></div><div class="workflow-body">\n\n<!-- LAYER 0 -->`,
  "workflow open"
);

mustReplace(
  `<div class="toolnote note" style="margin:10px 0 0">Resources verified Jun 2026`,
  `</div></div>\n<div class="toolnote note" style="margin:10px 0 0">Resources verified Jun 2026`,
  "workflow close"
);

// --- L0 intake ---
mustReplace(
  `<section class="layer" id="L0">\n <div class="ltitle">Clinical context</div>\n <div class="ldesc">City or ZIP for local resources. Complete all fields to continue.</div>\n <div id="gateSummary" class="gate-summary"><span class="gate-chip miss">Complete the fields below to begin</span></div>`,
  `<section class="layer" id="L0">\n <div class="step-kicker"><span class="num">01</span><span class="lbl">Intake</span><span class="ln"></span></div>\n <div class="step-head"><div class="ltitle">Clinical context</div>\n <div class="ldesc">A few details set the location, the level of care, and who gets matched.</div></div>\n <div id="intakeLegend" class="legend"></div>\n <div id="gateSummary" class="gate-summary hidden"></div>`,
  "L0 header"
);

mustReplace(
  `  <div class="q"><label class="qlabel" id="lblCleared">Medically cleared?</label>`,
  `  <div class="q"><div class="field-label" id="lblCleared"><span class="req-dot need" data-req="cleared"></span>Medically cleared?</div>`,
  "cleared label"
);

mustReplace(
  `  <div class="q"><label class="qlabel">Insurance</label>\n   <select id="selInsurance"><option value="">— Select —</option>`,
  `  <div class="q"><div class="field-label"><span class="req-dot need" data-req="insurance"></span>Insurance</div>\n   <select id="selInsurance"><option value="">— Select —</option>`,
  "insurance label"
);

mustReplace(
  `   <div class="note" style="margin-top:4px">Used on the discharge packet and to auto-add benefits lines (Medicaid hotline, rides). Does not filter local treatment options.</div>`,
  `   <div class="field-help">Shown on the packet; auto-adds benefits lines. Does not filter local options.</div>`,
  "insurance help"
);

mustReplace(
  `   <div class="q"><label class="qlabel">Discharging from</label>`,
  `   <div class="q"><div class="field-label"><span class="req-dot need" data-req="setting"></span>Discharging from</div>`,
  "setting label"
);

mustReplace(
  `   <div class="q"><label class="qlabel">Disposition / level of care</label>`,
  `   <div class="q"><div class="field-label"><span class="req-dot need" data-req="disp"></span>Disposition / level of care</div>`,
  "disp label"
);

mustReplace(
  `  <div class="q gate-wide"><label class="qlabel">Patient home — city or ZIP</label>`,
  `  <div class="q gate-wide"><div class="field-label"><span class="req-dot need" data-req="zip"></span>Patient home — city or ZIP</div>`,
  "zip label"
);

// --- L6 deliver ---
const l6Old = `<section class="layer hidden" id="L6">
 <div class="ltag">Discharge packet</div>
 <div class="ltitle">Generate &amp; print</div>
 <div class="ldesc">Available when safety screening (L2), safety interventions (L4), follow-up with a selected referral (L5), and at least one referral are documented.</div>
 <div class="q" style="margin-top:10px">
  <label class="qlabel">Packet type</label>
  <div class="opts" data-field="packetVariant" id="packetVariantOpts">
   <button type="button" class="opt sel" data-val="full">Full discharge</button>
   <button type="button" class="opt" data-val="outpatient">Outpatient brief</button>
   <button type="button" class="opt" data-val="consult">Consult note stub</button>
  </div>
  <div class="note" id="packetVariantHint">Clinician summary + referral cover + patient 1-pager</div>
 </div>
 <div class="q" style="margin-top:10px">
  <label class="qlabel">Print documents</label>
  <div class="mini">
   <label><input type="checkbox" id="includePatientHandout" checked> Include patient handout (1 page)</label>
   <label><input type="checkbox" id="includeReferralCover" checked> Include referral cover sheet (fax-ready)</label>
   <label><input type="checkbox" id="includeResourceHandoff"> Include resource handoff sheet (CBO · no PHI)</label>
  </div>
 </div>
 <div id="l6status"></div>
 <div id="l6ResourcePreview" class="l6-preview hidden"></div> <div id="l6SafePrintGate" class="l6-gate hidden"></div>
 <div id="l6FkglGate" class="l6-gate l6-gate-warn hidden"></div>
 <div class="l6-actions">
  <button class="btn sec" id="genBtn">Build packet preview</button>
  <button class="btn sec" id="copyChartBtn">Copy for chart</button>
  <button class="btn" id="printBtn" disabled>Print / Save PDF</button>
  <button class="btn sec" id="savePlanBtn">Save plan</button>
  <button class="btn sec hidden" id="warmHandoffBtnL6" type="button">Warm handoff mode</button>
 </div>
 <div id="postPacketBanner" class="post-banner hidden" role="status"></div>
</section>`;

const l6New = `<section class="layer hidden" id="L6">
 <div class="step-kicker"><span class="num">04</span><span class="lbl">Deliver</span><span class="ln"></span></div>
 <div class="step-head"><div class="ltitle">Hand off the plan</div>
 <div class="ldesc">The plan is complete. Send each document to the right person — that's the only thing left.</div></div>
 <div id="deliverGate" class="deliver-gate hidden"></div>
 <div id="deliverCards"></div>
 <div class="deliver-foot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12l4 4L19 7"/></svg>Nothing here is stored. Patient details print and stay with you; the referral leaves blank patient fields for you to fill.</div>
 <div class="deliver-advanced">
  <div class="q" style="margin-top:0">
   <label class="qlabel">Packet type</label>
   <div class="opts" data-field="packetVariant" id="packetVariantOpts">
    <button type="button" class="opt sel" data-val="full">Full discharge</button>
    <button type="button" class="opt" data-val="outpatient">Outpatient brief</button>
    <button type="button" class="opt" data-val="consult">Consult note stub</button>
   </div>
   <div class="note" id="packetVariantHint">Clinician summary + referral cover + patient 1-pager</div>
  </div>
  <div class="q">
   <label class="qlabel">Print documents</label>
   <div class="mini">
    <label><input type="checkbox" id="includePatientHandout" checked> Include patient handout (1 page)</label>
    <label><input type="checkbox" id="includeReferralCover" checked> Include referral cover sheet (fax-ready)</label>
    <label><input type="checkbox" id="includeResourceHandoff"> Include resource handoff sheet (CBO · no PHI)</label>
   </div>
  </div>
  <div id="l6status"></div>
  <div id="l6ResourcePreview" class="l6-preview hidden"></div>
  <div id="l6SafePrintGate" class="l6-gate hidden"></div>
  <div id="l6FkglGate" class="l6-gate l6-gate-warn hidden"></div>
  <div class="l6-actions">
   <button class="btn sec hidden" id="genBtn">Build full packet preview</button>
   <button class="btn sec hidden" id="warmHandoffBtnL6" type="button">Warm handoff mode</button>
   <button class="btn sec" id="savePlanBtn">Save plan</button>
  </div>
  <div id="postPacketBanner" class="post-banner hidden" role="status"></div>
 </div>
 <button type="button" class="hidden" id="copyChartBtn"></button>
 <button type="button" class="hidden" id="printBtn" disabled></button>
</section>`;

mustReplace(l6Old, l6New, "L6 deliver");

// --- JS: spine + intake legend + resCard + deliver ---
const jsInsertBefore = "function renderGateSummary(){";
const jsNew = `function intakeFieldDone(k){
 if(k==="cleared")return S.cleared==="yes";
 if(k==="insurance")return !!S.insurance;
 if(k==="setting")return !!S.setting;
 if(k==="disp")return L3ok();
 if(k==="zip")return locOk();
 return false;
}
function intakeCompleteCount(){return ["cleared","insurance","setting","disp","zip"].filter(intakeFieldDone).length;}
function renderIntakeLegend(){
 var el=$("#intakeLegend");if(!el)return;
 var n=intakeCompleteCount();
 el.innerHTML='<div class="it"><span class="sq need"></span>Required — still needed</div><div class="it"><span class="sq done"></span>Required — done</div><div class="cnt">'+n+' of 5 required complete</div>';
 $$("[data-req]").forEach(function(dot){
  var k=dot.dataset.req;
  dot.classList.toggle("need",!intakeFieldDone(k));
  dot.classList.toggle("done",intakeFieldDone(k));
 });
}
function spineIndex(){
 if(!L0ok()||!L1ok())return 0;
 if(!L2ok())return 1;
 if(!L4ok()||selectedCount()<1||!L5FollowUpOk())return 2;
 return 3;
}
function renderSpine(){
 var el=$("#spine");if(!el)return;
 var labels=["Intake","Safety","Plan","Deliver"];
 var cur=spineIndex();
 el.innerHTML=labels.map(function(lbl,i){
  var cls="seg";
  if(i<cur||(i===0&&L0ok()&&L1ok()&&cur>0)||(i===1&&L2ok()&&cur>1)||(i===2&&L4ok()&&L5FollowUpOk()&&selectedCount()>=1&&cur>2))cls+=" done";
  if(i===cur)cls+=" now";
  return '<div class="'+cls+'"><div class="bar"></div><div class="t">'+lbl+'</div></div>';
 }).join("");
}
function updateContextTagline(){
 var el=$("#mhTagline");if(!el)return;
 if(!locOk()&&!S.insurance){el.innerHTML='<b>1,400+ verified resources</b> &nbsp;·&nbsp; all 50 states';return;}
 var parts=[];
 if(locDisplay())parts.push(esc(locDisplay()));
 if(S.insurance)parts.push(esc(S.insurance));
 if(S.setting)parts.push(esc(settingLabel(S.setting).split(" / ")[0]));
 el.textContent=parts.join(" · ")||"";
}
var ACT_ICO={
 patient:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/></svg>',
 note:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="8" y="4" width="12" height="16" rx="2"/><path d="M16 4V2H6a2 2 0 00-2 2v12"/></svg>',
 ref:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 18h10M6 14h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2z"/><path d="M8 5V3h8v2M8 18v3h8v-3"/></svg>'
};
function deliverAct(kind,title,desc,who,btns){
 return '<div class="act '+kind+'"><div class="ico">'+ACT_ICO[kind]+'</div><div class="meta"><div class="ti">'+esc(title)+'</div><div class="ds">'+esc(desc)+'</div><div class="who">'+esc(who)+'</div></div><div class="btns">'+btns+'</div></div>';
}
function referralDeliverTargets(){
 var t=followUpTargets();
 if(t.length)return t;
 return primaryReferrals(selectedRes()).slice(0,3);
}
function renderDeliverScreen(){
 var gate=$("#deliverGate");
 var sens=sensitiveSelected();
 if(gate){
  if(sens.length&&S.includePatientHandout&&!S.includeSensitiveOnPatientHandout){
   gate.classList.remove("hidden");
   gate.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01M10.3 3.9l-8 14A2 2 0 004 21h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z"/></svg>'+
    sens.length+' sensitive resource'+(sens.length>1?"s are":" is")+' hidden from the printed patient sheet — confirm it\\'s safe to print, or leave off.';
  }else{gate.classList.add("hidden");gate.innerHTML="";}
 }
 var cards=$("#deliverCards");if(!cards)return;
 if(!L6ok()){cards.innerHTML='<div class="note">Complete safety, plan, referrals, and follow-up to unlock deliver actions.</div>';return;}
 var ok=L6ok();
 var dis=!ok?' disabled':'';
 var html="";
 html+=deliverAct("patient","Patient take-home","One page, plain language: crisis numbers, follow-up, resources.","For the patient",
  '<button type="button" class="btn ghost" data-deliver="preview-patient"'+dis+'>Preview</button><button type="button" class="btn primary" data-deliver="print-patient"'+dis+'>Print</button>');
 html+=deliverAct("note","Note for the chart","Full clinical detail — copy into your EHR or print.","For your record",
  '<button type="button" class="btn primary" data-deliver="copy-chart"'+dis+'>Copy text</button><button type="button" class="btn" data-deliver="print-chart"'+dis+'>Print</button>');
 referralDeliverTargets().forEach(function(r){
  html+=deliverAct("ref","Referral to "+r.name,"Cover sheet for the program — attach your face sheet before sending.","For the receiving program",
   '<button type="button" class="btn" data-deliver="email" data-ref="'+esc(rid(r))+'"'+dis+'>Email</button><button type="button" class="btn" data-deliver="fax" data-ref="'+esc(rid(r))+'"'+dis+'>Fax</button><button type="button" class="btn ghost" data-deliver="print-ref" data-ref="'+esc(rid(r))+'"'+dis+'>Print</button>');
 });
 cards.innerHTML=html;
 var pb=$("#printBtn");if(pb)pb.disabled=!ok;
}
function printPatientOnly(){
 S._printMode="patient";
 executePrint();
}
function printChartOnly(){
 S._printMode="chart";
 executePrint();
}
function printReferralOnly(refId){
 S._printMode="referral";
 S._printRefId=refId||S.fuReferralId;
 executePrint();
}
function previewPatient(){
 $("#packet").innerHTML=buildPacket({previewPatientOnly:true});
 $("#packet").classList.add("show");
 $("#packet").scrollIntoView({behavior:"smooth"});
}

`;

if (!html.includes("function renderSpine()")) {
  html = html.replace(jsInsertBefore, jsNew + jsInsertBefore);
  console.log("OK: spine/deliver js");
}

// Patch renderGateSummary to call legend
html = html.replace(
  " el.innerHTML=chips.length?chips.join(\"\"):''<span class=\"gate-chip miss\">Complete the fields below to begin</span>';",
  " el.innerHTML=chips.length?chips.join(\"\"):''<span class=\"gate-chip miss\">Complete the fields below to begin</span>';\n renderIntakeLegend();"
);

// Patch render() 
html = html.replace(
  "function render(){\n renderGateSummary();",
  "function render(){\n renderSpine();\n updateContextTagline();\n renderGateSummary();"
);

// Patch resCard
const oldResCard = `function resCard(r){
 var id=rid(r),ck=S.selected[id]?"checked":"";
 var badge=r.unverified?'<span class="badge un">⚑ unverified</span>':r.national?'<span class="badge nat">national</span>':'<span class="badge v">✓ verified</span>';
 return '<label class="res'+(S.selected[id]?" sel":"")+'"><input type="checkbox" data-res="'+esc(id)+'" '+ck+'>'+
  '<div><div class="rn">'+esc(r.name)+badge+'</div>'+
  (r.svc?'<div class="rs">'+esc(r.svc)+'</div>':'')+
  (r.access?'<div class="rax">'+esc(r.access)+'</div>':'')+
  (r.address?'<div class="rad">📍 '+esc(r.address)+'</div>':'')+
  '<a class="rp" href="tel:'+tel(r.phone)+'">📞 '+esc(r.phone)+'</a> <span class="rad">· '+esc(r.county)+'</span>'+
  ((r.fax||r.email)?'<div class="rfx">'+(r.fax?'📠 fax '+esc(r.fax):'')+(r.fax&&r.email?' · ':'')+(r.email?'✉️ '+esc(r.email):'')+'</div>':'')+
  '</div></label>';
}`;

const newResCard = `function clipCategory(r){
 if(r.panel==="D"&&!isEmergencyDept(r))return {cls:"crisis",cat:"Crisis"};
 if(r.panel==="C"||/substance|detox|rehab|mat/i.test((r.sub||"")+" "+(r.cat||"")))return {cls:"sud",cat:"Drug & alcohol"};
 if(r.panel==="F")return {cls:"social",cat:"Social"};
 return {cls:"clinical",cat:"Clinical"};
}
function verifiedChip(r){
 if(r.unverified)return "";
 if(r.national)return '<span class="vchip">✓ always on</span>';
 var lv=(r.patient&&r.patient.lastVerified)||r.lastVerified||"Jun 2026";
 var d=String(lv).match(/\\d{4}-\\d{2}/)?new Date(lv+"T12:00:00").toLocaleDateString("en-US",{month:"short",year:"numeric"}):lv;
 return '<span class="vchip">✓ verified '+esc(d)+'</span>';
}
function resCard(r){
 var id=rid(r),ck=S.selected[id]?"checked":"";
 var c=clipCategory(r);
 var blurb=patientBlurbFor(r);
 return '<label class="clip '+c.cls+(S.selected[id]?" sel":"")+'"><input type="checkbox" data-res="'+esc(id)+'" '+ck+' style="position:absolute;opacity:0;width:1px;height:1px">'+
  '<div class="top"><span class="nm">'+esc(r.name)+'</span><span class="cat '+c.cls+'">'+esc(c.cat)+'</span></div>'+
  '<div class="blurb">'+esc(blurb)+'</div>'+
  '<div class="meta"><a class="ph" href="tel:'+tel(r.phone)+'">'+esc(r.phone)+'</a>'+verifiedChip(r)+
  ((r.fax||r.email)?'<span style="font-size:11px;color:var(--mut)">'+(r.fax?"fax "+esc(r.fax):"")+(r.email?" · "+esc(r.email):"")+'</span>':'')+
  '</div></label>';
}`;

if (html.includes(oldResCard)) {
  html = html.replace(oldResCard, newResCard);
  console.log("OK: resCard");
} else {
  console.error("MISSING: resCard");
  process.exit(1);
}

// subSection uses clips grid
html = html.replace(
  "return (title?'<div class=\"subhdr\">'+esc(title)+'</div>':'')+'<div class=\"resgrid\">'+list.map(resCard).join(\"\")+'</div>';",
  "return (title?'<div class=\"subhdr\">'+esc(title)+'</div>':'')+'<div class=\"clips\">'+list.map(resCard).join(\"\")+'</div>';"
);

// renderSelected tray style
html = html.replace(
  ` tray.innerHTML='<div class="seltray"><div class="selhd">✓ Selected for packet · '+items.length+'</div>'+items.map(function(r,i){return '<div class="selrow"><span class="seln">'+(i+1)+'</span><span class="selnm">'+esc(r.name)+'</span> <span class="selcat">'+esc(r.cat||"")+'</span><span class="selph">'+esc(r.phone)+'</span><button class="selx" data-unsel="'+esc(rid(r))+'" title="Remove">✕</button></div>';}).join("")+'</div>';`,
  ` var fuId=S.fuReferralId;
 tray.innerHTML='<div class="tray"><div class="h">Selected for this patient</div>'+items.map(function(r,i){
  var id=rid(r),isMain=id===fuId;
  return '<div class="trow"><span class="tnum">'+(i+1)+'</span><span class="nm">'+esc(r.name)+(isMain?" (main follow-up)":"")+'</span><span class="ph">'+esc(r.phone)+'</span><button class="selx" data-unsel="'+esc(id)+'" title="Remove" style="border:none;background:none;cursor:pointer;color:var(--mut)">✕</button></div>';
 }).join("")+'</div>';`
);

// renderStatus spine labels
html = html.replace(
  ` $("#statusInner").innerHTML=chk(L0ok(),"Clinical context")+chk(L1ok(),"Patient")+chk(L2ok(),"Safety screen")+chk(L4ok(),"Safety & coordination")+chk(selectedCount()>=1,"Referrals ("+selectedCount()+")")+chk(L5FollowUpOk(),"Follow-up")+saveNote+
  '<button class="btn" id="jump" '+(L6ok()?"":"disabled")+'>Go to packet ↓</button>';`,
  ` $("#statusInner").innerHTML=chk(L0ok()&&L1ok(),"Intake")+chk(L2ok(),"Safety")+chk(L4ok()&&selectedCount()>=1&&L5FollowUpOk(),"Plan")+chk(L6ok(),"Deliver")+saveNote+
  '<button class="btn" id="jump" '+(L6ok()?"":"disabled")+'>Go to deliver ↓</button>';`
);

// renderL6status
html = html.replace(
  `function renderL6status(){
 var items=[["Safety screening (L2)",L2ok()],["Safety plan & means (L4)",planAndMeansOk()],["Coordination (L4)",S.callback!=null&&S.pcp!=null&&S.pharmacy!=null],["≥1 referral selected",selectedCount()>=1],["Follow-up (L5)",L5FollowUpOk()],["Packet · "+packetVariantLabel(S.packetVariant||"full"),true]];
 $("#l6status").innerHTML=items.map(function(i){return chk(i[1],i[0]);}).join(" ");
 $("#printBtn").disabled=!L6ok();`,
  `function renderL6status(){
 var items=[["Safety screening",L2ok()],["Safety plan & means",planAndMeansOk()],["Coordination",S.callback!=null&&S.pcp!=null&&S.pharmacy!=null],["Referrals ("+selectedCount()+")",selectedCount()>=1],["Follow-up",L5FollowUpOk()],["Packet · "+packetVariantLabel(S.packetVariant||"full"),true]];
 $("#l6status").innerHTML=items.map(function(i){return chk(i[1],i[0]);}).join(" ");
 renderDeliverScreen();`
);

// patient one pager title
html = html.replace(
  `'<h2 style="margin:0 0 8px">Your care plan</h2>'+`,
  `'<h2 style="margin:0 0 8px;font-family:var(--serif);font-weight:700">Your plan</h2>'+`
);

// deliver click handler - insert before render();
const deliverHandler = `
document.addEventListener("click",function(e){
 var btn=e.target.closest("[data-deliver]");
 if(!btn||btn.disabled)return;
 var act=btn.dataset.deliver;
 if(act==="preview-patient"){previewPatient();return;}
 if(act==="print-patient"){S.includePatientHandout=true;S._printMode="patient";runPrintWithGates();return;}
 if(act==="copy-chart"){
  var text=buildChartText();
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){showCopyToast("Copied for chart");});}
  else{$("#copyChartBtn").click();}
  return;
 }
 if(act==="print-chart"){S._printMode="chart";executePrint();return;}
 if(act==="print-ref"){printReferralOnly(btn.dataset.ref);return;}
 if(act==="email"||act==="fax"){
  var ref=resById(btn.dataset.ref);
  if(!ref)return;
  if(act==="email"&&ref.email){window.location.href="mailto:"+encodeURIComponent(ref.email);return;}
  if(act==="fax"){S.fuReferralId=btn.dataset.ref;S.refMethod="fax";alert("Attach face sheet, then fax to "+(ref.fax||"program fax on file"));return;}
  alert("No "+act+" on file for this program — use Print.");
 }
});
`;

if (!html.includes("data-deliver")) {
  html = html.replace("\nrender();", deliverHandler + "\nrender();");
  console.log("OK: deliver handler");
}

// buildPacket optional patient-only preview - patch function signature usage
if (!html.includes("previewPatientOnly")) {
  html = html.replace(
    "function buildPacket(){",
    "function buildPacket(opts){\n opts=opts||{};"
  );
  // After building parts, filter for print modes - find return in buildPacket is complex
  // Simpler: previewPatient builds patient one pager only
  html = html.replace(
    "function previewPatient(){\n $(\"#packet\").innerHTML=buildPacket({previewPatientOnly:true});",
    "function previewPatient(){\n var res=selectedRes();\n $(\"#packet\").innerHTML=buildPatientOnePager(res,{variant:S.packetVariant||\"full\"});"
  );
}

fs.writeFileSync(file, html);
console.log("Wrote", file);
