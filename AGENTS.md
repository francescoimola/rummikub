# Rummikub — Francesco Imola's portfolio

**Stack:** Eleventy 3 · Nunjucks templates · SCSS (compiled via `@11tyrocks/eleventy-plugin-sass-lightningcss` → LightningCSS) · pnpm · Deploys via Cloudflare Pages (git-connected, `main` = production).

**Branch:** `development` — active development. Merging to `main` deploys francescoimola.com via Cloudflare Pages.

## Working in this repo

This is a one-person repo. Francesco owns, designs and builds it, edits CSS by hand, and checks changes by looking at the page and the console. Keep the process that small.

- **Simplifying never shows.** Simplification work must not change what visitors see or how the site works.
- **Before adding anything new** (a doc, test, rule, script, dependency or any other file), present 1 to 4 alternatives that add no new file, with pros and cons. If Francesco likes none of them, the original plan goes ahead.
- **Record changes in commit messages:** what changed and why. Do not update docs for ordinary changes. Edit a doc only when a change makes something it says false.

## Reference docs

**Voice & tone:** `.private/voice-guide.md` (local-only, gitignored).

Everything else is one file, [docs/site-notes.md](docs/site-notes.md). Read only the section you need:

- **[Coding standards](docs/site-notes.md#coding-standards):** the judgement rules a code review enforces; mechanical ones live in `pnpm lint`
- **[CSS architecture](docs/site-notes.md#css-architecture):** before editing `src/css`; numbered rules, cited in comments as "CSS rule N"
- **[Rhythm](docs/site-notes.md#rhythm):** before changing text sizes or gaps
- **[Long-form pages](docs/site-notes.md#long-form-pages):** before changing case studies, writing posts, `settle`, `figureImg` or the focal picker
- **[Artmaking page](docs/site-notes.md#artmaking-page):** before changing `/art/`, `.split-row` or `artProjects.json`
- **[Pages CMS](docs/site-notes.md#pages-cms):** before changing `.pages.yml`, CMS field shapes or the optimize-videos action
- **[Project videos](docs/site-notes.md#project-videos):** before changing `video-controller.js` or `.project-video*`
- **[Sitemap](docs/site-notes.md#sitemap):** when using `noindex` or `hidden`, or setting `updated`
- **[Testing](docs/site-notes.md#testing):** run `pnpm lint && pnpm build && pnpm test` before committing (the tests read `public/`)
- **[DevTools probes](docs/site-notes.md#devtools-probes):** for bugs only a browser shows

**Figma:** [docs/figma.md](docs/figma.md) before any Figma work: the file key, how to realign Figma with the code, and where the archived component docs are.

## Commands

```bash
pnpm install          # Install dependencies
pnpm start            # Dev server (Eleventy --serve)
pnpm build            # Production build; keeps public/, so a repeat build takes seconds
pnpm lint             # Mechanical rules: breakpoints, SCSS comments, external rel, JSON keys, rhythm ladder
pnpm clean            # rm -rf public; run it to start fresh, then expect a 4–10 minute build
```

**Never run `pnpm dev` / `npm run dev`** — the dev script is `pnpm start`. Do not spin up a dev server unless the user explicitly asks.

**Replacing an image:** image filenames carry no content hash, so a new image under an old filename keeps its old optimized files until you run `pnpm clean` and build again. The same goes for a deleted page, which stays in `public/` until then.

**Worktrees:** a build in a fresh checkout takes 4–10 minutes. Build and test in your own worktree, not in the main checkout while another agent works there; in a worktree run git as separate plain commands.

## Project structure

| Path | Purpose |
|---|---|
| `src/` | All source files |
| `src/_includes/` | Nunjucks partials (`_base.njk`, `_head.njk`, `_header.njk`, `_footer.njk` + `_contact-card.njk`, `_meta.njk`, `_schema.njk`) |
| `src/_data/site.json` | Global site data (`url`, `name`, `description`, `image`) plus contact details (`email`, `bookingUrl`, `consultationUrl`, `social`) |
| `src/css/index.scss` | SCSS entry point + global styles: theme, content modes, interactive, typography, layout. Component-scoped rules live in `_components.scss`, not here |
| `src/css/_tokens.scss` | Layer order (first thing emitted), `@font-face`, colour scales, Utopia type tokens, the `$bp-*` breakpoint widths, and the unlayered `overrides` mixin for every token that collides with cleacss (`--space-*`, `--font-weight-bold`, `--color-{success,warning,error,info}`, `--input-border-color`). KC Pelletier is for hero + CTA headings only |
| `src/css/_components.scss` | Unlayered component styles, starting with the icon system (a `$glyphs` map emitted into `[data-icon="x"]::after` / `[data-icon-before="x"]::before`; add a glyph = one map entry), then the single `responsive` mixin holding every breakpoint rule, included last in `index.scss` (CSS rule 10) |
| `src/css/vendor/cleacss.css` | Vendored cleacss v3.2.0, trimmed to the classes the site uses, with its reset, element styles and tokens intact. Edit it directly; do NOT npm-install. To use a class it no longer has, copy the rule back from upstream |
| `src/assets/fonts/` | woff2 files only, never source OTFs (gitignored; public repo) (passthrough copied to `public/assets/fonts/`) |
| `src/assets/favicon/` | Favicon files (passthrough copied) |
| `src/work/` | Portfolio case-study pages (`tag: work`). Frontmatter drives collections in `src/config/collections.js`: sorted by `endDate` (YYYY-MM) desc; `featured: true` → `workFeatured` (homepage Featured, **max 3**), otherwise → `workIndex` (homepage Index). There is no `/work/` index: it redirects to `/#case-studies`, and `/contact/` to the footer's `/#contact` |
| `src/writing/` | Writing section (`tag: writing`, `/writing/<slug>/`). Each item has one `type` (guides/essays/notes; see `src/_data/writingTypes.json`). `date`-desc `writing` collection; `writingTypes` lists present types in fixed order. On-site posts set `permalink`; external (Substack) items set `external`+`source` (leave `permalink` blank — the `eleventyComputed` in `writing.11tydata.js` suppresses the page). Index `src/writing.njk` (one `.section` per type, 2 latest each); per-type pages `src/writing-types.njk`; item macro `_writing-item.njk`; Two standalone RSS feeds, teasers only, never post bodies: `src/feed.njk` → `/rss.xml` (every type) and `src/essays-notes.njk` → `/essays-notes.xml` (`byType(["essays", "notes"])`, for aggregators that take one URL). Kept as separate files on purpose — copy one to add a third. `built-feeds.test.js` asserts the shipped XML. Posts render the shared case-study shell and keep `contentMode: contrast` — see Long-form pages |
| `src/assets/portfolio/` | Project videos (mp4/webm) + posters (passthrough copied to `public/assets/portfolio/`) |
| `src/assets/writing/` | Writing cover + in-body images (passthrough copied to `public/assets/writing/`) |
| `src/art.njk` | Artmaking index (`/art/`, full width). Content lives in `src/_data/artProjects.json` — no per-project files; the `splitRow` macro (`_split-row.njk`) renders one row per entry — see Artmaking page |
| `src/assets/art/` | Artmaking images: largest known originals, 1080–6889px wide (#73); `concert-…-3` stays 800px, `poem-for-a-timepiece` 1200px, `what-a-world*` ~1920px. Sources are EXIF-stripped (passthrough copied to `public/assets/art/`) |
| `docs/about-page.md` | Text of the retired About page; not built. That content lives in the homepage's Intro accordions (`src/index.njk`, `accordion` macro in `_faq-list.njk`); `/about/` 301s to `/#about`. `/about/accessibility/` and `/about/colophon/` are separate pages and stay |
| `scripts/optimize-videos.mjs` | Opt-in ffmpeg optimizer for project videos (`pnpm optimize:video`) |
| `public/` | Build output — gitignored, do not commit |
| `eleventy.config.js` | Eleventy configuration |

## Titles & meta descriptions

`title` is used **verbatim** as `<title>` — nothing is appended. Add `| Francesco Imola` in frontmatter where you want it. Targets: title 30–60 chars, description 120–160, both unique per page.

`title` doubles as the on-page `<h1>` for work/writing items (`_base.njk`) and via `pageHeader` elsewhere. Where the h1 must stay short (`The Loft`) or the SEO title differ, set **`metaTitle`** — it overrides `<title>`, `og:title`, `twitter:title` and schema `name`, and leaves the h1 alone. `writingTypes.json` carries `metaTitle`/`metaDescription` per type for the same reason (`blurb`/`label` stay on-page). Writing posts use `teaser` as their description; it also renders in listings.

## Project videos

Embed videos with the `projectVideo` shortcode. Lazy loading, autoplay-in-view, the hidden play/pause control, iOS Low Power Mode handling, formats and `pnpm optimize:video` are in [site notes](docs/site-notes.md#project-videos).

## CSS architecture

Before editing `src/css`, read [the CSS section of site notes](docs/site-notes.md#css-architecture): the eleven numbered rules (`@use` order, `@layer` order, cleacss token collisions, brand re-tint, breakpoints, the rhythm ladder). Comments cite them as "CSS rule N".

## Non-negotiable rules

1. **Nunjucks, not Astro.** Templates are `.njk`. There are no `.astro` files on this branch.
2. **No TypeScript.** `eleventy.config.js` is CommonJS. `tsconfig.json` exists only to keep VS Code quiet — `checkJs` is off.
3. **`public/` is build output.** Never commit files to `public/`. Recover missing static assets from `git show main:public/<path>` if needed.
4. **Semantic HTML.** Single `<h1>` per page. Use `<article>`, `<nav>`, `<section>`, `<aside>` correctly. Skip link (`#main-content`) must remain.
5. **`rem` for sizing, `dvh`/`dvw` over `vh`/`vw`.** No raw `px` values for layout.
6. **`browserslist` pin:** `pnpm-workspace.yaml` pins `browserslist@4.24.0`. Required for Node 22+. Do not remove.
7. **`AGENTS.md` must be 200 lines or less — never more.** When editing this file, keep the total line count at ≤ 200. Trim content so the count holds.
8. **Anti-bloat: the JS surface only shrinks.** Prefer deleting or reusing over adding; a new JS file, npm dependency or test file follows "Before adding anything new" above. Three tests remain, all reading the built site; breakage you can see on the page gets no test.
9. **Extract hand-rolled null-guard chains into named helpers.** Each link of `a && a.b && a.b.c` or `x || y || z` is a cyclomatic branch, and fallow counts `?.`/`??` identically — modernising the syntax does not lower the score, only moving it does. Pull the chain into a named top-level function (see `thumbSeed`/`trustedLastmodValue` in `src/config/filters.js`); the caller drops under threshold and the fallback rule becomes testable alone.

## Common gotchas

| Issue | Fix |
|---|---|
| A `--space-*` / `--font-weight-bold` / `--color-{success,warning,error,info}` / `--input-border-color` value doesn't match source | cleacss defines that token unlayered; a layered override loses. Put it in the `overrides` mixin in `_tokens.scss`, `@include`d after the cleacss `@use` (CSS rule 3) |
| cleacss not applying dark mode | Dark follows the OS (no site switch, by design — Safari 26 drops its toolbar tint when page and Mac themes differ). Verify LightningCSS is processing the output |
| Text colour not changing with the palette | Text uses `--neutral-*` tokens which are intentionally near-neutral — only `--color-accent` changes with the palette |
| Font not loading | Check `src/assets/fonts/` has the woff2 file; passthrough copy requires the file to exist at build time |
| `fallow health` flags a CRAP score on well-tested code | No coverage provider is installed, so fallow scores every function against a flat 40% coverage guess. Read `cyclomatic` before acting — under 20 with real tests behind it, the estimate fired, not the code |
| Build throws `Too many featured work projects` | More than 3 `src/work/` posts have `featured: true`; the `workFeatured` collection caps at 3. Drop `featured: true` on the extras |
| Body image has no spacing, no caption, or two images stack flush | Markdown `![]()` — adjacent ones share one `<p>` and the `.case-study` selectors miss them. Use `figureImg` (see Long-form pages) |
| An inline SVG icon in `<main>` is invisible but still clickable | `header svg, main svg` (Illustrations) pads **every** SVG in `<main>`; padding over the declared size inflates the border-box and collapses the icon viewport to 0. Add `padding: 0; max-inline-size: none` to the icon's own rule |
| Accordions open instantly or leave a gap on close in Firefox only | Firefox runs no transitions on `::details-content` (checked frame by frame: opacity jumped, a delayed `content-visibility` flip left the answer's padding for `--dur-medium`). `index.scss` has a `@supports (-moz-appearance: none)` block: no transition there, a fade-in keyframe on the answer instead. Chrome/Safari keep the height tween |
| A style change doesn't show under `pnpm start` | The dev server can keep serving old CSS after an edit to an SCSS partial (`_components.scss`, `_tokens.scss`). Compare `curl localhost:8080/css/index.css` with the source, and restart `pnpm start` if they differ |
| Opening image doesn't bleed, or every image animates the same | `.case-study__intro` is missing or isn't the first child; `settle` keys off it |

## Browser automation blocklist

**Agents may not install or use puppeteer, playwright, or any browser-automation libraries without explicit user consent.** This includes MCP servers (Chrome DevTools MCP, Firecrawl, etc.) unless the user explicitly requests them for a specific task. Motivation: prevent accidental browser-session automation and ensure transparency around external system interaction.
