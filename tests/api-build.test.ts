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
    expect(Object.keys(json).sort()).toEqual([
      "actionStyle",
      "promptIntent",
      "text",
      "themeMode",
      "toolMode",
    ]);
    expect(json).not.toHaveProperty("promptTemplate");
    expect(json.text).not.toContain("{{");
  });

  it("accepts secondary and accent colors and adds a palette section", async () => {
    const { json } = await postJson(SLUG, {
      primaryColor: "#111111",
      secondaryColor: "#222222",
      accentColor: "#333333",
    });
    expect(json.text).toContain("#111111");
    expect(json.text).toContain("Secondary color #222222");
    expect(json.text).toContain("Accent color #333333");
  });

  it("ignores invalid secondary/accent colors instead of failing", async () => {
    const { res, json } = await postJson(SLUG, {
      secondaryColor: "red",
      accentColor: 42,
    });
    expect(res.status).toBe(200);
    expect(json.text).not.toContain("Color palette:");
  });

  it("retheme intent prepends preservation rules and echoes the intent", async () => {
    const { json } = await postJson(SLUG, { promptIntent: "retheme" });
    expect(json.promptIntent).toBe("retheme");
    expect(json.text).toContain("RETHEME ONLY");
    expect(json.text).toContain("Preserve every existing route");
    expect(json.text).toContain("Product context:");
  });

  it("defaults to build intent with no retheme rules", async () => {
    const { json: omitted } = await postJson(SLUG, {});
    const { json: bogus } = await postJson(SLUG, { promptIntent: "remix" });
    for (const r of [omitted, bogus]) {
      expect(r.promptIntent).toBe("build");
      expect(r.text).not.toContain("RETHEME");
    }
  });

  it("applies theme mode and echoes it; invalid mode falls back to null", async () => {
    const { json: light } = await postJson(SLUG, { themeMode: "light" });
    expect(light.themeMode).toBe("light");
    expect(light.text).toContain("Theme mode: LIGHT");

    const { json: bad } = await postJson(SLUG, { themeMode: "sepia" });
    expect(bad.themeMode).toBeNull();
    expect(bad.text).not.toContain("Theme mode:");
  });

  it("stacks tool mode, retheme, palette, and theme mode in one request", async () => {
    const { json } = await postJson(SLUG, {
      toolMode: "cursor",
      promptIntent: "retheme",
      themeMode: "system",
      secondaryColor: "#222222",
    });
    const text: string = json.text;
    expect(text.indexOf("Target tool:")).toBe(0);
    expect(text.indexOf("RETHEME ONLY")).toBeGreaterThan(0);
    expect(text).toContain("Secondary color #222222");
    expect(text).toContain("prefers-color-scheme");
    expect(text).toContain("Product context:");
  });

  it("accepts actionStyle and echoes it; invalid values fall back to null", async () => {
    const { json: apply } = await postJson(SLUG, {
      promptIntent: "retheme",
      actionStyle: "apply",
    });
    expect(apply.actionStyle).toBe("apply");
    expect(apply.text).toContain("APPLY THE CHANGES DIRECTLY");
    expect(apply.text).toContain("Do you want me to apply this retheme now?");

    const { json: instruct } = await postJson(SLUG, {
      actionStyle: "instruct",
    });
    expect(instruct.actionStyle).toBe("instruct");
    expect(instruct.text).toContain("INSTRUCTIONS ONLY");

    const { json: bad } = await postJson(SLUG, { actionStyle: "advise" });
    expect(bad.actionStyle).toBeNull();
    expect(bad.text).not.toContain("Execution mode:");
  });

  it("supports the new coding-tool modes with distinct framing", async () => {
    const modes = ["vscode", "claude-code", "windsurf"] as const;
    const results = await Promise.all(
      modes.map(async (toolMode) => (await postJson(SLUG, { toolMode })).json),
    );
    expect(results[0].text).toContain("GitHub Copilot");
    expect(results[1].text).toContain("Claude Code");
    expect(results[2].text).toContain("Windsurf");
    for (const [i, r] of results.entries()) {
      expect(r.toolMode).toBe(modes[i]);
      expect(r.text.indexOf("Target tool:")).toBe(0);
      expect(r.text).toContain("Product context:");
    }
    expect(new Set(results.map((r) => r.text)).size).toBe(modes.length);
  });

  it("light theme mode via API is fixed, not adaptive", async () => {
    const { json } = await postJson(SLUG, { themeMode: "light" });
    expect(json.text).toContain("LIGHT (fixed)");
    expect(json.text).toContain("do NOT use prefers-color-scheme");
    expect(json.text).not.toContain("driven by prefers-color-scheme");
  });
});
