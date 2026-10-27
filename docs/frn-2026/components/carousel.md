# Carousel

**Layer:** Section · **Status:** figma · **Figma:** `2299:3910` · **Code:** (none yet)

## Purpose

The homepage Explorations carousel: six images on a 3:2 viewport with previous and next controls. There are no pages behind the slides (Phase 9). Used once, on the homepage.

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

- Placeholder images stand in (Open Art Folke, Make & Mind, concert photo, Three Years, OAF leaflet, New Alumni '19). The real set is TBD.
- Instances: 900×600 on 1512, 774×516 on 834, 345×230 on 390.

## Layout

None, fluid only. The viewport keeps a 3:2 ratio at any width. In code: `aspect-ratio: 3 / 2` on the viewport, the track as a horizontal strip.

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

- **Next / Previous:** click moves to the adjacent slide and wraps (6 → 1, 1 → 6). In Figma this is CHANGE_TO with smart animate (ease-in-out, 0.45s).
- In code: scroll-snap on the track, buttons calling `scrollBy` / `scrollTo`. This needs a small script, which AGENTS.md rule 10 allows only after Francesco agrees.
- Under reduced motion the slide change is instant (`--dur-medium` is 0s; use `scroll-behavior: auto`).
- Controls take the global focus ring. Buttons need accessible names ("Previous image", "Next image").
- No autoplay is designed.

## Content rules

- Slide images and alt text come from a data file (e.g. `src/_data/explorations.json`), each with `src` and `alt`. Name the file when it is built.
- Six slides today. Fewer than two slides hides the controls.

## HTML & accessibility

```html
<section class="carousel" aria-roledescription="carousel" aria-label="Explorations">
  <ul class="carousel__track"> <li aria-roledescription="slide"><img src="…" alt="…"></li> … </ul>
  <div class="carousel__controls">
    <button type="button" aria-label="Previous image" data-icon="arrow-right"></button>
    <button type="button" aria-label="Next image" data-icon="arrow-right"></button>
  </div>
</section>
```

- The track is scrollable by touch, trackpad and keyboard (focusable region), so it still works if the buttons fail.
- Previous reuses the arrow glyph rotated 180° with CSS.

## Port notes

- No repo counterpart. Add `src/_includes/_carousel.njk` (macro `carousel`) and `.carousel*` in `_components.scss`.
- Controls previously bound a remote library; they now use local `space/xs` and `Icon/Arrow-right` (F19, F40).
- Slide images use [Image](image.md) with `ratio` 3:2.

## Open questions

- The code needs a new JS file for the buttons. Approval needed (AGENTS.md rule 10), or ship scroll-snap with no buttons?
- Where do the real slides live, and how many?
- Should the slides link anywhere? Figma has no links.
- Is there an auto-advance? Figma shows none; assumed no.
