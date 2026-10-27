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
| Icon/External | `2293:1228` | `arrow-ext` | External links, new tab | stroke `brand/800`, 1.4 |
| Icon/Arrow-right | `2352:18808` | `arrow-right` | Internal "more" links, Carousel (Previous is rotated 180°) | stroke `brand/800`, 1.375 |
| Icon/Chevron-right | `2352:18809` | `chevron-right` | Breadcrumb separator | fill `neutral/900-alpha` |
| Icon/Plus | `2378:20019` | none yet | Narrow header Menu toggle | stroke `neutral/950-alpha`, 1.375 |

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
| Colours | as in the table | colour |

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
- Colour: the glyph is `currentColor` in code, so Figma's mixed paints (accent fill, `brand/800` stroke) collapse into the link colour.
- `[data-icon="arrow-ext"]` keeps its tighter gap (`--space-4xs`).

## Open questions

- Copy and Phone are filled with `color-accent`, External and Arrow-right are stroked with `brand/800`. Rebind all to one token, or accept `currentColor` in code?
- Icon/Copy, Phone and External have descriptions saying "glyph name (_icons.scss)". Fine, but should the External description say `arrow-ext`?
