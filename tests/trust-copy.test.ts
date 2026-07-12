import { describe, expect, it } from "vitest";
import {
  RETHEME_SAFETY_POINTS,
  RETHEME_SAFETY_TITLE,
  TRUST_FAQ,
} from "@/lib/trust-copy";

const ALL_COPY = [
  ...TRUST_FAQ.flatMap((f) => [f.question, f.answer]),
  RETHEME_SAFETY_TITLE,
  ...RETHEME_SAFETY_POINTS,
]
  .join(" ")
  .toLowerCase();

describe("trust copy — consistency answer", () => {
  it("says output is not deterministic and pixels vary", () => {
    const answer = TRUST_FAQ[0].answer.toLowerCase();
    expect(answer).toContain("not deterministic");
    expect(answer).toContain("pixels will vary");
  });

  it("names the direction the prompts DO hold steady", () => {
    const answer = TRUST_FAQ[0].answer.toLowerCase();
    for (const held of [
      "layout intent",
      "visual hierarchy",
      "component choices",
      "constraints",
      "style guidance",
    ]) {
      expect(answer).toContain(held);
    }
  });

  it("tells users how to get more consistency", () => {
    const answer = TRUST_FAQ[1].answer.toLowerCase();
    expect(answer).toContain("keep your options stable");
    expect(answer).toContain("same target tool");
  });
});

describe("trust copy — retheme safety", () => {
  const points = RETHEME_SAFETY_POINTS.join(" ").toLowerCase();

  it("says what retheme is designed to preserve", () => {
    for (const preserved of [
      "routes",
      "logic",
      "state",
      "api calls",
      "event handlers",
      "behavior",
    ]) {
      expect(points).toContain(preserved);
    }
    expect(points).toContain("designed to preserve");
  });

  it("tells users to commit or branch and review the diff", () => {
    expect(points).toContain("commit or branch");
    expect(points).toContain("review the diff");
  });

  it("admits AI tools can still make mistakes", () => {
    expect(points).toContain("ai tools can still make mistakes");
  });

  it("steers risky projects to Instructions Only", () => {
    expect(points).toContain("instructions only");
    expect(points).toContain("apply directly");
  });
});

describe("trust copy never overpromises", () => {
  // The whole point of this copy is honesty — a reassuring lie here would
  // cost more trust than it buys.
  it("makes no guarantee of determinism or safety", () => {
    for (const overpromise of [
      "always identical",
      "guaranteed",
      "guarantee",
      "never delete",
      "will not delete",
      "100% deterministic",
      "completely safe",
      "perfectly consistent",
      "pixel-identical",
    ]) {
      expect(ALL_COPY).not.toContain(overpromise);
    }
  });

  it("uses honest hedging language instead", () => {
    expect(ALL_COPY).toContain("designed to");
    expect(ALL_COPY).toContain("usually");
    expect(ALL_COPY).toContain("can still make mistakes");
  });

  it("carries no hidden prompt-template markers", () => {
    expect(ALL_COPY).not.toContain("product context:");
    expect(ALL_COPY).not.toContain("{{primarycolor}}");
  });
});
