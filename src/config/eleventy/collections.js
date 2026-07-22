const MAX_FEATURED_WORK = 3;

function sortByEndDateDesc(a, b) {
  return String(b.data.endDate || "").localeCompare(String(a.data.endDate || ""));
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

  eleventyConfig.addCollection("blogCategories", function (collectionApi) {
    var categories = new Set();
    var posts = collectionApi.getFilteredByTag("blog");
    posts.forEach(function (p) {
      if (p.data.categories) {
        p.data.categories.forEach(function (c) {
          categories.add(c);
        });
      }
    });
    return Array.from(categories).sort();
  });
};
