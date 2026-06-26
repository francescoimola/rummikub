# Phase 2 Handoff — francescoimola.com Eleventy Rebuild

This document is a complete handoff for continuing the rebuild of francescoimola.com. It contains full context, all key file contents, and a precise list of what is done vs what needs doing. You do not need access to the repository to understand the state of the project.

---

## Project Overview

Personal portfolio site for Francesco Imola. Being rebuilt from scratch on the `eleventy-rebuild` branch using Eleventy 3 + Nunjucks + SCSS. The old Astro/React stack has been removed from this branch entirely.

**Live site**: francescoimola.com  
**Stack**: Eleventy 3.x, pnpm, Nunjucks templates, SCSS compiled via `@11tyrocks/eleventy-plugin-sass-lightningcss` (which runs LightningCSS on the output)  
**Input dir**: `src/`  
**Output dir**: `public/`  
**Run**: `pnpm start` (dev server) / `pnpm build`

---

## What Is Done

### Build pipeline
- Eleventy 3 config in `eleventy.config.js`
- SCSS compiled via `eleventySass` plugin — entry point is `src/css/index.scss`, output is `public/css/index.css`
- Passthrough copies: `src/assets/favicon/`, `src/assets/fonts/`, `src/assets/*.js`, `src/robots.txt`, `src/_redirects`
- markdown-it + markdown-it-attrs for Markdown rendering
- `@11ty/eleventy-img` plugin for local image optimisation (webp + jpeg output)
- `@11ty/eleventy-plugin-rss` wired up
- Custom filters: `readableDate`, `split`, `limit`, `filterByCategory`, `slugify`, `urlencode`
- Custom shortcode: `remoteImg` (wraps Cloudinary/remote images with `eleventy:ignore`)
- Blog categories collection via `collectionApi.getFilteredByTag("blog")`

### CSS architecture
Four SCSS partials + one vendored CSS file, imported in `src/css/index.scss`:

```scss
// src/css/index.scss
@use 'fonts';
@use 'colors';
@use 'layout';
@import "vendor/cleacss.css";
```

**Important ordering rule**: In Dart Sass, all `@use` statements must come before any `@import` or CSS at-rules. Never put `@use` after `@import`.

**cleacss** (`src/css/vendor/cleacss.css`) — vendored v3.2.0, NOT npm-installed. It provides:
- A CSS reset in `@layer reset`
- OKLCH-based colour tokens using `light-dark()` for automatic light/dark mode
- `[data-theme="dark"]` / `[data-theme="light"]` attributes for manual override on `<html>` or `<body>`
- Uses `--lightningcss-light` / `--lightningcss-dark` flags (set by LightningCSS at build time)
- Does NOT auto-derive foreground colour from background — you must set both `--color-base-background` and `--color-base` together
- Has its own `.grid` class in `@layer layout` (12-col named-line system: `[full-start]`, `[content-start]`, `[content-end]`, `[full-end]`) — do not override `.grid`; use `.layout`, `.sidebar`, `.content` for page structure

**`_fonts.scss`** — 6 Ronzino `@font-face` declarations inside `@layer fonts`. Weights: 400 (Regular/Oblique), 500 (Medium/MediumOblique), 700 (Bold/BoldOblique). All use `font-display: optional`. Files live at `src/assets/fonts/Ronzino-*.woff2` and are served from `/assets/fonts/`.

**`_colors.scss`** — inside `@layer colors`:
- Full 12-step yellow scale (native oklch, hue 110.8) as `--yellow-1` through `--yellow-12`
- Full 12-step orange scale (native oklch, hue 61.47) as `--orange-1` through `--orange-12`
- Named surface anchor tokens at `:root`
- Three paired surface classes: `.surface-sidebar-orange`, `.surface-sidebar-yellow`, `.surface-content`
- Each class sets both `--color-base-background` and `--color-base` via `light-dark()` so background + text flip together automatically

