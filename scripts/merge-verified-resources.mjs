/**
 * Merge verified JSON blocks from resource-research-least-states.md into DATA.
 * Skips duplicates (phone or name). Adds lastVerified + panel inference.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = join(root, "public/psychdispo.html");
const researchPath = join(root, "scripts/resource-research-least-states.md");
const LAST_VERIFIED = "2026-06-01";
const MAX_MERGE = 20;

function normPhone(p) {
  return (p || "").replace(/[^0-9]/g, "");
}
function normName(n) {
  return (n || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function inferPanel(entry) {
  if (entry.panel) return entry.panel;
  const cat = (entry.cat || "").toLowerCase();
  const name = (entry.name || "").toLowerCase();
  if (/emergency|ed\b|crisis/.test(cat + name)) return "D";
  if (/substance|detox|rehab|mat|sud/.test(cat + (entry.sub || ""))) return "C";
  if (/shelter|housing|food|dv|domestic|violence|social/.test(cat + (entry.need || ""))) return "F";
  if (/lgbtq|trans|veteran|pediatric|geriatric|specialty/.test(cat + name)) return "G";
  if (/referral|transport|nemt|medicaid/.test(cat + name)) return "B";
  if (/therapy|psychiatry|mental health|counsel/.test(cat)) return "A";
  return "F";
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
  return { data: JSON.parse(html.slice(arrStart, end)), start: arrStart, end };
}

function isDuplicate(data, entry) {
  const p = normPhone(entry.phone);
  const n = normName(entry.name);
  return data.some((row) => {
    const rp = normPhone(row.phone);
    const rn = normName(row.name);
    if (p && rp && p === rp) return true;
    if (n && rn && n === rn) return true;
    return false;
  });
}

const html = readFileSync(htmlPath, "utf8");
const md = readFileSync(researchPath, "utf8");
const research = extractResearchEntries(md);
const { data, start, end } = extractDataArray(html);

const toMerge = [];
for (const entry of research) {
  if (isDuplicate(data, entry)) continue;
  toMerge.push(entry);
  if (toMerge.length >= MAX_MERGE) break;
}

let added = 0;
for (const entry of toMerge) {
  const row = { ...entry };
  if (!row.lastVerified) row.lastVerified = LAST_VERIFIED;
  if (!row.panel) row.panel = inferPanel(row);
  data.push(row);
  added++;
}

const newHtml = html.slice(0, start) + JSON.stringify(data) + html.slice(end);
writeFileSync(htmlPath, newHtml);
console.log(`Merged ${added} new resources (${data.length} total in DATA)`);
console.log(
  "Added:",
  toMerge.map((e) => e.name).join(", "),
);
