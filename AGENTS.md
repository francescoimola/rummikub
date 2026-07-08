# Rummikub — Francesco Imola's portfolio

**Stack:** Eleventy 3 · Nunjucks templates · SCSS (compiled via `@11tyrocks/eleventy-plugin-sass-lightningcss` → LightningCSS) · pnpm · Deploys to Netlify (or Cloudflare Pages — TBD).

**Branch:** `development` — active development (`eleventy-rebuild` has been merged in). `main` still holds the old Astro site — do not touch until cutover (see Known gaps below).

## Reference docs

- **Voice & tone:** [voice-guide.md](docs/voice-guide.md)
- **Testing:** [testing-guide.md](testing-guide.md) — run `pnpm test` before committing

## Known gaps

The Eleventy rebuild's code migration is mostly done, but a few things are still open:

- Blog listing/post templates and collection not yet built (`src/_includes/_post-base.njk`, teaser/excerpt logic)
- `src/robots.txt` not yet populated
- `src/_redirects` is a stub — needs the real 301 redirect map from the old site
- Production cutover not yet done — `main` still runs the old Astro site on Cloudflare Pages; see [docs/cutover-runbook.md](docs/cutover-runbook.md)

## Commands

```bash
pnpm install          # Install dependencies
pnpm start            # Dev server (Eleventy --serve)
pnpm build            # Production build
pnpm clean            # rm -rf public
```

**Never run `pnpm dev` / `npm run dev`** — the dev script is `pnpm start`. Do not spin up a dev server unless the user explicitly asks.

## Project structure

| Path | Purpose |
|---|---|
| `src/` | All source files |
| `src/_includes/` | Nunjucks partials (`_base.njk`, `_head.njk`, `_header.njk`, `_footer.njk`, `_meta.njk`, `_schema.njk`) |
| `src/_data/site.json` | Global site data (`url`, `name`, `description`, `image`) |
| `src/css/index.scss` | SCSS entry point + all styles (theme, content modes, interactive, typography, layout) |
| `src/css/_fonts.scss` | Ronzino `@font-face` declarations (`@layer fonts`) |
| `src/css/_colors.scss` | Figma-generated colour scales (brand, neutral, success, warning, error, info) with light-dark() for dark mode (`@layer colors`). Brand scale is parametric (`--brand-hue`/`--brand-chroma`) |
| `src/css/_scale.scss` | Utopia fluid type + space scale tokens (`@layer type`) |
| `src/css/_view-transitions.scss` | View transition names and animations (`@layer view-transitions`) |
| `src/css/vendor/cleacss.css` | Vendored cleacss v3.2.0 — do NOT npm-install |
| `src/assets/fonts/` | Ronzino woff2 files (passthrough copied to `public/assets/fonts/`) |
| `src/assets/favicon/` | Favicon files (passthrough copied) |
| `src/assets/portfolio/` | Project videos (mp4/webm) + posters (passthrough copied to `public/assets/portfolio/`) |
| `scripts/optimize-videos.mjs` | Opt-in ffmpeg optimizer for project videos (`pnpm optimize:video`) |
| `public/` | Build output — gitignored, do not commit |
| `eleventy.config.js` | Eleventy configuration |

## Project videos

Embed lazy, autoplay-in-view videos with the `projectVideo` shortcode (defined in `eleventy.config.js`). Nothing downloads until an `IntersectionObserver` in `src/assets/scripts/app-core.js` sees the video near the viewport (`preload="none"` + `data-src`); it then autoplays muted and pauses when scrolled away. `prefers-reduced-motion` and slow connections (`navigator.connection`) get the play button instead of autoplay. Styling: `.project-video*` in `index.scss`.

```njk
{% projectVideo "/assets/portfolio/x.webm", "Alt text" %}                                  {# webm-only (Safari 16+) #}
{% projectVideo "/assets/portfolio/x.mp4", "Alt", webm="/assets/portfolio/x.webm",
                poster="/assets/portfolio/x.jpg", caption="Optional caption" %}             {# webm + mp4 fallback #}
```

- **Formats:** WebM (small) with an MP4 fallback is the safe default — WebM-only drops pre-16 Safari/iOS. Single-format `src` may be `.webm` or `.mp4` (no `type` attr; browser sniffs).
- **Optimize raw uploads:** drop `<name>.src.{mp4,mov,webm}` into `src/assets/portfolio/`, run `pnpm optimize:video` (needs system `ffmpeg` on PATH) → emits `<name>.mp4`, `<name>.webm`, and a `<name>.jpg` poster.

## CSS architecture rules

1. **`@use` before `@import`** — Dart Sass requires all `@use` statements to appear before any `@import` or CSS at-rules in the same file. Always add new partials as `@use 'partial'` at the top of `index.scss`, before `@import "vendor/cleacss"`.

