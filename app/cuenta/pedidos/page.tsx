"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
  Package,
  ArrowLeft,
  Calendar,
  ShoppingBag,
  Loader2,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  Ban,
  Banknote
} from "lucide-react"

interface OrderItem {
  name: string
  quantity: number
  price: number
  subtotal: number
}

interface Order {
  orderNumber: string
  items: OrderItem[]
  total: number
  status: string
  createdAt: string
  updatedAt?: string
}

export default function OrdersPage() {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [config, setConfig] = useState<{ apiUrl: string; storeId: string } | null>(null)

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

  const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
    pending_confirmation: { label: "Pendiente", color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
    pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
    confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle2 },
    paid: { label: "Pagado", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: Banknote },
    completed: { label: "Entregado", color: "bg-green-100 text-green-800 border-green-200", icon: Truck },
    cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800 border-red-200", icon: Ban }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })

  const formatPrice = (price: number) => `$${price.toLocaleString("es-AR")}`

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
          <div className="space-y-3">
            {orders.map((order) => {
              const status = STATUS_MAP[order.status] || STATUS_MAP.pending
              const StatusIcon = status.icon
              return (
                <Link
                  key={order.orderNumber}
                  href={`/cuenta/pedidos/${order.orderNumber}`}
                  className="block"
                >
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">#{order.orderNumber}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(order.createdAt)}
                            </span>
                            <span>·</span>
                            <span>{order.items.length} {order.items.length === 1 ? "producto" : "productos"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                          <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}