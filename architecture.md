# Project Architecture: Portfolio (Rummikub)

> [!IMPORTANT]
> **AI Agents**: This document MUST be updated whenever major changes are made to the project's structure or inner workings.

This document outlines the architecture and structure of the portfolio project (codenamed Rummikub). It is intended to be a living document, updated whenever major changes are made to the project's structure.

## Overview
The project is built using **Astro** as the core framework, integrated with **React** for interactive components and **Radix Themes** for the UI design system.

## Project Structure
```
/
├── .astro/              # Astro's internal cache
├── public/              # Static assets (fonts, images)
├── src/
│   ├── assets/          # Processed assets (images)
│   ├── components/      # Reusable UI components
│   │   ├── BlogFilters.jsx
│   │   └── SkipToNav.astro
│   ├── layouts/         # Shared page layouts
│   │   └── Layout.astro # Main application layout with ThemeProvider
│   ├── pages/           # Application routes
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── blog.astro
│   │   ├── blogPost.astro
│   │   ├── project.astro
│   │   └── ...
│   └── styles/
│       └── global.css   # Global design tokens and overrides
├── AGENTS.md            # AI development guidelines
├── architecture.md      # This file
└── astro.config.mjs     # Astro configuration
```

## Key Technologies
- **Astro 5+**: Static site generator and framework.
- **React 19+**: Used for interactive UI components.
- **Radix UI Themes**: Primary design system and component library.
- **pnpm**: Package manager.

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
- **Theme Provider**: Implemented via the `Theme` component in `Layout.astro`.
- **Layouts**: `Layout.astro` is the single source of truth for the HTML shell and Theme wrapping.
- **Components**:
  - **.jsx**: Interactive React components (e.g., `BlogFilters.jsx`).
  - **.astro**: Static components (e.g., `SkipToNav.astro`).

## Development Guidelines
For detailed behavioral rules, coding standards, and workflow instructions (including Git and CSS guidelines), refer to [AGENTS.md](./AGENTS.md).

- **Architecture Updates**: Update this document (`architecture.md`) only when new structural components, folders, or core technologies are added.
- **Behavior Updates**: Update `AGENTS.md` when changing how agents should behave or write code.
