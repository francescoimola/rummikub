# Icon

**Layer:** Primitive · **Status:** figma · **Figma:** `2293:1221`, `2293:1224`, `2293:1228`, `2352:18808`, `2352:18809`, `2378:20019` · **Code:** `src/css/_icons.scss` (`$glyphs`, `[data-icon]`, `[data-icon-before]`)

## Purpose

The glyph set, one component per glyph, named `Icon/<Name>`. They are the Icon swap values for [Icon link](icon-link.md), and sit in [Breadcrumb](breadcrumb.md), [Header](header.md), [Carousel](carousel.md) and the Service and Writing items. One doc covers all six.

## Anatomy

Every component is a square, width and height bound to `step/0` (15 → 16.88), holding vectors. No properties, no variants.

| Figma | ID | Repo glyph (`$glyphs`) | Used for | Paint |
| --- | --- | --- | --- | --- |
| Icon/Copy | `2293:1221` | `copy` | Copy to clipboard | fill `color-accent` |
| Icon/Phone | `2293:1224` | `phone` | Call links | fill `color-accent` |
| Icon/External | `2293:1228` | `arrow-ext` | External links, new tab | stroke `color-accent`, 1.4 |
| Icon/Arrow-right | `2352:18808` | `arrow-right` | Links that need an arrow (README, Cross-cutting behaviour), Carousel (Previous is rotated 180°) | stroke `color-accent`, 1.375 |
| Icon/Chevron-right | `2352:18809` | `chevron-right` | Breadcrumb separator | fill `neutral/900-alpha` |
| Icon/Plus | `2378:20019` | none yet | Narrow header Menu toggle | stroke `neutral/950-alpha`, 1.375 |

- Link glyphs (Copy, Phone, External, Arrow-right) are all `color-accent` in Figma (G8). Chevron and Plus stay neutral because they follow the surrounding text.
- Icon/Plus rotates 45° when the menu opens (reads as ×). The repo has a `close` glyph instead, which the redesign replaces.
- The repo also has `email`, with no Figma icon. Nothing in the redesign uses it.
- Theme icons (sun, moon) are separate: vectors inside [Look toggles](look-toggles.md), files `sun.svg` and `moon.svg`.

## Props & variants

None.

## Layout

None, fluid only. Size is `step/0` so a glyph tracks the body text. In code it is `1em` square.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Width and height | `step/0` | 15 → 16.88 |
| Colours | `color-accent` for link glyphs (G8), as in the table otherwise | colour |

Values from [`_tokens.md`](_tokens.md). The Carousel icons use the same `step/0` (Q40).

## States & interactions

- Trailing glyphs move on hover and focus of the link (`--icon-gap` to `--space-xs`, `--dur-fast`). Leading glyphs don't. Reduced motion: none.
- Plus rotates over `--dur-medium`.

## Content rules

- Icons are opt-in per element (`data-icon` after the label, `data-icon-before` before it). Nothing keys off `href`.
- Add a glyph: one entry in `$glyphs`, and `built-css.test.js` already checks every name used in markup has one.

## HTML & accessibility

```html
<a href="https://…" data-icon="arrow-ext" target="_blank" rel="noopener noreferrer">Substack</a>
```

- Glyphs are CSS masks with no text, so they are decorative. The label carries the name.
- A glyph on its own (the breadcrumb separator) must be hidden from assistive tech.

## Port notes

- Add `plus` to `$glyphs` and retire `close` once the Narrow menu uses it.
- Colour: the glyph is `currentColor` in code (G8), so it follows the link colour. Rebind the Figma External and Arrow-right strokes from `brand/800` to `color-accent`.
- `[data-icon="arrow-ext"]` keeps its tighter gap (`--space-4xs`).
- Update the External description to say `arrow-ext`.

## Open questions

None. Settled in Phase 18 (G8).
