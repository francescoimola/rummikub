// FNV-1a string hash → 32-bit seed, so a post's slug maps to one stable colour
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32 PRNG — deterministic per seed, so builds never re-roll thumb colours
function seededRandom(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The identity a thumb colour is seeded from. `||` not `??` on purpose: an empty
// fileSlug (a root index page) must fall through to the next candidate, not win.
function thumbSeed(item) {
  return String((item && (item.fileSlug || item.url || (item.data && item.data.title))) || "");
}

// Step forward when a hue would repeat the swatch immediately before it
function rotatePastRepeat(index, prevIndex, length) {
  return index === prevIndex ? (index + 1) % length : index;
}

// Sitemap <lastmod> trusts only `updated:`, or a writing post's own date
function trustedLastmodValue(data) {
  if (data.updated) return data.updated;
  return [].concat(data.tags || []).includes("writing") ? data.date : null;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("longDate", function (date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  eleventyConfig.addFilter("monthYear", function (date) {
    return new Date(date).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  });

  eleventyConfig.addFilter("isoMonth", function (date) {
    return new Date(date).toISOString().slice(0, 7);
  });


  // Eleventy's file-date fallback resets on every CI clone, so only trusted values are emitted
  eleventyConfig.addFilter("sitemapLastmod", function (item) {
    const value = trustedLastmodValue((item && item.data) || {});
    if (!value) return "";
    const date = new Date(value);
    return isNaN(date.valueOf()) ? "" : date.toISOString().replace(/\.\d{3}Z$/, "Z");
  });

  // Takes one slug ("essays") or a list (["essays", "notes"]); anything empty means "keep everything"
  eleventyConfig.addFilter("byType", function (items, type) {
    var wanted = [].concat(type || []);
    if (!wanted.length) return items;
    return items.filter(function (p) {
      return wanted.indexOf(p.data.type) !== -1;
    });
  });

  eleventyConfig.addFilter("limit", function (array, limit) {
    return array.slice(0, limit);
  });

  // Build-time fallback fills for image-less writing items (external/Substack posts), one per item.
  // Deterministic per slug: random brand hue (green/orange/purple), shade, intensity — never opaque.
  // Takes the whole rendered list (not one item) so it can bump a hue forward when it would
  // otherwise repeat the swatch immediately before it — collisions are a property of the sequence,
  // not of a single item, so a single-item filter can never see or prevent them.
  eleventyConfig.addFilter("writingThumbColors", function (items) {
    const hues = [119.4, 55, 305]; // green, orange, purple
    let prevHueIndex = null;
    return (items || []).map((item) => {
      // Photo thumbnails don't render a colour swatch, so they can't collide with a neighbour —
      // skip them without spending a rotation slot that a real swatch neighbour would need.
      if (item && item.data && item.data.image) return null;

      // rand() is stateful — hue, lightness, chroma, alpha must keep drawing in this order
      const rand = seededRandom(hashString(thumbSeed(item)));
      const hueIndex = rotatePastRepeat(
        Math.floor(rand() * hues.length),
        prevHueIndex,
        hues.length
      );
      prevHueIndex = hueIndex;

      const hue = hues[hueIndex];
      const lightness = 0.6 + rand() * 0.22; // 0.60–0.82: any shade
      const chroma = 0.09 + rand() * 0.07; // 0.09–0.16: any intensity, on-brand
      const alpha = 0.55 + rand() * 0.3; // 0.55–0.85: always translucent, never opaque
      const round = (n, d) => Number(n.toFixed(d));
      return `oklch(${round(lightness, 3)} ${round(chroma, 3)} ${round(
        hue,
        1
      )} / ${round(alpha, 2)})`;
    });
  });
};
