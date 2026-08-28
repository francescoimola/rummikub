// fallow-ignore-file coverage-gaps
// Eleventy directory data, loaded by filename convention rather than imported.
module.exports = {
  tags: "writing",
  layout: "_base.njk",
  templateEngineOverride: "njk,md",
  contentMode: "contrast",
  eleventyComputed: {
    permalink: (data) => (data.external ? false : data.permalink),
  },
};