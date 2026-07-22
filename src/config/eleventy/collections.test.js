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

function createMockCollectionApi(posts, tag = "blog") {
  return {
    getFilteredByTag: vi.fn((requested) => {
      if (requested === tag) return posts;
      return [];
    }),
  };
}

function workPost(title, endDate, featured) {
  return { data: { title, endDate, featured } };
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

describe("collections.js — work collections", () => {
  function getWorkCollection(name, posts) {
    const config = createMockEleventyConfig();
    collections(config);
    const api = createMockCollectionApi(posts, "work");
    return config.getCollection(name)(api);
  }

  it("registers the work, workFeatured, and workIndex collections", () => {
    const config = createMockEleventyConfig();
    collections(config);

    expect(config.addCollection).toHaveBeenCalledWith("work", expect.any(Function));
    expect(config.addCollection).toHaveBeenCalledWith("workFeatured", expect.any(Function));
    expect(config.addCollection).toHaveBeenCalledWith("workIndex", expect.any(Function));
  });

  it("sorts work by end date, most recent first", () => {
    const result = getWorkCollection("work", [
      workPost("Old", "2023-01"),
      workPost("New", "2025-06"),
      workPost("Mid", "2024-03"),
    ]);

    expect(result.map((p) => p.data.title)).toEqual(["New", "Mid", "Old"]);
  });

  it("sorts work with missing end dates last", () => {
    const result = getWorkCollection("work", [
      workPost("Dated", "2024-01"),
      workPost("Undated", undefined),
    ]);

    expect(result.map((p) => p.data.title)).toEqual(["Dated", "Undated"]);
  });

  it("workFeatured returns only featured projects, sorted", () => {
    const result = getWorkCollection("workFeatured", [
      workPost("A", "2023-01", true),
      workPost("B", "2025-06", false),
      workPost("C", "2024-03", true),
    ]);

    expect(result.map((p) => p.data.title)).toEqual(["C", "A"]);
  });

  it("workFeatured allows exactly the maximum featured projects", () => {
    const result = getWorkCollection("workFeatured", [
      workPost("A", "2025-01", true),
      workPost("B", "2024-01", true),
      workPost("C", "2023-01", true),
    ]);

    expect(result).toHaveLength(3);
  });

  it("workFeatured throws when too many projects are featured", () => {
    expect(() =>
      getWorkCollection("workFeatured", [
        workPost("A", "2025-01", true),
        workPost("B", "2024-01", true),
        workPost("C", "2023-01", true),
        workPost("D", "2022-01", true),
      ])
    ).toThrow(/Too many featured work projects \(4\/3\)/);
  });

  it("workIndex returns only non-featured projects, sorted", () => {
    const result = getWorkCollection("workIndex", [
      workPost("A", "2023-01", true),
      workPost("B", "2025-06", false),
      workPost("C", "2024-03", false),
    ]);

    expect(result.map((p) => p.data.title)).toEqual(["B", "C"]);
  });
});
