# Rummikub — Francesco Imola's portfolio

**Stack:** Eleventy 3 · Nunjucks templates · SCSS (compiled via `@11tyrocks/eleventy-plugin-sass-lightningcss` → LightningCSS) · pnpm · Deploys via Cloudflare Pages (git-connected, `main` = production).

**Branch:** `development` — active development. Merging to `main` deploys francescoimola.com via Cloudflare Pages.

## Reference docs

- **Voice & tone:** `.docs/voice-guide.md` (local-only, gitignored)
- **Testing:** [testing-guide.md](testing-guide.md) — run `pnpm lint && pnpm build && pnpm test` before committing (the built-output tests read `public/`)
- **Rhythm:** [docs/design-system/rhythm.md](docs/design-system/rhythm.md) — the four type rungs, the spacing ladder (Tight, Flow, Break, Chapter, Hang) and the pair table; read before changing text sizes or gaps
- **Review:** [CODING_STANDARDS.md](CODING_STANDARDS.md) — judgement rules the reviewer enforces; mechanical ones live in `pnpm lint`
- **Figma ↔ code:** [docs/frn-2026/components/README.md](docs/frn-2026/components/README.md) — file key, node IDs and the component→repo-file index; read before any Figma work, Code Connect included

## Commands

```bash
pnpm install          # Install dependencies
pnpm start            # Dev server (Eleventy --serve)
pnpm build            # Production build
pnpm lint             # Mechanical rules: breakpoints, SCSS comments, external rel, JSON keys, rhythm ladder
pnpm clean            # rm -rf public
```

**Never run `pnpm dev` / `npm run dev`** — the dev script is `pnpm start`. Do not spin up a dev server unless the user explicitly asks.

**Worktrees:** `pnpm build` wipes `public/` and a cold build takes 4–10 minutes. Build and test in your own worktree, not in the main checkout while another agent works there; in a worktree run git as separate plain commands. Details in [testing-guide.md](testing-guide.md).

## Pages CMS

Content and media are editable via Pages CMS, configured in `.pages.yml` at the repo root (per-branch). Uploads land in `src/assets/` and are written as `/assets/...` URLs.

- **Collections** `work` (`src/work`, sorted by `endDate` desc, `featured` boolean) and `writing` (`src/writing`, sorted by `date` desc, `type` select) edit each `.md`'s frontmatter and body. Add a `writing` entry with `external`+`source` set (leave `permalink`+`body` blank) for a link-only Substack item. `writing.11tydata.js` (excluded from CMS) holds dir metadata + computed permalink.
- **Structured data files** (`artProjects`, `explorations`, `faqs`, `testimonials`, `collaborate`, `recognition`, and the contact fields in `site.json`) are edited through their `.pages.yml` entries, which hold the field shapes; read the entry before changing a data file. Gotchas: `faqs` answers are Markdown, rendered by the `markdown` filter in `faqList`; `explorations` uploads go to `src/assets/explorations`; `ctaCard` is imported `with context` so its defaults can read `site.json`.
- **Raw editors** for `_headers`, `_redirects`, `robots.txt` — `format: code`, no structured fields.
- **`body` fields are `type: text`, never `rich-text`** — posts mix markdown with Nunjucks shortcodes (`figureImg`, `projectVideo`) that a rich-text round-trip would corrupt.
- `settings.content.merge: true` preserves keys in `artProjects.json` that aren't in the schema.
- **Optimize-videos action:** the media page's button dispatches `.github/workflows/pages-cms-optimize-videos.yml`, which installs ffmpeg, runs `pnpm optimize:video`, and commits the mp4/webm/jpg back to the branch. Raw `.src.*` files are picked up automatically; existing outputs are skipped (pass `--force` to redo).

## Project structure

