import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, globSync } from "node:fs";
import { requireBuild } from "./config/require-build.js";

requireBuild();

// Asserts the shipped .md, not the helpers — the conversion can be right while the writer skips pages.
const read = (file) => readFileSync(`public/${file}`, "utf8");
const twins = () => globSync("public/**/index.md");
const htmlPages = () => globSync("public/**/index.html");

describe("built markdown twins", () => {
  it("writes one twin per built page", () => {
    expect(twins().length).toBe(htmlPages().length);
  });

  it("covers the homepage, a case study and a writing post", () => {
    expect(existsSync("public/index.md")).toBe(true);
    expect(existsSync("public/work/the-loft/index.md")).toBe(true);
    expect(existsSync("public/writing/ponzi/index.md")).toBe(true);
  });

  it("opens with frontmatter naming the canonical URL", () => {
    expect(read("index.md")).toMatch(/^---\ntitle: ".+"\nurl: "https:\/\/francescoimola\.com\/"/);
    expect(read("about/index.md")).toContain('url: "https://francescoimola.com/about/"');
  });

  // The whole point is fewer tokens and no DOM noise — a twin carrying markup has failed at both.
  it("carries no HTML tags and no page chrome", () => {
    for (const file of twins()) {
      const doc = readFileSync(file, "utf8");
      expect(doc, file).not.toMatch(/<\/?(div|p|nav|header|footer|main|section|picture|source)\b/);
      expect(doc, file).not.toContain("Skip to content");
    }
  });

  it("keeps the body content, not just the frontmatter", () => {
    const body = read("writing/ponzi/index.md").split("---\n")[2];
    expect(body.trim().length).toBeGreaterThan(200);
  });

  // 404 is permalink: /404.html, so it never matches the index.html guard.
  it("skips the noindex 404 page", () => {
    expect(existsSync("public/404.md")).toBe(false);
  });
});

describe("built llms.txt", () => {
  const llms = () => read("llms.txt");

  it("is plain text with no leaked HTML entities", () => {
    expect(llms()).not.toMatch(/&(amp|quot|#39|lt|gt);/);
  });

  it("keeps its section headings intact", () => {
    for (const heading of ["## Pages", "## Work", "## Writing", "## Feeds"]) {
      expect(llms()).toContain(`\n${heading}\n`);
    }
  });

  // Every on-site link must resolve to a twin that was actually written.
  it("links only to markdown files that exist", () => {
    const urls = [...llms().matchAll(/\]\((https:\/\/francescoimola\.com\/[^)]*\.md)\)/g)];
    expect(urls.length).toBeGreaterThan(10);
    for (const [, url] of urls) {
      const path = "public" + url.replace("https://francescoimola.com", "");
      expect(existsSync(path), `llms.txt links a missing twin: ${url}`).toBe(true);
    }
  });

  it("sends external writing to its source, not to a twin that was never built", () => {
    expect(llms()).toContain("https://open.substack.com/pub/notbadnotbad/");
    expect(llms()).not.toContain("/writing/being-visible-not-a-civic-duty/");
  });

  // hidden: true keeps a page out of the listings and feeds; llms.txt is a listing too.
  it("omits hidden posts", () => {
    expect(llms()).not.toContain("on-inner-desires");
  });
});

describe("markdown discovery", () => {
  it("advertises the twin from every page that has one", () => {
    for (const file of htmlPages()) {
      const page = readFileSync(file, "utf8");
      const url = file.replace(/^public/, "").replace(/index\.html$/, "");
      expect(page, file).toContain(`<link rel="alternate" type="text/markdown"`);
      expect(page, file).toContain(`href="${url}index.md"`);
    }
  });

  it("declares the content types the twins need", () => {
    const headers = read("_headers");
    expect(headers).toMatch(/\/\*\.md\n\s+Content-Type: text\/markdown/);
    expect(headers).toMatch(/\/llms\.txt\n\s+Content-Type: text\/plain/);
  });
});
