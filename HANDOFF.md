# HANDOFF — francescoimola.com rebuild (Astro → Eleventy)

**You are picking up a planned, not-yet-started rebuild.** This repo (`rummikub`) holds
the current **live Astro site** on `main`. You are on branch **`eleventy-rebuild`**,
where the site is being rebuilt as a simpler **Eleventy** site from a new (≈90% done)
Figma design. The owner is a designer comfortable with HTML/CSS/SCSS/Markdown but not
React/TypeScript/Astro — the whole point is a stack they can read and fix unaided, with
AI as a helper. The Astro site is **not broken**; it's just harder for the owner to
maintain than Eleventy would be.

## Read these first (in this repo, on this branch)
1. `docs/superpowers/specs/2026-06-22-francescoimola-eleventy-rebuild-design.md` — the
   approved design/spec (the **authoritative** decisions and rationale).
2. `docs/superpowers/plans/2026-06-22-francescoimola-eleventy-rebuild.md` — the
   implementation plan: full **Phase 1 (Foundation)** in bite-sized steps, plus a
   **Phases 2–5 roadmap** to expand later.

## The working reference (have this folder open too)
`/Users/francescoimola/Repositories/francescoimola - old/` is a **working, already-built
Eleventy site** and the primary reference for *how* to build this one — it already has
the image optimization, RSS, SCSS pipeline, base layout, blog, and card/meta includes.
Treat it as a **reference, not a source of truth**: reuse its proven plumbing where it
fits, but styling, much of the HTML, and the Nunjucks templates will deliberately differ
for the new design. **Reuse-with-review, never blind copy-paste.**

## Locked decisions — do NOT relitigate
- **Stack:** Eleventy 3 + Nunjucks + Markdown + SCSS. No React, no TypeScript, no Astro.
- **CSS:** `cleacss` **vendored as a local CSS file** (never `npm`/`pnpm` installed),
  layered with the owner's SCSS; design tokens come from rummikub `src/styles/global.css`.
- **Images:** `@11ty/eleventy-img` (ported from the old 11ty config) — keep for Lighthouse.
- **Repo/branch:** all work here on `eleventy-rebuild`; **never touch `main`** until
  cutover. This is a stack replacement on the branch, not a mergeable feature branch.
- **Preview:** **local only** (`npx @11ty/eleventy --serve`). No Cloudflare branch
  previews for this branch (the Pages project would build it with the Astro command).
- **Deploy:** stays on the existing Cloudflare Pages project; reconfigured at cutover per
  `docs/cutover-runbook.md` (created in Plan Task 6).
- **Verification replaces type-safety:** CI runs build + offline link check on every push.

## Explicitly dropped / deferred — don't add back
- **Dropped:** contact form (→ `mailto:`/copy-email), Formik, Yup, Radix, React,
  TypeScript, Cloudflare Functions, Wrangler.
