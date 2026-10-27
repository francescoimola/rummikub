# Coding standards

Judgement rules for review. Mechanical rules are checked by `pnpm lint` (`scripts/lint.sh`) and the tests, so they are not repeated here. Repo conventions live in `AGENTS.md`; the FRN-2026 redesign's per-component specs live in `docs/frn-2026/components/` (start at its README), with the reasons in `docs/frn-2026/decisions.md`.

## Design to code

- **The repo wins on existing values.** When Figma and the repo disagree on a value the repo already sets, the repo's value stays, unless a decision (`Qnn`/`Gnn` in `decisions.md`) says otherwise.
- **Figma px are a snapshot.** Every size is a Utopia token or a `clamp()`; layout comes from fluid scales, intrinsic grids and `@container` queries, with a viewport breakpoint only as a fallback. A raw px copied from Figma is a finding.
- **The live frame beats the doc.** Docs are a snapshot of Figma, which keeps changing. Re-read the frame before porting; where the doc disagrees, the diff fixes the doc. A diff otherwise matches the component doc it links to (markup, classes, tokens, states).
- **One fix per shared pattern.** A layout bug fixed on one page is fixed in the pattern: find every caller (the hero bleed needed `.home-hero`, `.page-header` and `.collab-hero` alike).
- **A page contains what its frame draws.** An element the repo has and the frame lacks (an extra CTA, an arrow) is removed, unless a decision keeps it.
- **Typefaces are fixed.** KC Pelletier Sans for the hero and CTA headings, Ronzino for everything else.

## Content and markup

- **Arrow rule.** A link gets Icon/Arrow-right only when its label doesn't make clear it leaves the page ("More about me"), or when leaving is hard to undo ("To main site"). A label that already implies a new page ("Read case study") gets none. External links use `arrow-ext`.
- **Images keep their natural shape** unless `ratio=` is passed (`--ratio-3-2` and the other ratio-named tokens). The Explorations carousel is the one fixed crop (3:2).
- **Editable content goes through Pages CMS.** Copy or media an editor would change (carousel slides, FAQs, art projects) lives in `src/_data/*.json` or front matter with a matching `.pages.yml` entry, not hard-coded in a template.
- **Words follow `GLOSSARY.md`** in labels, class names and data keys (Explorations, Case study, Ideas).

## Comments

- **One comment, one line.** SCSS and CSS comments are single-line `//`, never wrapped prose across consecutive lines. A note over ~25 words gets cut down, with property-specific detail on the line above (or trailing) that property. Keep the *why*, drop the essay. (`/* */` blocks are caught by `pnpm lint`.)
