"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Menu, ChevronDown, Home, Grid3X3, Package, User, LogOut, UserCheck, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect, useRef } from "react"
import type { StoreConfig } from "@/lib/store-config"
import type { Category } from "@/lib/api"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const router = useRouter()
  const { totalItems, openCart } = useCart()
  const { customer, isAuthenticated, logout } = useAuth()
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartBounce, setCartBounce] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const prevTotalItems = useRef(totalItems)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    router.push(`/productos?search=${encodeURIComponent(q)}`)
    setSearchQuery("")
    setSearchOpen(false)
    setIsMobileMenuOpen(false)
  }

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [searchOpen])

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data)
        if (data.apiUrl && data.storeId) {
          fetch(`${data.apiUrl}/api/public/store/${data.storeId}/categories`)
            .then((res) => res.json())
            .then((cats) => setCategories(cats))
            .catch(console.error)
        }
      })
  }, [])

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cart bounce animation when items change
  useEffect(() => {
    if (totalItems > prevTotalItems.current) {
      setCartBounce(true)
      setTimeout(() => setCartBounce(false), 300)
    }
    prevTotalItems.current = totalItems
  }, [totalItems])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!config) return null

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src={config.branding.logo || "/placeholder.svg"} 
              alt={config.business.name} 
              className="h-8 transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            {categories.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary group"
                >
                  Categorías
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} 
                  />
                </button>
                <div 
                  className={`absolute left-0 top-full mt-2 min-w-[220px] rounded-xl border border-border bg-background p-2 shadow-xl transition-all duration-200 origin-top ${
                    isDropdownOpen 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                >
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/productos?categoria=${category._id}`}
                      className="block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                  <div className="my-1.5 border-t border-border" />
                  <Link
                    href="/productos"
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Ver todos los productos →
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Search */}
          <div className="hidden md:flex items-center">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-200">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-64 h-9 text-sm"
                  onKeyDown={(e) => { if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(""); } }}
                />
                <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => { setSearchOpen(!searchOpen); }}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          {isAuthenticated && customer ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <UserCheck className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{customer.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/cuenta">
                    <User className="mr-2 h-4 w-4" />
                    Mi cuenta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cuenta/pedidos">
                    <Package className="mr-2 h-4 w-4" />
                    Mis pedidos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cuenta/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}

          {/* Cart Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={`relative transition-transform duration-200 ${cartBounce ? 'scale-110' : 'scale-100'}`}
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span 
                className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg transition-transform duration-200 ${
                  cartBounce ? 'animate-bounce' : ''
                }`}
              >
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Button>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-2 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-9 text-sm"
              autoFocus
            />
            <Button type="submit" size="sm" disabled={!searchQuery.trim()}>
              <Search className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[340px]">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="flex items-center gap-3">
              <img 
                src={config.branding.logo || "/placeholder.svg"} 
                alt={config.business.name} 
                className="h-7" 
              />
              <span className="font-semibold">{config.business.name}</span>
            </SheetTitle>
          </SheetHeader>
          
          <nav className="flex flex-col gap-1 py-6">
            {/* Inicio */}
            <SheetClose asChild>
              <Link 
                href="/" 
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                Inicio
              </Link>
            </SheetClose>

            {/* Todos los productos */}
            <SheetClose asChild>
              <Link 
                href="/productos" 
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                Todos los productos
              </Link>
            </SheetClose>

            {/* Categorías */}
            {categories.length > 0 && (
              <>
                <div className="my-3 border-t border-border" />
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Categorías
                </div>
                {categories.map((category) => (
                  <SheetClose asChild key={category._id}>
                    <Link
                      href={`/productos?categoria=${category._id}`}
                      className="flex items-center gap-3 rounded-xl px-4 py-2.5 pl-6 text-sm transition-colors hover:bg-muted"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary/40" />
                      {category.name}
                    </Link>
                  </SheetClose>
                ))}
              </>
            )}
          </nav>

          {/* User Section for Mobile */}
          <div className="border-t border-border pt-4">
            {isAuthenticated && customer ? (
              <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Mi cuenta
                </div>
                <SheetClose asChild>
                  <Link
                    href="/cuenta"
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/40" />
                    Mi perfil
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/cuenta/pedidos"
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/40" />
                    Mis pedidos
                  </Link>
                </SheetClose>
                <button
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-muted w-full text-left text-destructive"
                >
                  <span className="w-2 h-2 rounded-full bg-destructive/40" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="px-4">
                <SheetClose asChild>
                  <Button asChild className="w-full" size="sm">
                    <Link href="/cuenta/login">
                      <User className="mr-2 h-4 w-4" />
                      Iniciar sesión
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            )}
          </div>

          {/* Footer del menú móvil */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-muted/30 p-4">
            <div className="text-sm text-center space-y-1">
              {config.business.phone && (
                <a 
                  href={`tel:${config.business.phone}`} 
                  className="block font-medium text-primary hover:underline"
                >
                  📞 {config.business.phone}
                </a>
              )}
              {config.business.email && (
                <p className="text-xs text-muted-foreground">{config.business.email}</p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
