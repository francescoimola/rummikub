import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Two sidebar instances, because the toggles render twice and must stay in sync
const TOGGLES = `
  <div class="sidebar">
    <button data-brand-choice="green">Green</button>
    <button data-brand-choice="pink">Pink</button>
    <button data-theme-choice="light">Light</button>
    <button data-theme-choice="dark">Dark</button>
  </div>
  <div class="sidebar sidebar--footer">
    <button data-brand-choice="green">Green</button>
    <button data-brand-choice="pink">Pink</button>
    <button data-theme-choice="light">Light</button>
    <button data-theme-choice="dark">Dark</button>
  </div>
`;

const root = document.documentElement;

// This jsdom build ships Storage but installs no localStorage global, so the module's own
// try/catch silently swallows every write. Inject a fake to make persistence assertable.
function createStorage({ failOn } = {}) {
  const data = new Map();
  return {
    getItem: vi.fn((key) => (data.has(key) ? data.get(key) : null)),
    setItem: vi.fn((key, value) => {
      if (failOn === "setItem") throw new Error("QuotaExceededError");
      data.set(key, String(value));
    }),
    removeItem: vi.fn((key) => {
      if (failOn === "removeItem") throw new Error("SecurityError");
      data.delete(key);
    }),
  };
}

let storage;

// The module is a side-effectful IIFE, so the DOM must exist before the import
async function mount({ brand, theme, prefersDark = false, failOn } = {}) {
  storage = createStorage({ failOn });
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
    writable: true,
  });

  if (brand) root.setAttribute("data-brand", brand);
  if (theme) root.setAttribute("data-theme", theme);
  window.matchMedia = vi.fn(() => ({
    matches: prefersDark,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  document.body.innerHTML = TOGGLES;
  await import("./look-toggles.js");
}

const buttons = (attr, value) =>
  Array.from(document.querySelectorAll(`[${attr}="${value}"]`));

const pressedStates = (attr, value) =>
  buttons(attr, value).map((btn) => btn.getAttribute("aria-pressed"));

function click(attr, value) {
  buttons(attr, value)[0].click();
}

let originalMatchMedia;

beforeEach(() => {
  originalMatchMedia = window.matchMedia;
  vi.resetModules();
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  delete globalThis.localStorage;
  root.removeAttribute("data-brand");
  root.removeAttribute("data-theme");
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("look-toggles.js — brand palette", () => {
  it("treats an absent data-brand as green when reconciling on load", async () => {
    await mount();

    expect(pressedStates("data-brand-choice", "green")).toEqual(["true", "true"]);
    expect(pressedStates("data-brand-choice", "pink")).toEqual(["false", "false"]);
  });

  it("reconciles against a brand already applied before first paint", async () => {
    await mount({ brand: "pink" });

    expect(pressedStates("data-brand-choice", "pink")).toEqual(["true", "true"]);
    expect(pressedStates("data-brand-choice", "green")).toEqual(["false", "false"]);
  });

  it("applies a chosen brand to <html> and persists it", async () => {
    await mount();

    click("data-brand-choice", "pink");

    expect(root.getAttribute("data-brand")).toBe("pink");
    expect(storage.getItem("brand")).toBe("pink");
  });

  it("clears data-brand rather than setting it when green is chosen", async () => {
    await mount({ brand: "pink" });

    click("data-brand-choice", "green");

    expect(root.hasAttribute("data-brand")).toBe(false);
    expect(storage.removeItem).toHaveBeenCalledWith("brand");
    expect(storage.getItem("brand")).toBe(null);
  });

  it("syncs aria-pressed across both instances from a click on one", async () => {
    await mount();

    click("data-brand-choice", "pink");

    expect(pressedStates("data-brand-choice", "pink")).toEqual(["true", "true"]);
    expect(pressedStates("data-brand-choice", "green")).toEqual(["false", "false"]);
  });
});

describe("look-toggles.js — light/dark", () => {
  it("falls back to the OS scheme when no theme is set", async () => {
    await mount({ prefersDark: true });

    expect(pressedStates("data-theme-choice", "dark")).toEqual(["true", "true"]);
    expect(pressedStates("data-theme-choice", "light")).toEqual(["false", "false"]);
  });

  it("prefers an explicit data-theme over the OS scheme", async () => {
    await mount({ theme: "light", prefersDark: true });

    expect(pressedStates("data-theme-choice", "light")).toEqual(["true", "true"]);
    expect(pressedStates("data-theme-choice", "dark")).toEqual(["false", "false"]);
  });

  it("applies a chosen theme to <html> and persists it", async () => {
    await mount();

    click("data-theme-choice", "dark");

    expect(root.getAttribute("data-theme")).toBe("dark");
    expect(storage.getItem("theme")).toBe("dark");
    expect(pressedStates("data-theme-choice", "dark")).toEqual(["true", "true"]);
  });
});

describe("look-toggles.js — storage failures", () => {
  it("still applies the choice when localStorage refuses to write", async () => {
    await mount({ failOn: "setItem" });

    expect(() => click("data-brand-choice", "pink")).not.toThrow();
    expect(root.getAttribute("data-brand")).toBe("pink");
    expect(pressedStates("data-brand-choice", "pink")).toEqual(["true", "true"]);
  });

  it("still clears the brand when localStorage refuses to remove", async () => {
    await mount({ brand: "pink", failOn: "removeItem" });

    expect(() => click("data-brand-choice", "green")).not.toThrow();
    expect(root.hasAttribute("data-brand")).toBe(false);
  });
});
