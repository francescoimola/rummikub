# Figure

**Layer:** Composite · **Status:** figma · **Figma:** `2355:19174` · **Code:** `figureImg` / `projectVideo` in `src/config/eleventy/shortcodes.js`, `figure`

## Purpose

Body media with an optional caption, in posts, case studies and service pages. Image is a still; Video is a looping, muted clip.

## Anatomy

- **Media**: an exposed [Image](image.md) instance (Ratio 3:2).
  - Video only: **Play control** (hidden by default, `Show control`), a disc and a play glyph. Code: `button.project-video-play`.
- **Caption** (`Show caption`): `site/figcaption`, `neutral/900-alpha`. Code: `figcaption`.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Type | Image `2355:19161`, Video `2355:19166` | |
| Caption | text | |
| Show caption | boolean, true | |
| Show control | boolean, false | Video only |

- Video is never used on a page today (F42), but is kept (Q30).
- Maps to shortcode options: `figureImg src, alt, caption=, href=, class=, imgClass=, position=`; `projectVideo src, alt, webm=, poster=, caption=, class=`.

## Layout

- A single figure is capped at `layout/content-width` (Phase 13) with `space/l` sides. In a [Media pair](media-pair.md) the figures sit in a full-bleed 2-column grid.
- The width and the scroll breakout belong to the page (`.case-study` rhythm, `settle` / `breakout`; see Long-form pages in AGENTS.md), not to the component.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Media ↔ caption | `space/2xs` | 7.5 → 8.44 |
| Caption size | `font-size-7` | 12.75 → 15 |
| Caption colour | `neutral/900-alpha` | light-dark |
| Width cap | `layout/content-width` | 330 → 900 |
| Intro → first media | `space/xl-2xl` | 45 → 67.5 (Q26) |

Values from [`_tokens.md`](_tokens.md). `font-size-7` is an odd name for the figcaption size (`figcaption` in the token table).

## States & interactions

- **Video:** lazy, autoplay in view, muted, loops; pauses when scrolled away. The play control is visible only under the conditions in AGENTS.md (Project videos) and takes keyboard focus. Reduced motion gets no autoplay.
- Image: none, unless `href` wraps it in an external link (`target="_blank" rel="noopener noreferrer"`).
- Disc and glyph are raw black / white in Figma (the repo disc is `rgba(0,0,0,0.45)`).

## Content rules

- Always `figureImg` for body images, never markdown `![]()` (AGENTS.md).
- Empty caption: no `figcaption` is emitted.
- A video needs a poster to avoid a blank frame while deferred.

## HTML & accessibility

```html
<figure class="extra">
  <img src="…" alt="…">
  <figcaption>Caption</figcaption>
</figure>
```

- `figure` + `figcaption` give the caption its association. Video has `aria-label` = alt.
- The play button has `aria-label="Play video"`.

## Port notes

- Add `ratio=` to both shortcodes ([Image](image.md)).
- The shortcodes are in `src/config/eleventy/shortcodes.js` and `render-helpers.js`, not `eleventy.config.js`.
- Phase 12 media-pair rule replaces the scroll breakout for consecutive media unless Francesco keeps both.

## Open questions

- Rename `font-size-7` to something descriptive?
- Keep both the pair-grid and the scroll breakout, or only the grid (Phase 12)?
