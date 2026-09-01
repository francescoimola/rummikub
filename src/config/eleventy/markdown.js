var markdownIt = require("markdown-it");
var markdownItAttrs = require("markdown-it-attrs");

module.exports = function (eleventyConfig) {
  var markdownItOptions = {
    html: true,
  };

  var md = markdownIt(markdownItOptions).use(markdownItAttrs);

  var defaultImageRender = md.renderer.rules.image || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    var token = tokens[idx];
    var srcIndex = token.attrIndex("src");

    if (srcIndex >= 0) {
      var src = token.attrs[srcIndex][1];
      if (src.startsWith("http://") || src.startsWith("https://")) {
        token.attrPush(["eleventy:ignore", ""]);
      }
    }

    return defaultImageRender(tokens, idx, options, env, self);
  };

  var defaultLinkOpenRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    var token = tokens[idx];
    var hrefIndex = token.attrIndex("href");

    if (hrefIndex >= 0) {
      var href = token.attrs[hrefIndex][1];
      var isExternal = false;

      try {
        var parsedUrl = new URL(href);
        var isHttp = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
        var isAllowedInternal =
          parsedUrl.protocol === "https:" && parsedUrl.hostname === "francescoimola.com";

        isExternal = isHttp && !isAllowedInternal;
      } catch (e) {
        isExternal = false;
      }

      if (isExternal) {
        token.attrPush(["target", "_blank"]);
        token.attrPush(["rel", "noopener noreferrer"]);
      }
    }

    return defaultLinkOpenRender(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", md);
};
