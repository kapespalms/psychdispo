/**
 * Backfill patientBlurb + lastVerified from resource-research-least-states.md
 * into public/psychdispo.html DATA array (verified entries only).
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = join(root, "public/psychdispo.html");
const researchPath = join(root, "scripts/resource-research-least-states.md");

const LAST_VERIFIED = "2026-06-01";

function normPhone(p) {
  return (p || "").replace(/[^0-9]/g, "");
}

function normName(n) {
  return (n || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function extractResearchEntries(md) {
  const entries = [];
  const re = /```json\s*([\{][\s\S]*?)\s*```/g;
  let m;
  while ((m = re.exec(md))) {
    try {
      const obj = JSON.parse(m[1]);
      if (obj.patientBlurb && obj.name && obj.phone) entries.push(obj);
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
  const json = html.slice(arrStart, end);
  return { data: JSON.parse(json), start: arrStart, end };
}

function matchEntry(dataRow, researchRow) {
  const p1 = normPhone(dataRow.phone);
  const p2 = normPhone(researchRow.phone);
  if (p1 && p2 && p1 === p2) return true;
  const n1 = normName(dataRow.name);
  const n2 = normName(researchRow.name);
  if (n1 && n2 && n1 === n2 && dataRow.county === researchRow.county) return true;
  if (n1 && n2 && (n1.includes(n2) || n2.includes(n1)) && dataRow.county === researchRow.county)
    return true;
  return false;
}

const html = readFileSync(htmlPath, "utf8");
const md = readFileSync(researchPath, "utf8");
const research = extractResearchEntries(md);
const { data, start, end } = extractDataArray(html);

let updated = 0;
const matched = [];

for (const row of data) {
  const hit = research.find((r) => matchEntry(row, r));
  if (!hit) continue;
  if (!row.patientBlurb) {
    row.patientBlurb = hit.patientBlurb;
    updated++;
  }
  if (!row.lastVerified) row.lastVerified = LAST_VERIFIED;
  matched.push(row.name);
}

const newJson = JSON.stringify(data);
const newHtml = html.slice(0, start) + newJson + html.slice(end);
writeFileSync(htmlPath, newHtml);

console.log(
  `Backfill complete: ${updated} blurbs added, ${matched.length} entries matched, research pool ${research.length}`,
);
console.log("Matched:", matched.slice(0, 10).join(", "), matched.length > 10 ? "..." : "");
