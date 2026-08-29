import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, globSync } from 'node:fs';

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

  it('no longer emits the unused vendor copy', () => {
    expect(existsSync('public/css/vendor/cleacss.css')).toBe(false);
  });

  // The base rule is the one outside @supports — grid-lanes adds a second .masonry{} block below it.
  const masonryBaseRule = () => css().match(/\.masonry\{([^}]*)\}/);

  // WebKit's column balancer overshoots on unbreakable cards, so a set with one tall image lands as
  // one long column plus a stub. Grid never balances, so the layout can't regress that way again.
  it('lays the masonry out as a grid, never multicol', () => {
    const rule = masonryBaseRule();
    expect(rule).not.toBeNull();
    expect(rule[1]).toMatch(/display:\s*grid/);
    // Lookbehind so grid-template-columns doesn't read as a multicol declaration.
    expect(css()).not.toMatch(/\.masonry[^{]*\{[^}]*(?<![-\w])columns:/);
  });

  // .masonry is a grid item of .split-row, so it stretches to the row height. align-content defaults
  // to stretch, which spreads the rows apart to fill it — this is what pins them to the top.
  it('keeps the masonry from being stretched by its grid row', () => {
    const rule = masonryBaseRule();
    expect(rule).not.toBeNull();
    expect(rule[1]).toMatch(/align-self:\s*start/);
  });

  it('folds the masonry to two columns', () => {
    expect(css()).toMatch(/\.masonry[^{]*\{[^}]*grid-template-columns:\s*(?:1fr 1fr|repeat\(2,\s*1fr\))/);
  });

  // Progressive enhancement for Safari 26.4+. LightningCSS must not drop the unknown display value.
  it('upgrades to native masonry where grid-lanes is supported', () => {
    expect(css()).toMatch(/@supports \(display:\s*grid-lanes\)/);
    expect(css()).toMatch(/display:\s*grid-lanes/);
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
