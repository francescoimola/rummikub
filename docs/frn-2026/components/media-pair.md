# Media pair

**Layer:** Composite · **Status:** code · **Figma:** (pattern) examples `2300:10144` (The Loft, desktop), `2344:10024` (The Loft, tablet), `2344:10761` (The Loft, mobile), `2327:9733` (writing post) · **Code:** `.grid-cols-2` (renamed from `.grid-cols-2-fixed`, G42) + `{% mediaPair %}`

## Purpose

Two [Figure](figure.md)s side by side in a long-form post. Used twice in The Loft and twice in the flyer guide (12 frames over the three sizes). A pair sits at content width, like single media (G13; earlier decisions had it full-bleed).

## Anatomy

- **Media pair**: a grid of two columns.
- **Figure** ×2 (`Type=Image` or Video): media plus optional caption.

## Props & variants

None. Each Figure keeps its own ratio, so pairs can differ (2:1 beside 16:9), and the row is as tall as the tallest figure.

## Layout

- **Desktop and tablet:** two equal columns.
- **Mobile:** one column, the second figure below the first.
- Figma changes the mode (tablet 2-up, mobile 1-up). The existing two-column class, `.grid-cols-2-fixed`, was `1fr 1fr` at every width and never stacked. It is renamed `.grid-cols-2` and stacks below a `@container` fold (`$bp-s`, in `_responsive.scss`; G36, G42, Q25). About and Collaborate change with it.

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

No `breakout`: a pair sits at content width (G13). A video follows the Videos rule.

## Content rules

- Author a pair with the paired shortcode `{% mediaPair %}` (G40), defined in `src/config/eleventy/shortcodes.js`. It wraps two figures. Never markdown `![]()`.
- Pair figures of similar weight. Captions are optional and per figure.

## HTML & accessibility

```html
<div class="grid-cols-2 has-gap-s">
  <figure>…<figcaption>…</figcaption></figure>
  <figure>…</figure>
</div>
```

- Each `figure` has its own alt text. The grid adds no semantics.

## Port notes

- Rename `.grid-cols-2-fixed` to `.grid-cols-2` everywhere (G42) and add the container fold so it stacks (G36). About (profile) and Collaborate use it, so they stack too.
- Add the `mediaPair` paired shortcode to `src/config/eleventy/shortcodes.js` (G40, approved).
- Figma frames named `Frame 2` and `Frame 3` on The Loft are the same pattern; they should be named `Media pair`.
- The post-media rhythm still keys off `.case-study__intro` (AGENTS.md, Long-form pages).
- **Ported (#25):** `{% mediaPair %}…{% endmediaPair %}` renders `<div class="grid-cols-2 media-pair">` (gap `--space-s`), stacking below `@container (min-width: $bp-s)`. The `.case-study` rhythm treats `.media-pair` as media. Used on The Loft (two pairs; the Ritual mobile walkthrough now follows the second pair) and the flyer guide (two pairs).

## Open questions

None. Settled in Phase 18 (G13, G36, G40, G42).
