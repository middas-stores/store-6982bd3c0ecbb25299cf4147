"use client"

import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect } from "react"
import type { StoreConfig } from "@/lib/store-config"

export function CartSidebar() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, isOpen, closeCart } = useCart()
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => setConfig(data))
  }, [])

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const formatPrice = (price: number | undefined) => {
    const safePrice = price || 0
    if (safePrice === 0) return "Precio a consultar"
    if (!config) return safePrice.toString()
    return `${config.settings.currencySymbol}${safePrice.toLocaleString("es-AR")}`
  }

  const handleRemoveItem = async (id: string) => {
    setRemovingId(id)
    await new Promise(resolve => setTimeout(resolve, 200))
    removeItem(id)
    setRemovingId(null)
  }

  const handleWhatsAppOrder = () => {
    if (!config) return

    const message = `Hola! Me gustaría hacer un pedido:\n\n${items
      .map((item) => `• ${item.name} x${item.quantity} - ${formatPrice((item.price || 0) * item.quantity)}`)
      .join("\n")}\n\nTotal: ${formatPrice(totalPrice)}`

    const whatsappUrl = `https://wa.me/${config.business.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart} 
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Tu Carrito</h2>
                <p className="text-xs text-muted-foreground">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('¿Vaciar el carrito?')) clearCart()
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Vaciar
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={closeCart} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div className="max-w-xs">
                <div className="mb-4 flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="font-medium mb-2">Tu carrito está vacío</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Agrega productos para comenzar tu pedido
                </p>
                <Button onClick={closeCart} className="w-full">
                  Explorar productos
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`flex gap-4 rounded-xl border border-border p-3 bg-card transition-all duration-200 ${
                        removingId === item.id 
                          ? 'opacity-0 scale-95 -translate-x-4' 
                          : 'opacity-100 scale-100 translate-x-0'
                      }`}
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        animation: isOpen ? 'slideIn 0.3s ease-out forwards' : 'none',
                      }}
                    >
                      <div className="relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        {item.quantity > 1 && (
                          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-sm leading-tight line-clamp-2">{item.name}</h3>
                          <p className="text-sm font-semibold text-primary mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border bg-muted/30 p-4 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                
                {/* Total */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">{formatPrice(totalPrice)}</span>
                </div>
                
                {/* Disclaimer */}
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    ⚠️ Este es un catálogo informativo. Los precios y disponibilidad se confirmarán al momento de realizar tu pedido.
                  </p>
                </div>
                
                {/* CTA Button */}
                <Button 
                  className="w-full group" 
                  size="lg" 
                  onClick={handleWhatsAppOrder}
                >
                  <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Pedir por WhatsApp
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
