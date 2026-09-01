import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";

// Enough of the footer and the toggles for the DOM-reading tools to have something to read.
const PAGE = `
  <header class="sidebar">
    <button data-theme-choice="light" aria-pressed="true">Light</button>
    <button data-theme-choice="dark" aria-pressed="false">Dark</button>
    <button data-brand-choice="green" aria-pressed="true">Green</button>
    <button data-brand-choice="pink" aria-pressed="false">Pink</button>
    <footer>
      <button data-copy-email="hi@francescoimola.com">Copy email address</button>
      <a href="https://cal.com/francescoimola/intro">Book intro call</a>
    </footer>
  </header>
`;

// The module registers on import, so the DOM and the stub must exist first.
async function load() {
  document.body.innerHTML = PAGE;
  return import("./webmcp.js");
}

function stubModelContext() {
  const registerTool = vi.fn();
  Object.defineProperty(navigator, "modelContext", {
    value: { registerTool },
    configurable: true,
    writable: true,
  });
  return registerTool;
}

const byName = (tools, name) => tools.find((tool) => tool.name === name);
const textOf = (result) => result.content[0].text;

beforeEach(() => {
  vi.resetModules();
  delete navigator.modelContext;
});

afterEach(() => {
  delete navigator.modelContext;
  vi.unstubAllGlobals();
});

describe("webmcp registration", () => {
  it("registers every tool when the browser supports the API", async () => {
    const registerTool = stubModelContext();
    const { TOOLS } = await load();
    expect(registerTool).toHaveBeenCalledTimes(TOOLS.length);
    const registered = registerTool.mock.calls.map(([tool]) => tool.name);
    expect(registered).toEqual(TOOLS.map((tool) => tool.name));
  });

  // No browser ships navigator.modelContext, so this is the path every real visitor takes today.
  it("no-ops without throwing when the API is absent", async () => {
    const { hasModelContext, TOOLS } = await load();
    expect(hasModelContext()).toBe(false);
    expect(TOOLS.length).toBeGreaterThan(0);
  });

  it("gives every tool a name, a description and a schema", async () => {
    const { TOOLS } = await load();
    for (const tool of TOOLS) {
      expect(tool.name, JSON.stringify(tool)).toMatch(/^[a-z][a-z_]+$/);
      expect(tool.description.length, tool.name).toBeGreaterThan(30);
      expect(tool.inputSchema.type, tool.name).toBe("object");
      expect(typeof tool.execute, tool.name).toBe("function");
    }
  });
});

describe("webmcp tools", () => {
  it("get_page_markdown fetches the twin beside the current page", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, text: async () => "# Twin" }));
    vi.stubGlobal("fetch", fetchMock);
    const { TOOLS } = await load();

    expect(textOf(await byName(TOOLS, "get_page_markdown").execute({}))).toBe("# Twin");
    expect(fetchMock.mock.calls[0][0]).toBe("/index.md");
  });

  it("get_page_markdown surfaces a failed fetch rather than returning an empty page", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 404 })));
    const { TOOLS } = await load();
    await expect(byName(TOOLS, "get_page_markdown").execute({})).rejects.toThrow("404");
  });

  it("list_site_pages fetches llms.txt", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, text: async () => "# Site" }));
    vi.stubGlobal("fetch", fetchMock);
    const { TOOLS } = await load();

    expect(textOf(await byName(TOOLS, "list_site_pages").execute({}))).toBe("# Site");
    expect(fetchMock.mock.calls[0][0]).toBe("/llms.txt");
  });

  // Reading the footer rather than hardcoding is what stops the tool drifting from the page.
  it("get_contact_details reads the address and booking link off the page", async () => {
    const { TOOLS } = await load();
    const details = JSON.parse(textOf(await byName(TOOLS, "get_contact_details").execute({})));
    expect(details.email).toBe("hi@francescoimola.com");
    expect(details.bookingUrl).toBe("https://cal.com/francescoimola/intro");
  });

  // Clicking the real button hands persistence and aria-pressed sync back to look-toggles.js.
  it("set_appearance clicks the matching toggle", async () => {
    const { TOOLS } = await load();
    const dark = document.querySelector('[data-theme-choice="dark"]');
    const clicked = vi.fn();
    dark.addEventListener("click", clicked);

    const applied = JSON.parse(textOf(await byName(TOOLS, "set_appearance").execute({ theme: "dark" })));
    expect(clicked).toHaveBeenCalledOnce();
    expect(applied).toEqual({ theme: "dark", brand: null });
  });

  it("set_appearance applies theme and brand together", async () => {
    const { TOOLS } = await load();
    const applied = JSON.parse(
      textOf(await byName(TOOLS, "set_appearance").execute({ theme: "light", brand: "pink" })),
    );
    expect(applied).toEqual({ theme: "light", brand: "pink" });
  });

  it("set_appearance rejects an option the page has no control for", async () => {
    const { TOOLS } = await load();
    await expect(byName(TOOLS, "set_appearance").execute({ brand: "purple" })).rejects.toThrow(
      "Unknown option: purple",
    );
  });

  it("set_appearance tolerates being called with nothing", async () => {
    const { TOOLS } = await load();
    const applied = JSON.parse(textOf(await byName(TOOLS, "set_appearance").execute()));
    expect(applied).toEqual({ theme: null, brand: null });
  });
});

// The catalog is what crawlers read without executing JS; if it drifts it describes tools that
// no longer exist. Same shape as the data-icon/glyph cross-check in built-css.test.js.
describe("webmcp catalog", () => {
  const catalog = () => JSON.parse(readFileSync("src/well-known/webmcp.json", "utf8"));

  it("declares the community spec version", () => {
    expect(catalog().spec).toBe("webmcp/0.1");
  });

  it("lists exactly the tools the script registers, with the same descriptions", async () => {
    const { TOOLS } = await load();
    const declared = catalog().tools;
    expect(declared.map((tool) => tool.name)).toEqual(TOOLS.map((tool) => tool.name));
    for (const tool of declared) {
      expect(tool.description, `${tool.name} description drifted`).toBe(
        byName(TOOLS, tool.name).description,
      );
    }
  });
});