**`_layout.scss`** — inside `@layer layout`:
- Utopia fluid type scale: `--step--1` through `--step-2` (16→24px base at 360→1920px viewport, Perfect Fourth 1.333)
- Utopia fluid space scale: `--space-3xs` through `--space-3xl` + custom pairs `--space-s-l`, `--space-m-xl`, `--space-l-2xl`
- Layout tokens: `--gutter: var(--space-s-l)`, `--sidebar-width: 16rem`, `--max-width: 108rem`
- `.layout` — CSS grid (`sidebar-width 1fr`), centered, `min-height: 100dvh`
- `.sidebar` — sticky, `height: 100dvh`, flex column with `justify-content: space-between` (nav at top, footer at bottom)
- `.content` — takes remaining width, padded with `--gutter`
- Responsive: stacks to single column below `48rem`, sidebar becomes `position: static`

### Page structure
- `src/_includes/_base.njk` — sidebar + content layout with surface classes applied:
  - `<aside class="sidebar surface-sidebar-orange">` contains `_header.njk` (top) and `_footer.njk` (bottom, pushed down by `space-between`)
  - `<div class="content surface-content">` contains `<main id="main-content">`
- `src/_includes/_header.njk` — bare stub: logo link in `<nav>`
- `src/_includes/_footer.njk` — bare stub: copyright line

### Head / meta
- `src/_includes/_head.njk` — preloads Ronzino (Regular, Medium, Bold), preloads + loads `index.css`, favicon links, includes `_meta.njk` and `_schema.njk`
- `src/_includes/_meta.njk` — viewport, noindex flag, meta description, canonical, hreflang, Open Graph tags
- `src/_includes/_schema.njk` — JSON-LD for homepage (Person + WebSite + WebPage), BlogPosting, Blog listing page, and generic WebPage fallback
- `src/_data/site.json` — global site data (`url`, `name`, `description`, `image`)

---

## Key File Contents

### `src/css/index.scss`
```scss
@use 'fonts';
@use 'colors';
@use 'layout';
@import "vendor/cleacss.css";
```

### `src/css/_layout.scss`
```scss
@use '../../node_modules/utopia-core-scss/src/utopia' as utopia;

@layer layout {

  :root {
    /* @link https://utopia.fyi/type/calculator?c=360,16,1.333,1920,24,1.333,2,1, */
    @include utopia.generateTypeScale((
      "minWidth": 360,
      "maxWidth": 1920,
      "minFontSize": 16,
      "maxFontSize": 24,
      "minTypeScale": 1.333,
      "maxTypeScale": 1.333,
      "positiveSteps": 2,
      "negativeSteps": 1,
      "prefix": "step-",
      "relativeTo": "viewport-width"
    ));

    /* @link https://utopia.fyi/space/calculator?c=360,16,1.2,1920,20,1.25,5,2, */
    @include utopia.generateSpaceScale((
      "minWidth": 360,
      "maxWidth": 1920,
      "minSize": 16,
      "maxSize": 20,
      "positiveSteps": (1.5, 2, 3, 4, 6),
      "negativeSteps": (0.75, 0.5, 0.25),
      "customSizes": ("s-l", "m-xl", "l-2xl"),
      "prefix": "space-",
      "relativeTo": "viewport-width",
    ));

    --gutter: var(--space-s-l);
    --sidebar-width: 16rem;
    --max-width: 108rem;
  }

  .layout {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    max-width: var(--max-width);
    margin-inline: auto;
    min-height: 100dvh;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--gutter);
    position: sticky;
    top: 0;
    height: 100dvh;
    overflow-y: auto;
  }

  .content {
    padding: var(--gutter);
  }

  @media (width < 48rem) {
    .layout {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: static;
      height: auto;
    }
  }

}
```

### `src/_includes/_base.njk`
```njk
<!DOCTYPE html>
<html lang="en">
{% include "_head.njk" %}
<body>
  <div class="layout">
    <aside class="sidebar surface-sidebar-orange">
      {%- include "_header.njk" -%}
      {%- include "_footer.njk" -%}
    </aside>
    <div class="content surface-content">
      <main id="main-content">{{ content | safe }}</main>
    </div>
  </div>
  <script src="/assets/app-core.js" defer></script>
</body>
</html>
```

### `src/_includes/_header.njk`
```njk
{# _header.njk #}
<nav><a href="/" class="logo">Francesco Imola</a></nav>
```

### `src/_includes/_footer.njk`
```njk
{# _footer.njk #}
<footer class="page-margins"><p>© 2026 Francesco Imola</p></footer>
```