2. **cleacss is vendored** — Lives at `src/css/vendor/cleacss.css`. Do not `pnpm add` it. Imported with `@import "vendor/cleacss"` (extensionless, forces Sass to pass it through as plain CSS).

3. **`@layer` names in use:** `reset` (cleacss — do not write to it), `fonts`, `colors`, `type`, `view-transitions`. Layers are for variable/token declarations only, except `view-transitions` which also contains `view-transition-name` assignments and keyframes. All other styles go unlayered in `index.scss`.

4. **Colour mode** — cleacss uses `light-dark()` natively. Set `[data-theme="dark"]` on `<html>` to force dark mode manually. OS preference works automatically.

5. **OKLCH colours** — native oklch renders P3-wide automatically. No `@supports (color: color(display-p3))` block needed.

6. **Content modes** — Pages set `contentMode: contrast` in frontmatter to give content a white background with accent-coloured links. Omit `contentMode` for the default flush layout where sidebar and content share the same background. Renders as `data-content="contrast"` on `.layout` in `_base.njk`.

7. **Colour scales** — All colour scales (`--brand-*`, `--neutral-*`, `--success-*`, `--warning-*`, `--error-*`, `--info-*`) use Figma-generated oklch values with `light-dark()` for dark mode. Scales use 50–950 step numbering. The brand scale's tokens are `--brand-{step}` (formerly `--green-*`) — named for their role, since the hue is re-tintable (see rule 9). Neutral has both solid (`--neutral-{step}`) and alpha (`--neutral-{step}-alpha`) variants. Alpha variants use the darkest neutral step as base (950 in light, 50 in dark) with consistent alpha values across modes.

8. **Cleacss semantic overrides** — `--color-success`, `--color-warning`, `--color-error`, and `--color-info` are defined in `_colors.scss` to override cleacss's hardcoded defaults. These link cleacss utility classes (`.has-text-success`, `.has-background-error`, etc.) and form validation states to our Figma scales (500 step).

9. **Brand re-tint knobs** — The brand scale (`--brand-{step}`) is parametric: every step's hue is `calc(var(--brand-hue) + <per-step offset>)` and chroma is `calc(<orig> * var(--brand-chroma))`. Both are registered via `@property` (`<number>`, so they animate). Defaults (`--brand-hue: 119.4`, `--brand-chroma: 1`) reproduce the original Figma scale exactly. Per-step hue offsets preserve each mode's hue-twist relative to base 119.4°. Re-tint the whole scale (and everything derived from it — `--color-accent`, hover, surfaces, content tokens) by changing `--brand-hue`/`--brand-chroma`: via the `:root[data-brand="…"]` hook in `_colors.scss` (currently `pink` → hue 350), via `brand: <name>` page frontmatter (rendered as `data-brand` on **`<html>`** in `_base.njk`), or from JS with `document.documentElement.style.setProperty('--brand-hue', 350)`. **The hook must target `:root`/`<html>`** — the `--brand-*` tokens are declared on `:root`, so their `var(--brand-hue)` is substituted there; overriding the hue on a descendant (e.g. `.layout`) only inherits the already-computed values and won't re-tint. Lower `--brand-chroma` (e.g. `0.85`) if a rotated hue looks over-saturated or clips gamut.

## Non-negotiable rules

1. **Nunjucks, not Astro.** Templates are `.njk`. There are no `.astro` files on this branch.
2. **No TypeScript.** `eleventy.config.js` is CommonJS. `tsconfig.json` exists only to keep VS Code quiet — `checkJs` is off.
3. **`public/` is build output.** Never commit files to `public/`. Recover missing static assets from `git show main:public/<path>` if needed.
4. **Semantic HTML.** Single `<h1>` per page. Use `<article>`, `<nav>`, `<section>`, `<aside>` correctly. Skip link (`#main-content`) must remain.
5. **`rem` for sizing, `dvh`/`dvw` over `vh`/`vw`.** No raw `px` values for layout.
6. **External links:** always `target="_blank" rel="noopener noreferrer"`.
7. **`browserslist` pin:** `pnpm-workspace.yaml` pins `browserslist@4.24.0`. Required for Node 22+. Do not remove.

## Common gotchas

| Issue | Fix |
|---|---|
| Sass error: `@use` after `@import` | Move all `@use` statements above `@import "vendor/cleacss"` in `index.scss` |
| cleacss not applying dark mode | Check `[data-theme]` attribute on `<html>`; or verify LightningCSS is processing the output |
| Text colour not changing with the palette | Text uses `--neutral-*` tokens which are intentionally near-neutral — only `--color-accent` changes with the palette |
| Font not loading | Check `src/assets/fonts/` has the woff2 file; passthrough copy requires the file to exist at build time |
| Build fails on Node 22+ | Confirm `browserslist@4.24.0` override is in `pnpm-workspace.yaml` |
| VS Code TypeScript error in `.njk` or `.js` | `tsconfig.json` at root is intentionally minimal — `checkJs: false` |
