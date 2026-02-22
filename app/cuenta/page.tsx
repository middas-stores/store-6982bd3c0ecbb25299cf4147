"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Edit, 
  LogOut, 
  ShoppingBag,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

export default function AccountPage() {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading, logout, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/cuenta/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (customer) {
      setEditData({
        name: customer.name || "",
        phone: customer.phone || "",
        address: customer.address || "",
      })
    }
  }, [customer])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset to original values
      setEditData({
        name: customer?.name || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
      })
    }
    setIsEditing(!isEditing)
  }

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true)
      await updateProfile(editData)
      setIsEditing(false)
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Cargando tu cuenta...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !customer) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mi Cuenta</h1>
            <p className="text-muted-foreground">Gestiona tu información personal y pedidos</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Actualiza tus datos de contacto
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={isEditing ? handleEditToggle : () => setIsEditing(true)}
                disabled={isUpdating}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={isUpdating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={isUpdating}
                      placeholder="2646123456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={editData.address}
                      onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={isUpdating}
                      placeholder="Calle 123, Ciudad"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleUpdateProfile} disabled={isUpdating} className="flex-1">
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        "Guardar cambios"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.email}</p>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.phone || "No especificado"}</p>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.address || "No especificada"}</p>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Resumen de Cuenta
              </CardTitle>
              <CardDescription>
                Estadísticas de tus pedidos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {customer.totalOrders || 0}
                </div>
                <p className="text-sm text-muted-foreground">Pedidos totales</p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/cuenta/pedidos">
                    <Package className="mr-2 h-4 w-4" />
                    Ver mis pedidos
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/productos">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continuar comprando
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}