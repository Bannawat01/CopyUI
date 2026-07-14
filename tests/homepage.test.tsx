import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import GalleryPage from "@/app/page";
import { LocaleProvider } from "@/components/locale-provider";
import { TOOL_MODE_LABELS, toolModeShortList } from "@/lib/tool-modes";
import { SITE_URL } from "@/lib/site";
import { t } from "@/lib/i18n";

/**
 * Renders the homepage Server Component to static markup — no jsdom or
 * browser needed. Guards the copy a first-time visitor must see, and
 * re-asserts the hidden-template guarantee at the HTML level.
 */
describe("homepage", () => {
  // Localized UI lives in client components, so the page needs its provider.
  // Static render = default locale (English), which is what SSR/SEO sees.
  const html = renderToStaticMarkup(
    <LocaleProvider>
      <GalleryPage />
    </LocaleProvider>,
  );

  it("renders the positioning headline", () => {
    expect(html).toContain("Production-ready UI prompts for");
    expect(html).toContain(toolModeShortList(2));
  });

  it("renders default-locale (English) UI labels", () => {
    expect(html).toContain(t("en", "gallery.heading"));
    expect(html).toContain(t("en", "home.step1.title"));
    // The trust FAQ now leads with its own subhead, not the language note
    // (which belongs to the language selector, not this section).
    // Substring avoids the apostrophe, which renderToStaticMarkup escapes.
    expect(html).toContain("Straight answers about consistency and safety");
  });

  // The site advertised 3 tools long after it supported 6. Copy is now
  // derived from TOOL_MODES; this fails if anyone hardcodes a list again.
  it("names every supported tool mode somewhere on the page", () => {
    for (const label of TOOL_MODE_LABELS) {
      expect(html).toContain(label);
    }
  });

  it("does not advertise the old 3-tool-only list", () => {
    expect(html).not.toContain(
      "Production-ready UI prompts for v0, Cursor, and GenVibe",
    );
    expect(html).not.toContain("v0.dev, Cursor, or GenVibe");
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

  it("renders the generated-examples showcase", () => {
    expect(html).toContain(t("en", "examples.homeHeading"));
    expect(html).toContain("Ops dashboard with KPI row and activity table");
    expect(html).toContain("Conversational AI workspace");
    // Schematic structure, not a fake screenshot.
    expect(html).toContain("Sidebar (240px) + sticky top bar");
    // ...and it says so explicitly, so nobody mistakes it for real output.
    expect(html).toContain(t("en", "examples.schematic"));
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

  it("renders the growth section with all three feedback actions", () => {
    expect(html).toContain(t("en", "growth.heading"));
    expect(html).toContain(t("en", "feedback.giveFeedback.label"));
    expect(html).toContain(t("en", "feedback.requestPrompt.label"));
    expect(html).toContain(t("en", "feedback.reportOutput.label"));
  });

  it("renders share text naming real tool modes, not a hardcoded list", () => {
    expect(html).toContain(t("en", "growth.shareHeading"));
    for (const label of TOOL_MODE_LABELS) {
      // Already asserted once for the headline; here specifically inside
      // the share block's sentence structure.
      expect(html).toContain(label);
    }
    expect(html).toContain("prompt marketplace for generating and retheming UI");
  });

  // A share message with no link doesn't drive anyone anywhere — the
  // deployed site URL must ride along in the copyable text.
  it("includes the site URL in the share text, so it's actually useful when pasted", () => {
    expect(html).toContain(SITE_URL);
  });

  it("does not overpromise in the growth section either", () => {
    const lower = html.toLowerCase();
    for (const overpromise of [
      "guaranteed",
      "always identical",
      "same result every time",
      "never delete",
      "100% deterministic",
      "pixel-perfect",
    ]) {
      expect(lower).not.toContain(overpromise);
    }
  });
});
