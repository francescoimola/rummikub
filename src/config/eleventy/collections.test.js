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

function writingItem(title, date, type) {
  return { date: new Date(date), data: { title, type } };
}

describe("collections.js — writing collections", () => {
  function getWritingCollection(name, posts) {
    const config = createMockEleventyConfig();
    collections(config);
    const api = createMockCollectionApi(posts, "writing");
    return config.getCollection(name)(api);
  }

  it("registers the writing and writingTypes collections", () => {
    const config = createMockEleventyConfig();
    collections(config);

    expect(config.addCollection).toHaveBeenCalledWith("writing", expect.any(Function));
    expect(config.addCollection).toHaveBeenCalledWith("writingTypes", expect.any(Function));
  });

  it("sorts writing by date, most recent first", () => {
    const result = getWritingCollection("writing", [
      writingItem("Old", "2025-01-01", "guides"),
      writingItem("New", "2026-06-01", "notes"),
      writingItem("Mid", "2025-09-01", "essays"),
    ]);

    expect(result.map((p) => p.data.title)).toEqual(["New", "Mid", "Old"]);
  });

  it("writingTypes lists only present types in fixed order", () => {
    const result = getWritingCollection("writingTypes", [
      writingItem("A", "2026-01-01", "notes"),
      writingItem("B", "2026-02-01", "guides"),
    ]);

    expect(result).toEqual(["guides", "notes"]);
  });

  it("writingTypes deduplicates and omits empty types", () => {
    const result = getWritingCollection("writingTypes", [
      writingItem("A", "2026-01-01", "guides"),
      writingItem("B", "2026-02-01", "guides"),
    ]);

    expect(result).toEqual(["guides"]);
  });

  it("writingTypes returns empty array when nothing is typed", () => {
    const result = getWritingCollection("writingTypes", [
      { date: new Date("2026-01-01"), data: {} },
    ]);

    expect(result).toEqual([]);
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
