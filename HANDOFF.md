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

## Watch-outs flagged during planning
- **Blog** ports near 1:1 from `src/content/blog`; **Playground** is NOT a content
  collection (content is in pages/`constants.ts`) — extracting it is real work.
- **Webfonts unsettled** — the old 11ty repo is mid-way through removing the Ronzino woff
  files; settle the font story explicitly.
- **Lenis** adds JS that can hurt INP/CLS and scroll accessibility — add it consciously,
  not by default.
- **SEO/URLs:** preserve important permalinks via Eleventy `permalink:`; 301 the rest via
  a `_redirects` file; preserve the RSS feed path + GUIDs.
