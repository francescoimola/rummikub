const MAX_FEATURED_WORK = 3;

// Fixed section order on the Writing index and for per-type page generation
const WRITING_TYPE_ORDER = ["essays", "guides", "notes"];

function sortByEndDateDesc(a, b) {
  return String(b.data.endDate || "").localeCompare(String(a.data.endDate || ""));
}

function sortByDateDesc(a, b) {
  return b.date - a.date;
}

// `hidden: true` keeps a live page out of listings and RSS but still in collections.all, so the sitemap finds it
function isVisible(p) {
  return p.data.hidden !== true;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("work", function (collectionApi) {
    // Order by project end date (YYYY-MM string), most recent first
    return collectionApi.getFilteredByTag("work").sort(sortByEndDateDesc);
  });

  eleventyConfig.addCollection("workFeatured", function (collectionApi) {
    var featured = collectionApi
      .getFilteredByTag("work")
      .filter(function (p) {
        return p.data.featured === true;
      })
      .sort(sortByEndDateDesc);

    if (featured.length > MAX_FEATURED_WORK) {
      var titles = featured.map(function (p) {
        return p.data.title;
      });
      throw new Error(
        "Too many featured work projects (" +
          featured.length +
          "/" +
          MAX_FEATURED_WORK +
          "): " +
          titles.join(", ") +
          ". Set `featured: true` on at most " +
          MAX_FEATURED_WORK +
          " project(s) in src/work/."
      );
    }

    return featured;
  });

  eleventyConfig.addCollection("workIndex", function (collectionApi) {
    return collectionApi
      .getFilteredByTag("work")
      .filter(function (p) {
        return p.data.featured !== true;
      })
      .sort(sortByEndDateDesc);
  });

  eleventyConfig.addCollection("writing", function (collectionApi) {
    // All writing items (on-site posts + external stubs), newest first
    return collectionApi
      .getFilteredByTag("writing")
      .filter(isVisible)
      .sort(sortByDateDesc);
  });

  eleventyConfig.addCollection("writingTypes", function (collectionApi) {
    // Type slugs that actually have items, kept in the fixed section order
    var present = new Set();
    collectionApi
      .getFilteredByTag("writing")
      .filter(isVisible)
      .forEach(function (p) {
        if (p.data.type) present.add(p.data.type);
      });
    return WRITING_TYPE_ORDER.filter(function (t) {
      return present.has(t);
    });
  });
};
