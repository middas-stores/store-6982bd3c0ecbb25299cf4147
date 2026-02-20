"use client"

import { ProductCard } from "@/components/product-card"
import { ProductSkeleton } from "@/components/product-skeleton"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, Grid3X3, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { StoreConfig, Product } from "@/lib/store-config"
import { getProducts, getCategories, type Category } from "@/lib/api"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("categoria")
  const searchFilter = searchParams.get("search")

  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const configRes = await fetch("/config/store-config.json")
        const configData: StoreConfig = await configRes.json()
        setConfig(configData)

        const [productsData, categoriesData] = await Promise.all([
          getProducts(configData.apiUrl, configData.storeId),
          getCategories(configData.apiUrl, configData.storeId)
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
        setTimeout(() => setHeaderVisible(true), 100)
      }
    }
    loadData()
  }, [])

  // Filtrar productos por categoría y búsqueda
  const filteredProducts = products.filter((p) => {
    if (categoryFilter && p.categoryId !== categoryFilter) return false
    if (searchFilter) {
      const q = searchFilter.toLowerCase()
      const name = (p.name || "").toLowerCase()
      const desc = (p.description || "").toLowerCase()
      if (!name.includes(q) && !desc.includes(q)) return false
    }
    return true
  })

  // Obtener nombre de la categoría activa
  const activeCategory = categoryFilter
    ? categories.find((c) => c._id === categoryFilter)
    : null

  if (loading || !config) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header skeleton */}
          <div className="mb-12 space-y-4">
            <div className="h-10 w-64 bg-muted rounded skeleton-shimmer" />
            <div className="h-5 w-96 bg-muted rounded skeleton-shimmer" />
          </div>
          
          {/* Products grid skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ProductSkeleton count={8} />
          </div>
        </div>
        
        <style jsx global>{`
          .skeleton-shimmer {
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.4) 50%,
              transparent 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div 
            className={`transition-all duration-500 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {(activeCategory || searchFilter) && (
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4 group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Ver todos los productos
              </Link>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                {activeCategory ? (
                  <Grid3X3 className="h-6 w-6 text-primary" />
                ) : (
                  <Package className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">
                  {searchFilter
                    ? `Resultados para "${searchFilter}"`
                    : activeCategory
                      ? activeCategory.name
                      : "Todos los Productos"}
                </h1>
                <p className="text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
                  {activeCategory ? ` en ${activeCategory.name}` : searchFilter ? ' encontrados' : ' disponibles'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Category Pills */}
          {categories.length > 0 && (
            <div 
              className={`flex flex-wrap gap-2 mt-6 transition-all duration-500 ease-out ${
                headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <Link href="/productos">
                <Button
                  variant={!categoryFilter ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  Todos
                </Button>
              </Link>
              {categories.map((category) => (
                <Link key={category._id} href={`/productos?categoria=${category._id}`}>
                  <Button
                    variant={categoryFilter === category._id ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                  >
                    {category.name}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchFilter ? 'Sin resultados' : 'No hay productos disponibles'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchFilter
                    ? `No encontramos productos para "${searchFilter}"`
                    : activeCategory 
                      ? `No encontramos productos en la categoría ${activeCategory.name}`
                      : 'Pronto agregaremos nuevos productos'}
                </p>
                {(activeCategory || searchFilter) && (
                  <Button asChild variant="outline">
                    <Link href="/productos">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Ver todos los productos
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
