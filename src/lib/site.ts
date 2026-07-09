/**
 * Canonical site URL for metadata, sitemap, and robots.
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment (no trailing
 * slash); falls back to localhost for local dev so URLs are always valid.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "CopyUI";

export const SITE_TAGLINE =
  "CopyUI — Production-ready UI prompts for v0, Cursor, and GenVibe.";

export const SITE_DESCRIPTION =
  "Discover, customize, and copy production-ready UI prompts. Pick a theme, set your brand color and tool mode, and paste a tailored prompt into v0.dev, Cursor, or GenVibe.";
