# Pages CMS

Content and media are editable via Pages CMS, configured in `.pages.yml` at the repo root (per-branch). Uploads land in `src/assets/` and are written as `/assets/...` URLs.

- **Collections** `work` (`src/work`, sorted by `endDate` desc, `featured` boolean) and `writing` (`src/writing`, sorted by `date` desc, `type` select) edit each `.md`'s frontmatter and body. Add a `writing` entry with `external`+`source` set (leave `permalink`+`body` blank) for a link-only Substack item. `writing.11tydata.js` (excluded from CMS) holds dir metadata + computed permalink.
- **Structured data files** (`artProjects`, `explorations`, `faqs`, `testimonials`, `collaborate`, `recognition`, and the contact fields in `site.json`) are edited through their `.pages.yml` entries, which hold the field shapes; read the entry before changing a data file. Gotchas: `faqs` answers are Markdown, rendered by the `markdown` filter in `faqList`; `explorations` uploads go to `src/assets/explorations`; `ctaCard` is imported `with context` so its defaults can read `site.json`.
- **Raw editors** for `_headers`, `_redirects`, `robots.txt` — `format: code`, no structured fields.
- **`body` fields are `type: text`, never `rich-text`** — posts mix markdown with Nunjucks shortcodes (`figureImg`, `projectVideo`) that a rich-text round-trip would corrupt.
- `settings.content.merge: true` preserves keys in `artProjects.json` that aren't in the schema.
- **Optimize-videos action:** the media page's button dispatches `.github/workflows/pages-cms-optimize-videos.yml`, which installs ffmpeg, runs `pnpm optimize:video`, and commits the mp4/webm/jpg back to the branch. Raw `.src.*` files are picked up automatically; existing outputs are skipped (pass `--force` to redo).
