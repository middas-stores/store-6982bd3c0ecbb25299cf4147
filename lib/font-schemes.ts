import { Playfair_Display, Inter, Montserrat, Lora, Roboto, Merriweather } from "next/font/google"

// Esquema Elegante: Playfair Display (títulos) + Inter (texto)
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

// Esquema Moderno: Montserrat (títulos) + Roboto (texto)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
})

// Esquema Clásico: Lora (títulos) + Merriweather (texto)
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
  display: "swap",
})

export interface FontScheme {
  heading: {
    variable: string
    className: string
  }
  body: {
    variable: string
    className: string
  }
  description: string
}

export const fontSchemes: Record<string, FontScheme> = {
  elegant: {
    heading: {
      variable: playfairDisplay.variable,
      className: playfairDisplay.className,
    },
    body: {
      variable: inter.variable,
      className: inter.className,
    },
    description: "Elegante y sofisticado - Playfair Display + Inter",
  },
  modern: {
    heading: {
      variable: montserrat.variable,
      className: montserrat.className,
    },
    body: {
      variable: roboto.variable,
      className: roboto.className,
    },
    description: "Moderno y limpio - Montserrat + Roboto",
  },
  classic: {
    heading: {
      variable: lora.variable,
      className: lora.className,
    },
    body: {
      variable: merriweather.variable,
      className: merriweather.className,
    },
    description: "Clásico y tradicional - Lora + Merriweather",
  },
}

export function getFontScheme(schemeName: string = "elegant"): FontScheme {
  return fontSchemes[schemeName] || fontSchemes.elegant
}
