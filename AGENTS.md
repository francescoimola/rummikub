# AI Agent Guide: Portfolio Project (Rummikub)

Welcome! This document provides context and guidelines for AI agents working on the **Francesco Imola's website** project (codenamed Rummikub).

## Project Overview

This is an **Astro-powered** portfolio website. It is built with React for interactivity and Radix UI Themes for styling. The goal is to provide a premium, modern, and visually stunning portfolio interface to showcase professional work, and land new clients.

## Tech Stack

- **Framework**: [Astro 5+](https://astro.build/)
- **UI Framework**: [React 19+](https://react.dev/)
- **Design System**: [Radix UI Themes](https://www.radix-ui.com/themes/docs/overview/getting-started) (primary)
- **Content**: MDX, Sitemap support
- **Styling**: Radix UI Theme system (Vanilla CSS for overrides)
- **Package Manager**: pnpm

## Design Philosophy (CRITICAL)

All web development in this project MUST prioritize **Visual Excellence** and **Minimalist Swiss-Design**.
- **Use Radix Components**: Build UI using Radix Themes components (Button, Card, Table, etc.).
- **Modern Typography**: Radix Themes includes great defaults; customize via Theme config if needed.
- **Theme System**: Use Radix Theme's built-in color system and design tokens.
- **Premium Feel**: Avoid generic designs. Aim for a high-end, polished Look & Feel. Use page transitions only where strictly appropriate. Do not use transitions otherwise, except for key components and pre-animated Radix components. No glassmorphism. Follow Swiss-design principles. Implement designs from Figma.

## Guidelines for AI Agents

### 1. Radix UI First
- **Always prefer Radix components** over custom HTML/CSS.
- Use Radix Themes for layout (Box, Flex, Grid, Container, Section).
- Use Radix Themes for typography (Text, Heading, Code, Quote).
- Use Radix Themes for interactive elements (Button, IconButton, Link, etc.).
- Custom CSS is only for very special cases or Radix style overrides.

### 2. Astro Best Practices
- **Use `pnpm astro add`**: Always prefer `pnpm astro add <integration>` over manual configuration for official integrations.
- **Modern APIs**: Always check the [latest Astro documentation](https://docs.astro.build/) for APIs (Actions, Sessions, Middleware). AI models may have outdated knowledge.

### 3. Architecture Documentation
- **Auto-Update `architecture.md`**: Whenever you make major changes to the project structure, inner workings, or core technologies, you MUST update [architecture.md](file:///Users/francescoimola/Repositories/rummikub/architecture.md) to reflect those changes. This ensures the technical documentation stays in sync with the codebase.

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
- **Native Responsiveness**: Identify and use Radix’s built-in responsive solutions (e.g., responsive props) where possible. Propose these options to the user before implementation.
- **Clarification First**: When in doubt or facing ambiguity in design specifications, always ask for clarification instead of making assumptions.
- **No Rounded Corners**: This design uses sharp, square corners throughout. The Radix Theme is configured with `radius="none"`. Do not add rounded corners to any components.

### 7. Global Color System
- **Global Tokens**: The project uses custom color tokens defined in `src/styles/global.css`.
  - **Yellow/Green** (`--yellow-1` to `--yellow-12` and the corresponding alpha values): Primary brand color.
  - **Mustard/Orange** (`--orange-1` to `--orange-12` and the corresponding alpha values): Secondary brand color.
- **Accent Strategy**:
  - **Default Accent**: The `RadixThemeProvider` is configured with `accentColor="yellow"`. All standard Radix components (Button, Link, etc.) use yellow by default.
  - **Secondary Accent**: Oerride specific components to use the secondary color by passing `color="orange"` (e.g., `<Button color="orange">`).
- **P3 Support**: The global CSS includes high-fidelity P3/oklch color definitions for supported displays.


### 8. Verification Protocol (CRITICAL)
- **No "Visual Glances"**: Do not rely solely on looking at screenshots. Your eyes can be deceived by small pixel differences.
- **Computed Styles**: You MUST use browser developer tools (or equivalent MCP capabilities) to inspect computed styles (`getComputedStyle`), specifically checking:
  - Exact pixel values for margins and padding.
  - Grid gap sizes.
  - Flex/Grid alignment properties (`justify-content`, `align-items`).
- **Grid & Alignment**: Verify that items are actually on the grid lines as intended.
- **Citing Evidence**: when confirming a design implementation, cite the specific values you measured (e.g., "Verified padding is 20px via computed styles", not just "It looks correct").

## 9. Git & Deployment Workflow
- **One-Person Workflow**: The user is the sole developer. **Do NOT ask to create Pull Requests.**
- **Branches**:
  - `main`: Production. Pushing here triggers a Cloudflare Pages deploy.
  - `development`: Active work.
- **Fast-Track Merging**: When a feature is ready in `development`, use this command sequence to deploy:
  ```bash
  git checkout main && git merge development && git push origin main && git checkout development
  ```
- **Rulesets**: A GitHub Ruleset exists to prevent accidental deletions or force pushes to `main`, but it **explicitly allows direct pushes** without PRs.

## Repository Structure

- `/src/pages/`: Routing and page components (MDX/Astro).
- `/src/components/`: Reusable UI components (React/Astro).
- `/src/layouts/`: Base page layouts.
- `/public/`: Static assets.
- `architecture.md`: Visual map of the project structure.

## Common Workflows

### Developing a New Component
1. Search `radix-ui` MCP for a suitable Radix Themes component.
2. Create the component in `src/components/` (use `.jsx` for React components; avoid `.tsx` as per project preference).
3. Apply styling using Radix Theme properties (color, size, variant, etc.).
4. Port to Astro layout/page.
5. **Verify**: Use browser tools to inspect computed styles and ensuring alignment matches the design exactly.

## Development Cheatsheet

### Radix UI Themes
- **Layout**: Use `Box`, `Flex`, `Grid`, `Container`, `Section`, `Margin` (props).
- **Typography**: `Text`, `Heading` (levels 1-9), `Strong`, `Code`.
- **Feedback**: `Callout` (for alerts), `Badge`, `Skeleton` (loading).
- **Interactive**: `Button`, `IconButton`, `Link`, `TabNav`, `Dialog`, `DropdownMenu`.
- **Inputs**: `TextField`, `TextArea`, `Select`, `Switch`, `Checkbox`, `Slider`.

### Radix Primitives
- Use **Primitives** (`@radix-ui/react-*`) when you need completely custom styling AND accessible behavior (e.g., complex Popovers, accessibility-focused non-standard widgets).

### Astro Integration Notes
- **Interactivity**: Radix components are React-based. **You MUST add `client:load` or `client:visible` directives** when using interactive components in `.astro` files:
  ```astro
  <Button client:load>Click me</Button>
  ```
- **Styling**: `src/styles/global.css` matches Radix tokens to brand colors. Vanilla CSS files can be added for deeper overrides.
- **Icons**: Radix Themes works seamlessly with `lucide-react`.

---

*Note: This file is a living document and should be updated as the project evolves.*
