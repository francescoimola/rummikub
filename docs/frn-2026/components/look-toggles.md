# Look toggles

**Layer:** Composite · **Status:** code · **Figma:** `2353:19425` · **Code:** `src/_includes/_look-toggles.njk`, `.brand-picker`

## Purpose

The visitor's display choice in the [Header](header.md): the page colour (green, pink, orange). Light or dark follows the OS; the light/dark switch was removed because it made Safari 26 drop its toolbar tint when it disagreed with the Mac. Used in every Header variant, inline on Wide and in the open panel on Narrow.

## Anatomy

One group:

- **Page colour** (`.brand-picker`, `role="group"`): **Button - Green**, **Pink**, **Orange**. Each is a square swatch. Green is filled `brand/150`.

## Props & variants

None. One component, no properties. The "To main site" link was never part of it (Q33), and left with the Minimal header (G52).

## Layout

- Hugs (F44). The component width follows its content, so it does not stay at a fixed 205 px: it was about 170 to 205 px across modes in the file.
- The Page colour swatches are square and bound to `line-height/body`, so they scale with the type.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Swatch ↔ swatch gap | `space/3xs` | 3.75 → 4.69 |
| Swatch size | `line-height/body` | 22.5 → 25.31 |
| Border weight | `input-border-width` | — |
| Border colour, unselected swatches | `neutral/500-alpha` | colour |
| Selected swatch border | `neutral/950-alpha` | colour |

Values from [`_tokens.md`](_tokens.md). Pink and Orange swatch fills are raw colours, on purpose: they preview other hues, which no variable holds.

## States & interactions

- **Selected:** Green is drawn selected. Figma has no reactions here; state changes only by editing the layers.
- **In code:** `aria-pressed` marks the selection. The selected swatch gets a doubled ring, because a one-pixel colour change alone fails non-text contrast. In `forced-colors` the border widens.
- The choice sets `data-brand` on `<html>` (CSS rules 4 and 9).

## Content rules

- Fixed set: Green, Pink, Orange. A new colour needs a `--brand-hue-*` entry in `_colors.scss`, a swatch and an `aria-label`.
- The current page colour comes from `brand` front matter, default green.

## HTML & accessibility

```html
<div class="brand-picker" role="group" aria-label="Page colour">
  <button type="button" data-brand-choice="green" aria-pressed="true" aria-label="Green"></button> …
</div>
```

- Every button is a real `<button>` with `aria-label` (the swatches carry no text).
- Tab order: Green, Pink, Orange. The invisible hit-area rule extends tap targets.

## Port notes

- **Figma catch-up owed:** the Theme group (sun and moon) is still in the Figma component and must be deleted to match the code.
- **Ported (#22, #23):** one instance in `.nav-menu__toggles`, in the header on every page (see [Header](header.md)).
- Swatch fills in CSS are computed from `--brand-hue-*`; keep that formula in sync with `_colors.scss`.

## Open questions

None. Settled in Phase 18 (G7).
