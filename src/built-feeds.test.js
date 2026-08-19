import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

// Asserts the shipped XML, not the filter — the filter can be right while the template wires it wrong.
const feed = (name) => readFileSync(`public/${name}`, "utf8");
const decode = (str) => str.replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const categories = (xml) =>
  [...xml.matchAll(/<category>([^<]+)<\/category>/g)].map((m) => decode(m[1]));
const links = (xml) => [...xml.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1]).slice(1);

describe("built feeds", () => {
  it("/rss.xml carries every type, guides included", () => {
    expect(new Set(categories(feed("rss.xml")))).toContain("Francesco's guides");
  });

  it("/essays-notes.xml drops the guides", () => {
    const cats = new Set(categories(feed("essays-notes.xml")));

    expect(cats).not.toContain("Francesco's guides");
    expect(cats).toEqual(new Set(["Francesco's essays", "Francesco's notes"]));
  });

  it("/essays-notes.xml is a strict subset of /rss.xml, never empty", () => {
    const scoped = links(feed("essays-notes.xml"));
    const all = new Set(links(feed("rss.xml")));

    expect(scoped.length).toBeGreaterThan(0);
    expect(scoped.every((url) => all.has(url))).toBe(true);
  });

  // `hidden: true` keeps a live page out of the listings and out of both feeds
  it("keeps hidden posts out of both feeds", () => {
    for (const name of ["rss.xml", "essays-notes.xml"]) {
      expect(feed(name)).not.toContain("/writing/on-inner-desires/");
    }
  });
});
