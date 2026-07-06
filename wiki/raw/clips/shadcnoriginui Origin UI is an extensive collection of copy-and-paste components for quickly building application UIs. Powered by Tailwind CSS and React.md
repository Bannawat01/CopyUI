---
title: "shadcn/originui: Origin UI is an extensive collection of copy-and-paste components for quickly building application UIs. Powered by Tailwind CSS and React."
source: "https://github.com/shadcn/originui"
author:
published:
created: 2026-07-06
description: "Origin UI is an extensive collection of copy-and-paste components for quickly building application UIs. Powered by Tailwind CSS and React. - shadcn/originui"
tags:
  - "clippings"
status: processed
---
## Origin UI

**Beautiful UI components built with Tailwind CSS and React.**

Origin UI is an extensive collection of copy-and-paste components for quickly building app UIs. It includes hundreds of components and is constantly updated with new designs.

**Demo** → [https://originui.com](https://originui.com/)

[![Origin UI](https://private-user-images.githubusercontent.com/2683512/417538792-a6428743-1628-4498-8b45-7000e30bdc24.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODMzNTQ4NzEsIm5iZiI6MTc4MzM1NDU3MSwicGF0aCI6Ii8yNjgzNTEyLzQxNzUzODc5Mi1hNjQyODc0My0xNjI4LTQ0OTgtOGI0NS03MDAwZTMwYmRjMjQucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI2MDcwNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNjA3MDZUMTYxNjExWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MGFkZTU1ZjMyMmVkYjVmMmEyMzY2MmY4ZmI0Y2U5YmM0MDUxNzM3YTNjNWRmMjQwNDM3OGYxZWQ5Nzg5N2NmMSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmcmVzcG9uc2UtY29udGVudC10eXBlPWltYWdlJTJGcG5nIn0.wivAaSkmqqDHuMxm_mAsN-Yax-rn0ECjcaJ7P5XAiBs)](https://private-user-images.githubusercontent.com/2683512/417538792-a6428743-1628-4498-8b45-7000e30bdc24.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODMzNTQ4NzEsIm5iZiI6MTc4MzM1NDU3MSwicGF0aCI6Ii8yNjgzNTEyLzQxNzUzODc5Mi1hNjQyODc0My0xNjI4LTQ0OTgtOGI0NS03MDAwZTMwYmRjMjQucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI2MDcwNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNjA3MDZUMTYxNjExWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MGFkZTU1ZjMyMmVkYjVmMmEyMzY2MmY4ZmI0Y2U5YmM0MDUxNzM3YTNjNWRmMjQwNDM3OGYxZWQ5Nzg5N2NmMSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmcmVzcG9uc2UtY29udGVudC10eXBlPWltYWdlJTJGcG5nIn0.wivAaSkmqqDHuMxm_mAsN-Yax-rn0ECjcaJ7P5XAiBs)

## Getting Started

Origin UI is designed to integrate seamlessly with Next.js projects, but the components are also compatible with any React-based project. The components follow shadcn conventions, so they'll feel familiar to anyone who has used shadcn before.

**1\. Set up the required files:**

- Copy all `.tsx` files from Origin UI's `registry/default/ui` folder to your project's `components/ui` folder.
- Copy `utils.ts` from Origin UI's `registry/default/lib` folder to your project's `lib` folder.

Note: If you're using shadcn, you may likely already have these files - however, I would recommend using our components over shadcn's for a consistent styling experience.

**2\. Add the following CSS variables to your stylesheet (you don't need to overwrite them if you already have them):**

```
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.637 0.237 25.331);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.871 0.006 286.286);
  --ring: oklch(0.871 0.006 286.286);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.141 0.005 285.823);
  --sidebar-primary: oklch(0.21 0.006 285.885);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.967 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
  --sidebar-border: oklch(0.92 0.004 286.32);
  --sidebar-ring: oklch(0.871 0.006 286.286);
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.141 0.005 285.823);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.141 0.005 285.823);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.21 0.006 285.885);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.21 0.006 285.885);
  --muted-foreground: oklch(0.65 0.01 286);
  --accent: oklch(0.21 0.006 285.885);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.274 0.006 286.033);
  --input: oklch(0.274 0.006 286.033);
  --ring: oklch(0.442 0.017 285.786);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.274 0.006 286.033);
  --sidebar-ring: oklch(0.442 0.017 285.786);
}
```

After completing these steps, you can copy and use the components in your project. Note that some components (e.g., number inputs, date pickers, time pickers, phone number inputs) may require additional libraries.

## Tailwind v4 support

Our UI library has been updated to Tailwind CSS v4 as of February 25, 2025. Legacy components built with v3 remain available by adding `/legacy/` to the component URL:

```
# v3 legacy component
pnpm dlx shadcn@latest add https://originui.com/r/legacy/comp-01.json
```

Note: New components will only be developed for Tailwind v4.

## Contributing

We welcome contributions to Origin UI! Please read our [contributing guidelines](https://github.com/shadcn/originui/blob/main/CONTRIBUTING.md) on how to submit improvements and new components.

## License

Licensed under the [MIT License](https://github.com/origin-space/originui/blob/main/LICENSE.md).

If you have any questions or just want to say hi, feel free to reach out to us on X 👉 [@pacovitiello](https://x.com/pacovitiello) & [@DavidePacilio](https://x.com/DavidePacilio).