import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SiteHeader } from "@/components/site-header";
import { LocaleProvider } from "@/components/locale-provider";
import { AppearanceProvider } from "@/components/appearance-provider";
import { t } from "@/lib/i18n";

describe("site header", () => {
  const html = renderToStaticMarkup(
    <AppearanceProvider>
      <LocaleProvider>
        <SiteHeader />
      </LocaleProvider>
    </AppearanceProvider>,
  );

  it("renders the language selector with all three locale labels", () => {
    expect(html).toContain("English");
  });

  it("renders the appearance selector with Dark, Light, and System", () => {
    expect(html).toContain(t("en", "appearance.dark"));
    expect(html).toContain(t("en", "appearance.light"));
    expect(html).toContain(t("en", "appearance.system"));
  });

  it("renders the wordmark linking home", () => {
    expect(html).toContain('href="/"');
  });
});
