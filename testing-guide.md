# Testing Guide

## Map of the JavaScript

There are four groups of JS in this repo, ~1,300 lines of code total (excluding tests). If you can read this table, you can find anything.

| Where | What | Module style |
|---|---|---|
| `src/assets/scripts/` | Code that runs in the browser: video player, theme/palette toggles, copy-email buttons, nav menu, WebMCP tools | ESM (`import`/`export`) |
| `src/config/eleventy/` | Build-time code: filters, shortcodes, collections, transforms, markdown twins. Wired up by `eleventy.config.js` | CommonJS (`require`/`module.exports`) — Eleventy config must be |
| `scripts/` | One-off maintenance CLIs run by hand: `pnpm optimize:video` (also called by the Pages CMS GitHub workflow — don't delete) and `pnpm compress:assets` | ESM |
| Repo root | `eleventy.config.js` (build config) and `vitest.config.js` (test config) | CJS / ESM respectively |

Two things that look odd but are intentional:

- **Lenis** (smooth scrolling) is an npm dependency. The build copies `node_modules/lenis/dist/lenis.min.js` into `assets/scripts/` (see `eleventy.config.js`), so updating it is just `pnpm up lenis` and a rebuild. The 4-line `src/assets/scripts/lenis.js` starts it.
- A few files carry `fallow-ignore` comments (`lenis.js`, `app-core.js`, `writing.11tydata.js`, `markdown-twins.js`). These tell the fallow analyzer to skip known gaps — they are deliberate, leave them alone.

## Running tests

```bash
pnpm test                # all tests, once
pnpm build && pnpm test  # what to run before committing
```

Vitest discovers anything matching `*.test.js` automatically. **The four `built-*` tests (plus `site-images.test.js`) read the `public/` folder, so they need `pnpm build` first** — on a fresh checkout they fail with a message telling you exactly that (`src/config/require-build.js`).

## What gets a test — and what doesn't

A test costs you nothing while the code is untouched. It costs you time in one moment only: when it fails and you have to work out why. That is also the only moment it helps. So:

- **Behaviour that fails invisibly gets a test.** Saved preferences, generated XML/HTML, CSS layer order, lazy-video logic — you would never spot these breaking by looking at the site.
- **Behaviour that fails visibly does not.** A copy-email button, a dialog, the nav menu — click the live site and you know in ten seconds. Tests for these were deliberately deleted (2026-09); don't re-add them.
- **Escape hatch:** if a browser-script test fails and you can't fix it in a reasonable time, deleting the test is an acceptable outcome. The built-output tier is the one that must always stay green.

## The 15 test files

### Built-output tests — the most important tier (need `pnpm build` first)

These check the actual shipped site in `public/`, so they catch mistakes anywhere in the chain — template, config, or data.

- **src/built-css.test.js** — one stylesheet, no runtime `@import`, layer order, icon glyphs, masonry rules
- **src/built-feeds.test.js** — both RSS feeds carry the right categories; hidden posts stay out
- **src/built-landmarks.test.js** — every page has correct landmark markup (skip link, banner, main)
- **src/built-markdown.test.js** — every page ships its `.md` twin, plus `llms.txt`

### Eleventy config tests (`src/config/eleventy/`)

Each config module exports a function that registers things with Eleventy. Tests mock the config object, call the function, and test the registered callbacks. Copy `filters.test.js` to adapt.

- **filters.test.js** — `readableDate`, `split`, `limit`, `filterByCategory`, `slugify`, `urlencode`
- **collections.test.js** — `blogCategories` extraction and sorting
- **shortcodes.test.js** — `projectVideo` and `remoteImg` output plus render helpers
- **transforms.test.js** — `ignoreRemoteImages`, `lazyImages`
- **markdown.test.js** — remote images get `eleventy:ignore` via the markdown renderer
- **markdown-twins-helpers.test.js** — HTML→markdown twin conversion helpers
- **site-images.test.js** — absolute image URLs in `site.json` point at real built files (also needs `pnpm build` first)

### Browser-script tests (`src/assets/scripts/`)

Run in jsdom. These files are IIFE-style with no exports, so the pattern is: set up the DOM, then `await import("./the-file.js")` inside the test, with `vi.resetModules()` in `beforeEach` for a fresh import.

- **video-controller.test.js** — the fiddliest code in the repo: lazy-load via `IntersectionObserver`, play/pause, reduced motion, data-saver. Failure modes are silent — keep this one.
- **look-toggles.test.js** — theme/palette toggles stay in sync across sidebars and survive storage failures (silent persistence logic)
- **webmcp.test.js** — WebMCP tool registration; pins tool names to `src/well-known/webmcp.json`
- **stretch-text.test.js** — SVG viewBox fitting with a stubbed `getBBox`

## Rules

- Run `pnpm build && pnpm test` before committing.
- Test behaviour, not implementation. "When I click, content expands" — not "the handler calls `classList.toggle`".
- New Eleventy filter/shortcode/transform? Add a test.
- New browser feature? Only test it if breakage would be invisible (see above) — and ask Francesco before adding any new JS or test file (AGENTS.md, non-negotiable rules).
