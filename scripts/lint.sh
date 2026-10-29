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

# Rhythm (docs/design-system/rhythm.md): gaps sit on the ladder, space belongs to the parent, font sizes are --step-* tokens.
# A deliberate exception carries "rhythm-exempt" and a reason on the same line (// in SCSS, {# #} in templates).
hits=$(python3 - <<'EOF'
import glob, re
LADDER = {"3xs", "xs", "s-m", "l-xl", "xl-3xl"}
NEAREST = {"3xs-2xs": "xs", "2xs": "xs", "2xs-xs": "xs", "xs-s": "xs", "s": "xs", "m": "s-m", "m-l": "s-m", "s-l": "s-m",
           "3xs-m": "s-m", "2xs-m": "s-m", "l": "l-xl", "xl": "l-xl", "m-xl": "l-xl", "xl-2xl": "l-xl", "s-xl": "l-xl",
           "2xl": "xl-3xl", "2xl-3xl": "xl-3xl", "3xl": "xl-3xl", "3xl-4xl": "xl-3xl", "4xl": "xl-3xl", "xl-4xl": "xl-3xl"}
def fix(tok): return NEAREST.get(tok, "the step the pair table names")
def lines(pattern):
    for f in sorted(glob.glob(pattern, recursive=True)):
        for n, line in enumerate(open(f, encoding="utf-8"), 1):
            if "rhythm-exempt" not in line: yield f, n, line
for f, n, line in lines("src/**/*.njk"):
    for m in re.finditer(r"has-gap-([a-z0-9-]+)", line):
        if m.group(1) not in LADDER: print(f"{f}:{n}: has-gap-{m.group(1)} is off the ladder; use has-gap-{fix(m.group(1))}")
    if re.search(r"has-m[bt]-", line): print(f"{f}:{n}: has-mb-*/has-mt-*: space belongs to the parent; set the parent's flow gap")
for f, n, line in lines("src/css/**/*.scss"):
    if line.lstrip().startswith("//"): continue
    m = re.match(r"\s*(gap|column-gap|row-gap|margin[a-z-]*)\s*:(.*)", line)
    if m:
        for tok in re.findall(r"--space-([a-z0-9-]+)", m.group(2)):
            if tok not in LADDER: print(f"{f}:{n}: --space-{tok} in {m.group(1)} is off the ladder; use --space-{fix(tok)}")
    if re.match(r"\s*font-size\s*:", line) and "var(--step" not in line:
        print(f"{f}:{n}: font-size is not a --step-* token; use the rung it belongs to")
EOF
)
[ -n "$hits" ] && report "Off the rhythm ladder (docs/design-system/rhythm.md; mark deliberate exceptions rhythm-exempt)" "$hits"

[ $fail -eq 0 ] && echo "✓ lint passed"
exit $fail
