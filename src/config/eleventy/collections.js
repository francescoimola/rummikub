module.exports = function (eleventyConfig) {
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
