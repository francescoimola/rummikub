// Pure HTML-string helpers for the projectVideo shortcode. Kept in their own module so they export
// cleanly (shortcodes.js's own module.exports is the setup function) and stay unit-testable.

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

module.exports = { renderSources, renderAttr, renderFigcaption };
