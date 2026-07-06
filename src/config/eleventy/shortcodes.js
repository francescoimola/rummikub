var path = require("path");

function renderSources(webm, fallback) {
  if (!webm) return "";
  return '<source data-src="' + webm + '" type="video/webm"><source data-src="' + fallback + '" type="video/mp4">';
}

function renderAttr(name, value) {
  if (!value) return "";
  return ' ' + name + '="' + value + '"';
}

function renderFigcaption(caption) {
  if (!caption) return "";
  return '\n  <figcaption class="has-text-grey">' + caption + "</figcaption>";
}

module.exports = function (eleventyConfig, eleventyImage, filenameFormat) {
  eleventyConfig.addShortcode("remoteImg", function (src, width, height, alt, attrs) {
    attrs = attrs || "";
    return '<img src="' + src + '" width="' + width + '" height="' + height + '" alt="' + alt + '" ' + attrs + ' eleventy:ignore>';
  });

  eleventyConfig.addShortcode("animatedImg", async function (src, alt, options) {
    options = options || {};
    var fsSrc = src.startsWith("/") ? "src" + src : path.resolve("src", src);

    var metadata = await eleventyImage(fsSrc, {
      widths: [400, 800, 1200],
      formats: ["webp", "gif"],
      sharpOptions: { animated: true, limitInputPixels: false },
      outputDir: "./public/assets/images",
      urlPath: "/assets/images/",
      filenameFormat: filenameFormat,
    });

    return eleventyImage.generateHTML(metadata, {
      alt: alt,
      sizes: options.sizes || "(max-width: 49rem) 100vw, 60ch",
      loading: "lazy",
      decoding: "async",
      "eleventy:ignore": "",
    });
  });

  eleventyConfig.addShortcode("projectVideo", function (src, alt, options) {
    alt = alt || "";
    options = options || {};
    var poster = options.poster;
    var webm = options.webm;
    var caption = options.caption;

    var posterAttr = renderAttr("poster", poster);
    var sources = renderSources(webm, src);
    var dataSrc = webm ? "" : renderAttr("data-src", src);
    var figcaption = renderFigcaption(caption);

    return (
      '<figure class="project-video">\n' +
      '  <div class="project-video-wrapper">\n' +
      '    <video class="project-video-el" muted loop playsinline preload="none"' + dataSrc + posterAttr + ' aria-label="' + alt + '">' + sources + '</video>\n' +
      '    <button class="project-video-play" type="button" aria-label="Play video">\n' +
      '      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">\n' +
      '        <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.45)"/>\n' +
      '        <path d="M19 15l14 9-14 9V15z" fill="white"/>\n' +
      '      </svg>\n' +
      '    </button>\n' +
      '  </div>' + figcaption + '\n' +
      '</figure>'
    );
  });
};
