# Testing Guide

## Why tests exist

JS files toggle buttons, copy emails, control videos, format dates, generate HTML. Tests make sure those things keep working after you change something. Without them, you break something three files away and don't know until a user reports it.

## Running tests

```bash
pnpm test          # runs all tests once
```

Vitest discovers anything matching `*.test.js` automatically.

## What each test file covers

### Browser-side code (`src/assets/scripts/`)

- **mailto-copy.test.js** — clicks a `mailto:` link, checks email copies to clipboard, "Email copied!" appears then reverts after 2s. Uses `vi.useFakeTimers()` to fast-forward.
- **video-controller.test.js** — tests lazy-loading via `IntersectionObserver`, play/pause, reduced-motion handling. Mocks `IntersectionObserver` and `navigator.connection`.

### Eleventy config (`src/config/eleventy/`)

Each file exports a function that registers something with Eleventy. Tests mock the config object, call the function, test the registered callbacks.

- **filters.test.js** — `readableDate`, `split`, `limit`, `filterByCategory`, `slugify`, `urlencode`
- **collections.test.js** — `blogCategories` extracts and sorts unique categories from blog posts
- **shortcodes.test.js** — `projectVideo` and `remoteImg` HTML output, plus `renderSources`, `renderAttr`, `renderFigcaption` helpers
- **transforms.test.js** — `ignoreRemoteImages` adds `eleventy:ignore` to remote imgs; `lazyImages` adds `loading="lazy"` and `decoding="async"`
- **markdown.test.js** — remote images get `eleventy:ignore` via the markdown renderer

## Adding tests for new code

Add a `.test.js` file next to the source file. Vitest finds it automatically.

**Browser IIFEs with no exports:** set up the DOM first, then `await import("./your-file.js")` in each test. Call `vi.resetModules()` in `beforeEach` for a fresh import.

**Eleventy config modules:** mock the config object, call the exported function, test the callbacks. Copy `filters.test.js` and adapt it.

## Rules

- Run `pnpm test` before committing.
- Test behaviour, not implementation. "When I click, content expands" — not "the handler calls `classList.toggle`".
- New Eleventy filter/shortcode/transform? Add a test.
- Browser JS change? Update the test file.
