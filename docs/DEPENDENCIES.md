# Dependencias - E-commerce Template Sistema POS

## Dependencias de Producción

### Core Framework

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| next | 15.2.4 | Framework React con SSR, App Router |
| react | ^19 | Librería UI |
| react-dom | ^19 | React DOM renderer |

### Styling

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| tailwindcss | ^4.1.9 | Utility-first CSS framework |
| @tailwindcss/postcss | ^4.1.9 | PostCSS integration |
| tailwindcss-animate | ^1.0.7 | Animaciones CSS |

### UI Components

**Radix UI** (19 paquetes): Componentes headless con accesibilidad:
- accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, select, tabs, toast, tooltip, etc.
- Propósito: UI accesible con keyboard navigation y ARIA

Ver `package.json` para lista completa de versiones

### Forms y Validación

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| react-hook-form | ^7.60.0 | Form state management |
| @hookform/resolvers | ^3.10.0 | Resolvers para validación |
| zod | 3.25.76 | Schema validation |

### UI Utilities

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| class-variance-authority | ^0.7.1 | Component variants |
| clsx | ^2.1.1 | Conditional classNames |
| tailwind-merge | ^2.5.5 | Merge Tailwind classes |
| lucide-react | ^0.454.0 | Iconos SVG |

### Componentes Adicionales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| cmdk | 1.0.4 | Command palette |
| embla-carousel-react | 8.5.1 | Carousels |
| vaul | ^0.9.9 | Drawer component |
| sonner | ^1.7.4 | Toast notifications |

### Utilidades

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| date-fns | 4.1.0 | Manipulación de fechas |
| react-day-picker | 9.8.0 | Date picker |
| next-themes | ^0.4.6 | Dark mode support |
| recharts | 2.15.4 | Gráficos |

### Fonts y Analytics

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| geist | ^1.3.1 | Vercel Geist font |
| @vercel/analytics | latest | Vercel Analytics |

---

## Dependencias de Desarrollo

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| typescript | ^5 | TypeScript compiler |
| @types/node | ^22 | Node.js types |
| @types/react | ^19 | React types |
| @types/react-dom | ^19 | React DOM types |
| postcss | ^8.5 | CSS transformations |

---

## Dependencias Entre Proyectos

### Depende de

**Backend API** (`../backend`)
- Versión API: v1 (endpoints públicos)
- Endpoints críticos:
  - `GET /api/public/store/:storeUrl/config`
  - `GET /api/public/store/:storeUrl/products`
  - `POST /api/public/store/:storeUrl/orders`
- Configuración: `NEXT_PUBLIC_API_URL` + `NEXT_PUBLIC_STORE_URL`
- **Crítico**: SÍ - No funciona sin backend

---

## Dependencias Críticas

⚠️ **No actualizar sin testing exhaustivo**:

| Paquete | Impacto | Recomendación |
|---------|---------|---------------|
| next | Next.js 15 reciente con cambios | Revisar breaking changes |
| react | React 19 muy reciente | Algunos paquetes pueden no soportarlo |
| tailwindcss | Tailwind 4 breaking changes vs v3 | Verificar plugins |
| radix-ui | Múltiples paquetes interdependientes | Mantener sincronizados |
| zod | Cambios en schema rompen validaciones | Verificar tipos |

---

## Estrategia de Actualización

| Tipo | Testing | Deployment | Frecuencia |
|------|---------|------------|-----------|
| **Patches** (x.y.Z) | Smoke tests | Directo a prod | Semanal |
| **Minor** (x.Y.z) | Funcionalidad principal | Staging → Prod | Mensual |
| **Major** (X.y.z) | Exhaustivo + regresión | Feature → QA → Staging → Prod | Semestral |

**Comando**:
```bash
ncu -u        # Ver actualizaciones
npm install   # Aplicar
```

---

## Vulnerabilidades

**Política**:
- **Critical**: Fix inmediato (<24h)
- **High**: Fix en 48h
- **Moderate**: Próximo sprint
- **Low**: Próximo release

```bash
npm audit
npm audit fix
```

---

## Compatibilidad

### Requirements
- Node.js >= 18.18.0
- React 18.2+ o 19+
- Tailwind 3+ o 4+

### Browsers
- Chrome/Edge: últimas 2 versiones
- Firefox: últimas 2 versiones
- Safari: últimas 2 versiones
- NO soporta IE11

---

## Bundle Size

**Producción (gzipped)**:
- First Load JS: ~200 KB
  - Next.js runtime: ~80 KB
  - React + React DOM: ~120 KB
  - App code: ~50 KB

**Optimizaciones**:
- Tree shaking automático
- Code splitting por ruta
- Dynamic imports
- Image optimization

---

## Radix UI

### Ventajas
- Solo instalas componentes que usas
- Actualizaciones granulares
- Tree-shaking efectivo

### Actualizar
```bash
npm update @radix-ui/react-*
```

---

## Alternativas Consideradas

| Decisión | Alternativa | Por qué no |
|----------|-------------|------------|
| **Next.js** vs Vite | Vite más rápido en dev | Next.js mejor para SSR/SEO |
| **Radix** vs Headless UI | Menos componentes | Radix más completo |
| **React Hook Form** vs Formik | Más verbose | RHF mejor performance |
| **Zod** vs Yup | Similar API | Zod mejor TypeScript |

---

## Dependencias Futuras

### Testing
```json
{
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.0.0",
  "playwright": "^1.40.0"
}
```

### State (si escala)
```json
{
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.17.0"
}
```

### Analytics
```json
{
  "@sentry/nextjs": "^8.0.0",
  "posthog-js": "^1.100.0"
}
```

---

**Última actualización**: 2025-10-15
