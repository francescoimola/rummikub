# Carousel

**Layer:** Section · **Status:** code · **Figma:** `2299:3910` · **Code:** (none yet)

## Purpose

The homepage Explorations carousel. Explorations are self-initiated or experimental work with no client attached (GLOSSARY). Six images on a 3:2 viewport with previous and next controls. There are no pages behind the slides (Phase 9). Used once, on the homepage.

## Anatomy

- **Track**: a clipped strip of six [Image](image.md) instances (Ratio 3:2), named "Slide 1 (Open Art Folke)" … "Slide 6 (New Alumni '19)". The Track and slides use SCALE constraints, so one component works at every width.
- **Controls**: an overlay that follows the carousel size.
  - **Previous button**: [Icon/Arrow-right](icon.md) rotated 180°.
  - **Next button**: Icon/Arrow-right.
  - Both sit on a `content-light` fill.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Slide | 1, 2, 3, 4, 5, 6 | One variant per slide: the Track is offset to show that slide |

- Placeholder images stand in (Open Art Folke, Make & Mind, concert photo, Three Years, OAF leaflet, New Alumni '19). The real set comes from the data file (G15).
- Instances: 900×600 on 1512, 774×516 on 834, 345×230 on 390.

## Layout

None, fluid only. The viewport keeps a 3:2 ratio at any width. In code: `aspect-ratio: 3 / 2` on the viewport, the track as a horizontal strip. Slides crop to 3:2 (`object-fit: cover`), the one exception to "natural ratio", so CMS uploads of any shape line up (G45).

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Control button padding | `space/xs` | 11.25 → 13.13 |
| Gap between buttons | `space/2xs` | 7.5 → 8.44 |
| Controls inset | `space/3xs-m` | 3.75 → 25.31 |
| Arrow size | `step/0` | 15 → 16.88 (Q40) |
| Button fill | `content-light` | light-dark |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

- **Next / Previous:** click moves to the adjacent slide. In Figma this is CHANGE_TO with smart animate (ease-in-out, 0.45s).
- In code (G14): CSS only, no JS. The track is a scroll-snap strip and the buttons are `::scroll-button(left)` and `::scroll-button(right)` on the scroll container. Browsers without `::scroll-button()` show no buttons, and the strip still swipes and scrolls. There is no wrap-around (G47). Slide 1 shows only Next, slide 6 shows only Previous, and slides in between show both. `::scroll-button()` is `:disabled` at either end, so hide it there: `::scroll-button(*):disabled { display: none }`.
- Under reduced motion the slide change is instant (`--dur-medium` is 0s; use `scroll-behavior: auto`).
- Controls take the global focus ring. Buttons need accessible names ("Previous image", "Next image").
- No autoplay is designed.

## Content rules

- Six slides, from `src/_data/explorations.json` (G15), each with `src` and `alt`. No links and no auto-advance.
- The file is **editable in Pages CMS**: add an `explorations` entry to `.pages.yml` as a list file, like `artProjects` (a top-level array, `list: true`, fields directly under the entry).
- Uploads can be any shape; the 3:2 crop handles them (G45).

## HTML & accessibility

```html
<section class="carousel" aria-roledescription="carousel" aria-label="Explorations">
  <ul class="carousel__track"> <li aria-roledescription="slide"><img src="…" alt="…"></li> … </ul>
</section>
```

- The track is scrollable by touch, trackpad and keyboard (focusable region), so it still works where `::scroll-button()` is unsupported.
- `::scroll-button()` generates buttons with the accessible names set by `content` alternative text ("Previous image", "Next image"), so the markup above has no `<button>` elements.
- Previous reuses the arrow glyph rotated 180° with CSS.

## Port notes

- No repo counterpart. Add `src/_includes/_carousel.njk` (macro `carousel`) and `.carousel*` in `_components.scss`. No JS file (G14, AGENTS.md rule 10).
- Add `src/_data/explorations.json` and its `.pages.yml` entry (G15).
- Controls previously bound a remote library; they now use local `space/xs` and `Icon/Arrow-right` (F19, F40).
- Slide images use [Image](image.md) with `ratio` 3:2 (G45).
- **Ported (#30):** `_carousel.njk` exports `carousel(slides, label)`; `.carousel*` lives in `_components.scss`. The track (`ul`, `tabindex="0"`) is the 3:2 viewport and scroll-snap container; slides crop with `object-fit: cover` in CSS rather than `ratio=`, since they are plain `<img>` from data. `::scroll-button(right|left)` use a text `→` (Previous rotated 180°) so the arrow follows `currentColor` on the `content-light` fill, named "Next image" / "Previous image", hidden when `:disabled`. Reduced motion sets `scroll-behavior: auto`. **Arrow (#57):** the `::scroll-button` content is the `arrow-right` glyph through `glyph-url()` in `_icons.scss` (no typed →); it is a fixed dark neutral because the chip is light in both themes.
- `explorations.json` starts with the six Figma placeholders, pointing at their existing repo files; new CMS uploads land in `src/assets/explorations` (the image transform reads them from there, so no passthrough is needed). Rendered on the homepage between Featured and Index (#33).

## Open questions

None. Settled in Phase 18 (G14, G15, G39, G45).
