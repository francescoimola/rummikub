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
6. SEO checks on the live domain:
   - `/robots.txt`, `/sitemap.xml` and `/404.html` respond; `/sitemap-index.xml` 301s to `/sitemap.xml`.
   - In Google Search Console, submit `/sitemap.xml` on the existing property.
   - Validate one writing post at https://validator.schema.org/ and with an Open Graph debugger (e.g. opengraph.xyz) — og:image must be an absolute URL.
   - Old service URLs 301 correctly: `/websites` → `/studio/design/`, `/consultations` → `/studio/consultations/`, `/blog/*` → `/writing/*`.

## Rollback
- Revert the build command/output dir to `astro build` / `dist`, or
- `git revert` the merge commit and redeploy.
