import { describe, it, expect, vi } from "vitest";
import filters from "./filters.js";

function createMockEleventyConfig() {
  const registered = {};
  return {
    addFilter: vi.fn((name, fn) => {
      registered[name] = fn;
    }),
    getFilter: (name) => registered[name],
    _registered: registered,
  };
}

describe("filters.js", () => {
  it("registers all expected filters", () => {
    const config = createMockEleventyConfig();
    filters(config);

    expect(config.addFilter).toHaveBeenCalledWith(
      "readableDate",
      expect.any(Function)
    );
    expect(config.addFilter).toHaveBeenCalledWith(
      "split",
      expect.any(Function)
    );
    expect(config.addFilter).toHaveBeenCalledWith(
      "limit",
      expect.any(Function)
    );
    expect(config.addFilter).toHaveBeenCalledWith(
      "filterByCategory",
      expect.any(Function)
    );
    expect(config.addFilter).toHaveBeenCalledWith(
      "slugify",
      expect.any(Function)
    );
    expect(config.addFilter).toHaveBeenCalledWith(
      "urlencode",
      expect.any(Function)
    );
  });

  describe("readableDate", () => {
    it("formats a date string to readable format", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const readableDate = config.getFilter("readableDate");

      const result = readableDate("2024-01-15");

      expect(result).toMatch(/Jan 15, 2024/);
    });

    it("handles Date objects", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const readableDate = config.getFilter("readableDate");

      const result = readableDate(new Date("2024-12-25"));

      expect(result).toMatch(/Dec 25, 2024/);
    });
  });

  describe("split", () => {
    it("splits a string by separator", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const split = config.getFilter("split");

      expect(split("a,b,c", ",")).toEqual(["a", "b", "c"]);
    });

    it("splits by space", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const split = config.getFilter("split");

      expect(split("hello world", " ")).toEqual(["hello", "world"]);
    });
  });

  describe("limit", () => {
    it("limits array to specified length", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const limit = config.getFilter("limit");

      expect(limit([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
    });

    it("returns full array if limit exceeds length", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const limit = config.getFilter("limit");

      expect(limit([1, 2], 5)).toEqual([1, 2]);
    });

    it("returns empty array for limit 0", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const limit = config.getFilter("limit");

      expect(limit([1, 2, 3], 0)).toEqual([]);
    });
  });

  describe("filterByCategory", () => {
    it("filters posts by category", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const filterByCategory = config.getFilter("filterByCategory");

      const posts = [
        { data: { categories: ["Design", "Dev"] } },
        { data: { categories: ["Writing"] } },
        { data: { categories: ["design"] } },
      ];

      const result = filterByCategory(posts, "Design");

      expect(result).toHaveLength(2);
    });

    it("returns all posts when no category specified", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const filterByCategory = config.getFilter("filterByCategory");

      const posts = [
        { data: { categories: ["Design"] } },
        { data: { categories: ["Writing"] } },
      ];

      expect(filterByCategory(posts, null)).toEqual(posts);
    });

    it("excludes posts without categories", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const filterByCategory = config.getFilter("filterByCategory");

      const posts = [
        { data: { categories: ["Design"] } },
        { data: {} },
      ];

      const result = filterByCategory(posts, "Design");

      expect(result).toHaveLength(1);
    });
  });

  describe("slugify", () => {
    it("converts string to lowercase slug", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const slugify = config.getFilter("slugify");

      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("removes special characters", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const slugify = config.getFilter("slugify");

      expect(slugify("Hello! @World#")).toBe("hello-world");
    });

    it("trims leading and trailing hyphens", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const slugify = config.getFilter("slugify");

      expect(slugify("--hello--")).toBe("hello");
    });
  });

  describe("urlencode", () => {
    it("encodes a string", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const urlencode = config.getFilter("urlencode");

      expect(urlencode("hello world")).toBe("hello%20world");
    });

    it("returns empty string for falsy input", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const urlencode = config.getFilter("urlencode");

      expect(urlencode("")).toBe("");
      expect(urlencode(null)).toBe("");
      expect(urlencode(undefined)).toBe("");
    });

    it("encodes special characters", () => {
      const config = createMockEleventyConfig();
      filters(config);
      const urlencode = config.getFilter("urlencode");

      expect(urlencode("a&b=c")).toBe("a%26b%3Dc");
    });
  });
});
