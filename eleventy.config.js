// fallow-ignore-file coverage-gaps
// Build-time config, never shipped to a browser — the suites assert its output instead.
const { promisify } = require("util");
const { readFile } = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

const setupMarkdown = require("./src/config/eleventy/markdown");
const setupTransforms = require("./src/config/eleventy/transforms");
const setupCollections = require("./src/config/eleventy/collections");
const setupFilters = require("./src/config/eleventy/filters");
const setupShortcodes = require("./src/config/eleventy/shortcodes");

function filenameFormat(_id, src, width, format) {
  var ext = path.extname(src);
  var name = path.basename(src, ext);
  return name + "-" + width + "w." + format;
}

module.exports = function (eleventyConfig) {
  if (!eleventyConfig) {
    throw new Error("Eleventy configuration is null or undefined.");
  }

  eleventyConfig.addPlugin(eleventySass);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    outputDir: "./public/assets/images",
    urlPath: "/assets/images/",
    // 1920 is an explicit rung so 1920px sources keep a native-width variant; "auto" would also emit
    // 3024w–3767w files nothing requests, plus 2561w duplicates of the 2560 rung.
    widths: [400, 600, 800, 1080, 1200, 1440, 1920, 2560],
    // sharp's defaults (webp q80/effort 4, baseline jpeg q80) leave ~25% on the table on the grainy
    // photo and halftone sources here. q75 at effort 6 is indistinguishable at 1:1 — checked on crops.
    sharpWebpOptions: { quality: 75, effort: 6 },
    // mozjpeg is ~15% smaller at identical quality; the jpeg is only the no-webp fallback anyway.
    sharpJpegOptions: { quality: 78, mozjpeg: true, progressive: true },
    // Without this sharp reads frame 1 only, so animated gifs silently ship as a still. Self-limiting
    // to gifs: the plugin's default formatFiltering only treats gif/webp sources as animated, and
    // then drops the non-animatable jpeg from `formats` for those alone. Other sources are untouched.
    sharpOptions: { animated: true },
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
    filenameFormat: filenameFormat,
  });

  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.setServerOptions({ domDiff: false });

  setupMarkdown(eleventyConfig);
  setupTransforms(eleventyConfig);
  setupCollections(eleventyConfig);
  setupFilters(eleventyConfig);
  setupShortcodes(eleventyConfig);

  eleventyConfig.addPassthroughCopy("src/assets/favicon");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/scripts");
  eleventyConfig.addPassthroughCopy("src/assets/portfolio");
  eleventyConfig.addPassthroughCopy("src/assets/writing");
  eleventyConfig.addPassthroughCopy("src/assets/art");
  eleventyConfig.addPassthroughCopy("src/assets/video");
  eleventyConfig.addPassthroughCopy("src/assets/images/*.gif");
  eleventyConfig.addPassthroughCopy("src/assets/open_graph_image.png");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/_headers");

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
