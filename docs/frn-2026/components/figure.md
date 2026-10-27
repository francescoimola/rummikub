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

- A single figure is capped at `layout/content-width` (Phase 13) with `space/l` sides. A [Media pair](media-pair.md) also sits at content width (G13).
- The width and the scroll animation belong to the page (`.case-study` rhythm, `settle` / `breakout`; see Long-form pages in AGENTS.md), not to the component.
- **Scroll animation (G13):** `settle` stays on the hero media of case studies and writing posts. `breakout` never runs on case studies. It runs only on writing posts, and where a developer opts in with `view-animation="breakout"`.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Media ↔ caption | `space/2xs` | 7.5 → 8.44 |
| Caption size | `step/-1` | 11.25 → 12.66 |
| Caption colour | `neutral/900-alpha` | light-dark |
| Width cap | `layout/content-width` | 330 → 900 |
| Intro → first media | `space/xl-2xl` | 45 → 67.5 (Q26) |

Values from [`_tokens.md`](_tokens.md). `step/-1` replaces `font-size-7` (G12): the caption snaps to the nearest Utopia step.

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
- `breakout` stops on case studies, including where it is used today (G13).
- Caption CSS moves from `font-size-7` to `--step--1` (G12).

## Open questions

None. Settled in Phase 18 (G12, G13).
