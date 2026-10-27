# Page header

**Layer:** Section · **Status:** code · **Figma:** `2405:19762` (set; `Layout=Default` `2357:19433`, `Layout=Tablet` `2405:19759`) · **Code:** `src/_includes/_page-header.njk`, macro `pageHeader(iconName, label)`

## Purpose

The hero at the top of the section pages: an illustration over a large centred heading, on a `brand/150` band. 18 instances across six pages (3 frame sizes each): Work with me, Ideas, Artmaking, 404, Web design, Website consultations.

## Anatomy

- **Illustration** (`Show illustration`, G16): an [Illustration/*](illustration.md) instance, height `size/hero-illustration`. Exposed through the Illustration swap.
- **Introduction**: the heading. Text style `site/hero`, KC Pelletier Sans, size `step/2-4`, centred, max width `layout/content-width`.

There is no blurb (G17).

Code: `<header class="page-header">` with the illustration and an `<h1>`.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Illustration | instance swap, default `Illustration/deskgarden` | Four hero drawings (preferred values set) |
| Heading | text | The page's `<h1>` |
| Show illustration | boolean `Show illustration#2403:0`, default true | Off on Artmaking, 404 and Web design (G16) |

No variants.

## Layout

None, fluid only. A vertical stack, centred, gap `space/2xl-3xl`. The heading is capped at whichever is wider, `layout/inline-size` (600) or `layout/content-width` (330 → 900) (G46). In Figma this is a `Layout=Tablet` variant: the heading sits in an "Introduction cap" frame with max width `layout/inline-size`, because the plugin can't bind a text layer's max width. All six tablet instances use it. The variant is only how Figma draws it: code has no tablet variant. Code: `max-inline-size: max(var(--inline-size), <content-width>)`. No breakpoint: on phones the parent is narrower than 600, so the heading just fills it.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Padding block | `space/2xl-3xl` | 60 → 101.25 |
| Padding inline | `space/xl-2xl` | 45 → 67.5 |
| Illustration ↔ heading gap | `space/2xl-3xl` | 60 → 101.25 |
| Illustration height | `size/hero-illustration` | 154 → 220 |
| Heading size | `step/2-4` | 26.65 → 53.28 |
| Heading max width | `max(layout/inline-size, layout/content-width)` (G46); tablet frames bind `layout/inline-size` | 600 → 900 |
| Fill | `brand/150` | colour |

Values from [`_tokens.md`](_tokens.md). `step/2-4` is the new section-hero pair (Q20).

## States & interactions

Static: the band does not animate, and the first media after it follows the usual rhythm (README, Cross-cutting behaviour).

## Content rules

- Heading and drawing come from the page: `pageHeader(icon, label)`. An empty `icon` means no illustration (G16).
- The 404 and Artmaking headings are long sentences. Keep the heading to a few lines at 900 wide.
- The blurb is removed (G17): the macro param and the Figma property both go.
- Heading text starts lowercase on Work with me ("break free …") and ends with a stray space before the full stop ("Together ."). Fix the copy in Figma, not in code.

## HTML & accessibility

```html
<header class="page-header">
  <svg aria-hidden="true" …>…</svg>
  <h1>Unapologetically simple websites</h1>
</header>
```

- The single `<h1>` of the page. Do not repeat it in the body.
- The Page header sits at the top of `main`, after the skip link target.

## Port notes

- Today's macro wraps a `.card` with inline styles (`padding-block-end: var(--space-l-xl)`). Replace with `.page-header` rules in `_components.scss`.
- The heading moves from Ronzino `<h1>` to KC Pelletier Sans bound to `--step-2-4`.
- Add an illustration-optional path: skip the `icon` call when `iconName` is empty (G16). Needed by Artmaking and 404. Figma gets the matching `Show illustration` boolean.
- Remove the `blurb` param (G17). The pages that pass one today drop it at the port: `writing.njk`, `writing-types.njk`, `studio/design.njk` and `studio/consultations.njk`. Delete the Blurb layer and Show blurb property in Figma.
- Home uses its own hero, not Page header (`step/hero`).
- **Ported (#27):** `pageHeader(iconName, label)` in `_page-header.njk` renders `header.page-header` (no scroll animation; the review fixes dropped `settle`); `.page-header` in `_components.scss` replaces the card and inline styles. Band fill joins the `.site-banner` theming rule; `--settled-size` is content width so settle ends at 900. The h1 is `--font-family-display` at `--step-2-4`, line-height 1, uppercase, capped at `max(--inline-size, min(100%, --grid-width-l))`. The drawing is `block-size: --size-hero-illustration`, width auto, `neutral/950-alpha`.
- Pages: Work with me (runner, Figma copy), Web design (deskgarden), Consultations (websitevisit), Ideas (meditating; the `/writing/` heading stays), Artmaking and 404 (no drawing, Figma copy; Artmaking's first intro paragraph became the hero). Writing type pages dropped it for a plain `h1` + blurb + breadcrumb, so `writingTypes.json` lost its `icon` keys.

## Open questions

None. Settled in Phase 18 (G16, G17).
