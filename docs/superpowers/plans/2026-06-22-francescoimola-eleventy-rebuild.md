# francescoimola.com Eleventy Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild francescoimola.com as a simple, owner-maintainable Eleventy site (new Figma design) on a branch in the rummikub repo, replacing the current Astro site at cutover.

**Architecture:** A static Eleventy 3 site — Nunjucks layouts, Markdown content, an SCSS pipeline, and the `@11ty/eleventy-img` pipeline — porting the proven plumbing from the existing "old" 11ty project. No framework, no TypeScript, no React. Deployed on the existing Cloudflare Pages project, reconfigured at cutover.

**Tech Stack:** Eleventy 3, Nunjucks, Markdown (markdown-it + markdown-it-attrs), SCSS (`@11tyrocks/eleventy-plugin-sass-lightningcss`), `@11ty/eleventy-img`, `@11ty/eleventy-plugin-rss`, vendored cleacss, Cloudflare Pages.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-06-22-francescoimola-eleventy-rebuild-design.md` (authoritative; read it first).
- **Repo / branch:** all work on branch `eleventy-rebuild` in the rummikub repo (`/Users/francescoimola/Repositories/rummikub`). The live Astro site on `main` is never touched until cutover.
- **Reference source ("old 11ty"):** `/Users/francescoimola/Repositories/francescoimola - old/` — a **working, already-built Eleventy site** and the primary reference for *how* to build this one. It is a **reference, not a source of truth**: reuse its proven plumbing where it fits, but the new site's styling, much of its HTML, and its Nunjucks templates will deliberately differ (new Figma design). Reuse-with-review, never blind copy-paste. The agent executing this plan should have this folder available alongside the rummikub repo. Beyond the config and base layout already cited in tasks, these old-project pieces are reference material for later phases: image optimization (`@11ty/eleventy-img`, done), RSS setup (`@11ty/eleventy-plugin-rss`), the blog collection + post layout (`_post-base.njk`), `_project-card.njk`/`_selected-work-card.njk`, `_testimonials.njk`, `_cta.njk`, `_meta.njk`/`_schema.njk` (SEO/meta), the SCSS pipeline, and `src/_data/` patterns.
- **Eleventy dirs:** input `src`, output `public` (matches old 11ty config).
- **No new runtime services:** no Cloudflare Functions, no Wrangler, no contact-form backend. Contact = `mailto:`/copy-email only.
- **cleacss is vendored** as a local CSS file in the repo — never `npm`/`pnpm` installed.
- **Preview is local only** during the build (`npx @11ty/eleventy --serve`); no Cloudflare branch previews for this branch.
- **No TypeScript, no React, no Astro** in the new site. Astro files are removed as Eleventy files land.
- **"Test cycle" for this project** = the Eleventy build succeeding + the dev server rendering + output-file/grep assertions + the CI link check. There is no unit-test framework; verification is build- and output-based, which CI enforces (replacing the dropped type-checking).

---

## Scope

This plan covers **Phase 1: Foundation** in full, bite-sized detail — it produces a deployable, styled Eleventy skeleton with the image pipeline and CI verification in place. Phases 2–5 (content model, pages, content migration, cutover) are a roadmap at the end; each will be expanded into its own detailed plan once the Figma design is final and the rummikub content has been inventoried. The foundation is independently valuable: at the end of Phase 1 the branch builds, serves, is styled with the design tokens, optimizes images, and is guarded by CI.

---

## File Structure (Phase 1)

In the rummikub repo, on branch `eleventy-rebuild`:

- Create: `package.json` (replaces Astro's — Eleventy toolchain)
- Create: `eleventy.config.js` (ported from old 11ty)
- Create: `.gitignore` additions for `public/` and Eleventy caches
- Create: `src/index.njk` (placeholder home)
- Create: `src/_includes/_base.njk`, `_head.njk`, `_header.njk`, `_footer.njk` (ported, then simplified to the new design)
- Create: `src/css/index.scss` + `src/css/_tokens.scss` (SCSS entry + design tokens from rummikub `global.css`)
- Create: `src/css/vendor/cleacss.css` (vendored)
- Create: `src/assets/` (favicon, fonts — to be settled, app-core.js)
- Create: `.github/workflows/build.yml` (CI: build + link check)
- Create: `public/_redirects` (generated into output; redirect map skeleton)
- Create: `docs/cutover-runbook.md` (Cloudflare reconfiguration steps)

---

### Task 1: Branch + Eleventy toolchain (first green build)

**Files:**
- Create: `package.json`
- Create: `eleventy.config.js`
- Modify: `.gitignore`

**Interfaces:**
- Produces: a working Eleventy build (`npx @11ty/eleventy`) writing to `public/`; dirs input=`src`, output=`public`. Later tasks rely on these dir names and on the plugins/filters registered here (`readableDate`, `slugify`, `split`, `limit`, `filterByCategory`, `urlencode`, `teaser`, `remoteImg`, `blogCategories`).

- [ ] **Step 1: Create and switch to the branch**

```bash
cd /Users/francescoimola/Repositories/rummikub
git checkout main
git pull
git checkout -b eleventy-rebuild
```

- [ ] **Step 2: Write the Eleventy `package.json`**

Replace the existing `package.json` with the Eleventy toolchain. (Astro deps are removed; this is the stack swap.)

```json
{
  "name": "francescoimola",
  "version": "1.0.0",
  "description": "francescoimola.com — Eleventy rebuild",
  "scripts": {
    "start": "npx @11ty/eleventy --serve",
    "build": "npx @11ty/eleventy",
    "clean": "rm -rf public"
  },
  "license": "ISC",
  "dependencies": {
    "@11tyrocks/eleventy-plugin-sass-lightningcss": "^1.2.0",
    "markdown-it": "^14.1.0",
    "markdown-it-attrs": "^4.3.1"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.1.2",
    "@11ty/eleventy-img": "^6.0.4",
    "@11ty/eleventy-plugin-rss": "^2.0.4",
    "image-size": "^2.0.2",
    "jsdom": "^27.2.0"
  }
}
```

- [ ] **Step 3: Port the Eleventy config**

Copy `eleventy.config.js` verbatim from the old 11ty project (`/Users/francescoimola/Repositories/francescoimola - old/eleventy.config.js`). It already wires SCSS, RSS, markdown-it (+attrs, remote-image ignore), `@11ty/eleventy-img` (webp/jpeg, lazy/async, output `./public/assets/images`), passthrough copy (favicon, fonts, `*.js`, robots.txt), the `blogCategories` collection, and the filters/shortcodes listed in Interfaces. Do not modify it in this task.

- [ ] **Step 4: Update `.gitignore`**

Append:

```
# Eleventy
public/
.cache/
node_modules/
```

- [ ] **Step 5: Install and run the build**

```bash
cd /Users/francescoimola/Repositories/rummikub
pnpm install
npx @11ty/eleventy
```

> **Package manager: pnpm** (the repo's house tool — `main` uses it too). Use `pnpm`, never `npm`. Commit `pnpm-lock.yaml`. Dependency overrides go in `pnpm-workspace.yaml` (`overrides:`), per project convention — not npm's `package.json` `overrides`. Known override: `browserslist` must be pinned to a Node-26-safe version (`4.24.0`) — the latest (4.28.x) ships a multiline regex that Node 26 rejects, crashing the build.

Expected: build completes with no error. (It writes `public/` even with no templates yet, or reports "0 files"; either is acceptable — the requirement is **no crash**.)

- [ ] **Step 6: Commit**

```bash
git add package.json eleventy.config.js .gitignore
git commit -m "feat: scaffold Eleventy toolchain on rebuild branch

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Base layout + placeholder home (serves locally)

