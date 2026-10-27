# Media pair

**Layer:** Composite · **Status:** planned · **Figma:** (pattern) examples `2300:10144` (The Loft, desktop), `2344:10024` (The Loft, tablet), `2344:10761` (The Loft, mobile), `2327:9733` (writing post) · **Code:** `.grid-cols-2-fixed`

## Purpose

Two [Figure](figure.md)s side by side in a long-form post. Used twice in The Loft and twice in the flyer guide (12 frames over the three sizes). Media pairs stay full-bleed grids, while single media are capped at `layout/content-width` (decisions, Phase 15).

## Anatomy

- **Media pair**: a grid of two columns.
- **Figure** ×2 (`Type=Image` or Video): media plus optional caption.

## Props & variants

None. Each Figure keeps its own ratio, so pairs can differ (2:1 beside 16:9), and the row is as tall as the tallest figure.

## Layout

- **Desktop and tablet:** two equal columns.
- **Mobile:** one column, the second figure below the first.
- Figma changes the mode (tablet 2-up, mobile 1-up). In code today `.grid-cols-2-fixed` is `1fr 1fr` at every width, so it never stacks. The stacked form needs a fold: a `@container` at `$bp-s` in `_responsive.scss` (Q25).

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Column gap | `space/s` | 15 → 16.88 |
| Padding inline | `space/l` (desktop and tablet), 0 on mobile | 30 → 33.75 |
| Padding block | `space/xl-2xl` | 45 → 67.5 |
| Row gap (mobile) | `space/s` | 15 → 16.88 |
| Figure inner gap | `space/2xs` | 7.5 → 8.44 |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

Each figure scrolls in with `breakout` (README, Scroll animation). A video follows the Videos rule.

## Content rules

- In a post, use two `figureImg` calls inside a wrapper (not markdown `![]()`), or a `mediaPair` shortcode (not built).
- Pair figures of similar weight. Captions are optional and per figure.

## HTML & accessibility

```html
<div class="grid-cols-2-fixed has-gap-s">
  <figure>…<figcaption>…</figcaption></figure>
  <figure>…</figure>
</div>
```

- Each `figure` has its own alt text. The grid adds no semantics.

## Port notes

- `.grid-cols-2-fixed` is also used on About (profile) and Collaborate. The name says "fixed", so add the mobile fold in a **separate** class (e.g. `.media-pair`) to avoid changing those.
- Figma frames named `Frame 2` and `Frame 3` on The Loft are the same pattern; they should be named `Media pair`.
- The post-media rhythm still keys off `.case-study__intro` (AGENTS.md, Long-form pages).

## Open questions

- New `.media-pair` class with a fold, or add the fold to `.grid-cols-2-fixed` and fix About and Collaborate?
- Add a `mediaPair` shortcode, or keep the wrapper in the markdown?
