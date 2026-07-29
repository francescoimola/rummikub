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
      "longDate",
      expect.any(Function)
    );
    expect(config.addFilter).toHaveBeenCalledWith(
      "monthYear",
      expect.any(Function)
    );
    expect(config.addFilter).toHaveBeenCalledWith(
      "isoMonth",
      expect.any(Function)
    );
    expect(config.addFilter).toHaveBeenCalledWith(
      "byType",
      expect.any(Function)
    );
    expect(config.addFilter).toHaveBeenCalledWith(
      "limit",
      expect.any(Function)
    );
    expect(config.addFilter).toHaveBeenCalledWith(
      "writingThumbColor",
      expect.any(Function)
    );
  });

  describe("writingThumbColor", () => {
    function getFilter() {
      const config = createMockEleventyConfig();
      filters(config);
      return config.getFilter("writingThumbColor");
    }

    it("returns a translucent oklch() from the brand hue pool", () => {
      const color = getFilter()({ fileSlug: "example-not-bad" });
      const match = color.match(
        /^oklch\((\d+\.?\d*) (\d+\.?\d*) (\d+\.?\d*) \/ (\d+\.?\d*)\)$/
      );

      expect(match).not.toBeNull();
      const [, l, c, h, a] = match.map(Number);
      expect([119.4, 55, 305]).toContain(h);
      expect(l).toBeGreaterThanOrEqual(0.6);
      expect(l).toBeLessThanOrEqual(0.82);
      expect(c).toBeGreaterThanOrEqual(0.09);
      expect(c).toBeLessThanOrEqual(0.16);
      expect(a).toBeGreaterThan(0); // never opaque
      expect(a).toBeLessThan(1);
    });

    it("is deterministic per slug across calls", () => {
      const filter = getFilter();
      expect(filter({ fileSlug: "example-odd-wonderful" })).toBe(
        filter({ fileSlug: "example-odd-wonderful" })
      );
    });

    it("falls back through url then title when fileSlug is absent", () => {
      const filter = getFilter();
      expect(filter({ url: "/writing/x/" })).toMatch(/^oklch\(/);
      expect(filter({ data: { title: "Untitled" } })).toMatch(/^oklch\(/);
      expect(filter({})).toMatch(/^oklch\(/);
    });
  });

  function getFilter(name) {
    const config = createMockEleventyConfig();
    filters(config);
    return config.getFilter(name);
  }

  // Date cases use midday UTC so a local timezone offset can never roll the date over.
  describe("longDate", () => {
    it("formats a date string as en-GB day month year", () => {
      expect(getFilter("longDate")("2024-01-15T12:00:00Z")).toBe(
        "15 January 2024"
      );
    });

    it("handles Date objects", () => {
      expect(getFilter("longDate")(new Date("2024-12-25T12:00:00Z"))).toBe(
        "25 December 2024"
      );
    });
  });

  describe("monthYear", () => {
    it("formats to month and year only", () => {
      expect(getFilter("monthYear")("2024-06-09T12:00:00Z")).toBe("June 2024");
    });

    it("handles Date objects", () => {
      expect(getFilter("monthYear")(new Date("2023-11-02T12:00:00Z"))).toBe(
        "November 2023"
      );
    });
  });

  describe("isoMonth", () => {
    it("truncates an ISO date to YYYY-MM", () => {
      expect(getFilter("isoMonth")("2024-03-15T12:00:00Z")).toBe("2024-03");
    });

    it("zero-pads single-digit months", () => {
      expect(getFilter("isoMonth")(new Date("2024-09-01T12:00:00Z"))).toBe(
        "2024-09"
      );
    });
  });

  describe("byType", () => {
    const items = [
      { data: { type: "guides" } },
      { data: { type: "essays" } },
      { data: { type: "guides" } },
    ];

    it("keeps only items matching the requested type", () => {
      const result = getFilter("byType")(items, "guides");

      expect(result).toHaveLength(2);
      expect(result.every((i) => i.data.type === "guides")).toBe(true);
    });

    it("returns every item when no type is given", () => {
      expect(getFilter("byType")(items, undefined)).toBe(items);
      expect(getFilter("byType")(items, "")).toBe(items);
    });

    it("returns an empty array for an unknown type", () => {
      expect(getFilter("byType")(items, "notes")).toEqual([]);
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
});
