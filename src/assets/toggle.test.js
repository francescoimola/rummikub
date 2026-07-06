import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

function setupDOM(opts = {}) {
  const {
    btn1Expanded = "false",
    btn2Expanded = "true",
    target2Open = true,
  } = opts;

  document.body.innerHTML = `
    <button aria-controls="target1" aria-expanded="${btn1Expanded}">Read more</button>
    <div id="target1">Content 1</div>
    <button aria-controls="target2" aria-expanded="${btn2Expanded}">Read less</button>
    <div id="target2" ${target2Open ? 'class="is-open"' : ""}>Content 2</div>
  `;
}

describe("toggle.js", () => {
  let scrollIntoViewSpy;

  beforeEach(() => {
    vi.resetModules();
    scrollIntoViewSpy = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewSpy;
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
    delete Element.prototype.scrollIntoView;
  });

  it("toggles aria-expanded from false to true on click", async () => {
    setupDOM({ btn1Expanded: "false" });
    await import("./toggle.js");
    const btn = document.querySelector('[aria-controls="target1"]');

    btn.click();

    expect(btn.getAttribute("aria-expanded")).toBe("true");
  });

  it("toggles aria-expanded from true to false on click", async () => {
    setupDOM({ btn2Expanded: "true" });
    await import("./toggle.js");
    const btn = document.querySelector('[aria-controls="target2"]');

    btn.click();

    expect(btn.getAttribute("aria-expanded")).toBe("false");
  });

  it("adds is-open class to target when expanding", async () => {
    setupDOM({ btn1Expanded: "false", target2Open: false });
    await import("./toggle.js");
    const btn = document.querySelector('[aria-controls="target1"]');
    const target = document.getElementById("target1");

    btn.click();

    expect(target.classList.contains("is-open")).toBe(true);
  });

  it("removes is-open class from target when collapsing", async () => {
    setupDOM({ btn2Expanded: "true", target2Open: true });
    await import("./toggle.js");
    const btn = document.querySelector('[aria-controls="target2"]');
    const target = document.getElementById("target2");

    btn.click();

    expect(target.classList.contains("is-open")).toBe(false);
  });

  it("changes button text to 'Read less' when expanding", async () => {
    setupDOM({ btn1Expanded: "false" });
    await import("./toggle.js");
    const btn = document.querySelector('[aria-controls="target1"]');

    btn.click();

    expect(btn.textContent).toBe("Read less");
  });

  it("changes button text to 'Read more' when collapsing", async () => {
    setupDOM({ btn2Expanded: "true" });
    await import("./toggle.js");
    const btn = document.querySelector('[aria-controls="target2"]');

    btn.click();

    expect(btn.textContent).toBe("Read more");
  });

  it("scrolls target into view when expanding", async () => {
    setupDOM({ btn1Expanded: "false" });
    await import("./toggle.js");
    const btn = document.querySelector('[aria-controls="target1"]');

    btn.click();

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("scrolls button into view when collapsing", async () => {
    setupDOM({ btn2Expanded: "true" });
    await import("./toggle.js");
    const btn = document.querySelector('[aria-controls="target2"]');

    btn.click();

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "nearest",
    });
  });

  it("only attaches handlers to elements with aria-controls", async () => {
    document.body.innerHTML = `
      <button id="no-controls">No aria-controls</button>
    `;
    await import("./toggle.js");
    const noControlsBtn = document.getElementById("no-controls");

    noControlsBtn.click();

    // Should not throw or have side effects
    expect(noControlsBtn.getAttribute("aria-expanded")).toBeNull();
  });
});
