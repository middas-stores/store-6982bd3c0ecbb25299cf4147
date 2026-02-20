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
      [class*="bg-primary"] h1, [class*="bg-primary"] h2, [class*="bg-primary"] h3,
      .bg-secondary h1, .bg-secondary h2, .bg-secondary h3, .bg-secondary h4, .bg-secondary h5, .bg-secondary h6,
      [class*="bg-secondary"] h1, [class*="bg-secondary"] h2, [class*="bg-secondary"] h3,
      .bg-accent h1, .bg-accent h2, .bg-accent h3, .bg-accent h4, .bg-accent h5, .bg-accent h6,
      [class*="bg-accent"] h1, [class*="bg-accent"] h2, [class*="bg-accent"] h3 {
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
       * AUTO-CONTRAST: any element on a colored background
       * inherits the correct foreground color for readability.
       * Covers buttons, badges, pills, etc.
       */
      .bg-primary,
      [class*="bg-primary"]:not([class*="bg-primary/"]) {
        color: ${palette.primaryForeground} !important;
      }
      /* Primary with opacity (bg-primary/N) — keep foreground but allow opacity on bg */
      [class*="bg-primary/"] {
        color: ${palette.primaryForeground};
      }

      .bg-secondary,
      [class*="bg-secondary"]:not([class*="bg-secondary/"]) {
        color: ${palette.secondaryForeground} !important;
      }

      .bg-accent,
      [class*="bg-accent"]:not([class*="bg-accent/"]) {
        color: ${palette.accentForeground} !important;
      }

      /*
       * SVG icons inside colored backgrounds should inherit the text color
       * so they contrast correctly too.
       */
      .bg-primary svg,
      [class*="bg-primary"] svg,
      .bg-secondary svg,
      [class*="bg-secondary"] svg,
      .bg-accent svg,
      [class*="bg-accent"] svg {
        color: inherit !important;
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
      .text-primary:not(.bg-primary):not([class*="bg-primary"]) {
        color: var(--primary) !important;
      }
    `
  }, [config])

  return null
}
