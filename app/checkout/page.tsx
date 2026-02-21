"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, UserCheck, CheckCircle, Loader2, Package } from "lucide-react"
import type { StoreConfig } from "@/lib/store-config"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const { customer, isAuthenticated } = useAuth()
  const [config, setConfig] = useState<StoreConfig | null>(null)
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

  useEffect(() => {
    if (isAuthenticated && customer) {
      setFormData(prev => ({
        ...prev,
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || ""
      }))
    }
  }, [isAuthenticated, customer])

  // Redirect if cart is empty and no success state
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      router.push("/productos")
    }
  }, [items, orderSuccess, router])

  const formatPrice = (price: number | undefined) => {
    const safePrice = price || 0
    if (safePrice === 0) return "Precio a consultar"
    if (!config) return safePrice.toString()
    return `${config.settings.currencySymbol}${safePrice.toLocaleString("es-AR")}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
        setOrderSuccess({
          orderNumber: result.order.orderNumber,
          mode: config.settings.orderMethod
        })

        const successMessage = config.settings.orderMethod === "direct"
          ? `¡Pedido confirmado! #${result.order.orderNumber}`
          : `¡Consulta enviada! #${result.order.orderNumber}`
        toast.success(successMessage)

        clearCart()
      }
    } catch (error: any) {
      toast.error(error.message || "Error al procesar el pedido")
    } finally {
      setIsSubmitting(false)
    }
  }

  const orderMethodLabel = config?.settings.orderMethod === "direct" ? "Confirmar pedido" : "Consultar disponibilidad"
  const isQuote = config?.settings.orderMethod === "quote"

  // Success state
  if (orderSuccess) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {orderSuccess.mode === "direct" ? "¡Pedido confirmado!" : "¡Consulta enviada!"}
            </h1>
            <p className="text-muted-foreground">
              {orderSuccess.mode === "direct"
                ? `Tu pedido #${orderSuccess.orderNumber} fue confirmado exitosamente.`
                : `Tu consulta #${orderSuccess.orderNumber} fue enviada. Te contactaremos para confirmar disponibilidad y precio final.`
              }
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {isAuthenticated && (
              <Button onClick={() => router.push("/cuenta/pedidos")} variant="outline" className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Ver mis pedidos
              </Button>
            )}
            <Button onClick={() => router.push("/productos")} className="w-full">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Seguir comprando
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 to-accent/5 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Seguir comprando
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Finalizar compra</h1>
          {isQuote && (
            <p className="text-muted-foreground mt-1">
              Revisá tu pedido y envianos tu consulta
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Customer info */}
              <div className="bg-background rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Datos de contacto</h2>

                {isAuthenticated && customer && (
                  <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <UserCheck className="h-4 w-4" />
                      <span className="font-medium">Comprando como {customer.name}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="checkout-name" className="text-sm font-medium">
                      Nombre completo *
                    </Label>
                    <Input
                      id="checkout-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Tu nombre completo"
                      required
                      disabled={isAuthenticated}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkout-phone" className="text-sm font-medium">
                        Teléfono *
                      </Label>
                      <Input
                        id="checkout-phone"
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
                      <Label htmlFor="checkout-email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="checkout-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="tu@email.com (opcional)"
                        disabled={isAuthenticated}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="checkout-notes" className="text-sm font-medium">
                      Notas del pedido
                    </Label>
                    <Textarea
                      id="checkout-notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Comentarios adicionales, instrucciones de entrega, etc. (opcional)"
                      rows={3}
                      className="mt-1 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className={`rounded-xl border p-4 ${
                config?.settings.orderMethod === "direct"
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-blue-500/10 border-blue-500/20"
              }`}>
                <p className={`text-sm leading-relaxed ${
                  config?.settings.orderMethod === "direct"
                    ? "text-green-700 dark:text-green-400"
                    : "text-blue-700 dark:text-blue-400"
                }`}>
                  {config?.settings.orderMethod === "direct"
                    ? "✅ Al confirmar, tu pedido será procesado automáticamente y el stock se reservará."
                    : "📋 Enviaremos tu consulta y te contactaremos para confirmar disponibilidad y precio final."
                  }
                </p>
              </div>

              {/* Submit button - visible on mobile below form */}
              <div className="lg:hidden">
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
                    orderMethodLabel
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-background rounded-xl border border-border p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold mb-4">
                Resumen del pedido
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({items.reduce((sum, item) => sum + item.quantity, 0)} {items.length === 1 ? 'producto' : 'productos'})
                </span>
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 py-3 border-b border-border last:border-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      {item.quantity > 1 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium leading-tight line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-primary font-semibold mt-1">
                        {formatPrice((item.price || 0) * item.quantity)}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Submit button - desktop */}
              <div className="hidden lg:block mt-6">
                <Button
                  type="submit"
                  form="checkout-form"
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
                    orderMethodLabel
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
