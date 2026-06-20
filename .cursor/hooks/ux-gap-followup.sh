#!/usr/bin/env bash
# subagentStop hook — one follow-up loop to verify weakest UX gaps were addressed.
# Gaps: .cursor/hooks/ux-gaps.json (sync from docs/build-spec-gap-analysis.md)

set -euo pipefail

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GAPS_FILE="${HOOK_DIR}/ux-gaps.json"

INPUT="$(cat)"

parse_status() {
  if command -v jq >/dev/null 2>&1; then
    jq -r '.status // .result // empty' <<<"$INPUT" 2>/dev/null || true
  elif command -v node >/dev/null 2>&1; then
    node -e '
      let s = "";
      try { const j = JSON.parse(process.argv[1] || "{}"); s = j.status || j.result || ""; } catch (_) {}
      process.stdout.write(String(s));
    ' "$INPUT" 2>/dev/null || true
  fi
}

task_touched_psychdispo() {
  # Best-effort: skip follow-up for unrelated subagent tasks
  local blob="$INPUT"
  if [[ "$blob" == *"psychdispo"* ]] || [[ "$blob" == *"PsychDispo"* ]]; then
    return 0
  fi
  if [[ "$blob" == *"build-spec-gap"* ]] || [[ "$blob" == *"patientBlurb"* ]]; then
    return 0
  fi
  if [[ "$blob" == *"public/psychdispo.html"* ]] || [[ "$blob" == *"src/routes"* ]]; then
    return 0
  fi
  return 1
}

STATUS="$(parse_status)"
STATUS_LC="$(printf '%s' "$STATUS" | tr '[:upper:]' '[:lower:]')"

# Only chain follow-up after successful subagent runs
if [[ -n "$STATUS_LC" ]] && [[ "$STATUS_LC" != "success" ]] && [[ "$STATUS_LC" != "completed" ]] && [[ "$STATUS_LC" != "ok" ]]; then
  echo '{}'
  exit 0
fi

if ! task_touched_psychdispo; then
  echo '{}'
  exit 0
fi

build_followup_message() {
  if command -v jq >/dev/null 2>&1 && [[ -f "$GAPS_FILE" ]]; then
    jq -r '
      "PsychDispo UX check: Did this subagent work address a gap in docs/build-spec-gap-analysis.md? "
      + "If not — or if the fix needs manual verification — pick one realistic item:\n\n"
      + ([.realistic_next[0], .weakest_ux[0], .unfinished[0]] | map(select(. != null)) | unique | .[:3] | map("• " + .) | join("\n"))
      + "\n\nVerify in the real UI/print flow (mobile + print), not just code paths. "
      + "Prefer user-visible wins over backend/auth until content + safety gates are stable."
    ' "$GAPS_FILE"
  else
    cat <<'EOF'
PsychDispo UX check: Did this work address docs/build-spec-gap-analysis.md? If not, verify or tackle:
• Phase 1 blurb backfill + lastVerified on cards
• Addendum B attestation + EMR off-ramp
• One-page patient print QA

Test in real UI/print flow; defer production auth.
EOF
  fi
}

MSG="$(build_followup_message)"

if command -v jq >/dev/null 2>&1; then
  jq -n --arg msg "$MSG" '{followup_message: $msg}'
else
  escaped="$(node -e 'console.log(JSON.stringify(process.argv[1]))' "$MSG" 2>/dev/null || printf '"%s"' "${MSG//\"/\\\"}")"
  printf '{ "followup_message": %s }\n' "$escaped"
fi

exit 0
