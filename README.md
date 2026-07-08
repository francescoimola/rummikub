# francescoimola.com

![fallow: A (90)](badge.svg)

Delightful things with pixels and words made by Francesco Imola from a seaside town in Kent.

## What this is

This is my portfolio site, built from scratch with Eleventy.

## Tech stack

| | |
|---|---|
| **Static site** | [Eleventy 3](https://www.11ty.dev/) |
| **Templates** | Nunjucks |
| **CSS** | SCSS → LightningCSS, OKLCH colors, `light-dark()` |
| **Type & spacing** | [Utopia](https://utopia.fyi/) fluid scale |
| **Font** | Ronzino (humanist sans-serif, woff2) |
| **Package manager** | pnpm |

## Getting started

You'll need Node 22+ and pnpm.

```bash
pnpm install
pnpm start        # dev server with live reload
pnpm build        # production build → public/
```

That's it.

## Project structure

```
src/
  _includes/      Nunjucks partials (base, head, header, footer, meta, schema)
  _data/          Global data (site.json)
  css/            SCSS entry point + all styles
  assets/         Fonts, favicons, portfolio videos
  config/         Eleventy config (transforms, filters, shortcodes, collections)
public/           Build output (gitignored)
```

## Highlights

- **Brand re-tinting** — swap the entire colour palette by changing `--brand-hue` and `--brand-chroma`. Try `data-brand="pink"` on `<html>`.
- **Light/dark mode** — automatic via `light-dark()`, plus manual toggle with `data-theme`.
- **Lazy video** — IntersectionObserver loads project videos only when they scroll into view. Respects `prefers-reduced-motion` and slow connections.
- **Content modes** — set `contentMode: contrast` in frontmatter for white-background content pages.
- **Fluid type** — Utopia generates a scale from 16px to 24px with a Perfect Fourth ratio.

## Deployment

CI runs on GitHub Actions: build + link check on every push to `development` and on PRs. Deploys to Netlify (Cloudflare Pages cutover planned — see `docs/cutover-runbook.md`).

## License

ISC
