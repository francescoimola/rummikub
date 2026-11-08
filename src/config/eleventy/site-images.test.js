import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { requireBuild } from '../require-build.js';

requireBuild();

const site = JSON.parse(readFileSync('src/_data/site.json', 'utf8'));
const localPath = (url) => 'public' + url.replace(site.url, '');

describe('site image tokens resolve to built files', () => {
  // Both are absolute in site.json because schema and og:image require absolute URLs.
  it('are absolute URLs on our own origin', () => {
    for (const key of ['image', 'personImage']) {
      expect(site[key], key).toMatch(new RegExp(`^${site.url}/`));
    }
  });

  it('ships the social/default image as a passthrough asset', () => {
    expect(existsSync(localPath(site.image))).toBe(true);
  });

  // personImage is an eleventy-img derivative, not a passthrough copy — it exists only while
  // the homepage's About accordion still references the 2560px source. Drop that <img> and the schema URL 404s.
  it('ships the Person headshot derivative', () => {
    expect(existsSync(localPath(site.personImage))).toBe(true);
  });
});
