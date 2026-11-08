import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, globSync } from 'node:fs';
import { requireBuild } from '../config/require-build.js';

requireBuild();

const css = () => readFileSync('public/css/index.css', 'utf8');

// Standard OKLab → linear sRGB → linear Display P3 matrices. A channel outside 0–1 is a colour the screen cannot show.
function linearP3(l, c, h) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const r = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S;
  const g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S;
  const bl = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S;
  return [
    0.8224621 * r + 0.177538 * g,
    0.0331941 * r + 0.9668058 * g,
    0.0170827 * r + 0.0723974 * g + 0.9105199 * bl,
  ];
}

function declarations(block) {
  return Object.fromEntries(
    block.split(';').map((d) => {
      const colon = d.indexOf(':');
      return [d.slice(0, colon), d.slice(colon + 1)];
    }),
  );
}

// Resolves one built oklch() at a preset's hue. Handles both forms: the parametric
// `calc(.073 * var(--brand-chroma))` / `calc(var(--brand-hue) + 6.7)` and a plain literal.
function parseOklch(token, brandHue) {
  const m = token.match(/^oklch\(([\d.]+)(%?) (?:calc\()?([\d.]+)(?: \* var\(--brand-chroma\)\))? (.+)\)$/);
  if (!m) throw new Error(`unparsed colour: ${token}`);
  const offset = m[4].match(/([+-]) ([\d.]+)\)$/);
  let hue = Number(m[4]);
  if (m[4].includes('--brand-hue')) {
    hue = brandHue + (offset ? Number(`${offset[1]}${offset[2]}`) : 0);
  }
  return [Number(m[1]) / (m[2] ? 100 : 1), Number(m[3]), hue];
}

// A step is either a light-dark() pair or an alias to one; returns its [light, dark] oklch() strings.
function stepColours(tokens, step) {
  const alias = tokens[step].match(/^var\((--[\w-]+)\)$/);
  const value = alias ? tokens[alias[1]] : tokens[step];
  return value.slice('light-dark('.length, -1).split(/,(?=oklch)/);
}

function outOfRangeSteps(built) {
  const root = declarations(built.match(/:root\{([^}]*--brand-50:[^}]*)\}/)[1]);
  const brands = Object.keys(root).flatMap((k) => k.match(/^--brand-hue-(.+)$/)?.[1] ?? []);
  const steps = Object.keys(root).filter((k) => /^--brand-\d+$/.test(k));
  expect(brands.length).toBeGreaterThan(0);
  expect(steps.length).toBeGreaterThan(0);

  const outOfRange = [];
  for (const brand of brands) {
    const hook = built.match(new RegExp(`:root\\[data-brand=${brand}\\]\\{([^}]*)\\}`));
    const tokens = { ...root, ...(hook ? declarations(hook[1]) : {}) };
    for (const step of steps) {
      stepColours(tokens, step).forEach((token, mode) => {
        const [l, c, h] = parseOklch(token, Number(root[`--brand-hue-${brand}`]));
        if (linearP3(l, c, h).some((x) => x < -0.001 || x > 1.001)) {
          outOfRange.push(`${brand} ${step} ${mode ? 'dark' : 'light'}`);
        }
      });
    }
  }
  return outOfRange;
}

describe('built stylesheet', () => {
  // An out-of-range colour makes iOS draw the status-bar strip, gradients and plain fills in visibly
  // different tints, while screenshots still show one flattened value — so only this check can catch it.
  it('keeps every brand colour inside Display P3', () => {
    expect(outOfRangeSteps(css())).toEqual([]);
  });

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