### `src/_data/site.json`
```json
{
  "url": "https://francescoimola.com",
  "name": "Francesco Imola",
  "description": "Delightful things with pixels and words made by Francesco Imola from a seaside town in Kent.",
  "image": "https://francescoimola.com/assets/favicon/android-chrome-512x512.png"
}
```

### `src/css/_colors.scss`
```scss
@layer colors {

  :root {
    /* Yellow scale — native oklch, hue 110.8 */
    --yellow-1:  oklch(99.2% 0.0054 110.8);
    --yellow-2:  oklch(98.2% 0.0127 110.8);
    --yellow-3:  oklch(95.9% 0.0561 110.8);
    --yellow-4:  oklch(93.2% 0.089  110.8);
    --yellow-5:  oklch(89.7% 0.1109 110.8);
    --yellow-6:  oklch(85.3% 0.1109 110.8);
    --yellow-7:  oklch(79.5% 0.1109 110.8);
    --yellow-8:  oklch(72.4% 0.1109 110.8);
    --yellow-9:  oklch(34.4% 0.0739 110.8);
    --yellow-10: oklch(41.1% 0.0739 110.8);
    --yellow-11: oklch(54.4% 0.1109 110.8);
    --yellow-12: oklch(35.4% 0.0739 110.8);

    /* Orange scale — native oklch, hue 61.47 */
    --orange-1:  oklch(99.3% 0.0031 61.47);
    --orange-2:  oklch(98.2% 0.0234 61.47);
    --orange-3:  oklch(96.3% 0.0632 61.47);
    --orange-4:  oklch(93.2% 0.1101 61.47);
    --orange-5:  oklch(90.3% 0.1101 61.47);
    --orange-6:  oklch(86.8% 0.1101 61.47);
    --orange-7:  oklch(81.5% 0.1101 61.47);
    --orange-8:  oklch(75.1% 0.1101 61.47);
    --orange-9:  oklch(34.9% 0.0734 61.47);
    --orange-10: oklch(41.6% 0.0734 61.47);
    --orange-11: oklch(58.1% 0.1101 61.47);
    --orange-12: oklch(35.1% 0.0734 61.47);

    /* Surface anchors — tune these to adjust the palette */
    --sidebar-orange-light: var(--orange-3);
    --sidebar-orange-dark:  oklch(22% 0.06 61.47);
    --sidebar-yellow-light: var(--yellow-3);
    --sidebar-yellow-dark:  oklch(22% 0.06 110.8);
    --content-light:        oklch(100% 0 0);
    --content-dark:         oklch(30% 0.01 90);
  }

  .surface-sidebar-orange {
    --color-base-background: light-dark(var(--sidebar-orange-light), var(--sidebar-orange-dark));
    --color-base:            light-dark(var(--orange-9),             var(--orange-3));
    background-color: var(--color-base-background);
    color: var(--color-base);
  }

  .surface-sidebar-yellow {
    --color-base-background: light-dark(var(--sidebar-yellow-light), var(--sidebar-yellow-dark));
    --color-base:            light-dark(var(--yellow-9),             var(--yellow-3));
    background-color: var(--color-base-background);
    color: var(--color-base);
  }

  .surface-content {
    --color-base-background: light-dark(var(--content-light), var(--content-dark));
    --color-base:            light-dark(var(--yellow-9),      var(--yellow-2));
    background-color: var(--color-base-background);
    color: var(--color-base);
  }

}
```

---

## Design Intent

The site has a **sidebar + main content** layout:

- A narrow sidebar (default `16rem`) sits on the left with an orange tint; the main content area fills the rest with a white background in light mode
- The sidebar holds the site nav (top) and the footer (bottom) — `justify-content: space-between` on the flex column pushes the footer to the base of the sidebar
- In dark mode: the sidebar goes deepest (`oklch(22%)`) and the content area goes slightly lighter (`oklch(30%)`) — a deliberate depth gap to maintain visual separation
- The surface classes (`.surface-sidebar-orange`, `.surface-sidebar-yellow`, `.surface-content`) are all defined in `_colors.scss` and already applied to the HTML

