# francescoimola.com

![fallow: A (90)](badge.svg) [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE.md)

I make delightful things with pixels and words. This is my island on the web, half-portfolio, half-marketing site. It's built with Eleventy, cleacss, LightningCSS, and Cloudflare Pages as a host.

## What's the stack?

- **Static site**: [Eleventy 3](https://www.11ty.dev/)
- **Templates**: Nunjucks
- **CSS**: SCSS → LightningCSS, OKLCH colors, `light-dark()` 
- **Type & spacing**: [Utopia](https://utopia.fyi/) fluid scale
- **Font**: Ronzino (a humanist sans-serif font by Collletttivo)
- **Package manager**: pnpm


## What's the overarching structure?

```
src/
  _includes/      Nunjucks partials (base, head, header, footer, meta, schema)
  _data/          Global data (site.json)
  css/            SCSS entry point + all styles
  assets/         Fonts, favicons, portfolio videos
  config/         Eleventy config (transforms, filters, shortcodes, collections)
public/           Build output (gitignored)
```

## Cool things this site can do

- Brand tint: I can swap the entire colour palette by changing --brand-hue and --brand-chroma. 
- Light/dark mode is automatic via light-dark(), plus there's a manual toggle with data-theme.
- Lazy video: IntersectionObserver loads project videos only when they scroll into view and prefers-reduced-motion and slow connections are respected, within what's feasible.
- Content modes: by setting "contentMode: contrast" in frontmatter, I can make pages either white or slightly tint them with the brand colour.
- Fluid type using Utopia, which generates a scale from 16px to 24px with a Perfect Fourth ratio.
- Running on 100% renewable energy infrastructure. Cloudflare Pages is certified green by The Green Web Foundation.

## License

[GPL-3.0](LICENSE.md) — see [LICENSE.md](LICENSE.md) for full text.
