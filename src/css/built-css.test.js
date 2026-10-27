import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, globSync } from 'node:fs';
import { requireBuild } from '../config/require-build.js';

requireBuild();

const css = () => readFileSync('public/css/index.css', 'utf8');

describe('built stylesheet', () => {
  it('is a single file with no runtime @import', () => {
    expect(css()).not.toMatch(/@import/);
  });

  // Layer priority is set by the order names FIRST APPEAR, so that order is the real invariant.
  // The `@layer …;` pin in _layers.scss is how we control it, but LightningCSS drops the
  // statement when source order already agrees — asserting on the statement would test the
  // mechanism, not the cascade. Assert first-appearance order instead.
  it('orders layers so cleacss stays below our tokens', () => {
    const seen = [];
    for (const [, name] of css().matchAll(/@layer ([a-z]+)[{,;]/g)) {
      if (!seen.includes(name)) seen.push(name);
    }
    expect(seen).toEqual([
      'reset', 'layout', 'elements', 'is', 'has', 'fonts', 'colors', 'type',
    ]);
  });

  it('declares KC Pelletier Sans and ships its woff2', () => {
    expect(css()).toMatch(/@font-face\{[^}]*font-family:\s*"?KC Pelletier Sans"?[^}]*KCPelletierSans\.woff2/);
    expect(existsSync('public/assets/fonts/KCPelletierSans.woff2')).toBe(true);
    expect(existsSync('public/assets/fonts/KCPelletierSans.otf')).toBe(false);
  });

  it('no longer emits the unused vendor copy', () => {
    expect(existsSync('public/css/vendor/cleacss.css')).toBe(false);
  });

  // `main svg` (Illustrations) pads every SVG in <main>. On a UI icon that padding exceeds the
  // declared size, so the border-box inflates and the icon viewport collapses to 0 — visible as a
  // clickable-but-invisible control. Any icon inside <main> must cancel the padding explicitly.
  it('cancels the Illustrations padding on the video control icon', () => {
    const rule = css().match(/\.project-video-play svg\{([^}]*)\}/);
    expect(rule).not.toBeNull();
    expect(rule[1]).toMatch(/padding:\s*0/);
    expect(rule[1]).toMatch(/max-inline-size:\s*none/);
  });

  // A [data-icon] name with no matching --icon rule leaves the mask unresolved, so the 1em pseudo
  // paints as a solid currentColor square. The base rule's transparent fallback hides that, which
  // makes a typo silently iconless — so assert every name used in markup has a glyph behind it.
  it('has a glyph for every data-icon name used in templates', () => {
    const markup = globSync('src/**/*.{njk,md}')
      .map((f) => readFileSync(f, 'utf8'))
      .join('');
    const used = new Set(
      [...markup.matchAll(/data-icon(?:-before)?="([a-z-]+)"/g)].map((m) => m[1]),
    );

    expect(used.size).toBeGreaterThan(0);
    for (const name of used) {
      expect(css(), `no --icon rule for "${name}"`).toMatch(
        new RegExp(`\\[data-icon(?:-before)?=${name}\\][^{]*\\{[^}]*--icon:`),
      );
    }
  });
});
