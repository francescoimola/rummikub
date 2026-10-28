import { describe, it, expect } from "vitest";
import { readFileSync, globSync, existsSync } from "node:fs";
import { requireBuild } from "./config/require-build.js";

requireBuild();

// Asserts the shipped markup, not the template — the include can be right while _base.njk wires it wrong.
const pages = () => globSync("public/**/index.html");
const html = (file) => readFileSync(file, "utf8");
const css = () => readFileSync("public/css/index.css", "utf8");

describe("built landmarks", () => {
  it("builds pages to assert against", () => {
    expect(pages().length).toBeGreaterThan(10);
  });

  // The object-position picker is a dev tool: _base.njk links it and the config copies it only under `eleventy --serve`.
  it("ships no dev-only focal picker", () => {
    const hint = "public/ holds dev-server output? Stop `pnpm start`, then `pnpm build`";
    expect(existsSync("public/assets/dev"), hint).toBe(false);
    for (const file of pages()) {
      expect(html(file), `focal-picker linked from ${file}. ${hint}`).not.toContain("focal-picker");
    }
  });

  // An AI/agent audit flagged the missing banner: the nav used to sit in a bare <div class="sidebar">.
  it("gives every page exactly one banner, ahead of main", () => {
    for (const file of pages()) {
      const page = html(file);
      const banner = page.indexOf('<header class="site-banner');
      expect(banner, `no banner in ${file}`).toBeGreaterThan(-1);
      expect(banner, `banner is not before main in ${file}`).toBeLessThan(page.indexOf("<main"));
      expect((page.match(/<header class="site-banner/g) || []).length, file).toBe(1);
    }
  });

  // The current marker is set by URL prefix in _header.njk; a second match would show two bullets.
  const primaryNav = (page) => {
    const start = page.indexOf('<nav aria-label="Primary"');
    return start < 0 ? "" : page.slice(start, page.indexOf("</nav>", start));
  };
  const currentLabel = (file) => (primaryNav(html(file)).match(/aria-current="page">([^<]*)</) || [])[1];

  // Every page, Collaborate, Accessibility and 404 included, gets the full header (#72).
  it("gives every page exactly one Primary nav", () => {
    for (const file of pages()) {
      expect((html(file).match(/<nav aria-label="Primary"/g) || []).length, file).toBe(1);
    }
    for (const file of ["public/collaborate/index.html", "public/about/accessibility/index.html", "public/404.html"]) {
      expect(primaryNav(html(file)), file).toContain('href="/studio/"');
      expect(html(file), file).not.toContain("site-banner--minimal");
    }
  });

  it("marks at most one primary nav link as current", () => {
    for (const file of pages()) {
      expect((primaryNav(html(file)).match(/aria-current=/g) || []).length, file).toBeLessThanOrEqual(1);
    }
  });

  it("marks Ideas on writing posts and nothing on case studies", () => {
    const posts = globSync("public/writing/*/index.html");
    const caseStudies = globSync("public/work/*/index.html");
    expect(posts.length).toBeGreaterThan(0);
    expect(caseStudies.length).toBeGreaterThan(0);
    for (const file of posts) expect(currentLabel(file), file).toBe("Ideas");
    for (const file of caseStudies) expect(currentLabel(file), file).toBeUndefined();
  });

  // /work/ redirects to /#case-studies, so the Featured heading must keep that id.
  it("gives the homepage the #case-studies anchor", () => {
    expect((html("public/index.html").match(/id="case-studies"/g) || []).length).toBe(1);
  });

  // /work/ and /contact/ are retired (FRN-2026): their traffic lands on homepage and footer anchors.
  const redirects = () =>
    readFileSync("public/_redirects", "utf8")
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"))
      .map((line) => line.trim().split(/\s+/));
  const normalise = (path) => path.replace(/#.*$/, "").replace(/(.)\/$/, "$1");

  it("redirects the retired /work and /contact pages to their anchors", () => {
    const map = Object.fromEntries(redirects().map(([from, to, code]) => [from, [to, code]]));
    expect(map["/work"]).toEqual(["/#case-studies", "301"]);
    expect(map["/contact"]).toEqual(["/#contact", "301"]);
    expect(existsSync("public/work/index.html")).toBe(false);
    expect(existsSync("public/contact/index.html")).toBe(false);
  });

  // A target that is itself a source would chain two hops (or loop).
  it("never redirects to another redirect source", () => {
    const sources = new Set(redirects().map(([from]) => normalise(from)));
    for (const [from, to] of redirects()) {
      expect(sources.has(normalise(to)), `${from} -> ${to}`).toBe(false);
    }
  });

  it("leaves the retired pages out of the sitemap", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    expect(sitemap).not.toMatch(/\/work\/<\/loc>/);
    expect(sitemap).not.toMatch(/\/contact\/<\/loc>/);
  });

  it("keeps a single main landmark with the skip-link target", () => {
    for (const file of pages()) {
      expect((html(file).match(/<main\b/g) || []).length, file).toBe(1);
      expect(html(file), file).toContain('<main id="main-content"');
    }
  });

  // One footer serves every width (a container query folds it), and it holds the header's "Say hello" target.
  it("gives every page exactly one footer, carrying the #contact anchor", () => {
    for (const file of [...pages(), "public/404.html"]) {
      const page = html(file);
      expect((page.match(/<footer\b/g) || []).length, file).toBe(1);
      expect((page.match(/id="contact"/g) || []).length, file).toBe(1);
    }
  });

  // The Illustrations rule sets padding over the declared icon size; scoped to a <header> it would
  // inflate the border-box of the sidebar's sun/moon icons and collapse their viewport to zero.
  it("never applies the illustration padding to a bare header", () => {
    expect(css()).not.toMatch(/(^|[,}])header svg/);
  });
});

// AGENTS.md "Titles & meta descriptions": title 30–60 chars, description 120–160, both unique per page.
// These pages predate the check. Fix one, then delete it here; a listed page that now passes fails the test.
const META_EXCEPTIONS = [
  "public/about/colophon/index.html",
  "public/work/open-art-folke/index.html",
  "public/writing/2026-08-28-service-jobs-taught-me-everything/index.html",
  "public/writing/disclaimer/index.html",
  "public/writing/i-hope/index.html",
  "public/writing/ponzi/index.html",
];

const unescapeEntities = (text) => text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const headValue = (page, pattern) => {
  const match = page.match(pattern);
  return match ? unescapeEntities(match[1]).trim() : "";
};
const metaOf = (file) => ({
  title: headValue(html(file), /<title>(.*?)<\/title>/s),
  description: headValue(html(file), /<meta name="description" content="(.*?)"/s),
});
const metaProblems = ({ title, description }) => {
  const problems = [];
  if (title.length < 30 || title.length > 60) problems.push(`title is ${title.length} chars (30–60)`);
  if (description.length < 120 || description.length > 160) problems.push(`description is ${description.length} chars (120–160)`);
  return problems;
};

describe("built meta", () => {
  const files = () => globSync("public/**/*.html");

  it("keeps titles and descriptions within the length targets", () => {
    for (const file of files().filter((f) => !META_EXCEPTIONS.includes(f))) {
      expect(metaProblems(metaOf(file)), file).toEqual([]);
    }
  });

  it("lists only pages that still miss the targets", () => {
    for (const file of META_EXCEPTIONS) {
      expect(metaProblems(metaOf(file)).length, `${file} passes now: delete it from META_EXCEPTIONS`).toBeGreaterThan(0);
    }
  });

  it("gives every page its own title and description", () => {
    const seen = { title: new Map(), description: new Map() };
    for (const file of files()) {
      const meta = metaOf(file);
      for (const field of ["title", "description"]) {
        if (!meta[field]) continue;
        expect(seen[field].get(meta[field]), `${field} of ${file} repeats the one on ${seen[field].get(meta[field])}`).toBeUndefined();
        seen[field].set(meta[field], file);
      }
    }
  });
});
