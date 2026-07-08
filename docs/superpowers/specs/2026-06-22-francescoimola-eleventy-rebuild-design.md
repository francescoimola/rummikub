# francescoimola.com — Rebuild on Eleventy

**Date:** 2026-06-22
**Status:** Spec approved

## Problem

The current live site (`rummikub`, an Astro 5 + React 19 + TypeScript project with
Radix UI, Formik/Yup, Motion/Lenis, deployed on Cloudflare Pages via Wrangler) has
become too hard to maintain. The owner is a designer who works comfortably in
HTML/CSS/SCSS/Markdown but not in React/TypeScript/component frameworks. The stack
carries far more machinery than the site actually needs, and AI-assisted changes break
in ways that are hard to trace across its many layers.

A new, simpler design (~90% done in Figma) is almost ready: it has fewer components, a stripped-down
copy, and it reuses rummikub's palette and typography. This is therefore a **fresh build with a
simpler design based on the original rummikub design**, not a rescue of the existing codebase.

## Goal

A site the owner can maintain themselves with AI as a helper — where changes are
legible and hard to break — without a developer dependency for routine work.

**Maintainability bar:** "Self + AI as helper." The codebase must be simple enough that
AI changes rarely break things and the owner can usually understand what changed.

## Decision: Eleventy

Chosen over (B) a stripped-down Astro and (C) Kirby CMS.

- **Eleventy** keeps the entire stack inside languages the owner already speaks
  (Nunjucks ≈ HTML + includes/loops, Markdown content, SCSS). It removes the whole
  class of problems that buried rummikub (TypeScript errors, React state, hydration,
  Radix, Wrangler functions).
- **Astro (stripped)** was rejected for a specific, deliberate reason: even a pure-Astro
  build (no React/TS) keeps `.astro`'s JS-expression templating, which sits just outside
  the owner's "read and fix it unaided" bar and would still require longer AI
  back-and-forth to debug. This is a known skills gap the owner has chosen not to spend
  time closing right now. Nunjucks + Markdown + SCSS clears that bar; `.astro` does not.
  (The rebuild is therefore driven by *legibility to the owner*, not by rummikub
  "breaking" — it works fine; it's just harder for the owner to maintain than the
  Eleventy stack would be.)
- **Kirby** was rejected: its visual Panel is appealing, but it needs PHP hosting and a
  developer to set up/maintain, reintroducing the dependency being escaped, for a site
  whose only real dynamic need is a Markdown blog.

Both things the owner explicitly wanted to retain favour Eleventy:
- **Image compression / Lighthouse:** `@11ty/eleventy-img` (already in devDependencies)
  is best-in-class — responsive `<picture>`, AVIF/WebP, multiple widths, lazy-loading.
- **Scalability:** Eleventy's data cascade + collections is purpose-built for "many
  similar pages generated from structured content" (services, blog posts, playground).

**Escape hatch / future risk:** Content (Markdown + front matter) and styling (CSS) are
100% portable. If the site ever outgrows Eleventy, migration to Astro/React is
re-templating, not re-authoring. A freelance designer's brochure-plus-blog site is
squarely in Eleventy's sweet spot, so this is a low-likelihood risk with a cheap exit.

## Architecture