**Files:**
- Create: `src/_includes/_base.njk`
- Create: `src/_includes/_head.njk`
- Create: `src/_includes/_header.njk`
- Create: `src/_includes/_footer.njk`
- Create: `src/index.njk`

**Interfaces:**
- Consumes: Eleventy dirs/config from Task 1.
- Produces: layout `_base.njk` consumed by every page via `layout: _base.njk` front matter; expects page front matter `title` and optional `navtitle`. Pages set their own `<main>` content.

- [ ] **Step 1: Port and simplify `_base.njk`**

Start from the old 11ty `_base.njk` (see `/Users/francescoimola/Repositories/francescoimola - old/src/_includes/_base.njk`) and strip it to the new design's chrome (remove the signup-form include — there is no form in the new site):

```njk
<!DOCTYPE html>
<html lang="en">
{% include "_head.njk" %}
<body>
  <header>{%- include "_header.njk" -%}</header>
  <main class="page-margins">
    {% if page.url != '/' %}
    <div class="secondary-header pad-btt-lg"><h1>{{ navtitle | default(title) }}</h1></div>
    {% endif %}
    <div id="main-content">{{ content | safe }}</div>
  </main>
  {%- include "_footer.njk" -%}
  <script src="/assets/app-core.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Create `_head.njk` (minimal, valid)**

```njk
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }} — Francesco Imola</title>
  <link rel="stylesheet" href="/css/index.css">
