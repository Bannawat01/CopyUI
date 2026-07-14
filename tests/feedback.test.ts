import { afterEach, describe, expect, it, vi } from "vitest";
import {
  FEEDBACK_LINKS,
  REPO_URL,
  getFeedbackHref,
} from "@/lib/feedback";

describe("feedback links", () => {
  it("has exactly the three requested actions", () => {
    const ids = FEEDBACK_LINKS.map((l) => l.id).sort();
    expect(ids).toEqual(["giveFeedback", "reportOutput", "requestPrompt"]);
  });

  it("every link points at a real, non-empty GitHub issue URL", () => {
    for (const link of FEEDBACK_LINKS) {
      expect(link.href).toContain(`${REPO_URL}/issues/new?`);
      expect(link.href.length).toBeGreaterThan(REPO_URL.length + 10);
    }
  });

  it("no link is a fake placeholder form URL", () => {
    for (const link of FEEDBACK_LINKS) {
      expect(link.href).not.toMatch(/google\.com\/forms|tally\.so|typeform/i);
    }
  });
});

describe("getFeedbackHref()", () => {
  it("falls back to the GitHub issue link when no external URL is configured", () => {
    // NEXT_PUBLIC_FEEDBACK_URL is unset in the test environment.
    const href = getFeedbackHref("giveFeedback");
    expect(href).toContain(`${REPO_URL}/issues/new?`);
  });

  it("requestPrompt and reportOutput always keep their GitHub template", () => {
    expect(getFeedbackHref("requestPrompt")).toContain("Prompt+request");
    expect(getFeedbackHref("reportOutput")).toContain("Confusing+output");
  });
});

/**
 * The external-form config shape: an env var read once at module load, with
 * a safe GitHub fallback and no hardcoded fake URL. Verified via a fresh
 * module import so the env var is picked up.
 */
describe("EXTERNAL_FEEDBACK_URL config shape", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("is null by default — no fake Google Form/Tally URL hardcoded", async () => {
    vi.resetModules();
    const mod = await import("@/lib/feedback");
    expect(mod.EXTERNAL_FEEDBACK_URL).toBeNull();
  });

  it("prefers a configured external URL for giveFeedback only", async () => {
    vi.stubEnv("NEXT_PUBLIC_FEEDBACK_URL", "https://example.com/real-form");
    vi.resetModules();
    const mod = await import("@/lib/feedback");

    expect(mod.EXTERNAL_FEEDBACK_URL).toBe("https://example.com/real-form");
    expect(mod.getFeedbackHref("giveFeedback")).toBe(
      "https://example.com/real-form",
    );
    // Structured templates still win for these two even with a form configured.
    expect(mod.getFeedbackHref("requestPrompt")).toContain(
      `${mod.REPO_URL}/issues/new?`,
    );
    expect(mod.getFeedbackHref("reportOutput")).toContain(
      `${mod.REPO_URL}/issues/new?`,
    );
  });
});
