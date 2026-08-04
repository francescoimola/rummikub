# CSS slimming — design

**Date:** 2026-08-04
**Status:** approved for planning
**Scope:** phases 1, 2a, 3, 4. Subsetting cleacss (2b) is explicitly out of scope.

## Origin

The request was to find CSS classes that do only one or two things, are used on a
single element, and could be written inline to shrink the stylesheets.

Measurement showed inlining does not pay off. The findings below reframed the work
into four phases; the user approved all of them except subsetting cleacss.

## Baseline measurements

Taken from the committed build in `public/` at 25 HTML pages.

| File | Raw | Brotli | Classes defined | Used by this site |
|---|---|---|---|---|
| `public/css/index.css` | 38,409 B | 8,326 B | 80 | ~100% |
| `public/css/vendor/cleacss.css` | 128,996 B | 9,137 B | 530 | 36 (6.8%) |

`vendor/cleacss.css` is a raw passthrough copy, so it ships **unminified**.

### Why inlining was rejected

Every candidate class, with the cost of moving it inline:

| Class | Declarations | Instances | Verdict |
|---|---|---|---|
| `.has-justify-between` | 1 | **0** | Dead code — delete, do not inline |
| `.has-nowrap` | 1 | 4 | Inlining costs **+95 B net** |
| `.has-row-divider` | 1 | 4 | Inlining costs **+265 B net** |
| `.has-counter` | 1 | 1 | Required selector hook — cannot remove |

Classes that look small but cannot be inlined at all:

- `.profile-picture_inner` / `_outer` — flipped by a media query (`_responsive.scss:161-169`)
- `.skip-link` — needs `:focus-visible`
- `.balance`, `.pretty`, `.small` — descendant selectors
- `.grid-cols-2-fixed` — shares a 4-declaration block with `.split-row` and `.grid-responsive-cols`

CSS is fetched and cached once; inline styles repeat in every page's HTML. For any
class used more than once, inlining makes the site larger.

## Phase 1 — Delete dead rule

Delete `.has-justify-between` at `src/css/index.scss:637-639`.

Confirmed unused: it appears nowhere in `src/` outside its own definition, nowhere in
the 25 built HTML pages, and is not referenced by cleacss.

No inlining is performed. Every other candidate is dead, growth-negative, or required.

## Phase 2a — Bundle cleacss, pin layer order

### The problem

`src/css/index.scss:8` reads `@import "vendor/cleacss.css"`. Sass passes through any
import URL ending in `.css` untouched, so the built `index.css` begins with a literal
`@import "vendor/cleacss.css";`.

The browser therefore makes two sequential render-blocking requests: it must download
and parse `index.css` before it can discover cleacss. The preload scanner cannot see
the second request because it is hidden inside the first file's body.

Verified behaviour (Dart Sass):

- `@import "vendor/cleacss.css"` → emits a passthrough `@import`, hoisted to line 1
- `@import "vendor/cleacss"` → inlines the file's contents

