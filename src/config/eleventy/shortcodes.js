var path = require("path");
var fs = require("fs");
var {
  escapeAttr,
  renderSources,
  renderAttr,
  renderFigure,
} = require("./render-helpers");

// Icons are read once per build — figureImg-heavy pages call the same glyph repeatedly.
var iconCache = new Map();

function readIcon(name) {
  if (!iconCache.has(name)) {
    iconCache.set(name, fs.readFileSync(path.resolve("src/assets/icons", name + ".svg"), "utf8"));
  }
  return iconCache.get(name);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("projectVideo", function (src, alt, options) {
    options = options || {};
    var wrapperClass = "project-video-wrapper" + (options.class ? " " + options.class : "");
    var dataSrc = options.webm ? "" : renderAttr("data-src", src);

    var body =
      '  <div class="' + escapeAttr(wrapperClass) + '">\n' +
      '    <video class="project-video-el" muted loop playsinline preload="none"' + dataSrc + renderAttr("poster", options.poster) + ' aria-label="' + escapeAttr(alt || "") + '">' + renderSources(options.webm, src) + '</video>\n' +
      '    <button class="project-video-play" type="button" aria-label="Play video">\n' +
      '      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">\n' +
      '        <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.45)"/>\n' +
      '        <path class="project-video-icon-play" d="M19 15l14 9-14 9V15z" fill="white"/>\n' +
      '        <path class="project-video-icon-pause" d="M18 15h5v18h-5zM25 15h5v18h-5z" fill="white"/>\n' +
      '      </svg>\n' +
      '    </button>\n' +
      '  </div>';

    return renderFigure(body, "project-video", options.caption);
  });

  eleventyConfig.addShortcode("figureImg", function (src, alt, options) {
    options = options || {};
    var img =
      '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(alt || "") + '"' + renderAttr("class", options.imgClass) + ">";

    // href wraps the image in an outbound link — keeps it a <figure>, so the case-study spacing rules still match
    if (options.href) {
      img = '<a href="' + escapeAttr(options.href) + '" target="_blank" rel="noopener noreferrer">' + img + "</a>";
    }

    return renderFigure("  " + img, options.class, options.caption);
  });

  eleventyConfig.addShortcode("icon", function (name, attrs) {
    attrs = attrs || "";
    return readIcon(name).replace("<svg", '<svg aria-hidden="true" focusable="false" ' + attrs);
  });
};