| Path | Purpose |
|---|---|
| `src/` | All source files |
| `src/_includes/` | Nunjucks partials (`_base.njk`, `_head.njk`, `_header.njk`, `_footer.njk` + `_contact-card.njk`, `_meta.njk`, `_schema.njk`) |
| `src/_data/site.json` | Global site data (`url`, `name`, `description`, `image`) plus contact details (`email`, `bookingUrl`, `consultationUrl`, `social`) |
| `src/css/index.scss` | SCSS entry point (`@use`s every partial) + global styles: theme, content modes, interactive, typography, layout. Component-scoped rules live in `_components.scss`, not here |
| `src/css/_components.scss` | Unlayered component styles: cards, blockquotes, look toggles, illustrations, data list, project item, case study (shared by work + writing), writing listings. Base (mobile) rules only — breakpoint overrides go in `_responsive.scss` (CSS rule 10) |
| `src/css/_responsive.scss` | Single `all` mixin holding **every** viewport + container breakpoint rule, one block per condition. `@include`d as the last statement in `index.scss` (see CSS rule 10) |
| `src/css/_icons.scss` | Icon glyph system — a `$glyphs` map of URL-encoded SVGs, emitted by one `@each` into `[data-icon="x"]::after` / `[data-icon-before="x"]::before`. Icons are opt-in per element; nothing keys off `href`. Add a glyph = one map entry. Per-glyph nudges use `--icon-gap` / `--icon-align`; `built-css.test.js` asserts every name used in markup has a glyph |
| `src/css/_fonts.scss` | Ronzino + KC Pelletier Sans `@font-face` declarations (`@layer fonts`). KC is for hero + CTA headings only, via `--font-family-display` |
| `src/css/_colors.scss` | Figma-generated colour scales (brand, neutral, success, warning, error, info) with light-dark() for dark mode (`@layer colors`). Brand scale is parametric (`--brand-hue`/`--brand-chroma`) |
| `src/css/_scale.scss` | Utopia fluid type tokens (`@layer type`), the `$bp-*` breakpoint Sass vars (consumed by `_responsive.scss`), and the `--gutter-y-sticky` `@property` |
| `src/css/_layers.scss` | Single `@layer` order statement pinning cleacss's five layers below our three. Must stay the **first** `@use` in `index.scss` (see CSS rule 3) |
| `src/css/_cleacss-overrides.scss` | Single unlayered `overrides` mixin holding every token that collides with cleacss's own unlayered defaults — the `--space-*` scale (Utopia), `--font-weight-bold`, `--color-{success,warning,error,info}`, `--input-border-color`. `@include`d once in `index.scss` after the cleacss `@use` (see CSS rules 3 & 8) |
| `src/css/vendor/cleacss.css` | Vendored cleacss v3.2.0 — do NOT npm-install |
| `src/assets/fonts/` | woff2 files only, never source OTFs (gitignored; public repo) (passthrough copied to `public/assets/fonts/`) |
| `src/assets/favicon/` | Favicon files (passthrough copied) |
| `src/work/` | Portfolio case-study pages (`tag: work`). Frontmatter drives collections in `src/config/eleventy/collections.js`: sorted by `endDate` (YYYY-MM) desc; `featured: true` → `workFeatured` (homepage Featured, **max 3**), otherwise → `workIndex` (homepage Index). There is no `/work/` index: it redirects to `/#case-studies`, and `/contact/` to the footer's `/#contact` |
| `src/writing/` | Writing section (`tag: writing`, `/writing/<slug>/`). Each item has one `type` (guides/essays/notes; see `src/_data/writingTypes.json`). `date`-desc `writing` collection; `writingTypes` lists present types in fixed order. On-site posts set `permalink`; external (Substack) items set `external`+`source` (leave `permalink` blank — the `eleventyComputed` in `writing.11tydata.js` suppresses the page). Index `src/writing.njk` (one `.section` per type, 2 latest each); per-type pages `src/writing-types.njk`; item macro `_writing-item.njk`; Two standalone RSS feeds, teasers only, never post bodies: `src/feed.njk` → `/rss.xml` (every type) and `src/essays-notes.njk` → `/essays-notes.xml` (`byType(["essays", "notes"])`, for aggregators that take one URL). Kept as separate files on purpose — copy one to add a third. `built-feeds.test.js` asserts the shipped XML. Posts render the shared case-study shell and keep `contentMode: contrast` — see Long-form pages |
| `src/assets/portfolio/` | Project videos (mp4/webm) + posters (passthrough copied to `public/assets/portfolio/`) |
| `src/assets/writing/` | Writing cover + in-body images (passthrough copied to `public/assets/writing/`) |
| `src/art.njk` | Artmaking index (`/art/`, full width). Content lives in `src/_data/artProjects.json` — no per-project files; the `splitRow` macro (`_split-row.njk`) renders one row per entry — see Artmaking page |
| `src/assets/art/` | Artmaking images: largest known originals, 1080–6889px wide (#73); `concert-…-3` stays 800px, `poem-for-a-timepiece` 1200px, `what-a-world*` ~1920px. Sources are EXIF-stripped (passthrough copied to `public/assets/art/`) |
| `src/about.njk` | About page (`/about/`) — bio, Philosophy, FAQ (`<details>`), Recognition (`.data-list`); moved off the home page's old expandable "Read more" section. Linked from the header nav |
| `scripts/optimize-videos.mjs` | Opt-in ffmpeg optimizer for project videos (`pnpm optimize:video`) |
| `public/` | Build output — gitignored, do not commit |
| `eleventy.config.js` | Eleventy configuration |

## Titles & meta descriptions

`title` is used **verbatim** as `<title>` — nothing is appended. Add `| Francesco Imola` in frontmatter where you want it. Targets: title 30–60 chars, description 120–160, both unique per page.

`title` doubles as the on-page `<h1>` for work/writing items (`_base.njk`) and via `pageHeader` elsewhere. Where the h1 must stay short (`The Loft`) or the SEO title differ, set **`metaTitle`** — it overrides `<title>`, `og:title`, `twitter:title` and schema `name`, and leaves the h1 alone. `writingTypes.json` carries `metaTitle`/`metaDescription` per type for the same reason (`blurb`/`label` stay on-page). Writing posts use `teaser` as their description; it also renders in listings.

## Sitemap

`src/sitemap.njk` → `/sitemap.xml`, built from `collections.all` (URL-sorted, trailing-slash pages only). Two opt-outs: `noindex: true` drops the page from the sitemap **and** emits the robots meta; `hidden: true` keeps a live page out of the writing listings and RSS but leaves it in the sitemap (`on-inner-desires`, linked from `/art/`). Never use `eleventyExcludeFromCollections` on a page that renders — it silently orphans it from the sitemap.

`<lastmod>` is emitted only when it's provably accurate: set **`updated: YYYY-MM-DD`** in frontmatter when you materially revise a page; writing posts fall back to `date`. Everything else omits the tag on purpose — Eleventy's default `page.date` is the file's creation time, which a fresh CI clone resets, so every deploy would stamp every URL with the build date and Google would stop trusting the whole file.

## Long-form pages (work + writing)

Case studies and writing posts share **one** branch in `_base.njk` → `<main class="case-study text">`, writing adding `writing-post`. It renders a `.case-study__intro` (h1 + one dimmed line: `services` on work, `<time>` + type on writing) and nothing else — the opening image is authored as the first `figureImg` **in the body**, not by the template. `image:`/`alt:` frontmatter is listing-thumbnail and OG duty only; a post without one just leads with the intro then text. A standalone page opts into the same shell with `longForm: true` (Accessibility): no `writing-post` class, and the intro line reads "Last updated" from `updated`.

Media rhythm (`.case-study` in `_components.scss`) and the scroll animation (`_responsive.scss`) both key off `.case-study__intro`: the first media after it gets `settle` (bleeds on load, pulls in over 50vh of scroll). Later media never animate. Figures and media pairs sit at the 60rem column (`--grid-width-l`), wider than the 40rem text, on every page; media ending the page carries no trailing margin. Removing the intro div silently kills `settle`. Browsers without `animation-timeline` (Firefox) get the same keyframes scrubbed from JS: `app-core.js` dynamically imports `scroll-fallback.js`, which finds targets by the `--scroll-fallback` custom property the CSS sets and writes `--scroll-p` — so target selectors and the breakpoint live only in `_responsive.scss`.

**Always use `figureImg` for body images — never markdown `![]()`.** Markdown compiles to `<p><picture>`, and two images on adjacent lines land in the *same* `<p>`, so they stack with no gap and support no caption. `figureImg` emits a real `<figure>` that the spacing and animation selectors match.

```njk
{% figureImg "/assets/writing/x.png", "Alt text" %}
{% figureImg "/assets/writing/x.png", "Alt", caption="Optional caption" %}
{% figureImg "/assets/writing/x.png", "Alt", href="https://…" %}   {# wraps img in a target=_blank link #}
{% figureImg "/assets/writing/x.png", "Alt", class="extra" %}      {# extra class on the <figure> #}
{% figureImg "/assets/writing/x.png", "Alt", imgClass="extra" %}   {# extra class on the <img> itself #}
{% figureImg "/assets/writing/x.png", "Alt", position="62% 18%" %} {# object-position crop #}
{% figureImg "/assets/writing/x.png", "Alt", ratio="3:2" %}        {# crop to --ratio-3-2 (also projectVideo); unknown ratio fails the build #}
{% mediaPair %}{% figureImg … %}{% figureImg … %}{% endmediaPair %} {# two figures side by side, stacking below $bp-s #}
```

**Object-position picker (dev only):** under `pnpm start`, Alt/Option+click any img or video (videos need a poster) to drag its focal point live and copy the CSS or `position=` value. Lives in `src/dev/focal-picker.js`, copied and linked only in serve mode; `built-landmarks.test.js` asserts it never ships.

## Artmaking page

Each project is a `.split-row` `<article>`: a `.split-row__text` block (title | description + dimmed year + link, 2-up from a `@container` at `$bp-split`) at content width, then a `ul.grid-cols-2.split-row__images` of `.card` `<li>`s spanning the full-width page (Q25, G24). Folds live in `_responsive.scss`.

- **Plain grid, no masonry (G37).** Images keep their natural ratio; `align-items: start` stops them stretching, and `align-self: start` stops `.split-row` stretching the grid (its rows would spread apart). `artProjects.json` has no `ratio` field (G43).
- **The image is a direct child of `.card`.** That is what triggers `.card`'s full-bleed rule, so images sit flush with no padding. Wrapping it in anything re-introduces the card padding.

Add new projects to `src/_data/artProjects.json`; `year`, `link`, `linkLabel` and `images` are all optional (an empty year renders nothing).

## Project videos

Embed videos with the `projectVideo` shortcode. Lazy loading, autoplay-in-view, the hidden play/pause control, iOS Low Power Mode handling, formats and `pnpm optimize:video` are in [docs/project-videos.md](docs/project-videos.md); read it before touching `video-controller.js` or `.project-video*`.

## CSS architecture

Before editing `src/css`, read [docs/css-architecture.md](docs/css-architecture.md): the eleven numbered rules (`@use` order, `@layer` order, cleacss token collisions, brand re-tint, breakpoints in `_responsive.scss`, the rhythm ladder). Comments cite them as "CSS rule N".

## Non-negotiable rules

1. **Nunjucks, not Astro.** Templates are `.njk`. There are no `.astro` files on this branch.
2. **No TypeScript.** `eleventy.config.js` is CommonJS. `tsconfig.json` exists only to keep VS Code quiet — `checkJs` is off.
3. **`public/` is build output.** Never commit files to `public/`. Recover missing static assets from `git show main:public/<path>` if needed.
4. **Semantic HTML.** Single `<h1>` per page. Use `<article>`, `<nav>`, `<section>`, `<aside>` correctly. Skip link (`#main-content`) must remain.
5. **`rem` for sizing, `dvh`/`dvw` over `vh`/`vw`.** No raw `px` values for layout.
6. **`browserslist` pin:** `pnpm-workspace.yaml` pins `browserslist@4.24.0`. Required for Node 22+. Do not remove.
7. **`AGENTS.md` must be 200 lines or less — never more.** When editing this file, keep the total line count at ≤ 200. Trim content so the count holds.
8. **Anti-bloat: the JS surface only shrinks.** Prefer deleting or reusing over adding. **Never add a new JS file, npm dependency, or test file without explicitly asking Francesco first.** Unit tests are only for behaviour that fails invisibly (persistence, generated output, media logic); features whose breakage is obvious by clicking the page get no jsdom test — see testing-guide.md.
9. **Extract hand-rolled null-guard chains into named helpers.** Each link of `a && a.b && a.b.c` or `x || y || z` is a cyclomatic branch, and fallow counts `?.`/`??` identically — modernising the syntax does not lower the score, only moving it does. Pull the chain into a named top-level function (see `thumbSeed`/`trustedLastmodValue` in `src/config/eleventy/filters.js`); the caller drops under threshold and the fallback rule becomes testable alone.

## Common gotchas

| Issue | Fix |
|---|---|
| A `--space-*` / `--font-weight-bold` / `--color-{success,warning,error,info}` / `--input-border-color` value doesn't match source | cleacss defines that token unlayered; a layered override loses. Put it in the `overrides` mixin in `_cleacss-overrides.scss`, `@include`d after the cleacss `@use` (CSS rule 3) |
| cleacss not applying dark mode | Check `[data-theme]` attribute on `<html>`; or verify LightningCSS is processing the output |
| Text colour not changing with the palette | Text uses `--neutral-*` tokens which are intentionally near-neutral — only `--color-accent` changes with the palette |
| Font not loading | Check `src/assets/fonts/` has the woff2 file; passthrough copy requires the file to exist at build time |
| Build fails on Node 22+ | Confirm `browserslist@4.24.0` override is in `pnpm-workspace.yaml` |
| VS Code TypeScript error in `.njk` or `.js` | `tsconfig.json` at root is intentionally minimal — `checkJs: false` |
| `fallow health` flags a CRAP score on well-tested code | No coverage provider is installed, so fallow scores every function against a flat 40% coverage guess. Read `cyclomatic` before acting — under 20 with real tests behind it, the estimate fired, not the code |
| Build throws `Too many featured work projects` | More than 3 `src/work/` posts have `featured: true`; the `workFeatured` collection caps at 3. Drop `featured: true` on the extras |
| Body image has no spacing, no caption, or two images stack flush | Markdown `![]()` — adjacent ones share one `<p>` and the `.case-study` selectors miss them. Use `figureImg` (see Long-form pages) |
| An inline SVG icon in `<main>` is invisible but still clickable | `header svg, main svg` (Illustrations) pads **every** SVG in `<main>`; padding over the declared size inflates the border-box and collapses the icon viewport to 0. Add `padding: 0; max-inline-size: none` to the icon's own rule |
| Accordions open instantly or leave a gap on close in Firefox only | Firefox runs no transitions on `::details-content` (checked frame by frame: opacity jumped, a delayed `content-visibility` flip left the answer's padding for `--dur-medium`). `index.scss` has a `@supports (-moz-appearance: none)` block: no transition there, a fade-in keyframe on the answer instead. Chrome/Safari keep the height tween |
| A style change doesn't show under `pnpm start` | The dev server can keep serving old CSS after an edit to an SCSS partial (`_components.scss`, `_icons.scss`). Compare `curl localhost:8080/css/index.css` with the source, and restart `pnpm start` if they differ |
| Opening image doesn't bleed, or every image animates the same | `.case-study__intro` is missing or isn't the first child; `settle` keys off it |

## Browser automation blocklist

**Agents may not install or use puppeteer, playwright, or any browser-automation libraries without explicit user consent.** This includes MCP servers (Chrome DevTools MCP, Firecrawl, etc.) unless the user explicitly requests them for a specific task. Motivation: prevent accidental browser-session automation and ensure transparency around external system interaction.

## License

[GPL-3.0](LICENSE.md) — see [LICENSE.md](LICENSE.md) for full text.
