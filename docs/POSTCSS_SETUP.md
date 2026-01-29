# PostCSS Configuration

## Overview

PostCSS configured in this project and it will automatically process **ALL CSS** from:
- ✅ `<style>` tags in `.astro` files
- ✅ Scoped styles in React/JSX components
- ✅ Global CSS files (like those imported in layouts)
- ✅ CSS imported in JavaScript/TypeScript files
- ✅ Radix UI's CSS (processed through the pipeline)

## How It Works

Astro includes PostCSS as part of its Vite build pipeline. By creating `postcss.config.cjs` in the project root, PostCSS automatically processes all CSS regardless of where it's written.

## Installed Plugins

### 1. **autoprefixer** (v10.4.23)
Automatically adds vendor prefixes based on our browserslist configuration.

**Example:**
```css
/* You write: */
.element {
  display: grid;
  user-select: none;
}

/* PostCSS outputs: */
.element {
  display: grid;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
```

### 2. **postcss-preset-env** (v11.1.1)
Allows you to use modern CSS features with automatic fallbacks.

**Features enabled:**
- CSS Nesting
- Custom Media Queries
- Modern color functions
- And more Stage 2+ features

**Example:**
```css
/* You can write modern nested CSS: */
.card {
  background: white;
  
  &:hover {
    background: gray;
  }
  
  & .title {
    font-size: 2rem;
  }
}
```

### 3. **cssnano** (v7.1.2)
Minifies and optimizes CSS in production builds.

**Optimizations:**
- Removes comments
- Minifies property values
- Merges rules
- Removes duplicate rules
- And more...

**Note:** Only runs in production (`NODE_ENV=production`), so your development experience remains fast.

## Browser Targets

The `browserslist` configuration in `package.json` tells autoprefixer which browsers to support:

```json
"browserslist": [
  "defaults",      
  ">0.3%",
  "maintained node versions" 
]
```

## Configuration File

**File:** `postcss.config.cjs`

The configuration is environment-aware:
- **Development:** Only autoprefixer and postcss-preset-env (fast rebuilds)
- **Production:** All plugins including cssnano (optimized output)

## Usage Examples

### In Astro Files
```astro
---
// Layout.astro or any .astro file
---
<style>
  .container {
    display: grid;
    gap: 1rem;
    
    /* Modern nesting works! */
    & .item {
      background: color-mix(in srgb, blue 50%, white);
    }
  }
</style>
```

### In JSX/React Components
```jsx
// Header.jsx
export default function Header() {
  return (
    <header style={{
      display: 'flex',
      userSelect: 'none'  // Will be autoprefixed
    }}>
      {/* ... */}
    </header>
  );
}
```

Or with CSS modules/imports - PostCSS processes those too!

## Verification

To verify PostCSS is working:

1. **Check the build output:**
   ```bash
   pnpm build
   ```
   Look for vendor prefixes in `dist/` CSS files.

2. **Check processed CSS:**
   Examine the generated CSS in your browser's DevTools. You should see vendor prefixes where needed.

3. **View production bundle:**
   ```bash
   pnpm preview
   ```
   The CSS should be minified and optimized.

## Benefits

✅ **Automatic vendor prefixing** - Write standard CSS, get browser compatibility
✅ **Modern CSS features** - Use tomorrow's CSS today
✅ **Production optimization** - Smaller CSS bundles
✅ **Zero configuration needed** - Works automatically for all CSS in the project
✅ **Framework agnostic** - Works with Astro, React, and any other framework CSS

## Notes

- PostCSS runs automatically during both `dev` and `build`
- No changes needed to existing CSS - it all just works
- The configuration is in a `.cjs` file to work with Astro's ESM environment
- Custom properties (CSS variables) are NOT transformed, preserving dynamic theming

## Troubleshooting

### If prefixes aren't appearing:
1. Check that `postcss.config.cjs` is in the project root
2. Restart the dev server after adding the config
3. Clear Astro's cache: `rm -rf .astro`

### If build is slow:
cssnano only runs in production, so dev builds remain fast. If production builds are slow, you can disable specific cssnano optimizations in `postcss.config.cjs`.
