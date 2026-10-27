# Writing item

**Layer:** Composite · **Status:** code · **Figma:** `2329:9102` · **Code:** `src/_includes/_writing-item.njk`, `.card.writing-item`

## Purpose

One row in a writing listing: a square thumbnail, the title, an optional source and a date. Default is used on the Ideas index (2 latest per type). Expanded is used on the per-type pages, where items run wider. In code Expanded is `.writing-item--compact` (G41).

## Anatomy

The whole row is one card link (`a.card.writing-item`).

- **Thumb**: exposed [Image](image.md) instance, Ratio 1:1, radius `border-radius-s`, no stroke. Code: `.writing-item__thumb`.
- **Body** (`.writing-item__body`):
  - **Title**: `site/body`. Code: `h3`.
  - **Meta**:
    - **Source** (`Show source`): label `site/small` in `neutral/900-alpha` plus an [Icon/External](icon.md) instance. Code: `small[data-icon="arrow-ext"]`.
    - **Date**: `site/small`, `neutral/900-alpha`. Code: `time > small`.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Layout | Default `2292:1415`, Expanded `2329:9090` | Thumb and Body column spans differ |
| Title | text | `Title` |
| Source | text | `Source` |
| Date | text | `Date`, e.g. "September 2026" |
| Show source | boolean, true | Off for on-site posts |

## Layout

Figma draws an 8-column grid with `space/s` gaps and padding (F38):

| Layout | Thumb | Body |
| --- | --- | --- |
| Default | columns 1–3 (span 3) | columns 4–8 (span 5) |
| Expanded | columns 1–2 (span 2) | columns 3–8 (span 6) |

Code does not use the 8-column grid (G21, G41). The thumb is fluid and scales with its container. The narrower thumb on tablet and mobile is intentional, so the text does not wrap onto too many lines.

- **One grid:** thumb `3fr` | body `5fr`. The thumb is a square that fills its column.
- **One `@container` rule** switches the grid to `1fr 3fr` when the row is narrow.
- **Type pages** add `.writing-item--compact`, which is always `1fr 3fr`.
- Thumb width is roughly 75 px on mobile, 150 px on `/writing/` desktop and 210 px on type pages.
- Which layout shows is chosen by the page, not by width: `writing.njk` uses Default, `writing-types.njk` adds `--compact`.
- Heights hug content: Default 174 at 437 wide (Q11, accepted).

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Card padding, grid gaps | `space/s` | 15 → 16.88 |
| Wrap gap | `space/s-m` | 15 → 25.31 |
| Body gap | `space/2xs` | 7.5 → 8.44 |
| Meta gap | `space/4xs` | 1.88 → 1.88 |
| Source ↔ icon | `space/2xs` | 7.5 → 8.44 |
| Source icon size | `type/small` | 12.5 → 14.06 |
| Title size | `step/0` | 15 → 16.88 |
| Card fill | `card-bg` | light-dark |
| Card radius | `border-radius-s` | style value |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

- Hover and focus: background becomes `--accent-surface` (`.writing-item:hover, :focus-visible`). `a.card` also lifts 1px on hover, 0 when pressed. Both transitions use `--dur-fast`, so they are instant under reduced motion.
- The source arrow is pinned (`--icon-gap: var(--space-4xs)`); it does not nudge, because it is inert text inside the link.

## Content rules

- From the `writing` collection: title, date, optional cover `image` and `alt`, and `external`+`source` for Substack items.
- No cover image: a build-picked translucent brand tint fills the square (`--thumb-fill`, from `thumbColor`).
- External items open in a new tab with `rel="noopener noreferrer"` and show the source label.

## HTML & accessibility

```html
<a class="card writing-item flow-row has-gap-s-m" href="…">
  <span class="writing-item__thumb"><img src="…" alt="…" loading="lazy"></span>
  <div class="writing-item__body flow has-gap-3xs">
    <h3>Title</h3><small data-icon="arrow-ext">Source</small>
    <time datetime="2026-09"><small>September 2026</small></time>
  </div>
</a>
```

- The tint placeholder is `aria-hidden`. A `<time>` carries the machine date.
- The link text is the title; the source label is read as part of it.

## Port notes

- Add a `compact` param to `writingItem` that adds `.writing-item--compact` (G41). Replace the fixed `--space-2xl` thumb with the fluid grid and its `@container` rule in `_responsive.scss`.
- Source icon: the repo glyph is `arrow-ext`; Figma now uses an Icon/External instance (F39). Same glyph.
- Thumb becomes an [Image](image.md) with ratio 1:1.
- **Ported (#32):** `.writing-item` is a `3fr 5fr` grid (gap `--space-s-m`); `@container (width < $bp-s)` and `.writing-item--compact` switch it to `1fr 3fr`. The thumb is `aspect-ratio: var(--ratio-1-1)` filling its column; the tint placeholder is unchanged. `writingItem(item, thumbColor, compact = false)`; type pages pass `compact = true`. Ideas' type sections sit on the [Section](section.md) grid (title | blurb, two latest items, "See all").

## Open questions

None. Settled in Phase 18 (G21, G41).
