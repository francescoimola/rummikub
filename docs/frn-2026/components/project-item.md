# Project item

**Layer:** Composite · **Status:** figma · **Figma:** `2292:1007` · **Code:** `src/_includes/_project-item.njk`, `.project-item`

## Purpose

One case-study listing row: image, title, services and an optional "Read case study" link. Used for the homepage Featured and Index sections and for the three projects on Collaborate.

## Anatomy

- **Media**: an exposed [Image](image.md) instance (Ratio 3:2) with `border-radius` and a `media-edge` stroke in `neutral/50-alpha` as overrides. Code: `a.project-item__media > img.project-item__img`.
- **Body** (`.project-item__body`):
  - **Title**: style `site/heading`. Code: `h2`.
  - **Services**: style `site/body`. Code: `p.project-item__services`.
  - **CTA** (`Show CTA`): "Read case study", style `site/link`, colour `color-accent`. Code: `a.project-item__cta`.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Layout | Split, Stacked | Split `2292:998`, Stacked `2292:999` |
| Title | text | Property `Title` |
| Services | text | Property `Services` |
| Show CTA | boolean, true | Off for projects with no page (`permalink: false`) |

The CTA label is not bound to a text property in Figma. The macro's label is fixed ("Read case study").

## Layout

- **Split** is a 2-column grid: Media left, Body right. **Stacked** is one column, Media then Body.
- In code both come from one `.project-item`. The fold is a container query against `main` at `$bp-l`, not a viewport breakpoint (`_responsive.scss`, block for `min-width: $bp-l`). Below it the item stacks.
- At `$bp-2xl` the body becomes a row: title left, CTA pushed to the far edge, `white-space: nowrap`. Figma doesn't draw this wide-body row; the Split frames show the vertical body.
- Frames: Split on 1512 and 834, Stacked on 390 (Q25: container-driven, frames are visual checks).

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Gap between Media and Body (both layouts) | `space/s` | 15 → 16.88 |
| Body gap (title, services, CTA) | `space/3xs` | 3.75 → 4.69 |
| Text size | `step/0` | 15 → 16.88 |
| Title letter spacing | `letter-spacing/xl` | style value |
| Image radius | `border-radius` | style value |
| Image edge | `media-edge` | 0.25 (= `--input-border-width` ÷ 4) |
| CTA colour | `color-accent` | page colour |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

- The link is the image and the CTA. Both use the global link hover and the `:focus-visible` ring. No card lift.
- Without a CTA the image is not wrapped in a link.

## Content rules

- `work.njk` passes `title`, `services`, `image`, `alt` and `url` from each project's frontmatter. `url` is empty for `permalink: false`, which drops both links.
- Featured is capped at 3; the Index holds the rest, `endDate` descending (AGENTS.md, Project structure).
- Services is one line of comma-separated disciplines, in `neutral/950-alpha` (not dimmed).

## HTML & accessibility

```html
<article class="project-item">
  <a class="project-item__media" href="/work/x/"><img class="project-item__img" src="…" alt="…"></a>
  <div class="project-item__body">
    <div class="flow has-gap-3xs"><h2>Title</h2><p class="project-item__services">Services</p></div>
    <a class="project-item__cta" href="/work/x/">Read case study</a>
  </div>
</article>
```

- One `<article>` per project; the title is an `<h2>`.
- The image link and the CTA go to the same URL. The image carries the alt text, so the CTA stays a plain text link.

## Port notes

- The image becomes an [Image](image.md) with a `ratio` of 3:2 (`aspect-ratio` + `object-fit: cover`).
- The existing `$bp-l` / `$bp-2xl` container folds already match Split / Stacked. Keep them.
- Optional: the CTA gets an arrow ([Icon/Arrow-right](icon.md)) if the design adds one. Figma has none today.

## Open questions

- Should the CTA carry [Icon/Arrow-right](icon.md), as other internal "more" links do (README, Cross-cutting behaviour)? Figma draws none.
- Figma's Split body is vertical at every width; the repo's title-left, CTA-right row at `$bp-2xl` isn't drawn. Keep it?