AGENTS.md CSS rule 2 states the opposite ("extensionless, forces Sass to pass it
through as plain CSS"). The note is inaccurate and must be corrected.

### The cascade-order trap

This is the load-bearing detail of this phase.

A passthrough `@import` is hoisted to the top of the output, so cleacss currently
arrives **first**. Its layers are therefore named first, which under the cascade-layers
spec makes them the **lowest**-priority layers.

Inlining it at line 8 moves it after the `@use`d modules, so `fonts`, `colors` and
`type` get named first — flipping cleacss's layers to **highest** priority. Our token
layers would silently start losing to cleacss, site-wide.

cleacss declares **five** layers, not one. It contains no explicit order statement, so
its order is established by first appearance:

```
reset, layout, elements, is, has
```

Ours then follow: `fonts, colors, type`.

Note AGENTS.md CSS rule 3 lists only `reset`, `fonts`, `colors`, `type`. It omits
cleacss's `layout`, `elements`, `is` and `has`, and must be corrected — a declaration
naming only `reset` would leave those four undeclared, and undeclared layers are
appended **above** declared ones, reintroducing the exact inversion this prevents.

Mitigation is mandatory, not optional: add the full layer-order declaration as the
first statement of `index.scss`, which pins order independently of source position.

```scss
@layer reset, layout, elements, is, has, fonts, colors, type;
```

This reproduces the current cascade exactly.

### Changes

1. `src/css/index.scss:8` — drop the `.css` extension
2. `src/css/index.scss` — add `@layer reset, layout, elements, is, has, fonts, colors, type;`
   as the first statement
3. `eleventy.config.js:54` — remove the `src/css/vendor` → `css/vendor` passthrough, now unreferenced
4. `AGENTS.md` CSS rule 2 — correct the extensionless claim and note the pinned layer order
5. `AGENTS.md` CSS rule 3 — correct the layer list to include cleacss's `layout`,
   `elements`, `is` and `has`

### Expected outcome

- One render-blocking request instead of two
- cleacss minified by LightningCSS for the first time
- `public/css/vendor/` no longer emitted

### Verification

- Built `index.css` contains no `@import` statement
- Built `index.css` begins with `@layer reset,layout,elements,is,has,fonts,colors,type;`
- Diff the set of `@layer` names in the built CSS before and after — it must be identical
- `public/css/vendor/` does not exist
- Visual check of a contrast page, a work case study, `/art/`, and `/studio/design/`
  in both light and dark mode, against the pre-change build

## Phase 3 — Consolidate duplicate declaration blocks

12 declaration bodies appear more than once in the built CSS. The dominant pattern is
`:hover` and `:focus-visible` written as separate rules with identical declarations.

Confirmed instances:

| Duplicated body | Selectors |
|---|---|
| `--color-accent: var(--accent-hover)` | `a:hover, button:hover` / `a:focus-visible, button:focus-visible` |
| `color: var(--accent-hover)` | `nav li:hover` / `summary:hover` / `summary:focus-visible` / `nav li:has(a[aria-current=page])` |
| `color: var(--neutral-800-alpha)` | `h1>.dimmed` / `nav a[aria-current=page]:hover` / `:focus-visible` |
| `margin-inline-start: var(--space-xs)` | 4 icon hover/focus rules in `_icons.scss` |
| `visibility: hidden; display: none` | `.profile-picture_outer` / `.mobile-only` / `.tablet-only, .profile-picture_inner` |

Approach: merge each hover/focus pair into `:is(:hover, :focus-visible)`.

Constraint: this is a byte-neutral-to-small-win refactor whose real value is
readability. Do not merge rules whose selectors differ in specificity, and do not
merge across `@layer` boundaries. Each merge must be verified as producing identical
computed styles, not merely similar source.

## Phase 4 — Fold single-use utilities into their components

This is the change that addresses the original itch: utility classes that exist for a
single element.

`.has-nowrap` and `.has-row-divider` are each used exactly 4 times, all on the same
4 sibling `<li>` elements in `src/studio/design.njk:49-75`. Each `<li>` currently
carries 5 utility classes.

Approach: replace both utilities with one scoped rule for that list, removing 8 class
tokens from the markup and 2 floating utilities from `index.scss`.

`.has-counter` stays. It is a selector hook for `.has-counter > & h3::before`
(`_components.scss:68`); removing the class breaks the counter regardless of where the
`counter-reset` lives.

Constraint: the new rule must be scoped to that list, not applied globally to
`li.flow-row`, which is used elsewhere.

## Non-goals

- **Subsetting cleacss.** Explicitly excluded by the user. The vendored file stays
  whole so its unused utilities remain available.
- Critical/per-page CSS. Previously investigated and reverted; the stylesheet is
  dominated by the `:root` token layer, so critical CSS inlines ~68% per page.
- Any change to the `--space-*` / cleacss-overrides arrangement (CSS rule 3).

## Realistic expectations

Phases 1, 3 and 4 together move roughly 200 bytes. Their value is maintainability, not
weight. Phase 2a is the only phase with a measurable user-facing effect: one fewer
round trip to first paint, plus minification of a 129 KB file that is currently served
raw.

## Risk summary

| Phase | Risk | Mitigation |
|---|---|---|
| 1 | None — verified dead | — |
| 2a | **High** — silent site-wide cascade inversion | Explicit `@layer` order declaration; full visual diff |
| 3 | Medium — specificity changes when merging | Verify computed styles per merge |
| 4 | Low — scoped to one template | Visual check of `/studio/design/` |
