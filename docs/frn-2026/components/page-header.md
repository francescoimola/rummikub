# Page header

**Layer:** Section · **Status:** figma · **Figma:** `2357:19433` · **Code:** `src/_includes/_page-header.njk`, macro `pageHeader(iconName, label, blurb)`

## Purpose

The hero at the top of the section pages: an illustration over a large centred heading, on a `brand/150` band. 18 instances across six pages (3 frame sizes each): Work with me, Ideas & guides, Artmaking, 404, Web design, Website consultations.

## Anatomy

- **Illustration**: an [Illustration/*](illustration.md) instance, height `size/hero-illustration`. Exposed through the Illustration swap.
- **Introduction**: the heading. Text style `site/hero`, KC Pelletier Sans, size `step/2-4`, centred, max width `layout/content-width`.
- **Blurb**: a `site/body` line, hidden by default.

Code: `<header class="page-header">` with the illustration, an `<h1>` and a `<p>`.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Illustration | instance swap, default `Illustration/deskgarden` | Four hero drawings (preferred values set) |
| Heading | text | The page's `<h1>` |
| Blurb | text, default "For small businesses and social enterprises" | |
| Show blurb | boolean, default false | Off on all instances (matches the current heroes) |

No variants.

## Layout

None, fluid only. A vertical stack, centred, gap `space/2xl-3xl`. The heading width is capped by `layout/content-width` (900 at Max, 330 at Min).

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Padding block | `space/2xl-3xl` | 60 → 101.25 |
| Padding inline | `space/xl-2xl` | 45 → 67.5 |
| Illustration ↔ heading gap | `space/2xl-3xl` | 60 → 101.25 |
| Illustration height | `size/hero-illustration` | 154 → 220 |
| Heading size | `step/2-4` | 26.65 → 53.28 |
| Heading max width | `layout/content-width` | 330 → 900 |
| Blurb size | `step/0` | 15 → 16.88 |
| Fill | `brand/150` | colour |

Values from [`_tokens.md`](_tokens.md). `step/2-4` is the new section-hero pair (Q20).

## States & interactions

Static. The band enters with `view-animation="settle"` and the first media after it follows the usual rhythm (README, Cross-cutting behaviour). Reduced motion: no animation.

## Content rules

- Heading, blurb and drawing come from the page: `pageHeader(icon, label, blurb)`.
- The 404 and Artmaking headings are long sentences. Keep the heading to a few lines at 900 wide.
- Blurb is optional, off by default. A page that sets one turns Show blurb on.
- Heading text starts lowercase on Work with me ("break free …") and ends with a stray space before the full stop ("Together ."). Fix the copy in Figma, not in code.

## HTML & accessibility

```html
<header class="page-header" view-animation="settle">
  <svg aria-hidden="true" …>…</svg>
  <h1>Unapologetically simple websites</h1>
  <p>For small businesses and social enterprises</p>
</header>
```

- The single `<h1>` of the page. Do not repeat it in the body.
- The Page header sits at the top of `main`, after the skip link target.

## Port notes

- Today's macro wraps a `.card` with inline styles (`padding-block-end: var(--space-l-xl)`). Replace with `.page-header` rules in `_components.scss`.
- The heading moves from Ronzino `<h1>` to KC Pelletier Sans bound to `--step-2-4`.
- Add an illustration-optional path: skip the `icon` call when `iconName` is empty. Needed by Artmaking and 404.
- Home uses its own hero, not Page header (`step/hero`).

## Open questions

- Artmaking and 404 instances have no illustration (the layer is deleted inside the instance), but the component has no "Show illustration" switch. Add the boolean, or build a separate variant?
- Show blurb is off everywhere. Do any pages need it (the Web design page passes a blurb today)?
- The Blurb layer is fill-width with no max width, so it would run wider than the 900 heading. Cap it?
