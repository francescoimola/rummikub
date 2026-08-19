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


  // Sitemap <lastmod>: trust only `updated:`, or a writing post's date — Eleventy's file-date fallback resets on every CI clone
  eleventyConfig.addFilter("sitemapLastmod", function (item) {
    const data = (item && item.data) || {};
    const tags = [].concat(data.tags || []);
    const value = data.updated || (tags.includes("writing") ? data.date : null);
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

  // Build-time fallback fill for image-less writing items (external/Substack posts).
  // Deterministic per slug: random brand hue (green/orange/purple), shade, intensity — never opaque.
  eleventyConfig.addFilter("writingThumbColor", function (item) {
    const slug =
      (item &&
        (item.fileSlug ||
          item.url ||
          (item.data && item.data.title))) ||
      "";
    const rand = seededRandom(hashString(String(slug)));
    const hues = [119.4, 55, 305]; // green, orange, purple
    const hue = hues[Math.floor(rand() * hues.length)];
    const lightness = 0.6 + rand() * 0.22; // 0.60–0.82: any shade
    const chroma = 0.09 + rand() * 0.07; // 0.09–0.16: any intensity, on-brand
    const alpha = 0.55 + rand() * 0.3; // 0.55–0.85: always translucent, never opaque
    const round = (n, d) => Number(n.toFixed(d));
    return `oklch(${round(lightness, 3)} ${round(chroma, 3)} ${round(
      hue,
      1
    )} / ${round(alpha, 2)})`;
  });
};
