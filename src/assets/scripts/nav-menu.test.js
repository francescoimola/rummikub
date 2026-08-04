import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const MENU = `
  <nav aria-label="Primary">
    <details class="nav-menu">
      <summary class="nav-menu__bar">Menu</summary>
      <div class="nav-menu__panel">
        <ul><li><a href="#about">About</a></li></ul>
      </div>
    </details>
  </nav>
  <main><a href="/elsewhere/">Elsewhere</a></main>
`;

// The module is a side-effectful IIFE, so the DOM must exist before the import
async function mount(html = MENU) {
  document.body.innerHTML = html;
  await import("./nav-menu.js");
  return document.querySelector(".nav-menu");
}

function pressEscape() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
}

describe("nav-menu.js", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("closes the menu when Escape is pressed", async () => {
    const menu = await mount();
    menu.open = true;

    pressEscape();

    expect(menu.open).toBe(false);
  });

  it("returns focus to the menu bar when Escape closes the menu", async () => {
    const menu = await mount();
    const summary = menu.querySelector(".nav-menu__bar");
    const focusSpy = vi.spyOn(summary, "focus");
    menu.open = true;
    menu.querySelector(".nav-menu__panel a").focus();

    pressEscape();

    expect(focusSpy).toHaveBeenCalled();
  });

  it("does not move focus when Escape is pressed while already closed", async () => {
    const menu = await mount();
    const summary = menu.querySelector(".nav-menu__bar");
    const focusSpy = vi.spyOn(summary, "focus");
    menu.open = false;

    pressEscape();

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("closes on a pointerdown outside the menu without stealing focus", async () => {
    const menu = await mount();
    const summary = menu.querySelector(".nav-menu__bar");
    const focusSpy = vi.spyOn(summary, "focus");
    menu.open = true;

    document.querySelector("main").dispatchEvent(new Event("pointerdown", { bubbles: true }));

    expect(menu.open).toBe(false);
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("stays open on a pointerdown inside the menu", async () => {
    const menu = await mount();
    menu.open = true;

    menu.querySelector(".nav-menu__panel").dispatchEvent(new Event("pointerdown", { bubbles: true }));

    expect(menu.open).toBe(true);
  });

  it("closes when a link in the panel is clicked", async () => {
    const menu = await mount();
    menu.open = true;

    menu.querySelector(".nav-menu__panel a").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(menu.open).toBe(false);
  });
});
