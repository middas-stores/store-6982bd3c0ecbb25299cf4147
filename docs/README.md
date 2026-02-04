# MIDDAS E-commerce Template

## Propósito

Template de e-commerce moderno y completamente configurable diseñado para crear tiendas online personalizables. Se integra con el sistema MIDDAS (POS) y permite que cada comercio tenga su propia tienda con identidad visual única.

### Características

- **Configurable**: Aspecto visual, textos y settings desde archivo JSON
- **Temas Dinámicos**: Paletas de colores y tipografías en tiempo real
- **Responsive**: Móvil, tablet y desktop
- **Integración Backend**: API MIDDAS para productos, inventario, pedidos
- **SEO Optimizado**: Metadatos configurables
- **Carrito Completo**: Funcionalidad e-commerce total
- **WhatsApp Integration**: Pedidos directos

---

## Estructura

```
middas-ecommerce-template1/
├── app/                # Next.js App Router
│   ├── page.tsx        # Home (hero + productos destacados)
│   ├── productos/      # Catálogo
│   ├── layout.tsx      # Layout principal
│   └── globals.css     # Estilos globales
│
├── components/         # Componentes React
│   ├── ui/            # Componentes base (shadcn/ui)
│   ├── header.tsx
│   ├── footer.tsx
│   ├── product-card.tsx
│   └── cart-sidebar.tsx
│
├── contexts/          # Context API
│   └── cart-context.tsx
│
├── lib/               # Utilidades
│   ├── store-config.ts  # Types y función para config
│   ├── font-schemes.ts  # Esquemas de fuentes
│   ├── color-utils.ts   # Conversión HEX → OKLCH
│   └── api.ts           # Cliente API backend
│
├── public/config/
│   └── store-config.json # ⭐ CONFIGURACIÓN PRINCIPAL
│
└── docs/
    ├── README.md          # Este archivo
    └── ESTILOS.md         # Guía de estilos
```

---

## Configuración Principal

El archivo `public/config/store-config.json` contiene toda la personalización:

```json
{
  "storeId": "...",
  "apiUrl": "...",
  "business": {
    "name": "...",
    "description": "...",
    "phone": "...",
    "whatsapp": "...",
    "socialMedia": { "instagram": "...", "facebook": "..." }
  },
  "branding": {
    "logo": "...",
    "banner": "...",
    "colorScheme": {
      "name": "fresh",
      "primary": "#0066CC",
      "secondary": "#FFFFFF",
      "accent": "#00B4D8",
      "background": "#F0F7FF"
    },
    "typography": {
      "fontScheme": "modern",  // elegant | modern | classic
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
    "currency": "ARS"
  },
  "seo": {
    "title": "...",
    "description": "...",
    "keywords": []
  }
}
```

---

## Archivos Clave

### app/layout.tsx
- Layout principal
- Carga `store-config.json`
- Aplica esquema de fuentes
- Integra providers (Cart, DynamicColor, Theme)
- Genera metadatos SEO

### lib/color-utils.ts
- Convierte HEX → OKLCH
- Calcula contraste automático
- Genera paleta completa

### components/dynamic-color-provider.tsx
- Inyecta CSS dinámico en runtime
- Lee colores del store-config
- Crea variables CSS personalizadas

### lib/font-schemes.ts
- Tres esquemas: elegant, modern, classic
- Google Fonts (Playfair Display, Inter, Lora)

---

## Sistema de Colores

1. Colores en **HEX** en `store-config.json`
2. Conversión automática a **OKLCH** (Tailwind v4)
3. Contraste calculado automáticamente
4. Texto sobre fondos oscuros → blanco
5. Texto sobre fondos claros → oscuro

---

## Tipografía

**Esquemas disponibles**:
- **elegant**: Playfair Display + Inter
- **modern**: Inter (bold) + Inter
- **classic**: Lora + Merriweather

**Colores de texto** (opcional):
- heading, body, muted

**Defaults**: Si no se especifican, usa valores optimizados para legibilidad

---

## Carrito de Compras

- Estado global (CartContext)
- Persistencia en localStorage
- Funcionalidad: agregar, eliminar, cambiar cantidad
- Sidebar deslizable
- Envío por WhatsApp estructurado

---

## Integración Backend

- Conexión a API REST de MIDDAS
- Requiere `storeId` válido
- Imágenes desde S3 (URLs públicas)
- Productos filtrados por tienda (userId)

---

## Comandos

```bash
npm install              # Instalar
npm run dev              # Desarrollo
npm run build            # Build producción
npm start                # Producción
```

---

## Variables de Entorno

```bash
# .env.local (opcional)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STORE_ID=...
```

**Nota**: Todo está en `store-config.json`, las env vars son opcionales

---

## Extensibilidad

### Agregar Paletas de Colores
1. Editar `store-config.json` → `branding.colorScheme`
2. Definir primary, secondary, accent, background
3. Colores de texto calculados automáticamente

### Agregar Esquemas de Fuentes
1. Editar `lib/font-schemes.ts`
2. Agregar nuevo esquema con body/heading fonts
3. Importar fuentes desde `next/font/google`

### Personalizar Componentes UI
- Componentes en `components/ui/` (shadcn/ui)
- Copy-paste approach (no npm packages)
- Totalmente personalizables

---

## Tech Stack

- **Next.js**: 15 (App Router)
- **React**: 19
- **TypeScript**: 5
- **TailwindCSS**: v4
- **shadcn/ui**: Componentes
- **Lucide Icons**: Iconos
- **Vercel**: Deployment

Ver detalle completo en [`DEPENDENCIES.md`](./DEPENDENCIES.md)

---

**Última actualización**: 2025-10-15
