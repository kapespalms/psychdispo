/**
 * Batch 1: merge statewide AAA/ADRC + APS stubs from state-age-band research into DATA.
 * Sources: all-states-summary.json (AR–WY) + AL/AK/AZ manual .md files.
 * Dedupes on county|name|phone. Adds lastVerified, panel, flag:geriatric, peds:0.
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = join(root, "public/psychdispo.html");
const summaryPath = join(root, "scripts/state-age-band/all-states-summary.json");
const stateDir = join(root, "scripts/state-age-band");
const MANUAL_STATES = ["AL", "AK", "AZ"];
const MAX_MERGE = 40;
const LAST_VERIFIED = "2026-06-20";

function normPhone(p) {
  return (p || "").replace(/[^0-9]/g, "");
}
function normName(n) {
  return (n || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
function normCounty(c) {
  return (c || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
function dedupeKey(entry) {
  return `${normCounty(entry.county)}|${normName(entry.name)}|${normPhone(entry.phone)}`;
}

function inferPanel(entry) {
  if (entry.panel) return entry.panel;
  const cat = (entry.cat || "").toLowerCase();
  const name = (entry.name || "").toLowerCase();
  if (/aps|adult protective|adult abuse|adult maltreatment/.test(name)) return "F";
  if (cat.includes("seniors") || /adrc|aaa|ageline|area agency/.test(name)) return "G";
  return "F";
}

function isBatch1Candidate(entry) {
  if (!entry.name || !entry.phone) return false;
  const county = (entry.county || "").toLowerCase();
  const name = (entry.name || "").toLowerCase();
  const cat = (entry.cat || "").toLowerCase();
  const svc = (entry.svc || "").toLowerCase();
  const isStatewide = county.includes("statewide");
  if (!isStatewide) return false;
  const isAaaAdrc =
    cat.includes("seniors") ||
    /adrc|aaa|ageline|area agency|aging & disability resource/.test(name + " " + svc);
  const isAps = /aps|adult protective|adult abuse|adult maltreatment/.test(name + " " + svc);
  return isAaaAdrc || isAps;
}

function extractJsonBlocks(md) {
  const entries = [];
  const re = /```json\s*([\{][\s\S]*?)\s*```/g;
  let m;
  while ((m = re.exec(md))) {
    try {
      entries.push(JSON.parse(m[1]));
    } catch {
      /* skip */
    }
  }
  return entries;
}

function extractDataArray(html) {
  const start = html.indexOf("var DATA=[");
  if (start < 0) throw new Error("DATA array not found");
  const arrStart = html.indexOf("[", start);
  let depth = 0;
  let end = -1;
  for (let i = arrStart; i < html.length; i++) {
    const c = html[i];
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) throw new Error("DATA array end not found");
  return { data: JSON.parse(html.slice(arrStart, end)), start: arrStart, end };
}

function prepareRow(entry) {
  const row = { ...entry };
  delete row.state;
  delete row.band;
  delete row.sources;
  delete row.verified;
  if (!row.patientBlurb) return null;
  if (!row.lastVerified) row.lastVerified = entry.verified || LAST_VERIFIED;
  if (!row.flag) row.flag = "geriatric";
  if (row.peds === undefined) row.peds = 0;
  if (!row.panel) row.panel = inferPanel(row);
  if (row.hours && !row.days) row.days = "Mon–Fri";
  return row;
}

function stateFromCounty(county) {
  const m = (county || "").match(/^([A-Za-z ]+)\s*\(statewide\)/i);
  return m ? m[1].trim() : null;
}

function loadCandidates() {
  const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
  const fromSummary = summary.entries.filter(isBatch1Candidate);

  const fromManual = [];
  for (const st of MANUAL_STATES) {
    const md = readFileSync(join(stateDir, `${st}.md`), "utf8");
    fromManual.push(...extractJsonBlocks(md).filter(isBatch1Candidate));
  }

  const seen = new Set();
  const merged = [];
  for (const e of [...fromManual, ...fromSummary]) {
    const key = dedupeKey(e);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(e);
  }
  return merged;
}

function geriatricCoverage(data) {
  const states = new Set();
  for (const row of data) {
    if ((row.cat || "").includes("Seniors & aging") || row.flag === "geriatric") {
      const st = stateFromCounty(row.county);
      if (st) states.add(st.toLowerCase());
    }
  }
  return states;
}

const html = readFileSync(htmlPath, "utf8");
const { data, start, end } = extractDataArray(html);
const existingKeys = new Set(data.map(dedupeKey));
const covered = geriatricCoverage(data);

const candidates = loadCandidates()
  .map((e) => ({ ...e, _state: e.state || stateFromCounty(e.county) || "" }))
  .filter((e) => !existingKeys.has(dedupeKey(e)))
  .sort((a, b) => {
    const aHas = covered.has((a._state || stateFromCounty(a.county) || "").toLowerCase());
    const bHas = covered.has((b._state || stateFromCounty(b.county) || "").toLowerCase());
    if (aHas !== bHas) return aHas ? 1 : -1;
    return (a._state || "").localeCompare(b._state || "");
  });

const toMerge = [];
for (const entry of candidates) {
  const row = prepareRow(entry);
  if (!row) continue;
  toMerge.push(row);
  if (toMerge.length >= MAX_MERGE) break;
}

for (const row of toMerge) {
  data.push(row);
  existingKeys.add(dedupeKey(row));
}

const newHtml = html.slice(0, start) + JSON.stringify(data) + html.slice(end);
writeFileSync(htmlPath, newHtml);

const statesCovered = [
  ...new Set(
    toMerge.map((r) => stateFromCounty(r.county)).filter(Boolean),
  ),
].sort();

console.log(`Merged ${toMerge.length} new resources (${data.length} total in DATA)`);
console.log(`States covered (${statesCovered.length}):`, statesCovered.join(", "));
console.log(
  "Added:",
  toMerge.map((e) => `${stateFromCounty(e.county) || "?"} · ${e.name}`).join("\n  "),
);
