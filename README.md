# MIDDAS E-commerce Template

> Plantilla moderna de tienda online completamente configurable para el sistema MIDDAS POS

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

## Descripción del Proyecto

Esta es una plantilla de e-commerce moderna y completamente configurable diseñada para funcionar como tienda online de clientes del sistema MIDDAS (Sistema de punto de venta y gestión de inventario). Permite que cada comercio tenga su propia tienda online con identidad visual única, sin necesidad de modificar código.

### Características Principales

- **Totalmente Configurable**: Todo el aspecto visual, textos y configuraciones se manejan desde un archivo JSON
- **Sistema de Colores Dinámico**: Paletas de colores configurables con conversión automática a OKLCH y cálculo de contraste
- **Tipografía Personalizable**: 3 esquemas de fuentes predefinidos (elegant, modern, classic)
- **Responsive Design**: Optimizado para móviles, tablets y desktop con enfoque mobile-first
- **Integración con MIDDAS Backend**: Conexión directa con API REST para productos e inventario
- **SEO Optimizado**: Metadatos dinámicos, Open Graph y Twitter Cards
- **Carrito de Compras**: Funcionalidad completa con persistencia en localStorage
- **Pedidos por WhatsApp**: Generación automática de mensajes de pedido
- **Multi-tenant**: Cada tienda es completamente independiente por `storeId`

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15.2.4 | Framework React con App Router y SSR |
| **React** | 19 | Biblioteca de UI con componentes modernos |
| **TypeScript** | 5 | Tipado estático para mayor seguridad |
| **Tailwind CSS** | 4.1.9 | Framework CSS utility-first |
| **shadcn/ui** | latest | Componentes UI accesibles basados en Radix UI |
| **Lucide React** | 0.454.0 | Biblioteca de iconos SVG |
| **Vercel Analytics** | latest | Análisis de tráfico y performance |
| **React Hook Form** | 7.60.0 | Gestión de formularios |
| **Zod** | 3.25.76 | Validación de esquemas |

---

## Inicio Rápido

### Requisitos Previos

- Node.js 18+
- npm, yarn o pnpm
- Conexión al backend de MIDDAS (API REST)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-organizacion/middas-ecommerce-template1.git
cd middas-ecommerce-template1

# Instalar dependencias
npm install

# Configurar la tienda
# Edita public/config/store-config.json con la información de tu negocio

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles

```bash
npm run dev       # Inicia servidor de desarrollo con hot-reload
npm run build     # Genera build optimizado para producción
npm start         # Inicia servidor de producción
npm run lint      # Ejecuta ESLint para verificar código
```

---

## Configuración de la Tienda

Toda la configuración de la tienda se realiza en el archivo:

```
public/config/store-config.json
```

### Estructura de Configuración

```json
{
  "storeId": "ID_DE_USUARIO_EN_MIDDAS",
  "apiUrl": "https://api.middas.com",

  "business": {
    "name": "Nombre del Negocio",
    "description": "Descripción del negocio",
    "address": "Dirección física",
    "phone": "Teléfono de contacto",
    "whatsapp": "+5491112345678",
    "email": "contacto@negocio.com",
    "socialMedia": {
      "instagram": "https://instagram.com/usuario",
      "facebook": "https://facebook.com/pagina"
    }
  },

  "branding": {
    "logo": "https://url-del-logo.png",
    "banner": "https://url-del-banner.jpg",
    "bannerTitle": "Título principal del hero",
    "bannerSubtitle": "Subtítulo descriptivo",

    "colorScheme": {
      "name": "fresh",
      "primary": "#0066CC",
      "secondary": "#FFFFFF",
      "accent": "#00B4D8",
      "background": "#F0F7FF"
    },

    "typography": {
      "fontScheme": "modern",
      "colors": {
        "heading": "#1a1a1a",
        "body": "#2d2d2d",
        "muted": "#6b7280"
      }
    }
  },

  "settings": {
    "showStock": true,
    "allowOrders": true,
    "orderMethod": "whatsapp",
    "showPrices": true,
    "currency": "ARS",
    "currencySymbol": "$"
  },

  "seo": {
    "title": "Tienda - Slogan",
    "description": "Descripción para motores de búsqueda",
    "keywords": ["palabra1", "palabra2"]
  }
}
```

