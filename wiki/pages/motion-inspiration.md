# Motion Inspiration

**Status: [new — synthesized from wiki/raw/clips; source gap noted below]**

## Source gap
The sources named for motion inspiration — **Magic UI**, **Aceternity
UI**, and **Motion-Primitives** — were **not found** as dedicated clips in
`wiki/raw/clips`. Aceternity UI appears only as a single one-line
description inside the awesome-shadcn-ui link table (see
[competitor-inspiration.md](competitor-inspiration.md)): "Copy paste the
most trending react components without having to worry about styling and
animations." That line is too thin to synthesize real motion patterns
from. No content was invented to fill this gap — re-clip these three
sources directly (their own sites/READMEs) if motion-specific research is
needed.

## What the processed clips do offer (indirect, thin)
*Source: `Shadcn UI Components, Blocks & Templates.md` (cult-ui.com),
`21st.dev - Crafted React components...md`*
- **Cult UI** advertises "78+ animated components and effects" as its
  headline, but the clipped page content is dominated by an unrelated AI
  agent showcase, not the animated components themselves — no specific
  animation techniques were captured.
- **21st.dev**'s community listing includes named components like "Glow,"
  "Shader Lines," "Marquee," and "Gradient Card" (some with autoplaying
  preview videos) — these confirm *what kinds* of motion/visual effects
  are popular in this ecosystem (ambient glow, shader backgrounds,
  marquees, gradient cards) but the clip has no implementation detail,
  only names and thumbnails.

## Relevance to CopyUI (with caution)
CopyUI already has a from-scratch motion system (see
[styling.md](styling.md) motion section): staggered gallery entrance,
`AnimatePresence`-driven filter transitions, animated category pills,
hover/focus-unified card motion, and a global
`MotionConfig reducedMotion="user"` safety net. The one directionally
useful signal from these thin clips is that **ambient background effects
(glow, shader, gradient)** are a recognizable "premium" motion category in
this space — CopyUI's `PromptCard` already does a primary-color-tinted
radial glow on hover, which is directionally aligned without needing to
copy anything further.

## What to avoid
- Autoplaying video previews (as seen on 21st.dev's Gradient Card
  listing) — CopyUI's own motion-safety rule (no autoplay, no loops,
  respect reduced motion) should not be relaxed to chase this pattern.
- Don't treat "78+ animated components" or a marquee of effect names as a
  todo list — without real technique detail behind them, they're not
  actionable, just a reminder that this category is popular.

## Possible next actions
- **[uncertain]** If genuinely useful motion inspiration is wanted, re-clip
  Magic UI, Aceternity UI, and Motion-Primitives directly (their docs
  sites, not a third-party list mentioning them) so there's real technique
  content to synthesize from.
- No code changes recommended from this page alone — insufficient source
  material.

## Related
- [competitor-inspiration.md](competitor-inspiration.md)
- [styling.md](styling.md)
