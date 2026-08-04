import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const ONE_CONTROL = `
  <a href="mailto:test@example.com">test@example.com</a>
  <button type="button" data-copy-email="test@example.com">Copy email address</button>
  <p role="status" data-copy-status></p>
`;
const TWO_CONTROLS = `
  <div>
    <a href="mailto:test@example.com">test@example.com</a>
    <button type="button" data-copy-email="test@example.com">Copy email address</button>
    <p role="status" data-copy-status></p>
  </div>
  <div>
    <a href="mailto:other@example.com">other@example.com</a>
    <button type="button" data-copy-email="other@example.com">Copy email address</button>
    <p role="status" data-copy-status></p>
  </div>
`;

// The module is a side-effectful IIFE, so the DOM must exist before the import
async function mount(html = ONE_CONTROL) {
  document.body.innerHTML = html;
  await import("./mailto-copy.js");
  return document.querySelectorAll("[data-copy-email]");
}

// Fake timers don't fake microtasks, so the clipboard promise still needs draining by hand
async function flushClipboard() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("mailto-copy.js", () => {
  let writeTextSpy;

  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextSpy },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
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

  it("swaps the button label to a confirmation and announces it", async () => {
    const [btn] = await mount();
    const status = document.querySelector("[data-copy-status]");

    btn.click();
    await flushClipboard();

    expect(btn.textContent).toBe("Email copied!");
    expect(status.textContent).toBe("Email copied!");
  });

  it("restores the original label after 2s", async () => {
    const [btn] = await mount();
    const status = document.querySelector("[data-copy-status]");

    btn.click();
    await flushClipboard();
    vi.advanceTimersByTime(2000);

    expect(btn.textContent).toBe("Copy email address");
    expect(status.textContent).toBe("");
  });

  it("keeps the confirmation visible until the delay elapses", async () => {
    const [btn] = await mount();

    btn.click();
    await flushClipboard();
    vi.advanceTimersByTime(1999);

    expect(btn.textContent).toBe("Email copied!");
  });

  it("restarts the timer on a repeat click so the label still reverts", async () => {
    const [btn] = await mount();

    btn.click();
    await flushClipboard();
    vi.advanceTimersByTime(1500);
    btn.click();
    await flushClipboard();
    vi.advanceTimersByTime(1500);

    expect(btn.textContent).toBe("Email copied!");

    vi.advanceTimersByTime(500);

    expect(btn.textContent).toBe("Copy email address");
  });

  it("announces a failure message when the clipboard write rejects", async () => {
    writeTextSpy.mockRejectedValue(new Error("denied"));
    const [btn] = await mount();
    const status = document.querySelector("[data-copy-status]");

    btn.click();
    await flushClipboard();

    expect(btn.textContent).toBe("Copy failed");
    expect(status.textContent).toBe("Copy failed — the address is test@example.com");
  });

  it("handles multiple controls independently", async () => {
    const [btn1, btn2] = await mount(TWO_CONTROLS);
    const [status1, status2] = document.querySelectorAll("[data-copy-status]");

    btn1.click();
    await flushClipboard();

    expect(status1.textContent).toBe("Email copied!");
    expect(status2.textContent).toBe("");
    expect(btn2.textContent).toBe("Copy email address");
    expect(writeTextSpy).toHaveBeenCalledWith("test@example.com");
  });
});
