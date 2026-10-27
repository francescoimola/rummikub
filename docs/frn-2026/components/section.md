# Section

**Layer:** Section · **Status:** planned · **Figma:** (pattern) examples `2275:1403` (About), `2275:1830` (Work with me), `2275:2290` (Ideas), `2275:1911` (Work with me, vertical) · **Code:** `<section>`, `.flow`, `h2.highlight-header`

## Purpose

The page's basic block: a **label** on one side and **content** on the other. Used on About, Work with me, Ideas, Collaborate and both service pages. Q37: the Figma frames are built three ways (F27) and stay as they are. This doc defines the single construction code uses.

## Anatomy

- **Section** (`section`): two columns, label | content.
- **Label**: a [Section heading](section-heading.md) (Highlighted or Plain).
- **Content**: a vertical stack of text, [Figure](figure.md)s, [Card](card.md)s, [Ordered list](ordered-list.md)s or [Data list](data-list.md)s.

## Props & variants

None. The label style is Section heading's `Style`.

How Figma builds it today (do not copy):

| Build | Where | Example |
| --- | --- | --- |
| Grid, 2 columns | About, Work with me, Collaborate, service pages (D and T) | `2275:1403`, `2275:1830` |
| Horizontal | Ideas (D and T) | `2275:2290` |
| Vertical | Mobile everywhere; Work with me `2275:1911`; Consultations tablet "Is this for me?" | `2275:1911` |

## Layout

- **Wide:** label left, content right, as two columns. The section is `layout/content-width` (900). The content column is about 437 wide on About and Work with me (the second half minus the gap).
- **Narrow:** label above content, stacked. In Figma this is the mobile frames.
- **Code:** one grid, `grid-template-columns: 1fr` that becomes `repeat(2, 1fr)` from a `@container` at `$bp-s`, in the same family as `.grid-responsive-cols` (stacked → two columns). A container query, not a viewport query (Q25). Add the fold to `_responsive.scss`.
- The Consultations tablet frame keeps the label above two cards. Treat as a content choice, not a second construction.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Column / row gap | `space/s` everywhere (G31) | 15 → 16.88 |
| Width | `layout/content-width` | 330 → 900 |
| Content stack gap | `space/s` | 15 → 16.88 |

Values from [`_tokens.md`](_tokens.md). The gap was `space/3xs-m` on About in Figma; it becomes `space/s` like Work with me (G31).

## States & interactions

None.

## Content rules

- Label is a short title. Content order is fixed by the page.
- Ideas' type sections (title | list) use the same grid (G33).
- Sections nest only one level: a section's content never holds another section.
- A section with no label (404 body) is a single column.

## HTML & accessibility

```html
<section class="section">
  <h2 class="highlight-header">What you get</h2>
  <div class="flow has-gap-s"> … </div>
</section>
```

- Source order is label then content, so the stacked and two-column forms read the same. Do not reorder visually.
- Each section has one `h2`.

## Port notes

- Today `<section>` is a `.flow` column with the `h2` above its content at every width (`studio.njk`, `design.njk`). Wide is new: add a `.section` class (or reuse `.grid-responsive-cols`) with the label in the first column.
- Remove inline spacing like `has-mb-xs` on the `h2`. The grid gap replaces it.
- Rebind About's gap to `space/s` in Figma (G31). Move the Ideas type sections onto the Section grid (G33).
- The `.flow` rule inside a grid needs `align-items: stretch` (see the comment above `.grid-responsive-cols`).

## Open questions

None. Settled in Phase 18 (G31, G32, G33).
