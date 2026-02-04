# E-commerce Template - Sistema POS

## Información Básica

- **Versión**: 0.1.0
- **Última actualización**: 2025-10-15
- **Estado**: Desarrollo activo

## Descripción

Template de tienda online moderna y personalizable construido con Next.js 15 y React 19. Funciona como escaparate digital para comercios que usan el sistema POS MIDDAS, permitiendo vender productos online de manera profesional.

Consume la API pública del backend para catálogo, configuración (colores, logo) y procesamiento de pedidos. Optimizado para SEO, performance y UX, con soporte para modo oscuro y validación robusta de formularios.

## Propósito y Alcance

### Responsabilidades

- Catálogo de productos con imágenes, precios, descripciones
- Carrito de compras con persistencia (localStorage)
- Checkout con formulario de datos y envío
- Integración con Backend API (productos, config, pedidos)
- Personalización multi-tenant (colores, logo por tienda)
- SEO optimizado (metadata, sitemap, robots.txt)
- Server-side rendering (SSR)
- Tema claro/oscuro (next-themes)
- Responsive design (móvil, tablet, desktop)
- Validación de formularios (React Hook Form + Zod)

### Fuera de Alcance

- Backend API (lógica de negocio)
- Procesamiento de pagos directo (via backend)
- Panel de administración (proyecto separado)
- Gestión de inventario (backend)
- Sistema de usuarios/cuentas
- Historial de pedidos

## Tech Stack

Ver detalle completo en [`DEPENDENCIES.md`](./DEPENDENCIES.md)

### Core
- Next.js 15 (App Router)
- React 19
- TypeScript 5

### UI
- TailwindCSS 4
- Radix UI (19 componentes)
- Lucide Icons

### Forms
- React Hook Form 7
- Zod 3

### State
- Zustand (carrito)

### Analytics
- Vercel Analytics

## Estructura

```
/middas-ecommerce-template1
├── /app                 # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home
│   ├── /products        # Productos
│   ├── /cart            # Carrito
│   └── /checkout        # Checkout
│
├── /components          # Componentes React
│   ├── /ui             # Base (Radix UI)
│   ├── /layout         # Header, Footer
│   ├── /products       # ProductCard, ProductGrid
│   └── /cart           # Cart components
│
├── /lib                 # Utilidades
│   ├── api.ts          # Cliente API
│   ├── utils.ts        # Helpers
│   ├── store-config.ts # Config types
│   └── validations.ts  # Zod schemas
│
├── /hooks               # Custom hooks
│   ├── use-cart.ts
│   └── use-products.ts
│
└── /public
    └── /config
        └── store-config.json  # Configuración
```

## Inicio Rápido

### Prerequisitos

```bash
Node.js >= 18.18.0
npm >= 9.0.0
Backend corriendo en http://localhost:5000
```

### Instalación y Ejecución

```bash
cd middas-ecommerce-template1
npm install

# Crear .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STORE_URL=mi-tienda-online

# Desarrollo
npm run dev  # http://localhost:3000

# Producción
npm run build
npm start
```

## Variables de Entorno

### Requeridas

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # URL backend
NEXT_PUBLIC_STORE_URL=mi-tienda-online         # Slug único
```

### Opcionales

```bash
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=  # Analytics
NEXT_PUBLIC_GA_ID=                # Google Analytics
NEXT_PUBLIC_SENTRY_DSN=           # Error tracking
```

**Nota**: Variables `NEXT_PUBLIC_*` expuestas al cliente

## Relaciones con Otros Proyectos

### Consume de

**Backend API** (`../backend`)
- **Endpoints públicos** (sin auth):
  - `GET /api/public/store/:storeUrl/config`
  - `GET /api/public/store/:storeUrl/products`
  - `POST /api/public/store/:storeUrl/orders`
- **Base URL**: `NEXT_PUBLIC_API_URL`
- **Store URL**: `NEXT_PUBLIC_STORE_URL`
- **Crítico**: SÍ

**Flujo**:
1. Template inicia con `NEXT_PUBLIC_STORE_URL=mi-tienda`
2. Fetch config → logo, colores, nombre
3. Fetch products → catálogo
4. POST orders → crear pedido

### Proporciona a

**Clientes finales (compradores)**
- Interfaz de compra online

## Características

### Personalización Multi-Tenant
- Configuración dinámica desde backend
- Cada instancia única (mismo código)
- Deploy independiente por comercio

### Catálogo
- Grid responsive
- Filtros (categoría, precio, marca)
- Búsqueda en tiempo real
- Detalle con galería de imágenes

### Carrito
- Agregar/quitar productos
- Actualizar cantidades
- Persistencia (localStorage)
- Drawer lateral
- Cálculo de totales

### Checkout
- Formulario multi-paso
- Validación con Zod
- Resumen de pedido
- Integración MercadoPago (via backend)

### SEO
- Metadata dinámica
- Open Graph tags
- Sitemap XML automático
- Structured data (JSON-LD)

### Performance
- Server-side rendering
- Static generation
- Image optimization (Next.js Image)
- Lazy loading
- Code splitting

### Dark Mode
- Tema claro/oscuro
- Persistencia de preferencia
- Smooth transitions

---

**Ver también**:
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) - Componentes, flujos, patrones
- [`DEPENDENCIES.md`](./DEPENDENCIES.md) - Paquetes y versiones
- [`DEVELOPMENT.md`](./DEVELOPMENT.md) - Guía de desarrollo
- [`../backend/docs/API_SPEC.md`](../../backend/docs/API_SPEC.md) - Endpoints backend

**Última actualización**: 2025-10-15
