# Architecture Guide: Rummikub

This document provides a high-level technical overview of the portfolio project.

**Goal**: A high-performance, design-first portfolio website.
**Stack**: [Astro 5](https://astro.build) · [React 19](https://react.dev) · [Radix UI Themes](https://www.radix-ui.com) · [Cloudflare Pages (SSR)](https://pages.cloudflare.com)

---

## 1. Core Architecture Concepts

### A. Zero-JS by Default (Hydration Strategy)
Performance is paramount. This project follows a strict **"Static First"** approach:
*   **Default**: Pages are server-rendered on-demand (SSR) by Cloudflare Workers, allowing for dynamic content and auth.
*   **Static Support**: Pages can be explicitly pre-rendered using `export const prerender = true`.
*   **Opt-In Hydration**:
    *   `client:load` — Components requiring immediate interactivity (forms, dialogs)
    *   `client:idle` — Non-critical interactive components (Footer)
    *   `client:visible` — Components below the fold (NewsletterForm on blog pages)
*   **Visuals**: Purely visual components (BlogCard, Cards) are Astro components—no hydration overhead.
*   **The Theme**: The root `<Theme>` provider is static to prevent massive hydration blocking.

### B. Radix UI Design System
We leverage **Radix UI Themes** as the single source of truth for styling.
*   **No custom CSS classes** for layout or basic styling. Use `Box`, `Flex`, `Grid` components.
*   **Global Overrides**: Defined in `src/styles/global.css`, mainly for:
    *   **Spacing**: Extended scale (`--space-10` to `--space-14`) for dramatic layout gaps.
    *   **Colors**: Custom P3/oklch brand colors (`--yellow-*`, `--orange-*`). See AGENTS.md §9.1 for rationale.
    *   **Reset**: Sharp corners (`radius="none"`)

### C. Image Optimization
All images use Astro's `<Image>` component with strategic loading:
*   **`loading="eager"`**: Above-fold critical images only (e.g., Francesco photo on About page)
*   **`loading="lazy"`**: All other images (blog cards, portfolio, project images)
*   **Formats**: WebP with responsive `widths` and `sizes` attributes where appropriate

### D. Accessibility
*   **Form Labels**: All form fields have proper `id` attributes connected via `htmlFor`
*   **aria-live Regions**: Form status messages wrapped in `aria-live="polite"` containers
*   **Semantic HTML**: Proper heading hierarchy, `<figure>`/`<figcaption>` for images

### E. Slot-Based Layouts
The `Layout.astro` component abstracts the complex responsive grid. Pages inject content into specific named slots:
*   `heading`: The main page title (top right).
*   `role`: The job title/tagline (top left, constrained).
*   `description`: The intro text (top right, below heading).
*   `page-content`: The main body (spans full width/grid).

### F. Build Configuration
*   **Console Stripping**: Production builds automatically remove `console.*` and `debugger` statements via Vite esbuild config
*   **PostCSS**: autoprefixer, postcss-preset-env, cssnano for vendor prefixes and minification

---

## 2. Directory Structure

```text
src/
├── components/          # Reusable UI
│   ├── *.astro          # Static/presentational (BlogCard, ProjectImage, BlogImage)
│   ├── *.tsx            # Interactive React (ContactForm, NewsletterForm, Dialogs)
│   ├── icons/           # Astro-based SVG icons (brand logos, service icons)
│   ├── mdx/             # MDX-specific components (BlogImage)
│   └── project/         # Project/case study display components
├── content/             # MDX content collections (projects, blog)
├── data/                # Static data files (JSON, etc.)
├── layouts/             # Page skeletons (Layout.astro)
├── pages/               # File-based routing (Astro)
├── styles/              # Global CSS & Design Tokens
├── utils/               # Helper functions
└── assets/              # Optimized images
```

### Content Collections Schema
Defined in `src/content/config.ts`:
*   **Projects**: `coverImage` required, `slug` required
*   **Blog**: `slug` defaults to empty string (page falls back to file ID), `coverImage` required

---

## 3. Deployment Workflow

*   **Hosting**: Cloudflare Pages.
*   **Branching**:
    *   `development`: Active work.
    *   `main`: Production. Auto-deploys on push.
*   **Solo Workflow**: Merge `development` into `main` directly. PRs are optional.
    ```bash
    git checkout main && git merge development && git push origin main && git checkout development
    ```

---

## 4. Development Cheatsheet

| Task | Command / Action |
| :--- | :--- |
| **Run Dev Server** | `pnpm run dev` |
| **Build Production** | `pnpm build` (console.* stripped automatically) |
| **Preview Prod** | `pnpm preview` or `npx wrangler pages dev dist` |
| **Styling** | Use `<Flex>`, `<Grid>`, and `<Text>` props. **Avoid CSS files.** |
| **Icons** | Import from `@radix-ui/react-icons`. |
| **Interactivity** | Add `client:*` ONLY if strictly needed. Prefer `client:visible` for below-fold. |
| **Images** | Use Astro `<Image>` with `loading="lazy"` (except above-fold). |
| **Forms** | Ensure `id` on inputs, `htmlFor` on labels, `aria-live` on status messages. |
