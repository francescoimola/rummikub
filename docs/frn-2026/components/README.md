# Components

The FRN-2026 component library: designed in Figma, built as Nunjucks partials and SCSS in this repo. **This folder is the source of truth** for the port. Each Figma component's description links to its doc here. Decisions are in [`../decisions.md`](../decisions.md) (Phase 17 = the pre-migration audit) and findings in [`../audit.md`](../audit.md).

- **Figma:** file `UkQphRf7GwINc1c8vORtUm`, page `2246:754`, WIP section `2275:725`, **Components** board `2291:769`. The section `2260:2139` is an archive: read it, never edit it.
- **Frames:** desktop 1512 (Utopia Max), tablet 834 and mobile 390 (Utopia Min). Node IDs are in [`../figma-state.json`](../figma-state.json).
- **Token values:** [`_tokens.md`](_tokens.md).
- **Scripting Figma:** read [`../figma-gotchas.md`](../figma-gotchas.md) before any `use_figma` call.
- **Code Connect:** the API refuses writes on this plan. Link by hand in Dev Mode from the index below (repo paths on `development`, switch to `main` once merged); see the gotchas file.

## Index

Status tracks the **redesign**: `planned` (a pattern with no Figma component) → `figma` (component built) → `code` (redesign ported). Today's partials don't count as `code` until they match the doc.

### Primitives

| Component | Doc | Figma | Repo today | Status |
| --- | --- | --- | --- | --- |
| Icon/* | [icon.md](icon.md) | `2293:1221` … | `_icons.scss` `[data-icon]` | figma |
| Illustration/* | [illustration.md](illustration.md) | `2357:19402` … | `src/assets/icons/*.svg` | code |
| Image | [image.md](image.md) | `2341:9739` | `<img>` / `figureImg` | code |
| Icon link | [icon-link.md](icon-link.md) | `2352:18813` | `a[data-icon]` | figma |
| Nav link | [nav-link.md](nav-link.md) | `2291:779` | `<li>` in `_header.njk` | code |
| Section heading | [section-heading.md](section-heading.md) | `2380:19847` | `h2.highlight-header` | code |
| Card | [card.md](card.md) | `2403:20009` | `.card` | code |

### Composites

| Component | Doc | Figma | Repo today | Status |
| --- | --- | --- | --- | --- |
| Look toggles | [look-toggles.md](look-toggles.md) | `2353:19425` | `_look-toggles.njk` | code |
| Breadcrumb | [breadcrumb.md](breadcrumb.md) | `2353:19355` | `_breadcrumb.njk` | code |
| Figure | [figure.md](figure.md) | `2355:19174` | `figureImg` / `projectVideo` | code |
| FAQ item | [faq-item.md](faq-item.md) | `2353:18925` | `_faq-list.njk` | code |
| Contact card | [contact-card.md](contact-card.md) | `2293:1269` | `_contact-card.njk` | code |
| Project item | [project-item.md](project-item.md) | `2292:1007` | `_project-item.njk` | code |
| Writing item | [writing-item.md](writing-item.md) | `2329:9102` | `_writing-item.njk` | code |
| Service card | [service-card.md](service-card.md) | `2292:1547` | `_service-card.njk` | code |
| Quote card | [quote-card.md](quote-card.md) | `2380:19851` | `_quote-card.njk` | code |
| Pricing item | [pricing-item.md](pricing-item.md) | `2380:19857` | `.pricing-list>li` | code |
| Split row | [split-row.md](split-row.md) | `2357:19451` | `_split-row.njk` | code |
| Ordered list | [ordered-list.md](ordered-list.md) | (pattern) | `ol` | code |
| Media pair | [media-pair.md](media-pair.md) | (pattern) | `.grid-cols-2` + `{% mediaPair %}` shortcode (G40) | code |
| Masonry | [masonry.md](masonry.md) | (pattern) | `.masonry` | dropped |
| Data list | [data-list.md](data-list.md) | (pattern) | `.data-list` | code |

### Sections

| Component | Doc | Figma | Repo today | Status |
| --- | --- | --- | --- | --- |
| Header | [header.md](header.md) | `2291:838` | `_header.njk` | code |
| Footer | [footer.md](footer.md) | `2293:2112` | `_footer.njk` | code |
| Page header | [page-header.md](page-header.md) | `2405:19762` | `_page-header.njk` | code |
| CTA card | [cta-card.md](cta-card.md) | `2378:20633` | `_cta-card.njk` | code |
| Carousel | [carousel.md](carousel.md) | `2299:3910` | `_carousel.njk` | code |
| Section | [section.md](section.md) | (pattern) | `section.section` | code |

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
| Scroll animation | `settle` stays on the hero media of case studies and writing posts. `breakout` never runs on case studies. It runs only on writing posts, and where a developer opts in with `view-animation="breakout"` (G13). Media pairs sit at content width. Both key off `.case-study__intro`. Firefox gets the JS fallback (`scroll-fallback.js`). |
| External links | [Icon/External](icon.md) ↗ (`data-icon="arrow-ext"`, drawn, never a typed character), `target="_blank" rel="noopener noreferrer"`. |
| Arrow rule | [Icon/Arrow-right](icon.md) → after the label, only when the label doesn't already make clear the link leaves the page, or when leaving is hard to undo ("To main site"). "Read case study" gets none (G19, G44). Arrows stay on "More about me", "Here's what I can offer you", "How this website is built", "Learn about its accessibility", "See what other brands left with", the Service card Default CTA and "To main site". |
| Nav label | The writing section is "Ideas" in the header, breadcrumb and any footer link (G1). The `/writing/` heading and `<title>` stay. |
| Icons | Opt-in per element via `data-icon` / `data-icon-before`. Nothing keys off `href`. |
| Images | Lazy by default; body images go through `figureImg`, never markdown `![]()`. With no `ratio=` an image keeps its natural shape: no crop, no build-time measuring (G11). Ratio token names state the ratio: `--ratio-3-2`, `--ratio-2-1`, `--ratio-1-1`, `--ratio-4-3`, `--ratio-16-9`, and portraits `--ratio-2-3`, `--ratio-3-4`, `--ratio-9-16`. The carousel crops to 3:2, the one exception (G45). `artProjects.json` gets no `ratio` field (G43). |
| Videos | `projectVideo`: lazy, autoplay in view, muted; the control shows only when the constraints apply (AGENTS.md, Project videos). |
| Anchors | The homepage Featured heading gets `id="case-studies"`; every former `/work/` link points there (Q32). |
| Fonts | Ronzino for everything except the hero and CTA headings, which use KC Pelletier Sans. The typeface is never swapped. |

Masonry is dropped (G37): images use a plain two-column grid with `align-items: start` and natural ratios, with no `grid-lanes`. The doc stays as a note on what the port removes.

## Doc template

Copy [`_template.md`](_template.md) for each new component.

## Open questions

All the open questions raised while writing these docs were settled in Phase 18 (G1 to G45, three rounds). See [`../decisions.md`](../decisions.md). Nothing is still open. The docs state the settled answers and cite the G number.
