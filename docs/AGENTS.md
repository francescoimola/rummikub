# Rummikub — Francesco Imola's portfolio

Astro 5.17+ + React 19.2+ (@astrojs/react 5.0.6+) + Radix UI Themes v3. Deploys to Cloudflare Pages. Package manager: **pnpm**.

## Reference docs (load before major work)

- **Visual system:** [../design.md](../design.md) — tokens, components, motion, patterns
- **Architecture:** [architecture.md](architecture.md) — technical deep-dive
- **Voice & tone:** user skill `francesco-imola` (auto-loads in Claude Code)
- **PostCSS:** [POSTCSS_SETUP.md](POSTCSS_SETUP.md)

## Commands

```bash
pnpm install
pnpm astro build                    # Build
npx wrangler pages dev ./dist       # Test built output locally
pnpm astro add <integration>        # Add official integrations (preferred over manual config)
pnpm compress:assets                # Losslessly recompress src/assets PNGs/JPEGs (run after adding new source images)
```

**Never run `pnpm dev` / `npm run dev`** unless the user explicitly asks. They manage their own running processes.

## Deploy

```bash
git checkout main && git merge development && git push origin main && git checkout development
```

Solo workflow, no PRs. `main` auto-deploys to Cloudflare. Active work happens on `development`.

## Non-negotiable rules

1. **Radix first.** Use Radix Themes primitives (`Box`, `Flex`, `Grid`, `Container`, `Section`, `Text`, `Heading`, `Button`, `Link`) before custom HTML/CSS. Icons from `@radix-ui/react-icons`.
2. **No rounded corners.** Theme is `radius="none"`. Do not add `border-radius` anywhere except the existing dialog close button.
3. **Custom `--yellow-*` / `--orange-*` scales, not Radix `--accent-*`.** The site nests multiple `<Theme>` components (ServiceDialog, ContactForm, Footer, NewsletterForm) with different `accentColor` values. `--accent-*` resolves contextually and would produce inconsistent colours.
4. **No `client:*` directives on components that only display props.** Static-by-default. Only add for hooks (`useState`, `useEffect`) or event handlers. Never `client:load` on `<Theme>` unless runtime switching is required.
5. **CSS lives in `src/styles/global.css`.** Avoid component `<style>` blocks.
6. **Units:** `rem` for sizing, `dvh`/`dvw` over `vh`/`vw`, Radix space/size tokens over raw pixels or hex.
7. **Single `<h1>` per page.** Use semantic HTML5 (`<article>`, `<nav>`, `<section>`). Proper meta + JSON-LD via `<Head>` and `<JsonLd>` components.
8. **External links:** always `target="_blank" rel="noopener noreferrer"` and use `<ArrowTopRightIcon>` visually.
9. **Icon matching:** if a Figma icon resembles a Radix icon, use the Radix one. If significantly different, ask the user — do not import custom SVGs without approval.
10. **Figma fidelity:** don't hardcode px/hex values from Figma — map to Radix tokens or the custom scales in `global.css`. If a value doesn't map, ask.
11. **Verification:** never rely on visual inspection or spin a browser unless asked. Use computed-style checks and code inspection.
12. **Update [architecture.md](architecture.md)** when project structure, inner workings, or core tech change.
13. **Prerender static pages.** Every `.astro` page in `src/pages/` that doesn't need runtime SSR APIs (`Astro.request`, cookies, sessions, dynamic redirects) MUST start with `export const prerender = true;`. Without it, Cloudflare serves the page via SSR and the `<Image>` component falls back to a runtime `/_image?` endpoint that bypasses the build-time optimised variants — shipping the original full-resolution image instead. Symptom: PageSpeed/Ecograder reports flag `_image?href=...` URLs in the multi-MB range.
14. **`<Image>` / `<Picture>` MUST declare `widths` and `sizes`.** Without `widths`, Astro keeps the source-resolution image as the `<img>` fallback in the generated srcset, so the original ships even when avif/webp variants exist. Use widths that match the actual displayed size at common breakpoints (typically `[400, 600, 800]` for cards, `[600, 900, 1200, 1600]` for full-bleed in-page images, `[300, 500, 700, 900]` for portraits/avatars).

## Layout slots

`Layout.astro` exposes named slots: `heading`, `role`, `description`, `page-content`, `bottom-cta`, `structured-data`. See any page in `src/pages/` for usage.

## Repository structure

| Path | Purpose |
|---|---|
| `src/pages/` | File-based routing (`.astro` → routes) |
| `src/layouts/Layout.astro` | Master layout (hero grid, nav, footer mount) |
| `src/components/` | UI components (`.tsx` for React, `.astro` for static) |
| `src/components/icons/` | SVG icons (brand logos, tool icons) |
| `src/components/project/` | Case study display components |
| `src/components/mdx/` | MDX blog post components |
| `src/content/` | MDX content collections (blog, projects) |
| `src/styles/global.css` | Design tokens, font imports, overrides |
| `src/utils/` | Helper functions |
| `src/assets/` | Images (Astro image optimisation) |
| `src/constants.ts` | SEO, SITE_DATA, EXTERNAL_URLS |
| `public/` | Static assets (fonts, favicon, OG images) |

## Common gotchas

| Issue | Fix |
|---|---|
| High TBT / slow TTI | Remove unnecessary `client:*` directives from static components |
| Build fails, dev works | Wrap `window` usage in `if (typeof window !== 'undefined')` |
| Inconsistent accent colour across nested `<Theme>` | Use `--yellow-*` / `--orange-*`, not `--accent-*` |
| TypeScript prop errors | Import `type { ComponentProps } from "react"` and extend |
| CSS not applying | Check specificity; prefer Radix props before custom CSS |
| Audit tool flags multi-MB `_image?href=...` URLs | Page is missing `export const prerender = true;` — add it (see rule #13) |
| Audit tool flags large image transfer despite `<Picture>` | `<Image>`/`<Picture>` is missing `widths`/`sizes` — add them (see rule #14) |
| New source image is huge | Run `pnpm compress:assets` (idempotent, only rewrites if smaller) |
| Project case study video loading too eagerly for audit bots | Already mitigated: `ProjectVideo.astro` IntersectionObserver uses `rootMargin: "25% 0px"`, so headless audit bots without scroll never trigger a fetch |
| Page content (e.g. the About TOC) only shows after a hard reload, not on normal navigation | Two competing view-transition systems were active at once: Astro's `<ClientRouter />` (SPA client-side DOM swap) **and** native `@view-transition { navigation: auto }` (cross-document) — Astro treats these as mutually exclusive. Fix: keep **only** native cross-document transitions. **Do not re-add `<ClientRouter />`.** The crossfade + persistent header/footer come from `@view-transition` in `global.css` plus the `viewTransitionName` styles on the logo/nav/footer in `Layout.astro`. Every navigation is now a full document load (behaves like a hard reload), which also sidesteps the React 19 + ClientRouter island-unmount bug (error #424) entirely. |

## When in doubt

Modern Astro APIs (Actions, Sessions, Middleware) may be newer than model knowledge — check [docs.astro.build](https://docs.astro.build/). When a design decision is ambiguous, ask rather than assume.
