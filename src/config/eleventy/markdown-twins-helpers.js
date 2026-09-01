// Pure HTML-string helpers for the .md twins. Kept in their own module so they export
// cleanly (markdown-twins.js's own module.exports is the setup function) and stay unit-testable.
const TurndownService = require("turndown");

// One instance per process: turndown compiles its rule set on construction.
const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// <picture> reaches turndown as a bare wrapper, so keep the <img> and drop the <source>s.
turndown.addRule("picture", {
  filter: ["picture"],
  replacement: function (_content, node) {
    const img = node.querySelector ? node.querySelector("img") : null;
    return img ? turndown.turndown(img.outerHTML) : "";
  },
});

// Videos have no markdown equivalent — represent them by their aria-label so the alt text survives.
turndown.addRule("video", {
  filter: ["video"],
  replacement: function (_content, node) {
    const label = node.getAttribute ? node.getAttribute("aria-label") : "";
    return label ? "\n[Video: " + label + "]\n" : "";
  },
});

// Only one <main> per page, never nested — a non-greedy match to the first close is exact.
function extractMain(html) {
  const match = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(String(html || ""));
  return match ? match[1] : "";
}

function extractTitle(html) {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(String(html || ""));
  return match ? decodeEntities(match[1].trim()) : "";
}

function extractDescription(html) {
  const match = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(String(html || ""));
  return match ? decodeEntities(match[1].trim()) : "";
}

// A page opting out of indexing opts out of a twin too — same rule the sitemap applies.
function isNoindex(html) {
  return /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(String(html || ""));
}

// The four entities _meta.njk and the templates can emit into these fields.
function decodeEntities(value) {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// Quote-wrap so a colon or a leading # in a title can't break the frontmatter block.
function yamlString(value) {
  return '"' + String(value == null ? "" : value).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function renderFrontmatter(fields) {
  const lines = Object.keys(fields)
    .filter(function (key) { return fields[key]; })
    .map(function (key) { return key + ": " + yamlString(fields[key]); });
  return "---\n" + lines.join("\n") + "\n---\n\n";
}

// Turndown leaves runs of blank lines behind wherever a figure or video was stripped.
function collapseBlankLines(markdown) {
  return markdown.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

// The whole conversion: built page in, finished .md document out.
function htmlToMarkdownDoc(html, url) {
  const body = turndown.turndown(extractMain(html));
  const frontmatter = renderFrontmatter({
    title: extractTitle(html),
    url: url,
    description: extractDescription(html),
  });
  return frontmatter + collapseBlankLines(body);
}

module.exports = {
  extractMain,
  extractTitle,
  extractDescription,
  isNoindex,
  decodeEntities,
  yamlString,
  renderFrontmatter,
  collapseBlankLines,
  htmlToMarkdownDoc,
};
