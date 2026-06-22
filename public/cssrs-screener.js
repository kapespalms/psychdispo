/**
 * Columbia C-SSRS Screener (6 core items + behavior recency).
 * Risk tiers per VA/DoD 2024 CPG / Posner et al. — used by psychdispo.html safety step.
 * Extracted from embed for maintainability (Phase 1).
 */
(function (global) {
  "use strict";

  var CSSRS_ITEMS = [
    {
      key: "q1",
      label: "Wish to be dead",
      text: "Have you wished you were dead or wished you could go to sleep and not wake up?",
      period: "Past month",
    },
    {
      key: "q2",
      label: "Suicidal thoughts",
      text: "Have you actually had any thoughts of killing yourself?",
      period: "Past month",
    },
    {
      key: "q3",
      label: "Method",
      text: "Have you been thinking about how you might do this?",
      period: "Past month",
    },
    {
      key: "q4",
      label: "Intent",
      text: "Have you had these thoughts and had some intention of acting on them?",
      period: "Past month",
    },
    {
      key: "q5",
      label: "Plan",
      text: "Have you started to work out or worked out the details of how to kill yourself? Do you intend to carry out this plan?",
      period: "Past month",
    },
    {
      key: "q6",
      label: "Preparatory behavior",
      text: "Have you ever done anything, started to do anything, or prepared to do anything to end your life?",
      period: "Lifetime",
      followUp: {
        key: "behaviorRecent",
        text: "Was this within the past 3 months?",
      },
    },
  ];

  function yes(v) {
    return v === "yes" || v === true || v === 1;
  }

  function no(v) {
    return v === "no" || v === false || v === 0;
  }

  /** @returns {"low"|"moderate"|"high"|null} null until Q1–Q6 (+ recency if Q6 yes) answered */
  function computeCssrsRisk(r) {
    r = r || {};
    var keys = ["q1", "q2", "q3", "q4", "q5", "q6"];
    for (var i = 0; i < keys.length; i++) {
      if (r[keys[i]] == null) return null;
    }
    if (yes(r.q6) && r.behaviorRecent == null) return null;

    if (yes(r.q4) || yes(r.q5)) return "high";
    if (yes(r.q6) && yes(r.behaviorRecent)) return "high";
    if (yes(r.q3)) return "moderate";
    if (yes(r.q6) && no(r.behaviorRecent)) return "moderate";

    if (yes(r.q1) || yes(r.q2)) return "low";
    return "low";
  }

  function cssrsRiskLabel(level) {
    if (level === "moderate") return "MODERATE (intermediate)";
    if (level === "high") return "HIGH";
    if (level === "low") return "LOW";
    return "—";
  }

  function cssrsResponseSummary(r) {
    r = r || {};
    var lines = [];
    CSSRS_ITEMS.forEach(function (item) {
      var ans = r[item.key];
      if (ans == null) return;
      lines.push(item.label + ": " + (yes(ans) ? "Yes" : "No"));
      if (item.followUp && yes(ans) && r.behaviorRecent != null) {
        lines.push("  · Within past 3 months: " + (yes(r.behaviorRecent) ? "Yes" : "No"));
      }
    });
    return lines.join("\n");
  }

  function cssrsChartBlock(r, level) {
    var risk = level || computeCssrsRisk(r);
    if (!risk) return "";
    var out = ["C-SSRS Screener (Columbia protocol)", cssrsResponseSummary(r), "Risk level: " + cssrsRiskLabel(risk)];
    return out.filter(Boolean).join("\n");
  }

  function emptyCssrsGuided() {
    return {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
      q6: null,
      behaviorRecent: null,
    };
  }

  function cssrsStepCount(r) {
    r = r || {};
    var n = CSSRS_ITEMS.length;
    if (yes(r.q6)) n += 1;
    return n;
  }

  function cssrsStepDef(stepIndex, r) {
    var idx = 0;
    for (var i = 0; i < CSSRS_ITEMS.length; i++) {
      if (idx === stepIndex) return { type: "item", item: CSSRS_ITEMS[i] };
      idx++;
      if (CSSRS_ITEMS[i].followUp && yes(r[CSSRS_ITEMS[i].key])) {
        if (idx === stepIndex) return { type: "followUp", item: CSSRS_ITEMS[i] };
        idx++;
      }
    }
    return null;
  }

  global.CSSRS = {
    ITEMS: CSSRS_ITEMS,
    computeCssrsRisk: computeCssrsRisk,
    cssrsRiskLabel: cssrsRiskLabel,
    cssrsResponseSummary: cssrsResponseSummary,
    cssrsChartBlock: cssrsChartBlock,
    emptyCssrsGuided: emptyCssrsGuided,
    cssrsStepCount: cssrsStepCount,
    cssrsStepDef: cssrsStepDef,
    yes: yes,
    no: no,
  };
})(typeof window !== "undefined" ? window : globalThis);
