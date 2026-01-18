# Project Architecture: Portfolio (Rummikub)

> [!IMPORTANT]
> **AI Agents**: This document MUST be updated whenever major changes are made to the project's structure or inner workings.

This document outlines the architecture and structure of the portfolio project (codenamed Rummikub). It is intended to be a living document, updated whenever major changes are made to the project's structure.

## Overview
The project is built using **Astro** as the core framework, integrated with **React** for interactive components and **Radix Themes** for the UI design system.

## Project Structure
```
/
├── .astro/             # Astro's internal cache and metadata
├── public/              # Static assets (images, fonts, etc.)
├── src/
│   ├── components/      # Reusable UI components (Astro and React)
│   │   ├── Counter.tsx          # Example React component
│   │   ├── RadixThemeProvider.tsx # Wrapper for Radix Theme
│   │   └── Title.astro          # Astro-native component
│   ├── layouts/         # Shared page layouts
│   │   └── Layout.astro         # Main application layout
│   └── pages/           # Application routes
│       └── index.mdx            # Homepage (MDX)
├── AGENTS.md            # AI development tips and instructions
├── architecture.md      # This file
├── astro.config.mjs     # Astro configuration
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Key Technologies
- **Astro**: Static site generator and framework.
- **React**: used for building interactive UI components.
- **Radix Themes**: A pre-styled component library used for consistent and premium UI development.
- **MDX**: Used for content-driven pages with React component support.
- **pnpm**: Package manager for efficient dependency management.

## Component Architecture
- **Theme Provider**: The application is wrapped in a `RadixThemeProvider` (defined in `src/components/RadixThemeProvider.tsx`) which applies the Radix UI theme settings.
- **Layouts**: `Layout.astro` provides the standard HTML shell, metadata, and handles the injection of the `Theme` component from Radix.
- **Components**:
    - **Astro Components**: Used for static parts of the UI or where server-side logic is sufficient (e.g., `Title.astro`).
    - **React Components**: Used for client-side interactivity (e.g., `Counter.tsx`).

## Development Guidelines
- Always use **Radix UI variables** for spacing, colors, and typography to maintain design consistency.
- Prefer `pnpm` for all package operations.
- Update this document whenever new architectural patterns or significant structural changes are introduced.
