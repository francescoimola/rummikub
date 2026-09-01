// WebMCP tool registration (https://github.com/webmachinelearning/webmcp). Progressive enhancement
// only: no browser ships navigator.modelContext yet, so this is inert everywhere until one does.
// Tools read from the page and the built .md twins rather than duplicating content into JS.
// Tool names here must match src/well-known/webmcp.json — webmcp.test.js asserts they do.

// Each link of a `a && a.b` chain is a branch fallow counts; naming it keeps the caller flat.
function hasModelContext() {
  return typeof navigator !== "undefined" && !!navigator.modelContext && typeof navigator.modelContext.registerTool === "function";
}

async function fetchText(url) {
  var response = await fetch(url, { headers: { Accept: "text/markdown, text/plain" } });
  if (!response.ok) throw new Error("Could not fetch " + url + " (" + response.status + ")");
  return response.text();
}

// The twin sits beside the page it mirrors, so the current path plus index.md always resolves.
function twinUrl() {
  var path = window.location.pathname;
  return (path.slice(-1) === "/" ? path : path + "/") + "index.md";
}

function readText(selector) {
  var el = document.querySelector(selector);
  return el ? el.textContent.trim() : "";
}

// Read contact details off the rendered footer so they can never drift from what the page shows.
function contactDetails() {
  var emailButton = document.querySelector("[data-copy-email]");
  var callLink = document.querySelector('a[href*="cal.com"]');
  return {
    name: readText("title") || document.title,
    email: emailButton ? emailButton.getAttribute("data-copy-email") : "",
    bookingUrl: callLink ? callLink.href : "",
  };
}

// Click the real toggle rather than setting the attribute: look-toggles.js owns persistence and
// aria-pressed sync, and duplicating that here would leave the two out of step.
function applyChoice(attr, value) {
  if (!value) return null;
  var button = document.querySelector("[" + attr + '="' + value + '"]');
  if (!button) throw new Error("Unknown option: " + value);
  button.click();
  return value;
}

const TOOLS = [
  {
    name: "get_page_markdown",
    description:
      "Get the full text of the page currently being viewed on francescoimola.com, as Markdown. Use this to read an article, case study or page without parsing HTML.",
    inputSchema: { type: "object", properties: {} },
    execute: async function () {
      return { content: [{ type: "text", text: await fetchText(twinUrl()) }] };
    },
  },
  {
    name: "list_site_pages",
    description:
      "List every page on francescoimola.com — portfolio case studies, writing, and standalone pages — with a short description and a Markdown URL for each.",
    inputSchema: { type: "object", properties: {} },
    execute: async function () {
      return { content: [{ type: "text", text: await fetchText("/llms.txt") }] };
    },
  },
  {
    name: "get_contact_details",
    description:
      "Get Francesco Imola's contact details: email address and the link for booking an introductory call.",
    inputSchema: { type: "object", properties: {} },
    execute: async function () {
      return { content: [{ type: "text", text: JSON.stringify(contactDetails(), null, 2) }] };
    },
  },
  {
    name: "set_appearance",
    description:
      "Change how this page looks: switch between light and dark mode, and pick the accent colour palette. The choice is remembered across visits.",
    inputSchema: {
      type: "object",
      properties: {
        theme: { type: "string", enum: ["light", "dark"], description: "Light or dark mode." },
        brand: { type: "string", enum: ["green", "pink", "orange"], description: "Accent colour palette." },
      },
    },
    execute: async function (args) {
      var input = args || {};
      var applied = {
        theme: applyChoice("data-theme-choice", input.theme),
        brand: applyChoice("data-brand-choice", input.brand),
      };
      return { content: [{ type: "text", text: JSON.stringify(applied) }] };
    },
  },
];

if (hasModelContext()) {
  TOOLS.forEach(function (tool) {
    navigator.modelContext.registerTool(tool);
  });
}

// Exported for webmcp.test.js only — the page itself imports this module for its side effect.
export { TOOLS, hasModelContext };
