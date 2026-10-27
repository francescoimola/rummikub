# Components

The FRN-2026 component library: designed in Figma, built as Nunjucks partials and SCSS in this repo. **This folder is the source of truth** for the port. Each Figma component's description links to its doc here. Decisions are in [`../decisions.md`](../decisions.md) (Phase 17 = the pre-migration audit) and findings in [`../audit.md`](../audit.md).

- **Figma:** file `UkQphRf7GwINc1c8vORtUm`, page `2246:754`, WIP section `2275:725`, **Components** board `2291:769`. The section `2260:2139` is an archive: read it, never edit it.
- **Frames:** desktop 1512 (Utopia Max), tablet 834 and mobile 390 (Utopia Min). Node IDs are in [`../figma-state.json`](../figma-state.json).
- **Token values:** [`_tokens.md`](_tokens.md).

## Index

Status tracks the **redesign**: `planned` (a pattern with no Figma component) → `figma` (component built) → `code` (redesign ported). Today's partials don't count as `code` until they match the doc.

### Primitives

| Component | Doc | Figma | Repo today | Status |
| --- | --- | --- | --- | --- |
| Icon/* | [icon.md](icon.md) | `2293:1221` … | `_icons.scss` `[data-icon]` | figma |
| Illustration/* | [illustration.md](illustration.md) | `2357:19402` … | `src/assets/icons/*.svg` | figma |
| Image | [image.md](image.md) | `2341:9739` | `<img>` / `figureImg` | figma |
| Icon link | [icon-link.md](icon-link.md) | `2352:18813` | `a[data-icon]` | figma |
| Nav link | [nav-link.md](nav-link.md) | `2291:779` | `<li>` in `_header.njk` | figma |
| Section heading | [section-heading.md](section-heading.md) | `2380:19847` | `h2.highlight-header` | figma |
| Card | [card.md](card.md) | (pattern) | `.card` | planned |

### Composites

| Component | Doc | Figma | Repo today | Status |
| --- | --- | --- | --- | --- |
| Look toggles | [look-toggles.md](look-toggles.md) | `2353:19425` | `_look-toggles.njk` | figma |
| Breadcrumb | [breadcrumb.md](breadcrumb.md) | `2353:19355` | `_breadcrumb.njk` | figma |
| Figure | [figure.md](figure.md) | `2355:19174` | `figureImg` / `projectVideo` | figma |
| FAQ item | [faq-item.md](faq-item.md) | `2353:18925` | `<details>` | figma |
| Contact card | [contact-card.md](contact-card.md) | `2293:1269` | old contact page | figma |
| Project item | [project-item.md](project-item.md) | `2292:1007` | `_project-item.njk` | figma |
| Writing item | [writing-item.md](writing-item.md) | `2329:9102` | `_writing-item.njk` | figma |
| Service card | [service-card.md](service-card.md) | `2292:1547` | `_service-card.njk` | figma |
| Quote card | [quote-card.md](quote-card.md) | `2380:19851` | `blockquote` card | figma |
| Pricing item | [pricing-item.md](pricing-item.md) | `2380:19857` | (none) | figma |
| Split row | [split-row.md](split-row.md) | `2357:19451` | `_split-row.njk` | figma |
| Ordered list | [ordered-list.md](ordered-list.md) | (pattern) | `ol` | planned |
| Media pair | [media-pair.md](media-pair.md) | (pattern) | `.grid-cols-2-fixed` | planned |
| Masonry | [masonry.md](masonry.md) | (pattern) | `.masonry` | planned |
| Data list | [data-list.md](data-list.md) | (pattern) | `.data-list` | planned |

### Sections

| Component | Doc | Figma | Repo today | Status |
| --- | --- | --- | --- | --- |
| Header | [header.md](header.md) | `2291:838` | `_header.njk` | figma |
| Footer | [footer.md](footer.md) | `2293:2112` | `_footer.njk` | figma |
| Page header | [page-header.md](page-header.md) | `2357:19433` | `_page-header.njk` | figma |
| CTA card | [cta-card.md](cta-card.md) | `2378:20633` | `_cta-card.njk` | figma |
| Carousel | [carousel.md](carousel.md) | `2299:3910` | (none) | figma |
| Section | [section.md](section.md) | (pattern) | `section` | planned |

## Conventions

### Naming

- **Figma:** sentence case, e.g. "Section heading". Icons and illustrations use a slash family: `Icon/Arrow-right`, `Illustration/runner`.
- **Code:** partial `src/_includes/_<kebab-name>.njk` exporting a macro in camelCase (`ctaCard`, `pageHeader`). Block class `.<kebab-name>`, parts `.<kebab-name>__<part>`. Component styles go in `_components.scss`, and every breakpoint or container fold goes in `_responsive.scss` (CSS rule 10).
- **Variant axes in use:** `Layout` (Wide/Narrow for site chrome; Split/Stacked for content), `State`, `Type`, `Style`, `Ratio`, `Order` and `Slide`. A new axis needs agreement first.

### Fluid sizing

- Every size is bound to a variable in the Figma **Utopia** collection. In code it is the matching Utopia `clamp()`. Figma's px are a snapshot of the two poles and are never copied into CSS ([port rules](../decisions.md#port-rules-figma-is-a-snapshot-the-repo-stays-fluid-2026-10-25)).
- Breakpoint frames are visual checks. Layout comes from fluid scales, intrinsic grids and **container queries**; a viewport breakpoint is the fallback (Q25).
- `Layout` variants exist only where the structure changes. Size changes alone are mode changes.

### Theme

- Figma frames use the **Color Light** mode. In code, light/dark is `light-dark()` plus `[data-theme]`, and the page colour is `--brand-hue` via `[data-brand]` on `<html>` (CSS rules 4 and 9). Components never hard-code a colour.
- Text uses `neutral/*` tokens. The secondary "dimmed" text is `neutral/900-alpha`. Only `--color-accent` follows the page colour.

### States

- Interactive components show Default and Hover in Figma (plus Current or Open where they apply). Hover is wired with smart animate where it's cheap.
- Focus isn't drawn in Figma. Every focusable element uses the global `:focus-visible` ring (2px `--color-accent`, offset 2px).

## Cross-cutting behaviour

These rules apply site-wide; component docs refer to them instead of repeating them.

| Behaviour | Rule |
| --- | --- |
| Motion | `--dur-fast` 0.2s and `--dur-medium` 0.25s with `--ease`. Both are 0s unless the visitor allows motion, so reduced motion is the default state, not an override. |
| Scroll animation | `view-animation="settle"` (first media, page headers) and `breakout` (later media) key off `.case-study__intro`. Firefox gets the JS fallback (`scroll-fallback.js`). |
| External links | [Icon/External](icon.md) ↗ (`data-icon="arrow-ext"`, drawn, never a typed character), `target="_blank" rel="noopener noreferrer"`. |
| Internal "more" links | [Icon/Arrow-right](icon.md) → after the label. |
| Icons | Opt-in per element via `data-icon` / `data-icon-before`. Nothing keys off `href`. |
| Images | Lazy by default; body images go through `figureImg`, never markdown `![]()`. |
| Videos | `projectVideo`: lazy, autoplay in view, muted; the control shows only when the constraints apply (AGENTS.md, Project videos). |
| Anchors | The homepage Featured heading gets `id="case-studies"`; every former `/work/` link points there (Q32). |
| Fonts | Ronzino for everything except the hero and CTA headings, which use KC Pelletier Sans. The typeface is never swapped. |

## Doc template

Copy [`_template.md`](_template.md) for each new component.

## Open questions

Raised while writing the docs (2026-10-27). Each one is detailed in its doc. They get settled in a grilling round before the port.

**Site chrome**

- [Header](header.md): the nav label "Ideas" vs the repo's "Ideas & guides" (also [Breadcrumb](breadcrumb.md)); whether the Wide Look toggles sit inside the 900 column.
- [Nav link](nav-link.md): whether the hover bullet animates in (as in Figma) or just appears (as in the repo).
- [Footer](footer.md): the "Looking around?" nav is gone, so confirm there are no links beyond the Contact cards; where the second badge points.
- [Contact card](contact-card.md): whether the Prompt is a heading or a paragraph.
- [Look toggles](look-toggles.md): whether the theme switch scales with type like the swatches do.

**Icons and media**

- [Icon](icon.md): glyph colour, `color-accent` fill (Copy, Phone) vs `brand/800` stroke (External, Arrow-right), or `currentColor` in code.
- [Icon link](icon-link.md): the copy action stays a `<button>`, or becomes a `mailto:` link.
- [Illustration](illustration.md): inline SVG vs `<img>` for the footer drawing (an `<img>` can't follow the theme).
- [Image](image.md): names for the five `--ratio-*` tokens; whether every image states its ratio.
- [Figure](figure.md): renaming `font-size-7`; keeping both the media-pair grid and the scroll breakout.
- [Carousel](carousel.md): new JS needs approval (rule 10), or scroll-snap with no buttons; where the slides live; links and auto-advance.

**Content**

- [Page header](page-header.md): a "Show illustration" switch for Artmaking and 404; whether any page needs the blurb.
- [CTA card](cta-card.md): `h2` on every page, or follow the page outline.
- [Project item](project-item.md): an arrow on the CTA; whether the `$bp-2xl` title-left/CTA-right row stays.
- [Writing item](writing-item.md): the Expanded thumb scales, or stays the fixed `--space-2xl` square.
- [Service card](service-card.md): the Accordion CTA glyphs; a Figma variant for `adhoc`.
- [Split row](split-row.md): the description beside or under the title; the year in `site/body` vs `site/small`.
- [FAQ item](faq-item.md): a macro or hand-written `<details>`; whether opening one closes the others.
- [Quote card](quote-card.md): draw the left accent bar in Figma or drop it; a `quoteCard` macro plus `testimonials.json`, or inline copy.
- [Pricing item](pricing-item.md): Consultations' £225 as a Pricing item; a macro or an inline `<li>` (`.pricing-list` already exists).
- [Section heading](section-heading.md): the `highlight-header` flag as a section attribute or an h2 class.

**Patterns**

- [Section](section.md): column gap `space/s` (Work with me) vs `space/3xs-m` (About); whether the Ideas type sections share the grid.
- [Card](card.md): a real Figma Card component (Outline, Featured); Collaborate's card radius.
- [Ordered list](ordered-list.md): one gap for both service pages; the browser `::marker` or a drawn counter.
- [Media pair](media-pair.md): a new `.media-pair` with a fold, or fold `.grid-cols-2-fixed` (which never stacks today); a `mediaPair` shortcode.
- [Masonry](masonry.md): whether Figma draws the grid-lanes packing.
- [Data list](data-list.md): the repo's layout or Figma's; the Narrow fold as a `@container` rule.
