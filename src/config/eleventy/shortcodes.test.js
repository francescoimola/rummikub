import { describe, it, expect, vi } from "vitest";
import shortcodes from "./shortcodes.js";
import {
  renderSources,
  renderAttr,
  renderFigcaption,
} from "./render-helpers.js";

function createMockEleventyConfig() {
  const registered = {};
  return {
    addShortcode: vi.fn((name, fn) => {
      registered[name] = fn;
    }),
    getShortcode: (name) => registered[name],
    _registered: registered,
  };
}

describe("shortcodes.js — pure helpers", () => {
  describe("renderSources", () => {
    it("returns empty string when webm is falsy", () => {
      expect(renderSources(null, "fallback.mp4")).toBe("");
      expect(renderSources("", "fallback.mp4")).toBe("");
      expect(renderSources(undefined, "fallback.mp4")).toBe("");
    });

    it("returns source elements for webm and fallback", () => {
      const result = renderSources("video.webm", "video.mp4");

      expect(result).toContain('data-src="video.webm"');
      expect(result).toContain('type="video/webm"');
      expect(result).toContain('data-src="video.mp4"');
      expect(result).toContain('type="video/mp4"');
    });
  });

  describe("renderAttr", () => {
    it("returns empty string when value is falsy", () => {
      expect(renderAttr("poster", null)).toBe("");
      expect(renderAttr("poster", "")).toBe("");
      expect(renderAttr("poster", undefined)).toBe("");
    });

    it("returns formatted attribute", () => {
      expect(renderAttr("poster", "image.jpg")).toBe(' poster="image.jpg"');
    });
  });

  describe("renderFigcaption", () => {
    it("returns empty string when caption is falsy", () => {
      expect(renderFigcaption(null)).toBe("");
      expect(renderFigcaption("")).toBe("");
      expect(renderFigcaption(undefined)).toBe("");
    });

    it("returns figcaption element", () => {
      const result = renderFigcaption("A photo");

      expect(result).toContain("<figcaption");
      expect(result).toContain("A photo");
      expect(result).toContain("</figcaption>");
    });
  });
});

describe("shortcodes.js — projectVideo shortcode", () => {
  it("registers projectVideo shortcode", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);

    expect(config.addShortcode).toHaveBeenCalledWith(
      "projectVideo",
      expect.any(Function)
    );
  });

  it("renders video with data-src when no webm provided", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const projectVideo = config.getShortcode("projectVideo");

    const result = projectVideo("video.mp4", "Alt text");

    expect(result).toContain('data-src="video.mp4"');
    expect(result).toContain('aria-label="Alt text"');
    expect(result).toContain("project-video-el");
    expect(result).toContain("project-video-play");
  });

  it("renders source elements when webm is provided", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const projectVideo = config.getShortcode("projectVideo");

    const result = projectVideo("video.mp4", "Alt", {
      webm: "video.webm",
    });

    expect(result).toContain('data-src="video.webm"');
    expect(result).toContain('data-src="video.mp4"');
    expect(result).not.toContain('class="project-video-el" data-src=');
    expect(result).toContain("<source");
  });

  it("renders poster attribute when provided", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const projectVideo = config.getShortcode("projectVideo");

    const result = projectVideo("video.mp4", "Alt", {
      poster: "poster.jpg",
    });

    expect(result).toContain('poster="poster.jpg"');
  });

  it("renders figcaption when caption is provided", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const projectVideo = config.getShortcode("projectVideo");

    const result = projectVideo("video.mp4", "Alt", {
      caption: "A nice video",
    });

    expect(result).toContain("<figcaption");
    expect(result).toContain("A nice video");
  });

  it("does not render figcaption when no caption", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const projectVideo = config.getShortcode("projectVideo");

    const result = projectVideo("video.mp4", "Alt");

    expect(result).not.toContain("<figcaption");
  });

  it("uses empty alt when not provided", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const projectVideo = config.getShortcode("projectVideo");

    const result = projectVideo("video.mp4");

    expect(result).toContain('aria-label=""');
  });

  it("adds extra class to the wrapper when provided", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const projectVideo = config.getShortcode("projectVideo");

    const result = projectVideo("video.mp4", "Alt", { class: "site-recording" });

    expect(result).toContain('class="project-video-wrapper site-recording"');
  });

  it("omits extra wrapper class when not provided", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const projectVideo = config.getShortcode("projectVideo");

    const result = projectVideo("video.mp4", "Alt");

    expect(result).toContain('class="project-video-wrapper"');
  });
});

describe("shortcodes.js — figureImg shortcode", () => {
  it("renders img wrapped in a figure", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const figureImg = config.getShortcode("figureImg");

    const result = figureImg("/assets/photo.jpg", "Alt text");

    expect(result).toContain("<figure>");
    expect(result).toContain('src="/assets/photo.jpg"');
    expect(result).toContain('alt="Alt text"');
    expect(result).toContain("</figure>");
  });

  it("renders figcaption when caption is provided", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const figureImg = config.getShortcode("figureImg");

    const result = figureImg("/assets/photo.jpg", "Alt text", {
      caption: "A caption",
    });

    expect(result).toContain("<figcaption");
    expect(result).toContain("A caption");
  });

  it("does not render figcaption when no caption", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const figureImg = config.getShortcode("figureImg");

    const result = figureImg("/assets/photo.jpg", "Alt text");

    expect(result).not.toContain("<figcaption");
  });

  it("wraps the img in an external link when href is provided", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const figureImg = config.getShortcode("figureImg");

    const result = figureImg("/assets/photo.jpg", "Alt text", {
      href: "https://example.com",
    });

    expect(result).toContain('<a href="https://example.com" target="_blank" rel="noopener noreferrer">');
    expect(result).toContain('<img src="/assets/photo.jpg" alt="Alt text"></a>');
  });

  it("does not render a link when no href", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const figureImg = config.getShortcode("figureImg");

    const result = figureImg("/assets/photo.jpg", "Alt text");

    expect(result).not.toContain("<a href");
  });

  it("uses empty alt when not provided", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const figureImg = config.getShortcode("figureImg");

    const result = figureImg("/assets/photo.jpg");

    expect(result).toContain('alt=""');
  });

  it("does not add a class attribute when not provided", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const figureImg = config.getShortcode("figureImg");

    const result = figureImg("/assets/photo.jpg", "Alt text");

    expect(result).toContain("<figure>");
  });
});

describe("shortcodes.js — icon shortcode", () => {
  function getIcon() {
    const config = createMockEleventyConfig();
    shortcodes(config);
    return config.getShortcode("icon");
  }

  it("inlines the named SVG from src/assets/icons", () => {
    const result = getIcon()("moon");

    expect(result).toContain("<svg");
    expect(result).toContain("</svg>");
  });

  it("marks the SVG decorative for assistive tech", () => {
    const result = getIcon()("moon");

    expect(result).toContain('aria-hidden="true"');
    expect(result).toContain('focusable="false"');
  });

  it("merges extra attributes into the opening tag", () => {
    const result = getIcon()("moon", 'class="icon-lg"');

    expect(result).toContain('class="icon-lg"');
    // extras land on the <svg>, not somewhere in the path data
    expect(result.indexOf('class="icon-lg"')).toBeLessThan(result.indexOf(">"));
  });

  it("throws for an icon that does not exist", () => {
    expect(() => getIcon()("no-such-icon")).toThrow();
  });
});
