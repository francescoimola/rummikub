module.exports = {
  tags: "writing",
  layout: "_base.njk",
  templateEngineOverride: "njk,md",
  contentMode: "contrast",
  eleventyComputed: {
    permalink: (data) => (data.external ? false : data.permalink),
  },
};