import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const ONE_CONTROL = `
  <a href="mailto:test@example.com">test@example.com</a>
  <button type="button" data-copy-email="test@example.com">Copy email</button>
  <p role="status" data-copy-status></p>
`;
const TWO_CONTROLS = `
  <div>
    <a href="mailto:test@example.com">test@example.com</a>
    <button type="button" data-copy-email="test@example.com">Copy email</button>
    <p role="status" data-copy-status></p>
  </div>
  <div>
    <a href="mailto:other@example.com">other@example.com</a>
    <button type="button" data-copy-email="other@example.com">Copy email</button>
    <p role="status" data-copy-status></p>
  </div>
`;

// The module is a side-effectful IIFE, so the DOM must exist before the import
async function mount(html = ONE_CONTROL) {
  document.body.innerHTML = html;
  await import("./mailto-copy.js");
  return document.querySelectorAll("[data-copy-email]");
}

describe("mailto-copy.js", () => {
  let writeTextSpy;

  beforeEach(() => {
    vi.resetModules();
    writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextSpy },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("does not prevent the mailto link's default navigation", async () => {
    document.body.innerHTML = ONE_CONTROL;
    const mailtoLink = document.querySelector('a[href^="mailto:"]');
    const event = new Event("click", { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    await import("./mailto-copy.js");

    mailtoLink.dispatchEvent(event);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it("copies email address to clipboard", async () => {
    const [btn] = await mount();

    btn.click();

    expect(writeTextSpy).toHaveBeenCalledWith("test@example.com");
  });

  it("announces success in the status region without changing the button label", async () => {
    const [btn] = await mount();
    const status = document.querySelector("[data-copy-status]");

    btn.click();
    await vi.waitFor(() => {
      expect(status.textContent).toBe("Email address copied to clipboard");
    });
    expect(btn.textContent).toBe("Copy email");
  });

  it("announces a failure message when the clipboard write rejects", async () => {
    writeTextSpy.mockRejectedValue(new Error("denied"));
    const [btn] = await mount();
    const status = document.querySelector("[data-copy-status]");

    btn.click();

    await vi.waitFor(() => {
      expect(status.textContent).toBe("Copy failed — the address is test@example.com");
    });
  });

  it("handles multiple controls independently", async () => {
    const [btn1] = await mount(TWO_CONTROLS);
    const [status1, status2] = document.querySelectorAll("[data-copy-status]");

    btn1.click();
    await vi.waitFor(() => {
      expect(status1.textContent).toBe("Email address copied to clipboard");
    });
    expect(status2.textContent).toBe("");
    expect(writeTextSpy).toHaveBeenCalledWith("test@example.com");
  });
});