Para más detalles, consulta [CONFIGURACION_TIENDA.md](CONFIGURACION_TIENDA.md)

---

## Estructura del Proyecto

```
middas-ecommerce-template1/
├── app/                          # App Router de Next.js 15
│   ├── layout.tsx                # Layout raíz con providers y metadatos
│   ├── page.tsx                  # Página principal (hero + productos destacados)
│   ├── productos/
│   │   └── page.tsx              # Catálogo completo de productos
│   └── globals.css               # Variables CSS y estilos globales
│
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base de shadcn/ui
│   │   ├── button.tsx            # Botón con variantes
│   │   ├── card.tsx              # Tarjetas de contenido
│   │   ├── input.tsx             # Campos de entrada
│   │   └── ...                   # 40+ componentes UI
│   │
│   ├── header.tsx                # Header con navegación y carrito
│   ├── footer.tsx                # Footer con información de contacto
│   ├── product-card.tsx          # Tarjeta individual de producto
│   ├── cart-sidebar.tsx          # Sidebar del carrito de compras
│   ├── dynamic-color-provider.tsx # Provider para colores dinámicos
│   └── theme-provider.tsx        # Provider de next-themes
│
├── contexts/                     # Context API
│   └── cart-context.tsx          # Estado global del carrito
│
├── hooks/                        # Custom React Hooks
│   ├── use-mobile.ts             # Detección de dispositivos móviles
│   └── use-toast.ts              # Sistema de notificaciones toast
│
├── lib/                          # Utilidades y helpers
│   ├── store-config.ts           # Types y función para leer configuración
│   ├── font-schemes.ts           # Esquemas de fuentes (elegant/modern/classic)
│   ├── color-utils.ts            # Conversión HEX → OKLCH y cálculo de contraste
│   ├── api.ts                    # Cliente HTTP para backend MIDDAS
│   └── utils.ts                  # Utilidades generales (cn, clsx)
│
├── public/
│   └── config/
│       └── store-config.json     # ⭐ CONFIGURACIÓN PRINCIPAL
│
├── docs/                         # Documentación
│   ├── README.md                 # Visión general (deprecado, usa raíz)
│   └── ESTILOS.md                # Guía de sistema de estilos
│
├── .github/
│   └── workflows/
│       └── update-config.yml     # Workflow para actualizar configuración
│
├── next.config.mjs               # Configuración de Next.js
├── tsconfig.json                 # Configuración de TypeScript
├── tailwind.config.js            # Configuración de Tailwind (deprecado, usa v4)
├── postcss.config.mjs            # Configuración de PostCSS
├── vercel.json                   # Configuración para Vercel
└── package.json                  # Dependencias y scripts
```

---

## Características Técnicas Destacadas

### Sistema de Colores Dinámico

El template utiliza un sistema avanzado de gestión de colores:

1. **Entrada**: Colores en formato HEX (`#0066CC`)
2. **Conversión**: Transformación automática a espacio de color OKLCH
3. **Contraste**: Cálculo automático de colores de texto para máxima legibilidad
4. **Aplicación**: Inyección de variables CSS en runtime

```typescript
// lib/color-utils.ts
hexToOklch("#0066CC") // → "oklch(0.543 0.156 251.234)"
```

**Ventajas**:
- Cumple con estándares WCAG 2.1 de accesibilidad
- Texto blanco automático en fondos oscuros
- Texto oscuro automático en fondos claros
- Paleta consistente generada desde 4 colores base

Ver [docs/ESTILOS.md](docs/ESTILOS.md) para detalles completos.

### Integración con Backend MIDDAS

