import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/prompts/[slug]/build/route";
import { getPromptBySlug } from "@/lib/prompts";

const SLUG = "saas-dashboard";

function post(slug: string, body: unknown) {
  const request = new NextRequest(
    `http://localhost/api/prompts/${slug}/build`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  return POST(request, { params: Promise.resolve({ slug }) });
}

async function postJson(slug: string, body: unknown) {
  const res = await post(slug, body);
  return { res, json: await res.json() };
}

describe("POST /api/prompts/[slug]/build", () => {
  it("returns generated prompt text for a valid slug", async () => {
    const { res, json } = await postJson(SLUG, {});
    expect(res.status).toBe(200);
    expect(json.text).toBeTypeOf("string");
    expect(json.text.length).toBeGreaterThan(100);
    expect(json.text).toContain("Product context:");
  });

  it("injects the requested primaryColor and leaves no placeholder", async () => {
    const { json } = await postJson(SLUG, { primaryColor: "#ff0000" });
    expect(json.text).toContain("#ff0000");
    expect(json.text).not.toContain("{{primaryColor}}");
  });

  it("falls back to the theme default for an invalid primaryColor", async () => {
    const fallback = getPromptBySlug(SLUG)!.defaultPrimaryColor;
    const { json } = await postJson(SLUG, { primaryColor: "not-a-color" });
    expect(json.text).toContain(fallback);
    expect(json.text).not.toContain("{{primaryColor}}");
  });

  it("frames output differently per tool mode", async () => {
    const [v0, cursor, genvibe] = await Promise.all(
      (["v0", "cursor", "genvibe"] as const).map(async (toolMode) => {
        const { json } = await postJson(SLUG, { toolMode });
        return json;
      }),
    );

    expect(v0.toolMode).toBe("v0");
    expect(cursor.toolMode).toBe("cursor");
    expect(genvibe.toolMode).toBe("genvibe");

    for (const r of [v0, cursor, genvibe]) {
      expect(r.text).toContain("Target tool:");
    }
    expect(v0.text).toContain("v0.dev");
    expect(cursor.text).toContain("Cursor");
    expect(genvibe.text).toContain("GenVibe");

    expect(new Set([v0.text, cursor.text, genvibe.text]).size).toBe(3);
  });

  it("omits tool framing for a missing or invalid tool mode", async () => {
    const { json: none } = await postJson(SLUG, {});
    const { json: bogus } = await postJson(SLUG, { toolMode: "bogus" });
    for (const r of [none, bogus]) {
      expect(r.toolMode).toBeNull();
      expect(r.text).not.toContain("Target tool:");
    }
    expect(none.text).toBe(bogus.text);
  });

  it("returns 404 with an error body for an unknown slug", async () => {
    const { res, json } = await postJson("does-not-exist", {});
    expect(res.status).toBe(404);
    expect(json).toEqual({ error: "Prompt not found" });
    expect(json).not.toHaveProperty("text");
  });

  it("tolerates a malformed JSON body by using defaults", async () => {
    const request = new NextRequest(
      `http://localhost/api/prompts/${SLUG}/build`,
      { method: "POST", body: "{ not json" },
    );
    const res = await POST(request, { params: Promise.resolve({ slug: SLUG }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.text).toContain(getPromptBySlug(SLUG)!.defaultPrimaryColor);
  });

  it("never exposes promptTemplate as response metadata", async () => {
    const { json } = await postJson(SLUG, { toolMode: "v0" });
    // The built `text` is the product; no raw template field may ride along.
    expect(Object.keys(json).sort()).toEqual(["text", "toolMode"]);
    expect(json).not.toHaveProperty("promptTemplate");
    expect(json.text).not.toContain("{{");
  });
});
