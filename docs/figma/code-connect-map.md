# Figma → code map

Figma file `FRN-2026` (`UkQphRf7GwINc1c8vORtUm`), **Components** page ([node 2291:769](https://www.figma.com/design/UkQphRf7GwINc1c8vORtUm/FRN-2026?node-id=2291-769&m=dev)).

Not live in Figma: Code Connect needs an Organization or Enterprise plan (the API returns "Code connections can only be made in libraries that are in Organization or Enterprise plans"). Until then, paste the path into the Dev Mode Code Connect panel by hand. The repo `francescoimola/rummikub` is already connected there.

Paths are relative to `https://github.com/francescoimola/rummikub/blob/development/`. Switch to `main` once merged.

Node IDs are the component set (or the standalone component). Variants live inside a set.

| Figma component | Node | Path | Code name |
|---|---|---|---|
| Nav link | `2291:779` | `src/_includes/_header.njk` | `navItem` macro |
| Header | `2291:838` | `src/_includes/_header.njk` | `header.site-banner` |
| Project item | `2292:1007` | `src/_includes/_project-item.njk` | |
| Service card | `2292:1547` | `src/_includes/_service-card.njk` | |
| Icon/Copy | `2293:1221` | `src/css/_icons.scss` | `data-icon="copy"` |
| Icon/Phone | `2293:1224` | `src/css/_icons.scss` | `data-icon="phone"` |
| Icon/External | `2293:1228` | `src/css/_icons.scss` | `data-icon="arrow-ext"` |
| Icon/Arrow-right | `2352:18808` | `src/css/_icons.scss` | `data-icon="arrow-right"` |
| Icon/Chevron-right | `2352:18809` | `src/css/_icons.scss` | `data-icon-before="chevron-right"` |
| Icon/Plus | `2378:20019` | `src/css/_icons.scss` | `data-icon="plus"` |
| Contact card | `2293:1269` | `src/_includes/_contact-card.njk` | `contactCard` macro |
| Footer | `2293:2112` | `src/_includes/_footer.njk` | `footer.site-footer` |
| Carousel | `2299:3910` | `src/_includes/_carousel.njk` | |
| Writing item | `2329:9102` | `src/_includes/_writing-item.njk` | |
| Image | `2341:9739` | `src/config/eleventy/shortcodes.js` | `figureImg` (`ratio=`) |
| Icon link | `2352:18813` | `src/css/_icons.scss` | `a[data-icon]` |
| FAQ item | `2353:18925` | `src/_includes/_faq-list.njk` | `faqList` macro |
| Breadcrumb | `2353:19355` | `src/_includes/_breadcrumb.njk` | |
| Look toggles | `2353:19425` | `src/_includes/_look-toggles.njk` | |
| Figure | `2355:19174` | `src/config/eleventy/shortcodes.js` | `figureImg` / `projectVideo` |
| CTA card | `2378:20633` | `src/_includes/_cta-card.njk` | |
| Illustration/runner | `2357:19402` | `src/assets/icons/runner.svg` | `{% icon "runner" %}` |
| Illustration/meditating | `2357:19404` | `src/assets/icons/meditating.svg` | `{% icon "meditating" %}` |
| Illustration/deskgarden | `2357:19426` | `src/assets/icons/deskgarden.svg` | `{% icon "deskgarden" %}` |
| Illustration/websitevisit | `2357:19428` | `src/assets/icons/websitevisit.svg` | `{% icon "websitevisit" %}` |
| Illustration/footer | `2381:19752` | `src/assets/icons/mailstorm.svg` | `{% icon "mailstorm" %}` |
| Page header | `2405:19762` | `src/_includes/_page-header.njk` | `pageHeader` |
| Split row | `2357:19451` | `src/_includes/_split-row.njk` | `splitRow` macro |
| Section heading | `2380:19847` | `src/css/index.scss` | `h2.highlight-header` |
| Quote card | `2380:19851` | `src/_includes/_quote-card.njk` | |
| Pricing item | `2380:19857` | `src/css/_components.scss` | `.pricing-list > li` |
| Card | `2403:20009` | `src/css/_components.scss` | `.card` |

## Re-running the save

With the plan upgraded, one `send_code_connect_mappings` call with `label: "Web Components"` (the closest option for plain HTML templates) pushes all 32 rows. The Footer frame's instance IDs (`2418:*`, `2293:15xx`) are not needed; map the sets above.