</head>
```

(The SCSS entry compiles to `/css/index.css` — wired in Task 3. Full meta/OG tags are a Phase 2 task.)

- [ ] **Step 3: Create minimal `_header.njk` and `_footer.njk`**

```njk
{# _header.njk #}
<nav class="page-margins"><a href="/" class="logo">Francesco Imola</a></nav>
```

```njk
{# _footer.njk #}
<footer class="page-margins"><p>© {% year %} Francesco Imola</p></footer>
```

If the `year` shortcode is not defined, replace with `2026` for now and add the shortcode in Phase 2.

- [ ] **Step 4: Create the placeholder home page**

```njk
---
layout: _base.njk
title: Home
---
<p>Eleventy rebuild — foundation works.</p>
```

- [ ] **Step 5: Serve and verify locally**

```bash
npx @11ty/eleventy --serve
```

Expected: dev server starts; visiting the local URL shows the page with the heading/text. Confirm `public/index.html` exists and contains "foundation works".

```bash
grep -q "foundation works" public/index.html && echo OK
```

Expected: `OK`.

- [ ] **Step 6: Commit**

```bash
git add src/_includes src/index.njk
git commit -m "feat: base layout and placeholder home page

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: SCSS pipeline + vendored cleacss + design tokens

**Files:**
- Create: `src/css/index.scss`
- Create: `src/css/_tokens.scss`
- Create: `src/css/vendor/cleacss.css`

**Interfaces:**
- Consumes: the SCSS plugin from Task 1; `_head.njk` linking `/css/index.css` from Task 2.
- Produces: a compiled `public/css/index.css` applied to all pages.

- [ ] **Step 1: Vendor cleacss**

Download the cleacss stylesheet from https://moinfra.me/docs/moinframe-cleacss (direct CSS download, NOT npm) and save it verbatim to `src/css/vendor/cleacss.css`. Record the version in a top comment.

- [ ] **Step 2: Extract design tokens from rummikub**

Open `/Users/francescoimola/Repositories/rummikub/src/styles/global.css`, copy its `:root` custom properties (palette + typography), and place them in `src/css/_tokens.scss`:

```scss
:root {
  /* Paste palette + type custom properties from rummikub global.css here, verbatim. */
}
```

- [ ] **Step 3: Create the SCSS entry**

```scss
@import "vendor/cleacss.css";
@import "tokens";

/* Owner's own styles layer on top of cleacss + tokens. */
body { font-family: var(--font-body, system-ui, sans-serif); }
```

- [ ] **Step 4: Build and verify CSS is produced and linked**

```bash
npx @11ty/eleventy
test -f public/css/index.css && grep -q ":root" public/css/index.css && echo OK
```

Expected: `OK` (compiled CSS exists and contains the token block).

- [ ] **Step 5: Visual check**

```bash
npx @11ty/eleventy --serve
```

Expected: the home page now reflects cleacss defaults + the brand tokens (fonts/colors), not unstyled HTML.

- [ ] **Step 6: Commit**

```bash
git add src/css
git commit -m "feat: SCSS pipeline with vendored cleacss and rummikub design tokens

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Image pipeline smoke test

**Files:**
- Create: `src/assets/_smoke/sample.jpg` (any local test image)
- Modify: `src/index.njk` (temporarily render the image)

**Interfaces:**
- Consumes: the `eleventyImageTransformPlugin` configured in Task 1 (outputs to `public/assets/images`, formats webp/jpeg, lazy/async).

- [ ] **Step 1: Add a local sample image and render it**

Place any JPG at `src/assets/_smoke/sample.jpg`, then add to `src/index.njk` body:

```njk
<img src="/assets/_smoke/sample.jpg" alt="smoke test" width="800" height="600">
```

- [ ] **Step 2: Build and verify optimized variants are generated**

```bash
npx @11ty/eleventy
ls public/assets/images | grep -E "\.(webp|jpeg)$" && echo OK
```

Expected: at least one `.webp` and one `.jpeg` variant exist; `OK` prints. Confirm the `<img>`/`<picture>` in `public/index.html` points at `/assets/images/...` with `loading="lazy"`.

- [ ] **Step 3: Remove the smoke test**

Revert the `<img>` line in `src/index.njk` and delete `src/assets/_smoke/`. (Confirms the pipeline; not shipped.)

```bash
rm -rf src/assets/_smoke
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "test: verify eleventy-img pipeline generates optimized variants

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: CI verification (build + link check)

**Files:**
- Create: `.github/workflows/build.yml`

**Interfaces:**
- Consumes: `pnpm run build` from Task 1.
- Produces: a required status check that fails on a broken build or broken internal link.

- [ ] **Step 1: Write the workflow**

```yaml
name: build
on:
  push:
    branches: [eleventy-rebuild, main]
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - name: Link check
        uses: lycheeverse/lychee-action@v2
        with:
          args: --no-progress --offline public
          fail: true
```

(`--offline` checks internal links/assets against the built `public/` without hitting the network; remote-link checking can be enabled later.)

- [ ] **Step 2: Verify the build step locally before pushing**

```bash
rm -rf node_modules public
pnpm install --frozen-lockfile && pnpm run build
```

Expected: clean install and build succeed (mirrors what CI runs).

- [ ] **Step 3: Commit and push the branch**

```bash
git add .github/workflows/build.yml
git commit -m "ci: build and offline link check on every push

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
git push -u origin eleventy-rebuild
```

- [ ] **Step 4: Confirm CI is green**

```bash
gh run watch
```

Expected: the `build` workflow passes.

---

### Task 6: Cutover runbook + redirects skeleton (documentation)

**Files:**
- Create: `public/_redirects` (committed under `src` so it passes through, or emitted to output — see step)
- Create: `docs/cutover-runbook.md`

**Interfaces:**
- Produces: the operational steps and the redirect file the SEO task (Phase 4) populates.

- [ ] **Step 1: Create a passthrough `_redirects`**

Cloudflare Pages reads `_redirects` from the output root. Create `src/_redirects` with a placeholder comment and add a passthrough copy in `eleventy.config.js`:

```
# 301 redirect map — populated during the SEO/URL task (Phase 4)
# OLD_PATH  NEW_PATH  301
```

Add to `eleventy.config.js` (near the other passthrough lines):

```js
eleventyConfig.addPassthroughCopy("src/_redirects");
```

Verify it lands in output:

```bash
npx @11ty/eleventy && test -f public/_redirects && echo OK
```

Expected: `OK`.

- [ ] **Step 2: Write the cutover runbook**

Create `docs/cutover-runbook.md` documenting the one-time Cloudflare reconfiguration (to run only when the site is approved for launch):

```markdown
# Cutover runbook (Astro → Eleventy)

Run only when the Eleventy site on `eleventy-rebuild` is approved.

1. Merge `eleventy-rebuild` into `main` (this replaces the Astro site in the repo).
2. In the Cloudflare Pages dashboard → the francescoimola project → Settings → Builds:
   - Build command: `npx @11ty/eleventy`  (was `astro build`)
   - Build output directory: `public`      (was `dist`)
   - Framework preset: None
3. Trigger a deploy of `main`. Verify the *.pages.dev URL renders the new site.
4. Confirm the custom domain (francescoimola.com) still maps to this project.
5. Smoke-test key URLs and the RSS feed against the redirect map.

## Rollback
- Revert the build command/output dir to `astro build` / `dist`, or
- `git revert` the merge commit and redeploy.
```

- [ ] **Step 3: Commit**

```bash
git add src/_redirects eleventy.config.js docs/cutover-runbook.md
git commit -m "docs: cutover runbook and redirects skeleton

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Phases 2–5 — Roadmap (expand into detailed plans when the Figma design is final)

Each phase below produces working, reviewable software and should become its own
detailed bite-sized plan at the time it's started.

**Phase 2 — Design system & global chrome.** Build the real header/nav (with the
repositioned Playground link), footer, full `_head.njk` (meta/OG/favicons/webfonts —
and settle the Ronzino webfont question), the `year` and any helper shortcodes, and the
shared layout/spacing utilities from the Figma design. Deliverable: empty but
fully-chromed, on-brand pages.

**Phase 3 — Content model & collections.** Implement `src/services/` (one Markdown file
per service; front matter for price/headline/CTA/order/summary; body for prose),
`src/blog/`, and `src/playground/` collections, plus their layouts and index pages.
Decide per-field front-matter-vs-HTML with the owner. Deliverable: collections render
from sample content.

**Phase 4 — Pages, content migration & SEO.** Build Home, Services (index + per-service),
Blog (index + posts), Playground (index + entries), About, and small pages
(colophon, contact-via-email, 404) from the Figma design. Migrate blog (near 1:1 from
`src/content/blog`) and *extract* playground content from rummikub `constants.ts`/pages.
Reconcile image paths and any MDX components to the image shortcode. Build the SEO/URL
task: inventory live URLs, set `permalink:` to preserve them, populate `_redirects` with
301s, preserve the RSS feed path + GUIDs, regenerate `sitemap.xml`. Deliverable: the
complete site at content parity, links/RSS preserved.

**Phase 5 — Cutover & optional GitCMS.** Execute `docs/cutover-runbook.md`. Optionally
add Lighthouse CI to the workflow. Then, if wanted, connect GitCMS as a Phase-2 content
editor (no architectural change). Deliverable: the new site live on the domain with
rollback available.

---

## Self-Review notes

- **Spec coverage:** Stack/deploy → Tasks 1–5 + runbook; content model → Phase 3;
  pages → Phase 4; migration → Phase 4; SEO/redirects → Task 6 skeleton + Phase 4;
  automated verification → Task 5; cleacss vendoring → Task 3; dropped form/React →
  enforced by the Eleventy `package.json` in Task 1; GitCMS deferral → Phase 5.
- **Adaptation note:** the writing-plans TDD template assumes a unit-test framework;
  this is a static content site, so each task's "test" is a build/serve/grep/CI
  assertion (see Global Constraints). This is deliberate, not an omission.
- **Known dependency to confirm at execution time:** exact rummikub `global.css` token
  names (Task 3 Step 2) and the playground content location (Phase 4) must be read live
  in the rummikub repo, since they could not be fully inventoried from the old-11ty
  workspace where this plan was authored.