The overall feel: warm, typographically-led, understated. Font is Ronzino (a humanist sans-serif).

Francesco wants to **write the HTML and CSS himself**. The role of an AI assistant here is to answer questions, flag issues, and help with specific implementation problems — not to generate the full design.

---

## What Needs Doing

### Phase 2 — Design (in progress, owner: Francesco)

1. **`src/_includes/_header.njk`** — fill in real nav: logo, navigation links (Home, Blog, About or similar). Currently a bare stub with just the logo link.

2. **`src/_includes/_footer.njk`** — fill in real footer content. Currently just a copyright line. Lives at the bottom of the sidebar.

3. **`src/css/_type.scss`** (new file) — font stack declaration, type scale (sizes, line heights, weights), heading styles. Apply `font-family: 'Ronzino', sans-serif` here. The fluid size tokens (`--step--1` through `--step-2`) are already generated in `_layout.scss`. Once written, add `@use 'type';` to `index.scss` before `@import "vendor/cleacss.css"`.

4. **`src/index.njk`** — replace placeholder content with the actual homepage design.

### Phase 3 — Blog

- Real excerpt/teaser shortcode for blog post collections (currently no teaser logic exists)
- Blog listing template
- Individual post template (`src/_includes/_post-base.njk` — may need creating)

### Phase 4/5 — Housekeeping

- Populate `src/robots.txt`
- Populate `src/_redirects` (Netlify redirects from old URLs)
- `docs/cutover-runbook.md` has a "Branch coexistence" section that is now obsolete (Astro was fully removed from this branch)

---

## Technical Constraints and Gotchas

- **Sass `@use` ordering**: All `@use` statements must appear before any `@import` or CSS at-rules in the same file. This is a hard Dart Sass constraint. Always add new `@use 'partial'` lines at the top of `index.scss`, before `@import "vendor/cleacss.css"`.

- **cleacss is vendored**: Do not `npm install` or `pnpm add` cleacss. It lives at `src/css/vendor/cleacss.css` and is imported with `@import "vendor/cleacss.css"`. It owns `@layer reset` and has its own `.grid` class in `@layer layout`. Do not write a `.grid` class — use `.layout`, `.sidebar`, `.content` for page structure.

- **`@layer` names in use**: `reset` (cleacss — do not write to it), `fonts`, `colors`, `layout`. New layers (`type`, etc.) go in new `@use`d partials.

- **`utopia-core-scss` path**: The Sass plugin (`@11tyrocks/eleventy-plugin-sass-lightningcss`) only adds `src/css` to the Sass load path. To reach `node_modules`, use a relative path from the partial's location: `@use '../../node_modules/utopia-core-scss/src/utopia' as utopia`. Do not use a bare `node_modules/...` path — it won't resolve.

- **Utopia grid rejected**: Utopia's `.u-container`/`.u-grid` system was evaluated and rejected. The project uses the fluid tokens from the Utopia space + type scales (`--space-*`, `--step-*`) but not the column grid. Layout is done with CSS grid directly (`.layout` class).

- **`--gutter` token**: `--gutter: var(--space-s-l)` — a fluid clamp from the Utopia space scale. Use it for padding, gaps, and spacing throughout.

- **Color mode**: cleacss uses `light-dark()` natively. Set `[data-theme="dark"]` on `<html>` to force dark mode manually. OS preference works automatically.

- **OKLCH colours**: Native oklch renders P3-wide automatically. No `@supports (color: color(display-p3))` block needed.

- **Font preloads**: `_head.njk` preloads only Regular, Medium, and Bold weights. If oblique/italic variants are needed above the fold, add preload hints there too.

- **`browserslist` pin**: `pnpm-workspace.yaml` pins `browserslist` to `4.24.0` via a pnpm override. This is required — `browserslist@4.28+` fails on Node 22+. Do not remove this override.

- **`public/` is build output**: Do not commit files to `public/`. Eleventy generates it. It is gitignored on this branch.

- **Assets to recover in Phase 4**: Favicons now live at `src/assets/favicon/`. Fonts now live at `src/assets/fonts/`. Both are passthrough-copied by Eleventy. If any are missing, recover from `git show main:public/fonts/<filename>` or `git show main:public/favicon/<filename>`.
