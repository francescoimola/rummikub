# AI Agent Guide: Portfolio Project (Rummikub)

Welcome! This document provides context and guidelines for AI agents working on the **Francesco Imola's website** project (codenamed Rummikub).

## Project Overview

This is an **Astro-powered** portfolio website for Francesco Imola. It is built with React for interactivity and Radix UI Themes for styling. The goal is to provide a premium, modern, and visually stunning portfolio interface to showcase professional work and land new clients.

**Live URL**: [https://francescoimola.com](https://francescoimola.com)

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
- **Icons**: Always prefer `@radix-ui/react-icons` (installed via `pnpm`).
  - **Matching**: If a Figma icon resembles a Radix icon, use the Radix icon.
  - **Mismatch**: If the Figma icon is significantly different, **notify the user** to either source a new icon or select an alternative. 
  - **Do not import custom SVGs without approval.**

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
- **Native Responsiveness**: Identify and use Radix's built-in responsive solutions (e.g., responsive props) where possible. Propose these options to the user before implementation.
- **Clarification First**: When in doubt or facing ambiguity in design specifications, always ask for clarification instead of making assumptions.
- **No Rounded Corners**: This design uses sharp, square corners throughout. The Radix Theme is configured with `radius="none"`. Do not add rounded corners to any components.

### 7. Navigation & Link Patterns
- **Internal Links**: Use Radix `Link` component with `href` attribute for internal navigation.
  ```jsx
  <Link href="/about" size="3" color="gray">About</Link>
  ```
- **External Links**: Add `target="_blank"` and `rel="noopener noreferrer"` for external URLs.
- **Button Links**: Use Radix `Button` with `asChild` when wrapping an anchor element:
  ```jsx
  <Button asChild variant="soft">
    <a href="/contact">Contact</a>
  </Button>
  ```
- **Active States**: Navigation active states are NOT yet implemented. When adding active link highlighting, use URL matching logic in the component.

### 8. Slot Architecture & Page Structure
The `Layout.astro` component uses **named slots** to structure content:
- **`heading`**: Page title/main heading (grid column 2, desktop)
- **`role`**: User role/tagline text (grid column 1, constrained width)
- **`description`**: Detailed description or intro (grid column 2)
- **`page-content`**: Full-width content below hero grid (spans both columns)

**Example Page Usage:**
```astro
<Layout title="About">
  <Heading slot="heading" size="9">About Me</Heading>
  <Text slot="role" size="5">Designer & Developer</Text>
  <Text slot="description" size="4">Welcome to my portfolio...</Text>
  <Box slot="page-content">
    {/* Full-width page content here */}
  </Box>
</Layout>
```

### 9. Global Design System & Tokens
- **Global Tokens**: Defined in `src/styles/global.css`.

#### A. Spacing Tokens
The project extends the default Radix 1-9 spacing scale with custom larger steps for dramatic layout spacing:
- `--space-10`: 5rem (80px)
- `--space-11`: 8rem (128px) 
- `--space-12`: 10rem (160px)
- `--space-13`: 20rem (320px)
- `--space-14`: 30rem (480px)

#### B. Custom Scaling
- **97% Scaling**: The theme supports a custom `97%` scaling factor (defined in CSS as `0.97`) to slightly condense the UI. Use `scaling="97%"` on the definition of the Theme.

#### C. Typography
- **Primary Font**: `Ronzino` (Regular, Medium, Bold + Italics).
- **Fallbacks**: Standard system sans-serif stack.

#### D. Color System
- **Yellow/Green** (`--yellow-1` to `--yellow-12`): Primary brand color.
- **Mustard/Orange** (`--orange-1` to `--orange-12`): Secondary brand color.
- **P3 Support**: High-fidelity P3/oklch colors are defined for supported displays.

- **Accent Strategy**:
  - **Secondary Accent**: Use `color="orange"` for specific components.


### 10. CSS Strategy & Best Practices
- **No Local `<style>` Blocks**: Do NOT create custom `<style>` blocks or sidecar `.css` files for individual components/pages unless strictly necessary (e.g., complex animations, keyframes, or styles exceeding 20+ lines that would pollute global CSS).
  - **Default**: Add styles to `src/styles/global.css`.
- **PostCSS Integration**: The project uses PostCSS for optimization. CSS is automatically processed with:
  - **autoprefixer**: Vendor prefixes based on browserslist
  - **postcss-preset-env**: Modern CSS features (stage 3+)
  - **cssnano**: Minification in production
  - See `POSTCSS_SETUP.md` for details
- **Commenting Etiquette**:
  - **Do NOT** comment individual properties (e.g., `color: red; /* sets text to red */`).
  - **DO** comment sections (e.g., `/* Blog Grid Layout */`).
  - **DO** comment complex formulas or non-obvious hacks.
- **Strong, Responsive CSS**:
  - **Minimalism**: Write the fewest lines of code possible. Use efficient selectors.
  - **Units**: ALWAYS use `rem` for font-size and spacing. Use `dvh`/`dvw` over `vh`/`vw`.
  - **Variables**: Use Radix variables (`var(--space-3)`, `var(--gray-11)`) instead of raw values.
  - **Layout**: Respect the baseline grid. Ensure containers don't overflow.
  - **Accessibility**: Ensure high contrast and respect system font size preferences.
  - **Modern Features**: Feel free to use modern CSS (container queries, `:has()`, etc.) - PostCSS will handle compatibility.


### 11. Verification Protocol (CRITICAL)
- **No "Visual Glances"**: Do not rely solely on looking at screenshots. Your eyes can be deceived by small pixel differences.
- **Computed Styles**: You MUST use browser developer tools (or equivalent MCP capabilities) to inspect computed styles (`getComputedStyle`), specifically checking:
  - Exact pixel values for margins and padding.
  - Grid gap sizes.
  - Flex/Grid alignment properties (`justify-content`, `align-items`).
- **Grid & Alignment**: Verify that items are actually on the grid lines as intended.
- **Citing Evidence**: when confirming a design implementation, cite the specific values you measured (e.g., "Verified padding is 20px via computed styles", not just "It looks correct").

## 12. Git & Deployment Workflow
- **One-Person Workflow**: The user is the sole developer. **Do NOT ask to create Pull Requests.**
- **Branches**:
  - `main`: Production. Pushing here triggers a Cloudflare Pages deploy.
  - `development`: Active work.
- **Fast-Track Merging**: When a feature is ready in `development`, use this command sequence to deploy:
  ```bash
  git checkout main && git merge development && git push origin main && git checkout development
  ```
- **Rulesets**: A GitHub Ruleset exists to prevent accidental deletions or force pushes to `main`, but it **explicitly allows direct pushes** without PRs.
- **Local Verification**: To check if the build works correctly before pushing (simulating the Cloudflare Pages environment), run:
  ```bash
  npx astro build && npx wrangler pages dev
  ```

## Repository Structure

- `/src/pages/`: File-based routing. Each `.astro` file becomes a route.
- `/src/components/`: Reusable UI components (React `.jsx` and Astro `.astro`).
- `/src/layouts/`: Base page layouts. `Layout.astro` is the master layout.
- `/public/`: Static assets (fonts, images, favicon, etc.).
- `/src/assets/`: Optimized/processed assets (Astro's image optimization).
- `/src/styles/global.css`: Global design tokens, font imports, and overrides.
- `architecture.md`: Technical overview and project structure.
- `POSTCSS_SETUP.md`: PostCSS configuration documentation.

**Current Pages:**
- `index.astro`: Homepage
- `about.astro`: About page
- `blog.astro`: Blog listing
- `blogPost.astro`: Blog post template
- `consultations.astro`: Consulting services
- `project.astro`: Project showcase template
- `webdesign.astro`: Web design services

**Current Components:**
- `BlogFilters.jsx` (React): Tab-based blog filtering
- `Footer.jsx` (React): Site footer with optional signup form
- `ProjectCanvas.astro` (Astro): Image gallery for projects
- `SkipToNav.astro` (Astro): Accessibility skip-to-nav link

## Common Workflows

### Developing a New Component
1. **Search for Radix component**: Use `radix-ui` MCP to find suitable Radix Themes components.
2. **Choose file type**:
   - **`.jsx`** for React components (interactive, with state)
   - **`.astro`** for static components (server-rendered)
3. **Create in `src/components/`**: Follow existing naming conventions.
4. **Apply Radix styling**: Use Radix Theme properties (color, size, variant) instead of custom CSS.
5. **Add to page**: Import and use. For React components, add `client:load` or `client:idle` directive.
6. **Verify**: Use browser DevTools to inspect computed styles and ensure exact design match.

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
- **Interactivity**: Radix components are React-based. **You MUST add `client:load`, `client:idle`, or `client:visible` directives** when using interactive components in `.astro` files:
  ```astro
  <Button client:load>Click me</Button>
  ```
- **Choosing Directives**:
  - `client:load`: Hydrate immediately on page load (use for critical interactive elements like navigation)
  - `client:idle`: Hydrate when browser is idle (use for non-critical elements like footer)
  - `client:visible`: Hydrate when element becomes visible (use for below-fold content)
- **Styling**: `src/styles/global.css` matches Radix tokens to brand colors. Vanilla CSS files can be added for deeper overrides.
- **Icons**: Use `@radix-ui/react-icons` as the primary icon source.
- **Type Safety**: The project uses TypeScript. Add proper type imports when needed:
  ```tsx
  import type { ComponentProps } from "react";
  interface Props extends ComponentProps<typeof Theme> { ... }
  ```

---

### 11. Code Examples (Do's and Don'ts)

#### A. Layouts
**❌ Don't Do This:**
```jsx
<div className="flex-container" style={{ display: 'flex', gap: '20px' }}>
  <div className="item">Item 1</div>
</div>
```

**✅ Do This (Radix):**
```jsx
<Flex gap="5">
  <Box>Item 1</Box>
</Flex>
```

#### B. Responsive Design
**❌ Don't Do This:**
```css
/* Custom media queries are fragile */
@media (max-width: 768px) {
  .my-box { display: none; }
}
```

**✅ Do This (Radix Props):**
```jsx
<Box display={{ initial: 'none', sm: 'block' }}>
  Content visible on mobile+
</Box>
```

#### C. CSS Variables
**❌ Don't Do This:**
```css
.card {
  padding: 24px;
  color: #646464;
}
```

**✅ Do This (Tokens):**
```css
.card {
  padding: var(--space-5);
  color: var(--gray-11);
}
```

---

## Common Pitfalls & Solutions

### Issue: Component Not Interactive
**Problem**: React component doesn't respond to clicks/interactions.
**Solution**: Add `client:load` or `client:idle` directive to the component in the `.astro` file.

### Issue: Type Error with Props
**Problem**: TypeScript errors when passing props to Radix components.
**Solution**: Import proper types: `import type { ComponentProps } from "react";` and extend them.

### Issue: Styles Not Applying
**Problem**: Custom CSS not affecting Radix components.
**Solution**: 
1. Check CSS specificity - Radix uses data attributes
2. Add styles to `global.css` with proper selectors
3. Use Radix's built-in props first (color, size, variant)

### Issue: Build Fails Locally
**Problem**: `astro build` fails but dev server works.
**Solution**: 
1. Check for client-only code (e.g., `window` usage) - wrap in `if (typeof window !== 'undefined')`
2. Ensure all imports are properly resolved
3. Test with `npx astro build && npx wrangler pages dev` to simulate production

---

---

*Note: This file is a living document and should be updated as the project evolves.*
