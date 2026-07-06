module.exports = function (eleventyConfig) {
  eleventyConfig.addTransform("ignoreRemoteImages", function (content, outputPath) {
    if (outputPath?.endsWith(".html")) {
      content = content.replace(
        /<img\s+([^>]*?)src=["'](https?:\/\/[^"']+)["']([^>]*?)>/gi,
        function (match, before, url, after) {
          if (match.includes("eleventy:ignore")) {
            return match;
          }
          return "<img " + before + 'src="' + url + '"' + after + " eleventy:ignore>";
        }
      );
    }
    return content;
  });

  eleventyConfig.addTransform("lazyImages", function (content, outputPath) {
    if (outputPath?.endsWith(".html")) {
      content = content.replace(/<img(?![^>]*\bloading=)([^>]*)>/gi, '<img loading="lazy"$1>');
      content = content.replace(/<img(?![^>]*\bdecoding=)([^>]*)>/gi, '<img decoding="async"$1>');
    }
    return content;
  });
};
