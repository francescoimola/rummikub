import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fitStretchText } from "./stretch-text.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const PLACEHOLDER = "0 0 100 20";

// Build one .stretch > svg > text, with getBBox stubbed — jsdom has no layout, so the real
// method does not exist at all.
function mountStretch({ box = { x: 0, y: 0, width: 200, height: 40 }, hasText = true } = {}) {
  const holder = document.createElement("div");
  holder.className = "stretch";

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", PLACEHOLDER);

  if (hasText) {
    const text = document.createElementNS(SVG_NS, "text");
    text.getBBox = typeof box === "function" ? box : vi.fn(() => box);
    svg.appendChild(text);
  }

  holder.appendChild(svg);
  document.body.appendChild(holder);
  return svg;
}

let originalFonts;

function stubFonts(value) {
  Object.defineProperty(document, "fonts", { value, configurable: true });
}

beforeEach(() => {
  originalFonts = Object.getOwnPropertyDescriptor(document, "fonts");
  stubFonts({ status: "loaded", ready: Promise.resolve() });
});

afterEach(() => {
  if (originalFonts) Object.defineProperty(document, "fonts", originalFonts);
  else delete document.fonts;
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("fitStretchText", () => {
  it("does nothing when no .stretch svg is on the page", () => {
    const ready = vi.fn();
    stubFonts({ status: "unloaded", ready: { then: ready } });

    fitStretchText();

    // Bailed before it ever consulted the font loader
    expect(ready).not.toHaveBeenCalled();
  });

  it("fits the viewBox to the measured text box", () => {
    const svg = mountStretch({ box: { x: 2, y: 4, width: 200, height: 40 } });

    fitStretchText();

    expect(svg.getAttribute("viewBox")).toBe("2 4 200 40");
  });

  it("waits for the webfont before measuring", async () => {
    let resolveReady;
    const ready = new Promise((resolve) => {
      resolveReady = resolve;
    });
    stubFonts({ status: "loading", ready });
    const svg = mountStretch();

    fitStretchText();
    expect(svg.getAttribute("viewBox")).toBe(PLACEHOLDER);

    resolveReady();
    await ready;

    expect(svg.getAttribute("viewBox")).toBe("0 0 200 40");
  });

  it("keeps the placeholder viewBox when the box has no width", () => {
    const svg = mountStretch({ box: { x: 0, y: 0, width: 0, height: 0 } });

    fitStretchText();

    expect(svg.getAttribute("viewBox")).toBe(PLACEHOLDER);
  });

  it("keeps the placeholder viewBox when getBBox throws", () => {
    const svg = mountStretch({
      box: () => {
        throw new Error("not rendered");
      },
    });

    expect(() => fitStretchText()).not.toThrow();
    expect(svg.getAttribute("viewBox")).toBe(PLACEHOLDER);
  });

  it("keeps the placeholder viewBox when the svg has no text node", () => {
    const svg = mountStretch({ hasText: false });

    fitStretchText();

    expect(svg.getAttribute("viewBox")).toBe(PLACEHOLDER);
  });

  it("measures every svg before writing any of them, so reads are not interleaved with writes", () => {
    const order = [];
    const first = mountStretch({
      box: () => {
        order.push("read");
        return { x: 0, y: 0, width: 10, height: 10 };
      },
    });
    const second = mountStretch({
      box: () => {
        order.push("read");
        return { x: 0, y: 0, width: 20, height: 20 };
      },
    });
    for (const svg of [first, second]) {
      const original = svg.setAttribute.bind(svg);
      svg.setAttribute = (name, value) => {
        if (name === "viewBox") order.push("write");
        original(name, value);
      };
    }

    fitStretchText();

    expect(order).toEqual(["read", "read", "write", "write"]);
  });

  it("measures without a font loader present", () => {
    stubFonts(undefined);
    const svg = mountStretch();

    fitStretchText();

    expect(svg.getAttribute("viewBox")).toBe("0 0 200 40");
  });
});
