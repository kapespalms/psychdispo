#!/usr/bin/env bash
# subagentStart hook — steer Task subagents toward unfinished/weakest PsychDispo UX.
# Gaps: .cursor/hooks/ux-gaps.json (sync from docs/build-spec-gap-analysis.md)

set -euo pipefail

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GAPS_FILE="${HOOK_DIR}/ux-gaps.json"

# Consume subagentStart payload (subagent_type, task description, etc.)
INPUT="$(cat)"

json_escape() {
  if command -v jq >/dev/null 2>&1; then
    jq -Rn --arg s "$1" '$s'
  elif command -v node >/dev/null 2>&1; then
    node -e 'console.log(JSON.stringify(process.argv[1]))' "$1"
  else
    # Minimal fallback: escape quotes and backslashes
    local s="${1//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '"%s"' "$s"
  fi
}

build_user_message() {
  if command -v jq >/dev/null 2>&1 && [[ -f "$GAPS_FILE" ]]; then
    jq -r '
      "PsychDispo UX focus: read docs/build-spec-gap-analysis.md before new features. "
      + "Target unfinished/weakest areas with realistic scope — ship user-visible wins, "
      + "avoid over-engineering (defer Supabase/Clerk until content + safety gates stable).\n\n"
      + "Realistic next (pick 1–2):\n"
      + (.realistic_next[:3] | map("• " + .) | join("\n"))
      + "\n\nWeakest UX to improve or verify:\n"
      + (.weakest_ux[:2] | map("• " + .) | join("\n"))
    ' "$GAPS_FILE"
  else
    cat <<'EOF'
PsychDispo UX focus: read docs/build-spec-gap-analysis.md. Prioritize unfinished/weakest areas with realistic scope (no over-engineering).

Realistic next:
• Phase 1 blurb backfill + lastVerified on cards
• Addendum B: EMR off-ramp + attestation for moderate/high risk
• One-page patient print QA + template scaffold stub

Defer production auth until content and safety gates are stable.
EOF
  fi
}

MSG="$(build_user_message)"

if command -v jq >/dev/null 2>&1; then
  jq -n --arg msg "$MSG" '{permission: "allow", user_message: $msg}'
else
  escaped="$(json_escape "$MSG")"
  printf '{ "permission": "allow", "user_message": %s }\n' "$escaped"
fi

exit 0
