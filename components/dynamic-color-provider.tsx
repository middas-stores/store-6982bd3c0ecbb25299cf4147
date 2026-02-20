"use client"

import { useEffect } from "react"
import type { StoreConfig } from "@/lib/store-config"
import { generateColorPalette } from "@/lib/color-utils"

interface DynamicColorProviderProps {
  config: StoreConfig
}

export function DynamicColorProvider({ config }: DynamicColorProviderProps) {
  useEffect(() => {
    // Generate color palette from store config
    const palette = generateColorPalette(
      {
        primary: config.branding.colorScheme.primary,
        secondary: config.branding.colorScheme.secondary,
        accent: config.branding.colorScheme.accent,
        background: config.branding.colorScheme.background,
      },
      config.branding.typography.colors
    )

    // Create or update style element
    let styleElement = document.getElementById("dynamic-theme-colors") as HTMLStyleElement
    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = "dynamic-theme-colors"
      document.head.appendChild(styleElement)
    }

    // Inject CSS variables + contrast-safe rules
    styleElement.textContent = `
      :root {
        --background: ${palette.background} !important;
        --foreground: ${palette.foreground} !important;
        --primary: ${palette.primary} !important;
        --primary-foreground: ${palette.primaryForeground} !important;
        --secondary: ${palette.secondary} !important;
        --secondary-foreground: ${palette.secondaryForeground} !important;
        --accent: ${palette.accent} !important;
        --accent-foreground: ${palette.accentForeground} !important;
        --muted-foreground: ${palette.mutedText} !important;
      }

      /* Headings use the heading color (except inside colored backgrounds) */
      h1, h2, h3, h4, h5, h6 {
        color: ${palette.heading} !important;
      }
      .bg-primary h1, .bg-primary h2, .bg-primary h3, .bg-primary h4, .bg-primary h5, .bg-primary h6,
      .bg-secondary h1, .bg-secondary h2, .bg-secondary h3, .bg-secondary h4, .bg-secondary h5, .bg-secondary h6,
      .bg-accent h1, .bg-accent h2, .bg-accent h3, .bg-accent h4, .bg-accent h5, .bg-accent h6 {
        color: inherit !important;
      }

      /* Body text uses proper dark color */
      body {
        color: ${palette.bodyText};
      }

      /* Muted text */
      .text-muted-foreground {
        color: ${palette.mutedText} !important;
      }

      /*
       * AUTO-CONTRAST: elements with solid colored backgrounds
       * get the correct foreground color for readability.
       * Only target exact bg-* classes, NOT gradients (from-*/to-*) or opacity variants.
       */
      .bg-primary {
        color: ${palette.primaryForeground} !important;
      }

      .bg-secondary {
        color: ${palette.secondaryForeground} !important;
      }

      .bg-accent {
        color: ${palette.accentForeground} !important;
      }

      /*
       * Opacity variants of bg-primary (bg-primary/90, bg-primary/10, etc)
       * Only apply to elements that are visually solid enough.
       * Use non-important so children can override.
       */
      [class~="bg-primary/90"],
      [class~="bg-primary/80"] {
        color: ${palette.primaryForeground};
      }

      /*
       * SVG icons inside solid colored backgrounds inherit text color.
       */
      .bg-primary svg,
      .bg-secondary svg,
      .bg-accent svg {
        color: inherit !important;
      }

      /*
       * Inputs and form elements should always use foreground color
       * regardless of ancestor backgrounds.
       */
      input, textarea, select, [data-slot="input"] {
        color: ${palette.foreground} !important;
      }

      /*
       * Overrides for elements that explicitly set text-primary-foreground,
       * text-secondary-foreground, etc. — these are already correct,
       * reinforce them.
       */
      .text-primary-foreground {
        color: ${palette.primaryForeground} !important;
      }
      .text-secondary-foreground {
        color: ${palette.secondaryForeground} !important;
      }
      .text-accent-foreground {
        color: ${palette.accentForeground} !important;
      }

      /*
       * Ghost/outline buttons and elements on neutral backgrounds
       * should use body text color, not inherit from colored ancestors.
       */
      .bg-background,
      .bg-card,
      .bg-muted\\/30 {
        color: ${palette.bodyText};
      }

      /*
       * Ensure text-primary (used for links, highlights) stays the primary color
       * when NOT on a primary background.
       */
      .text-primary:not(.bg-primary) {
        color: var(--primary) !important;
      }
    `
  }, [config])

  return null
}
