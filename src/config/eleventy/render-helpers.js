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

function renderSources(webm, fallback) {
  if (!webm) return "";
  return '<source data-src="' + escapeAttr(webm) + '" type="video/webm"><source data-src="' + escapeAttr(fallback) + '" type="video/mp4">';
}

function renderAttr(name, value) {
  if (!value) return "";
  return ' ' + name + '="' + escapeAttr(value) + '"';
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

module.exports = { escapeAttr, renderSources, renderAttr, renderFigcaption, renderFigure };
