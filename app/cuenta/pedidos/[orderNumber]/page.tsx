"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import {
  Package,
  ArrowLeft,
  Calendar,
  ShoppingBag,
  Loader2,
  CreditCard,
  Copy,
  Check,
  AlertTriangle,
  XCircle,
  Clock,
  CheckCircle2,
  Truck,
  Ban,
  Banknote,
  Store,
  FileText
} from "lucide-react"

interface OrderItem {
  name: string
  quantity: number
  price: number
  subtotal: number
}

interface TransferDetails {
  bankName?: string
  cbu?: string
  alias?: string
  holder?: string
}

interface Order {
  orderNumber: string
  items: OrderItem[]
  total: number
  shippingCost: number
  shippingMethod?: { method: string; label: string; cost?: number }
  paymentMethod?: { method: string; label: string }
  notes?: string
  status: string
  createdAt: string
  updatedAt?: string
  transferDetails?: TransferDetails
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; step: number }> = {
  pending_confirmation: {
    label: "Pendiente de confirmación",
    color: "text-amber-600 bg-amber-100 border-amber-200",
    icon: Clock,
    step: 1
  },
  pending: {
    label: "Pendiente",
    color: "text-yellow-700 bg-yellow-100 border-yellow-200",
    icon: Clock,
    step: 1
  },
  confirmed: {
    label: "Confirmado",
    color: "text-blue-700 bg-blue-100 border-blue-200",
    icon: CheckCircle2,
    step: 2
  },
  completed: {
    label: "Entregado",
    color: "text-green-700 bg-green-100 border-green-200",
    icon: Truck,
    step: 3
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-700 bg-red-100 border-red-200",
    icon: Ban,
    step: -1
  }
}

