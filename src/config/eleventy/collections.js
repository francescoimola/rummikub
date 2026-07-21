module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("work", function (collectionApi) {
    // Order by project end date (YYYY-MM string), most recent first
    return collectionApi
      .getFilteredByTag("work")
      .sort(function (a, b) {
        return String(b.data.endDate || "").localeCompare(String(a.data.endDate || ""));
      });
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
