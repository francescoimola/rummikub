# Data list

**Layer:** Composite · **Status:** planned · **Figma:** (pattern) examples `2275:1461` (Recognition item, About), `2304:4218` (tablet), `2304:4992` (mobile), `2275:1460` (the list) · **Code:** `.data-list`, `.data-list__item`, `.data-list__label`, `.data-list__value` in `_components.scss`

## Purpose

A label | value list. Used for About's Recognition: a year heading, then rows of award or publication names with the work they recognised.

## Anatomy

In Figma, a **Recognition item** has:

- **Year** (text): one narrow column.
- **Container** (vertical): **Award organization** (dimmed label), then one or more lines of detail text.

Today's code splits it differently: the year is an `h3` above each `dl`, and each row is a `div.data-list__item` with a `dt` (label) and `dd` (value). The port follows Figma (G38): a year column beside the label-over-value group.

## Props & variants

None. A value is one line or several lines (a column of `span`s).

## Layout

- **Figma layout (G38):** a year column beside a container, with the label (dimmed) above the value. Figma builds the item as a 5-column grid: the year takes 1 column and the container 4. Tablet and mobile keep that (year 35 wide).
- **Fold:** a `@container` rule (against the parent), not a viewport block (Q25, G38). The old `auto 1fr` subgrid and the narrow "label above value" `_responsive.scss` block go.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Item gap | `space/xs` (repo `--space-xs`) | 11.25 → 13.13 |
| List gap (Figma Container) | `space/s` | 15 → 16.88 |
| Label colour | `neutral/800-alpha` | n/a |
| Year colour | `neutral/900-alpha` | n/a |
| Value colour | `neutral/950-alpha` | n/a |
| Label min width | `10rem` (repo only) | n/a |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

None. Any link in a value uses global link styles.

## Content rules

- Source: inline in `about.njk`. Years run newest first. Values read "Title | Type".
- Several values for one label are separate `span`s in a column (`style="flex-direction: column"` inline today).

## HTML & accessibility

```html
<dl class="data-list">
  <div class="data-list__item">
    <dt class="data-list__year dimmed">2026</dt>
    <dd class="data-list__body">
      <span class="data-list__label">CSS Design Awards</span>
      <span class="data-list__value">Public Award for Best UI, UX & Innovation</span>
    </dd>
  </div>
</dl>
```

- A `dl` with `div` groups is valid HTML and keeps term and description paired.
- The markup above is a sketch of the Figma layout; the final class names are set at the port. Keep term and description paired.

## Port notes

- Figma's layout (year column | label over value) replaces the repo's (year heading above, label | value row) (G38). Rework `about.njk` and `.data-list*` to match.
- Move the inline `style="flex-direction: column; gap…"` into a `.data-list__value--stack` modifier.
- The 10rem label width is a raw rem, fine under CSS rule 5.

## Open questions

None. Settled in Phase 18 (G38).
