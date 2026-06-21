#!/usr/bin/env node
/** MECE sanity check for life-stage population flag visibility + resource filters. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "public/psychdispo.html"), "utf8");

const required = [
  "var FLAG_LIFE_STAGE=",
  "function flagVisibleForStage(",
  "function syncFlagsFromS(",
  "function pruneHiddenFlags(",
  "function pedsOK(",
  "function geriatricOK(",
  "function adultOK(",
];
const missing = required.filter((sig) => !html.includes(sig));
if (missing.length) {
  console.error("test-life-stage-mece FAIL — missing:", missing.join(", "));
  process.exit(1);
}

const FLAG_LIFE_STAGE = {
  perinatal: { child: 1, adult: 1, geriatric: 0 },
  veteran: { child: 1, adult: 1, geriatric: 1 },
  lgbtq: { child: 1, adult: 1, geriatric: 1 },
  justice: { child: 1, adult: 1, geriatric: 1 },
  unhoused: { child: 1, adult: 1, geriatric: 1 },
  sud: { child: 1, adult: 1, geriatric: 1 },
  tbi: { child: 1, adult: 1, geriatric: 0 },
  idd: { child: 1, adult: 1, geriatric: 1 },
  seriousMed: { child: 1, adult: 1, geriatric: 1 },
};
function flagVisibleForStage(flag, stage) {
  const row = FLAG_LIFE_STAGE[flag];
  if (!row) return true;
  return !!row[stage];
}
function isGeriatricOnly(r) {
  if (r.flag === "geriatric" || r.spec === "geriatric") return true;
  if ((r.cat || "").indexOf("Seniors & aging") >= 0) return true;
  return false;
}
function isPedsOnly(r) {
  return !!r.peds;
}
function pedsOK(r, lifeStage) {
  return !r.peds || lifeStage === "child";
}
function geriatricOK(r, lifeStage) {
  if (!isGeriatricOnly(r)) return true;
  return lifeStage === "geriatric";
}
function adultOK(r, lifeStage) {
  if (lifeStage === "child" && isGeriatricOnly(r)) return false;
  return true;
}
function topMatchOK(r, lifeStage) {
  if (lifeStage === "adult" && (isPedsOnly(r) || isGeriatricOnly(r))) return false;
  return true;
}

const stages = ["child", "adult", "geriatric"];
const failures = [];

for (const stage of stages) {
  if (flagVisibleForStage("perinatal", stage) !== (stage !== "geriatric")) {
    failures.push(`perinatal visibility wrong for ${stage}`);
  }
  if (flagVisibleForStage("tbi", stage) !== (stage !== "geriatric")) {
    failures.push(`tbi visibility wrong for ${stage}`);
  }
  const peds = { peds: 1, name: "Peds crisis" };
  const ger = { spec: "geriatric", name: "Eldercare" };
  const adult = { name: "CMHC" };
  if (pedsOK(peds, stage) !== (stage === "child")) failures.push(`pedsOK peds-only @ ${stage}`);
  if (geriatricOK(ger, stage) !== (stage === "geriatric")) failures.push(`geriatricOK ger-only @ ${stage}`);
  if (!adultOK(adult, stage)) failures.push(`adultOK generic @ ${stage}`);
  if (topMatchOK(peds, stage) !== (stage !== "adult")) failures.push(`topMatchOK peds @ ${stage}`);
  if (topMatchOK(ger, stage) !== (stage !== "adult")) failures.push(`topMatchOK ger @ ${stage}`);
}

if (failures.length) {
  console.error("test-life-stage-mece FAIL:", failures.join("; "));
  process.exit(1);
}
console.log("test-life-stage-mece OK —", stages.length, "stages × flag + resource filters");
