# Testing Guide

## Map of the JavaScript

There are four groups of JS in this repo, ~1,300 lines of code total (excluding tests). If you can read this table, you can find anything.

| Where | What | Module style |
|---|---|---|
| `src/assets/scripts/` | Code that runs in the browser: video player, palette picker, copy-email buttons, nav menu, WebMCP tools | ESM (`import`/`export`) |
| `src/config/` | Build-time code: filters, shortcodes, collections, transforms, markdown twins. Wired up by `eleventy.config.js` | CommonJS (`require`/`module.exports`) — Eleventy config must be |
| `scripts/` | One-off maintenance CLIs run by hand: `pnpm optimize:video` (also called by the Pages CMS GitHub workflow — don't delete) and `pnpm compress:assets` | ESM |
| Repo root | `eleventy.config.js` (build config) and `vitest.config.js` (test config) | CJS / ESM respectively |

Two things that look odd but are intentional:

- **Lenis** (smooth scrolling) is an npm dependency. The build copies `node_modules/lenis/dist/lenis.min.js` into `assets/scripts/` (see `eleventy.config.js`), so updating it is just `pnpm up lenis` and a rebuild. The 4-line `src/assets/scripts/lenis.js` starts it.
- A few files carry `fallow-ignore` comments (`lenis.js`, `app-core.js`, `writing.11tydata.js`, `markdown-twins.js`). These tell the fallow analyzer to skip known gaps — they are deliberate, leave them alone.

## Running tests

```bash
pnpm build && pnpm test  # the tests read public/, so build first
```

`pnpm lint` runs as a pre-commit hook from `scripts/hooks/`, wired up by `pnpm install`. GitHub runs lint, build and tests only when something lands on `main`.

## What gets a test

Only failures you can't see by looking at a page. Three files remain, and each reads the built site in `public/`:

- **src/built-feeds.test.js**: both RSS feeds carry the right categories, and hidden posts stay out.
- **src/built-markdown.test.js**: every page ships its Markdown copy, plus `llms.txt`.
- **src/built-landmarks.test.js**: titles, descriptions, landmarks, sitemap and redirects. `META_EXCEPTIONS` lists the older pages that miss the title and description targets. Fix one, then delete it from the list.

## Builds and worktrees

- The tests read `public/`. Two builds in one checkout clobber each other; a failed `ELIFECYCLE` build that passes on a quiet re-run was this.
- Every worktree has its own `public/` and builds cold in 4–10 minutes (images re-optimize because they live in `public/`). Build and test inside your worktree; avoid the main checkout while another agent works there.
- `pnpm test` reads the current checkout's `public/`. After `pnpm start`, run `pnpm build` again before testing: dev output links the focal picker and fails `built-landmarks`.
- In a worktree, run git as separate plain commands; merge and push from the main checkout.

## Bugs only a browser shows

Agents can't drive a browser. For Firefox-only or timing bugs, hand Francesco a console snippet that logs state per frame and ask for the output pasted back; ready-made probes and how to hand results back are in [docs/devtools-probes.md](docs/devtools-probes.md).

## Known Firefox console warnings

Firefox lists CSS it doesn't support as console warnings. They are progressive enhancement, not bugs, and wrapping the rules in `@supports` doesn't silence them (Firefox still reports declarations inside a failed block). Triaged in #67 with a frame-by-frame log; the page had zero JS errors and no failed requests.

- **Ours, expected:** `::scroll-button()` (carousel arrows, Chromium only), `animation-timeline` / `animation-range` (scroll animations, `scroll-fallback.js` covers Firefox), `interpolate-size`, `text-wrap: pretty` / `text-wrap-style: pretty`.
- **Vendored cleacss (never edit):** `grid-column-start: 0`, `::-ms-track` / `::-ms-thumb`.
- **Added by the build's vendor prefixing:** `-moz-column-gap`, `-webkit-text-size-adjust`.
- **Not ours:** anything from `popup.css`, `screenshot.css` or "Sublime highlighter" is a browser extension.
- **Font preload notices:** "preloaded with link preload was not used" for Ronzino Regular/Medium/Bold. The tags are correct (`crossorigin`, URLs match the `@font-face` rules) and each font is fetched once; treat it as a Firefox quirk, and keep the preloads because `font-display: optional` needs the fonts early.

A *real* problem is a red error: a JS exception, a 404, or a rule whose property Firefox supports but whose value is wrong.
