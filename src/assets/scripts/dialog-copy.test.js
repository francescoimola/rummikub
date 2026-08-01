import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const MARKUP = `
  <button type="button" data-dialog-open="email-template">Copy this template email</button>
  <dialog id="email-template">
    <div data-dialog-content>
      <p>Hi, I’m <strong>Carla</strong>.</p>
      <p>I'd love to hire you for <strong>project</strong>.</p>
    </div>
    <button type="button" data-dialog-copy>Copy to clipboard</button>
    <button type="button" data-dialog-close>Close</button>
  </dialog>
`;

const PLAIN = "Hi, I’m Carla.\n\nI'd love to hire you for project.";

async function setup(markup = MARKUP) {
  document.body.innerHTML = markup;
  await import("./dialog-copy.js");
  return {
    trigger: document.querySelector("[data-dialog-open]"),
    dialog: document.querySelector("dialog"),
    copyBtn: document.querySelector("[data-dialog-copy]"),
    closeBtn: document.querySelector("[data-dialog-close]"),
  };
}

describe("dialog-copy.js", () => {
  let writeSpy;
  let writeTextSpy;

  // Reads back what the module handed to ClipboardItem, keyed by MIME type
  function flavours() {
    const item = writeSpy.mock.calls[0][0][0];
    return Object.fromEntries(
      Object.entries(item).map(([type, blob]) => [type, blob.parts.join("")]),
    );
  }

  beforeEach(() => {
    vi.resetModules();

    // jsdom implements neither the dialog methods nor a readable Blob, so stub both
    HTMLDialogElement.prototype.showModal = vi.fn(function () {
      this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function () {
      this.open = false;
    });
    vi.stubGlobal(
      "Blob",
      class {
        constructor(parts) {
          this.parts = parts;
        }
      },
    );
    vi.stubGlobal(
      "ClipboardItem",
      class {
        constructor(items) {
          return items;
        }
      },
    );

    writeSpy = vi.fn().mockResolvedValue(undefined);
    writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { write: writeSpy, writeText: writeTextSpy },
      configurable: true,
      writable: true,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("keeps the dialog closed until the trigger is clicked", async () => {
    const { trigger, dialog } = await setup();
    expect(dialog.open).toBe(false);

    trigger.click();

    expect(dialog.open).toBe(true);
  });

  it("copies a rich-text flavour that keeps the bold and drops the buttons", async () => {
    const { copyBtn } = await setup();

    copyBtn.click();

    expect(flavours()["text/html"]).toContain("<strong>Carla</strong>");
    expect(flavours()["text/html"]).not.toContain("<button");
  });

  it("copies a plain flavour with paragraphs split by a blank line and no tags", async () => {
    const { copyBtn } = await setup();

    copyBtn.click();

    expect(Object.keys(flavours()).sort()).toEqual(["text/html", "text/plain"]);
    expect(flavours()["text/plain"]).toBe(PLAIN);
  });

  it("falls back to writeText when ClipboardItem is unsupported", async () => {
    vi.stubGlobal("ClipboardItem", undefined);
    const { copyBtn } = await setup();

    copyBtn.click();

    expect(writeSpy).not.toHaveBeenCalled();
    expect(writeTextSpy).toHaveBeenCalledWith(PLAIN);
  });

  it("leaves the dialog open after copying", async () => {
    const { trigger, dialog, copyBtn } = await setup();
    trigger.click();

    copyBtn.click();

    expect(dialog.open).toBe(true);
  });

  it("confirms on the copy button then restores its label", async () => {
    const { copyBtn } = await setup();

    copyBtn.click();

    expect(copyBtn.textContent).toBe("Copied!");
    vi.advanceTimersByTime(2000);
    expect(copyBtn.textContent).toBe("Copy to clipboard");
  });

  it("restores the label even when the write is rejected", async () => {
    writeSpy.mockRejectedValue(new Error("denied"));
    const { copyBtn } = await setup();

    copyBtn.click();
    copyBtn.click();

    expect(copyBtn.textContent).toBe("Copied!");
    vi.advanceTimersByTime(2000);
    expect(copyBtn.textContent).toBe("Copy to clipboard");
  });

  it("closes without copying when the close button is used", async () => {
    const { trigger, dialog, closeBtn } = await setup();
    trigger.click();

    closeBtn.click();

    expect(dialog.open).toBe(false);
    expect(writeSpy).not.toHaveBeenCalled();
  });

  it("ignores a trigger whose target dialog is missing", async () => {
    await setup(`<button data-dialog-open="nope">Open</button>`);

    expect(() => document.querySelector("[data-dialog-open]").click()).not.toThrow();
  });
});
