# Sitemap

`src/sitemap.njk` → `/sitemap.xml`, built from `collections.all` (URL-sorted, trailing-slash pages only). Two opt-outs: `noindex: true` drops the page from the sitemap **and** emits the robots meta; `hidden: true` keeps a live page out of the writing listings and RSS but leaves it in the sitemap (`on-inner-desires`, linked from `/art/`). Never use `eleventyExcludeFromCollections` on a page that renders — it silently orphans it from the sitemap.

`<lastmod>` is emitted only when it's provably accurate: set **`updated: YYYY-MM-DD`** in frontmatter when you materially revise a page; writing posts fall back to `date`. Everything else omits the tag on purpose — Eleventy's default `page.date` is the file's creation time, which a fresh CI clone resets, so every deploy would stamp every URL with the build date and Google would stop trusting the whole file.
