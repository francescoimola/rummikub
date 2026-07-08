# Cutover runbook (Astro → Eleventy)

Run only when the Eleventy site on `development` is approved.

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
