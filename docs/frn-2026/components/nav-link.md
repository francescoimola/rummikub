# Nav link

**Layer:** Primitive · **Status:** figma · **Figma:** `2291:779` · **Code:** `src/_includes/_header.njk` (`<li><a>` in `.nav-menu__panel > ul`)

## Purpose

One item of the primary nav. Six instances sit in the [Header](header.md): Start here, Work with me, Ideas, Artmaking, About, Say hello. The Header's Full variants nest them, on Wide inline and on Narrow stacked in the open panel.

## Anatomy

- **Marker** (frame, 8 × 26): holds `•` (layer "Navigation Marker"), filled `accent-hover`. Hidden on Default.
- **Label**: text, style `site/body`, size `step/0`.

In code this is `<a>` in an `<li>`. The marker is a pseudo-element, not markup.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| State | Current (default), Default, Hover | Variant ID: `2291:774`, `2291:775`, `2294:3404` |
| Label | text, default "Start here" | Applies in all three states (the Hover label is bound since F37) |

- **Default:** marker hidden, label `neutral/950-alpha`.
- **Current** and **Hover** look the same: marker shown in the flow before the label, marker and label both `accent-hover`.
- The set's own padding (`space/l`) is only the board layout, not part of the component. The variants hug.

## Layout

None, fluid only. Each variant hugs its content. The gap between marker and label is `space/3xs`. The list spacing belongs to the [Header](header.md).

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Marker ↔ label gap | `space/3xs` | 3.75 → 4.69 |
| Font size | `step/0` | 15 → 16.88 |
| Label (Current, Hover), marker | `accent-hover` | colour |
| Label (Default) | `neutral/950-alpha` | colour |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

- **Hover:** Figma wires Default → Hover with `ON_HOVER`, change to, smart animate. In code (to build) the marker shows on `a:hover` and on `[aria-current="page"]`, with `--dur-fast`. Reduced motion: no transition.
- **Current:** set by the page, see the Header's content rules for which page marks which item.
- **Focus:** the global `:focus-visible` ring.

## Content rules

- Labels are fixed in the Header partial. Keep them short, one line.
- The current marker is not colour-only: it is the bullet plus `aria-current="page"`.

## HTML & accessibility

```html
<li><a href="/art/" aria-current="page">Artmaking</a></li>
```

- `aria-current="page"` goes on the link of the current page only.
- The bullet is decorative (`::before`, no text content).
- The link's accessible name is its label.

## Port notes

- Today's `_header.njk` has no marker. Add a `::before` bullet for `[aria-current="page"]` and `:hover`.
- The partial still lists "Case studies" and "Ideas & guides". The Header doc covers both.
- No new file: this stays inside `_header.njk` (a macro is optional).

## Open questions

- Should the hover bullet slide in (smart animate in Figma) or just appear? Figma animates, the repo has no motion on nav links today.
