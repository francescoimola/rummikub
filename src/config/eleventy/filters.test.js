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
      "writingThumbColors",
      expect.any(Function)
    );
  });

  describe("writingThumbColors", () => {
    function getFilter() {
      const config = createMockEleventyConfig();
      filters(config);
      return config.getFilter("writingThumbColors");
    }

    function hueOf(color) {
      const match = color.match(
        /^oklch\((\d+\.?\d*) (\d+\.?\d*) (\d+\.?\d*) \/ (\d+\.?\d*)\)$/
      );
      expect(match).not.toBeNull();
      return Number(match[3]);
    }

    it("returns one translucent oklch() per item, from the brand hue pool", () => {
      const [color] = getFilter()([{ fileSlug: "example-not-bad" }]);
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
      const item = { fileSlug: "example-odd-wonderful" };
      expect(filter([item])).toEqual(filter([item]));
    });

    it("falls back through url then title when fileSlug is absent", () => {
      const [byUrl, byTitle, empty] = getFilter()([
        { url: "/writing/x/" },
        { data: { title: "Untitled" } },
        {},
      ]);
      expect(byUrl).toMatch(/^oklch\(/);
      expect(byTitle).toMatch(/^oklch\(/);
      expect(empty).toMatch(/^oklch\(/);
    });

    it("returns null for items with a cover image, spending no rotation slot", () => {
      const colors = getFilter()([
        { fileSlug: "a" },
        { fileSlug: "b", data: { image: "/assets/writing/b.png" } },
        { fileSlug: "c" },
      ]);
      expect(colors[1]).toBeNull();
    });

    it("never repeats the hue of the immediately preceding swatch", () => {
      const items = Array.from({ length: 12 }, (_, i) => ({
        fileSlug: `writing-item-${i}`,
      }));
      const hues = getFilter()(items).map(hueOf);

      for (let i = 1; i < hues.length; i++) {
        expect(hues[i]).not.toBe(hues[i - 1]);
      }
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

    it("keeps every type in a list", () => {
      const result = getFilter("byType")(items, ["essays", "guides"]);

      expect(result).toEqual(items);
    });

    it("returns every item when no type is given", () => {
      expect(getFilter("byType")(items, undefined)).toBe(items);
      expect(getFilter("byType")(items, "")).toBe(items);
      expect(getFilter("byType")(items, [])).toBe(items);
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
