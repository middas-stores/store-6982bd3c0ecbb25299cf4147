/**
 * Converts HEX color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : null
}

/**
 * Converts RGB to linear RGB
 */
function rgbToLinear(channel: number): number {
  if (channel <= 0.04045) {
    return channel / 12.92
  }
  return Math.pow((channel + 0.055) / 1.055, 2.4)
}

/**
 * Converts linear RGB to XYZ
 */
function linearRgbToXyz(r: number, g: number, b: number): { x: number; y: number; z: number } {
  const rLinear = rgbToLinear(r)
  const gLinear = rgbToLinear(g)
  const bLinear = rgbToLinear(b)

  return {
    x: 0.4124564 * rLinear + 0.3575761 * gLinear + 0.1804375 * bLinear,
    y: 0.2126729 * rLinear + 0.7151522 * gLinear + 0.072175 * bLinear,
    z: 0.0193339 * rLinear + 0.119192 * gLinear + 0.9503041 * bLinear,
  }
}

/**
 * Converts XYZ to OKLCH
 */
function xyzToOklch(x: number, y: number, z: number): { l: number; c: number; h: number } {
  // Convert XYZ to OKLab
  const l_ = 0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z
  const m_ = 0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z
  const s_ = 0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z

  const l = Math.cbrt(l_)
  const m = Math.cbrt(m_)
  const s = Math.cbrt(s_)

  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s

  // Convert OKLab to OKLCH
  const C = Math.sqrt(a * a + b * b)
  let H = Math.atan2(b, a) * (180 / Math.PI)
  if (H < 0) H += 360

  return { l: L, c: C, h: H }
}

/**
 * Converts HEX color to OKLCH color space
 * Returns a string in the format "oklch(L C H)"
 */
export function hexToOklch(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    // Fallback to a neutral gray if conversion fails
    return "oklch(0.5 0 0)"
  }

  const xyz = linearRgbToXyz(rgb.r, rgb.g, rgb.b)
  const oklch = xyzToOklch(xyz.x, xyz.y, xyz.z)

  // Round to 3 decimal places for cleaner output
  const l = Math.round(oklch.l * 1000) / 1000
  const c = Math.round(oklch.c * 1000) / 1000
  const h = Math.round(oklch.h * 1000) / 1000

  return `oklch(${l} ${c} ${h})`
}

/**
 * Converts HEX to a lighter variant (for foreground colors)
 */
export function hexToOklchLight(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    return "oklch(0.98 0 0)"
  }

  const xyz = linearRgbToXyz(rgb.r, rgb.g, rgb.b)
  const oklch = xyzToOklch(xyz.x, xyz.y, xyz.z)

  // Make it lighter by increasing lightness
  const l = Math.min(0.98, oklch.l + 0.3)
  const c = Math.round(oklch.c * 1000) / 1000
  const h = Math.round(oklch.h * 1000) / 1000

  return `oklch(${l} ${c} ${h})`
}

/**
 * Converts HEX to a darker variant (for text on light backgrounds)
 */
export function hexToOklchDark(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    return "oklch(0.17 0 0)"
  }

  const xyz = linearRgbToXyz(rgb.r, rgb.g, rgb.b)
  const oklch = xyzToOklch(xyz.x, xyz.y, xyz.z)

  // Make it darker by decreasing lightness
  const l = Math.max(0.17, oklch.l - 0.3)
  const c = Math.round(oklch.c * 1000) / 1000
  const h = Math.round(oklch.h * 1000) / 1000

  return `oklch(${l} ${c} ${h})`
}

/**
 * Determines if a color is dark or light based on luminance
 */
function isColorDark(hex: string): boolean {
  const rgb = hexToRgb(hex)
  if (!rgb) return false

  // Calculate relative luminance
  const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b
  return luminance < 0.5
}

/**
 * Gets appropriate foreground color for maximum contrast
 */
function getContrastingForeground(backgroundHex: string): string {
  return isColorDark(backgroundHex) ? "oklch(0.98 0 0)" : "oklch(0.17 0.01 60)"
}

/**
 * Generates a complete color palette from store config colors
 */
export function generateColorPalette(
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  },
  textColors?: {
    heading?: string
    body?: string
    muted?: string
  }
) {
  // Default dark text colors for readability
  const defaultHeading = "oklch(0.17 0.01 60)" // Very dark for headings
  const defaultBody = "oklch(0.25 0.01 60)" // Dark gray for body text
  const defaultMuted = "oklch(0.50 0.01 60)" // Medium gray for muted text

  return {
    // Background colors
    background: hexToOklch(colors.background),
    foreground: textColors?.body ? hexToOklch(textColors.body) : defaultBody,

    // Primary color (buttons, links, etc)
    primary: hexToOklch(colors.primary),
    primaryForeground: getContrastingForeground(colors.primary), // White text on dark buttons

    // Secondary color
    secondary: hexToOklch(colors.secondary),
    secondaryForeground: getContrastingForeground(colors.secondary),

    // Accent color
    accent: hexToOklch(colors.accent),
    accentForeground: getContrastingForeground(colors.accent),

    // Text-specific colors
    heading: textColors?.heading ? hexToOklch(textColors.heading) : defaultHeading,
    bodyText: textColors?.body ? hexToOklch(textColors.body) : defaultBody,
    mutedText: textColors?.muted ? hexToOklch(textColors.muted) : defaultMuted,
  }
}
