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
});
