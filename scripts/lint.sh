#!/usr/bin/env bash
# Mechanical repo rules (docs/css-architecture.md rules 8 + 10, external-link rel, data files). Run: pnpm lint
cd "$(dirname "$0")/.." || exit 1
fail=0
report() { echo "✗ $1"; echo "$2" | sed 's/^/    /'; fail=1; }

# CSS rule 10: viewport/container breakpoints only in _responsive.scss (feature queries stay nested)
hits=$(grep -rnE "@media[^{]*\((min-|max-)?width|@container" src/css --include='*.scss' \
  | grep -v "_responsive.scss" | grep -vE ":[0-9]+:[[:space:]]*//" \
  | grep -vE "prefers-reduced-motion|hover|forced-colors")
[ -n "$hits" ] && report "Breakpoint outside src/css/_responsive.scss (CSS rule 10)" "$hits"

# CSS rule 8: SCSS comments are single-line //, never /* */
hits=$(grep -rn "/\*" src/css --include='*.scss')
[ -n "$hits" ] && report "Block comment in SCSS; use one // line (CSS rule 8)" "$hits"

# External links: every target=_blank carries rel="noopener noreferrer" (same line)
hits=$(grep -rn 'target="_blank"' src --include='*.njk' --include='*.md' --include='*.html' --include='*.js' \
  | grep -v '\.test\.js:' | grep -v 'noopener noreferrer')
[ -n "$hits" ] && report 'target="_blank" without rel="noopener noreferrer"' "$hits"

# Data files: valid JSON with no duplicate keys (a duplicate silently drops data on rewrite)
hits=$(python3 - <<'EOF'
import json, glob
def unique(pairs):
    keys = [k for k, _ in pairs]
    dup = {k for k in keys if keys.count(k) > 1}
    if dup: raise ValueError("duplicate key(s): " + ", ".join(sorted(dup)))
    return dict(pairs)
for f in sorted(glob.glob("docs/**/*.json", recursive=True) + glob.glob("src/_data/*.json")):
    try: json.load(open(f), object_pairs_hook=unique)
    except Exception as e: print(f"{f}: {e}")
EOF
)
[ -n "$hits" ] && report "Invalid JSON or duplicate keys" "$hits"

# AGENTS.md rule 7: 200 lines at most
lines=$(wc -l < AGENTS.md)
[ "$lines" -gt 200 ] && report "AGENTS.md is $lines lines; the limit is 200 (AGENTS.md rule 7)" "move reference behind a pointer"

# Decision IDs name one rule each (cited as Gnn/Qnn); B7, B8, G6, G12, G26 predate this check
hits=$(grep -oE '^\| [A-Z][0-9]+ ' docs/frn-2026/decisions.md | sort | uniq -d | grep -vE '^\| (B7|B8|G6|G12|G26) $')
[ -n "$hits" ] && report "Duplicate decision ID in docs/frn-2026/decisions.md" "$hits"

[ $fail -eq 0 ] && echo "✓ lint passed"
exit $fail
