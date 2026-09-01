// fallow-ignore-file coverage-gaps
// Writes a .md twin next to every built page so AI clients can read the content without the DOM.
// Runs on eleventy.after rather than as a paginated template: `results` hands over the final
// post-transform HTML, so the twin matches what a browser renders, with no templateContent ordering.
const { writeFile } = require("fs/promises");

const site = require("../../_data/site.json");
const { htmlToMarkdownDoc, isNoindex } = require("./markdown-twins-helpers");

// Same guard shape as sitemap.njk: directory-style URLs only, and never a noindex page.
function wantsTwin(result) {
  if (!result.outputPath || !result.outputPath.endsWith("index.html")) return false;
  if (!result.url || result.url.slice(-1) !== "/") return false;
  return !isNoindex(result.content);
}

function twinPath(outputPath) {
  return outputPath.replace(/index\.html$/, "index.md");
}

async function writeTwin(result) {
  const doc = htmlToMarkdownDoc(result.content, site.url + result.url);
  await writeFile(twinPath(result.outputPath), doc, "utf8");
}

module.exports = function (eleventyConfig) {
  eleventyConfig.on("eleventy.after", async function (event) {
    const results = (event && event.results) || [];
    await Promise.all(results.filter(wantsTwin).map(writeTwin));
  });
};
