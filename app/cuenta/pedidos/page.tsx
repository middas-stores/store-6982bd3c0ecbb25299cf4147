"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuth } from "@/contexts/auth-context"
import { 
  Package, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Hash,
  ShoppingBag,
  Loader2,
  AlertCircle,
  AlertTriangle,
  XCircle,
  CreditCard,
  Copy,
  Check
} from "lucide-react"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  image?: string
}

interface TransferDetails {
  bankName?: string
  cbu?: string
  alias?: string
  holder?: string
}

interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  total: number
  status: "pending" | "pending_confirmation" | "confirmed" | "completed" | "cancelled"
  createdAt: string
  updatedAt?: string
  paymentMethod?: { method: string; label: string }
  transferDetails?: TransferDetails
}

export default function OrdersPage() {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [config, setConfig] = useState<{ apiUrl: string; storeId: string } | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/cuenta/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => {
        setConfig({ apiUrl: data.apiUrl, storeId: data.storeId })
      })
      .catch((error) => {
        console.error("Error loading store config:", error)
        setOrdersLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!config || !customer) return

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("store_auth_token")
        if (!token) return

        const response = await fetch(`${config.apiUrl}/api/public/store/${config.storeId}/auth/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [config, customer])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "pending_confirmation":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "pending_confirmation":
        return "Pendiente de confirmación"
      case "confirmed":
        return "Confirmado"
      case "completed":
        return "Completado"
      case "cancelled":
        return "Cancelado"
      default:
        return "Desconocido"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-AR")}`
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const wasModified = (order: Order) => {
    if (!order.updatedAt) return false
    const created = new Date(order.createdAt).getTime()
    const updated = new Date(order.updatedAt).getTime()
    // Consider modified if updated more than 1 minute after creation
    return (updated - created) > 60000
  }

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  if (isLoading || ordersLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Cargando tus pedidos...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !customer) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/cuenta">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Mis Pedidos</h1>
                <p className="text-muted-foreground">
                  Historial completo de tus pedidos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No tenés pedidos aún</h3>
                  <p className="text-muted-foreground">
                    Cuando realices tu primer pedido, aparecerá aquí con toda la información
                  </p>
                </div>
                <Button asChild className="mt-6">
                  <Link href="/productos">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Explorar productos
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.orderNumber}>
                <Collapsible>
                  <CardHeader>
                    <CollapsibleTrigger 
                      className="w-full"
                      onClick={() => toggleOrderExpansion(order.orderNumber)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg">
                                Pedido #{order.orderNumber}
                              </CardTitle>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(order.createdAt)}
                              </span>
                              <span className="font-semibold text-primary">
                                {formatPrice(order.total)}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? "producto" : "productos"}
                          </span>
                          {expandedOrders.has(order.orderNumber) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />
                      <div className="space-y-3">
                        {/* Modified order banner */}
                        {wasModified(order) && (
                          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-sm">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span>La tienda modificó este pedido</span>
                          </div>
                        )}

                        {/* Transfer details for confirmed orders */}
                        {order.status === "confirmed" && order.transferDetails && (
                          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Datos para la transferencia
                            </h4>
                            <div className="space-y-2 text-sm">
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
                                      onClick={(e) => { e.stopPropagation(); copyToClipboard(order.transferDetails!.cbu!, `cbu-${order.orderNumber}`); }}
                                      className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded"
                                    >
                                      {copiedField === `cbu-${order.orderNumber}` ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3 text-blue-500" />}
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
                                      onClick={(e) => { e.stopPropagation(); copyToClipboard(order.transferDetails!.alias!, `alias-${order.orderNumber}`); }}
                                      className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded"
                                    >
                                      {copiedField === `alias-${order.orderNumber}` ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3 text-blue-500" />}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Realizá la transferencia por {formatPrice(order.total)} y nos pondremos en contacto para confirmar el pago.
                            </p>
                          </div>
                        )}
                        
                        <h4 className="font-medium">Productos del pedido:</h4>
                        {order.items.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center gap-4 p-3 rounded-lg ${
                              item.quantity === 0 
                                ? "bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30" 
                                : "bg-muted/50"
                            }`}
                          >
                            <div className="relative">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className={`w-16 h-16 rounded-lg object-cover ${
                                  item.quantity === 0 ? "opacity-40 grayscale" : ""
                                }`}
                              />
                              {item.quantity > 1 && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                                  {item.quantity}
                                </span>
                              )}
                              {item.quantity === 0 && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                                  <XCircle className="h-4 w-4" />
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className={`font-medium line-clamp-1 ${
                                item.quantity === 0 ? "line-through text-muted-foreground" : ""
                              }`}>
                                {item.name}
                              </h5>
                              {item.quantity === 0 ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                                  Sin stock
                                </span>
                              ) : (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>Cantidad: {item.quantity}</span>
                                  <span>•</span>
                                  <span>Precio: {formatPrice(item.price)}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              {item.quantity === 0 ? (
                                <p className="text-sm text-muted-foreground line-through">
                                  {formatPrice(item.price)}
                                </p>
                              ) : (
                                <p className="font-semibold">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex justify-between items-center pt-4 border-t">
                          <span className="font-semibold text-lg">Total del pedido:</span>
                          <span className="font-bold text-xl text-primary">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}