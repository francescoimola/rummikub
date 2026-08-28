import { describe, it, expect, vi } from "vitest";
import shortcodes from "./shortcodes.js";
import {
  escapeAttr,
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
  describe("escapeAttr", () => {
    it("escapes the characters that can break out of a quoted attribute", () => {
      expect(escapeAttr('a "quoted" value')).toBe("a &quot;quoted&quot; value");
      expect(escapeAttr("Make & Mind")).toBe("Make &amp; Mind");
      expect(escapeAttr("<script>")).toBe("&lt;script&gt;");
    });

    it("escapes the ampersand first, so nothing is escaped twice", () => {
      expect(escapeAttr('&"')).toBe("&amp;&quot;");
    });

    it("coerces nullish input to an empty string", () => {
      expect(escapeAttr(null)).toBe("");
      expect(escapeAttr(undefined)).toBe("");
    });

    it("leaves an apostrophe alone — the attributes it feeds are double-quoted", () => {
      expect(escapeAttr("The Loft's logo")).toBe("The Loft's logo");
    });
  });

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

    it("escapes the value", () => {
      expect(renderAttr("alt", 'a "quote" & a bracket <')).toBe(
        ' alt="a &quot;quote&quot; &amp; a bracket &lt;"'
      );
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

  it("escapes an alt that would otherwise break out of aria-label", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const projectVideo = config.getShortcode("projectVideo");

    const result = projectVideo("video.mp4", 'He said "hi" & left');

    expect(result).toContain('aria-label="He said &quot;hi&quot; &amp; left"');
    expect(result).not.toContain('aria-label="He said "');
  });

  it("escapes the source, poster and wrapper class", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const projectVideo = config.getShortcode("projectVideo");

    const result = projectVideo('a".mp4', "Alt", {
      poster: 'p".jpg',
      class: 'c"x',
    });

    expect(result).toContain('data-src="a&quot;.mp4"');
    expect(result).toContain('poster="p&quot;.jpg"');
    expect(result).toContain('class="project-video-wrapper c&quot;x"');
  });

  it("escapes both webm and mp4 source urls", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const projectVideo = config.getShortcode("projectVideo");

    const result = projectVideo('a&b.mp4', "Alt", { webm: 'a&b.webm' });

    expect(result).toContain('data-src="a&amp;b.webm"');
    expect(result).toContain('data-src="a&amp;b.mp4"');
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

  it("adds imgClass to the img, not the figure", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const figureImg = config.getShortcode("figureImg");

    const result = figureImg("/assets/photo.jpg", "Alt text", {
      imgClass: "extra",
    });

    expect(result).toContain("<figure>");
    expect(result).toContain('<img src="/assets/photo.jpg" alt="Alt text" class="extra">');
  });

  it("escapes an alt that would otherwise break out of the img tag", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const figureImg = config.getShortcode("figureImg");

    const result = figureImg("/assets/photo.jpg", 'A "wide" shot & more');

    expect(result).toContain('alt="A &quot;wide&quot; shot &amp; more"');
    expect(result).not.toContain('alt="A "');
  });

  it("escapes src, href and both class attributes", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const figureImg = config.getShortcode("figureImg");

    const result = figureImg('/a".jpg', "Alt", {
      href: 'https://example.com/?a=1&b="2"',
      class: 'f"x',
      imgClass: 'i"x',
    });

    expect(result).toContain('src="/a&quot;.jpg"');
    expect(result).toContain('href="https://example.com/?a=1&amp;b=&quot;2&quot;"');
    expect(result).toContain('<figure class="f&quot;x">');
    expect(result).toContain('class="i&quot;x"');
  });

  // Captions are text content, not an attribute, so they are passed through verbatim —
  // escaping them would double-escape any entity an author wrote on purpose.
  it("leaves caption text unescaped", () => {
    const config = createMockEleventyConfig();
    shortcodes(config);
    const figureImg = config.getShortcode("figureImg");

    const result = figureImg("/assets/photo.jpg", "Alt", {
      caption: "Tom &amp; Jerry",
    });

    expect(result).toContain("<figcaption class=\"has-text-grey\">Tom &amp; Jerry</figcaption>");
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

  it("returns identical markup on repeated calls", () => {
    const icon = getIcon();

    expect(icon("moon")).toBe(icon("moon"));
  });

  it("reads each icon from disk only once", async () => {
    vi.resetModules();
    const fs = (await import("node:fs")).default;
    const spy = vi.spyOn(fs, "readFileSync");
    const freshShortcodes = (await import("./shortcodes.js")).default;

    const config = createMockEleventyConfig();
    freshShortcodes(config);
    const icon = config.getShortcode("icon");
    icon("moon");
    icon("moon");
    icon("sun");

    const reads = spy.mock.calls.map((call) => String(call[0]));

    expect(reads.filter((p) => p.endsWith("moon.svg"))).toHaveLength(1);
    expect(reads.filter((p) => p.endsWith("sun.svg"))).toHaveLength(1);
    spy.mockRestore();
  });

  it("does not cache a failed read", async () => {
    vi.resetModules();
    const freshShortcodes = (await import("./shortcodes.js")).default;

    const config = createMockEleventyConfig();
    freshShortcodes(config);
    const icon = config.getShortcode("icon");

    expect(() => icon("no-such-icon")).toThrow();
    expect(() => icon("no-such-icon")).toThrow();
  });
});
