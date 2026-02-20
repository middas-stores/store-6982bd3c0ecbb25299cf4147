"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "sonner"

interface StoreCustomer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  totalOrders?: number
  totalSpent?: number
}

interface AuthContextType {
  customer: StoreCustomer | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<StoreCustomer>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [customer, setCustomer] = useState<StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [config, setConfig] = useState<{ apiUrl: string; storeId: string } | null>(null)

  // Load store config
  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => {
        setConfig({ apiUrl: data.apiUrl, storeId: data.storeId })
      })
      .catch((error) => {
        console.error("Error loading store config:", error)
        setIsLoading(false)
      })
  }, [])

  // Check for existing session on mount
  useEffect(() => {
    if (!config) return

    const token = localStorage.getItem("store_auth_token")
    if (token) {
      fetchCurrentUser(token)
    } else {
      setIsLoading(false)
    }
  }, [config])

  const fetchCurrentUser = async (token: string) => {
    if (!config) return

    try {
      const response = await fetch(`${config.apiUrl}/api/public/store/${config.storeId}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCustomer(data.customer)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("store_auth_token")
      }
    } catch (error) {
      console.error("Error fetching current user:", error)
      localStorage.removeItem("store_auth_token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    if (!config) {
      throw new Error("Store configuration not loaded")
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${config.apiUrl}/api/public/store/${config.storeId}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al iniciar sesión")
      }

      const data = await response.json()
      localStorage.setItem("store_auth_token", data.token)
      setCustomer(data.customer)
      toast.success("¡Bienvenido de vuelta!")
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: { email: string; password: string; name: string; phone?: string }) => {
    if (!config) {
      throw new Error("Store configuration not loaded")
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${config.apiUrl}/api/public/store/${config.storeId}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al crear la cuenta")
      }

      const result = await response.json()
      localStorage.setItem("store_auth_token", result.token)
      setCustomer(result.customer)
      toast.success("¡Cuenta creada exitosamente!")
    } catch (error: any) {
      toast.error(error.message || "Error al crear la cuenta")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("store_auth_token")
    setCustomer(null)
    toast.success("Sesión cerrada")
  }

  const updateProfile = async (data: Partial<StoreCustomer>) => {
    if (!config || !customer) {
      throw new Error("No authenticated user")
    }

    const token = localStorage.getItem("store_auth_token")
    if (!token) {
      throw new Error("No authentication token")
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${config.apiUrl}/api/public/store/${config.storeId}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al actualizar perfil")
      }

      const result = await response.json()
      setCustomer(result.customer)
      toast.success("Perfil actualizado exitosamente")
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar perfil")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    customer,
    isAuthenticated: !!customer,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}