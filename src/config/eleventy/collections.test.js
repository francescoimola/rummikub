import { describe, it, expect, vi } from "vitest";
import collections from "./collections.js";

function createMockEleventyConfig() {
  const registered = {};
  return {
    addCollection: vi.fn((name, fn) => {
      registered[name] = fn;
    }),
    getCollection: (name) => registered[name],
  };
}

function createMockCollectionApi(posts) {
  return {
    getFilteredByTag: vi.fn((tag) => {
      if (tag === "blog") return posts;
      return [];
    }),
  };
}

describe("collections.js", () => {
  it("registers the blogCategories collection", () => {
    const config = createMockEleventyConfig();
    collections(config);

    expect(config.addCollection).toHaveBeenCalledWith(
      "blogCategories",
      expect.any(Function)
    );
  });

  it("extracts unique categories from blog posts", () => {
    const config = createMockEleventyConfig();
    collections(config);
    const blogCategories = config.getCollection("blogCategories");

    const posts = [
      { data: { categories: ["Design", "Dev"] } },
      { data: { categories: ["Writing", "Design"] } },
      { data: { categories: ["Dev"] } },
    ];
    const api = createMockCollectionApi(posts);

    const result = blogCategories(api);

    expect(result).toEqual(["Design", "Dev", "Writing"]);
  });

  it("returns sorted categories", () => {
    const config = createMockEleventyConfig();
    collections(config);
    const blogCategories = config.getCollection("blogCategories");

    const posts = [
      { data: { categories: ["Zebra", "Apple"] } },
      { data: { categories: ["Mango"] } },
    ];
    const api = createMockCollectionApi(posts);

    const result = blogCategories(api);

    expect(result).toEqual(["Apple", "Mango", "Zebra"]);
  });

  it("handles posts without categories", () => {
    const config = createMockEleventyConfig();
    collections(config);
    const blogCategories = config.getCollection("blogCategories");

    const posts = [
      { data: { categories: ["Design"] } },
      { data: {} },
      { data: { categories: null } },
    ];
    const api = createMockCollectionApi(posts);

    const result = blogCategories(api);

    expect(result).toEqual(["Design"]);
  });

  it("returns empty array when no posts have categories", () => {
    const config = createMockEleventyConfig();
    collections(config);
    const blogCategories = config.getCollection("blogCategories");

    const posts = [{ data: {} }, { data: {} }];
    const api = createMockCollectionApi(posts);

    const result = blogCategories(api);

    expect(result).toEqual([]);
  });

  it("deduplicates categories across posts", () => {
    const config = createMockEleventyConfig();
    collections(config);
    const blogCategories = config.getCollection("blogCategories");

    const posts = [
      { data: { categories: ["Design"] } },
      { data: { categories: ["Design"] } },
      { data: { categories: ["Design"] } },
    ];
    const api = createMockCollectionApi(posts);

    const result = blogCategories(api);

    expect(result).toEqual(["Design"]);
  });
});
