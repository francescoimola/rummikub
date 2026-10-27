# Look toggles

**Layer:** Composite · **Status:** figma · **Figma:** `2353:19425` · **Code:** `src/_includes/_look-toggles.njk`, `.theme-switch`, `.brand-picker`

## Purpose

The visitor's two display choices in the [Header](header.md): light or dark theme, and the page colour (green, pink, orange). Used in every Header variant, inline on Wide and in the open panel on Narrow.

## Anatomy

A horizontal row of two groups, gap `space/l`:

- **Theme** (`.theme-switch`, `role="group"`): a bordered frame with **Button - Light** and **Button - Dark**. Each holds a 9 × 9 sun or moon vector. The active button is filled `neutral/950-alpha` with a `neutral/50` glyph.
- **Page colour** (`.brand-picker`, `role="group"`): **Button - Green**, **Pink**, **Orange**. Each is a square swatch. Green is filled `brand/150`.

## Props & variants

None. One component, no properties. The "To main site" link is not part of it (Q33); the Minimal header holds it beside the toggles.

## Layout

- Hugs (F44). The component width follows its content, so it does not stay at a fixed 205 px: it was about 170 to 205 px across modes in the file.
- The Page colour swatches are square and bound to `line-height/body`, so they scale with the type.
- The Theme group is a hug row, not a grid. It keeps its size across modes.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Theme ↔ Page colour gap | `space/l` | 30 → 33.75 |
| Theme inner gap | `space/3xs-2xs` | 3.75 → 8.44 |
| Theme frame padding | `space/4xs` | 1.88 → 1.88 |
| Theme button padding | `space/3xs` | 3.75 → 4.69 |
| Swatch ↔ swatch gap | `space/3xs` | 3.75 → 4.69 |
| Swatch size | `line-height/body` | 22.5 → 25.31 |
| Border weight | `input-border-width` | — |
| Border colour, Theme and unselected swatches | `neutral/500-alpha` | colour |
| Selected swatch border | `neutral/950-alpha` | colour |

Values from [`_tokens.md`](_tokens.md). Pink and Orange swatch fills are raw colours, on purpose: they preview other hues, which no variable holds.

## States & interactions

- **Selected:** Light and Green are drawn selected. Figma has no reactions here; state changes only by editing the layers.
- **In code:** `aria-pressed` marks the selection. The selected swatch gets a doubled ring, because a one-pixel colour change alone fails non-text contrast. In `forced-colors` the border widens.
- The choice sets `data-theme` and `data-brand` on `<html>` (CSS rules 4 and 9).

## Content rules

- Fixed set: Light, Dark, Green, Pink, Orange. A new colour needs a `--brand-hue-*` entry in `_colors.scss`, a swatch and an `aria-label`.
- The current page colour comes from `brand` front matter, default green.

## HTML & accessibility

```html
<div class="theme-switch" role="group" aria-label="Theme">
  <button type="button" data-theme-choice="light" aria-pressed="true" aria-label="Light">…</button>
  <button type="button" data-theme-choice="dark" aria-pressed="false" aria-label="Dark">…</button>
</div>
<div class="brand-picker" role="group" aria-label="Page colour">
  <button type="button" data-brand-choice="green" aria-pressed="true" aria-label="Green"></button> …
</div>
```

- Every button is a real `<button>` with `aria-label` (the glyphs and swatches carry no text).
- Tab order: Light, Dark, Green, Pink, Orange. The invisible hit-area rule extends tap targets.

## Port notes

- The markup and CSS already match Figma. The change is where it sits: inside the new top bar, and in the Minimal header (see [Header](header.md)).
- The theme icons are `sun.svg` and `moon.svg` in `src/assets/icons/`, inlined by the `icon` shortcode.
- Swatch fills in CSS are computed from `--brand-hue-*`; keep that formula in sync with `_colors.scss`.

## Open questions

- Should the Theme group scale with the type like the swatches do? Its buttons use a fixed 9 px glyph in Figma, while code sizes the glyph with `--space-s-m`.
