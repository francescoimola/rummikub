# Image

**Layer:** Primitive · **Status:** figma · **Figma:** `2341:9739` · **Code:** `<img>` via `figureImg`, `aspect-ratio` (planned `ratio=`)

## Purpose

Every content image on the site. The variant picks the crop. Other components ([Project item](project-item.md), [Writing item](writing-item.md), [Figure](figure.md), [Carousel](carousel.md), [Split row](split-row.md)) expose an Image instance so the crop is one dropdown.

## Anatomy

- **Root**: vertical auto layout, hug height, fill width.
- **Media**: a rectangle, fill width, locked aspect ratio, placeholder fill `neutral/200`. The photo is the Media fill override. Code: `img` with `object-fit: cover`.

Radius and stroke are overrides per placement, not part of the component: Project item uses `border-radius` + a `media-edge` stroke in `neutral/50-alpha`, Writing item uses `border-radius-s` with no stroke.

## Props & variants

| Ratio | CSS | Use |
| --- | --- | --- |
| 3:2 (default) | `3 / 2` | Project item, Carousel, Figure, most photos |
| 2:1 | `2 / 1` | Wide art |
| 1:1 | `1 / 1` | Writing thumb |
| 4:3 | `4 / 3` | |
| 16:9 | `16 / 9` | Video posters |
| 2:3 | `2 / 3` | Portrait |
| 3:4 | `3 / 4` | Portrait |
| 9:16 | `9 / 16` | Portrait |

The first five are the most used in the survey (110, 53, 21, 19, 8 images); the portraits are their uprights (Phase 13).

## Layout

None, fluid only. Width comes from the parent (Figma's 300 is a placeholder); height follows the ratio.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Placeholder fill | `neutral/200` | light-dark |

Radius, stroke and size come from the parent component. Code tokens (names TBD, Phase 13): `--ratio-square`, `--ratio-classic`, `--ratio-photo`, `--ratio-wide`, `--ratio-pano`.

## States & interactions

None. Loading is lazy (README, Cross-cutting behaviour).

## Content rules

- `ratio` is optional. Left out, the build picks the nearest of the five from the source size.
- `artProjects.json` images gain a `ratio` field.
- Alt text is required, as today.

## HTML & accessibility

```html
<img src="…" alt="…" style="aspect-ratio: 3 / 2" loading="lazy" decoding="async">
```

- Decorative images use `alt=""`.
- `object-fit: cover` crops from the centre; `position=` (object-position) overrides it.

## Port notes

- Add `ratio=` to `figureImg` and `projectVideo` in `src/config/eleventy/shortcodes.js` (the shortcodes live there, not in `eleventy.config.js`).
- Add the ratio tokens and set `aspect-ratio` + `object-fit: cover` on content images.
- The writing-post `max-block-size: 50cqw` rule (`_components.scss` `.writing-post .case-study__intro+figure img`) goes away.

## Open questions

- Token names for the five ratios.
- Should the build compute the default from the source size, or should every image state a ratio?
