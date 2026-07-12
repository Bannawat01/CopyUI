import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { prompts } from "@/lib/prompts";
import { alt as ogAlt } from "@/app/opengraph-image";
import { alt as twitterAlt } from "@/app/twitter-image";
import { SITE_DESCRIPTION, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { TOOL_MODE_LABELS } from "@/lib/tool-modes";

describe("sitemap", () => {
  const entries = sitemap();

  it("includes the homepage", () => {
    expect(entries.map((e) => e.url)).toContain(SITE_URL);
  });

  it("includes all 18 prompt detail routes", () => {
    const urls = entries.map((e) => e.url);
    for (const p of prompts) {
      expect(urls).toContain(`${SITE_URL}/prompts/${p.slug}`);
    }
    expect(entries).toHaveLength(prompts.length + 1);
  });

  it("emits no duplicate or template-leaking URLs", () => {
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(JSON.stringify(entries)).not.toContain("Product context:");
  });
});

describe("SEO copy tracks TOOL_MODES", () => {
  it("the meta description names every supported tool", () => {
    for (const label of TOOL_MODE_LABELS) {
      expect(SITE_DESCRIPTION).toContain(label);
    }
  });

  it("the tagline leads with real tools and does not claim only three", () => {
    expect(SITE_TAGLINE).toContain(TOOL_MODE_LABELS[0]);
    expect(SITE_TAGLINE).toContain("and more");
    expect(SITE_TAGLINE).not.toContain("for v0, Cursor, and GenVibe");
  });

  it("no stale 3-tool list survives in site copy", () => {
    for (const copy of [SITE_TAGLINE, SITE_DESCRIPTION]) {
      expect(copy).not.toContain("v0.dev, Cursor, or GenVibe");
    }
  });

  // The social card had no test, which is exactly why it kept advertising 3
  // tools after the site supported 6. Its alt text is now derived.
  it("the social card alt text tracks TOOL_MODES", () => {
    expect(ogAlt).toBe(SITE_TAGLINE);
    expect(ogAlt).not.toContain("v0, Cursor, and GenVibe");
    expect(ogAlt).toContain(TOOL_MODE_LABELS[0]);
  });

  it("the Twitter card reuses the same derived art and alt", () => {
    expect(twitterAlt).toBe(ogAlt);
  });
});

describe("robots", () => {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

  it("disallows /api/", () => {
    expect(rules.disallow).toBe("/api/");
  });

  it("allows the rest of the site and links the sitemap", () => {
    expect(rules.allow).toBe("/");
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
