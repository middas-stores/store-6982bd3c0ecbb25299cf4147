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

    // Inject CSS variables
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

      /* Ensure headings use the heading color */
      h1, h2, h3, h4, h5, h6 {
        color: ${palette.heading} !important;
      }

      /* Ensure body text uses proper dark color */
      body, p, span, div {
        color: ${palette.bodyText};
      }

      /* Muted text for secondary information */
      .text-muted-foreground {
        color: ${palette.mutedText} !important;
      }
    `
  }, [config])

  return null
}
