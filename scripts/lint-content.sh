#!/usr/bin/env bash
#
# Content linter for MCA Enablement Course.
# Checks module markdown files against the writing style guide.
#
# Usage:
#   ./scripts/lint-content.sh                    # lint all docs
#   ./scripts/lint-content.sh docs/part-1/*.md   # lint specific files
#
# Exit code: 1 if banned patterns found, 0 if clean.

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Determine files to check
if [ $# -gt 0 ]; then
  FILES=("$@")
else
  FILES=()
  while IFS= read -r -d '' f; do
    FILES+=("$f")
  done < <(find docs -name '*.md' -print0 2>/dev/null)
fi

if [ ${#FILES[@]} -eq 0 ]; then
  echo "No markdown files found."
  exit 0
fi

# Strip fenced code blocks and HTML comments before checking.
# This prevents false positives from code examples and <!-- VERIFY --> flags.
strip_code_blocks() {
  awk '
    /^```/ { in_code = !in_code; print ""; next }
    in_code { print ""; next }
    { print }
  ' "$1"
}

strip_html_comments() {
  perl -0777 -pe 's/\{\/\*.*?\*\/\}//gs'
}

check_pattern() {
  local pattern="$1"
  local label="$2"
  local severity="$3" # "error" or "warning"
  local file="$4"
  local content="$5"

  local matches
  matches=$(echo "$content" | grep -n -i -E "$pattern" 2>/dev/null || true)

  if [ -n "$matches" ]; then
    while IFS= read -r match; do
      if [ "$severity" = "error" ]; then
        printf "${RED}ERROR${NC} %s:%s  %s\n" "$file" "$match" "$label"
        ERRORS=$((ERRORS + 1))
      else
        printf "${YELLOW}WARN${NC}  %s:%s  %s\n" "$file" "$match" "$label"
        WARNINGS=$((WARNINGS + 1))
      fi
    done <<< "$matches"
  fi
}

for file in "${FILES[@]}"; do
  [ -f "$file" ] || continue

  content=$(strip_code_blocks "$file")
  # Content with HTML comments removed, for rules that shouldn't fire inside comments
  content_no_comments=$(echo "$content" | strip_html_comments)
  # Strip bold UI labels (**...**) — Salesforce UI labels inside bold markers are exempt
  # from prose style rules (they may use banned words as product/feature names).
  content_prose=$(echo "$content_no_comments" | sed 's/\*\*[^*]*\*\*//g')

  # ─── Typographic ───────────────────────────────────
  check_pattern $'\xe2\x80\x94' "em dash" "error" "$file" "$content_prose"
  check_pattern '!' "exclamation mark" "error" "$file" "$content_prose"
  check_pattern ';' "semicolon in prose" "error" "$file" "$content_prose"
  check_pattern '\.\.\.' "ellipsis" "error" "$file" "$content_prose"

  # ─── Filler and hedging ────────────────────────────
  check_pattern "it'?s important to note" "filler: it's important to note" "error" "$file" "$content_prose"
  check_pattern "it'?s worth mentioning" "filler: it's worth mentioning" "error" "$file" "$content_prose"
  check_pattern "it should be noted" "filler: it should be noted" "error" "$file" "$content_prose"
  check_pattern "let'?s dive in" "filler: let's dive in" "error" "$file" "$content_prose"
  check_pattern "let'?s explore" "filler: let's explore" "error" "$file" "$content_prose"
  check_pattern "let'?s take a look" "filler: let's take a look" "error" "$file" "$content_prose"
  check_pattern "in this module,? we will" "filler: in this module we will" "error" "$file" "$content_prose"
  check_pattern "as you may know" "filler: as you may know" "error" "$file" "$content_prose"
  check_pattern "as mentioned earlier" "filler: as mentioned earlier" "error" "$file" "$content_prose"
  check_pattern "in today'?s world" "filler: in today's world" "error" "$file" "$content_prose"
  check_pattern "in the modern landscape" "filler: in the modern landscape" "error" "$file" "$content_prose"
  check_pattern "at the end of the day" "filler: at the end of the day" "error" "$file" "$content_prose"
  check_pattern "moving forward" "filler: moving forward" "error" "$file" "$content_prose"
  check_pattern "in order to" "filler: in order to (use 'to')" "error" "$file" "$content_prose"
  check_pattern "make sure to" "filler: make sure to" "error" "$file" "$content_prose"
  check_pattern "feel free to" "filler: feel free to" "error" "$file" "$content_prose"

  # ─── Corporate and AI slop ────────────────────────
  check_pattern '\bleverage\b' "slop: leverage" "error" "$file" "$content_prose"
  check_pattern '\butilize\b' "slop: utilize" "error" "$file" "$content_prose"
  check_pattern '\bfacilitate\b' "slop: facilitate" "error" "$file" "$content_prose"
  check_pattern '\bstreamline\b' "slop: streamline" "error" "$file" "$content_prose"
  check_pattern '\brobust\b' "slop: robust" "error" "$file" "$content_prose"
  check_pattern '\bseamless\b' "slop: seamless" "error" "$file" "$content_prose"
  check_pattern '\bcomprehensive\b' "slop: comprehensive" "error" "$file" "$content_prose"
  check_pattern 'cutting-edge|state-of-the-art' "slop: cutting-edge/state-of-the-art" "error" "$file" "$content_prose"
  check_pattern 'best-in-class' "slop: best-in-class" "error" "$file" "$content_prose"
  check_pattern '\bempower\b' "slop: empower" "error" "$file" "$content_prose"
  check_pattern '\boptimize\b' "slop: optimize" "error" "$file" "$content_prose"
  check_pattern '\becosystem\b' "slop: ecosystem" "error" "$file" "$content_prose"
  check_pattern '\bsolution\b' "slop: solution" "error" "$file" "$content_prose"
  check_pattern '\bjourney\b' "slop: journey" "error" "$file" "$content_prose"
  check_pattern '\bharness\b' "slop: harness" "error" "$file" "$content_prose"
  check_pattern '\bdelve\b' "slop: delve" "error" "$file" "$content_prose"
  check_pattern '\brealm\b' "slop: realm" "error" "$file" "$content_prose"
  check_pattern '\blandscape\b' "slop: landscape" "error" "$file" "$content_prose"
  check_pattern '\bparadigm\b' "slop: paradigm" "error" "$file" "$content_prose"
  check_pattern '\bsynergy\b|\bsynergize\b' "slop: synergy" "error" "$file" "$content_prose"
  check_pattern '\bholistic\b' "slop: holistic" "error" "$file" "$content_prose"
  check_pattern '\bcrucially\b|\bnotably\b|\bimportantly\b' "slop: crucially/notably/importantly" "error" "$file" "$content_prose"
  check_pattern 'testament to' "slop: testament to" "error" "$file" "$content_prose"
  check_pattern 'game-changer' "slop: game-changer" "error" "$file" "$content_prose"

  # ─── Overly enthusiastic ──────────────────────────
  check_pattern 'Congratulations' "enthusiasm: Congratulations" "error" "$file" "$content_prose"
  check_pattern 'Great job' "enthusiasm: Great job" "error" "$file" "$content_prose"
  check_pattern 'Well done' "enthusiasm: Well done" "error" "$file" "$content_prose"
  check_pattern "You'?ve successfully" "enthusiasm: You've successfully" "error" "$file" "$content_prose"
  check_pattern '\bexciting\b' "enthusiasm: exciting" "error" "$file" "$content_prose"
  check_pattern '\bpowerful\b' "enthusiasm: powerful" "error" "$file" "$content_prose"
  check_pattern '\bamazing\b' "enthusiasm: amazing" "error" "$file" "$content_prose"
  check_pattern '\bincredible\b' "enthusiasm: incredible" "error" "$file" "$content_prose"

  # ─── Structural slop ──────────────────────────────
  check_pattern 'not only .+ but also' "structure: not only X but also Y" "error" "$file" "$content_prose"
  check_pattern "whether you'?re a" "structure: whether you're a" "error" "$file" "$content_prose"
  check_pattern "now that we'?ve covered" "structure: now that we've covered" "error" "$file" "$content_prose"
  check_pattern 'without further ado' "structure: without further ado" "error" "$file" "$content_prose"

  # ─── Banned admonitions ────────────────────────────
  check_pattern ':::note' "banned admonition: :::note" "error" "$file" "$content"
  check_pattern ':::danger' "banned admonition: :::danger" "error" "$file" "$content"

  # ─── Terminology ───────────────────────────────────
  check_pattern '\bData Cloud\b' "terminology: use 'Data 360' not 'Data Cloud'" "error" "$file" "$content_prose"
  check_pattern 'Marketing Cloud Growth' "terminology: use 'MCA' not 'Marketing Cloud Growth'" "error" "$file" "$content_prose"

  # ─── Verification comments (warning, not blocking) ─
  check_pattern '\{/\* VERIFY' "unresolved VERIFY comment" "warning" "$file" "$content"

done

echo ""
echo "────────────────────────────────"
if [ $ERRORS -gt 0 ]; then
  printf "${RED}%d error(s)${NC}, ${YELLOW}%d warning(s)${NC}\n" "$ERRORS" "$WARNINGS"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  printf "${YELLOW}%d warning(s)${NC}, 0 errors\n" "$WARNINGS"
  exit 0
else
  echo "Clean. No issues found."
  exit 0
fi
