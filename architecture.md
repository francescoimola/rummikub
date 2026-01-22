# Project Architecture: Portfolio (Rummikub)

> [!IMPORTANT]
> **AI Agents**: This document MUST be updated whenever major changes are made to the project's structure or inner workings.

This document outlines the architecture and structure of the portfolio project (codenamed Rummikub). It is intended to be a living document, updated whenever major changes are made to the project's structure.

## Overview
The project is a modern portfolio website built using **Astro 5+** as the core framework, integrated with **React 19+** for interactive components and **Radix UI Themes** for the UI design system. The site is deployed on **Cloudflare Pages** and uses PostCSS for CSS optimization.

## Project Structure
```
/
├── .astro/                      # Astro's internal cache and build artifacts
├── .wrangler/                   # Cloudflare Wrangler development cache
├── dist/                        # Production build output
├── node_modules/                # Dependencies
├── public/                      # Static assets (fonts, images, icons)
├── src/
│   ├── assets/                  # Optimized/processed assets
│   ├── components/              # Reusable UI components
│   │   ├── BlogFilters.jsx      # React: Tab-based blog post filtering
│   │   ├── Footer.jsx           # React: Site footer with optional signup form
│   │   ├── ProjectCanvas.astro  # Astro: Project showcase with image grid
│   │   └── SkipToNav.astro      # Astro: Accessibility navigation helper
│   ├── layouts/
│   │   └── Layout.astro         # Main layout with Theme, Grid, Navigation, and slots
│   ├── pages/                   # File-based routing
│   │   ├── index.astro          # Homepage
│   │   ├── about.astro          # About page
│   │   ├── blog.astro           # Blog listing
│   │   ├── blogPost.astro       # Individual blog post template
│   │   ├── consultations.astro  # Consulting services page
│   │   ├── project.astro        # Project details template
│   │   └── webdesign.astro      # Web design services showcase
│   ├── styles/
│   │   └── global.css           # Global tokens, font-faces, overrides
│   └── env.d.ts                 # TypeScript environment types
├── AGENTS.md                    # AI agent guidelines and workflows
├── POSTCSS_SETUP.md             # PostCSS configuration documentation
├── architecture.md              # This file
├── astro.config.mjs             # Astro configuration (integrations, adapter)
├── package.json                 # Dependencies and scripts
├── postcss.config.cjs           # PostCSS configuration (autoprefixer, cssnano)
├── pnpm-lock.yaml               # Lockfile for pnpm
├── pnpm-workspace.yaml          # pnpm workspace config
├── tsconfig.json                # TypeScript configuration
└── wrangler.jsonc               # Cloudflare deployment configuration
```

## Key Technologies

### Core Framework
- **Astro 5.16+**: Static site generator and framework with file-based routing.
- **React 19.2+**: Used for interactive UI components (with `client:load`/`client:idle` directives).
- **TypeScript 5.9+**: Type safety for components and configuration.

### UI & Styling
- **Radix UI Themes 3.2+**: Primary design system and component library.
- **Radix UI Primitives**: Accessible component primitives (Navigation Menu, Form).
- **Radix Icons 1.3+**: Icon library.
- **PostCSS**: CSS processing with autoprefixer, cssnano, and postcss-preset-env.

### Build & Deployment
- **Cloudflare Pages**: Hosting platform with edge deployment.
- **Cloudflare Adapter**: Astro integration for Cloudflare-specific optimizations.
- **Sharp**: Image optimization.
- **pnpm**: Package manager with workspace support.

### Content & Features
- **MDX**: Markdown with JSX support for rich content.
- **Sitemap**: Automatic XML sitemap generation.

## Design System Architecture
The project extends **Radix UI Themes** with a specific "Swiss Design" configuration.

### 1. Global Tokens (CSS)
Defined in `src/styles/global.css`:
- **Extended Spacing Scale**:
  - `--space-10`: 5rem (80px)
  - `--space-11`: 8rem (128px)
  - `--space-12`: 10rem (160px)
  - `--space-13`: 20rem (320px)
  - `--space-14`: 30rem (480px)
- **Brand Colors**:
  - `Yellow` (Primary)
  - `Orange` (Secondary/Mustard)
  - Full P3/oklch high-fidelity color support.

### 2. Theme Configuration
- **Scaling**: Custom `97%` scaling factor (condensed UI).
- **Typography**: `Ronzino` is the primary font family.
- **Radius**: `none` (Sharp corners).

## Component Architecture

### Layout System
- **Theme Provider**: Radix `Theme` component wraps the entire application in `Layout.astro`.
  - Configured with: `accentColor="yellow"`, `radius="none"`, `grayColor="olive"`, `scaling="97%"`.
- **Master Layout**: `Layout.astro` provides:
  - HTML shell with meta tags
  - Two-column responsive Grid (1 column mobile, 2 columns desktop)
  - Header with logo and navigation
  - Named slots: `heading`, `role`, `description`, `page-content`
  - Footer component (lazy-loaded with `client:idle`)

### Component Types
- **React Components** (`.jsx`):
  - `BlogFilters.jsx`: Interactive tabbed filtering for blog posts
  - `Footer.jsx`: Complex footer with conditional signup form
  - Require `client:*` directive in Astro files
- **Astro Components** (`.astro`):
  - `SkipToNav.astro`: Accessibility-focused skip-to-navigation link
  - `ProjectCanvas.astro`: Image gallery/showcase component
  - Server-rendered by default, no hydration overhead

### Slot-Based Architecture
Pages use named slots to inject content into specific grid positions:
- `heading`: Page title/heading (grid column 2)
- `role`: User role/tagline (grid column 1, constrained width)
- `description`: Main descriptive content (grid column 2)
- `page-content`: Full-width content below the hero grid

## Git & Deployment Workflow

### Branch Strategy
- **`main`**: Production branch. Direct pushes trigger Cloudflare Pages deployment.
- **`development`**: Active development branch.
- **No Pull Requests**: Solo developer workflow; direct merges are enabled via GitHub Rulesets.

### Fast-Track Deployment
Merge and deploy from `development` to `main`:
```bash
git checkout main && git merge development && git push origin main && git checkout development
```

### Local Verification
Simulate Cloudflare Pages environment before deploying:
```bash
npx astro build && npx wrangler pages dev
```

## PostCSS Pipeline
The project uses PostCSS for CSS optimization and compatibility:
- **autoprefixer**: Adds vendor prefixes based on browserslist
- **postcss-preset-env**: Modern CSS features with stage 3+ support
- **cssnano**: Minification for production builds
- See `POSTCSS_SETUP.md` and `postcss.config.cjs` for details

## Development Guidelines
For detailed behavioral rules, coding standards, and workflow instructions (including Git and CSS guidelines), refer to [AGENTS.md](./AGENTS.md).

### Documentation Maintenance
- **Architecture Updates**: Update this document (`architecture.md`) when:
  - New structural components, folders, or directories are added
  - Core technologies or dependencies change
  - Build/deployment processes are modified
- **Behavior Updates**: Update `AGENTS.md` when:
  - Coding standards or conventions change
  - Design system guidelines are updated
  - Agent workflows or verification protocols are modified
