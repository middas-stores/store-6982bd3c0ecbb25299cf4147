"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Check, AlertTriangle, Sparkles } from "lucide-react"
import type { Product } from "@/lib/store-config"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect } from "react"
import type { StoreConfig } from "@/lib/store-config"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart()
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const quantityInCart = getItemQuantity(product.id)
  const isOutOfStock = product.stock === 0
  const isMaxStock = quantityInCart >= product.stock
  const isLowStock = product.stock > 0 && product.stock <= 5

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => setConfig(data))
  }, [])

  const formatPrice = (price: number) => {
    if (price === 0) return "Consultar"
    if (!config) return price.toString()
    return `${config.settings.currencySymbol}${price.toLocaleString("es-AR")}`
  }

  const handleAddToCart = async () => {
    if (isOutOfStock || isMaxStock) return
    
    setIsAdding(true)
    
    // Pequeño delay para la animación
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const success = addItem(product)
    
    if (success) {
      toast.success(
        <div className="flex items-center gap-3">
          <img 
            src={product.image || "/placeholder.svg"} 
            alt={product.name}
            className="h-10 w-10 rounded-md object-cover"
          />
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">Agregado al carrito</p>
          </div>
        </div>,
        {
          duration: 2000,
          position: "bottom-right",
        }
      )
    }
    
    setTimeout(() => setIsAdding(false), 300)
  }

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{ 
        animationDelay: `${index * 75}ms`,
        animation: 'fadeSlideUp 0.5s ease-out forwards',
        opacity: 0,
      }}
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {isLowStock && !isOutOfStock && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            ¡Últimas {product.stock}!
          </span>
        )}
        {isOutOfStock && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
            Agotado
          </span>
        )}
        {quantityInCart > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
            <Check className="h-3 w-3" />
            {quantityInCart} en carrito
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="aspect-square overflow-hidden bg-muted relative">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      <CardContent className="p-4">
        <div className="mb-1 text-xs font-medium text-primary/80 uppercase tracking-wider">
          {product.category}
        </div>
        <h3 className="mb-2 font-semibold text-balance leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {config?.settings.showStock && !isOutOfStock && (
            <span className={`text-xs ${isLowStock ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}>
              Stock: {product.stock}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button 
          className={`w-full transition-all duration-300 ${isAdding ? 'scale-95' : ''}`}
          onClick={handleAddToCart} 
          disabled={isOutOfStock || isMaxStock || isAdding}
          variant={quantityInCart > 0 ? "secondary" : "default"}
        >
          {isAdding ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              ¡Agregado!
            </>
          ) : isOutOfStock ? (
            "Sin stock"
          ) : isMaxStock ? (
            "Stock máximo alcanzado"
          ) : quantityInCart > 0 ? (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Agregar otro
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Agregar al carrito
            </>
          )}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center leading-tight">
          Stock y precios sujetos a disponibilidad
        </p>
      </CardFooter>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </Card>
  )
}
