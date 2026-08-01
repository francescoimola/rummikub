import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const ONE_LINK = '<a href="mailto:test@example.com">Contact</a>';
const TWO_LINKS = `
  <a href="mailto:test@example.com">Contact</a>
  <a href="mailto:other@example.com">Other</a>
`;

// The module is a side-effectful IIFE, so the DOM must exist before the import
async function mount(html = ONE_LINK) {
  document.body.innerHTML = html;
  await import("./mailto-copy.js");
  return document.querySelectorAll('a[href^="mailto:"]');
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
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("prevents default on click", async () => {
    const [link] = await mount();
    const event = new Event("click", { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    link.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("copies email address to clipboard", async () => {
    const [link] = await mount();

    link.click();

    expect(writeTextSpy).toHaveBeenCalledWith("test@example.com");
  });

  it("shows 'Email copied!' text after clicking", async () => {
    const [link] = await mount();

    link.click();
    await vi.waitFor(() => {
      expect(link.textContent).toBe("Email copied!");
    });
  });

  it("restores original text after 2 seconds", async () => {
    const [link] = await mount();

    link.click();
    await vi.waitFor(() => {
      expect(link.textContent).toBe("Email copied!");
    });

    vi.advanceTimersByTime(2000);

    expect(link.textContent).toBe("Contact");
  });

  it("handles multiple links independently", async () => {
    const [link1, link2] = await mount(TWO_LINKS);

    link1.click();
    await vi.waitFor(() => {
      expect(link1.textContent).toBe("Email copied!");
    });
    expect(link2.textContent).toBe("Other");

    vi.advanceTimersByTime(2000);
    expect(link1.textContent).toBe("Contact");
  });
});
