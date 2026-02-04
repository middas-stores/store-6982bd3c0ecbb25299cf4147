export interface ProductVariant {
  id: string
  name: string
  price: number
  stock: number
  image?: string
  variantAttributes?: Record<string, string>
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  categoryId?: string
  stock: number
  // Campos para productos agrupados (variantes)
  isGroup?: boolean
  variantCount?: number
  priceRange?: { min: number; max: number } | null
  attributes?: string[]
  attributeValues?: Record<string, string[]>
  variants?: ProductVariant[] | null
}

export interface BusinessHoursShift {
  open: string
  close: string
}

export interface DaySchedule {
  dayOfWeek: number
  isOpen: boolean
  shifts: BusinessHoursShift[]
}

export interface BusinessHours {
  enabled: boolean
  timezone?: string
  schedule: DaySchedule[]
}

export interface StoreConfig {
  storeId: string
  apiUrl: string
  business: {
    socialMedia: {
      instagram: string
      facebook: string
    }
    name: string
    phone: string
    email: string
    description: string
    address: string
    hasPhysicalStore?: boolean
    whatsapp: string
  }
  businessHours?: BusinessHours
  branding: {
    logo: string
    banner: string
    bannerTitle: string
    bannerSubtitle: string
    colorScheme: {
      name: string
      primary: string
      secondary: string
      accent: string
      background: string
    }
    typography: {
      fontScheme: "elegant" | "modern" | "classic"
      colors?: {
        heading?: string
        body?: string
        muted?: string
      }
    }
  }
  settings: {
    showStock: boolean
    allowOrders: boolean
    orderMethod: string
    showPrices: boolean
    showFloatingWhatsapp?: boolean
    currency: string
    currencySymbol: string
  }
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  analytics: Record<string, unknown>
}

export async function getStoreConfig(): Promise<StoreConfig> {
  // En desarrollo y producción SSR, leemos del sistema de archivos
  if (typeof window === "undefined") {
    const fs = await import("fs/promises")
    const path = await import("path")

    const configPath = path.join(process.cwd(), "public", "config", "store-config.json")
    const fileContent = await fs.readFile(configPath, "utf-8")
    return JSON.parse(fileContent)
  }

  // En el cliente o static export, usamos fetch con URL absoluta
  const response = await fetch("/config/store-config.json")
  if (!response.ok) {
    throw new Error("Failed to load store configuration")
  }
  return response.json()
}
