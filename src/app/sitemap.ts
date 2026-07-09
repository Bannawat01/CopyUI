import type { MetadataRoute } from "next";
import { prompts } from "@/lib/prompts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...prompts.map((p) => ({
      url: `${SITE_URL}/prompts/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