La comunicación con el backend se realiza mediante endpoints públicos:

```typescript
// lib/api.ts
GET /api/public/store/:storeId/products
```

**Flujo de datos**:
1. Template lee `storeId` desde `store-config.json`
2. Realiza fetch a API con `storeId` como parámetro
3. Backend filtra productos por `userId` (multi-tenant)
4. Template renderiza productos con imágenes desde S3

**Transformación de datos**:
```typescript
ApiProduct (backend) → Product (frontend)
- _id → id
- image.url → image
- category.name → category
```

### Carrito de Compras

Implementación completa con Context API:

```typescript
// contexts/cart-context.tsx
interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
}
```

**Características**:
- Persistencia en `localStorage`
- Actualización en tiempo real
- Control de stock disponible
- Generación de mensaje WhatsApp formateado

### SEO y Metadatos

Generación dinámica de metadatos en el servidor:

```typescript
// app/layout.tsx
export async function generateMetadata(): Promise<Metadata> {
  const config = await getStoreConfig()
  return {
    title: config.seo.title,
    description: config.seo.description,
    openGraph: { /* ... */ },
    twitter: { /* ... */ }
  }
}
```

**Incluye**:
- Title y description personalizados
- Open Graph para redes sociales
- Twitter Cards
- Keywords para SEO

---

## Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Configuración en Vercel**:
- Framework Preset: Next.js
- Build Command: `npm run build`
- Install Command: `npm install --legacy-peer-deps`
- Output Directory: `.next`

### Otras Plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js 15:

- **Netlify**: Usar plugin de Next.js
- **AWS Amplify**: Configurar build settings
- **Docker**: Crear Dockerfile con Node.js 18+

### Variables de Entorno

El template **NO requiere** variables de entorno obligatorias. Todo se configura en `store-config.json`.

Opcionalmente, puedes usar:

```env
# .env.local (opcional)
NEXT_PUBLIC_API_URL=https://api.middas.com
NEXT_PUBLIC_STORE_ID=68e03cde5f3018eaef75750b
```

---

## Documentación Adicional

| Documento | Descripción |
|-----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitectura detallada del sistema |
| [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) | Guía de desarrollo y buenas prácticas |
| [API_INTEGRATION.md](API_INTEGRATION.md) | Integración con backend MIDDAS |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Guía de despliegue a producción |
| [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) | Catálogo de componentes UI |
| [CONFIGURACION_TIENDA.md](CONFIGURACION_TIENDA.md) | Guía de configuración de la tienda |
| [docs/ESTILOS.md](docs/ESTILOS.md) | Sistema de colores y tipografía |

---

## Roadmap

### Versión Actual (v0.1.0)

- [x] Configuración dinámica desde JSON
- [x] Sistema de colores con OKLCH
- [x] 3 esquemas de fuentes
- [x] Carrito de compras
- [x] Pedidos por WhatsApp
- [x] SEO optimizado
- [x] Integración con MIDDAS API

### Próximas Versiones

- [ ] Filtros de productos por categoría
- [ ] Búsqueda de productos
- [ ] Sistema de favoritos
- [ ] Página de producto individual
- [ ] Integración con Mercado Pago
- [ ] Tracking de pedidos
- [ ] Sistema de reviews
- [ ] Multi-idioma
- [ ] Modo oscuro dinámico

---

## Contribución

Este template es parte del ecosistema MIDDAS. Para reportar problemas o sugerir mejoras:

1. Crear un issue en el repositorio
2. Describir el problema o mejora
3. Incluir capturas de pantalla si aplica
4. Esperar respuesta del equipo de desarrollo

---

## Licencia

Propiedad de MIDDAS. Todos los derechos reservados.

---

## Soporte

Para soporte técnico o consultas:

- **Email**: maticamisay99@gmail.com
- **Documentación**: Ver carpeta `/docs`
- **Issues**: GitHub Issues del repositorio

---

**Desarrollado con ❤️ para el ecosistema MIDDAS**
