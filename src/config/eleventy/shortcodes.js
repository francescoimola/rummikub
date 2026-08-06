var path = require("path");
var fs = require("fs");
var { renderSources, renderAttr, renderFigcaption } = require("./render-helpers");

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("projectVideo", function (src, alt, options) {
    alt = alt || "";
    options = options || {};
    var poster = options.poster;
    var webm = options.webm;
    var caption = options.caption;
    var wrapperClass = options.class ? " " + options.class : "";

    var posterAttr = renderAttr("poster", poster);
    var sources = renderSources(webm, src);
    var dataSrc = webm ? "" : renderAttr("data-src", src);
    var figcaption = renderFigcaption(caption);

    return (
      '<figure class="project-video">\n' +
      '  <div class="project-video-wrapper' + wrapperClass + '">\n' +
      '    <video class="project-video-el" muted loop playsinline preload="none"' + dataSrc + posterAttr + ' aria-label="' + alt + '">' + sources + '</video>\n' +
      '    <button class="project-video-play" type="button" aria-label="Play video">\n' +
      '      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">\n' +
      '        <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.45)"/>\n' +
      '        <path class="project-video-icon-play" d="M19 15l14 9-14 9V15z" fill="white"/>\n' +
      '        <path class="project-video-icon-pause" d="M18 15h5v18h-5zM25 15h5v18h-5z" fill="white"/>\n' +
      '      </svg>\n' +
      '    </button>\n' +
      '  </div>' + figcaption + '\n' +
      '</figure>'
    );
  });

  eleventyConfig.addShortcode("figureImg", function (src, alt, options) {
    alt = alt || "";
    options = options || {};
    var figcaption = renderFigcaption(options.caption);
    var figureClass = options.class ? ' class="' + options.class + '"' : "";
    var imgClass = options.imgClass ? ' class="' + options.imgClass + '"' : "";
    var img = '<img src="' + src + '" alt="' + alt + '"' + imgClass + ">";

    // href wraps the image in an outbound link — keeps it a <figure>, so the case-study spacing rules still match
    if (options.href) {
      img = '<a href="' + options.href + '" target="_blank" rel="noopener noreferrer">' + img + '</a>';
    }

    return (
      '<figure' + figureClass + '>\n' +
      '  ' + img + figcaption + '\n' +
      '</figure>'
    );
  });

  eleventyConfig.addShortcode("icon", function (name, attrs) {
    attrs = attrs || "";
    var svg = fs.readFileSync(path.resolve("src/assets/icons", name + ".svg"), "utf8");
    return svg.replace("<svg", '<svg aria-hidden="true" focusable="false" ' + attrs);
  });
};
