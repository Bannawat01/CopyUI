import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import GalleryPage from "@/app/page";

/**
 * Renders the homepage Server Component to static markup — no jsdom or
 * browser needed. Guards the copy a first-time visitor must see, and
 * re-asserts the hidden-template guarantee at the HTML level.
 */
describe("homepage", () => {
  const html = renderToStaticMarkup(<GalleryPage />);

  it("renders the positioning headline", () => {
    expect(html).toContain(
      "Production-ready UI prompts for v0, Cursor, and GenVibe",
    );
  });

  it("renders the How it works steps", () => {
    expect(html).toContain("Pick a UI prompt");
    expect(html).toContain("Customize it");
    expect(html).toContain("Copy and paste");
  });

  it("renders prompt cards from the dataset", () => {
    expect(html).toContain("SaaS Analytics Dashboard");
    expect(html).toContain("AI Chat Interface");
  });

  it("never leaks hidden prompt template text into HTML", () => {
    expect(html).not.toContain("Product context:");
    expect(html).not.toContain("Target tool:");
    expect(html).not.toContain("{{primaryColor}}");
  });

  // Early users asked whether output is repeatable and whether Retheme is
  // safe on an existing codebase. Both answers must be on the page.
  it("renders the trust FAQ answering consistency and retheme safety", () => {
    expect(html).toContain("What to expect from AI output");
    expect(html).toContain(
      "If I run the same prompt 10 times, do I get the same page?",
    );
    expect(html).toContain("Will Retheme Mode delete my existing code?");
    expect(html).toContain("not deterministic");
    expect(html).toContain("review the diff");
  });

  it("does not overpromise determinism or safety in the FAQ", () => {
    const lower = html.toLowerCase();
    for (const overpromise of [
      "always identical",
      "guaranteed",
      "never delete",
      "100% deterministic",
    ]) {
      expect(lower).not.toContain(overpromise);
    }
  });
});
