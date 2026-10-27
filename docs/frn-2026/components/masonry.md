# Masonry

**Layer:** Composite · **Status:** planned · **Figma:** (pattern) examples `2296:3415` (Artmaking row, desktop), `2305:7323` (Artmaking, tablet), `2341:9768` (an Artmaking image) · **Code:** `.masonry`, `.masonry>.card`

## Purpose

An image gallery for Artmaking: a grid of [Card](card.md)s, each holding one image, beside or under the project text in a [Split row](split-row.md). Figma can't hold a variable number of images, so it stays a frame of [Image](image.md) instances (decisions, Phase 17).

## Anatomy

- **Masonry** (`ul.masonry`): the grid.
- **Item** (`li.card`): one image as a **direct child**. The Card's full-bleed rule needs that, so the image sits flush with no padding.

## Props & variants

None. Item count is free. Each image keeps its own ratio.

## Layout

- **Desktop and tablet:** two columns, gap `space/xs` (Figma: 11.25 to 13.13).
- **Mobile:** one column.
- **Code:** `.masonry` is a grid, `1fr` by default. The fold to `1fr 1fr` is a `@container` query at `$bp-s`, against `main` (not the viewport). Because the container is `main`, it fires while the masonry itself is only about two thirds as wide.
- **Safari 26.4+:** `@supports (display: grid-lanes)` upgrades it to real masonry. The two-column template also defines the lanes. Short images pack under a tall neighbour. Elsewhere, rows align.
- **Never use `columns`.** WebKit's multicol balancer overshoots on `break-inside: avoid` cards, so one tall outlier gives one long column and a stub. Chromium hides this. Verify in Safari. `built-css.test.js` asserts it.
- **`.masonry` must keep `align-self: start`.** As a `.split-row` grid item it would otherwise stretch to the row height, and `align-content` defaults to stretch, so the rows spread apart. Also asserted.
- `align-items: start` keeps each card at its own height.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Column and row gap | `space/xs` | 11.25 → 13.13 |
| Image radius | `border-radius` | (see repo) |

Cards use `background-color: transparent` inside `.masonry`. Values from [`_tokens.md`](_tokens.md).

## States & interactions

None. Images load lazy (README, Images).

## Content rules

- Source: `src/_data/artProjects.json`, `images` per project, rendered by the `splitRow` macro (`_split-row.njk`). All sources are 800px wide.
- A project with no images renders no `ul`.

## HTML & accessibility

```html
<ul class="masonry">
  <li class="card"><img src="…" alt="…"></li>
</ul>
```

- A `ul`, so the number of images is announced. Every image needs alt text.

## Port notes

- Figma draws a row-aligned grid: row height equals the tallest image (decisions, Phase 17). The grid-lanes packing is a progressive upgrade, not a Figma difference.
- A stale comment in `_split-row.njk` (line 13) still says "multi-column packer". Update it.
- Figma's Artmaking row stacks text over images on desktop (Q25). Code folds by container, not by viewport.

## Open questions

- Should Figma draw the grid-lanes packing, or keep row-aligned rows as the baseline?
