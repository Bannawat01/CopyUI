import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { prompts } from "@/lib/prompts";
import { SITE_URL } from "@/lib/site";

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
