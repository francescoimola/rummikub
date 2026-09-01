import { describe, it, expect } from "vitest";
import { readFileSync, globSync } from "node:fs";
import { requireBuild } from "./config/require-build.js";

requireBuild();

// Asserts the shipped markup, not the template — the include can be right while _base.njk wires it wrong.
const pages = () => globSync("public/**/index.html");
const html = (file) => readFileSync(file, "utf8");
const css = () => readFileSync("public/css/index.css", "utf8");

// Which at-rule wraps a minified rule: walk back through balanced braces to the block that opens it.
// Matching the condition with a flat regex can't work — the block holds dozens of rules in between.
function enclosingAtRule(needle) {
  const sheet = css();
  const index = sheet.indexOf(needle);
  if (index < 0) return null;
  let depth = 0;
  for (let i = index; i >= 0; i--) {
    if (sheet[i] === "}") depth++;
    else if (sheet[i] === "{") {
      if (depth === 0) return sheet.slice(sheet.lastIndexOf("@", i), i).trim();
      depth--;
    }
  }
  return null;
}

describe("built landmarks", () => {
  it("builds pages to assert against", () => {
    expect(pages().length).toBeGreaterThan(10);
  });

  // An AI/agent audit flagged the missing banner: the nav used to sit in a bare <div class="sidebar">.
  it("gives every page exactly one banner, ahead of main", () => {
    for (const file of pages()) {
      const page = html(file);
      const banner = page.indexOf('<header class="site-banner">');
      expect(banner, `no banner in ${file}`).toBeGreaterThan(-1);
      expect(banner, `banner is not before main in ${file}`).toBeLessThan(page.indexOf("<main"));
      expect((page.match(/<header class="site-banner">/g) || []).length, file).toBe(1);
    }
  });

  // <header>'s content model forbids footer descendants, and the sidebar's desktop footer is a
  // sibling of the banner — which is exactly why .sidebar itself cannot be the <header>.
  it("keeps the sidebar footer outside the banner", () => {
    for (const file of pages()) {
      const page = html(file);
      const banner = page.slice(page.indexOf('<header class="site-banner">'), page.indexOf("</header>"));
      expect(banner, file).not.toContain("<footer");
    }
  });

  it("keeps a single main landmark with the skip-link target", () => {
    for (const file of pages()) {
      expect((html(file).match(/<main\b/g) || []).length, file).toBe(1);
      expect(html(file), file).toContain('<main id="main-content"');
    }
  });

  // Both footers are always in the DOM; only the media queries keep them from both rendering.
  // If these two folds ever stop being complementary the page ships two contentinfo landmarks.
  it("hides exactly one of the two footers at every width", () => {
    expect(enclosingAtRule(".desktop-only{display:none}")).toBe("@media (width<49rem)");
    expect(enclosingAtRule(".mobile-only{visibility:hidden;display:none}")).toBe("@media (width>=49rem)");
  });

  // The Illustrations rule sets padding over the declared icon size; scoped to a <header> it would
  // inflate the border-box of the sidebar's sun/moon icons and collapse their viewport to zero.
  it("never applies the illustration padding to a bare header", () => {
    expect(css()).not.toMatch(/(^|[,}])header svg/);
  });
});
