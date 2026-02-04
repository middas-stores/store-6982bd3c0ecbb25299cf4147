"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Check, AlertTriangle, Sparkles, Layers } from "lucide-react"
import type { Product, ProductVariant } from "@/lib/store-config"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect, useMemo } from "react"
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
  
  // Estado para selección de variantes
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  // Determinar si es un producto con variantes
  const hasVariants = product.isGroup && product.variants && product.variants.length > 0

  // Inicializar atributos seleccionados
  useEffect(() => {
    if (hasVariants && product.attributes && product.attributeValues) {
      const initialAttrs: Record<string, string> = {}
      product.attributes.forEach(attr => {
        const values = product.attributeValues?.[attr]
        if (values && values.length > 0) {
          initialAttrs[attr] = values[0]
        }
      })
      setSelectedAttributes(initialAttrs)
    }
  }, [hasVariants, product.attributes, product.attributeValues])

  // Encontrar variante seleccionada
  useEffect(() => {
    if (hasVariants && product.variants && Object.keys(selectedAttributes).length > 0) {
      const variant = product.variants.find(v => {
        if (!v.variantAttributes) return false
        return Object.entries(selectedAttributes).every(
          ([key, value]) => v.variantAttributes?.[key] === value
        )
      })
      setSelectedVariant(variant || null)
    }
  }, [hasVariants, product.variants, selectedAttributes])

  // Producto efectivo (variante seleccionada o producto base)
  const effectiveProduct = useMemo(() => {
    if (hasVariants && selectedVariant) {
      return {
        id: selectedVariant.id,
        name: selectedVariant.name,
        price: selectedVariant.price,
        stock: selectedVariant.stock,
        image: selectedVariant.image || product.image,
        description: product.description,
        category: product.category
      }
    }
    return product
  }, [hasVariants, selectedVariant, product])
  
  const quantityInCart = getItemQuantity(effectiveProduct.id)
  const isOutOfStock = effectiveProduct.stock === 0
  const isMaxStock = quantityInCart >= effectiveProduct.stock
  const isLowStock = effectiveProduct.stock > 0 && effectiveProduct.stock <= 5

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
    if (hasVariants && !selectedVariant) {
      toast.error("Selecciona una opción")
      return
    }
    
    setIsAdding(true)
    
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const productToAdd = {
      ...effectiveProduct,
      id: effectiveProduct.id,
      name: effectiveProduct.name,
      price: effectiveProduct.price,
      stock: effectiveProduct.stock,
      image: effectiveProduct.image || product.image,
      description: product.description,
      category: product.category
    }
    
    const success = addItem(productToAdd as Product)
    
    if (success) {
      toast.success(
        <div className="flex items-center gap-3">
          <img 
            src={productToAdd.image || "/placeholder.svg"} 
            alt={productToAdd.name}
            className="h-10 w-10 rounded-md object-cover"
          />
          <div>
            <p className="font-medium">{productToAdd.name}</p>
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

  // Verificar disponibilidad de una combinación de atributos
  const isAttributeAvailable = (attr: string, value: string) => {
    if (!product.variants) return true
    
    const testAttrs = { ...selectedAttributes, [attr]: value }
    return product.variants.some(v => {
      if (!v.variantAttributes) return false
      return Object.entries(testAttrs).every(
        ([key, val]) => v.variantAttributes?.[key] === val
      ) && v.stock > 0
    })
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
        {hasVariants && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
            <Layers className="h-3 w-3" />
            {product.variantCount} opciones
          </span>
        )}
        {isLowStock && !isOutOfStock && !hasVariants && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            ¡Últimas {effectiveProduct.stock}!
          </span>
        )}
        {isOutOfStock && !hasVariants && (
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
          src={effectiveProduct.image || "/placeholder.svg"}
          alt={effectiveProduct.name}
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
        
        {/* Selector de variantes */}
        {hasVariants && product.attributes && product.attributeValues && (
          <div className="mb-3 space-y-2">
            {product.attributes.map(attr => (
              <div key={attr}>
                <label className="text-xs font-medium text-muted-foreground capitalize mb-1 block">
                  {attr}:
                </label>
                <div className="flex flex-wrap gap-1">
                  {product.attributeValues?.[attr]?.map(value => {
                    const isSelected = selectedAttributes[attr] === value
                    const isAvailable = isAttributeAvailable(attr, value)
                    
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedAttributes(prev => ({ ...prev, [attr]: value }))}
                        disabled={!isAvailable}
                        className={`px-2 py-1 text-xs rounded-md border transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : isAvailable
                              ? 'bg-background border-border hover:border-primary/50'
                              : 'bg-muted text-muted-foreground border-muted line-through opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {!hasVariants && (
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            {product.priceRange && !selectedVariant ? (
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.priceRange.min)} - {formatPrice(product.priceRange.max)}
              </span>
            ) : (
              <span className="text-xl font-bold text-primary">
                {formatPrice(effectiveProduct.price)}
              </span>
            )}
          </div>
          {config?.settings.showStock && !isOutOfStock && selectedVariant && (
            <span className={`text-xs ${isLowStock ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}>
              Stock: {effectiveProduct.stock}
            </span>
          )}
          {hasVariants && !selectedVariant && (
            <span className="text-xs text-muted-foreground">
              Stock total: {product.stock}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button 
          className={`w-full transition-all duration-300 ${isAdding ? 'scale-95' : ''}`}
          onClick={handleAddToCart} 
          disabled={isOutOfStock || isMaxStock || isAdding || (hasVariants && !selectedVariant)}
          variant={quantityInCart > 0 ? "secondary" : "default"}
        >
          {isAdding ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              ¡Agregado!
            </>
          ) : hasVariants && !selectedVariant ? (
            "Selecciona una opción"
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
