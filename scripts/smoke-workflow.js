#!/usr/bin/env node
/** CI smoke: verify psychdispo.html exposes key workflow functions. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "public/psychdispo.html"), "utf8");

const required = [
  "function render(",
  "function goWorkflowStep(",
  "function buildPacket(",
  "function isExpressOp(",
  "function workflowStepCount(",
  "function renderPlanTopMatches(",
  "function renderDeliverScreen(",
  "function autoMatch(",
  "function syncFlagsFromS(",
  "function flagVisibleForStage(",
  "var FLAG_LIFE_STAGE=",
];

const missing = required.filter((sig) => !html.includes(sig));
if (missing.length) {
  console.error("smoke-workflow FAIL — missing:", missing.join(", "));
  process.exit(1);
}
console.log("smoke-workflow OK —", required.length, "workflow symbols present");
