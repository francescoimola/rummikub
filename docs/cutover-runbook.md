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

## Branch coexistence during the rebuild

This branch deliberately still tracks the Astro/React/TypeScript stack
(`astro.config.mjs`, `tsconfig.json`, `wrangler.json`, and the
`src/**/*.astro|.tsx|.ts` files including `src/constants.ts`, `src/content/`,
`src/styles/global.css`). This is intentional, not leftover cruft:

- Eleventy only processes its own template formats (`.njk`, `.md`, `.html`);
  it ignores `.astro`/`.tsx`/`.ts` and the `.mdx` content, so these files are
  inert in the build (CI is green).
- The Astro `src/` is the **migration source** for later phases: blog Markdown
  (`src/content/blog`), playground content (hardcoded in `src/constants.ts` /
  `src/pages/playground.astro`), and design tokens (`src/styles/global.css`,
  already partially ported into `src/css/_tokens.scss`).
- Per the plan's constraint, Astro files are removed **as their Eleventy
  replacements land** (Phase 2 chrome → Phase 3 collections → Phase 4
  pages/migration), with the final Astro/React/TS removal completed at cutover
  (Phase 5). The new Eleventy collections live at `src/blog/`, `src/services/`,
  `src/playground/` — not `src/content/` — so they will not collide with the
  stale `src/content/config.ts`.

**Do not bulk-delete the Astro stack before its content has been migrated.**
