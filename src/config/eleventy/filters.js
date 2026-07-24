module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("readableDate", function (date) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  });

  eleventyConfig.addFilter("longDate", function (date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  eleventyConfig.addFilter("byType", function (items, type) {
    if (!type) return items;
    return items.filter(function (p) {
      return p.data.type === type;
    });
  });

  eleventyConfig.addFilter("split", function (str, separator) {
    return str.split(separator);
  });

  eleventyConfig.addFilter("limit", function (array, limit) {
    return array.slice(0, limit);
  });

  eleventyConfig.addFilter("filterByCategory", function (posts, cat) {
    if (!cat) return posts;
    cat = cat.toLowerCase();
    return posts.filter(function (p) {
      if (!p.data.categories) return false;
      var cats = p.data.categories.map(function (s) {
        return s.toLowerCase();
      });
      return cats.includes(cat);
    });
  });

  eleventyConfig.addFilter("slugify", function (str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  });

  eleventyConfig.addFilter("urlencode", function (str) {
    if (!str) return "";
    return encodeURIComponent(String(str));
  });
};
