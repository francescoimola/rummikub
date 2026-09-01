import { describe, it, expect } from "vitest";
import {
  extractMain,
  extractTitle,
  extractDescription,
  isNoindex,
  yamlString,
  renderFrontmatter,
  collapseBlankLines,
  htmlToMarkdownDoc,
} from "./markdown-twins-helpers.js";

const page = (main, head = "") => `<!DOCTYPE html><html><head>${head}</head>
  <body><header class="sidebar"><nav>Nav</nav></header>
  <main id="main-content">${main}</main><footer>Footer</footer></body></html>`;

describe("markdown twin helpers", () => {
  describe("extractMain", () => {
    it("takes the main content and nothing around it", () => {
      const html = extractMain(page("<p>Body</p>"));
      expect(html).toBe("<p>Body</p>");
      expect(html).not.toContain("Nav");
      expect(html).not.toContain("Footer");
    });

    it("keeps nested markup that happens to contain the word main", () => {
      expect(extractMain(page('<div class="domain">x</div>'))).toBe('<div class="domain">x</div>');
    });

    it("returns an empty string when there is no main", () => {
      expect(extractMain("<html><body><p>x</p></body></html>")).toBe("");
      expect(extractMain(null)).toBe("");
    });
  });

  describe("extractTitle / extractDescription", () => {
    it("decodes the entities the templates emit", () => {
      const head = `<title>Make &amp; Mind | It isn&#39;t easy</title>
        <meta name="description" content="Quotes &quot;inside&quot; &amp; ampersands" />`;
      expect(extractTitle(page("", head))).toBe("Make & Mind | It isn't easy");
      expect(extractDescription(page("", head))).toBe('Quotes "inside" & ampersands');
    });

    it("returns an empty string when the tag is absent", () => {
      expect(extractTitle(page(""))).toBe("");
      expect(extractDescription(page(""))).toBe("");
    });
  });

  // The sitemap and the twins must agree on what counts as publishable.
  describe("isNoindex", () => {
    it("spots the robots meta", () => {
      expect(isNoindex(page("", '<meta name="robots" content="noindex" />'))).toBe(true);
      expect(isNoindex(page("", '<meta name="robots" content="noindex, nofollow" />'))).toBe(true);
    });

    it("is false for an ordinary page", () => {
      expect(isNoindex(page("", "<title>x</title>"))).toBe(false);
    });
  });

  describe("frontmatter", () => {
    it("quotes values so a colon or hash cannot break the block", () => {
      expect(yamlString("Welcome: why bother?")).toBe('"Welcome: why bother?"');
      expect(yamlString('He said "hi"')).toBe('"He said \\"hi\\""');
      expect(yamlString(null)).toBe('""');
    });

    it("drops empty fields rather than emitting bare keys", () => {
      expect(renderFrontmatter({ title: "T", url: "U", description: "" })).toBe(
        '---\ntitle: "T"\nurl: "U"\n---\n\n',
      );
    });
  });

  // Stripped figures and videos leave runs of blank lines behind.
  describe("collapseBlankLines", () => {
    it("caps blank runs at one and ends with a single newline", () => {
      expect(collapseBlankLines("a\n\n\n\n\nb\n\n\n")).toBe("a\n\nb\n");
    });
  });

  describe("htmlToMarkdownDoc", () => {
    it("emits frontmatter then the converted main content", () => {
      const doc = htmlToMarkdownDoc(
        page("<h1>Title</h1><p>Some <strong>bold</strong> text.</p>", "<title>T</title>"),
        "https://francescoimola.com/x/",
      );
      expect(doc).toMatch(/^---\ntitle: "T"\nurl: "https:\/\/francescoimola\.com\/x\/"\n---\n\n/);
      expect(doc).toContain("# Title");
      expect(doc).toContain("Some **bold** text.");
    });

    it("carries no page chrome and no HTML tags", () => {
      const doc = htmlToMarkdownDoc(page("<p>Body</p>"), "https://francescoimola.com/");
      expect(doc).not.toContain("Nav");
      expect(doc).not.toContain("Footer");
      expect(doc).not.toMatch(/<\/?(p|div|nav|header|footer|main)\b/);
    });

    // figureImg emits <picture>; without the custom rule turndown would drop the img entirely.
    it("keeps the img out of a picture and its caption", () => {
      const figure = `<figure><picture><source srcset="/a.webp" type="image/webp">
        <img src="/a.jpeg" alt="A photo"></picture><figcaption>A caption</figcaption></figure>`;
      const doc = htmlToMarkdownDoc(page(figure), "https://francescoimola.com/");
      expect(doc).toContain("![A photo](/a.jpeg)");
      expect(doc).toContain("A caption");
      expect(doc).not.toContain("srcset");
    });

    // Video has no markdown equivalent, so the aria-label is the only thing worth carrying over.
    it("represents a video by its label", () => {
      const video = '<video aria-label="A screen recording" src="/a.mp4"></video>';
      expect(htmlToMarkdownDoc(page(video), "https://francescoimola.com/")).toContain(
        "[Video: A screen recording]",
      );
    });
  });
});
