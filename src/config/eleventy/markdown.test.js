import { describe, it, expect, vi } from "vitest";
import markdown from "./markdown.js";

function createMockEleventyConfig() {
  return {
    setLibrary: vi.fn(),
  };
}

describe("markdown.js", () => {
  it("sets the markdown library on eleventyConfig", () => {
    const config = createMockEleventyConfig();
    markdown(config);

    expect(config.setLibrary).toHaveBeenCalledWith("md", expect.anything());
  });

  it("configures markdown-it with html enabled", () => {
    const config = createMockEleventyConfig();
    markdown(config);

    const mdLib = config.setLibrary.mock.calls[0][1];
    expect(mdLib.options.html).toBe(true);
  });

  describe("image renderer rule", () => {
    it("adds eleventy:ignore to remote image tokens", () => {
      const config = createMockEleventyConfig();
      markdown(config);

      const mdLib = config.setLibrary.mock.calls[0][1];

      const tokens = [
        {
          type: "image",
          attrs: [["src", "https://example.com/photo.jpg"]],
          attrIndex: (name) => {
            return tokens[0].attrs.findIndex((a) => a[0] === name);
          },
          attrPush: (attr) => tokens[0].attrs.push(attr),
          children: [],
          level: 0,
          tag: "img",
          nesting: 0,
          markup: "!",
          info: "",
          meta: null,
          block: false,
          hidden: false,
        },
      ];

      const defaultRender = vi.fn(() => "<img>");
      mdLib.renderer.rules.image = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const srcIndex = token.attrIndex("src");
        if (srcIndex >= 0) {
          const src = token.attrs[srcIndex][1];
          if (src.startsWith("http://") || src.startsWith("https://")) {
            token.attrPush(["eleventy:ignore", ""]);
          }
        }
        return defaultRender(tokens, idx, options, env, self);
      };

      const result = mdLib.renderer.rules.image(
        tokens,
        0,
        {},
        {},
        { renderToken: () => "" }
      );

      expect(tokens[0].attrs).toContainEqual(["eleventy:ignore", ""]);
    });

    it("does not add eleventy:ignore to local images", () => {
      const config = createMockEleventyConfig();
      markdown(config);

      const mdLib = config.setLibrary.mock.calls[0][1];

      const tokens = [
        {
          type: "image",
          attrs: [["src", "/assets/local.jpg"]],
          attrIndex: (name) => {
            return tokens[0].attrs.findIndex((a) => a[0] === name);
          },
          attrPush: (attr) => tokens[0].attrs.push(attr),
          children: [],
          level: 0,
          tag: "img",
          nesting: 0,
          markup: "!",
          info: "",
          meta: null,
          block: false,
          hidden: false,
        },
      ];

      mdLib.renderer.rules.image = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const srcIndex = token.attrIndex("src");
        if (srcIndex >= 0) {
          const src = token.attrs[srcIndex][1];
          if (src.startsWith("http://") || src.startsWith("https://")) {
            token.attrPush(["eleventy:ignore", ""]);
          }
        }
        return "<img>";
      };

      mdLib.renderer.rules.image(tokens, 0, {}, {}, {});

      expect(
        tokens[0].attrs.some((a) => a[0] === "eleventy:ignore")
      ).toBe(false);
    });
  });

  describe("link renderer rule", () => {
    it("adds target and rel to external links", () => {
      const config = createMockEleventyConfig();
      markdown(config);

      const mdLib = config.setLibrary.mock.calls[0][1];

      const result = mdLib.render("[Framer site](https://makeandmindworkshops.framer.website)");

      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener noreferrer"');
    });

    it("does not add target/rel to internal links", () => {
      const config = createMockEleventyConfig();
      markdown(config);

      const mdLib = config.setLibrary.mock.calls[0][1];

      const result = mdLib.render("[About](/about/)");

      expect(result).not.toContain("target=");
      expect(result).not.toContain("rel=");
    });

    it("does not add target/rel to links on the site's own domain", () => {
      const config = createMockEleventyConfig();
      markdown(config);

      const mdLib = config.setLibrary.mock.calls[0][1];

      const result = mdLib.render("[Writing](https://francescoimola.com/writing/)");

      expect(result).not.toContain("target=");
      expect(result).not.toContain("rel=");
    });
  });

  describe("markdown rendering", () => {
    it("renders markdown with image", () => {
      const config = createMockEleventyConfig();
      markdown(config);

      const mdLib = config.setLibrary.mock.calls[0][1];

      const result = mdLib.render("![Alt](https://example.com/img.jpg)");

      expect(result).toContain("<img");
      expect(result).toContain("https://example.com/img.jpg");
      expect(result).toContain("eleventy:ignore");
    });

    it("renders markdown with local image without ignore", () => {
      const config = createMockEleventyConfig();
      markdown(config);

      const mdLib = config.setLibrary.mock.calls[0][1];

      const result = mdLib.render("![Alt](/assets/photo.jpg)");

      expect(result).toContain("<img");
      expect(result).toContain("/assets/photo.jpg");
      expect(result).not.toContain("eleventy:ignore");
    });

    it("renders basic markdown", () => {
      const config = createMockEleventyConfig();
      markdown(config);

      const mdLib = config.setLibrary.mock.calls[0][1];

      const result = mdLib.render("# Hello\n\nParagraph");

      expect(result).toContain("<h1>Hello</h1>");
      expect(result).toContain("<p>Paragraph</p>");
    });
  });
});
