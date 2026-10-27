const fs = require("fs");
const path = require("path");

// Pure HTML-string helpers for the shortcodes. Kept in their own module so they export
// cleanly (shortcodes.js's own module.exports is the setup function) and stay unit-testable.

// Escape a value for a double-quoted attribute. & runs first, or the ampersands the later
// replacements introduce get escaped a second time.
function escapeAttr(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderAttr(name, value) {
  if (!value) return "";
  return ' ' + name + '="' + escapeAttr(value) + '"';
}

// ratio="3:2" → the --ratio-3-2 token (G11). The tokens in _scale.scss are the one list; anything else is an authoring typo.
function ratiosFromScale(scss) {
  return (scss.match(/--ratio-\d+-\d+(?=:)/g) || []).map(function (token) {
    return token.replace("--ratio-", "").replace("-", ":");
  });
}
var RATIOS = ratiosFromScale(fs.readFileSync(path.join(__dirname, "../../css/_scale.scss"), "utf8"));

// Inline style for a media element: ratio crops it (cover), position moves the crop (pick it with the dev-only Alt+click picker)
function mediaStyle(ratio, position) {
  var rules = [];
  if (ratio) {
    if (RATIOS.indexOf(ratio) < 0) {
      throw new Error('Unknown ratio "' + ratio + '". Use one of: ' + RATIOS.join(", "));
    }
    rules.push("aspect-ratio: var(--ratio-" + ratio.replace(":", "-") + ")", "object-fit: cover");
  }
  if (position) rules.push("object-position: " + position);
  return renderAttr("style", rules.join("; "));
}

// Caption is text content, not an attribute — left unescaped so authored entities survive.
function renderFigcaption(caption) {
  if (!caption) return "";
  return '\n  <figcaption class="has-text-grey">' + caption + "</figcaption>";
}

// The <figure> shell both shortcodes share. `body` supplies its own indentation.
function renderFigure(body, className, caption) {
  return (
    "<figure" + renderAttr("class", className) + ">\n" +
    body + renderFigcaption(caption) + "\n" +
    "</figure>"
  );
}

module.exports = { escapeAttr, renderAttr, renderFigcaption, renderFigure, mediaStyle };
