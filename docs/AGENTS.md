# AI Agent Guide: Portfolio Project (Rummikub)

Welcome! This document provides context and guidelines for AI agents working on the **Francesco Imola's website** project (codenamed Rummikub).

## Project Overview

This is an **Astro-powered** portfolio website for Francesco Imola. It is built with React for interactivity and Radix UI Themes for styling. The goal is to this website is to showcase professional work and strengthen trust for new clients.

## Tech Stack

- **Framework**: [Astro 5.16+](https://astro.build/)
- **UI Framework**: [React 19.2+](https://react.dev/)
- **Design System**: [Radix UI Themes 3.2+](https://www.radix-ui.com/themes/docs/overview/getting-started) (primary)
- **Icons**: [@radix-ui/react-icons 1.3+](https://www.radix-ui.com/icons)
- **Content**: MDX support, Sitemap generation
- **Styling**: Radix UI Theme system + PostCSS (Vanilla CSS for overrides)
- **Deployment**: Cloudflare Pages (with Cloudflare adapter)
- **Package Manager**: pnpm
- **PostCSS**: autoprefixer, cssnano, postcss-preset-env

## Design Philosophy (CRITICAL)

- **Radix First**: Build UI using Radix Themes components, color system, and design tokens.
- **Swiss-Design**: Minimalist, premium feel. No glassmorphism. Sharp corners (`radius="none"`).
- **Figma Fidelity**: Implement designs as shown unless explicitly overridden.

## Guidelines

### 0. Critical Operational Constraints
- **NO Dev Server**: **NEVER** run `npm run dev` or `pnpm run dev` or spin up a development server without explicit, prior user confirmation. The user manages their own running processes.

### 1. Radix UI First
- **Always prefer Radix components** over custom HTML/CSS.
- Use Radix Themes for layout (Box, Flex, Grid, Container, Section).
- Use Radix Themes for typography (Text, Heading, Code, Quote).
- Use Radix Themes for interactive elements (Button, IconButton, Link, etc.).
- Custom CSS is only for very special cases or Radix style overrides.
- **Icons**: Always prefer `@radix-ui/react-icons` (installed via `pnpm`).
  - **Matching**: If a Figma icon resembles a Radix icon, use the Radix icon.
  - **Mismatch**: If the Figma icon is significantly different, **notify the user** to either source a new icon or select an alternative. 
  - **Do not import custom SVGs without approval.**

### 2. Astro Best Practices
- **Use `pnpm astro add`**: Always prefer `pnpm astro add <integration>` over manual configuration for official integrations.
- **Start Static**: By default, do NOT add `client:*` directives. Only add them if a component *actually* uses React hooks (`useState`, `useEffect`) or event handlers.
- **Visual Components**: Components that only display props (like `Testimonial`, `Card`, `Hero`) should be static HTML (no directive), even if they are written in React (`.tsx`).
- **Root Elements**: Avoid `client:load` on the root provider (like `<Theme>`) unless dynamic runtime state switching is strictly required. A static root provider drastically improves TBT (Total Blocking Time).
- **Modern APIs**: Always check the [latest Astro documentation](https://docs.astro.build/) for APIs (Actions, Sessions, Middleware). AI models may have outdated knowledge.

### 3. Architecture Documentation
- **Auto-Update `architecture.md`**: Whenever you make major changes to the project structure, inner workings, or core technologies, you MUST update [architecture.md](docs/architecture.md) to reflect those changes. This ensures the technical documentation stays in sync with the codebase.

### 4. Tools & MCP Servers
You have access to specialized tools to assist in development:
- **`astro-docs`**: Use this to search official Astro documentation.
- **`radix-ui`**: Use this to browse and implement Radix UI components (Themes and Primitives).
- **`figma-dev-mode-mcp-server`**: Use this to generate UI code directly from node IDs when available.

### 5. SEO & Semantic HTML
- Ensure every page holds a single `<h1>`.
- Implement proper meta descriptions and title tags.
- Use semantic HTML5 elements (`<article>`, `<nav>`, `<section>`, etc.).
- If raw HTML is required (outside of Radix components), you MUST ensure it is semantic and produces valid, standard-compliant markup.

### 6. Figma Implementation Guidelines
- **Style Threshold**: Maintain a 10% tolerance when matching Figma styles to Radix UI Themes. If a Figma style deviates by more than 10% from existing Radix tokens, create a custom style; otherwise, snap to the nearest Radix equivalent.
- **Radix Methodology**: Always prioritize Radix design system methodology for spacing, colors, and typography.
- **No Hardcoding**: Do not copy raw CSS values (pixels, hex codes) from Figma. Map these to Radix design tokens or standard scale variables.
- **Native Responsiveness**: Identify and use Radix's built-in responsive solutions (e.g., responsive props) where possible. Propose these options to the user before implementation.
- **Clarification First**: When in doubt or facing ambiguity in design specifications, always ask for clarification instead of making assumptions.
- **No Rounded Corners**: This design uses sharp, square corners throughout. The Radix Theme is configured with `radius="none"`. Do not add rounded corners to any components.

### 7. Navigation & Link Patterns
- **Internal**: `<Link href="/about">` — External: always add `target="_blank" rel="noopener noreferrer"`
- **Button Links**: `<ButtonLink href=...></ButtonLink>`
- **Active States**: Not yet implemented. Use URL matching when adding.

### 8. Layout Slots
`Layout.astro` uses named slots: `heading`, `role`, `description`, `page-content`. See existing pages for usage examples.

### 9. Design Tokens
Defined in `src/styles/global.css`:
- **Extended Spacing**: `--space-10` (5rem) through `--space-14` (30rem) for dramatic layouts
- **Scaling**: Theme uses `scaling="97%"` for slightly condensed UI
- **Typography**: `Ronzino` font family (Regular, Medium, Bold + Italics)
- **Colors**: Yellow/green (primary), Orange (secondary accent via `color="orange"`), P3 support included

### 10. Code & CSS Strategy
- **Self-Documenting**: Descriptive names over comments. Follow existing patterns.
- **CSS Location**: Add styles to `src/styles/global.css` (avoid component `<style>` blocks).
- **Units**: Use `rem` for sizing, `dvh`/`dvw` over `vh`/`vw`, Radix variables over raw/hardcoded values.
- **PostCSS**: autoprefixer, postcss-preset-env, cssnano configured. Modern CSS features supported.

### 11. Verification Protocol (CRITICAL)
Don't rely on visual inspection alone. Use browser DevTools to verify computed styles (margins, padding, grid gaps, alignment). Cite specific measured values when confirming implementations.

## 12. Git & Deployment
- **No PRs**: Solo developer workflow. Push directly to branches.
- **Branches**: `main` (production, auto-deploys to Cloudflare) · `development` (active work)
- **Deploy**: `git checkout main && git merge development && git push origin main && git checkout development`
- **Test build**: `npx astro build && npx wrangler pages dev`

## Repository Structure

| Path | Purpose |
|------|---------|
| `/src/pages/` | File-based routing (`.astro` files become routes) |
| `/src/components/` | UI components (`.tsx` for React, `.astro` for static/`<Image>`) |
| `/src/components/icons/` | Astro-based SVG icons (brand logos, service icons) |
| `/src/components/project/` | Project/case study display components |
| `/src/content/` | MDX content collections |
| `/src/data/` | Static data files |
| `/src/layouts/` | Base layouts (`Layout.astro` is the master) |
| `/src/styles/global.css` | Design tokens, font imports, overrides |
| `/src/utils/` | Helper functions |
| `/src/assets/` | Optimized images (Astro image optimization) |
| `/public/` | Static assets (fonts, favicon) |
| `/docs/architecture.md` | Technical documentation 
| `/docs/POSTCSS_SETUP.md` | POST CSS Configuration 

## Common Pitfalls

| Issue | Solution |
|-------|----------|
| High TBT / slow TTI | Remove unnecessary `client:*` directives from static components |
| TypeScript prop errors | Import `type { ComponentProps } from "react"` and extend |
| CSS not applying | Check specificity; use Radix props before custom CSS |
| Build fails (dev works) | Wrap `window` usage in `if (typeof window !== 'undefined')` |

---

*This file is a living document and should be updated as the project evolves.*
