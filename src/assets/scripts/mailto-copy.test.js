import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

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
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("prevents default on click", async () => {
    document.body.innerHTML = '<a href="mailto:test@example.com">Contact</a>';
    await import("./mailto-copy.js");
    const link = document.querySelector('a[href="mailto:test@example.com"]');
    const event = new Event("click", { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    link.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("copies email address to clipboard", async () => {
    document.body.innerHTML = '<a href="mailto:test@example.com">Contact</a>';
    await import("./mailto-copy.js");
    const link = document.querySelector('a[href="mailto:test@example.com"]');

    link.click();

    expect(writeTextSpy).toHaveBeenCalledWith("test@example.com");
  });

  it("shows 'Email copied!' text after clicking", async () => {
    document.body.innerHTML = '<a href="mailto:test@example.com">Contact</a>';
    await import("./mailto-copy.js");
    const link = document.querySelector('a[href="mailto:test@example.com"]');

    link.click();
    await vi.waitFor(() => {
      expect(link.textContent).toBe("Email copied!");
    });
  });

  it("restores original text after 2 seconds", async () => {
    document.body.innerHTML = '<a href="mailto:test@example.com">Contact</a>';
    await import("./mailto-copy.js");
    const link = document.querySelector('a[href="mailto:test@example.com"]');

    link.click();
    await vi.waitFor(() => {
      expect(link.textContent).toBe("Email copied!");
    });

    vi.advanceTimersByTime(2000);

    expect(link.textContent).toBe("Contact");
  });

  it("handles multiple links independently", async () => {
    document.body.innerHTML = `
      <a href="mailto:test@example.com">Contact</a>
      <a href="mailto:other@example.com">Other</a>
    `;
    await import("./mailto-copy.js");
    const link1 = document.querySelector('a[href="mailto:test@example.com"]');
    const link2 = document.querySelector('a[href="mailto:other@example.com"]');

    link1.click();
    await vi.waitFor(() => {
      expect(link1.textContent).toBe("Email copied!");
    });
    expect(link2.textContent).toBe("Other");

    vi.advanceTimersByTime(2000);
    expect(link1.textContent).toBe("Contact");
  });
});