### Stack & deployment
- **Eleventy 3** — Nunjucks templates, Markdown content, SCSS.
- No framework, no TypeScript, no React.
- **cleacss** (https://moinfra.me/docs/moinframe-cleacss) as the plain-CSS foundation,
  **vendored as a local CSS file in the repo — NOT installed via npm/pnpm.** It is then
  layered with the owner's own SCSS. This removes the dependency/lock-in concern
  entirely: if cleacss is ever abandoned (maintained by moinframe since 2023), it is just
  a CSS file the owner already owns and can edit. cleacss is stack-agnostic and
  designer-friendly; no JS-framework knowledge required.
- **Design tokens / styling note:** rummikub stores its palette and typography as **CSS
  custom properties in `src/styles/global.css`** (it is plain CSS, not SCSS). Those
  tokens are carried into the Eleventy site's SCSS layer. Eleventy's SCSS pipeline comes
  from the old 11ty project.
- **`@11ty/eleventy-img`** for image compression.
- **Lenis** as a single optional `<script>` for smooth scroll;
- **Cloudflare Pages**, static output, **no functions** (none needed once the form is
  dropped). Build command `npx @11ty/eleventy`, plus output directory.

### Repository & cutover
- Work happens on a **branch (`eleventy-rebuild`) in the rummikub repo** (keeps repo,
  history, Cloudflare Pages project, and domain). Owner's explicit choice.
- This is a full stack **replacement** on the branch, not a mergeable feature branch:
  Astro files are removed as Eleventy files land. The live Astro site on `main` stays up
  untouched throughout.
- **Preview during the build is LOCAL** (`npx @11ty/eleventy --serve`). Cloudflare Pages
  branch previews are NOT available for this branch, because a Pages project has a single
  build configuration: it would try to build the Eleventy branch with the Astro build
  command and fail. Local live-reload is the working preview; this is acceptable for a
  designer iterating on layout.
- **Cutover:** make the branch `main`, then in the Cloudflare Pages dashboard change the
  project build command (`astro build` → `npx @11ty/eleventy`) and output dir
  (`dist` → Eleventy output). One project, reconfigured once. Rollback = revert the build
  config + git.
- **Local toolchain caveat:** `main` (Astro, pnpm) and the branch (Eleventy, pnpm) have
  different toolchains, so switching branches locally requires reinstalling dependencies.
  In practice the owner lives on the branch until cutover, so this rarely bites.
- Sound plumbing may be reused from either source: from the old 11ty project (Eleventy
  config, SCSS pipeline, `@11ty/eleventy-img` setup, blog/RSS); from rummikub (design
  tokens from `global.css`, any sound HTML structure, blog/playground content, and
  `design.md` as a reference).

### Content model (scalability core)
- `src/services/` — one Markdown file per service. Front matter holds the **volatile
  bits** (price, headline, CTA, order, summary); the Markdown body holds prose sections;
  fixed scaffolding lives in the layout. A `services` index page loops the collection.
- `src/blog/` — Markdown posts (carried over + new), RSS feed retained.
- `src/playground/` — Markdown entries; repositioned in the nav/UX but the same content
  model.
- Per-field, front-matter vs hardcoded-HTML is decided collaboratively, **defaulting to
  front matter for anything the owner would want to change quickly** (notably price and
  section copy per service).

### Pages
Built from the near-final Figma design — simpler layout, stripped copy, far fewer
components than rummikub:
- Home
- Services (index + a page per service)
- Blog (index + posts)
- Playground (index + entries)
- About
- Small pages: colophon, contact (via email), 404.

### Migration
- AI-assisted port of overlapping content from rummikub, reconciling the few edited/new
  entries.
- **Blog** is the clean case: it already lives in an Astro content collection
  (`src/content/blog`) as Markdown — a near 1:1 port.
- **Playground** is NOT a content collection in rummikub (content is hardcoded in
  pages/`constants.ts`); porting it means *extracting* that content into the new
  per-entry Markdown model, so budget more than a copy-paste.
- Image paths and any MDX-embedded components must be reconciled to Eleventy's image
  shortcode. Fonts are unsettled (the old 11ty repo is mid-way through removing the
  Ronzino woff files) — settle the webfont story explicitly during migration.
- Carry over design tokens from rummikub `global.css` and any sound HTML structure.

### SEO & URL continuity
- Goal: **preserve the URLs that matter**; ranking position is not a blocker, but dead
  links and RSS churn are avoidable and will be avoided.
- Inventory current live URLs: blog permalinks, service pages, playground entries, static
  pages, the RSS feed path, the sitemap.
- For every kept page, set Eleventy `permalink:` front matter so the new path **matches
  the old one exactly** (no redirect needed).
- For changed/dropped URLs, add **301 redirects via a `_redirects` file** (a plain static
  file Cloudflare Pages reads — no functions).
- Preserve the **RSS feed path and per-post GUIDs** so existing subscribers are not
  re-sent every post.
- Regenerate `sitemap.xml`.

### Automated verification (the type-safety replacement)
Dropping TypeScript removes a safety net; CI restores one so AI-assisted changes fail
loudly instead of shipping silently.
- **GitHub Action on every push:** `pnpm install --frozen-lockfile && pnpm run build` — a broken build fails
  CI before it reaches production.
- **Broken link/image checker** (lychee or linkinator) run against the built output —
  catches the most common content-site breakage.
- **Optional Lighthouse CI** on a couple of key pages with a perf/accessibility budget so
  regressions surface automatically.

## Deliberately dropped
- Contact form → `mailto:` / copy-email button (removes the single largest source of
  complexity).
- Formik, Yup, Radix UI, React, TypeScript.
- Cloudflare Functions, Wrangler.

## Deferred to optional Phase 2
- **GitCMS** (https://gitcms.dev) — a git-based, Markdown-first, Notion-like visual
  editor that commits Markdown directly to the repo (no shadow database, files stay
  yours; explicitly supports Eleventy; $49 one-time). Purely additive: content is
  Markdown + front matter in the repo either way, so Eleventy reads it identically
  whether typed by hand or via GitCMS. Design a clean content model now; bolt GitCMS on
  later if a nicer editing surface is wanted. No architectural impact, no lock-in, no
  developer needed.

## Success criteria
- Owner can edit content, services, copy, prices, and small layout bits using only
  Markdown/front matter/HTML/CSS.
- AI-assisted changes are legible, and a broken build or broken link **fails CI** rather
  than shipping silently.
- Lighthouse scores remain high (image pipeline retained; webfont and Lenis/JS cost
  consciously managed).
- Blog and playground content preserved; RSS feed path + GUIDs retained.
- Important URLs preserved; everything else 301-redirected via `_redirects`.
- Deployed on Cloudflare Pages with the existing domain.
