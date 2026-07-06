import { describe, it, expect, vi } from "vitest";
import transforms from "./transforms.js";

function createMockEleventyConfig() {
  const registered = {};
  return {
    addTransform: vi.fn((name, fn) => {
      registered[name] = fn;
    }),
    getTransform: (name) => registered[name],
  };
}

describe("transforms.js", () => {
  it("registers both transforms", () => {
    const config = createMockEleventyConfig();
    transforms(config);

    expect(config.addTransform).toHaveBeenCalledWith(
      "ignoreRemoteImages",
      expect.any(Function)
    );
    expect(config.addTransform).toHaveBeenCalledWith(
      "lazyImages",
      expect.any(Function)
    );
  });

  describe("ignoreRemoteImages", () => {
    it("adds eleventy:ignore to remote images", () => {
      const config = createMockEleventyConfig();
      transforms(config);
      const ignoreRemoteImages = config.getTransform("ignoreRemoteImages");

      const input = '<img src="https://example.com/photo.jpg">';
      const result = ignoreRemoteImages(input, "index.html");

      expect(result).toContain('src="https://example.com/photo.jpg"');
      expect(result).toContain("eleventy:ignore");
    });

    it("does not modify local images", () => {
      const config = createMockEleventyConfig();
      transforms(config);
      const ignoreRemoteImages = config.getTransform("ignoreRemoteImages");

      const input = '<img src="/assets/local.jpg">';
      const result = ignoreRemoteImages(input, "index.html");

      expect(result).not.toContain("eleventy:ignore");
    });

    it("does not add duplicate eleventy:ignore", () => {
      const config = createMockEleventyConfig();
      transforms(config);
      const ignoreRemoteImages = config.getTransform("ignoreRemoteImages");

      const input =
        '<img src="https://example.com/photo.jpg" eleventy:ignore>';
      const result = ignoreRemoteImages(input, "index.html");

      const matches = result.match(/eleventy:ignore/g);
      expect(matches).toHaveLength(1);
    });

    it("handles http:// URLs", () => {
      const config = createMockEleventyConfig();
      transforms(config);
      const ignoreRemoteImages = config.getTransform("ignoreRemoteImages");

      const input = '<img src="http://example.com/photo.jpg">';
      const result = ignoreRemoteImages(input, "index.html");

      expect(result).toContain("eleventy:ignore");
    });

    it("only processes HTML files", () => {
      const config = createMockEleventyConfig();
      transforms(config);
      const ignoreRemoteImages = config.getTransform("ignoreRemoteImages");

      const input = '<img src="https://example.com/photo.jpg">';
      const result = ignoreRemoteImages(input, "output.css");

      expect(result).not.toContain("eleventy:ignore");
    });

    it("handles null outputPath", () => {
      const config = createMockEleventyConfig();
      transforms(config);
      const ignoreRemoteImages = config.getTransform("ignoreRemoteImages");

      const input = '<img src="https://example.com/photo.jpg">';
      const result = ignoreRemoteImages(input, null);

      expect(result).not.toContain("eleventy:ignore");
    });
  });

  describe("lazyImages", () => {
    it("adds loading=lazy to images without it", () => {
      const config = createMockEleventyConfig();
      transforms(config);
      const lazyImages = config.getTransform("lazyImages");

      const input = '<img src="/photo.jpg">';
      const result = lazyImages(input, "index.html");

      expect(result).toContain('loading="lazy"');
    });

    it("adds decoding=async to images without it", () => {
      const config = createMockEleventyConfig();
      transforms(config);
      const lazyImages = config.getTransform("lazyImages");

      const input = '<img src="/photo.jpg">';
      const result = lazyImages(input, "index.html");

      expect(result).toContain('decoding="async"');
    });

    it("does not duplicate loading attribute", () => {
      const config = createMockEleventyConfig();
      transforms(config);
      const lazyImages = config.getTransform("lazyImages");

      const input = '<img loading="eager" src="/photo.jpg">';
      const result = lazyImages(input, "index.html");

      const loadingMatches = result.match(/loading=/g);
      expect(loadingMatches).toHaveLength(1);
    });

    it("does not duplicate decoding attribute", () => {
      const config = createMockEleventyConfig();
      transforms(config);
      const lazyImages = config.getTransform("lazyImages");

      const input = '<img decoding="sync" src="/photo.jpg">';
      const result = lazyImages(input, "index.html");

      const decodingMatches = result.match(/decoding=/g);
      expect(decodingMatches).toHaveLength(1);
    });

    it("only processes HTML files", () => {
      const config = createMockEleventyConfig();
      transforms(config);
      const lazyImages = config.getTransform("lazyImages");

      const input = '<img src="/photo.jpg">';
      const result = lazyImages(input, "output.js");

      expect(result).not.toContain("loading");
    });
  });
});
