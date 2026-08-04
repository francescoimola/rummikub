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
    widths: [400, 600, 800, 1080, 1200, 1440, 2560, "auto"],
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
