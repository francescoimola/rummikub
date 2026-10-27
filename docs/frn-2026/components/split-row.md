# Split row

**Layer:** Composite · **Status:** figma · **Figma:** `2357:19451` · **Code:** `src/_includes/_split-row.njk`, `.split-row` + [`.masonry`](masonry.md)

## Purpose

One Artmaking project: a text block (title, description, year, link) and its images. The doc covers the **whole row**; the Figma component draws only the text half (Q9, F04).

## Anatomy

An `<article class="split-row">`:

- **Text** (`div.flow`, the Figma component):
  - **Project title**: `site/heading`. Code: `h2`.
  - **Project description**: a vertical group.
    - Description: `site/body`. Code: `p`.
    - Year: `site/body`, `neutral/900-alpha`. Code: `p.dimmed`.
    - **Link** (`Show link`): an [Icon link](icon-link.md) instance, Icon/External, label "Visit the artwork". Code: `a[data-icon="arrow-ext"]`.
- **Images** (not in the component): a [Masonry](masonry.md) of [Image](image.md) instances, `ul.masonry > li.card`. Figma components can't hold a variable image count, so pages put loose Image instances beside the text.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Layout | Split `2357:19443`, Stacked `2357:19450` | |
| Title | text | |
| Description | text | |
| Year | text | Empty year shows an empty line today; hide it (F10) |
| Show link | boolean, true | Link label is a property of the nested Icon link |

## Layout

- **Figma Split:** title left, description group right (2 columns, `space/xs` gaps). Used on 1512 and 834. **Stacked:** one column, used on 390.
- **Desktop row (Q25):** the text sits **above** the images, which is the new design. The repo today puts text left and images right at `1fr 2fr`. Port as an intrinsic grid or container query, not a viewport breakpoint.
- Today's `.split-row` is a single column that becomes `1fr 2fr` from a `@container` at `$bp-xl` (`_responsive.scss`). Under Q25 that second fold is replaced by the above-the-images layout; the title / description 2-column split inside the text block follows the container width.
- Tablet: Figma shows Split on 834 where the repo stacks below `$bp-xl` (F11). The container query settles it.
- The masonry has its own fold: 2 columns from `$bp-s`, `grid-lanes` in Safari 26.4+. Keep `align-self: start` (AGENTS.md, Artmaking page).

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Text block grid gap | `space/xs` | 11.25 → 13.13 |
| Description group gap | `space/2xs` | 7.5 → 8.44 |
| Link ↔ icon | `space/2xs` | 7.5 → 8.44 |
| Text size | `step/0` | 15 → 16.88 |
| Year colour | `neutral/900-alpha` | light-dark |
| Row ↔ images gap (repo) | `--space-s-xl` | `.split-row` gap |

Values from [`_tokens.md`](_tokens.md). The row gap is the repo's, not a Figma binding of this component.

## States & interactions

Only the link: global link style, and the arrow nudge from [Icon link](icon-link.md). Masonry images are static.

## Content rules

- From `src/_data/artProjects.json`: `title`, `description`, `year`, optional `link`, `linkLabel`, `images` (`src`, `alt`, later `ratio`).
- `linkLabel` defaults to "Visit " + title. Figma's example label is "Visit the artwork".
- External links open in a new tab; `/writing/…` links stay in place.
- No `images`: the masonry is omitted and the row is text only.

## HTML & accessibility

```html
<article class="split-row">
  <div class="flow has-gap-2xs">
    <h2>Title</h2><p>Description</p><p class="dimmed">2021</p>
    <a href="…" data-icon="arrow-ext" target="_blank" rel="noopener noreferrer">Visit the artwork</a>
  </div>
  <ul class="masonry"><li class="card"><img src="…" alt="…"></li> … </ul>
</article>
```

- One `<h2>` per `<article>`. The image is a direct child of `.card` (full-bleed rule).
- The year reads as text; keep it as plain text.

## Port notes

- Rework `.split-row` so the text sits above the images at desktop widths (Q25, F11). Remove or replace the `$bp-xl` `1fr 2fr` block in `_responsive.scss`.
- Images gain `ratio` ([Image](image.md)).
- Year uses `site/body` in Figma; the repo uses `.dimmed`.

## Open questions

- With text above the images, does the description group still sit beside the title on desktop (as Split draws it), or stack under it?
- Year uses `site/body` in Figma, not `site/small`. Intended?
