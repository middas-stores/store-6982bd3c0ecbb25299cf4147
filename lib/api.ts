import type { Product } from "./store-config"

export interface ApiProduct {
  _id: string
  name: string
  description?: string
  price: number
  image?: {
    url?: string
    thumbnails?: {
      small?: string
      medium?: string
    }
  }
  categoryId?: {
    _id: string
    name: string
  }
  stock: number
  isActive?: boolean
  featured?: boolean
  storeDescription?: string
}

export interface Category {
  _id: string
  name: string
}

export async function getProducts(apiUrl: string, storeId: string): Promise<Product[]> {
  try {
    console.log(`${apiUrl}/api/public/store/${storeId}/products`)
    const response = await fetch(`${apiUrl}/api/public/store/${storeId}/products`)
    if (!response.ok) {
      throw new Error("Failed to load products")
    }
    const apiProducts: ApiProduct[] = await response.json()

    // Transformar productos de la API al formato de la interfaz Product
    return apiProducts
      .map(product => ({
        id: product._id,
        name: product.name,
        description: product.description || product.storeDescription || "",
        price: product.price || 0,
        image: product.image?.url || product.image?.thumbnails?.medium || "/placeholder.svg?height=400&width=400",
        category: product.categoryId?.name || "Sin categoría",
        categoryId: product.categoryId?._id,
        stock: product.stock || 0,
      }))
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getFeaturedProducts(apiUrl: string, storeId: string, limit = 4): Promise<Product[]> {
  console.log(`Fetching featured products from ${apiUrl} for store ${storeId}`)
  const products = await getProducts(apiUrl, storeId)
  console.log("Fetched products:", products)
  // Retornar los primeros productos como destacados
  return products.slice(0, limit)
}

export async function getCategories(apiUrl: string, storeId: string): Promise<Category[]> {
  try {
    const response = await fetch(`${apiUrl}/api/public/store/${storeId}/categories`)
    if (!response.ok) {
      throw new Error("Failed to load categories")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}
