module.exports = function (eleventyConfig) {
  eleventyConfig.addTransform("lazyImages", function (content, outputPath) {
    if (typeof outputPath === "string" && outputPath.endsWith(".html")) {
      content = content.replace(/<img(?![^>]*\bloading=)([^>]*)>/gi, '<img loading="lazy"$1>');
      content = content.replace(/<img(?![^>]*\bdecoding=)([^>]*)>/gi, '<img decoding="async"$1>');
    }
    return content;
  });
};