- **Deferred to optional Phase 2:** GitCMS (https://gitcms.dev) as a content editor —
  purely additive, decide later, no architectural impact.

## Start here
1. Confirm you are on `eleventy-rebuild` (`git branch --show-current`).
2. Open the **plan** and begin at **Task 1** (its Step 1 — creating this branch — is
   already done; continue from writing the Eleventy `package.json`).
3. Work **task-by-task**, committing per the plan. Use superpowers:subagent-driven-development
   or superpowers:executing-plans.
4. "Tests" here are build/serve/grep/CI assertions (the plan explains this) — there is no
   unit-test framework.
5. **Figma MCP:** bring it in at **Phase 2** (design system & global chrome) — that is
   the first moment the agent needs to know what things look like. Phase 1 is pure
   plumbing (no visual work), so Figma is irrelevant there. From Phase 2 onwards, use
   the Figma designs as the primary reference for every layout, component, and page.
6. When the Figma design is final, expand Phases 2–5 into their own detailed plans before
   building pages/migrating content.

## Four risks to avoid — read carefully

### 1. Phases 2–5 are NOT detailed yet; you must write them before executing

The plan gives you **Phase 1 in full bite-sized detail** and **Phases 2–5 as roadmaps only**.
Do NOT start building Phase 2 (design system & chrome) by guessing. When Phase 1 is done:
- Read the Phase 2 roadmap in the plan.
- Use the Figma designs + the old 11ty project to understand what components/layout are needed.
- **Write a detailed Phase 2 plan (same format, same granularity as Phase 1)** before you touch code.
- Same for Phases 3, 4, 5 — one detailed plan per phase, then execute it.

**Why:** Scope creep and wasted work happen when phases are vague. The bite-sized approach
that protected Phase 1 must apply to every phase.

### 2. "Reference not source of truth" — you will be tempted to copy-paste from the old 11ty site. Don't.

The old 11ty project (`/Users/francescoimola/Repositories/francescoimola - old/`) is a
**working reference for HOW to build**, not WHAT to build. Its plumbing (image pipeline,
SCSS config, base layout structure) is sound — reuse that. But its **styling, HTML
structure, and layout are for a different Figma design**. You MUST adapt everything for
the new design.

**Concrete examples of "reuse vs. adapt":**
- ✅ **Reuse:** Copy `eleventy.config.js` verbatim — the image pipeline, RSS, markdown-it
  config are proven and unchanged.
- ❌ **Don't copy-paste:** The old site has a `_header.njk` with a megamenu and
  testimonials — the new design probably doesn't. Look at the Figma, design the NEW header,
  then use the old site's *structure* (if it helps) but not its content/layout.
- ✅ **Reuse:** The old site has `_post-base.njk` (blog post layout) — reuse its structure.
- ❌ **Don't copy-paste:** But the new design might have a different color scheme, spacing,
  or typography — adapt those from the Figma tokens.

**If you catch yourself writing "similar to the old site," pause. Refer to the Figma instead.**

### 3. Local toolchain: never work on `main`, only `eleventy-rebuild`. Protect it.

This branch has **Eleventy** (npm, different toolchain). `main` has **Astro** (pnpm, different
toolchain). Switching branches means reinstalling `node_modules` each time.

**You will almost never need to switch back to `main`.** Work entirely on `eleventy-rebuild`
until cutover. If you do switch:
```bash
git checkout eleventy-rebuild  # Switch back IMMEDIATELY
npm install  # Reinstall for Eleventy
```

**Critical:** Do not commit to `main` by accident. Every commit goes on `eleventy-rebuild`.
Confirm your branch: `git branch --show-current` should always print `eleventy-rebuild`.

### 4. Content migration is real work; don't underestimate

**Blog:** Markdown in `src/content/blog` on `main` (Astro) → Markdown in `src/blog/` on the
new Eleventy branch. Near 1:1 port. ✅ Mechanical.

**Playground:** NOT a content collection in rummikub — content is **hardcoded in
`src/pages/playground.astro` and/or `src/constants.ts`**. You must **extract** that
content into individual Markdown files for the new `src/playground/` collection. ⚠️ Real
work. Budget time.

**Images:** rummikub uses Cloudinary URLs in many places (remote images, auto-optimized).
The new site uses local images + `@11ty/eleventy-img`. You will need to:
- Swap Cloudinary URLs for local paths.
- Reconcile MDX-embedded components to Nunjucks/simple markup.
- Ensure paths work in the new image shortcode.

**Webfonts:** The old 11ty repo is mid-way through **removing Ronzino woff files**. Decide
NOW what fonts the new site uses (from the Figma design). Don't assume Ronzino is the
answer.

**Bottom line:** Content migration is not "copy the Markdown" — it's "extract, reconcile,
and adapt." Budget a full task per content type (blog, playground, images).

## Watch-outs flagged during planning
- **Blog** ports near 1:1 from `src/content/blog`; **Playground** is NOT a content
  collection (content is in pages/`constants.ts`) — extracting it is real work.
- **Webfonts unsettled** — the old 11ty repo is mid-way through removing the Ronzino woff
  files; settle the font story explicitly.
- **Lenis** adds JS that can hurt INP/CLS and scroll accessibility — add it consciously,
  not by default.
- **SEO/URLs:** preserve important permalinks via Eleventy `permalink:`; 301 the rest via
  a `_redirects` file; preserve the RSS feed path + GUIDs.
