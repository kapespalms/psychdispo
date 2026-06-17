#!/usr/bin/env node
// Paste return value into browser console on psychdispo.html#plan, or run via CDP evaluate.
// Audits every .opt button group + key controls.
(function () {
  function reset() {
    location.reload();
  }
  function fillGate() {
    S.cleared = "yes";
    S.insurance = "Medicaid";
    S.setting = "Acute";
    S.zip = "25301";
    applyDispLoc("community|outpatient");
    render();
  }
  function clickOpt(sel) {
    var el = document.querySelector(sel);
    if (!el) return { sel: sel, err: "missing" };
    applyOpt(el);
    return { sel: sel, ok: true };
  }
  var results = [];
  function testField(field, val, expect) {
    var el = document.querySelector('[data-field="' + field + '"] [data-val="' + val + '"]');
    if (!el) {
      results.push({ type: "field", field: field, ok: false, err: "missing" });
      return;
    }
    applyOpt(el);
    var got = S[field];
    var ok = got === expect;
    var sel = el.classList.contains("sel");
    results.push({ type: "field", field: field, ok: ok && sel, got: got, expect: expect, sel: sel });
  }
  function testFlag(flag) {
    var el = document.querySelector('[data-flag="' + flag + '"]');
    if (!el) {
      results.push({ type: "flag", flag: flag, ok: false, err: "missing" });
      return;
    }
    var before = S.flags[flag];
    applyOpt(el);
    var after = S.flags[flag];
    results.push({ type: "flag", flag: flag, ok: after !== before, before: before, after: after });
  }

  fillGate();
  [
    ["cleared", "yes", "yes"],
    ["sab", "M", "M"],
    ["sab", "F", "F"],
    ["interpreter", "no", "no"],
    ["lifeStage", "adult", "adult"],
    ["acuteConcern", "no", "no"],
    ["cssrsDone", "no", "no"],
    ["sudScreenDone", "no", "no"],
    ["violence", "no", "no"],
    ["planDone", "yes", "yes"],
    ["firearm", "no", "no"],
    ["meds", "no", "no"],
    ["otherMeansDone", "no", "no"],
    ["callback", "72h", "72h"],
    ["pcp", "yes", "yes"],
    ["pharmacy", "yes", "yes"],
  ].forEach(function (t) {
    testField(t[0], t[1], t[2]);
  });

  ["perinatal", "veteran", "lgbtq", "sud", "unhoused"].forEach(testFlag);

  // Acute path extras
  S.acuteConcern = "yes";
  render();
  testField("cssrsDone", "yes", "yes");
  testField("suicideRisk", "low", "low");
  testField("sudScreenDone", "yes", "yes");
  testField("sudTool", "auditc", "auditc");

  // Selects
  var si = $("#selInsurance");
  si.value = "Medicare";
  si.dispatchEvent(new Event("change", { bubbles: true }));
  results.push({ type: "select", id: "selInsurance", ok: S.insurance === "Medicare", got: S.insurance });

  var ss = $("#selSetting");
  ss.value = "Outpatient";
  ss.dispatchEvent(new Event("change", { bubbles: true }));
  results.push({ type: "select", id: "selSetting", ok: S.setting === "Outpatient", got: S.setting });

  // Nested refMethod markup check
  S.apptScheduled = "no";
  renderFollowUp();
  var refWrap = document.querySelector('[data-field="refMethod"]');
  var nestedBtnBug = refWrap && refWrap.tagName === "BUTTON";
  var refOpt = document.querySelector('[data-field="refMethod"] [data-val="call"]');
  if (refOpt) {
    applyOpt(refOpt);
    results.push({
      type: "refMethod",
      ok: S.refMethod === "call" && !nestedBtnBug,
      got: S.refMethod,
      nestedBtnBug: nestedBtnBug,
      wrapTag: refWrap ? refWrap.tagName : null,
    });
  } else {
    results.push({ type: "refMethod", ok: !nestedBtnBug, skipped: "no call option", wrapTag: refWrap ? refWrap.tagName : null });
  }

  var failed = results.filter(function (r) {
    return !r.ok;
  });
  return JSON.stringify({ total: results.length, failed: failed.length, failures: failed, pass: failed.length === 0 }, null, 0);
})();
