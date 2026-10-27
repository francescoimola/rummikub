# Masonry

**Layer:** Composite · **Status:** dropped · **Figma:** (pattern) examples `2296:3415` (Artmaking row, desktop), `2305:7323` (Artmaking, tablet) · **Code:** `.masonry` (to be removed)

## Dropped (G37)

The masonry gallery is dropped, `display: grid-lanes` included. Artmaking images use a plain two-column grid instead:

- Two columns, one column below the fold.
- `align-items: start`, so each child keeps its own height.
- Every image at its **natural** ratio, with no preset ratio (G11, G43). Figma keeps its Phase 13 crops as an approximation.
- Items stay `li.card` with the image as a direct child (see [Card](card.md)), so the full-bleed rule still applies.

The grid sits beside the text in a [Split row](split-row.md). It can reuse the stacking two-column class from [Media pair](media-pair.md) (`.grid-cols-2`).

## What the port removes

- The `.masonry` rule and its `@supports (display: grid-lanes)` block in `_components.scss` and `_responsive.scss`.
- The Artmaking notes about masonry in `AGENTS.md` (the `.masonry` bullets, including "never restore `columns`" and `align-self: start`).
- The `built-css.test.js` assertions on `grid-lanes` and `align-self` (and the `columns` check).
- The stale "multi-column packer" comment in `_split-row.njk`.

The doc stays so the history of the pattern is not lost.
