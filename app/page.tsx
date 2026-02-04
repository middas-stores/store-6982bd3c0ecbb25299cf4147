"use client"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { ProductSkeleton, HeroSkeleton } from "@/components/product-skeleton"
import { ArrowRight, Sparkles, ShoppingBag, Truck, Shield } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { StoreConfig, Product } from "@/lib/store-config"
import { getFeaturedProducts } from "@/lib/api"

export default function HomePage() {
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const configRes = await fetch("/config/store-config.json")
        const configData: StoreConfig = await configRes.json()
        setConfig(configData)

        const products = await getFeaturedProducts(configData.apiUrl, configData.storeId)
        setFeaturedProducts(products)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
        // Trigger hero animation after data loads
        setTimeout(() => setHeroVisible(true), 100)
      }
    }
    loadData()
  }, [])

  if (loading || !config) {
    return (
      <div className="min-h-screen">
        <HeroSkeleton />
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center space-y-4">
              <div className="h-8 w-64 mx-auto bg-muted rounded skeleton-shimmer" />
              <div className="h-4 w-96 mx-auto bg-muted rounded skeleton-shimmer" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ProductSkeleton count={4} />
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src={config.branding.banner || "/placeholder.svg"}
          alt="Banner"
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-out ${
            heroVisible ? 'scale-100' : 'scale-110'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        
        {/* Animated particles/sparkles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <Sparkles
              key={i}
              className={`absolute text-primary/20 animate-float-${i + 1}`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 18}%`,
                width: `${20 + i * 5}px`,
                height: `${20 + i * 5}px`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="max-w-2xl">
            <h1 
              className={`mb-6 text-5xl font-bold leading-tight text-balance md:text-6xl lg:text-7xl transition-all duration-700 ease-out ${
                heroVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              {config.branding.bannerTitle}
            </h1>
            <p 
              className={`mb-8 text-xl text-muted-foreground text-pretty md:text-2xl transition-all duration-700 ease-out ${
                heroVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '250ms' }}
            >
              {config.branding.bannerSubtitle}
            </p>
            <div 
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ease-out ${
                heroVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <Button size="lg" asChild className="group text-lg px-8 py-6">
                <Link href="/productos">
                  <ShoppingBag className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Ver Productos
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-widest">Descubre más</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
              <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-border bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Envíos a todo el país</p>
                <p className="text-xs text-muted-foreground">Consulta costos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Compra segura</p>
                <p className="text-xs text-muted-foreground">Protegemos tus datos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Retiro en tienda</p>
                <p className="text-xs text-muted-foreground">Sin costo adicional</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider mb-3">
              <Sparkles className="h-4 w-4" />
              Lo mejor para ti
            </span>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Productos Destacados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestra selección especial de productos, elegidos por su calidad y popularidad
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No hay productos destacados disponibles</p>
              </div>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild className="group">
              <Link href="/productos">
                Ver Todos los Productos
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Floating animation styles */}
      <style jsx global>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 0.6; }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-30px) rotate(-15deg); opacity: 0.5; }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-25px) rotate(20deg); opacity: 0.7; }
        }
        @keyframes float-4 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-35px) rotate(-10deg); opacity: 0.5; }
        }
        @keyframes float-5 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-15px) rotate(15deg); opacity: 0.4; }
        }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 6s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 4.5s ease-in-out infinite; }
        .animate-float-5 { animation: float-5 5.5s ease-in-out infinite; }
        
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
