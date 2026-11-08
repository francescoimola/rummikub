# Artmaking page

Each project is a `.split-row` `<article>`: a `.split-row__text` block (title | description + dimmed year + link, 2-up from a `@container` at `$bp-split`) at content width, then a `ul.grid-cols-2.split-row__images` of `.card` `<li>`s spanning the full-width page (Q25, G24). Folds live in `_responsive.scss`.

- **Plain grid, no masonry (G37).** Images keep their natural ratio; `align-items: start` stops them stretching, and `align-self: start` stops `.split-row` stretching the grid (its rows would spread apart). `artProjects.json` has no `ratio` field (G43).
- **The image is a direct child of `.card`.** That is what triggers `.card`'s full-bleed rule, so images sit flush with no padding. Wrapping it in anything re-introduces the card padding.

Add new projects to `src/_data/artProjects.json`; `year`, `link`, `linkLabel` and `images` are all optional (an empty year renders nothing).