const TIMELINE_STEPS = [
  { key: "received", label: "Recibido", icon: Package },
  { key: "confirmed", label: "Confirmado", icon: CheckCircle2 },
  { key: "completed", label: "Entregado", icon: Truck }
]

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderNumber = params.orderNumber as string
  const { customer, isAuthenticated, isLoading: authLoading } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [config, setConfig] = useState<{ apiUrl: string; storeId: string } | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/cuenta/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => setConfig({ apiUrl: data.apiUrl, storeId: data.storeId }))
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!config || !customer || !orderNumber) return

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("store_auth_token")
        if (!token) return

        const response = await fetch(
          `${config.apiUrl}/api/public/store/${config.storeId}/auth/orders/${orderNumber}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (!response.ok) {
          setError("Pedido no encontrado")
          return
        }

        const data = await response.json()
        setOrder(data.order)
      } catch {
        setError("Error al cargar el pedido")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [config, customer, orderNumber])

  const formatPrice = (price: number) => `$${price.toLocaleString("es-AR")}`

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const wasModified = () => {
    if (!order?.updatedAt) return false
    const created = new Date(order.createdAt).getTime()
    const updated = new Date(order.updatedAt).getTime()
    return updated - created > 60000
  }

  const statusConfig = order ? STATUS_CONFIG[order.status] || STATUS_CONFIG.pending : null
  const currentStep = statusConfig?.step || 0
  const isCancelled = order?.status === "cancelled"

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Cargando pedido...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <XCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold">{error || "Pedido no encontrado"}</h2>
          <Button asChild variant="outline">
            <Link href="/cuenta/pedidos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a mis pedidos
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const StatusIcon = statusConfig!.icon

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cuenta/pedidos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Pedido #{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(order.createdAt)}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig!.color}`}>
            <StatusIcon className="h-4 w-4" />
            {statusConfig!.label}
          </span>
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                {TIMELINE_STEPS.map((step, index) => {
                  const StepIcon = step.icon
                  const isActive = currentStep >= index + 1
                  const isCurrent = currentStep === index + 1
                  return (
                    <div key={step.key} className="flex-1 flex flex-col items-center relative">
                      {index > 0 && (
                        <div className={`absolute top-5 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                          currentStep > index ? "bg-primary" : "bg-muted"
                        }`} />
                      )}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md"
                          : isActive
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-muted"
                      }`}>
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <span className={`text-xs mt-2 font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cancelled banner */}
        {isCancelled && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
            <Ban className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Este pedido fue cancelado</p>
              {order.updatedAt && (
                <p className="text-sm opacity-80">{formatDate(order.updatedAt)}</p>
              )}
            </div>
          </div>
        )}

        {/* Modified banner */}
        {wasModified() && !isCancelled && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>La tienda modificó este pedido · Última actualización: {formatDate(order.updatedAt!)}</span>
          </div>
        )}

        {/* Transfer details */}
        {order.status === "confirmed" && order.transferDetails && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-5 space-y-3">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Datos para la transferencia
            </h3>
            <div className="space-y-2.5 text-sm">
              {order.transferDetails.bankName && (
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 dark:text-blue-400">Banco:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-200">{order.transferDetails.bankName}</span>
                </div>
              )}
              {order.transferDetails.holder && (
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 dark:text-blue-400">Titular:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-200">{order.transferDetails.holder}</span>
                </div>
              )}
              {order.transferDetails.cbu && (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-blue-700 dark:text-blue-400">CBU/CVU:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-medium text-blue-900 dark:text-blue-200 text-xs">{order.transferDetails.cbu}</span>
                    <button
                      onClick={() => copyToClipboard(order.transferDetails!.cbu!, "cbu")}
                      className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded"
                    >
                      {copiedField === "cbu" ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-blue-500" />}
                    </button>
                  </div>
                </div>
              )}
              {order.transferDetails.alias && (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-blue-700 dark:text-blue-400">Alias:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-blue-900 dark:text-blue-200">{order.transferDetails.alias}</span>
                    <button
                      onClick={() => copyToClipboard(order.transferDetails!.alias!, "alias")}
                      className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded"
                    >
                      {copiedField === "alias" ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-blue-500" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Separator className="bg-blue-200 dark:bg-blue-800" />
            <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
              Monto a transferir: {formatPrice(order.total)}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-500">
              Realizá la transferencia y nos pondremos en contacto para confirmar el pago.
            </p>
          </div>
        )}

        {/* Products */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Productos ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => {
                const outOfStock = item.quantity === 0
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      outOfStock
                        ? "bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30"
                        : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {outOfStock ? (
                        <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className={`font-medium truncate ${outOfStock ? "line-through text-muted-foreground" : ""}`}>
                          {item.name}
                        </p>
                        {outOfStock ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                            Sin stock
                          </span>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {formatPrice(item.price)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      {outOfStock ? (
                        <p className="text-sm text-muted-foreground line-through">{formatPrice(item.price)}</p>
                      ) : (
                        <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t space-y-2">
              {order.shippingCost > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.total - order.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span>{formatPrice(order.shippingCost)}</span>
                  </div>
                </>
              )}
              {order.shippingMethod?.method === "delivery" && order.shippingCost === 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping & Payment info */}
        {(order.shippingMethod || order.paymentMethod) && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Envío y pago</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.shippingMethod && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {order.shippingMethod.method === "pickup" ? (
                        <Store className="h-4 w-4 text-primary" />
                      ) : (
                        <Truck className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Envío</p>
                      <p className="font-medium">{order.shippingMethod.label || order.shippingMethod.method}</p>
                    </div>
                  </div>
                )}
                {order.paymentMethod && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {order.paymentMethod.method === "transfer" ? (
                        <CreditCard className="h-4 w-4 text-primary" />
                      ) : (
                        <Banknote className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pago</p>
                      <p className="font-medium">{order.paymentMethod.label || order.paymentMethod.method}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {order.notes && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notas del pedido
              </h3>
              <p className="text-muted-foreground text-sm">{order.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/cuenta/pedidos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a mis pedidos
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/productos">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Seguir comprando
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
