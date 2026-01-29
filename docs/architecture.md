# Architecture Guide: Rummikub

This document provides a high-level technical overview of the portfolio project.

**Goal**: A high-performance, design-first portfolio website.
**Stack**: [Astro 5](https://astro.build) · [React 19](https://react.dev) · [Radix UI Themes](https://www.radix-ui.com) · [Cloudflare Pages](https://pages.cloudflare.com)

---

## 1. Core Architecture Concepts

### A. Zero-JS by Default (Hydration Strategy)
Performance is paramount. This project follows a strict **"Static First"** approach:
*   **Default**: All components are server-rendered to static HTML.
*   **Opt-In**: We only use `client:load` or `client:idle` for components that *strictly require* runtime JavaScript (e.g., state, event listeners, form handling).
*   **Visuals**: Purely visual components (Stars, Cards) are static, even if written in React.
*   **The Theme**: The root `<Theme>` provider is static to prevent massive hydration blocking.

### B. Radix UI Design System
We leverage **Radix UI Themes** as the single source of truth for styling.
*   **No custom CSS classes** for layout or basic styling. Use `Box`, `Flex`, `Grid` components.
*   **Global Overrides**: Defined in `src/styles/global.css`, mainly for:
    *   **Spacing**: Extended scale (`--space-10` to `--space-14`) for dramatic layout gaps.
    *   **Colors**: Custom P3/oklch brand colors (Yellow/Orange).
    *   **Reset**: Sharp corners (`radius="none"`) and condensed scaling (`97%`).

### C. Slot-Based Layouts
The `Layout.astro` component abstracts the complex responsive grid. Pages inject content into specific named slots:
*   `heading`: The main page title (top right).
*   `role`: The job title/tagline (top left, constrained).
*   `description`: The intro text (top right, below heading).
*   `page-content`: The main body (spans full width/grid).

---

## 2. Directory Structure

```text
src/
├── components/          # Reusable UI (React .tsx & Astro .astro)
│   ├── icons/           # Astro-based SVG icons (brand logos, service icons)
│   └── project/         # Project/case study display components
├── content/             # MDX content collections
├── data/                # Static data files (JSON, etc.)
├── layouts/             # Page skeletons (Layout.astro)
├── pages/               # File-based routing (Astro)
├── styles/              # Global CSS & Design Tokens
├── utils/               # Helper functions
└── assets/              # Optimized images
```

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
| **Build Production** | `pnpm build` |
| **Preview Prod** | `pnpm preview` or `npx wrangler pages dev dist` |
| **Styling** | Use `<Flex>`, `<Grid>`, and `<Text>` props. **Avoid CSS files.** |
| **Icons** | Import from `@radix-ui/react-icons`. |
| **Interactivity** | Add `client:load` ONLY if strictly needed. |
