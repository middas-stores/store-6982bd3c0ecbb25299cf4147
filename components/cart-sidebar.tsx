"use client"

import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle, UserCheck, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import type { StoreConfig } from "@/lib/store-config"
import { toast } from "sonner"

export function CartSidebar() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, isOpen, closeCart } = useCart()
  const { customer, isAuthenticated } = useAuth()
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  
  // Checkout form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string; mode: string } | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  })

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => setConfig(data))
  }, [])

  // Update form data when user authentication changes
  useEffect(() => {
    if (isAuthenticated && customer) {
      setFormData(prev => ({
        ...prev,
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || ""
      }))
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        notes: ""
      })
    }
  }, [isAuthenticated, customer])

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

    let message = `Hola! Me gustaría hacer un pedido:\n\n`
    
    // Add customer info if authenticated
    if (isAuthenticated && customer) {
      message += `Datos del cliente:\n`
      message += `• Nombre: ${customer.name}\n`
      message += `• Email: ${customer.email}\n`
      if (customer.phone) message += `• Teléfono: ${customer.phone}\n`
      if (customer.address) message += `• Dirección: ${customer.address}\n`
      message += `\n`
    }
    
    message += `Productos:\n${items
      .map((item) => `• ${item.name} x${item.quantity} - ${formatPrice((item.price || 0) * item.quantity)}`)
      .join("\n")}\n\nTotal: ${formatPrice(totalPrice)}`

    const whatsappUrl = `https://wa.me/${config.business.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleDirectOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!config || !formData.name.trim() || !formData.phone.trim()) return

    setIsSubmitting(true)
    
    try {
      const orderData = {
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim(),
          address: undefined
        },
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        notes: formData.notes.trim() || undefined,
        orderMode: config.settings.orderMethod as "direct" | "quote"
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      }

      // Add auth header if user is authenticated
      if (isAuthenticated) {
        const token = localStorage.getItem("store_auth_token")
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }
      }

      const response = await fetch(`${config.apiUrl}/api/public/store/${config.storeId}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al procesar el pedido")
      }

      const result = await response.json()
      
      if (result.success) {
        // Set success state
        setOrderSuccess({
          orderNumber: result.order.orderNumber,
          mode: config.settings.orderMethod
        })
        
        // Show success toast
        const successMessage = config.settings.orderMethod === "direct" 
          ? `¡Pedido confirmado! #${result.order.orderNumber}`
          : `¡Consulta enviada! #${result.order.orderNumber}`
        toast.success(successMessage)
        
        // Clear cart and close sidebar after showing success state
        setTimeout(() => {
          clearCart()
          setOrderSuccess(null)
          closeCart()
          setFormData({ name: "", email: "", phone: "", notes: "" })
        }, 2500)
      }
    } catch (error: any) {
      toast.error(error.message || "Error al procesar el pedido")
    } finally {
      setIsSubmitting(false)
    }
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
                <div className={`rounded-lg border p-3 ${
                  config?.settings.orderMethod === "whatsapp" 
                    ? "bg-amber-500/10 border-amber-500/20"
                    : config?.settings.orderMethod === "direct"
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-blue-500/10 border-blue-500/20"
                }`}>
                  <p className={`text-xs leading-relaxed ${
                    config?.settings.orderMethod === "whatsapp"
                      ? "text-amber-700 dark:text-amber-400"
                      : config?.settings.orderMethod === "direct"
                      ? "text-green-700 dark:text-green-400"
                      : "text-blue-700 dark:text-blue-400"
                  }`}>
                    {config?.settings.orderMethod === "whatsapp" 
                      ? "⚠️ Este es un catálogo informativo. Los precios y disponibilidad se confirmarán al momento de realizar tu pedido."
                      : config?.settings.orderMethod === "direct"
                      ? "✅ Al confirmar, tu pedido será procesado automáticamente."
                      : "📋 Enviaremos tu consulta y te contactaremos para confirmar disponibilidad y precio final."
                    }
                  </p>
                </div>
                
                {/* Order Success State */}
                {orderSuccess ? (
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-100">
                        {orderSuccess.mode === "direct" ? "¡Pedido confirmado!" : "¡Consulta enviada!"}
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {orderSuccess.mode === "direct" 
                          ? `Tu pedido #${orderSuccess.orderNumber} fue confirmado`
                          : `Tu consulta #${orderSuccess.orderNumber} fue enviada. Te contactaremos para confirmar disponibilidad.`
                        }
                      </p>
                    </div>
                  </div>
                ) : config?.settings.orderMethod === "whatsapp" ? (
                  /* WhatsApp Button */
                  <Button 
                    className="w-full group" 
                    size="lg" 
                    onClick={handleWhatsAppOrder}
                  >
                    <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Pedir por WhatsApp
                  </Button>
                ) : (
                  /* Checkout Form */
                  <form onSubmit={handleDirectOrder} className="space-y-4">
                    {isAuthenticated && customer && (
                      <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <UserCheck className="h-4 w-4" />
                          <span className="font-medium">Comprando como {customer.name}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="customer-name" className="text-sm font-medium">
                          Nombre *
                        </Label>
                        <Input
                          id="customer-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Tu nombre completo"
                          required
                          disabled={isAuthenticated}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="customer-phone" className="text-sm font-medium">
                          Teléfono *
                        </Label>
                        <Input
                          id="customer-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Tu número de teléfono"
                          required
                          disabled={isAuthenticated && !!customer?.phone}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="customer-email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="customer-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="tu@email.com (opcional)"
                          disabled={isAuthenticated}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="order-notes" className="text-sm font-medium">
                          Notas del pedido
                        </Label>
                        <Textarea
                          id="order-notes"
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Comentarios adicionales (opcional)"
                          rows={3}
                          className="mt-1 resize-none"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting || !formData.name.trim() || !formData.phone.trim()}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        config?.settings.orderMethod === "direct" ? "Confirmar pedido" : "Consultar disponibilidad"
                      )}
                    </Button>
                  </form>
                )}
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
